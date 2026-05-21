import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface CategoryRow {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  display_order: number | null;
}

interface PageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

const OK_NOTICE: Record<string, string> = {
  deleted: 'Category deleted.',
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = await createClient();

  const [categoriesResult, articleCountsResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, slug, label, description, display_order')
      .order('display_order')
      .order('label'),
    supabase
      .from('articles')
      .select('category_id')
      .not('category_id', 'is', null),
  ]);

  if (categoriesResult.error) {
    return (
      <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-4 text-sm text-red-300">
        Failed to load categories: {categoriesResult.error.message}
      </div>
    );
  }

  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const articleCountByCategory = new Map<string, number>();
  for (const row of articleCountsResult.data ?? []) {
    const cid = (row as { category_id: string | null }).category_id;
    if (!cid) continue;
    articleCountByCategory.set(cid, (articleCountByCategory.get(cid) ?? 0) + 1);
  }

  return (
    <section aria-labelledby="categories-heading">
      {sp.ok && OK_NOTICE[sp.ok] && (
        <div role="status" aria-live="polite" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3 text-sm text-emerald-300">
          {OK_NOTICE[sp.ok]}
        </div>
      )}
      {sp.error && (
        <div role="alert" aria-live="assertive" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300">
          {sp.error}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 id="categories-heading" className="text-2xl font-black tracking-tight text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {categories.length === 0
              ? 'No categories yet.'
              : `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-lg bg-[#6001d2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#490099] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          New category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
          <p className="text-base text-gray-400">
            Nothing here yet. Click <span className="text-white font-semibold">New category</span> to add one.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-card">
          <table className="w-full">
            <caption className="sr-only">List of editorial categories</caption>
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr className="text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <th scope="col" className="px-5 py-3">Label</th>
                <th scope="col" className="px-5 py-3">Slug</th>
                <th scope="col" className="px-5 py-3 text-right">Order</th>
                <th scope="col" className="px-5 py-3 text-right">Articles</th>
                <th scope="col" className="px-5 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {categories.map((c) => {
                const articleCount = articleCountByCategory.get(c.id) ?? 0;
                return (
                  <tr key={c.id} className="text-white">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/categories/${c.id}/edit`}
                        className="font-semibold text-white no-underline transition-colors hover:text-brand-accent focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        {c.label}
                      </Link>
                      {c.description && (
                        <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                          {c.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      <code className="text-xs">{c.slug}</code>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-400">
                      {c.display_order ?? 0}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-400">
                      {articleCount === 0 ? (
                        <span className="text-gray-500">0</span>
                      ) : (
                        <Link
                          href={`/admin/articles?category=${encodeURIComponent(c.slug)}`}
                          className="text-emerald-400 no-underline hover:text-emerald-300"
                        >
                          {articleCount}
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/categories/${c.id}/edit`}
                        className="text-emerald-400 no-underline transition-colors hover:text-emerald-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
