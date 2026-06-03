-- Feedback: public submissions from the /feedback page.
--
-- Anyone (anonymous or signed-in) may INSERT a feedback row; only admins may
-- read or manage them. RLS is enabled in the same migration that creates the
-- table (TECHNICAL_ARCHITECTURE rule #2 — a Supabase table ships with RLS OFF
-- by default, which would otherwise expose every submission).
--
-- Idempotent: re-running is safe.

-- ─────────────────────────────────────────────────────────────────
-- 1. Table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'general'
              check (type in ('general', 'data_error', 'feature_request', 'bug_report', 'content_issue')),
  email       text,
  message     text not null check (char_length(message) between 1 and 5000),
  user_id     uuid references auth.users(id) on delete set null,
  user_agent  text,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Index: admin review queue, newest first
-- ─────────────────────────────────────────────────────────────────
create index if not exists feedback_created_idx
  on public.feedback (created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- 3. Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.feedback enable row level security;

-- Anyone may SUBMIT feedback. This is an insert-only grant for the public:
-- no SELECT policy is created for non-admins, so submissions are write-only
-- and one reader can never read another's feedback.
drop policy if exists feedback_insert_any on public.feedback;
create policy feedback_insert_any on public.feedback
  for insert
  with check (true);

-- Only admins may read or manage feedback. (The service-role key also bypasses
-- RLS for any server-side admin tooling.)
drop policy if exists feedback_admin_all on public.feedback;
create policy feedback_admin_all on public.feedback
  for all
  using      (public.is_admin())
  with check (public.is_admin());
