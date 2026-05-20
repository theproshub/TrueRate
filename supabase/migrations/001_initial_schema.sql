-- TrueRate initial schema (v1)
-- Apply by pasting this entire file into the Supabase SQL Editor for
-- the TrueRate Liberia project (xryhgfpudlpcxgpsytcc).
--
-- Idempotent where reasonable. Safe to re-run sections during development.

-- ─────────────────────────────────────────────────────────────────
-- Stateless helper (no table refs — safe to declare first)
-- ─────────────────────────────────────────────────────────────────

-- Bump updated_at on UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- 1. profiles  (extends auth.users)
-- Must be created before is_admin() / handle_new_user() reference it.
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url   text,
  is_admin     boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- Helpers that reference profiles (declared after the table exists)
-- ─────────────────────────────────────────────────────────────────

-- Returns true if the current request's user has profiles.is_admin = true.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- Auto-create a profile row when a new auth.users row appears
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', null));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────
-- 2. Reference data
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.currencies (
  code   text primary key,             -- 'LRD', 'USD', 'XOF'
  name   text not null,
  symbol text
);

create table if not exists public.exchanges (
  mic          text primary key,        -- 'XBRV', 'XGHA', 'XNGS'
  name         text not null,
  country      text not null,           -- ISO-3
  currency     text not null references public.currencies(code),
  timezone     text not null,
  trading_hours jsonb
);

create table if not exists public.sectors (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  label     text not null,
  parent_id uuid references public.sectors(id) on delete set null
);

