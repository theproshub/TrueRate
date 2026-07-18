-- 024: Switch the Liberian-dollar notation from "L$" to "LD$" across published
-- content and the currencies reference table.
--
-- Run manually in the Supabase SQL editor (data migration; no schema change).
-- The repo (seed news.ts, card templates, CLAUDE.md, lint) is already on LD$;
-- this brings the live DB in line.
--
-- Idempotent: "LD$" contains no "L$" substring (after L comes D, not $), so
-- replace(...,'L$','LD$') is a no-op on already-converted text — safe to re-run.
-- US$ is never touched (it has no "L$").

-- 1) Currencies reference table (was seeded as 'L$' in migration 003)
update public.currencies
set symbol = 'LD$'
where code = 'LRD' and symbol = 'L$';

-- 2) Article title / dek / body — every "L$" becomes "LD$".
update public.articles
set
  title = replace(title, 'L$', 'LD$'),
  dek   = replace(dek,   'L$', 'LD$'),
  body  = replace(body,  'L$', 'LD$')
where title like '%L$%' or dek like '%L$%' or body like '%L$%';

-- 3) Sanity check — expect 0 rows still containing bare "L$" after the update.
-- select count(*) as remaining_l_dollar
-- from public.articles
-- where title like '%L$%' or dek like '%L$%' or body like '%L$%';
