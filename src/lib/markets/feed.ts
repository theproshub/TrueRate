import { publicClient } from '@/lib/supabase/public';

export interface MarketsArticle {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  hero_image: string | null;
  hero_alt: string | null;
  published_at: string | null;
  source_name: string | null;
  category: { slug: string; label: string } | null;
  author: { name: string } | null;
}

export const MARKETS_CATEGORY_SLUGS = [
  'forex', 'commodities', 'markets', 'investing', 'banking',
];

export interface MarketsStory {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  summary?: string;
  dek?: string;
  author?: string;
  source?: string;
  time: string;
  href: string;
  image?: string | null;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export async function fetchMarketsArticles({
  slugs = MARKETS_CATEGORY_SLUGS,
  limit = 30,
}: { slugs?: string[]; limit?: number } = {}): Promise<MarketsArticle[]> {
  const { data: cats } = await publicClient.from('categories').select('id, slug');
  const ids = (cats ?? [])
    .filter((c) => slugs.includes((c as { slug: string }).slug))
    .map((c) => (c as { id: string }).id);
  if (ids.length === 0) return [];

  const { data } = await publicClient
    .from('articles')
    .select(
      `id, slug, title, dek, hero_image, hero_alt, published_at, source_name,
       category:categories(slug, label),
       author:authors(name)`,
    )
    .eq('status', 'published')
    .in('category_id', ids)
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as unknown as MarketsArticle[];
}

export function toMarketsStory(a: MarketsArticle): MarketsStory {
  return {
    id: a.id,
    category: a.category?.label ?? 'Markets',
    categorySlug: a.category?.slug ?? 'markets',
    title: a.title,
    dek: a.dek ?? undefined,
    summary: a.dek ?? undefined,
    author: a.author?.name ?? undefined,
    source: a.source_name ?? 'TrueRate',
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}