create table if not exists public.issuers (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  country      text,
  sector_id    uuid references public.sectors(id) on delete set null,
  website      text,
  logo_url     text,
  description  text,
  employees    int,
  founded_year int,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

drop trigger if exists issuers_set_updated_at on public.issuers;
create trigger issuers_set_updated_at
  before update on public.issuers
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 3. Universe: symbols + macro series
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.symbols (
  id             uuid primary key default gen_random_uuid(),
  ticker         text not null,
  mic            text references public.exchanges(mic) on delete set null,
  asset_class    text not null check (asset_class in
                   ('equity','fx','commodity','bond','index','macro')),
  name           text not null,
  currency       text references public.currencies(code),
  issuer_id      uuid references public.issuers(id) on delete set null,
  base_currency  text references public.currencies(code),
  quote_currency text references public.currencies(code),
  unit           text,
  isin           text,
  figi           text,
  is_active      boolean default true,
  listed_at      date,
  delisted_at    date,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique (ticker, mic, asset_class)
);
create index if not exists symbols_asset_class_active_idx
  on public.symbols (asset_class, is_active);
create index if not exists symbols_issuer_idx
  on public.symbols (issuer_id);

drop trigger if exists symbols_set_updated_at on public.symbols;
create trigger symbols_set_updated_at
  before update on public.symbols
  for each row execute function public.set_updated_at();

create table if not exists public.macro_series (
  id          uuid primary key default gen_random_uuid(),
  series_id   text unique not null,    -- 'CBL.POLICY_RATE', 'WB.GDP.LBR'
  label       text not null,
  unit        text,
  category    text not null,           -- 'rates','inflation','growth','trade','fiscal'
  source      text not null,
  source_url  text,
  frequency   text not null check (frequency in
                ('daily','weekly','monthly','quarterly','annual')),
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

drop trigger if exists macro_series_set_updated_at on public.macro_series;
create trigger macro_series_set_updated_at
  before update on public.macro_series
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 4. Time series
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.quotes_daily (
  symbol_id uuid references public.symbols(id) on delete cascade,
  date      date not null,
  open      numeric,
  high      numeric,
  low       numeric,
  close     numeric,
  volume    bigint,
  adj_close numeric,
  primary key (symbol_id, date)
);
create index if not exists quotes_daily_symbol_date_desc_idx
  on public.quotes_daily (symbol_id, date desc);

create table if not exists public.macro_values (
  series_id uuid references public.macro_series(id) on delete cascade,
  date      date not null,
  value     numeric not null,
  primary key (series_id, date)
);
create index if not exists macro_values_series_date_desc_idx
  on public.macro_values (series_id, date desc);

-- ─────────────────────────────────────────────────────────────────
-- 5. Editorial
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.authors (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  bio        text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  label         text not null,
  description   text,
  display_order int default 0
);

create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  dek          text,
  body         text not null,
  hero_image   text,
  hero_alt     text,
  author_id    uuid references public.authors(id) on delete set null,
  category_id  uuid references public.categories(id) on delete set null,
  status       text not null default 'draft'
               check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index if not exists articles_category_published_idx
  on public.articles (category_id, published_at desc);
create index if not exists articles_status_published_idx
  on public.articles (status, published_at desc);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create table if not exists public.article_symbols (
  article_id uuid references public.articles(id) on delete cascade,
  symbol_id  uuid references public.symbols(id)  on delete cascade,
  primary key (article_id, symbol_id)
);

create table if not exists public.article_macros (
  article_id uuid references public.articles(id)     on delete cascade,
  series_id  uuid references public.macro_series(id) on delete cascade,
  primary key (article_id, series_id)
);

-- ─────────────────────────────────────────────────────────────────
-- 6. User layer (watchlists + alerts)
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.watchlist_groups (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  display_order int default 0,
  created_at    timestamptz default now()
);
create index if not exists watchlist_groups_user_idx
  on public.watchlist_groups (user_id, display_order);

create table if not exists public.watchlist_items (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid not null references public.watchlist_groups(id) on delete cascade,
  symbol_id uuid references public.symbols(id)      on delete cascade,
  macro_id  uuid references public.macro_series(id) on delete cascade,
  added_at  timestamptz default now(),
  check (num_nonnulls(symbol_id, macro_id) = 1)
);
create index if not exists watchlist_items_group_idx
  on public.watchlist_items (group_id);

create table if not exists public.alerts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  symbol_id     uuid references public.symbols(id)      on delete cascade,
  macro_id      uuid references public.macro_series(id) on delete cascade,
  condition     text not null check (condition in
                  ('above','below','crosses','pct_change')),
  threshold     numeric not null,
  period        text,                    -- '1d','1w' for pct_change
  notify_via    text[] default '{email}',
  active        boolean default true,
  last_fired_at timestamptz,
  created_at    timestamptz default now(),
  check (num_nonnulls(symbol_id, macro_id) = 1)
);
create index if not exists alerts_user_active_idx
  on public.alerts (user_id, active);

-- ─────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.currencies       enable row level security;
alter table public.exchanges        enable row level security;
alter table public.sectors          enable row level security;
alter table public.issuers          enable row level security;
alter table public.symbols          enable row level security;
alter table public.macro_series     enable row level security;
alter table public.quotes_daily     enable row level security;
alter table public.macro_values     enable row level security;
alter table public.authors          enable row level security;
alter table public.categories       enable row level security;
alter table public.articles         enable row level security;
alter table public.article_symbols  enable row level security;
alter table public.article_macros   enable row level security;
alter table public.watchlist_groups enable row level security;
alter table public.watchlist_items  enable row level security;
alter table public.alerts           enable row level security;

-- profiles: anyone reads, only owner (or admin) writes own row
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles
  for select using (true);

drop policy if exists profiles_self_upsert on public.profiles;
create policy profiles_self_upsert on public.profiles
  for update using (id = auth.uid() or public.is_admin())
              with check (id = auth.uid() or public.is_admin());

-- Reference / universe / time-series: world-readable, admin-writable.
-- Cron jobs use the service-role key, which bypasses RLS entirely.
do $$
declare
  t text;
begin
  foreach t in array array[
    'currencies','exchanges','sectors','issuers',
    'symbols','macro_series','quotes_daily','macro_values'
  ]
  loop
    execute format('drop policy if exists %I_read   on public.%I', t, t);
    execute format('drop policy if exists %I_admin  on public.%I', t, t);
    execute format(
      'create policy %I_read on public.%I for select using (true)',
      t, t
    );
    execute format(
      'create policy %I_admin on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end $$;

-- Editorial: published articles are public; drafts are admin-only
drop policy if exists articles_read_public on public.articles;
create policy articles_read_public on public.articles
  for select using (status = 'published' or public.is_admin());

drop policy if exists articles_admin_write on public.articles;
create policy articles_admin_write on public.articles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists authors_read on public.authors;
create policy authors_read on public.authors for select using (true);

drop policy if exists authors_admin on public.authors;
create policy authors_admin on public.authors
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);

drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists article_symbols_read on public.article_symbols;
create policy article_symbols_read on public.article_symbols
  for select using (true);

drop policy if exists article_symbols_admin on public.article_symbols;
create policy article_symbols_admin on public.article_symbols
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists article_macros_read on public.article_macros;
create policy article_macros_read on public.article_macros
  for select using (true);

drop policy if exists article_macros_admin on public.article_macros;
create policy article_macros_admin on public.article_macros
  for all using (public.is_admin()) with check (public.is_admin());

-- User-owned tables: only owner can do anything
drop policy if exists watchlist_groups_own on public.watchlist_groups;
create policy watchlist_groups_own on public.watchlist_groups
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists watchlist_items_own on public.watchlist_items;
create policy watchlist_items_own on public.watchlist_items
  for all using (
    exists (
      select 1 from public.watchlist_groups g
       where g.id = watchlist_items.group_id
         and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.watchlist_groups g
       where g.id = watchlist_items.group_id
         and g.user_id = auth.uid()
    )
  );

drop policy if exists alerts_own on public.alerts;
create policy alerts_own on public.alerts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
