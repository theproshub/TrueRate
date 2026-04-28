import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { fetchLiveRates, toLRDRates } from '@/lib/api/exchange';
import { fetchCommodities } from '@/lib/api/stooq';
import {
  fetchLiberiaIndicators,
  latestValue,
  previousValue,
  WB_INDICATORS,
} from '@/lib/api/worldbank';

export const revalidate = 900; // 15 min

export const metadata: Metadata = {
  title: 'Markets — Live FX, commodities & Liberia macro | TrueRate',
  description:
    "Live exchange rates, commodity prices, and World Bank macro indicators for Liberia. Sourced from open feeds — every datapoint timestamped.",
};

const FX_DISPLAY: { from: string; label: string; note: string }[] = [
  { from: 'USD', label: 'USD / LRD', note: 'Anchor pair. Most imports priced in USD.' },
  { from: 'EUR', label: 'EUR / LRD', note: 'Largest non-USD invoice currency for EU goods.' },
  { from: 'GBP', label: 'GBP / LRD', note: 'Diaspora remittance corridor.' },
  { from: 'CNY', label: 'CNY / LRD', note: 'Drives wholesale at Duala and Carey Street.' },
  { from: 'GHS', label: 'GHS / LRD', note: 'Cross-border trade with Ghana.' },
  { from: 'NGN', label: 'NGN / LRD', note: 'Regional benchmark; Nigeria capital flows.' },
];

const MACRO_DISPLAY: { key: keyof typeof WB_INDICATORS; label: string; unit: string; format: 'pct' | 'usd' | 'num' }[] = [
  { key: 'GDP',          label: 'GDP',                       unit: 'current US$', format: 'usd' },
  { key: 'GDP_GROWTH',   label: 'GDP growth',                unit: 'annual %',    format: 'pct' },
  { key: 'INFLATION',    label: 'Inflation (CPI)',           unit: 'annual %',    format: 'pct' },
  { key: 'UNEMPLOYMENT', label: 'Unemployment',              unit: '% labor force', format: 'pct' },
  { key: 'RESERVES',     label: 'Total reserves (incl. gold)', unit: 'current US$', format: 'usd' },
  { key: 'GOVT_DEBT',    label: 'Central govt debt',         unit: '% of GDP',    format: 'pct' },
];

