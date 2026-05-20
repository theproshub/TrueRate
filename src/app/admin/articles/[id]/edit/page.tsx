import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateArticle, deleteArticle } from '../../_actions';
import ArticleForm, { type ArticleDefaults } from '../../_components/ArticleForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}

const NOTICE_FOR_OK: Record<string, string> = {
  created: 'Article created.',
  saved:   'Saved.',
};

export default async function EditArticlePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: article, error: articleErr }, { data: categories }, { data: authors }] =
    await Promise.all([
      supabase
        .from('articles')
        .select(
          'id, slug, title, dek, body, hero_image, hero_alt, author_id, category_id, status, published_at',
        )
        .eq('id', id)
        .single(),
      supabase.from('categories').select('id, label').order('display_order'),
      supabase.from('authors').select('id, name').order('name'),
    ]);

  if (articleErr || !article) notFound();

  const sp = await searchParams;

  const boundUpdate = updateArticle.bind(null, id);
  const boundDelete = deleteArticle.bind(null, id);

  return (
    <section aria-labelledby="edit-article-heading">
      <header className="mb-6">
        <h1 id="edit-article-heading" className="text-2xl font-black tracking-tight text-white">
          Edit article
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {article.status === 'published' ? (
            <>Public URL: <code className="text-gray-300">/news/{article.slug}</code></>
          ) : (
            <>Draft — not yet published.</>
          )}
        </p>
      </header>
      <ArticleForm
        action={boundUpdate}
        defaults={article as ArticleDefaults}
        categories={categories ?? []}
        authors={authors ?? []}
        error={sp.error ?? null}
        notice={sp.ok ? (NOTICE_FOR_OK[sp.ok] ?? null) : null}
        submitLabel="Save changes"
        enableDelete
        deleteAction={boundDelete}
      />
    </section>
  );
}
