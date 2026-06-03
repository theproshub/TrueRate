-- Saved Articles: a signed-in reader's bookmarked articles.
--
-- User-owned table. RLS is scoped to auth.uid() exactly like watchlist_groups
-- /alerts (migration 001) — only the owner can read or write their own rows.
-- A Supabase table ships with RLS OFF by default, so RLS is enabled here in the
-- same migration that creates the table (per TECHNICAL_ARCHITECTURE rule #2).
--
-- Idempotent: re-running is safe.

-- ─────────────────────────────────────────────────────────────────
-- 1. Table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.saved_articles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id)    on delete cascade,
  article_id  uuid not null references public.articles(id) on delete cascade,
  created_at  timestamptz default now(),
  -- A reader can save a given article at most once.
  unique (user_id, article_id)
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Index: "list my saved articles, newest first"
-- ─────────────────────────────────────────────────────────────────
create index if not exists saved_articles_user_idx
  on public.saved_articles (user_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- 3. Row Level Security — owner-only
-- ─────────────────────────────────────────────────────────────────
alter table public.saved_articles enable row level security;

-- One FOR ALL policy: the owner can do anything to their own rows, nobody
-- else can see or touch them. Both USING (read/update/delete visibility) and
-- WITH CHECK (insert/update values) are set so a user cannot insert a row
-- owned by someone else. Never `using (true)` here — that would expose every
-- reader's saved list. The service-role key bypasses RLS for any admin tooling.
drop policy if exists saved_articles_own on public.saved_articles;
create policy saved_articles_own on public.saved_articles
  for all
  using      (user_id = auth.uid())
  with check (user_id = auth.uid());
