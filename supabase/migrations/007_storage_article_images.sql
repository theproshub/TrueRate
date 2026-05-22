-- Storage bucket for article hero/inline images.
-- Public read (so <img src> works without auth), admin-only writes.
-- Apply via the Supabase SQL Editor. Idempotent.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  10485760,  -- 10 MB
  array['image/jpeg','image/png','image/webp','image/avif','image/gif']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies on storage.objects scoped to this bucket.
drop policy if exists "article_images_public_read"   on storage.objects;
drop policy if exists "article_images_admin_insert"  on storage.objects;
drop policy if exists "article_images_admin_update"  on storage.objects;
drop policy if exists "article_images_admin_delete"  on storage.objects;

create policy "article_images_public_read"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "article_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'article-images' and public.is_admin());

create policy "article_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'article-images' and public.is_admin())
  with check (bucket_id = 'article-images' and public.is_admin());

create policy "article_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'article-images' and public.is_admin());
