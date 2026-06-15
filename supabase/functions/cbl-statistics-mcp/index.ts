import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SERVER_INFO = { name: "CBL Statistics MCP", version: "1.0.0" };
const PROTOCOL_VERSION = "2025-06-18";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version",
};

// JSON-RPC 2.0 error codes
const PARSE_ERROR     = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS  = -32602;
const INTERNAL_ERROR  = -32603;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ToolResult = { content: Array<{ type: "text"; text: string }> };

class RpcError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

function textContent(data: unknown): ToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function requireString(
  args: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = args?.[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new RpcError(INVALID_PARAMS, `"${key}" is required and must be a non-empty string.`);
  }
  return value;
}

function optionalInt(
  args: Record<string, unknown> | undefined,
  key: string,
  defaultVal: number,
): number {
  const v = args?.[key];
  if (v === undefined || v === null) return defaultVal;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1) {
    throw new RpcError(INVALID_PARAMS, `"${key}" must be a positive integer.`);
  }
  return n;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function rpcResult(id: unknown, result: unknown): Response {
  return jsonResponse({ jsonrpc: "2.0", id, result });
}

function rpcError(id: unknown, code: number, message: string): Response {
  return jsonResponse({ jsonrpc: "2.0", id, error: { code, message } });
}

// ---------------------------------------------------------------------------
// Tool catalogue
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "list_databanks",
    description:
      "Lists all CBL statistical databanks (EXR, CPI, MON, FIS, INR, INT, BOP, NAT, PRO, POP) with their names and series counts.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_series",
    description:
      "Lists all series within a given CBL databank, including mnemonic, name, unit, and frequency.",
    inputSchema: {
      type: "object",
      properties: {
        databank: {
          type: "string",
          description: "Databank code, e.g. EXR, CPI, MON, FIS, INR, INT, BOP, NAT, PRO, POP.",
        },
      },
      required: ["databank"],
    },
  },
  {
    name: "get_series",
    description:
      "Returns metadata and the most recent observations for a CBL series by mnemonic.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: {
          type: "string",
          description: "CBL mnemonic, e.g. LBR_EXR_EPR_1.",
        },
        limit: {
          type: "number",
          description: "Number of most recent observations to return (default 24).",
        },
      },
      required: ["mnemonic"],
    },
  },
  {
    name: "latest_exchange_rate",
    description:
      "Returns the latest USD/LRD exchange rate from the Central Bank of Liberia (end-of-period and period average).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "exchange_rate_history",
    description: "Returns monthly USD/LRD exchange rate history from the CBL.",
    inputSchema: {
      type: "object",
      properties: {
        months: {
          type: "number",
          description: "Number of months of history to return (default 24, max 120).",
        },
      },
    },
  },
  {
    name: "latest_inflation",
    description:
      "Returns the most recent Liberia CPI (Consumer Price Index) reading with year-on-year change.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "inflation_history",
    description: "Returns monthly CPI history for Liberia from the CBL.",
    inputSchema: {
      type: "object",
      properties: {
        months: {
          type: "number",
          description: "Number of months of history to return (default 24, max 120).",
        },
      },
    },
  },
  {
    name: "search_series",
    description: "Search CBL series by keyword across name, databank, and unit fields.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword to search for.",
        },
      },
      required: ["query"],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

