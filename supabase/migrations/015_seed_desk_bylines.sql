-- Seed the desk/team bylines used across the site (src/data/news.ts) so the CMS
-- author dropdown matches the public bylines, plus News & Sports desks.
-- Idempotent.

insert into public.authors (slug, name) values
  ('news-desk',          'TrueRate News Desk'),
  ('economics-desk',     'TrueRate Economics Desk'),
  ('markets-desk',       'TrueRate Markets Desk'),
  ('business-desk',      'TrueRate Business Desk'),
  ('finance-desk',       'TrueRate Finance Desk'),
  ('trade-desk',         'TrueRate Trade Desk'),
  ('agriculture-desk',   'TrueRate Agriculture Desk'),
  ('development-desk',   'TrueRate Development Desk'),
  ('energy-desk',        'TrueRate Energy Desk'),
  ('mining-desk',        'TrueRate Mining Desk'),
  ('technology-desk',    'TrueRate Technology Desk'),
  ('tech-desk',          'TrueRate Tech Desk'),
  ('tech-finance-desk',  'TrueRate Tech & Finance Desk'),
  ('sports-desk',        'TrueRate Sports Desk'),
  ('analysis',           'TrueRate Analysis'),
  ('investigation-team', 'TrueRate Investigation Team'),
  ('opinion',            'TrueRate Opinion')
on conflict (slug) do nothing;
