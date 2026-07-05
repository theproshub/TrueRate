# Architecture — TrueRate

## Pipeline: Ingestion → Interpretation → Publication

```
┌─────────────────────────────────────────────────────────────────────┐
│  INGESTION (data access layer)                                      │
│                                                                     │
│  CBL DataWarehousePro API ──┐                                       │
│  CBL website (scrape)  ─────┤──→ Supabase (cbl_observations,        │
│  ECB / Frankfurter  ────────┤     quotes_daily, macro_values)       │
│  Yahoo Finance  ────────────┤                                       │
│  World Bank Open Data  ─────┘                                       │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  FACT CORE (domain/cbl + domain/markets)                            │
│                                                                     │
│  - Series data: exact values, periods, units                        │
│  - Computations: YoY, spreads, averages (math, not opinion)         │
│  - Aggregations: dashboard indicators, rate tables                  │
│  - Rule: NEVER imports from interpretation/editorial                │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  INTERPRETATION (domain/interpretation + domain/editorial)           │
│                                                                     │
│  - "What this means for Liberia" — editorial notes, context         │
│  - Byline registry, house-style constants                           │
│  - Category → desk mappings                                         │
│  - Rule: MAY read from fact core; facts never depend on this        │
└────────────────────────────────────┬────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PUBLICATION (app/ routes + components)                              │
│                                                                     │
│  - Pages call into domain logic, never into storage directly        │
│  - Components render; they don't fetch or compute                   │
│  - API routes orchestrate domain calls for client consumers         │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow (current state)

```
/api/cron/sync-cbl        → CBL DataWarehousePro → cbl_observations table
/api/cron/snapshot-quotes → Yahoo Finance        → quotes_daily table
/api/cron/generate-feed   → AI-generated market  → content_cards table
                            commentary

/api/rates       → lib/api/exchange.ts (CBL + ECB + CDN) → live LRD rates
/api/indicators  → lib/data/indicators.ts (macro_values + cbl_observations)
/api/commodities → lib/api/yahoo.ts → live commodity quotes
```

## Boundary Rules

1. **Fact core never imports interpretation.** If `domain/cbl` needs editorial context, the architecture is wrong — push interpretation up into the caller.
2. **Components never talk to storage.** No `createClient()` inside `src/components/`. Data arrives via props, server components, or hooks that call API routes.
3. **One Supabase client factory per access pattern.** Use `lib/supabase/server.ts` (cookie-aware), `lib/supabase/public.ts` (anon reads), or `lib/supabase/admin.ts` (service-role). No ad-hoc `createClient()` elsewhere.

## MCP Server

The `truerate-mcp` Supabase edge function exposes CBL data as read-only MCP tools for Claude Code workflows (article writing, fact-checking, data briefs). It reads the same `cbl_observations` / `cbl_series` tables the app uses.

## Deployment

- **Platform:** Vercel (Fluid Compute)
- **Branch strategy:** `develop` → production via `vercel deploy --prod`
- **Database:** Supabase (hosted), migrations in `supabase/migrations/`
- **Crons:** Three Vercel crons defined in `vercel.json`
