-- Newsletter subscribers: public signups from the sidebar Daily Brief widget
-- and the Business Brief inline form.
--
-- Anyone (anonymous or signed-in) may INSERT a subscription; only admins may
-- read or manage them. RLS is enabled in the same migration that creates the
-- table (TECHNICAL_ARCHITECTURE rule #2 — a Supabase table ships with RLS OFF
-- by default, which would otherwise expose every subscriber's email).
--
-- Idempotent: re-running is safe.

-- ─────────────────────────────────────────────────────────────────
-- 1. Table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null
              check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and char_length(email) <= 254),
  source      text not null default 'daily_brief'
              check (source in ('daily_brief', 'business_brief')),
  user_agent  text,
  created_at  timestamptz default now(),
  unique (email, source)
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Index: admin review queue, newest first
-- ─────────────────────────────────────────────────────────────────
create index if not exists newsletter_subscribers_created_idx
  on public.newsletter_subscribers (created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- 3. Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.newsletter_subscribers enable row level security;

-- Anyone may SUBSCRIBE. Insert-only grant for the public: no SELECT policy
-- is created for non-admins, so the subscriber list is write-only and one
-- visitor can never read another's email.
drop policy if exists newsletter_subscribers_insert_any on public.newsletter_subscribers;
create policy newsletter_subscribers_insert_any on public.newsletter_subscribers
  for insert
  with check (true);

-- Only admins may read or manage subscribers. (The service-role key also
-- bypasses RLS for any server-side mailing tooling.)
drop policy if exists newsletter_subscribers_admin_all on public.newsletter_subscribers;
create policy newsletter_subscribers_admin_all on public.newsletter_subscribers
  for all
  using      (public.is_admin())
  with check (public.is_admin());
