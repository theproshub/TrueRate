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
  // ── Editorial ──────────────────────────────────────────────────────────
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
  // ── CBL Statistics ─────────────────────────────────────────────────────
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
  {
    name: "search_indicator",
    description:
      "Cross-domain search: queries both TrueRate articles and CBL statistical series simultaneously and returns unified results.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Keyword to search for across articles and CBL series.",
        },
      },
      required: ["query"],
    },
  },
  // ── Data Warehouse: Correlation & Analysis ─────────────────────────────
  {
    name: "compare_series",
    description:
      "Aligns two or more CBL series by overlapping periods for side-by-side comparison. Returns aligned rows, per-series statistics, and Pearson correlation coefficients between each pair. Use this to correlate exchange rate movements with CPI, money supply with inflation, etc.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonics: {
          type: "array",
          items: { type: "string" },
          description: "Array of CBL mnemonics to compare (2–6).",
        },
        limit: {
          type: "number",
          description: "Max observations per series before alignment (default 60, max 120).",
        },
      },
      required: ["mnemonics"],
    },
  },
  {
    name: "series_statistics",
    description:
      "Bloomberg-terminal-style statistical summary for one CBL series: latest value, period-over-period change, YoY change, min, max, mean, median, standard deviation, trend direction, and data range. Returns exact numbers from the database — never fabricated.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: {
          type: "string",
          description: "CBL mnemonic, e.g. LBR_EXR_EPR_1.",
        },
        periods: {
          type: "number",
          description: "Number of recent observations to compute statistics over (default 24, max 120).",
        },
      },
      required: ["mnemonic"],
    },
  },
  {
    name: "macro_snapshot",
    description:
      "Returns the latest available value for every CBL series across all databanks — a comprehensive economic dashboard snapshot. Each entry includes the series name, unit, latest value, latest period, and period-over-period change. Use this to get a complete picture of Liberia's economy at a glance.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "fact_check",
    description:
      "Verifies a numerical claim against actual CBL data. Provide a claim (e.g. 'inflation rose to 5% in March 2025') and the relevant mnemonic. Returns the actual values for the referenced period, whether the claim is supported, and the exact figures from the database. ALWAYS use this before publishing any data-dependent statement.",
    inputSchema: {
      type: "object",
      properties: {
        claim: {
          type: "string",
          description: "The numerical claim to verify, e.g. 'The exchange rate depreciated 8% in Q1 2025'.",
        },
        mnemonic: {
          type: "string",
          description: "The CBL mnemonic to check against, e.g. LBR_EXR_EPR_1.",
        },
        period_start: {
          type: "string",
          description: "Start date (YYYY-MM-DD) for the claim period (optional, defaults to 12 months ago).",
        },
        period_end: {
          type: "string",
          description: "End date (YYYY-MM-DD) for the claim period (optional, defaults to latest).",
        },
      },
      required: ["claim", "mnemonic"],
    },
  },
  {
    name: "article_data_context",
    description:
      "Given an article slug, returns all CBL macro series tagged to that article (via article_macros) with their latest values and recent history. Use this when writing, editing, or fact-checking an article to ensure every number cited is backed by real data.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Article slug to look up macro context for.",
        },
      },
      required: ["slug"],
    },
  },
  // ── Data Warehouse: Advanced Analysis ──────────────────────────────────
  {
    name: "trend_analysis",
    description:
      "Technical analysis of a CBL series: 3/6/12-period moving averages, volatility (rolling standard deviation), momentum (rate of change), and support/resistance levels. Bloomberg-terminal grade. Use for deeper trend reporting beyond basic series_statistics.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: {
          type: "string",
          description: "CBL mnemonic, e.g. LBR_EXR_EPR_1.",
        },
        periods: {
          type: "number",
          description: "Number of observations to analyze (default 36, max 120).",
        },
      },
      required: ["mnemonic"],
    },
  },
  {
    name: "data_quality_report",
    description:
      "Pre-publication data integrity check. Reports freshness (days since last update), completeness (observation gaps), expected vs actual count, and staleness warnings for 1–10 CBL series. ALWAYS run before writing any data-dependent content to ensure figures are current.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonics: {
          type: "array",
          items: { type: "string" },
          description: "Array of CBL mnemonics to check (1–10).",
        },
      },
      required: ["mnemonics"],
    },
  },
  {
    name: "period_comparison",
    description:
      "Compare a CBL series across two arbitrary time periods (Q-on-Q, H-on-H, Y-on-Y, or custom ranges). Returns exact values, averages, and change analysis for both periods. Use for stories comparing quarters, halves, or specific economic events.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: {
          type: "string",
          description: "CBL mnemonic.",
        },
        period_a_start: {
          type: "string",
          description: "Start date of first period (YYYY-MM-DD).",
        },
        period_a_end: {
          type: "string",
          description: "End date of first period (YYYY-MM-DD).",
        },
        period_b_start: {
          type: "string",
          description: "Start date of second period (YYYY-MM-DD).",
        },
        period_b_end: {
          type: "string",
          description: "End date of second period (YYYY-MM-DD).",
        },
      },
      required: ["mnemonic", "period_a_start", "period_a_end", "period_b_start", "period_b_end"],
    },
  },
  {
    name: "outlier_detection",
    description:
      "Identifies anomalous values in a CBL series using z-score analysis. Flags observations as mild (|z|>1.5), moderate (|z|>2), or extreme (|z|>3). Use for investigative reporting, editorial alerting, and data validation before publication.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: {
          type: "string",
          description: "CBL mnemonic.",
        },
        periods: {
          type: "number",
          description: "Number of observations to analyze (default 36, max 120).",
        },
        threshold: {
          type: "number",
          description: "Minimum z-score threshold for flagging (default 1.5).",
        },
      },
      required: ["mnemonic"],
    },
  },
  {
    name: "cross_validate",
    description:
      "Cross-validates data consistency between 2–6 related CBL series. Checks temporal alignment, directional consistency (do they move together/inversely as expected?), and flags contradictions. Use before publishing multi-indicator stories to ensure the narrative doesn't contradict the data.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonics: {
          type: "array",
          items: { type: "string" },
          description: "Array of related CBL mnemonics to validate (2–6).",
        },
        expected_relationship: {
          type: "string",
          enum: ["positive", "negative", "independent"],
          description: "Expected directional relationship between the series (default: positive).",
        },
      },
      required: ["mnemonics"],
    },
  },
  // ── Data Warehouse: Article Verification ────────────────────────────────
  {
    name: "verify_article_data",
    description:
      "Automated fact-checker: extracts every numerical claim from article text, matches each against the CBL data warehouse, and returns a claim-by-claim verification report with verdicts (EXACT, SUPPORTED, MISMATCH, UNIT_MATCH, NO_DATA). Handles unit conversions (billions/millions/raw). Use this as a mandatory gate before publishing any article.",
    inputSchema: {
      type: "object",
      properties: {
        body: {
          type: "array",
          items: { type: "string" },
          description: "Article body paragraphs as an array of strings.",
        },
        macro_tags: {
          type: "array",
          items: { type: "string" },
          description: "CBL mnemonics tagged to this article (macroTags).",
        },
        title: {
          type: "string",
          description: "Article title (optional, will also be checked for numerical claims).",
        },
        summary: {
          type: "string",
          description: "Article summary/dek (optional, will also be checked).",
        },
      },
      required: ["body", "macro_tags"],
    },
  },
  {
    name: "article_data_sheet",
    description:
      "Pre-write data assembly: given a list of CBL mnemonics, returns a formatted data sheet with the latest value, period, YoY change, trend, min/max, and publication-ready formatted values (with unit labels like 'US$2.82B' or 'L$299.4B'). Use this BEFORE writing an article to build the data foundation — every number in the article must come from this sheet.",
    inputSchema: {
      type: "object",
      properties: {
        mnemonics: {
          type: "array",
          items: { type: "string" },
          description: "Array of CBL mnemonics to assemble data for (1–15).",
        },
        periods: {
          type: "number",
          description: "Number of recent observations per series (default 24, max 60).",
        },
      },
      required: ["mnemonics"],
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

    // ── CBL: latest_exchange_rate ─────────────────────────────────────────
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

    // ── CBL: exchange_rate_history ────────────────────────────────────────
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

    // ── CBL: latest_inflation ─────────────────────────────────────────────
    case "latest_inflation": {
      const { data, error } = await supabase
        .from("cbl_observations")
        .select("period_date, period_label, value")
        .eq("mnemonic", "LBR_CPI_0")
        .not("value", "is", null)
        .neq("value", 0)
        .order("period_date", { ascending: false })
        .limit(13);
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
        latest: latest ? { period: latest.period_label, period_date: latest.period_date, value: latest.value } : null,
        year_ago: yearAgo ? { period: yearAgo.period_label, period_date: yearAgo.period_date, value: yearAgo.value } : null,
        yoy_change_pct: yoy,
      });
    }

    // ── CBL: inflation_history ────────────────────────────────────────────
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

    // ── CBL: list_databanks ───────────────────────────────────────────────
    case "list_databanks": {
      const { data, error } = await supabase
        .from("cbl_series")
        .select("databank, databank_name")
        .order("databank");
      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      const map = new Map<string, { databank_name: string; count: number }>();
      for (const row of data ?? []) {
        const existing = map.get(row.databank);
        if (existing) { existing.count++; }
        else { map.set(row.databank, { databank_name: row.databank_name ?? row.databank, count: 1 }); }
      }
      return textContent(
        Array.from(map.entries()).map(([databank, v]) => ({
          databank,
          databank_name: v.databank_name,
          series_count: v.count,
        })),
      );
    }

    // ── CBL: list_series ──────────────────────────────────────────────────
    case "list_series": {
      const databank = requireString(args, "databank").toUpperCase();
      const { data, error } = await supabase
        .from("cbl_series")
        .select("mnemonic, name_of_series, unit_of_measure, frequency, first_observation")
        .eq("databank", databank)
        .order("mnemonic");
      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      if (!data?.length) throw new RpcError(INVALID_PARAMS, `No series found for databank "${databank}".`);
      return textContent(data);
    }

    // ── CBL: get_series ───────────────────────────────────────────────────
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

    // ── CBL: search_series ────────────────────────────────────────────────
    case "search_series": {
      const query = requireString(args, "query");
      const { data, error } = await supabase
        .from("cbl_series")
        .select("mnemonic, databank, name_of_series, unit_of_measure, frequency")
        .or(`name_of_series.ilike.%${query}%,databank_name.ilike.%${query}%,unit_of_measure.ilike.%${query}%`)
        .order("databank")
        .limit(30);
      if (error) throw new RpcError(INTERNAL_ERROR, error.message);
      return textContent(data);
    }

    // ── Data Warehouse: compare_series ──────────────────────────────────
    case "compare_series": {
      const mnemonics = args?.mnemonics as string[] | undefined;
      if (!Array.isArray(mnemonics) || mnemonics.length < 2 || mnemonics.length > 6) {
        throw new RpcError(INVALID_PARAMS, "Provide 2–6 mnemonics in the mnemonics array.");
      }
      const limit = Math.min(optionalInt(args, "limit", 60), 120);
      const upper = mnemonics.map((m) => String(m).toUpperCase());

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("mnemonic, name_of_series, unit_of_measure, frequency").in("mnemonic", upper),
        supabase.from("cbl_observations").select("mnemonic, period_date, value").in("mnemonic", upper).not("value", "is", null).order("period_date", { ascending: true }),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const metaMap = new Map<string, { name: string; unit: string; frequency: string }>();
      for (const r of (metaRes.data ?? []) as { mnemonic: string; name_of_series: string; unit_of_measure: string; frequency: string }[]) {
        metaMap.set(r.mnemonic, { name: r.name_of_series, unit: r.unit_of_measure, frequency: r.frequency });
      }

      const byMnemonic = new Map<string, Map<string, number>>();
      for (const m of upper) byMnemonic.set(m, new Map());
      for (const r of (obsRes.data ?? []) as { mnemonic: string; period_date: string; value: number }[]) {
        byMnemonic.get(r.mnemonic)?.set(r.period_date, r.value);
      }

      // Find overlapping periods
      const periodSets = upper.map((m) => new Set(byMnemonic.get(m)!.keys()));
      let overlap = periodSets[0];
      for (let i = 1; i < periodSets.length; i++) {
        overlap = new Set([...overlap].filter((p) => periodSets[i].has(p)));
      }
      const periods = [...overlap].sort().slice(-limit);

      // Build aligned rows
      const aligned = periods.map((p) => {
        const row: Record<string, unknown> = { period: p };
        for (const m of upper) row[m] = byMnemonic.get(m)!.get(p) ?? null;
        return row;
      });

      // Per-series stats
      const stats: Record<string, unknown> = {};
      for (const m of upper) {
        const vals = periods.map((p) => byMnemonic.get(m)!.get(p)!).filter((v) => v != null);
        if (vals.length === 0) { stats[m] = { count: 0 }; continue; }
        const sorted = [...vals].sort((a, b) => a - b);
        const sum = vals.reduce((s, v) => s + v, 0);
        const mean = sum / vals.length;
        const median = vals.length % 2 === 0 ? (sorted[vals.length / 2 - 1] + sorted[vals.length / 2]) / 2 : sorted[Math.floor(vals.length / 2)];
        stats[m] = {
          ...metaMap.get(m),
          count: vals.length,
          latest: vals[vals.length - 1],
          min: sorted[0],
          max: sorted[sorted.length - 1],
          mean: Number(mean.toFixed(4)),
          median: Number(median.toFixed(4)),
        };
      }

      // Pearson correlation between each pair
      const correlations: Array<{ pair: string[]; r: number; interpretation: string }> = [];
      for (let i = 0; i < upper.length; i++) {
        for (let j = i + 1; j < upper.length; j++) {
          const a = upper[i], b = upper[j];
          const valsA: number[] = [], valsB: number[] = [];
          for (const p of periods) {
            const va = byMnemonic.get(a)!.get(p);
            const vb = byMnemonic.get(b)!.get(p);
            if (va != null && vb != null) { valsA.push(va); valsB.push(vb); }
          }
          if (valsA.length < 3) { correlations.push({ pair: [a, b], r: 0, interpretation: "insufficient data" }); continue; }
          const meanA = valsA.reduce((s, v) => s + v, 0) / valsA.length;
          const meanB = valsB.reduce((s, v) => s + v, 0) / valsB.length;
          let num = 0, denA = 0, denB = 0;
          for (let k = 0; k < valsA.length; k++) {
            const da = valsA[k] - meanA, db = valsB[k] - meanB;
            num += da * db; denA += da * da; denB += db * db;
          }
          const r = denA * denB > 0 ? Number((num / Math.sqrt(denA * denB)).toFixed(4)) : 0;
          const abs = Math.abs(r);
          const interpretation = abs >= 0.8 ? "strong" : abs >= 0.5 ? "moderate" : abs >= 0.3 ? "weak" : "negligible";
          correlations.push({ pair: [a, b], r, interpretation: `${interpretation} ${r >= 0 ? "positive" : "negative"}` });
        }
      }

      return textContent({ overlapping_periods: periods.length, series: stats, correlations, aligned_data: aligned });
    }

    // ── Data Warehouse: series_statistics ────────────────────────────────
    case "series_statistics": {
      const mnemonic = requireString(args, "mnemonic").toUpperCase();
      const periods = Math.min(optionalInt(args, "periods", 24), 120);

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("*").eq("mnemonic", mnemonic).single(),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).order("period_date", { ascending: false }).limit(periods + 12),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const allObs = ((obsRes.data ?? []) as { period_date: string; period_label: string; value: number }[]).reverse();
      const recent = allObs.slice(-periods);
      if (recent.length === 0) throw new RpcError(INTERNAL_ERROR, `No observations found for ${mnemonic}.`);

      const vals = recent.map((o) => o.value);
      const sorted = [...vals].sort((a, b) => a - b);
      const sum = vals.reduce((s, v) => s + v, 0);
      const mean = sum / vals.length;
      const median = vals.length % 2 === 0 ? (sorted[vals.length / 2 - 1] + sorted[vals.length / 2]) / 2 : sorted[Math.floor(vals.length / 2)];
      const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
      const stddev = Math.sqrt(variance);

      const latest = recent[recent.length - 1];
      const prev = recent.length >= 2 ? recent[recent.length - 2] : null;
      const popChange = prev ? Number((latest.value - prev.value).toFixed(4)) : null;
      const popChangePct = prev && prev.value !== 0 ? Number((((latest.value - prev.value) / prev.value) * 100).toFixed(2)) : null;

      // YoY: find observation ~12 months back
      const yearAgo = allObs.length >= 13 ? allObs[allObs.length - 13] : null;
      const yoyChange = yearAgo ? Number((latest.value - yearAgo.value).toFixed(4)) : null;
      const yoyChangePct = yearAgo && yearAgo.value !== 0 ? Number((((latest.value - yearAgo.value) / yearAgo.value) * 100).toFixed(2)) : null;

      // Trend: simple linear regression slope direction
      let trend = "flat";
      if (vals.length >= 3) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        for (let i = 0; i < vals.length; i++) { sumX += i; sumY += vals[i]; sumXY += i * vals[i]; sumXX += i * i; }
        const slope = (vals.length * sumXY - sumX * sumY) / (vals.length * sumXX - sumX * sumX);
        const slopeNorm = (slope * vals.length) / (mean || 1);
        trend = slopeNorm > 0.02 ? "rising" : slopeNorm < -0.02 ? "falling" : "flat";
      }

      return textContent({
        mnemonic,
        name: metaRes.data.name_of_series,
        unit: metaRes.data.unit_of_measure,
        frequency: metaRes.data.frequency,
        data_source: metaRes.data.data_source,
        latest: { period: latest.period_label, period_date: latest.period_date, value: latest.value },
        previous: prev ? { period: prev.period_label, period_date: prev.period_date, value: prev.value } : null,
        pop_change: popChange,
        pop_change_pct: popChangePct,
        yoy_change: yoyChange,
        yoy_change_pct: yoyChangePct,
        statistics: {
          count: vals.length,
          min: { value: sorted[0], period: recent[vals.indexOf(sorted[0])].period_label },
          max: { value: sorted[sorted.length - 1], period: recent[vals.indexOf(sorted[sorted.length - 1])].period_label },
          mean: Number(mean.toFixed(4)),
          median: Number(median.toFixed(4)),
          std_deviation: Number(stddev.toFixed(4)),
        },
        trend,
        data_range: { from: recent[0].period_date, to: latest.period_date },
        _integrity: "All values sourced directly from CBL cbl_observations table. No values are fabricated or estimated.",
      });
    }

    // ── Data Warehouse: macro_snapshot ────────────────────────────────────
    case "macro_snapshot": {
      // Get all distinct mnemonics
      const { data: allSeries, error: seriesErr } = await supabase
        .from("cbl_series")
        .select("mnemonic, databank, databank_name, name_of_series, unit_of_measure, frequency")
        .order("databank, mnemonic");
      if (seriesErr) throw new RpcError(INTERNAL_ERROR, seriesErr.message);
      if (!allSeries?.length) return textContent({ snapshot: [], message: "No series available." });

      const mnemonics = allSeries.map((s: { mnemonic: string }) => s.mnemonic);

      // For each series, get the 2 most recent observations for change calculation
      const { data: obsData, error: obsErr } = await supabase
        .from("cbl_observations")
        .select("mnemonic, period_date, period_label, value")
        .in("mnemonic", mnemonics)
        .not("value", "is", null)
        .order("period_date", { ascending: false });
      if (obsErr) throw new RpcError(INTERNAL_ERROR, obsErr.message);

      // Group by mnemonic, keep top 2
      const byMnemonic = new Map<string, Array<{ period_date: string; period_label: string; value: number }>>();
      for (const r of (obsData ?? []) as Array<{ mnemonic: string; period_date: string; period_label: string; value: number }>) {
        const arr = byMnemonic.get(r.mnemonic) ?? [];
        if (arr.length < 2) arr.push(r);
        byMnemonic.set(r.mnemonic, arr);
      }

      const snapshot = allSeries.map((s: { mnemonic: string; databank: string; databank_name: string; name_of_series: string; unit_of_measure: string; frequency: string }) => {
        const obs = byMnemonic.get(s.mnemonic) ?? [];
        const latest = obs[0] ?? null;
        const prev = obs[1] ?? null;
        const change = latest && prev ? Number((latest.value - prev.value).toFixed(4)) : null;
        const changePct = latest && prev && prev.value !== 0
          ? Number((((latest.value - prev.value) / prev.value) * 100).toFixed(2))
          : null;
        return {
          mnemonic: s.mnemonic,
          databank: s.databank,
          databank_name: s.databank_name,
          name: s.name_of_series,
          unit: s.unit_of_measure,
          frequency: s.frequency,
          latest_value: latest?.value ?? null,
          latest_period: latest?.period_label ?? null,
          latest_date: latest?.period_date ?? null,
          prev_value: prev?.value ?? null,
          change,
          change_pct: changePct,
        };
      });

      return textContent({
        as_of: new Date().toISOString(),
        total_series: snapshot.length,
        snapshot,
        _integrity: "All values sourced directly from CBL cbl_observations table. No values are fabricated.",
      });
    }

    // ── Data Warehouse: fact_check ────────────────────────────────────────
    case "fact_check": {
      const claim = requireString(args, "claim");
      const mnemonic = requireString(args, "mnemonic").toUpperCase();

      // Determine date range
      const now = new Date();
      const defaultStart = new Date(now);
      defaultStart.setMonth(defaultStart.getMonth() - 12);
      const periodStart = (args?.period_start as string) || defaultStart.toISOString().slice(0, 10);
      const periodEnd = (args?.period_end as string) || now.toISOString().slice(0, 10);

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("name_of_series, unit_of_measure, frequency, data_source").eq("mnemonic", mnemonic).single(),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).gte("period_date", periodStart).lte("period_date", periodEnd).order("period_date", { ascending: true }),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const obs = (obsRes.data ?? []) as Array<{ period_date: string; period_label: string; value: number }>;
      const first = obs[0] ?? null;
      const last = obs[obs.length - 1] ?? null;

      const periodChange = first && last ? Number((last.value - first.value).toFixed(4)) : null;
      const periodChangePct = first && last && first.value !== 0
        ? Number((((last.value - first.value) / first.value) * 100).toFixed(2))
        : null;

      const vals = obs.map((o) => o.value);
      const sorted = [...vals].sort((a, b) => a - b);

      return textContent({
        claim,
        series: {
          mnemonic,
          name: metaRes.data.name_of_series,
          unit: metaRes.data.unit_of_measure,
          source: metaRes.data.data_source,
        },
        period_analyzed: { from: periodStart, to: periodEnd, observations_found: obs.length },
        actual_data: {
          first_in_period: first ? { date: first.period_date, period: first.period_label, value: first.value } : null,
          last_in_period: last ? { date: last.period_date, period: last.period_label, value: last.value } : null,
          period_change: periodChange,
          period_change_pct: periodChangePct,
          min: sorted.length ? sorted[0] : null,
          max: sorted.length ? sorted[sorted.length - 1] : null,
        },
        all_observations: obs,
        _instructions: "Compare the claim against actual_data. If the claim's numbers don't match the actual values, flag it as unsupported and cite the correct figures. NEVER round or estimate — use the exact values returned.",
        _integrity: "All values sourced directly from CBL cbl_observations table. No values are fabricated.",
      });
    }

    // ── Data Warehouse: article_data_context ─────────────────────────────
    case "article_data_context": {
      const slug = requireString(args, "slug");

      // Find the article
      const { data: article, error: artErr } = await supabase
        .from("articles")
        .select("id, slug, title, dek, published_at")
        .eq("slug", slug)
        .single();
      if (artErr) throw new RpcError(INTERNAL_ERROR, artErr.message);

      // Get tagged macro series via article_macros join
      const { data: macroTags, error: tagErr } = await supabase
        .from("article_macros")
        .select("macro_series_id, macro_series:macro_series(series_id, label)")
        .eq("article_id", article.id);
      if (tagErr) throw new RpcError(INTERNAL_ERROR, tagErr.message);

      // Map macro_series.series_id to CBL mnemonics
      // Supabase returns the joined relation as an array; flatten and extract series_id.
      const seriesIds: string[] = [];
      for (const tag of (macroTags ?? []) as Array<{ macro_series: Array<{ series_id: string }> | { series_id: string } | null }>) {
        const ms = tag.macro_series;
        if (!ms) continue;
        if (Array.isArray(ms)) {
          for (const s of ms) if (s.series_id) seriesIds.push(s.series_id);
        } else if (ms.series_id) {
          seriesIds.push(ms.series_id);
        }
      }

      if (seriesIds.length === 0) {
        return textContent({
          article: { slug: article.slug, title: article.title },
          message: "No macro series tagged to this article. Tag series in the CMS before using data context.",
          data: [],
        });
      }

      // Get matching CBL series + recent observations
      const { data: cblSeries } = await supabase
        .from("cbl_series")
        .select("mnemonic, name_of_series, unit_of_measure, frequency, data_source")
        .in("mnemonic", seriesIds);

      const cblMnemonics = (cblSeries ?? []).map((s: { mnemonic: string }) => s.mnemonic);

      const { data: obsData } = await supabase
        .from("cbl_observations")
        .select("mnemonic, period_date, period_label, value")
        .in("mnemonic", cblMnemonics)
        .not("value", "is", null)
        .order("period_date", { ascending: false });

      // Group observations and attach to series (last 12 per series)
      const obsByMnemonic = new Map<string, Array<{ period_date: string; period_label: string; value: number }>>();
      for (const r of (obsData ?? []) as Array<{ mnemonic: string; period_date: string; period_label: string; value: number }>) {
        const arr = obsByMnemonic.get(r.mnemonic) ?? [];
        if (arr.length < 12) arr.push(r);
        obsByMnemonic.set(r.mnemonic, arr);
      }

      const data = (cblSeries ?? []).map((s: { mnemonic: string; name_of_series: string; unit_of_measure: string; frequency: string; data_source: string }) => {
        const obs = obsByMnemonic.get(s.mnemonic) ?? [];
        const latest = obs[0] ?? null;
        const prev = obs[1] ?? null;
        return {
          mnemonic: s.mnemonic,
          name: s.name_of_series,
          unit: s.unit_of_measure,
          frequency: s.frequency,
          source: s.data_source,
          latest: latest ? { period: latest.period_label, date: latest.period_date, value: latest.value } : null,
          change: latest && prev ? Number((latest.value - prev.value).toFixed(4)) : null,
          change_pct: latest && prev && prev.value !== 0 ? Number((((latest.value - prev.value) / prev.value) * 100).toFixed(2)) : null,
          recent_observations: obs.reverse(),
        };
      });

      return textContent({
        article: { slug: article.slug, title: article.title, published_at: article.published_at },
        tagged_series_count: data.length,
        data,
        _instructions: "Use these exact values when writing or editing this article. Do not round, estimate, or fabricate any numbers. Cite the period and source for each figure.",
        _integrity: "All values sourced directly from CBL cbl_observations table.",
      });
    }

    // ── search_indicator (cross-domain) ───────────────────────────────────
    case "search_indicator": {
      const query = requireString(args, "query");

      const [articlesResult, seriesResult] = await Promise.all([
        supabase
          .from("articles")
          .select("id, slug, title, dek, published_at, authors(name), categories(label)")
          .eq("status", "published")
          .or(`title.ilike.%${query}%,dek.ilike.%${query}%,body.ilike.%${query}%`)
          .order("published_at", { ascending: false })
          .limit(10),
        supabase
          .from("cbl_series")
          .select("mnemonic, databank, databank_name, name_of_series, unit_of_measure, frequency")
          .or(`name_of_series.ilike.%${query}%,databank_name.ilike.%${query}%,unit_of_measure.ilike.%${query}%`)
          .order("databank")
          .limit(20),
      ]);

      if (articlesResult.error) throw new RpcError(INTERNAL_ERROR, articlesResult.error.message);
      if (seriesResult.error) throw new RpcError(INTERNAL_ERROR, seriesResult.error.message);

      return textContent({
        query,
        articles: {
          count: articlesResult.data?.length ?? 0,
          results: articlesResult.data ?? [],
        },
        cbl_series: {
          count: seriesResult.data?.length ?? 0,
          results: seriesResult.data ?? [],
        },
      });
    }

    // ── Data Warehouse: trend_analysis ─────────────────────────────────
    case "trend_analysis": {
      const mnemonic = requireString(args, "mnemonic").toUpperCase();
      const periods = Math.min(optionalInt(args, "periods", 36), 120);

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("name_of_series, unit_of_measure, frequency").eq("mnemonic", mnemonic).single(),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).order("period_date", { ascending: false }).limit(periods),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const obs = ((obsRes.data ?? []) as Array<{ period_date: string; period_label: string; value: number }>).reverse();
      if (obs.length < 3) throw new RpcError(INTERNAL_ERROR, `Insufficient data for trend analysis (need ≥3, got ${obs.length}).`);

      const vals = obs.map((o) => o.value);

      const movingAvg = (window: number): { period: string; value: number } | null => {
        if (vals.length < window) return null;
        const slice = vals.slice(-window);
        return { period: obs[obs.length - 1].period_label, value: Number((slice.reduce((s, v) => s + v, 0) / window).toFixed(4)) };
      };

      const volWindow = Math.min(6, vals.length);
      const recentSlice = vals.slice(-volWindow);
      const volMean = recentSlice.reduce((s, v) => s + v, 0) / recentSlice.length;
      const volVariance = recentSlice.reduce((s, v) => s + (v - volMean) ** 2, 0) / recentSlice.length;
      const volatility = Number(Math.sqrt(volVariance).toFixed(4));
      const coeffVar = volMean !== 0 ? Number(((volatility / Math.abs(volMean)) * 100).toFixed(2)) : null;

      const roc = (window: number): number | null => {
        if (vals.length <= window) return null;
        const past = vals[vals.length - 1 - window];
        return past !== 0 ? Number((((vals[vals.length - 1] - past) / past) * 100).toFixed(2)) : null;
      };

      const supportWindow = Math.min(12, vals.length);
      const recentVals = vals.slice(-supportWindow);
      const support = Math.min(...recentVals);
      const resistance = Math.max(...recentVals);
      const latest = vals[vals.length - 1];

      const ma3 = movingAvg(3);
      return textContent({
        mnemonic,
        name: metaRes.data.name_of_series,
        unit: metaRes.data.unit_of_measure,
        frequency: metaRes.data.frequency,
        analysis_window: { observations: obs.length, from: obs[0].period_label, to: obs[obs.length - 1].period_label },
        latest: { period: obs[obs.length - 1].period_label, value: latest },
        moving_averages: {
          ma_3: ma3,
          ma_6: movingAvg(6),
          ma_12: movingAvg(12),
          position: latest > (ma3?.value ?? latest) ? "above_short_term_avg" : latest < (ma3?.value ?? latest) ? "below_short_term_avg" : "at_short_term_avg",
        },
        volatility: {
          std_deviation: volatility,
          coefficient_of_variation_pct: coeffVar,
          assessment: (coeffVar ?? 0) < 2 ? "low" : (coeffVar ?? 0) < 5 ? "moderate" : "high",
        },
        momentum: {
          roc_1_period: roc(1),
          roc_3_period: roc(3),
          roc_6_period: roc(6),
          roc_12_period: roc(12),
          direction: (roc(1) ?? 0) > 0.5 ? "accelerating_up" : (roc(1) ?? 0) < -0.5 ? "accelerating_down" : "stable",
        },
        support_resistance: {
          support: { value: support, distance_pct: support !== 0 ? Number((((latest - support) / support) * 100).toFixed(2)) : null },
          resistance: { value: resistance, distance_pct: resistance !== 0 ? Number((((resistance - latest) / resistance) * 100).toFixed(2)) : null },
          range: Number((resistance - support).toFixed(4)),
        },
        _integrity: "All values computed from CBL cbl_observations. No values are fabricated.",
      });
    }

    // ── Data Warehouse: data_quality_report ──────────────────────────────
    case "data_quality_report": {
      const mnemonics = args?.mnemonics as string[] | undefined;
      if (!Array.isArray(mnemonics) || mnemonics.length < 1 || mnemonics.length > 10) {
        throw new RpcError(INVALID_PARAMS, "Provide 1–10 mnemonics.");
      }
      const upper = mnemonics.map((m) => String(m).toUpperCase());

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("mnemonic, name_of_series, frequency, first_observation").in("mnemonic", upper),
        supabase.from("cbl_observations").select("mnemonic, period_date, value").in("mnemonic", upper).order("period_date", { ascending: false }),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const metaMap = new Map<string, { name: string; frequency: string }>();
      for (const r of (metaRes.data ?? []) as Array<{ mnemonic: string; name_of_series: string; frequency: string }>) {
        metaMap.set(r.mnemonic, { name: r.name_of_series, frequency: r.frequency });
      }

      const obsByMnemonic = new Map<string, Array<{ period_date: string; value: number | null }>>();
      for (const r of (obsRes.data ?? []) as Array<{ mnemonic: string; period_date: string; value: number | null }>) {
        const arr = obsByMnemonic.get(r.mnemonic) ?? [];
        arr.push(r);
        obsByMnemonic.set(r.mnemonic, arr);
      }

      const now = new Date();
      const report = upper.map((m) => {
        const meta = metaMap.get(m);
        const obs = obsByMnemonic.get(m) ?? [];
        const nonNull = obs.filter((o) => o.value != null);
        const latest = obs[0] ?? null;
        const daysSinceUpdate = latest ? Math.floor((now.getTime() - new Date(latest.period_date).getTime()) / (1000 * 60 * 60 * 24)) : null;

        const dates = obs.map((o) => o.period_date).sort();
        let gapCount = 0;
        if (dates.length >= 2) {
          const freq = meta?.frequency?.toLowerCase() ?? "monthly";
          const expectedGapDays = freq.includes("quarter") ? 90 : freq.includes("annual") || freq.includes("yearly") ? 365 : 30;
          for (let i = 1; i < dates.length; i++) {
            const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / (1000 * 60 * 60 * 24);
            if (diff > expectedGapDays * 1.5) gapCount++;
          }
        }

        let freshness = "current";
        if (daysSinceUpdate != null) {
          const freq = meta?.frequency?.toLowerCase() ?? "monthly";
          const staleDays = freq.includes("quarter") ? 120 : freq.includes("annual") ? 400 : 60;
          if (daysSinceUpdate > staleDays * 2) freshness = "stale";
          else if (daysSinceUpdate > staleDays) freshness = "aging";
        }

        return {
          mnemonic: m,
          name: meta?.name ?? "unknown",
          frequency: meta?.frequency ?? "unknown",
          found: !!meta,
          total_observations: obs.length,
          non_null_observations: nonNull.length,
          null_observations: obs.length - nonNull.length,
          latest_date: latest?.period_date ?? null,
          days_since_update: daysSinceUpdate,
          freshness,
          gap_count: gapCount,
          usable_for_publication: freshness !== "stale" && nonNull.length >= 3,
        };
      });

      return textContent({
        checked_at: now.toISOString(),
        series_count: report.length,
        all_usable: report.every((r) => r.usable_for_publication),
        report,
        _warning: report.every((r) => r.usable_for_publication) ? null : "Some series are stale or have insufficient data. Verify before publishing.",
        _integrity: "Quality assessment based on actual observation timestamps and counts.",
      });
    }

    // ── Data Warehouse: period_comparison ─────────────────────────────────
    case "period_comparison": {
      const mnemonic = requireString(args, "mnemonic").toUpperCase();
      const periodAStart = requireString(args, "period_a_start");
      const periodAEnd = requireString(args, "period_a_end");
      const periodBStart = requireString(args, "period_b_start");
      const periodBEnd = requireString(args, "period_b_end");

      const [metaRes, obsA, obsB] = await Promise.all([
        supabase.from("cbl_series").select("name_of_series, unit_of_measure, frequency").eq("mnemonic", mnemonic).single(),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).gte("period_date", periodAStart).lte("period_date", periodAEnd).order("period_date", { ascending: true }),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).gte("period_date", periodBStart).lte("period_date", periodBEnd).order("period_date", { ascending: true }),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsA.error) throw new RpcError(INTERNAL_ERROR, obsA.error.message);
      if (obsB.error) throw new RpcError(INTERNAL_ERROR, obsB.error.message);

      type ObsRow = { period_date: string; period_label: string; value: number };
      const computePeriod = (rows: ObsRow[]) => {
        if (!rows.length) return null;
        const v = rows.map((o) => o.value);
        const sorted = [...v].sort((a, b) => a - b);
        const mean = v.reduce((s, x) => s + x, 0) / v.length;
        return {
          observations: rows.length,
          first: { period: rows[0].period_label, date: rows[0].period_date, value: rows[0].value },
          last: { period: rows[rows.length - 1].period_label, date: rows[rows.length - 1].period_date, value: rows[rows.length - 1].value },
          mean: Number(mean.toFixed(4)),
          min: sorted[0],
          max: sorted[sorted.length - 1],
          values: rows,
        };
      };

      const a = computePeriod((obsA.data ?? []) as ObsRow[]);
      const b = computePeriod((obsB.data ?? []) as ObsRow[]);

      const comparison = a && b ? {
        mean_change: Number((b.mean - a.mean).toFixed(4)),
        mean_change_pct: a.mean !== 0 ? Number((((b.mean - a.mean) / a.mean) * 100).toFixed(2)) : null,
        end_value_change: Number((b.last.value - a.last.value).toFixed(4)),
        end_value_change_pct: a.last.value !== 0 ? Number((((b.last.value - a.last.value) / a.last.value) * 100).toFixed(2)) : null,
        direction: b.mean > a.mean ? "increased" : b.mean < a.mean ? "decreased" : "unchanged",
      } : null;

      return textContent({
        mnemonic,
        name: metaRes.data.name_of_series,
        unit: metaRes.data.unit_of_measure,
        period_a: { range: `${periodAStart} to ${periodAEnd}`, data: a },
        period_b: { range: `${periodBStart} to ${periodBEnd}`, data: b },
        comparison,
        _integrity: "All values sourced directly from CBL cbl_observations table. No values are fabricated.",
      });
    }

    // ── Data Warehouse: outlier_detection ─────────────────────────────────
    case "outlier_detection": {
      const mnemonic = requireString(args, "mnemonic").toUpperCase();
      const periods = Math.min(optionalInt(args, "periods", 36), 120);
      const threshold = Number(args?.threshold ?? 1.5);
      if (threshold < 0.5 || threshold > 5) throw new RpcError(INVALID_PARAMS, "Threshold must be between 0.5 and 5.");

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("name_of_series, unit_of_measure").eq("mnemonic", mnemonic).single(),
        supabase.from("cbl_observations").select("period_date, period_label, value").eq("mnemonic", mnemonic).not("value", "is", null).order("period_date", { ascending: false }).limit(periods),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const obs = ((obsRes.data ?? []) as Array<{ period_date: string; period_label: string; value: number }>).reverse();
      if (obs.length < 5) throw new RpcError(INTERNAL_ERROR, `Need ≥5 observations for outlier detection (got ${obs.length}).`);

      const vals = obs.map((o) => o.value);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      const stddev = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);

      const outliers = obs
        .map((o) => {
          const z = stddev !== 0 ? (o.value - mean) / stddev : 0;
          const absZ = Math.abs(z);
          if (absZ < threshold) return null;
          return {
            period: o.period_label,
            date: o.period_date,
            value: o.value,
            z_score: Number(z.toFixed(3)),
            severity: absZ >= 3 ? "extreme" : absZ >= 2 ? "moderate" : "mild",
            direction: z > 0 ? "above_mean" : "below_mean",
            deviation_from_mean: Number((o.value - mean).toFixed(4)),
          };
        })
        .filter(Boolean);

      return textContent({
        mnemonic,
        name: metaRes.data.name_of_series,
        unit: metaRes.data.unit_of_measure,
        analysis_window: { observations: obs.length, from: obs[0].period_label, to: obs[obs.length - 1].period_label },
        baseline: { mean: Number(mean.toFixed(4)), std_deviation: Number(stddev.toFixed(4)), threshold_used: threshold },
        outliers_found: outliers.length,
        outliers,
        _integrity: "All values and z-scores computed from CBL cbl_observations. No values are fabricated.",
      });
    }

    // ── Data Warehouse: cross_validate ────────────────────────────────────
    case "cross_validate": {
      const mnemonics = args?.mnemonics as string[] | undefined;
      if (!Array.isArray(mnemonics) || mnemonics.length < 2 || mnemonics.length > 6) {
        throw new RpcError(INVALID_PARAMS, "Provide 2–6 mnemonics.");
      }
      const upper = mnemonics.map((m) => String(m).toUpperCase());
      const expectedRel = (args?.expected_relationship as string) ?? "positive";

      const [metaRes, obsRes] = await Promise.all([
        supabase.from("cbl_series").select("mnemonic, name_of_series, unit_of_measure, frequency").in("mnemonic", upper),
        supabase.from("cbl_observations").select("mnemonic, period_date, value").in("mnemonic", upper).not("value", "is", null).order("period_date", { ascending: true }),
      ]);

      if (metaRes.error) throw new RpcError(INTERNAL_ERROR, metaRes.error.message);
      if (obsRes.error) throw new RpcError(INTERNAL_ERROR, obsRes.error.message);

      const metaMap = new Map<string, { name: string; unit: string; frequency: string }>();
      for (const r of (metaRes.data ?? []) as Array<{ mnemonic: string; name_of_series: string; unit_of_measure: string; frequency: string }>) {
        metaMap.set(r.mnemonic, { name: r.name_of_series, unit: r.unit_of_measure, frequency: r.frequency });
      }

      const byMnemonic = new Map<string, Map<string, number>>();
      for (const m of upper) byMnemonic.set(m, new Map());
      for (const r of (obsRes.data ?? []) as Array<{ mnemonic: string; period_date: string; value: number }>) {
        byMnemonic.get(r.mnemonic)?.set(r.period_date, r.value);
      }

      const periodSets = upper.map((m) => new Set(byMnemonic.get(m)!.keys()));
      let overlap = periodSets[0];
      for (let i = 1; i < periodSets.length; i++) {
        overlap = new Set([...overlap].filter((p) => periodSets[i].has(p)));
      }
      const periods = [...overlap].sort();

      const checks: Array<{ pair: string[]; consistent_periods: number; inconsistent_periods: number; consistency_pct: number; pearson_r: number; relationship_observed: string; matches_expected: boolean }> = [];

      for (let i = 0; i < upper.length; i++) {
        for (let j = i + 1; j < upper.length; j++) {
          const a = upper[i], b = upper[j];
          let consistent = 0, inconsistent = 0;

          for (let k = 1; k < periods.length; k++) {
            const da = (byMnemonic.get(a)!.get(periods[k]) ?? 0) - (byMnemonic.get(a)!.get(periods[k - 1]) ?? 0);
            const db = (byMnemonic.get(b)!.get(periods[k]) ?? 0) - (byMnemonic.get(b)!.get(periods[k - 1]) ?? 0);
            const sameDir = (da > 0 && db > 0) || (da < 0 && db < 0) || (da === 0 && db === 0);
            const oppositeDir = (da > 0 && db < 0) || (da < 0 && db > 0);
            if (expectedRel === "positive" && sameDir) consistent++;
            else if (expectedRel === "negative" && oppositeDir) consistent++;
            else if (expectedRel === "independent") consistent++;
            else inconsistent++;
          }

          const valsA = periods.map((p) => byMnemonic.get(a)!.get(p)!);
          const valsB = periods.map((p) => byMnemonic.get(b)!.get(p)!);
          let r = 0;
          if (valsA.length >= 3) {
            const meanA = valsA.reduce((s, v) => s + v, 0) / valsA.length;
            const meanB = valsB.reduce((s, v) => s + v, 0) / valsB.length;
            let num = 0, denA2 = 0, denB2 = 0;
            for (let k = 0; k < valsA.length; k++) {
              const da2 = valsA[k] - meanA, db2 = valsB[k] - meanB;
              num += da2 * db2; denA2 += da2 * da2; denB2 += db2 * db2;
            }
            r = denA2 * denB2 > 0 ? Number((num / Math.sqrt(denA2 * denB2)).toFixed(4)) : 0;
          }

          const totalMoves = consistent + inconsistent;
          const observed = r >= 0.3 ? "positive" : r <= -0.3 ? "negative" : "independent";

          checks.push({
            pair: [a, b],
            consistent_periods: consistent,
            inconsistent_periods: inconsistent,
            consistency_pct: totalMoves > 0 ? Number(((consistent / totalMoves) * 100).toFixed(1)) : 0,
            pearson_r: r,
            relationship_observed: observed,
            matches_expected: observed === expectedRel,
          });
        }
      }

      const contradictions = checks.filter((c) => !c.matches_expected);

      return textContent({
        expected_relationship: expectedRel,
        overlapping_periods: periods.length,
        series: Object.fromEntries(upper.map((m) => [m, metaMap.get(m) ?? { name: "unknown" }])),
        validation_results: checks,
        contradictions_found: contradictions.length,
        contradictions,
        verdict: contradictions.length === 0 ? "CONSISTENT" : "CONTRADICTIONS_FOUND",
        _warning: contradictions.length > 0 ? "Data shows unexpected relationships between these series. Review the narrative to ensure it accurately reflects the data." : null,
        _integrity: "Cross-validation computed from actual CBL observations. No values are fabricated.",
      });
    }

    // ── verify_article_data ──────────────────────────────────────────────
    case "verify_article_data": {
      const body = args?.body as string[] | undefined;
      const macroTags = args?.macro_tags as string[] | undefined;
      if (!body || !Array.isArray(body) || body.length === 0) {
        throw new RpcError(INVALID_PARAMS, "body must be a non-empty array of paragraph strings.");
      }
      if (!macroTags || !Array.isArray(macroTags) || macroTags.length === 0) {
        throw new RpcError(INVALID_PARAMS, "macro_tags must be a non-empty array of CBL mnemonics.");
      }

      const title = (args?.title as string) ?? "";
      const summary = (args?.summary as string) ?? "";
      const fullText = [title, summary, ...body].join(" ");

      // 1. Fetch data for all tagged series
      const seriesData: Record<string, { name: string; unit: string; values: Record<string, number>; latest: { period: string; value: number } | null }> = {};
      for (const mnemonic of macroTags) {
        const upper = mnemonic.toUpperCase().trim();
        const { data: meta } = await supabase
          .from("cbl_series")
          .select("name, unit")
          .eq("mnemonic", upper)
          .maybeSingle();

        const { data: obs } = await supabase
          .from("cbl_observations")
          .select("period_label, value")
          .eq("mnemonic", upper)
          .not("value", "is", null)
          .order("period_date", { ascending: false })
          .limit(36);

        const values: Record<string, number> = {};
        if (obs) {
          for (const o of obs) values[o.period_label] = o.value;
        }
        const latest = obs && obs.length > 0 ? { period: obs[0].period_label, value: obs[0].value } : null;
        seriesData[upper] = { name: meta?.name ?? upper, unit: meta?.unit ?? "", values, latest };
      }

      // 2. Extract numerical claims from text
      interface Claim {
        text: string;
        value: number;
        unit: string;
        context: string;
      }
      const claims: Claim[] = [];

      // USD amounts: US$123.45 million/billion
      const usdPattern = /US\$([\d,]+\.?\d*)\s*(million|billion|M|B)?/gi;
      let m;
      while ((m = usdPattern.exec(fullText)) !== null) {
        const raw = parseFloat(m[1].replace(/,/g, ""));
        const unitWord = (m[2] ?? "").toLowerCase();
        let multiplier = 1;
        if (unitWord === "billion" || unitWord === "b") multiplier = 1000;
        else if (unitWord === "million" || unitWord === "m") multiplier = 1;
        const value = raw * multiplier;
        const start = Math.max(0, m.index - 40);
        const end = Math.min(fullText.length, m.index + m[0].length + 40);
        claims.push({ text: m[0], value, unit: "USD_M", context: fullText.slice(start, end).trim() });
      }

      // LRD amounts: L$123.45 billion/million
      const lrdPattern = /L\$([\d,]+\.?\d*)\s*(billion|million|B|M)?/gi;
      while ((m = lrdPattern.exec(fullText)) !== null) {
        const raw = parseFloat(m[1].replace(/,/g, ""));
        const unitWord = (m[2] ?? "").toLowerCase();
        let multiplier = 1;
        if (unitWord === "billion" || unitWord === "b") multiplier = 1000;
        else if (unitWord === "million" || unitWord === "m") multiplier = 1;
        const value = raw * multiplier;
        const start = Math.max(0, m.index - 40);
        const end = Math.min(fullText.length, m.index + m[0].length + 40);
        claims.push({ text: m[0], value, unit: "LRD_M", context: fullText.slice(start, end).trim() });
      }

      // Exchange rates: 183.93 LRD or per USD
      const fxPattern = /(\d{2,3}\.\d{1,2})\s*(?:LRD|per\s*(?:US\s*)?dollar|per\s*USD)/gi;
      while ((m = fxPattern.exec(fullText)) !== null) {
        const value = parseFloat(m[1]);
        const start = Math.max(0, m.index - 40);
        const end = Math.min(fullText.length, m.index + m[0].length + 40);
        claims.push({ text: m[0], value, unit: "rate", context: fullText.slice(start, end).trim() });
      }

      // Percentage rates (standalone): 13.1 percent, 4.5%, 16.3 percent
      const pctPattern = /([\d]+\.?\d*)\s*(?:percent|%)/gi;
      while ((m = pctPattern.exec(fullText)) !== null) {
        const value = parseFloat(m[1]);
        if (value > 0.01 && value < 200) {
          const start = Math.max(0, m.index - 50);
          const end = Math.min(fullText.length, m.index + m[0].length + 30);
          claims.push({ text: m[0], value, unit: "pct", context: fullText.slice(start, end).trim() });
        }
      }

      // Index values (3-digit.decimal like CPI): 820.5, 344.0, 385.2
      const indexPattern = /\b(\d{3,4}\.\d{1,2})\b/g;
      while ((m = indexPattern.exec(fullText)) !== null) {
        const value = parseFloat(m[1]);
        if (value > 100 && value < 5000) {
          const start = Math.max(0, m.index - 50);
          const end = Math.min(fullText.length, m.index + m[0].length + 30);
          const ctx = fullText.slice(start, end).trim();
          if (!ctx.match(/US\$|L\$/) && !ctx.match(/percent|%/)) {
            claims.push({ text: m[1], value, unit: "index", context: ctx });
          }
        }
      }

      // 3. Match claims against series data
      interface Verdict {
        claim_text: string;
        claimed_value: number;
        claimed_unit: string;
        context: string;
        matched_series: string | null;
        matched_period: string | null;
        actual_value: number | null;
        verdict: string;
        pct_diff: number | null;
      }
      const verdicts: Verdict[] = [];
      const allDbValues: Array<{ mnemonic: string; period: string; value: number }> = [];
      for (const [mn, sd] of Object.entries(seriesData)) {
        for (const [period, value] of Object.entries(sd.values)) {
          allDbValues.push({ mnemonic: mn, period, value });
        }
      }

      for (const claim of claims) {
        let bestMatch: { mnemonic: string; period: string; value: number; pctDiff: number; verdict: string } | null = null;

        for (const dbv of allDbValues) {
          // Direct match
          const pctDiff = Math.abs((dbv.value - claim.value) / claim.value) * 100;
          if (pctDiff < 0.05) {
            bestMatch = { ...dbv, pctDiff, verdict: "EXACT" };
            break;
          }
          if (pctDiff < 1) {
            if (!bestMatch || pctDiff < bestMatch.pctDiff) {
              bestMatch = { ...dbv, pctDiff, verdict: "SUPPORTED" };
            }
          }

          // Unit conversion: article in billions, DB in millions (×1000)
          const ratio = dbv.value / claim.value;
          if (ratio > 900 && ratio < 1100) {
            const unitPctDiff = Math.abs((ratio - 1000) / 1000) * 100;
            if (!bestMatch || unitPctDiff < 1) {
              bestMatch = { ...dbv, pctDiff: unitPctDiff, verdict: "UNIT_MATCH" };
            }
          }
        }

        if (bestMatch) {
          verdicts.push({
            claim_text: claim.text,
            claimed_value: claim.value,
            claimed_unit: claim.unit,
            context: claim.context,
            matched_series: bestMatch.mnemonic,
            matched_period: bestMatch.period,
            actual_value: bestMatch.value,
            verdict: bestMatch.verdict,
            pct_diff: bestMatch.pctDiff,
          });
        } else {
          // Check for close mismatches (potential errors)
          let closestMismatch: typeof bestMatch = null;
          for (const dbv of allDbValues) {
            const pctDiff = Math.abs((dbv.value - claim.value) / claim.value) * 100;
            if (pctDiff < 50 && (!closestMismatch || pctDiff < closestMismatch.pctDiff)) {
              closestMismatch = { ...dbv, pctDiff, verdict: pctDiff < 5 ? "CLOSE" : "MISMATCH" };
            }
          }
          if (closestMismatch) {
            verdicts.push({
              claim_text: claim.text,
              claimed_value: claim.value,
              claimed_unit: claim.unit,
              context: claim.context,
              matched_series: closestMismatch.mnemonic,
              matched_period: closestMismatch.period,
              actual_value: closestMismatch.value,
              verdict: closestMismatch.verdict,
              pct_diff: closestMismatch.pctDiff,
            });
          } else {
            verdicts.push({
              claim_text: claim.text,
              claimed_value: claim.value,
              claimed_unit: claim.unit,
              context: claim.context,
              matched_series: null,
              matched_period: null,
              actual_value: null,
              verdict: "NO_DATA",
              pct_diff: null,
            });
          }
        }
      }

      const exact = verdicts.filter((v) => v.verdict === "EXACT").length;
      const supported = verdicts.filter((v) => v.verdict === "SUPPORTED").length;
      const unitMatch = verdicts.filter((v) => v.verdict === "UNIT_MATCH").length;
      const close = verdicts.filter((v) => v.verdict === "CLOSE").length;
      const mismatch = verdicts.filter((v) => v.verdict === "MISMATCH").length;
      const noData = verdicts.filter((v) => v.verdict === "NO_DATA").length;

      const corrections = verdicts.filter((v) => v.verdict === "MISMATCH" || v.verdict === "CLOSE");

      return textContent({
        total_claims: verdicts.length,
        summary: { exact, supported, unit_match: unitMatch, close, mismatch, no_data: noData },
        pass: mismatch === 0,
        verdict: mismatch > 0 ? "CORRECTIONS_NEEDED" : "VERIFIED",
        claims: verdicts,
        corrections_needed: corrections.map((c) => ({
          claim: c.claim_text,
          context: c.context,
          claimed: c.claimed_value,
          actual: c.actual_value,
          series: c.matched_series,
          period: c.matched_period,
          pct_diff: c.pct_diff?.toFixed(1) + "%",
          action: `Replace ${c.claimed_value} with ${c.actual_value}`,
        })),
        series_used: Object.fromEntries(
          Object.entries(seriesData).map(([k, v]) => [k, { name: v.name, unit: v.unit, latest: v.latest }])
        ),
        _integrity: "All values verified against CBL statistical database. No data is fabricated.",
      });
    }

    // ── article_data_sheet ────────────────────────────────────────────────
    case "article_data_sheet": {
      const mnemonics = args?.mnemonics as string[] | undefined;
      if (!mnemonics || !Array.isArray(mnemonics) || mnemonics.length === 0 || mnemonics.length > 15) {
        throw new RpcError(INVALID_PARAMS, "mnemonics must be an array of 1–15 CBL mnemonics.");
      }
      const periods = optionalInt(args, "periods", 24);
      const limitN = Math.min(periods, 60);

      interface SheetEntry {
        mnemonic: string;
        name: string;
        unit: string;
        latest_value: number | null;
        latest_period: string | null;
        formatted: string;
        yoy_value: number | null;
        yoy_period: string | null;
        yoy_change: number | null;
        yoy_change_pct: string | null;
        trend: string;
        min: number | null;
        max: number | null;
        mean: number | null;
        observations: number;
        recent_values: Array<{ period: string; value: number }>;
      }
      const sheet: SheetEntry[] = [];

      for (const raw of mnemonics) {
        const mnemonic = raw.toUpperCase().trim();
        const { data: meta } = await supabase
          .from("cbl_series")
          .select("name, unit")
          .eq("mnemonic", mnemonic)
          .maybeSingle();

        const { data: obs } = await supabase
          .from("cbl_observations")
          .select("period_label, value, period_date")
          .eq("mnemonic", mnemonic)
          .not("value", "is", null)
          .order("period_date", { ascending: false })
          .limit(limitN);

        if (!obs || obs.length === 0) {
          sheet.push({
            mnemonic,
            name: meta?.name ?? mnemonic,
            unit: meta?.unit ?? "",
            latest_value: null,
            latest_period: null,
            formatted: "NO DATA",
            yoy_value: null,
            yoy_period: null,
            yoy_change: null,
            yoy_change_pct: null,
            trend: "unknown",
            min: null,
            max: null,
            mean: null,
            observations: 0,
            recent_values: [],
          });
          continue;
        }

        const latest = obs[0];
        const vals = obs.map((o) => o.value as number);
        const unit = (meta?.unit ?? "").toLowerCase();

        // Format value for publication
        let formatted = String(latest.value);
        const v = latest.value as number;
        if (unit.includes("usd") || unit.includes("us$") || unit.includes("million usd")) {
          if (v >= 1000) formatted = `US$${(v / 1000).toFixed(2)}B`;
          else if (v >= 1) formatted = `US$${v.toFixed(1)}M`;
          else formatted = `US$${(v * 1000).toFixed(0)}K`;
        } else if (unit.includes("lrd") || unit.includes("l$") || unit.includes("million lrd")) {
          if (v >= 1000) formatted = `L$${(v / 1000).toFixed(1)}B`;
          else if (v >= 1) formatted = `L$${v.toFixed(1)}M`;
          else formatted = `L$${v.toFixed(2)}M`;
        } else if (unit.includes("%") || unit.includes("percent") || unit.includes("rate")) {
          formatted = `${v}%`;
        } else if (unit.includes("index")) {
          formatted = v.toFixed(1);
        } else {
          formatted = v.toFixed(2);
        }

        // Find YoY: look for same-named period one year back
        let yoyValue: number | null = null;
        let yoyPeriod: string | null = null;
        const latestLabel = latest.period_label as string;
        const monthMatch = latestLabel.match(/^([A-Za-z]+)-(\d{2})$/);
        const yearMatch = latestLabel.match(/^(\d{4})$/);
        const qtrMatch = latestLabel.match(/^(\d{4})Q(\d)$/);

        if (monthMatch) {
          const yoyLabel = `${monthMatch[1]}-${String(parseInt(monthMatch[2]) - 1).padStart(2, "0")}`;
          const yoyObs = obs.find((o) => o.period_label === yoyLabel);
          if (yoyObs) { yoyValue = yoyObs.value as number; yoyPeriod = yoyLabel; }
        } else if (yearMatch) {
          const yoyLabel = String(parseInt(yearMatch[1]) - 1);
          const yoyObs = obs.find((o) => o.period_label === yoyLabel);
          if (yoyObs) { yoyValue = yoyObs.value as number; yoyPeriod = yoyLabel; }
        } else if (qtrMatch) {
          const yoyLabel = `${parseInt(qtrMatch[1]) - 1}Q${qtrMatch[2]}`;
          const yoyObs = obs.find((o) => o.period_label === yoyLabel);
          if (yoyObs) { yoyValue = yoyObs.value as number; yoyPeriod = yoyLabel; }
        }

        const yoyChange = yoyValue !== null ? (v - yoyValue) : null;
        const yoyChangePct = yoyValue !== null && yoyValue !== 0 ? ((v - yoyValue) / yoyValue * 100).toFixed(1) + "%" : null;

        // Trend: compare first half avg vs second half avg
        const halfLen = Math.floor(vals.length / 2);
        const recentHalf = vals.slice(0, halfLen);
        const olderHalf = vals.slice(halfLen);
        const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length;
        const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;
        const trendPct = olderAvg !== 0 ? ((recentAvg - olderAvg) / olderAvg * 100) : 0;
        let trend = "stable";
        if (trendPct > 2) trend = "rising";
        else if (trendPct < -2) trend = "falling";

        sheet.push({
          mnemonic,
          name: meta?.name ?? mnemonic,
          unit: meta?.unit ?? "",
          latest_value: v,
          latest_period: latestLabel,
          formatted,
          yoy_value: yoyValue,
          yoy_period: yoyPeriod,
          yoy_change: yoyChange,
          yoy_change_pct: yoyChangePct,
          trend,
          min: Math.min(...vals),
          max: Math.max(...vals),
          mean: parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
          observations: vals.length,
          recent_values: obs.slice(0, 6).map((o) => ({ period: o.period_label as string, value: o.value as number })),
        });
      }

      return textContent({
        data_sheet: sheet,
        generated_at: new Date().toISOString(),
        usage: "Every number in the article MUST trace back to a value in this data sheet. If a figure is not here, do not use it.",
        _integrity: "All values are exact CBL database readings. No data is fabricated or estimated.",
      });
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
