import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Supabase-backed "Saved Articles" (read side).
 *
 * Source of truth: `saved_articles` (RLS-scoped to auth.uid(), migration 010).
 * Each row links a user to a `public.articles` row. Reads go through the
 * cookie-aware server client so RLS sees the right session; the article join
 * is additionally gated by the articles RLS (published-or-admin), so an
 * article that is later unpublished simply drops out of a user's saved list.
 *
 * Anonymous users have no session → reads return empty + authed:false, and the
 * UI shows a sign-in prompt. Never throws for the unauthenticated case.
 */

type SbClient = Awaited<ReturnType<typeof createClient>>;

async function currentUserId(sb: SbClient): Promise<string | null> {
  const { data } = await sb.auth.getUser();
  return data.user?.id ?? null;
}

export interface SavedArticleRow {
  /** saved_articles.id (the bookmark row) */
  id: string;
  /** articles.id (FK target) */
  articleId: string;
  slug: string;
  title: string;
  dek: string | null;
  heroImage: string | null;
  heroAlt: string | null;
  categorySlug: string | null;
  categoryLabel: string | null;
  publishedAt: string | null;
  savedAt: string | null;
}

/**
 * Whether a given article is saved by the signed-in user.
 * Returns authed:false (and saved:false) when there is no session.
 */
export async function isArticleSaved(
  articleId: string,
): Promise<{ authed: boolean; saved: boolean }> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { authed: false, saved: false };

  // RLS already limits saved_articles to this user; the eq is belt-and-braces.
  const { data } = await sb
    .from('saved_articles')
    .select('id')
    .eq('article_id', articleId)
    .maybeSingle();

  return { authed: true, saved: Boolean(data) };
}

/** The signed-in user's saved articles, newest first. Empty when signed out. */
export async function getSavedArticles(): Promise<{
  authed: boolean;
  rows: SavedArticleRow[];
}> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { authed: false, rows: [] };

  // !inner: drop bookmarks whose article is no longer visible to this user.
  const { data, error } = await sb
    .from('saved_articles')
    .select(
      `id, created_at, article_id,
       articles!inner ( slug, title, dek, hero_image, hero_alt, published_at,
                         category:categories(slug, label) )`,
    )
    .order('created_at', { ascending: false });

  if (error || !data) return { authed: true, rows: [] };

  const rows: SavedArticleRow[] = [];
  for (const row of data as unknown as Array<{
    id: string;
    created_at: string | null;
    article_id: string;
    articles: {
      slug: string;
      title: string;
      dek: string | null;
      hero_image: string | null;
      hero_alt: string | null;
      published_at: string | null;
      category: { slug: string; label: string } | null;
    } | null;
  }>) {
    const a = row.articles;
    if (!a) continue;
    rows.push({
      id: row.id,
      articleId: row.article_id,
      slug: a.slug,
      title: a.title,
      dek: a.dek,
      heroImage: a.hero_image,
      heroAlt: a.hero_alt,
      categorySlug: a.category?.slug ?? null,
      categoryLabel: a.category?.label ?? null,
      publishedAt: a.published_at,
      savedAt: row.created_at,
    });
  }
  return { authed: true, rows };
}

export { currentUserId };
