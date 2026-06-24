import type { Metadata } from 'next';
import WatchlistClient, { type WatchRow } from './WatchlistClient';
import Breadcrumb from '@/components/Breadcrumb';
import { getAnalyticsPayload } from '@/lib/analytics/data';
import { getWatchlist } from '@/lib/analytics/watchlist';
import { statsFor } from '@/lib/analytics/stats';
import type { AnalyticsItem } from '@/lib/analytics/types';
import { getSavedArticles } from '@/lib/saved-articles';
import type { SavedRow } from '@/app/saved/SavedArticlesClient';

export const metadata: Metadata = {
  title: 'Watchlist',
  alternates: { canonical: '/watchlist' },
  description: 'Your personal watchlist of Liberian indicators, forex pairs, and commodities.',
  robots: { index: false, follow: true },
};

// Per-user content; never statically cached.
export const dynamic = 'force-dynamic';

const KIND: Record<AnalyticsItem['assetClass'], WatchRow['kind']> = {
  fx: 'currency',
  commodity: 'commodity',
  macro: 'macro',
};

/** Project a live AnalyticsItem into the slim row the client renders. */
function toRow(item: AnalyticsItem): WatchRow {
  // Short, meaningful change: 1D for prices, full-history YoY for annual macro.
  const stats = statsFor(item.series, item.assetClass === 'macro' ? 'ALL' : '1D');
  return {
    id: item.id,
    label: item.label,
    name: item.name,
    kind: KIND[item.assetClass],
    unit: item.unit,
    format: item.format,
    current: item.current,
    changePct: stats.changePct,
  };
}

export default async function WatchlistPage() {
  const [payload, wl, saved] = await Promise.all([
    getAnalyticsPayload(),
    getWatchlist(),
    getSavedArticles(),
  ]);

  const allRows = payload.items.map(toRow);
  const byId = new Map(allRows.map((r) => [r.id, r]));
  const watched = wl.refIds.map((id) => byId.get(id)).filter((r): r is WatchRow => Boolean(r));

  const savedRows: SavedRow[] = saved.rows.map((r) => ({
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
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Watchlist' }]} />
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">Watchlist</h1>
      <WatchlistClient authed={wl.authed} watched={watched} options={allRows} savedArticles={savedRows} />
    </main>
  );
}
