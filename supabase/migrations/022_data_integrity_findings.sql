-- 022: Data integrity findings + 'pending' article status
--
-- The CBL data warehouse (cbl_series / cbl_observations) is READ-ONLY, always.
-- When TrueRate's verification pipeline disagrees with warehouse data — identity
-- violations, impossible sub-components, extreme outliers — the discrepancy is
-- filed here as a finding for human review at /admin/data-integrity. The
-- warehouse row is never edited by the pipeline.
--
-- Articles blocked by a finding are parked at articles.status = 'pending'
-- (visible on the admin dashboard) until the finding is resolved or dismissed.

-- ── 1. articles gains a 'pending' status ─────────────────────────
alter table public.articles drop constraint if exists articles_status_check;
alter table public.articles
  add constraint articles_status_check
  check (status in ('draft', 'pending', 'published', 'archived'));

-- ── 2. findings table ─────────────────────────────────────────────
create table if not exists public.data_integrity_findings (
  id              uuid primary key default gen_random_uuid(),
  severity        text not null
                  check (severity in ('critical', 'high', 'medium', 'low')),
  title           text not null,
  -- Markdown: the mathematical proof / evidence for the finding.
  detail          text not null,
  -- What the finding is about (nullable: some findings span series).
  series_mnemonic text,
  period_label    text,
  -- Slugs of articles that cite the disputed figure.
  affected_slugs  text[] not null default '{}',
  status          text not null default 'open'
                  check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  resolution_note text,
  resolved_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists data_integrity_findings_status_idx
  on public.data_integrity_findings (status, severity, created_at desc);

drop trigger if exists data_integrity_findings_set_updated_at on public.data_integrity_findings;
create trigger data_integrity_findings_set_updated_at
  before update on public.data_integrity_findings
  for each row execute function public.set_updated_at();

-- Admin-only. The verification pipeline writes via the service role, which
-- bypasses RLS; browser users must be admins to read or review.
alter table public.data_integrity_findings enable row level security;

drop policy if exists data_integrity_findings_admin_all on public.data_integrity_findings;
create policy data_integrity_findings_admin_all on public.data_integrity_findings
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── 3. Seed: the open finding from the 2026-07-06 audit ──────────
insert into public.data_integrity_findings
  (severity, title, detail, series_mnemonic, period_label, affected_slugs)
select
  'critical',
  'Mar-26 fiscal expenditure breakdown violates the adding-up identity',
  $md$The identity **Total expenditure = Recurrent + Capital + Loans, Interest & Other Charges** holds exactly for every month Oct-25 through Feb-26, but fails in Mar-26:

| Series | Mnemonic | Mar-26 value (US$M) |
|---|---|---|
| Total expenditure | LBR_FIS_BUD_2 | 136.57 |
| Recurrent | LBR_FIS_BUD_2_1 | 18.17 |
| Capital | LBR_FIS_BUD_2_2 | 49.68 |
| Loans, Interest & Other | LBR_FIS_BUD_2_1_2 | 11.15 |
| **Components sum** | | **79.00** (gap: 57.57) |

Independent corruption signal: **Salary & Wages (LBR_FIS_BUD_2_1_1) = 32.24 exceeds its parent Recurrent (18.17)** — impossible, and unique to Mar-26 in the series history.

Identity-implied Recurrent = 136.57 − 49.68 − 11.15 = **75.74**.

**Review action:** check the Ministry of Finance / CBL source publication for March 2026. If the source confirms Total = 136.57 with a mis-keyed breakdown, the upstream ingestion should be re-run from the corrected source. The warehouse is not edited directly.$md$,
  'LBR_FIS_BUD_2_1',
  'Mar-26',
  array['government-revenue-surges-march-2026', 'liberia-gst-to-vat-transition']
where not exists (
  select 1 from public.data_integrity_findings
  where series_mnemonic = 'LBR_FIS_BUD_2_1' and period_label = 'Mar-26'
);
