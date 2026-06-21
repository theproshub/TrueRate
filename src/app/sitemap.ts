import type { MetadataRoute } from 'next';
import { publicClient } from '@/lib/supabase/public';
import { ECONOMY_TOPICS } from '@/lib/economy-topics';

const SITE_URL = 'https://truerateliberia.com';

// Top-level routes that exist in src/app. Add new ones here when sections ship.
const sectionRoutes = [
  '',
  '/markets',
  '/economy',
  '/small-business',
  '/technology',
  '/sports',
  '/videos',
  '/news',
  '/about',
  '/help',
  '/feedback',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Section pages
  const sectionEntries: MetadataRoute.Sitemap = sectionRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'hourly' : 'daily',
    priority: path === '' ? 1 : 0.7,
  }));

  // Economy topic sub-pages
  const economyEntries: MetadataRoute.Sitemap = ECONOMY_TOPICS.map((t) => ({
    url: `${SITE_URL}/economy/${t.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  // Published articles from Supabase
  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const { data } = await publicClient
      .from('articles')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1000);

    if (data) {
      articleEntries = data.map((a) => ({
        url: `${SITE_URL}/news/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : (a.published_at ? new Date(a.published_at) : now),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // If Supabase is unreachable, ship the sitemap without articles.
  }

  return [...sectionEntries, ...economyEntries, ...articleEntries];
}
