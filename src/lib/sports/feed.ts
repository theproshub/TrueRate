import { publicClient } from '@/lib/supabase/public';
import type { StoryFlag } from '@/lib/sports-finance-data';

/**
 * Backend feed for the /sports section — same pattern as fetchEconomyArticles
 * in src/app/economy/page.tsx. Reads published rows from the Supabase
 * `articles` table, filtered to sports categories, newest first.
 *
 * The section ships with mock content for the design preview; these helpers let
 * the editorial surfaces (hero, story streams, desk pages) switch to real CMS
 * data the moment articles are published under a sports category — no UI change
 * required. Numeric "intelligence" modules (valuations, deal feeds) stay on mock
 * until they have their own backing tables.
 */

export interface SportsArticle {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  hero_image: string | null;
  hero_alt: string | null;
  published_at: string | null;
  category: { slug: string; label: string } | null;
  author: { name: string } | null;
}

/** Category slugs that belong to the sports section (desks + verticals + generic). */
export const SPORTS_CATEGORY_SLUGS = [
  'sports',
  'football', 'basketball', 'athletics', 'youth-sports', 'womens-sports',
  'transfers', 'transfers-deals', 'sports-business', 'sponsorship',
  'sports-finance', 'club-finance', 'broadcast-rights', 'governance',
  'sports-governance', 'technology', 'sports-technology', 'interviews',
  'data-research', 'opinion',
];

/** Normalised editorial card shape consumed by the section's components. */
export interface FeedStory {
  category: string;       // display label
  categorySlug: string;   // for accent colour / thumbnail
  title: string;
  dek?: string;
  author?: string;
  time: string;
  href: string;           // canonical article URL
  image?: string | null;  // hero photo, if any
  flag?: StoryFlag;
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Fetch published sports articles, newest first.
 * @param slugs Restrict to these category slugs (defaults to the whole section).
 * @param limit Max rows.
 */
export async function fetchSportsArticles({
  slugs = SPORTS_CATEGORY_SLUGS,
  limit = 24,
}: { slugs?: string[]; limit?: number } = {}): Promise<SportsArticle[]> {
  const { data: cats } = await publicClient.from('categories').select('id, slug');
  const ids = (cats ?? [])
    .filter((c) => slugs.includes((c as { slug: string }).slug))
    .map((c) => (c as { id: string }).id);
  if (ids.length === 0) return [];

  const { data } = await publicClient
    .from('articles')
    .select(
      `id, slug, title, dek, hero_image, hero_alt, published_at,
       category:categories(slug, label),
       author:authors(name)`,
    )
    .eq('status', 'published')
    .in('category_id', ids)
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as unknown as SportsArticle[];
}

/** Map a DB article to the editorial card shape the components render. */
export function toFeedStory(a: SportsArticle): FeedStory {
  return {
    category: a.category?.label ?? 'Sports',
    categorySlug: a.category?.slug ?? 'sports',
    title: a.title,
    dek: a.dek ?? undefined,
    author: a.author?.name ?? undefined,
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}
