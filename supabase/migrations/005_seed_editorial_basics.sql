-- Seed categories + a default author so the CMS has something to attach
-- articles to from day one. Slugs match the existing top-level site nav.
-- Idempotent.

insert into public.categories (slug, label, description, display_order) values
  ('economy',        'Economy',         'Liberia macro, fiscal, monetary, and global impact stories', 10),
  ('markets',        'Markets',         'Regional equities, FX, commodities, and indices',            20),
  ('business',       'Business',        'Corporate news, deals, earnings, and industry coverage',     30),
  ('small-business', 'Small Business',  'Entrepreneurship, MSMEs, and local enterprise',              40),
  ('technology',     'Technology',      'Fintech, telecom, startups, infrastructure',                 50),
  ('entertainment',  'Entertainment',   'Music, film, culture, lifestyle',                            60),
  ('sports',         'Sports',          'LPL, LWPL, LBA, Lone Star, athletics',                       70),
  ('videos',         'Videos',          'Video reports, interviews, explainers',                      80),
  ('opinion',        'Opinion',         'Editorials, columns, analysis from outside contributors',    90),
  ('analysis',       'Analysis',        'In-depth analysis from the TrueRate research team',          100),
  ('world',          'World',           'International news with bearing on Liberia',                 110)
on conflict (slug) do nothing;

insert into public.authors (slug, name, bio) values
  ('editorial-board', 'TrueRate Editorial Board',
   'TrueRate''s staff editors and reporters cover Liberia''s economy, markets, and policy.')
on conflict (slug) do nothing;
