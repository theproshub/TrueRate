import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import TickerTape from '@/components/analytics/terminal/TickerTape';
import TrendsTerminal from '@/components/analytics/terminal/TrendsTerminal';
import { getAnalyticsPayload } from '@/lib/analytics/data';
import { SECTION_CONFIG } from '@/components/analytics/terminal/editorial';
import type { AnalyticsItem } from '@/lib/analytics/types';

// Real, server-side data. ISR: rebuild every 15 min; live spot is fetched in the
// data layer (which caches upstream calls), so there is no client waterfall.
export const revalidate = 900;

export const metadata: Metadata = {
  title: 'Trends & Analytics — Liberia',
  alternates: { canonical: '/analytics' },
  description:
    'TrueRate Trends & Analytics — Liberia macro indicators, currency cross-rates and commodity benchmarks in a clean, terminal-style dashboard.',
};

export default async function AnalyticsPage() {
  const payload = await getAnalyticsPayload();
  const byId = new Map(payload.items.map((i) => [i.id, i]));

  // Curated sections from real items (skip anything the data layer couldn't load).
  const sections = SECTION_CONFIG.map((cfg) => ({
    id: cfg.id,
    title: cfg.title,
    items: cfg.ids.map((id) => byId.get(id)).filter((i): i is AnalyticsItem => Boolean(i)),
  })).filter((s) => s.items.length > 0);

  // Ticker: live FX + commodities + the headline macro figures, in a stable order.
  const tickerItems = [
    ...payload.macro,
    ...payload.fx,
    ...payload.commodities,
  ];

  // Real header metadata — no fabricated values.
  const updated = new Date(payload.updatedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'UTC',
  });
  const coverage = [
    { label: 'Macro', n: payload.macro.length },
    { label: 'Currency', n: payload.fx.length },
    { label: 'Commodity', n: payload.commodities.length },
  ];

  return (
    <>
      {/* Zone 1 — full-bleed ticker tape */}
      <TickerTape items={tickerItems} />

      {/* Zone 2 — constrained analytics grid */}
      <main className="mx-auto max-w-container px-4 py-7 pb-14 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Trends & Analytics' }]} />

        <header className="mb-8 mt-1 border-b border-white/10 pb-5">
          {/* Status row — live indicator + real last-updated stamp */}
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
              Market Data
            </span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span className="font-mono text-2xs uppercase tracking-wide text-gray-500">
              Updated <time dateTime={payload.updatedAt}>{updated} GMT</time>
            </span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Trends &amp; Analytics</h1>
              <p className="mt-1.5 max-w-[560px] text-sm leading-relaxed text-gray-400">
                Liberia macro, currency &amp; commodity benchmarks — click any figure to chart its history.
              </p>
            </div>

            {/* Coverage — real instrument counts per asset class */}
            <dl className="flex shrink-0 items-center gap-6 sm:gap-7">
              {coverage.map((c) => (
                <div key={c.label} className="text-right">
                  <dd className="font-mono text-2xl font-semibold tabular-nums leading-none text-white">{c.n}</dd>
                  <dt className="mt-1 text-2xs font-semibold uppercase tracking-[0.14em] text-gray-500">{c.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {sections.length > 0 ? (
          <TrendsTerminal sections={sections} />
        ) : (
          <p className="font-mono text-sm text-gray-500">
            Market data is temporarily unavailable. Please check back shortly.
          </p>
        )}
      </main>
    </>
  );
}
