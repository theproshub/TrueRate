import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SERVER_INFO = { name: "TrueRate MCP", version: "1.0.0" };
const PROTOCOL_VERSION = "2025-06-18";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version",
};

// JSON-RPC 2.0 error codes
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

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
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

function requireString(
  args: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = args?.[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new RpcError(
      INVALID_PARAMS,
      `"${key}" is required and must be a non-empty string.`,
    );
  }
  return value;
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
    name: "latest_articles",
    description:
      "Returns the 10 most recently published articles from TrueRate, including author name and category label, sorted by publish date descending.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_articles",
    description:
      "Search published articles by title, dek, or body content. Returns up to 20 matches with author and category.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Text to search for in article titles, deks, and body.",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_article",
    description: "Retrieve a single published article by its slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Article slug (URL-safe identifier).",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_categories",
    description: "Returns all content categories ordered by display_order.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "latest_content_cards",
    description:
      "Returns the 20 most recently published content cards (breaking news, big stats, market snapshots, etc.).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "latest_economic_release",
    description:
      "Returns the latest Liberia economic data release. (Placeholder — not yet implemented.)",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "latest_exchange_rate",
    description:
      "Returns the latest USD/LRD exchange rate. (Placeholder — not yet implemented.)",
    inputSchema: { type: "object", properties: {} },
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
    // ── latest_articles ──────────────────────────────────────────────────
    case "latest_articles": {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          slug,
          title,
          dek,
          published_at,
          authors(name),
          categories(label)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(10);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── search_articles ──────────────────────────────────────────────────
    case "search_articles": {
      const query = requireString(args, "query");

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          slug,
          title,
          dek,
          published_at,
          authors(name),
          categories(label)
        `)
        .eq("status", "published")
        .or(`title.ilike.%${query}%,dek.ilike.%${query}%,body.ilike.%${query}%`)
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── get_article ──────────────────────────────────────────────────────
    case "get_article": {
      const slug = requireString(args, "slug");

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          authors(name),
          categories(label)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── list_categories ──────────────────────────────────────────────────
    case "list_categories": {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── latest_content_cards ─────────────────────────────────────────────
    case "latest_content_cards": {
      const { data, error } = await supabase
        .from("content_cards")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);

      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── placeholders ─────────────────────────────────────────────────────
    case "latest_economic_release":
      return textContent({
        status: "placeholder",
        message: "Economic release data is not yet implemented.",
      });

    case "latest_exchange_rate":
      return textContent({
        status: "placeholder",
        message: "Exchange rate data is not yet implemented.",
      });

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

  // Notifications (no id) get no response body.
  const isNotification = id === undefined || id === null;

  try {
    switch (method) {
      case "initialize":
        return rpcResult(id, {
          protocolVersion:
            (params?.protocolVersion as string) ?? PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        });

      case "notifications/initialized":
      case "notifications/cancelled":
        return null; // acknowledged, no body

      case "ping":
        return rpcResult(id, {});

      case "tools/list":
        return rpcResult(id, { tools: TOOLS });

      case "tools/call": {
        const name = params?.name as string;
        const args = params?.arguments as Record<string, unknown> | undefined;
        if (!name) {
          return rpcError(id, INVALID_PARAMS, "Missing tool name.");
        }
        try {
          const result = await callTool(name, args);
          return rpcResult(id, result);
        } catch (err) {
          // Surface tool failures as isError results per MCP spec.
          const messageText =
            err instanceof Error ? err.message : String(err);
          return rpcResult(id, {
            content: [{ type: "text", text: messageText }],
            isError: true,
          });
        }
      }

      default:
        if (isNotification) return null;
        return rpcError(id, METHOD_NOT_FOUND, `Unknown method: ${method}`);
    }
  } catch (err) {
    if (isNotification) return null;
    const code = err instanceof RpcError ? err.code : INTERNAL_ERROR;
    const messageText = err instanceof Error ? err.message : String(err);
    return rpcError(id, code, messageText);
  }
}

// ---------------------------------------------------------------------------
// Edge Function entrypoint
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // GET is used by some clients to open an SSE stream; we are a stateless
  // request/response server, so signal that no stream is available.
  if (req.method === "GET") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return rpcError(null, PARSE_ERROR, "Invalid JSON payload.");
  }

  // A client MAY send a batch (array) of requests.
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
  // Notifications produce no body → 202 Accepted.
  return response ?? new Response(null, { status: 202, headers: CORS_HEADERS });
});
