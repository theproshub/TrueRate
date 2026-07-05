# TrueRate

Liberia-focused financial intelligence platform — a CBL interpreter for the Liberian business community.

Built with Next.js (App Router), Tailwind CSS, Supabase, and Recharts.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + CRON_SECRET values
npm run dev                   # http://localhost:3000
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the ingestion → interpretation → publication pipeline.

## Data Sources

| Source | What it provides | Update cadence |
|--------|-----------------|----------------|
| CBL DataWarehousePro | Exchange rates, CPI, interest rates, GDP, fiscal, trade, money supply | Nightly cron (`/api/cron/sync-cbl`) |
| CBL website scrape | Daily buying/selling USD/LRD | On-demand (cached 24h) |
| ECB reference rates | EUR, GBP, CNY cross-rates | Hourly fetch |
| Yahoo Finance | Commodity quotes (Gold, Oil, Iron Ore) | 15-min ISR |
| World Bank Open Data | GDP, population, unemployment, FDI (annual) | Manual hydration script |

## Key Directories

```
src/app/          — Next.js routing + pages
src/components/   — UI components
src/lib/          — Business logic, data access, utilities
src/data/         — Seed/fallback data (DB is source of truth)
supabase/         — Migrations, edge functions (MCP server)
scripts/          — One-off ops scripts
docs/             — Architecture, data dictionary, ADRs
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design
- [CONTRIBUTING.md](./CONTRIBUTING.md) — conventions and boundary rules
- [docs/data-dictionary.md](./docs/data-dictionary.md) — CBL mnemonic registry
