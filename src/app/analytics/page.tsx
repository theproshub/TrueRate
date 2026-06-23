import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SectionEndNav from '@/components/SectionEndNav';
import TickerTape from '@/components/analytics/terminal/TickerTape';
import TrendsTerminal from '@/components/analytics/terminal/TrendsTerminal';
import { getMcpAnalyticsPayload } from '@/lib/analytics/mcp-data';
import { SECTION_CONFIG } from '@/components/analytics/terminal/editorial';
import type { AnalyticsItem } from '@/lib/analytics/types';

export const revalidate = 900; // ISR: rebuild every 15 min

export const metadata: Metadata = {
  title: 'Trends & Analytics — Liberia',
  alternates: { canonical: '/analytics' },
  description:
    'TrueRate Trends & Analytics — Liberia macro indicators, central bank data and global market benchmarks powered by the CBL statistical database.',
};


/* ── Data source badge ── */
function SourceBadge({ label, count }: { label: string; count: number }) {
  return (
    <div className="text-right">
      <dd className="font-mono text-2xl font-semibold tabular-nums leading-none text-gray-900">{count}</dd>
      <dt className="mt-1 text-2xs font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</dt>
    </div>
  );
}

export default async function AnalyticsPage() {
  const payload = await getMcpAnalyticsPayload();
  const byId = new Map(payload.items.map((i) => [i.id, i]));

  // Build terminal sections from real items (skip anything the data layer couldn't load).
  const sections = SECTION_CONFIG.map((cfg) => ({
    id: cfg.id,
    title: cfg.title,
    items: cfg.ids.map((id) => byId.get(id)).filter((i): i is AnalyticsItem => Boolean(i)),
  })).filter((s) => s.items.length > 0);

  // Ticker tape: all CBL items
  const tickerItems = payload.items;

  // Header metadata
  const updated = new Date(payload.updatedAt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'UTC',
  });

  // Count by section type
  const sectionCounts = [
    { label: 'CBL Series', n: payload.items.length },
    { label: 'Sections', n: sections.length },
  ];

  return (
    <>
      {/* Zone 1 — full-bleed ticker tape */}
      <TickerTape items={tickerItems} />

      {/* Zone 2 — page content */}
      <main className="mx-auto max-w-container px-4 py-7 pb-14 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Trends & Analytics' }]} />

        {/* ── Header ── */}
        <header className="mb-8 mt-1 border-b border-gray-200 pb-5">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-brand-accent-ink">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
              CBL Market Data
            </span>
            <span aria-hidden className="h-3 w-px bg-gray-50" />
            <span className="font-mono text-2xs uppercase tracking-wide text-gray-500">
              Updated <time dateTime={payload.updatedAt}>{updated} GMT</time>
            </span>
            <span aria-hidden className="h-3 w-px bg-gray-50" />
            <span className="font-mono text-2xs uppercase tracking-wide text-gray-500">
              Source: TrueRate MCP
            </span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Trends &amp; Analytics</h1>
              <p className="mt-1.5 max-w-[600px] text-sm leading-relaxed text-gray-500">
                Liberia macro indicators, central bank data &amp; global market benchmarks — all powered by the CBL statistical database via TrueRate MCP. Click any figure to chart its history.
              </p>
            </div>

            <dl className="flex shrink-0 items-center gap-6 sm:gap-7">
              {sectionCounts.map((c) => (
                <SourceBadge key={c.label} label={c.label} count={c.n} />
              ))}
            </dl>
          </div>
        </header>

        {/* ── CBL Terminal ── */}
        {sections.length > 0 ? (
          <TrendsTerminal sections={sections} />
        ) : (
          <p className="font-mono text-sm text-gray-500">
            Market data is temporarily unavailable. Please check back shortly.
          </p>
        )}

        <SectionEndNav currentHref="/analytics" />

        {/* ── Data Sources footer ── */}
        <footer className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-wrap gap-6 text-2xs text-gray-500">
            <div>
              <span className="font-semibold uppercase tracking-wide text-gray-500">Data Sources</span>
              <p className="mt-1">Central Bank of Liberia &middot; Ministry of Finance &middot; LISGIS &middot; Yahoo Finance</p>
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wide text-gray-500">Databanks</span>
              <p className="mt-1">EXR &middot; CPI &middot; MON &middot; FIS &middot; BOP &middot; NAT &middot; INR &middot; INT &middot; PRO &middot; POP</p>
            </div>
            <div>
              <span className="font-semibold uppercase tracking-wide text-gray-500">Powered by</span>
              <p className="mt-1">
                <Link href="/about" className="text-brand-accent-ink hover:text-brand-accent-ink/80 transition-colors">
                  TrueRate MCP
                </Link>
                {' '}&middot; 366 series across 10 databanks
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
