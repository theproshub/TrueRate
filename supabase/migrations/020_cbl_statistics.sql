-- CBL Statistics: series metadata + time-series observations.
-- Populated nightly by /api/cron/sync-cbl via DataWarehousePro API.
-- Idempotent.

-- ─────────────────────────────────────────────────────────────────
-- 1. cbl_series  (one row per CBL mnemonic)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.cbl_series (
  mnemonic          text primary key,
  databank          text not null,           -- 'EXR' | 'CPI' | 'MON' | ...
  databank_name     text,
  name_of_series    text not null,
  data_family       text,
  unit_of_measure   text,
  frequency         text not null,           -- 'M' | 'Q' | 'A'
  data_source       text,
  first_observation text,
  notes             text,
  updated_at        timestamptz not null default now()
);

create index if not exists cbl_series_databank_idx on public.cbl_series (databank);

-- ─────────────────────────────────────────────────────────────────
-- 2. cbl_observations  (one row per mnemonic × period)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.cbl_observations (
  id           bigint generated always as identity primary key,
  mnemonic     text not null references public.cbl_series (mnemonic) on delete cascade,
  period_date  date not null,    -- first day of period (Jan-92 → 1992-01-01)
  period_label text not null,    -- original label from CBL ("Jan-92", "2025Q2", "2025")
  value        numeric,          -- null when CBL reports 0.000… for missing data
  constraint cbl_observations_mnemonic_period_key unique (mnemonic, period_date)
);

create index if not exists cbl_observations_mnemonic_date_idx
  on public.cbl_observations (mnemonic, period_date desc);

create index if not exists cbl_observations_date_idx
  on public.cbl_observations (period_date desc);

-- ─────────────────────────────────────────────────────────────────
-- 3. RLS — world-readable, writes via service role only
-- ─────────────────────────────────────────────────────────────────
alter table public.cbl_series       enable row level security;
alter table public.cbl_observations enable row level security;

drop policy if exists cbl_series_public_read       on public.cbl_series;
drop policy if exists cbl_observations_public_read on public.cbl_observations;

create policy cbl_series_public_read
  on public.cbl_series for select using (true);

create policy cbl_observations_public_read
  on public.cbl_observations for select using (true);
