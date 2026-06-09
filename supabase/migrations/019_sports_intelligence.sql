-- Sports intelligence: structured numeric datasets behind the /sports section.
--
-- These back the ranked "intelligence" tables that the section previously ran
-- on mock data: club valuations & P&L, athlete market values, the sponsorship
-- leaderboard, the transfer board, and broadcast-rights deals. The editorial
-- surfaces (stories) already live in `articles`; these tables hold the figures.
--
-- Monetary/percentage fields are stored as pre-formatted display TEXT (e.g.
-- '$8.4M', '+11%') so an editor can enter exactly what should render and the UI
-- needs no number-formatting logic. `up`/`profitable` booleans drive the
-- green/red movement arrows.
--
-- RLS is enabled in the same migration (TECHNICAL_ARCHITECTURE rule #2). Public
-- read (the figures are published), admin-only writes. Idempotent: safe to
-- re-run. No seed rows — until an editor adds data the app shows mock content.

-- ─────────────────────────────────────────────────────────────────
-- 1. Tables
-- ─────────────────────────────────────────────────────────────────

-- Clubs: one row per club. Carries both valuation and P&L figures.
create table if not exists public.sports_clubs (
  id          uuid primary key default gen_random_uuid(),
  rank        integer not null,
  club        text not null,
  est_value   text,
  yoy         text,
  up          boolean,
  capacity    text,
  founded     integer,
  revenue     text,
  wages       text,
  profit      text,
  profitable  boolean,
  margin      text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Athletes: market-value board.
create table if not exists public.sports_athletes (
  id            uuid primary key default gen_random_uuid(),
  rank          integer not null,
  name          text not null,
  pos           text,
  club          text,
  market_value  text,
  trend         text,
  up            boolean,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Sponsorship leaderboard.
create table if not exists public.sports_sponsorships (
  id           uuid primary key default gen_random_uuid(),
  rank         integer not null,
  party        text not null,
  sponsor      text not null,
  category     text check (category in ('Title','Shirt','Kit','Federation','Stadium')),
  annual       text,
  total_value  text,
  since_year   integer,
  expiry_year  integer,
  status       text check (status in ('done','active','expiring','negotiating','rumour','hot')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Transfer board.
create table if not exists public.sports_transfers (
  id          uuid primary key default gen_random_uuid(),
  rank        integer not null,
  player      text not null,
  pos         text,
  from_club   text,
  to_club     text,
  fee         text,
  contract    text,
  status      text check (status in ('done','active','expiring','negotiating','rumour','hot')),
  deal_date   text,
  direction   text check (direction in ('inbound','outbound','domestic')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Broadcast-rights deals.
create table if not exists public.sports_broadcast_deals (
  id          uuid primary key default gen_random_uuid(),
  sort_order  integer not null default 0,
  comp        text not null,
  rights      text,
  value       text,
  per_season  text,
  territory   text,
  expiry      text,
  status      text check (status in ('done','active','expiring','negotiating','rumour','hot')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Indexes (default display order)
-- ─────────────────────────────────────────────────────────────────
create index if not exists sports_clubs_rank_idx        on public.sports_clubs (rank);
create index if not exists sports_athletes_rank_idx      on public.sports_athletes (rank);
create index if not exists sports_sponsorships_rank_idx  on public.sports_sponsorships (rank);
create index if not exists sports_transfers_rank_idx     on public.sports_transfers (rank);
create index if not exists sports_broadcast_order_idx    on public.sports_broadcast_deals (sort_order);

-- ─────────────────────────────────────────────────────────────────
-- 3. Row Level Security — public read, admin write
-- ─────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array[
    'sports_clubs','sports_athletes','sports_sponsorships',
    'sports_transfers','sports_broadcast_deals'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (true)', t, t);

    execute format('drop policy if exists %I_admin_all on public.%I', t, t);
    execute format(
      'create policy %I_admin_all on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end $$;