async function callTool(
  name: string,
  args: Record<string, unknown> | undefined,
): Promise<ToolResult> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  switch (name) {
    // ── list_databanks ────────────────────────────────────────────────────
    case "list_databanks": {
      const { data, error } = await supabase
        .from("cbl_series")
        .select("databank, databank_name")
        .order("databank");

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);

      // Aggregate counts client-side (no GROUP BY in PostgREST without RPC)
      const map = new Map<string, { databank_name: string; count: number }>();
      for (const row of data ?? []) {
        const existing = map.get(row.databank);
        if (existing) {
          existing.count++;
        } else {
          map.set(row.databank, { databank_name: row.databank_name ?? row.databank, count: 1 });
        }
      }
      const result = Array.from(map.entries()).map(([databank, v]) => ({
        databank,
        databank_name: v.databank_name,
        series_count: v.count,
      }));
      return textContent(result);
    }

    // ── list_series ───────────────────────────────────────────────────────
    case "list_series": {
      const databank = requireString(args, "databank").toUpperCase();

      const { data, error } = await supabase
        .from("cbl_series")
        .select("mnemonic, name_of_series, unit_of_measure, frequency, first_observation")
        .eq("databank", databank)
        .order("mnemonic");

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      if (!data?.length) {
        throw new RpcError(INVALID_PARAMS, `No series found for databank "${databank}".`);
      }
      return textContent(data);
    }

    // ── get_series ────────────────────────────────────────────────────────
    case "get_series": {
      const mnemonic = requireString(args, "mnemonic").toUpperCase();
      const limit = Math.min(optionalInt(args, "limit", 24), 120);

      const { data: meta, error: metaErr } = await supabase
        .from("cbl_series")
        .select("*")
        .eq("mnemonic", mnemonic)
        .single();

      if (metaErr) throw new RpcError(INTERNAL_ERROR, metaErr.message);

      const { data: obs, error: obsErr } = await supabase
        .from("cbl_observations")
        .select("period_date, period_label, value")
        .eq("mnemonic", mnemonic)
        .order("period_date", { ascending: false })
        .limit(limit);

      if (obsErr) throw new RpcError(INTERNAL_ERROR, obsErr.message);

      return textContent({ ...meta, observations: (obs ?? []).reverse() });
    }

    // ── latest_exchange_rate ──────────────────────────────────────────────
    case "latest_exchange_rate": {
      const mnemonics = ["LBR_EXR_EPR_1", "LBR_EXR_PAR_1"];

      const results = await Promise.all(
        mnemonics.map(async (mnemonic) => {
          const { data: meta } = await supabase
            .from("cbl_series")
            .select("name_of_series, unit_of_measure")
            .eq("mnemonic", mnemonic)
            .single();

          const { data: obs } = await supabase
            .from("cbl_observations")
            .select("period_date, period_label, value")
            .eq("mnemonic", mnemonic)
            .not("value", "is", null)
            .neq("value", 0)
            .order("period_date", { ascending: false })
            .limit(1)
            .single();

          return {
            mnemonic,
            name: meta?.name_of_series ?? mnemonic,
            unit: meta?.unit_of_measure ?? "Per USD",
            period: obs?.period_label ?? null,
            period_date: obs?.period_date ?? null,
            value: obs?.value ?? null,
          };
        }),
      );

      return textContent({ currency_pair: "USD/LRD", rates: results });
    }

    // ── exchange_rate_history ─────────────────────────────────────────────
    case "exchange_rate_history": {
      const months = Math.min(optionalInt(args, "months", 24), 120);

      const { data, error } = await supabase
        .from("cbl_observations")
        .select("period_date, period_label, value")
        .eq("mnemonic", "LBR_EXR_EPR_1")
        .not("value", "is", null)
        .neq("value", 0)
        .order("period_date", { ascending: false })
        .limit(months);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);

      return textContent({
        mnemonic: "LBR_EXR_EPR_1",
        series: "USD/LRD Market Rate End of Period",
        unit: "LRD per 1 USD",
        observations: (data ?? []).reverse(),
      });
    }

    // ── latest_inflation ──────────────────────────────────────────────────
    case "latest_inflation": {
      // LBR_CPI_0 = Harmonized CPI
      const { data, error } = await supabase
        .from("cbl_observations")
        .select("period_date, period_label, value")
        .eq("mnemonic", "LBR_CPI_0")
        .not("value", "is", null)
        .neq("value", 0)
        .order("period_date", { ascending: false })
        .limit(13); // 13 = latest + 12 months ago for YoY

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);

      const obs = data ?? [];
      const latest = obs[0] ?? null;
      const yearAgo = obs[12] ?? null;

      const yoy =
        latest?.value && yearAgo?.value
          ? Number((((latest.value - yearAgo.value) / yearAgo.value) * 100).toFixed(2))
          : null;

      return textContent({
        mnemonic: "LBR_CPI_0",
        series: "Harmonized Consumer Price Index",
        latest: latest
          ? { period: latest.period_label, period_date: latest.period_date, value: latest.value }
          : null,
        year_ago: yearAgo
          ? { period: yearAgo.period_label, period_date: yearAgo.period_date, value: yearAgo.value }
          : null,
        yoy_change_pct: yoy,
      });
    }

    // ── inflation_history ─────────────────────────────────────────────────
    case "inflation_history": {
      const months = Math.min(optionalInt(args, "months", 24), 120);

      const { data, error } = await supabase
        .from("cbl_observations")
        .select("period_date, period_label, value")
        .eq("mnemonic", "LBR_CPI_0")
        .not("value", "is", null)
        .neq("value", 0)
        .order("period_date", { ascending: false })
        .limit(months);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);

      return textContent({
        mnemonic: "LBR_CPI_0",
        series: "Harmonized Consumer Price Index",
        observations: (data ?? []).reverse(),
      });
    }

    // ── search_series ─────────────────────────────────────────────────────
    case "search_series": {
      const query = requireString(args, "query");

      const { data, error } = await supabase
        .from("cbl_series")
        .select("mnemonic, databank, name_of_series, unit_of_measure, frequency")
        .or(
          `name_of_series.ilike.%${query}%,databank_name.ilike.%${query}%,unit_of_measure.ilike.%${query}%`,
        )
        .order("databank")
        .limit(30);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    default:
      throw new RpcError(METHOD_NOT_FOUND, `Unknown tool: ${name}`);
  }
}

