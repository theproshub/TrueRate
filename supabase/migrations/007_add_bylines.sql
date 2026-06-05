-- Add the bylines used by drafts/field-sheets so the AUTHOR field matches a real
-- option instead of staying on "— None —". Idempotent.

insert into public.authors (slug, name) values
  ('julian-sackey',     'Julian Sackey'),
  ('truerate-newsroom', 'TrueRate Newsroom')
on conflict (slug) do nothing;
