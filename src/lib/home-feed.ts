import { publicClient } from '@/lib/supabase/public';
import { newsItems } from '@/data/news';

export type HomeArticle = {
  href: string;
  title: string;
  dek: string | null;
  categorySlug: string;
  categoryLabel: string;
  byline: string | null;
  src: string | null;
  seedId?: string;
  date: string;
  viewCount: number;
};

export type HomeFeed = {
  recent: HomeArticle[];
  popular: HomeArticle[];
  trending: HomeArticle[];
  live: boolean;
};

const FEED_LIMIT = 60;

type DbArticle = {
  slug: string;
  title: string;
  dek: string | null;
  hero_image: string | null;
  published_at: string | null;
  view_count: number;
  category: { slug: string; label: string } | null;
  author: { name: string } | null;
};

type TrendingRow = {
  article_id: string;
  recent_views: number;
};

function toHomeArticle(a: DbArticle): HomeArticle {
  return {
    href: `/news/${a.slug}`,
    title: a.title,
    dek: a.dek,
    categorySlug: a.category?.slug ?? 'economy',
    categoryLabel: a.category?.label ?? 'News',
    byline: a.author?.name ?? null,
    src: a.hero_image,
    seedId: a.slug,
    date: a.published_at ?? new Date().toISOString(),
    viewCount: a.view_count ?? 0,
  };
}

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
    viewCount: 0,
  }));
}

export async function getHomeFeed(): Promise<HomeFeed> {
  try {
    const selectCols = `slug, title, dek, hero_image, published_at, view_count,
         category:categories(slug, label),
         author:authors(name)`;

    const [recentRes, popularRes, trendingRes] = await Promise.all([
      publicClient
        .from('articles')
        .select(selectCols)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(FEED_LIMIT),

      publicClient
        .from('articles')
        .select(selectCols)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(FEED_LIMIT),

      publicClient.rpc('trending_articles', { hours: 48, max_results: 20 }),
    ]);

    const recentRows = (recentRes.data ?? []) as unknown as DbArticle[];

    if (recentRows.length > 0) {
      const recent = recentRows.map(toHomeArticle);
      const popular = ((popularRes.data ?? []) as unknown as DbArticle[]).map(toHomeArticle);

      // Build trending list: use the RPC results to re-order articles by
      // recent view velocity. Falls back to popular if the RPC has no data.
      let trending: HomeArticle[];
      const trendingIds = (trendingRes.data ?? []) as TrendingRow[];

      if (trendingIds.length > 0) {
        const slugById = new Map<string, DbArticle>();
        for (const a of recentRows) {
          slugById.set(a.slug, a);
        }
        // Fetch full article data for trending IDs that aren't in the recent pool
        const { data: trendingArticles } = await publicClient
          .from('articles')
          .select(selectCols)
          .eq('status', 'published')
          .in('id', trendingIds.map((t) => t.article_id))
          .limit(20);
        const trendingMap = new Map<string, HomeArticle>();
        for (const a of (trendingArticles ?? []) as unknown as (DbArticle & { id: string })[]) {
          trendingMap.set((a as unknown as { id: string }).id, toHomeArticle(a));
        }
        trending = trendingIds
          .map((t) => trendingMap.get(t.article_id))
          .filter((a): a is HomeArticle => !!a);
      } else {
        trending = popular.slice(0, 20);
      }

      return { recent, popular, trending, live: true };
    }
  } catch {
    // network/DB error → fall through to seed
  }

  const seed = fromSeed();
  return { recent: seed, popular: seed, trending: seed, live: false };
}
