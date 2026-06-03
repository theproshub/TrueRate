-- Trends & Analytics: tradable symbols + region flag for conditional theming.
--
-- Adds `region` to symbols ('LR' = Liberia-local, themed in TrueRate brand;
-- 'global' = international benchmark, themed Bloomberg/Yahoo-dense) and seeds
-- the instruments whose REAL spot we can snapshot daily into quotes_daily:
--   - 6 LRD FX cross-rates  → live exchange API (fawazahmed0)        → region LR
--   - 7 commodity benchmarks → live Stooq EOD feed                   → region global
--
-- Tickers are stored to match the live source keys exactly so the snapshot
-- cron can join without a translation table:
--   FX        ticker = '<CUR>/LRD'  (USD/LRD, EUR/LRD, …)
--   commodity ticker = Stooq symbol (gc.f, cb.f, …) lower-case
--
-- Macro series (macro_series) are all Liberia data → treated as region 'LR' in
-- the app layer (no column needed there; documented in src/lib/analytics/*).
--
-- Idempotent: re-running is safe.

-- ─────────────────────────────────────────────────────────────────
-- 1. region column on symbols
-- ─────────────────────────────────────────────────────────────────
alter table public.symbols
  add column if not exists region text not null default 'global'
    check (region in ('LR', 'global'));

create index if not exists symbols_region_idx on public.symbols (region);
create index if not exists symbols_asset_class_idx on public.symbols (asset_class);

-- ─────────────────────────────────────────────────────────────────
-- 2. FX cross-rates vs LRD  (region = LR — these ARE the local market)
--    base/quote currencies already seeded in migration 003.
-- ─────────────────────────────────────────────────────────────────
insert into public.symbols
  (ticker, asset_class, name, region, base_currency, quote_currency, currency, unit, is_active)
values
  ('USD/LRD', 'fx', 'US Dollar / Liberian Dollar',      'LR', 'USD', 'LRD', 'LRD', 'LRD per USD', true),
  ('EUR/LRD', 'fx', 'Euro / Liberian Dollar',           'LR', 'EUR', 'LRD', 'LRD', 'LRD per EUR', true),
  ('GBP/LRD', 'fx', 'British Pound / Liberian Dollar',  'LR', 'GBP', 'LRD', 'LRD', 'LRD per GBP', true),
  ('CNY/LRD', 'fx', 'Chinese Yuan / Liberian Dollar',   'LR', 'CNY', 'LRD', 'LRD', 'LRD per CNY', true),
  ('GHS/LRD', 'fx', 'Ghanaian Cedi / Liberian Dollar',  'LR', 'GHS', 'LRD', 'LRD', 'LRD per GHS', true),
  ('NGN/LRD', 'fx', 'Nigerian Naira / Liberian Dollar', 'LR', 'NGN', 'LRD', 'LRD', 'LRD per NGN', true)
on conflict (ticker, mic, asset_class) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- 3. Commodity benchmarks  (region = global — international price discovery)
--    Stooq symbols; iron ore proxied via the BHP ADR (no free iron-ore future).
-- ─────────────────────────────────────────────────────────────────
insert into public.symbols
  (ticker, asset_class, name, region, currency, unit, is_active)
values
  ('gc.f',   'commodity', 'Gold',                'global', 'USD', '$/oz',  true),
  ('cb.f',   'commodity', 'Brent crude',         'global', 'USD', '$/bbl', true),
  ('cc.f',   'commodity', 'Cocoa',               'global', 'USD', '$/t',   true),
  ('kc.f',   'commodity', 'Coffee',              'global', 'USD', '¢/lb',  true),
  ('sb.f',   'commodity', 'Sugar',               'global', 'USD', '¢/lb',  true),
  ('bhp.us', 'commodity', 'Iron ore (BHP ADR proxy)', 'global', 'USD', '$ ADR', true)
on conflict (ticker, mic, asset_class) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- 4. quotes_daily is world-readable (charts read it without auth).
--    quotes_daily + symbols had RLS enabled in 001 but public read policies
--    were only created for a subset; ensure both are publicly selectable.
-- ─────────────────────────────────────────────────────────────────
drop policy if exists symbols_public_read on public.symbols;
create policy symbols_public_read on public.symbols
  for select using (true);

drop policy if exists quotes_daily_public_read on public.quotes_daily;
create policy quotes_daily_public_read on public.quotes_daily
  for select using (true);
