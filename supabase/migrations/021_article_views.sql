-- Track article opens for engagement-based section ordering
-- (Most Read, Trending, Lead Stories, etc.)

-- 1. Granular view events — enables time-windowed queries (trending = last 48h)
create table if not exists article_views (
  id          uuid primary key default gen_random_uuid(),
  article_id  uuid not null references articles(id) on delete cascade,
  viewer_hash text not null,            -- SHA-256 of IP, for 30-min dedup
  viewed_at   timestamptz not null default now()
);

-- Fast lookups: "views for article X in time range" and dedup check
create index idx_article_views_article_time
  on article_views (article_id, viewed_at desc);

create index idx_article_views_dedup
  on article_views (article_id, viewer_hash, viewed_at desc);

-- 2. Denormalized counter on articles for fast "order by popularity" reads
alter table articles
  add column if not exists view_count integer not null default 0;

create index idx_articles_view_count
  on articles (view_count desc)
  where status = 'published';

-- 3. RLS: anyone can insert (anon tracks views), only service role deletes
alter table article_views enable row level security;

create policy "Anyone can record a view"
  on article_views for insert
  with check (true);

create policy "Anyone can read views"
  on article_views for select
  using (true);

-- 4. Trending: articles ranked by view velocity in a sliding window
create or replace function trending_articles(hours int default 48, max_results int default 20)
returns table(article_id uuid, recent_views bigint)
language sql
stable
security definer
as $$
  select av.article_id, count(*) as recent_views
  from article_views av
  join articles a on a.id = av.article_id
  where av.viewed_at >= now() - make_interval(hours => hours)
    and a.status = 'published'
  group by av.article_id
  order by recent_views desc
  limit max_results;
$$;

-- 5. Atomic counter increment callable from the anon client
create or replace function increment_view_count(target_id uuid)
returns void
language sql
security definer
as $$
  update articles
  set view_count = view_count + 1
  where id = target_id;
$$;