// ---------------------------------------------------------------------------
// JSON-RPC dispatch
// ---------------------------------------------------------------------------

async function handleRpc(message: Record<string, unknown>): Promise<Response | null> {
  const { id, method, params } = message as {
    id?: unknown;
    method?: string;
    params?: Record<string, unknown>;
  };

  const isNotification = id === undefined || id === null;

  try {
    switch (method) {
      case "initialize":
        return rpcResult(id, {
          protocolVersion: (params?.protocolVersion as string) ?? PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        });

      case "notifications/initialized":
      case "notifications/cancelled":
        return null;

      case "ping":
        return rpcResult(id, {});

      case "tools/list":
        return rpcResult(id, { tools: TOOLS });

      case "tools/call": {
        const name = params?.name as string;
        const toolArgs = params?.arguments as Record<string, unknown> | undefined;
        if (!name) return rpcError(id, INVALID_PARAMS, "Missing tool name.");
        try {
          const result = await callTool(name, toolArgs);
          return rpcResult(id, result);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          return rpcResult(id, { content: [{ type: "text", text: msg }], isError: true });
        }
      }

      default:
        if (isNotification) return null;
        return rpcError(id, METHOD_NOT_FOUND, `Unknown method: ${method}`);
    }
  } catch (err) {
    if (isNotification) return null;
    const code = err instanceof RpcError ? err.code : INTERNAL_ERROR;
    const msg = err instanceof Error ? err.message : String(err);
    return rpcError(id, code, msg);
  }
}

// ---------------------------------------------------------------------------
// Edge Function entrypoint
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method === "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return rpcError(null, PARSE_ERROR, "Invalid JSON payload.");
  }

  if (Array.isArray(payload)) {
    const responses: unknown[] = [];
    for (const msg of payload) {
      if (typeof msg !== "object" || msg === null) {
        responses.push({
          jsonrpc: "2.0",
          id: null,
          error: { code: INVALID_REQUEST, message: "Invalid request object." },
        });
        continue;
      }
      const res = await handleRpc(msg as Record<string, unknown>);
      if (res) responses.push(await res.json());
    }
    if (responses.length === 0) {
      return new Response(null, { status: 202, headers: CORS_HEADERS });
    }
    return jsonResponse(responses);
  }

  if (typeof payload !== "object" || payload === null) {
    return rpcError(null, INVALID_REQUEST, "Invalid request object.");
  }

  const response = await handleRpc(payload as Record<string, unknown>);
  return response ?? new Response(null, { status: 202, headers: CORS_HEADERS });
});
