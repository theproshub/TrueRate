-- Automated content feed: AI-drafted cards + real markets snapshots.
-- AI-generated cards land as status='draft' (is_ai_generated=true) for human
-- review in admin; markets + real-sourced cards publish directly.
-- Idempotent.

create table if not exists public.content_cards (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in ('breaking','article','quote','big_stat','markets')),
  category        text,                         -- 'Markets'|'Sports'|'Macro'|'Crypto'|'Earnings'|...
  payload         jsonb not null,               -- type-specific, Zod-validated before insert
  priority        int  not null default 0,
  status          text not null default 'draft' check (status in ('draft','published','expired')),
  is_ai_generated boolean not null default false,
  source_note     text,                         -- where the data/quote came from
  published_at    timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists content_cards_status_published_idx on public.content_cards (status, published_at desc);
create index if not exists content_cards_expires_idx          on public.content_cards (expires_at);
create index if not exists content_cards_type_idx             on public.content_cards (type);
create index if not exists content_cards_category_idx         on public.content_cards (category);

create table if not exists public.markets_snapshot (
  id          uuid primary key default gen_random_uuid(),
  ticker      text not null,
  name        text not null,
  asset_class text not null,                    -- 'index'|'forex'|'commodity'|'crypto'|'equity'
  price       numeric not null,
  change      numeric,                          -- absolute change vs previous close
  change_pct  numeric,
  sparkline   jsonb not null default '[]'::jsonb, -- number[] (≤7 closes)
  updated_at  timestamptz not null default now()
);
create index if not exists markets_snapshot_ticker_idx      on public.markets_snapshot (ticker);
create index if not exists markets_snapshot_updated_idx     on public.markets_snapshot (updated_at desc);

create table if not exists public.generation_log (
  id            uuid primary key default gen_random_uuid(),
  run_at        timestamptz not null default now(),
  cards_created int not null default 0,
  status        text not null default 'success' check (status in ('success','partial','error')),
  error         text,
  detail        jsonb
);
create index if not exists generation_log_run_idx on public.generation_log (run_at desc);

-- RLS
alter table public.content_cards   enable row level security;
alter table public.markets_snapshot enable row level security;
alter table public.generation_log  enable row level security;

-- content_cards: public sees only live (published + unexpired); admins see all.
drop policy if exists content_cards_public_read on public.content_cards;
create policy content_cards_public_read on public.content_cards
  for select using (
    (status = 'published' and (expires_at is null or expires_at > now()))
    or public.is_admin()
  );

drop policy if exists content_cards_admin_write on public.content_cards;
create policy content_cards_admin_write on public.content_cards
  for all using (public.is_admin()) with check (public.is_admin());

-- markets_snapshot: world-readable, admin-writable (cron uses service role → bypasses RLS).
drop policy if exists markets_snapshot_public_read on public.markets_snapshot;
create policy markets_snapshot_public_read on public.markets_snapshot
  for select using (true);

drop policy if exists markets_snapshot_admin_write on public.markets_snapshot;
create policy markets_snapshot_admin_write on public.markets_snapshot
  for all using (public.is_admin()) with check (public.is_admin());

-- generation_log: admin-readable only; writes via service role.
drop policy if exists generation_log_admin_read on public.generation_log;
create policy generation_log_admin_read on public.generation_log
  for select using (public.is_admin());
