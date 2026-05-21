import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

interface AuthorRow {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface PageProps {
  searchParams: Promise<{ ok?: string; error?: string }>;
}

const OK_NOTICE: Record<string, string> = {
  deleted: 'Author deleted.',
};

export default async function AdminAuthorsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const supabase = await createClient();

  const [authorsResult, articleCountsResult] = await Promise.all([
    supabase.from('authors').select('id, slug, name, bio, avatar_url, created_at').order('name'),
    supabase
      .from('articles')
      .select('author_id')
      .not('author_id', 'is', null),
  ]);

  if (authorsResult.error) {
    return (
      <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-4 text-sm text-red-300">
        Failed to load authors: {authorsResult.error.message}
      </div>
    );
  }

  const authors = (authorsResult.data ?? []) as AuthorRow[];

  // Count articles per author for the row meta
  const articleCountByAuthor = new Map<string, number>();
  for (const row of articleCountsResult.data ?? []) {
    const aid = (row as { author_id: string | null }).author_id;
    if (!aid) continue;
    articleCountByAuthor.set(aid, (articleCountByAuthor.get(aid) ?? 0) + 1);
  }

  return (
    <section aria-labelledby="authors-heading">
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
          <h1 id="authors-heading" className="text-2xl font-black tracking-tight text-white">
            Authors
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {authors.length === 0
              ? 'No authors yet.'
              : `${authors.length} ${authors.length === 1 ? 'author' : 'authors'}`}
          </p>
        </div>
        <Link
          href="/admin/authors/new"
          className="rounded-lg bg-[#6001d2] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#490099] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          New author
        </Link>
      </div>

      {authors.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
          <p className="text-base text-gray-400">
            No authors yet. Click <span className="text-white font-semibold">New author</span> to add one.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-card">
          <table className="w-full">
            <caption className="sr-only">List of authors</caption>
            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
              <tr className="text-left text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
                <th scope="col" className="px-5 py-3">Name</th>
                <th scope="col" className="px-5 py-3">Slug</th>
                <th scope="col" className="px-5 py-3">Articles</th>
                <th scope="col" className="px-5 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-sm">
              {authors.map((a) => {
                const articleCount = articleCountByAuthor.get(a.id) ?? 0;
                return (
                  <tr key={a.id} className="text-white">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/authors/${a.id}/edit`}
                        className="font-semibold text-white no-underline transition-colors hover:text-brand-accent focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        {a.name}
                      </Link>
                      {a.bio && (
                        <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                          {a.bio}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      <code className="text-xs">{a.slug}</code>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-gray-400">
                      {articleCount === 0 ? (
                        <span className="text-gray-500">0</span>
                      ) : (
                        <Link
                          href={`/admin/articles?author=${encodeURIComponent(a.slug)}`}
                          className="text-emerald-400 no-underline hover:text-emerald-300"
                        >
                          {articleCount}
                        </Link>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/authors/${a.id}/edit`}
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
