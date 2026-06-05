-- Add a top-level "News" category. Drafts/field-sheets commonly tag stories as
-- CATEGORY: News, and it's the primary site section, so it sorts first.
-- Idempotent.

insert into public.categories (slug, label, description, display_order) values
  ('news', 'News', 'Breaking news and top headlines across Liberia', 5)
on conflict (slug) do nothing;
