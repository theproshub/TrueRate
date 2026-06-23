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

interface CategoryOption {
  id: string;
  slug: string;
  label: string;
}

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
}

const STATUS_LABEL: Record<ArticleRow['status'], string> = {
  draft:     'Draft',
  published: 'Published',
  archived:  'Archived',
};
const STATUS_COLOR: Record<ArticleRow['status'], string> = {
  draft:     'text-gray-500',
  published: 'text-pos',
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

const FILTER_INPUT =
  'rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-brand-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink-ink';

export default async function AdminArticlesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? '';
  const statusFilter = sp.status?.trim() ?? '';
  const categoryFilter = sp.category?.trim() ?? '';
  const hasFilters = q !== '' || statusFilter !== '' || categoryFilter !== '';

  const supabase = await createClient();

  // Pull categories for the dropdown + the category id if filtering by slug
  const { data: categoryRows } = await supabase
    .from('categories')
    .select('id, slug, label')
    .order('display_order');
  const categories = (categoryRows ?? []) as CategoryOption[];
  const filterCategoryId =
    categoryFilter !== ''
      ? categories.find((c) => c.slug === categoryFilter)?.id ?? null
      : null;

  let query = supabase
    .from('articles')
    .select(
      `id, slug, title, status, published_at, updated_at,
       category:categories(label),
       author:authors(name)`,
    )
    .order('updated_at', { ascending: false });

  if (q !== '') {
    // Title contains q (case-insensitive). PostgREST ilike pattern needs % wildcards.
    query = query.ilike('title', `%${q}%`);
  }
  if (statusFilter !== '' && ['draft', 'published', 'archived'].includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }
  if (filterCategoryId) {
    query = query.eq('category_id', filterCategoryId);
  }

  const { data, error } = await query;

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
          <h1 id="articles-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Articles
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? `${articles.length} ${articles.length === 1 ? 'match' : 'matches'} for current filters`
              : articles.length === 0
                ? 'No articles yet.'
                : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
        >
          New article
        </Link>
      </div>

      {/* Filter bar (GET form, no JS) */}
      <form
        method="get"
        action="/admin/articles"
        role="search"
        aria-label="Filter articles"
        className="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-gray-200 bg-brand-card px-4 py-3"
      >
        <div className="flex min-w-[180px] flex-1 flex-col gap-1">
          <label htmlFor="filter-q" className="text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
            Search title
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="e.g. interest rates"
            className={FILTER_INPUT}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-status" className="text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
            Status
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={statusFilter}
            className={FILTER_INPUT}
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="filter-category" className="text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={categoryFilter}
            className={FILTER_INPUT}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
          >
            Apply
          </button>
          {hasFilters && (
            <Link
              href="/admin/articles"
              className="text-sm text-gray-500 no-underline hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-brand-card p-10 text-center">
          {hasFilters ? (
            <>
              <p className="text-base text-gray-500">No articles match these filters.</p>
              <Link
                href="/admin/articles"
                className="mt-3 inline-block text-sm text-brand-accent no-underline hover:text-brand-accent-hover"
              >
                Clear filters
              </Link>
            </>
          ) : (
            <p className="text-base text-gray-500">
              Nothing here yet. Click <span className="text-gray-900 font-semibold">New article</span> to create your first one.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-brand-card">
          <table className="w-full">
            <caption className="sr-only">List of articles in the CMS</caption>
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <th scope="col" className="px-5 py-3">Title</th>
                <th scope="col" className="px-5 py-3">Category</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3">Published</th>
                <th scope="col" className="px-5 py-3">Updated</th>
                <th scope="col" className="px-5 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {articles.map((a) => (
                <tr key={a.id} className="text-gray-900">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="font-semibold text-gray-900 no-underline transition-colors hover:text-brand-accent focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
                    >
                      {a.title}
                    </Link>
                    <div className="mt-0.5 text-xs text-gray-500">
                      /{a.slug} · {a.author?.name ?? 'No author'}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {a.category?.label ?? '—'}
                  </td>
                  <td className={`px-5 py-3 font-medium ${STATUS_COLOR[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {shortDate(a.published_at)}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {shortDate(a.updated_at)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="text-brand-accent no-underline transition-colors hover:text-brand-accent-hover focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
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
