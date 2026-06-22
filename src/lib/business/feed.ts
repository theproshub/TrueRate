import { publicClient } from '@/lib/supabase/public';

export interface BusinessArticle {
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

export const BUSINESS_CATEGORY_SLUGS = [
  'business', 'small-business', 'entrepreneurship',
  'smes', 'trade', 'industry', 'mining',
  'credit', 'finance', 'banking',
];

export interface BusinessStory {
  category: string;
  categorySlug: string;
  title: string;
  dek?: string;
  author?: string;
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

export async function fetchBusinessArticles({
  slugs = BUSINESS_CATEGORY_SLUGS,
  limit = 24,
}: { slugs?: string[]; limit?: number } = {}): Promise<BusinessArticle[]> {
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

  return (data ?? []) as unknown as BusinessArticle[];
}

export function toBusinessStory(a: BusinessArticle): BusinessStory {
  return {
    category: a.category?.label ?? 'Business',
    categorySlug: a.category?.slug ?? 'business',
    title: a.title,
    dek: a.dek ?? undefined,
    author: a.author?.name ?? undefined,
    time: timeAgo(a.published_at),
    href: `/news/${a.slug}`,
    image: a.hero_image,
  };
}