function formatUSD(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPct(n: number): string {
  return `${n.toFixed(2)}%`;
}

function deltaClass(delta: number | null): string {
  if (delta === null) return 'text-gray-500';
  if (delta > 0) return 'text-emerald-400';
  if (delta < 0) return 'text-red-400';
  return 'text-gray-400';
}

function deltaSign(delta: number | null): string {
  if (delta === null) return '';
  if (delta > 0) return '+';
  return '';
}

export default async function MarketsPage() {
  const [liveRates, commodities, indicators] = await Promise.all([
    fetchLiveRates(),
    fetchCommodities(),
    fetchLiberiaIndicators().catch(() => ({} as Record<string, { date: string; value: number }[]>)),
  ]);

  const lrdRates = toLRDRates(liveRates);

  const lastUpdated = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8 pb-20" aria-labelledby="markets-heading">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Markets' }]} />

      {/* ── Hero ── */}
      <header className="mt-4 mb-10 border-b border-white/[0.08] pb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-3">Live markets</p>
        <h1 id="markets-heading" className="text-[32px] sm:text-[32px] font-black leading-[1.08] text-white tracking-tight mb-3 max-w-[820px]">
          Liberia&rsquo;s real-time financial dashboard
        </h1>
        <p className="text-[14px] sm:text-[16px] text-gray-300 leading-relaxed max-w-[760px]">
          Exchange rates against the LRD, end-of-day commodity prices that move Liberia&rsquo;s books, and the latest
          World Bank macro indicators &mdash; pulled from open data feeds, timestamped, and cached for 15 minutes.
        </p>
        <p className="mt-4 text-[12px] text-gray-500 tabular-nums" aria-live="polite">
          Updated {lastUpdated} &middot; FX: {liveRates.date} &middot; Sources listed below each table.
        </p>
      </header>

      {/* ── FX rates ── */}
      <section className="mb-14" aria-labelledby="fx-heading">
        <div className="flex items-baseline justify-between border-t border-white/20 pt-4 mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Section 1</p>
            <h2 id="fx-heading" className="text-[18px] font-black text-white mt-1">Exchange rates</h2>
          </div>
          <span className="text-[11px] text-gray-500 tabular-nums">vs. Liberian dollar &middot; mid-market</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] border-t border-white/[0.06]">
            <caption className="sr-only">Live exchange rates against the Liberian dollar, sourced from the fawazahmed0 currency API.</caption>
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th scope="col" className="py-3 pr-3 text-left">Pair</th>
                <th scope="col" className="py-3 px-3 text-right">Rate (LRD)</th>
                <th scope="col" className="py-3 px-3 text-left hidden sm:table-cell">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {FX_DISPLAY.map(({ from, label, note }) => {
                const rate = lrdRates[from];
                return (
                  <tr key={from} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-3 align-top">
                      <p className="font-bold text-white">{label}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 sm:hidden">{note}</p>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums align-top">
                      <span className="font-bold text-white">
                        {rate ? rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 hidden sm:table-cell align-top">{note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          Source: <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noopener noreferrer">@fawazahmed0/currency-api</a> via jsDelivr CDN. Mid-market reference rates; not a dealing rate. Cached 60 min.
        </p>
      </section>

      {/* ── Commodities ── */}
      <section className="mb-14" aria-labelledby="commodities-heading">
        <div className="flex items-baseline justify-between border-t border-white/20 pt-4 mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Section 2</p>
            <h2 id="commodities-heading" className="text-[18px] font-black text-white mt-1">Commodities</h2>
          </div>
          <span className="text-[11px] text-gray-500 tabular-nums">latest close &middot; intraday change</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] border-t border-white/[0.06]">
            <caption className="sr-only">End-of-day commodity prices from Stooq, with change vs. prior session.</caption>
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th scope="col" className="py-3 pr-3 text-left">Commodity</th>
                <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">Last</th>
                <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">Change</th>
                <th scope="col" className="py-3 px-3 text-left hidden md:table-cell">Liberia angle</th>
                <th scope="col" className="py-3 pl-3 text-right hidden sm:table-cell whitespace-nowrap">As of</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {commodities.map(c => (
                <tr key={c.symbol} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-3 align-top">
                    <p className="font-bold text-white">{c.name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{c.unit} &middot; <span className="font-mono">{c.symbol}</span></p>
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums align-top">
                    {c.price !== null
                      ? <span className="font-bold text-white">{c.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      : <span className="text-gray-500">—</span>}
                  </td>
                  <td className={`py-3 px-3 text-right tabular-nums align-top font-semibold ${deltaClass(c.changePercent)}`}>
                    {c.changePercent !== null
                      ? `${deltaSign(c.changePercent)}${c.changePercent.toFixed(2)}%`
                      : '—'}
                  </td>
                  <td className="py-3 px-3 text-gray-400 hidden md:table-cell align-top">{c.note}</td>
                  <td className="py-3 pl-3 text-right text-gray-500 tabular-nums hidden sm:table-cell align-top">{c.date ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          Source: <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://stooq.com" target="_blank" rel="noopener noreferrer">Stooq</a> end-of-day CSV feed. Iron ore not on Stooq&rsquo;s free tier &mdash; BHP ADR shown as a directional proxy. Cached 15 min. Dashes indicate the upstream feed was unreachable.
        </p>
      </section>

      {/* ── Liberia macro ── */}
      <section className="mb-14" aria-labelledby="macro-heading">
        <div className="flex items-baseline justify-between border-t border-white/20 pt-4 mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Section 3</p>
            <h2 id="macro-heading" className="text-[18px] font-black text-white mt-1">Liberia &mdash; macro indicators</h2>
          </div>
          <span className="text-[11px] text-gray-500 tabular-nums">World Bank &middot; annual</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[14px] border-t border-white/[0.06]">
            <caption className="sr-only">Liberia macro indicators from the World Bank Open Data API.</caption>
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th scope="col" className="py-3 pr-3 text-left">Indicator</th>
                <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">Latest</th>
                <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">Year</th>
                <th scope="col" className="py-3 pl-3 text-right whitespace-nowrap">y/y change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {MACRO_DISPLAY.map(({ key, label, unit, format }) => {
                const series = indicators[key] ?? [];
                const latest = latestValue(series);
                const prev = previousValue(series);
                const year = series[0]?.date ?? null;
                const change = latest !== null && prev !== null ? latest - prev : null;
                const display =
                  latest === null ? '—' :
                  format === 'usd' ? formatUSD(latest) :
                  format === 'pct' ? formatPct(latest) :
                  latest.toLocaleString('en-US');
                const changeDisplay =
                  change === null ? '—' :
                  format === 'pct' ? `${deltaSign(change)}${change.toFixed(2)} pp` :
                  format === 'usd' ? `${deltaSign(change)}${formatUSD(Math.abs(change))}` :
                  `${deltaSign(change)}${change.toLocaleString('en-US')}`;

                return (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-3 align-top">
                      <p className="font-bold text-white">{label}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{unit}</p>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums align-top font-bold text-white">{display}</td>
                    <td className="py-3 px-3 text-right tabular-nums align-top text-gray-400">{year ?? '—'}</td>
                    <td className={`py-3 pl-3 text-right tabular-nums align-top font-semibold ${deltaClass(change)}`}>
                      {changeDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
          Source: <a className="underline decoration-dotted underline-offset-2 hover:text-white" href="https://data.worldbank.org/country/LR" target="_blank" rel="noopener noreferrer">World Bank Open Data</a> &mdash; country code LR. Indicators are annual; release lag is typically 6&ndash;18 months. Cached 24 hours.
        </p>
      </section>

      {/* ── How we source / methodology ── */}
      <section className="mt-12 border-t border-white/[0.08] pt-6" aria-labelledby="method-heading">
        <h2 id="method-heading" className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">How this page works</h2>
        <ul className="space-y-2 text-[13px] text-gray-300 leading-relaxed max-w-[760px]">
          <li>&middot; FX rates refresh every 60 minutes from a free CDN feed; commodities every 15 minutes from Stooq; macro indicators every 24 hours from the World Bank.</li>
          <li>&middot; If an upstream feed is unreachable, the affected row shows a dash &mdash; we never silently substitute stale or fabricated data.</li>
          <li>&middot; LRD cross-rates are computed from USD-base rates; mid-market reference only, not a dealing rate.</li>
          <li>&middot; For the converter and historical FX charts, see <Link href="/news?q=LRD" className="text-brand-accent hover:underline">recent FX coverage</Link>. Tip a deal or correction: <a className="text-brand-accent hover:underline" href="mailto:tips@truerate.com">tips@truerate.com</a>.</li>
        </ul>
      </section>

    </main>
  );
}
