-- CBL release monitoring. Run manually in the Supabase SQL editor.
-- Design: docs/superpowers/specs/2026-08-13-cbl-release-monitoring-design.md

create table if not exists cbl_releases (
  id           uuid primary key default gen_random_uuid(),
  run_id       uuid        not null,
  detected_at  timestamptz not null default now(),
  kind         text        not null check (kind in
                 ('new_period','revision','series_missing','series_failed')),
  mnemonic     text        not null,
  period_date  date,
  period_label text,
  old_value    numeric,
  new_value    numeric,
  detail       text
);

create index if not exists cbl_releases_detected_at_idx on cbl_releases (detected_at desc);
create index if not exists cbl_releases_run_id_idx      on cbl_releases (run_id);
create index if not exists cbl_releases_mnemonic_idx    on cbl_releases (mnemonic);

alter table articles
  add column if not exists needs_refresh  boolean not null default false,
  add column if not exists refresh_reason text;
