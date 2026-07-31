-- 025: Revert the Liberian-dollar notation from "LD$" back to "L$" across
-- published content and the currencies reference table.
--
-- Undoes migration 024. "L$" is the correct abbreviation for the Liberian
-- dollar; "LD$" doubled the D of "dollar" and is not used.
--
-- Run manually in the Supabase SQL editor (data migration; no schema change).
-- The repo (seed news.ts, hook bank, card templates, CLAUDE.md, lint E1) is
-- already back on L$; this brings the live DB in line.
--
-- Idempotent: after the replace no "LD$" remains, so re-running is a no-op.
-- US$ is never touched (it has no "LD$").

-- 1) Currencies reference table
update public.currencies
set symbol = 'L$'
where code = 'LRD' and symbol = 'LD$';

-- 2) Article title / dek / body — every "LD$" becomes "L$".
update public.articles
set
  title = replace(title, 'LD$', 'L$'),
  dek   = replace(dek,   'LD$', 'L$'),
  body  = replace(body,  'LD$', 'L$')
where title like '%LD$%' or dek like '%LD$%' or body like '%LD$%';

-- 3) Sanity check — expect 0 rows still containing "LD$" after the update.
-- select count(*) as remaining_ld_dollar
-- from public.articles
-- where title like '%LD$%' or dek like '%LD$%' or body like '%LD$%';
