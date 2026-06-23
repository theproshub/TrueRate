import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

async function countByStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  status: 'draft' | 'published' | 'archived',
): Promise<number> {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', status);
  return count ?? 0;
}

async function totalCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table:
    | 'articles'
    | 'authors'
    | 'categories'
    | 'macro_series'
    | 'macro_values'
    | 'symbols'
    | 'profiles',
): Promise<number> {
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

function shortDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface RecentArticle {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  updated_at: string;
  category: { label: string } | null;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    draftCount,
    publishedCount,
    archivedCount,
    authorCount,
    categoryCount,
    macroSeriesCount,
    macroValueCount,
    profileCount,
    recentArticlesResult,
  ] = await Promise.all([
    countByStatus(supabase, 'draft'),
    countByStatus(supabase, 'published'),
    countByStatus(supabase, 'archived'),
    totalCount(supabase, 'authors'),
    totalCount(supabase, 'categories'),
    totalCount(supabase, 'macro_series'),
    totalCount(supabase, 'macro_values'),
    totalCount(supabase, 'profiles'),
    supabase
      .from('articles')
      .select('id, title, status, updated_at, category:categories(label)')
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  const recentArticles =
    (recentArticlesResult.data ?? []) as unknown as RecentArticle[];
  const totalArticles = draftCount + publishedCount + archivedCount;

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-8">
      <header>
        <h1
          id="dashboard-heading"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of TrueRate&apos;s content, data, and users.
        </p>
      </header>

      {/* Editorial summary */}
      <section aria-labelledby="editorial-heading">
        <h2
          id="editorial-heading"
          className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Editorial
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total articles" value={totalArticles} href="/admin/articles" />
          <StatCard label="Published" value={publishedCount} tone="positive" href="/admin/articles?status=published" />
          <StatCard label="Drafts"    value={draftCount}     tone="neutral"  href="/admin/articles?status=draft" />
          <StatCard label="Archived"  value={archivedCount}  tone="muted"    href="/admin/articles?status=archived" />
        </div>
      </section>

      {/* Reference + library */}
      <section aria-labelledby="library-heading">
        <h2
          id="library-heading"
          className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          Library
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Authors"        value={authorCount}      href="/admin/authors" />
          <StatCard label="Categories"     value={categoryCount}    href="/admin/categories" />
          <StatCard label="Macro series"   value={macroSeriesCount} />
          <StatCard label="Macro values"   value={macroValueCount}  />
        </div>
      </section>

      {/* People */}
      <section aria-labelledby="people-heading">
        <h2
          id="people-heading"
          className="mb-3 text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          People
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Registered users" value={profileCount} href="/admin/users" />
        </div>
      </section>

      {/* Recent activity */}
      <section aria-labelledby="recent-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="recent-heading"
            className="text-2xs font-bold uppercase tracking-[0.12em] text-gray-500"
          >
            Recent edits
          </h2>
          <Link
            href="/admin/articles"
            className="text-xs text-gray-500 no-underline transition-colors hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
          >
            All articles ›
          </Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 text-sm text-gray-500">
            No articles yet.{' '}
            <Link
              href="/admin/articles/new"
              className="text-brand-accent no-underline hover:text-brand-accent-hover"
            >
              Create the first one
            </Link>
            .
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-gray-200 bg-brand-card divide-y divide-gray-200">
            {recentArticles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/articles/${a.id}/edit`}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm no-underline transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold text-gray-900">
                    {a.title}
                  </span>
                  <span className="hidden shrink-0 text-xs text-gray-500 sm:inline">
                    {a.category?.label ?? '—'}
                  </span>
                  <span
                    className={`hidden shrink-0 text-xs font-medium sm:inline ${
                      a.status === 'published'
                        ? 'text-pos'
                        : a.status === 'archived'
                          ? 'text-gray-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {a.status}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500 tabular-nums">
                    {shortDate(a.updated_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

function StatCard({
  label,
  value,
  href,
  tone = 'default',
}: {
  label: string;
  value: number;
  href?: string;
  tone?: 'default' | 'positive' | 'neutral' | 'muted';
}) {
  const toneColor =
    tone === 'positive'
      ? 'text-pos'
      : tone === 'neutral'
        ? 'text-amber-500'
        : tone === 'muted'
          ? 'text-gray-500'
          : 'text-gray-900';

  const card = (
    <div className="rounded-2xl border border-gray-200 bg-brand-card px-5 py-4 transition-colors hover:bg-gray-50">
      <div className="text-2xs font-bold uppercase tracking-[0.12em] text-gray-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-black tabular-nums ${toneColor}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="no-underline focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
      >
        {card}
      </Link>
    );
  }
  return card;
}
