import { publicClient } from '@/lib/supabase/public';

/**
 * Backend feed for the /technology section — same pattern as
 * fetchEconomyArticles (src/app/economy/page.tsx), fetchSportsArticles and
 * fetchEntertainmentArticles. Reads published rows from the Supabase `articles`
 * table, filtered to technology categories, newest first.
 *
 * TrueRate principle (see CLAUDE.md + memory): never ship fabricated content.
 * The section ships with mock content ONLY for the design preview; this helper
 * lets every editorial surface switch to real CMS data the moment articles are
 * published under a technology category — no UI change required. While the feed
 * is empty the page shows a prominent "Sample data" banner.
 */

export interface TechnologyArticle {
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

/** Category slugs that belong to the technology section (topics + generic). */
export const TECHNOLOGY_CATEGORY_SLUGS = [
  'technology', 'tech',
  'startups', 'fintech', 'ai-innovation', 'ai',
  'digital-economy', 'infrastructure',
  'telecom', 'hardware', 'e-commerce', 'education',
];

/** Normalised editorial card shape consumed by the section's components. */
export interface TechStory {
  category: string;       // display label
  categorySlug: string;   // for accent colour / thumbnail
  title: string;
  dek?: string;
  author?: string;
  time: string;
  href: string;           // canonical article URL
  image?: string | null;  // hero photo, if any
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Fetch published technology articles, newest first.
 * @param slugs Restrict to these category slugs (defaults to the whole section).
 * @param limit Max rows.
 */
export async function fetchTechnologyArticles({
  slugs = TECHNOLOGY_CATEGORY_SLUGS,
  limit = 24,
}: { slugs?: string[]; limit?: number } = {}): Promise<TechnologyArticle[]> {
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

  return (data ?? []) as unknown as TechnologyArticle[];
}

/** Map a DB article to the editorial card shape the components render. */
export function toTechStory(a: TechnologyArticle): TechStory {
  return {
    category: a.category?.label ?? 'Technology',
    categorySlug: a.category?.slug ?? 'technology',
    title: a.title,
    dek: a.dek ?? undefined,
    author: a.author?.name ?? undefined,
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}
