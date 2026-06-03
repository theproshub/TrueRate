-- Business Claim: a user requests control of a Business Directory listing
-- (public.issuers). A claim is a REQUEST that an admin verifies before any
-- control is transferred — claimants can never approve their own claim.
--
-- Compliance (LEGAL_AND_COMPLIANCE.md, Privacy & Personal Data):
--   • Verify the claimant's right to a listing before transferring control.
--   • Do NOT expose private contact data in public fields/URLs. The contact_*
--     columns here are gated by RLS to the claimant + admins only; the app
--     layer must never surface them on the public issuer page.
--
-- RLS model (least privilege, split by command — NOT a single FOR ALL):
--   • claimant: INSERT own claim (pending only), SELECT own, DELETE own pending
--   • admin:    full control incl. UPDATE (approve/reject) and SELECT all
--   • status changes are admin-only, so a claimant cannot self-approve.
--
-- Idempotent: re-running is safe.

-- ─────────────────────────────────────────────────────────────────
-- 1. Table
-- ─────────────────────────────────────────────────────────────────
create table if not exists public.business_claims (
  id               uuid primary key default gen_random_uuid(),
  issuer_id        uuid not null references public.issuers(id) on delete cascade,
  user_id          uuid not null references auth.users(id)     on delete cascade, -- claimant
  status           text not null default 'pending'
                   check (status in ('pending','approved','rejected','withdrawn')),

  -- Private verification data — readable only by the claimant + admins (RLS).
  contact_name     text,
  contact_email    text,
  contact_phone    text,
  role_at_business text,   -- claimant's stated role (owner, director, manager…)
  evidence_url     text,   -- link/upload proving association (e.g. letterhead)
  note             text,   -- free-text message from the claimant

  -- Review metadata — written by admins only (UPDATE is admin-gated below).
  reviewed_by      uuid references auth.users(id) on delete set null,
  reviewed_at      timestamptz,
  review_note      text,

  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. Indexes
-- ─────────────────────────────────────────────────────────────────
-- At most one *active* (pending or approved) claim per issuer+user. Rejected /
-- withdrawn rows are kept for audit and don't block a fresh attempt.
create unique index if not exists business_claims_issuer_user_active_idx
  on public.business_claims (issuer_id, user_id)
  where status in ('pending','approved');

-- Admin review queue: pending first, newest first.
create index if not exists business_claims_status_idx
  on public.business_claims (status, created_at desc);

-- "My claims" lookup for the claimant.
create index if not exists business_claims_user_idx
  on public.business_claims (user_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- 3. updated_at trigger (reuses the shared helper from migration 001)
-- ─────────────────────────────────────────────────────────────────
drop trigger if exists business_claims_set_updated_at on public.business_claims;
create trigger business_claims_set_updated_at
  before update on public.business_claims
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ─────────────────────────────────────────────────────────────────
alter table public.business_claims enable row level security;

-- Claimant may file a claim FOR THEMSELVES, and only in the 'pending' state.
-- Pinning status='pending' in WITH CHECK stops a user from inserting a row
-- pre-marked 'approved'.
drop policy if exists business_claims_insert_own on public.business_claims;
create policy business_claims_insert_own on public.business_claims
  for insert
  with check (user_id = auth.uid() and status = 'pending');

-- Claimant reads their own claims; admins read all (incl. private contact_*).
drop policy if exists business_claims_select_own_or_admin on public.business_claims;
create policy business_claims_select_own_or_admin on public.business_claims
  for select
  using (user_id = auth.uid() or public.is_admin());

-- Claimant may withdraw (delete) ONLY their own still-pending claim.
drop policy if exists business_claims_withdraw_own on public.business_claims;
create policy business_claims_withdraw_own on public.business_claims
  for delete
  using (user_id = auth.uid() and status = 'pending');

-- Admins have full control (approve/reject via UPDATE, plus insert/delete).
-- There is intentionally NO claimant UPDATE policy: only admins change status,
-- so control transfer is always admin-verified.
drop policy if exists business_claims_admin_all on public.business_claims;
create policy business_claims_admin_all on public.business_claims
  for all
  using      (public.is_admin())
  with check (public.is_admin());
