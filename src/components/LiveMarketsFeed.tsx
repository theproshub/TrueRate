'use client';

import useSWR from 'swr';
import Link from 'next/link';

/* ─────────────────────────────────────────────────────────────────────────────
   LiveMarketsFeed — auto-refreshing cross-asset snapshot for the homepage.

   Source: /api/markets (CBL USD/LRD + global indices, commodities, crypto with
   7-day sparklines). Polls every 90s and on focus. Renders nothing when no
   ticker is available, so it never shows an empty box or a fabricated price.
───────────────────────────────────────────────────────────────────────────── */

interface Ticker {
  symbol: string;
  name: string;
  assetClass: string;
  price: number;
  change: number | null;
  changePct: number | null;
  sparkline: number[];
}
interface FeedResponse {
  updatedAt: string | null;
  tickers: Ticker[];
}

const fetcher = async (url: string): Promise<FeedResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Markets request failed: ${res.status}`);
  return res.json();
};

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 18;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts} fill="none" strokeWidth="1.5" className={positive ? 'stroke-pos' : 'stroke-neg'} />
    </svg>
  );
}

function fmtPrice(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: n >= 1000 ? 0 : 2,
  });
}

export default function LiveMarketsFeed() {
  const { data, error, isLoading } = useSWR<FeedResponse>('/api/markets', fetcher, {
    refreshInterval: 90_000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });

  const tickers = data?.tickers ?? [];

  // Honest empty/failure handling: render nothing rather than an empty shell.
  if (error) return null;
  if (!data && !isLoading) return null;
  if (data && tickers.length === 0) return null;

  return (
    <section aria-labelledby="live-markets-heading">
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-white/30">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-pos motion-safe:animate-pulse"
          />
          <h2 id="live-markets-heading" className="text-sm font-bold text-white uppercase tracking-[0.12em]">
            Live Markets
          </h2>
        </div>
        <Link
          href="/markets"
          className="text-2xs uppercase tracking-wider text-brand-accent hover:underline no-underline rounded-sm focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none"
        >
          All ›
        </Link>
      </div>

      {isLoading && !data ? (
        <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading live markets">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 rounded bg-white/[0.04] motion-safe:animate-pulse" />
          ))}
        </div>
      ) : (
        <ul
          aria-live="polite"
          aria-label="Live market prices, updating automatically"
          className="m-0 p-0 list-none divide-y divide-white/[0.05]"
        >
          {tickers.map((t) => {
            const cp = t.changePct;
            const positive = (cp ?? 0) >= 0;
            const cls = cp == null ? 'text-gray-400' : positive ? 'text-pos' : 'text-neg';
            const arrow = cp == null ? '' : positive ? '▲' : '▼';
            const sign = cp == null ? '' : positive ? '+' : '−';
            return (
              <li key={t.symbol} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white leading-tight truncate">{t.name}</p>
                  <p className="text-2xs text-gray-500 tabular-nums">{fmtPrice(t.price)}</p>
                </div>
                <Sparkline data={t.sparkline} positive={positive} />
                <div className={`shrink-0 w-16 text-right text-xs font-semibold tabular-nums ${cls}`}>
                  {cp == null ? (
                    '—'
                  ) : (
                    <>
                      <span aria-hidden="true" className="mr-0.5">{arrow}</span>
                      {sign}
                      {Math.abs(cp).toFixed(2)}%
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-2 text-2xs text-gray-500 leading-relaxed">
        USD/LRD from the Central Bank of Liberia; global assets via Yahoo Finance · auto-updates.
      </p>
    </section>
  );
}
