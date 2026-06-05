import { createClient } from '@/lib/supabase/server';
import { createArticle } from '../_actions';
import ArticleForm from '../_components/ArticleForm';

interface PageProps {
  searchParams: Promise<{ error?: string; ok?: string }>;
}

export default async function NewArticlePage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase.from('categories').select('id, label').order('display_order'),
    supabase.from('authors').select('id, name').order('name'),
  ]);

  const sp = await searchParams;

  // Default new articles to the "News" section (falls back to none if missing).
  const newsCategoryId =
    (categories ?? []).find((c) => c.label.trim().toLowerCase() === 'news')?.id ??
    null;

  // Default byline to the TrueRate News Desk (falls back to none if missing).
  const defaultAuthorId =
    (authors ?? []).find((a) => a.name.trim().toLowerCase() === 'truerate news desk')?.id ??
    null;

  return (
    <section aria-labelledby="new-article-heading" className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 id="new-article-heading" className="text-2xl font-bold tracking-tight text-white">
          New article
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Fill in the fields below. Save as Draft to keep working, or set Status to Published to make it live.
        </p>
      </header>
      <ArticleForm
        action={createArticle}
        defaults={{ status: 'draft', category_id: newsCategoryId, author_id: defaultAuthorId }}
        categories={categories ?? []}
        authors={authors ?? []}
        error={sp.error ?? null}
        notice={sp.ok ? 'Saved.' : null}
        submitLabel="Create article"
      />
    </section>
  );
}
