import { publicClient } from '@/lib/supabase/public';
import { newsItems } from '@/data/news';

/**
 * Normalized article shape consumed by the homepage render components.
 * Works for both live (Supabase `articles`) and the seed fallback so the
 * homepage layout is source-agnostic.
 */
export type HomeArticle = {
  href: string;            // /news/<slug|id>
  title: string;
  dek: string | null;      // deck / summary
  categorySlug: string;    // drives category color
  categoryLabel: string;   // display label
  byline: string | null;   // author name, else source
  src: string | null;      // hero image URL (live articles)
  seedId?: string;         // seed id → enables storyPhoto() gradient/photo lookup
  date: string;            // ISO (live) or seed date string
};

const FEED_LIMIT = 40;

type DbArticle = {
  slug: string;
  title: string;
  dek: string | null;
  hero_image: string | null;
  published_at: string | null;
  category: { slug: string; label: string } | null;
  author: { name: string } | null;
};

function fromSeed(): HomeArticle[] {
  return newsItems.map((n) => ({
    href: `/news/${n.id}`,
    title: n.title,
    dek: n.summary ?? null,
    categorySlug: n.category,
    categoryLabel: n.category,
    byline: n.author ?? n.source ?? null,
    src: null,
    seedId: n.id,
    date: n.date,
  }));
}

/**
 * Homepage news feed. Returns live published articles when any exist; otherwise
 * falls back to the in-repo seed (clearly-editorial sample content). The page
 * auto-upgrades to fully live the moment editors publish through the admin.
 */
export async function getHomeFeed(): Promise<{ articles: HomeArticle[]; live: boolean }> {
  try {
    const { data } = await publicClient
      .from('articles')
      .select(
        `slug, title, dek, hero_image, published_at,
         category:categories(slug, label),
         author:authors(name)`,
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(FEED_LIMIT);

    const rows = (data ?? []) as unknown as DbArticle[];
    if (rows.length > 0) {
      const articles: HomeArticle[] = rows.map((a) => ({
        href: `/news/${a.slug}`,
        title: a.title,
        dek: a.dek,
        categorySlug: a.category?.slug ?? 'economy',
        categoryLabel: a.category?.label ?? 'News',
        byline: a.author?.name ?? null,
        src: a.hero_image,
        date: a.published_at ?? new Date().toISOString(),
      }));
      return { articles, live: true };
    }
  } catch {
    // network/DB error → fall through to seed
  }
  return { articles: fromSeed(), live: false };
}
