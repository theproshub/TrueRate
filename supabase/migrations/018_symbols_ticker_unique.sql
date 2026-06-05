-- 018: Close the duplicate-symbols loophole.
--
-- The original constraint `unique (ticker, mic, asset_class)` is ineffective
-- for our data because `mic` is NULL for every symbol, and Postgres treats
-- NULLs as DISTINCT in a unique index — so a second seed run inserted a full
-- duplicate set (12 tickers × 2). scripts/dedupe-symbols.mjs removes the
-- existing duplicates; this migration prevents recurrence by treating NULLs as
-- equal (Postgres 15+ `NULLS NOT DISTINCT`).
--
-- Run AFTER `node scripts/dedupe-symbols.mjs --apply` (table must be
-- duplicate-free first). Apply manually in the Supabase SQL editor (project
-- convention: DDL is run by hand).

begin;

-- Drop the existing unique constraint on (ticker, mic, asset_class) by whatever
-- name Postgres auto-assigned it, so this is robust across environments.
do $$
declare
  c text;
begin
  select con.conname into c
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'symbols'
    and con.contype = 'u'
    and (
      select array_agg(att.attname order by att.attname)
      from unnest(con.conkey) as k(attnum)
      join pg_attribute att on att.attrelid = con.conrelid and att.attnum = k.attnum
    ) = array['asset_class','mic','ticker']
  limit 1;

  if c is not null then
    execute format('alter table public.symbols drop constraint %I', c);
  end if;
end $$;

alter table public.symbols
  add constraint symbols_ticker_mic_asset_class_key
  unique nulls not distinct (ticker, mic, asset_class);

commit;
