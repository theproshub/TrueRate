import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { getSavedArticles } from '@/lib/saved-articles';
import SavedArticlesClient, { type SavedRow } from './SavedArticlesClient';

export const metadata: Metadata = {
  title: 'Saved Articles',
  alternates: { canonical: '/saved' },
  description: 'Articles you have saved on TrueRate.',
  robots: { index: false, follow: true },
};

// Per-user content; never statically cached.
export const dynamic = 'force-dynamic';

export default async function SavedArticlesPage() {
  const { authed, rows } = await getSavedArticles();

  const clientRows: SavedRow[] = rows.map((r) => ({
    id: r.id,
    articleId: r.articleId,
    slug: r.slug,
    title: r.title,
    dek: r.dek,
    categoryLabel: r.categoryLabel,
    publishedAt: r.publishedAt,
    savedAt: r.savedAt,
  }));

  return (
    <main className="mx-auto max-w-container px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Saved' }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">Saved articles</h1>
      <SavedArticlesClient authed={authed} initialRows={clientRows} />
    </main>
  );
}
