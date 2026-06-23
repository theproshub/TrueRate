import 'server-only';
import { cache } from 'react';
import { publicClient } from '@/lib/supabase/public';
import { newsItems as seedNewsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';

/**
 * Single source of truth for the public news listings. Reads published
 * articles from the Supabase `articles` table and maps them back into the
 * in-app `NewsItem` shape so existing listing components render unchanged.
 *
 * Falls back to the in-repo seed (src/data/news.ts) when the DB has no
 * published rows or is unreachable — mirroring getHomeFeed(), so the site
 * degrades gracefully and never renders an empty news section.
 *
 * Slugs of seed-imported articles equal their original seed id ('1'…'48'),
 * so /news/<id> URLs and story-photo lookups keep working.
 */

type DbRow = {
  slug: string;
  title: string;
  dek: string | null;
  body: string;
  hero_image: string | null;
  published_at: string | null;
  source_name: string | null;
  view_count?: number;
  category: { slug: string } | null;
  author: { name: string } | null;
};

function readMinutes(body: string): string {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function toNewsItem(a: DbRow): NewsItem {
  return {
    id: a.slug,
    title: a.title,
    summary: a.dek ?? '',
    image: a.hero_image ?? undefined,
    source: a.source_name ?? 'TrueRate',
    date: a.published_at ?? new Date().toISOString(),
    category: (a.category?.slug ?? 'economy') as NewsItem['category'],
    body: a.body ? a.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : undefined,
    readTime: readMinutes(a.body ?? ''),
    author: a.author?.name ?? undefined,
  };
}

/**
 * Published articles as NewsItem[], newest first. DB when populated, else seed.
 * Cached per request via React's cache() so multiple components on one page
 * share a single query.
 */
export const getNewsItems = cache(async (): Promise<NewsItem[]> => {
  try {
    const { data } = await publicClient
      .from('articles')
      .select(
        `slug, title, dek, body, hero_image, published_at, source_name,
         category:categories(slug),
         author:authors(name)`,
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    const rows = (data ?? []) as unknown as DbRow[];
    if (rows.length > 0) return rows.map(toNewsItem);
  } catch {
    // fall through to seed
  }
  return seedNewsItems;
});

export const getPopularNewsItems = cache(async (): Promise<NewsItem[]> => {
  try {
    const { data } = await publicClient
      .from('articles')
      .select(
        `slug, title, dek, body, hero_image, published_at, source_name, view_count,
         category:categories(slug),
         author:authors(name)`,
      )
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(20);

    const rows = (data ?? []) as unknown as DbRow[];
    if (rows.length > 0) {
      const withViews = rows.filter((r) => (r.view_count ?? 0) > 0);
      if (withViews.length >= 3) return withViews.map(toNewsItem);
    }
  } catch {
    // fall through
  }
  return [];
});
