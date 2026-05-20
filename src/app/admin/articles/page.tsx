import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  updated_at: string;
  category: { label: string } | null;
  author:   { name: string }  | null;
}

const STATUS_LABEL: Record<ArticleRow['status'], string> = {
  draft:     'Draft',
  published: 'Published',
  archived:  'Archived',
};
const STATUS_COLOR: Record<ArticleRow['status'], string> = {
  draft:     'text-gray-400',
  published: 'text-emerald-400',
  archived:  'text-gray-500',
};

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(
      `id, slug, title, status, published_at, updated_at,
       category:categories(label),
       author:authors(name)`,
    )
    .order('updated_at', { ascending: false });

  if (error) {
    return (
      <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-4 text-sm text-red-300">
        Failed to load articles: {error.message}
      </div>
    );
  }

  const articles = (data ?? []) as unknown as ArticleRow[];

  return (
    <section aria-labelledby="articles-heading">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 id="articles-heading" className="text-2xl font-black tracking-tight text-white">
            Articles
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {articles.length === 0
              ? 'No articles yet.'
              : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-[#6001d2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#490099] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
          <p className="text-base text-gray-400">
            Nothing here yet. Click <span className="text-white font-semibold">New article</span> to create your first one.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-card">
          <table className="w-full">
            <caption className="sr-only">List of articles in the CMS</caption>
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr className="text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <th scope="col" className="px-5 py-3">Title</th>
                <th scope="col" className="px-5 py-3">Category</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3">Published</th>
                <th scope="col" className="px-5 py-3">Updated</th>
                <th scope="col" className="px-5 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {articles.map((a) => (
                <tr key={a.id} className="text-white">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-semibold text-white no-underline transition-colors hover:text-brand-accent focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                    >
                      {a.title}
                    </Link>
                    <div className="mt-0.5 text-xs text-gray-500">
                      /{a.slug} · {a.author?.name ?? 'No author'}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {a.category?.label ?? '—'}
                  </td>
                  <td className={`px-5 py-3 font-medium ${STATUS_COLOR[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {shortDate(a.published_at)}
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {shortDate(a.updated_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-emerald-400 no-underline transition-colors hover:text-emerald-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
