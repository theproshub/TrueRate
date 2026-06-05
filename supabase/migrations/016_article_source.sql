-- Yahoo/Bloomberg-style outlet attribution: credit the originating news outlet
-- (name + optional link) on an article, separate from the TrueRate byline.

alter table public.articles add column if not exists source_name text;
alter table public.articles add column if not exists source_url  text;
