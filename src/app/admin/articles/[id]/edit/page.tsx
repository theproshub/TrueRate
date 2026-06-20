import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateArticle, deleteArticle } from '../../_actions';
import ArticleForm, { type ArticleDefaults } from '../../_components/ArticleForm';
import TagsEditor from './_TagsEditor';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}

const NOTICE_FOR_OK: Record<string, string> = {
  created:    'Article created.',
  saved:      'Saved.',
  tags_saved: 'Tags saved.',
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

  // Best-effort: load outlet attribution if migration 009 has been applied.
  // Isolated so a missing column never breaks the editor.
  let source: { source_name: string | null; source_url: string | null } = {
    source_name: null,
    source_url: null,
  };
  const { data: sourceRow } = await supabase
    .from('articles')
    .select('source_name, source_url')
    .eq('id', id)
    .single();
  const src = sourceRow as unknown as
    | { source_name: string | null; source_url: string | null }
    | null;
  if (src) source = src;

  const sp = await searchParams;

  const boundUpdate = updateArticle.bind(null, id);
  const boundDelete = deleteArticle.bind(null, id);

  return (
    <section aria-labelledby="edit-article-heading" className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 id="edit-article-heading" className="text-2xl font-bold tracking-tight text-white">
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
        defaults={{ ...article, ...source } as ArticleDefaults}
        categories={categories ?? []}
        authors={authors ?? []}
        error={sp.error ?? null}
        notice={sp.ok ? (NOTICE_FOR_OK[sp.ok] ?? null) : null}
        submitLabel="Save changes"
        enableDelete
        deleteAction={boundDelete}
      />

      <div className="my-10 border-t border-white/[0.07]" />

      <header className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">Tags</h2>
        <p className="mt-1 text-sm text-gray-400">
          Link this article to the macro indicators and symbols it discusses. Tags drive
          related-news widgets on indicator and symbol pages.
        </p>
      </header>
      <TagsEditor articleId={id} articleTitle={article.title ?? ''} articleBody={article.body ?? ''} />
    </section>
  );
}
