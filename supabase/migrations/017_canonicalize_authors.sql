-- Canonicalize author/byline sprawl: 20 desk rows -> 10 canonical bylines.
--
-- Order is mandatory and safe: (1) ensure canonical rows exist, (2) repoint
-- every article from an old row to its canonical row, (3) delete the orphaned
-- old rows LAST. Wrapped in a transaction and fully re-runnable (idempotent):
-- a second run finds no old rows to repoint and nothing to delete.
--
-- NOTE: the articles table is currently empty, so step (2) repoints 0 rows
-- today; it is written for correctness/future-proofing.
--
-- Canonical set (slug -> name):
--   julian-sackey        Julian Sackey
--   truerate-newsroom    TrueRate Newsroom
--   truerate-economics   TrueRate Economics
--   truerate-business    TrueRate Business
--   truerate-mining      TrueRate Mining
--   truerate-agriculture TrueRate Agriculture
--   truerate-energy      TrueRate Energy
--   truerate-sports      TrueRate Sports
--   truerate-tech        TrueRate Tech
--   editorial-board      TrueRate Editorial Board

begin;

-- (1) Ensure the 10 canonical author rows exist (converges names on re-run).
insert into public.authors (slug, name) values
  ('julian-sackey',        'Julian Sackey'),
  ('truerate-newsroom',    'TrueRate Newsroom'),
  ('truerate-economics',   'TrueRate Economics'),
  ('truerate-business',    'TrueRate Business'),
  ('truerate-mining',      'TrueRate Mining'),
  ('truerate-agriculture', 'TrueRate Agriculture'),
  ('truerate-energy',      'TrueRate Energy'),
  ('truerate-sports',      'TrueRate Sports'),
  ('truerate-tech',        'TrueRate Tech'),
  ('editorial-board',      'TrueRate Editorial Board')
on conflict (slug) do update set name = excluded.name;

-- (2) Repoint every article from an old byline to its canonical byline.
with repoint(old_slug, new_slug) as (values
  ('news-desk',          'truerate-newsroom'),
  ('investigation-team', 'julian-sackey'),      -- "Investigation Team" dropped -> Julian Sackey
  ('economics-desk',     'truerate-economics'),
  ('finance-desk',       'truerate-economics'),
  ('markets-desk',       'truerate-economics'),
  ('analysis',           'truerate-economics'),
  ('trade-desk',         'truerate-economics'),
  ('business-desk',      'truerate-business'),
  ('development-desk',   'truerate-business'),
  ('mining-desk',        'truerate-mining'),
  ('agriculture-desk',   'truerate-agriculture'),
  ('energy-desk',        'truerate-energy'),
  ('sports-desk',        'truerate-sports'),
  ('tech-desk',          'truerate-tech'),
  ('technology-desk',    'truerate-tech'),
  ('tech-finance-desk',  'truerate-tech'),
  ('opinion',            'editorial-board')
),
resolved as (
  select old_a.id as old_id, new_a.id as new_id
  from repoint r
  join public.authors old_a on old_a.slug = r.old_slug
  join public.authors new_a on new_a.slug = r.new_slug
)
update public.articles a
   set author_id = resolved.new_id
  from resolved
 where a.author_id = resolved.old_id;

-- (3) Delete the now-orphaned old rows LAST (only the mapped old slugs).
delete from public.authors
 where slug in (
   'news-desk','investigation-team','economics-desk','finance-desk','markets-desk',
   'analysis','trade-desk','business-desk','development-desk','mining-desk',
   'agriculture-desk','energy-desk','sports-desk','tech-desk','technology-desk',
   'tech-finance-desk','opinion'
 );

commit;

-- Sanity (run manually after): expect exactly the 10 canonical slugs.
--   select slug, name from public.authors order by name;
