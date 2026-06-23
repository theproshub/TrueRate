import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Data Disclaimer — TrueRate',
  description: 'Where TrueRate sources its market data, how fresh it is, and what it is (and is not) meant to be used for.',
};

const SOURCES = [
  { source: "Central Bank of Liberia (CBL)",  data: "Exchange rates, policy rate, reserves, monetary aggregates, banking sector data, trade, and fiscal statistics via the CBL data warehouse", freshness: "As published" },
  { source: "Open currency-rate feed (CDN)",  data: "Live USD-base FX rates; LRD cross-rates computed (mid-market reference, not a dealing rate)", freshness: "Hourly" },
  { source: "Yahoo Finance",                  data: "Commodity prices relevant to Liberia’s export economy (gold, oil, iron ore, rubber, palm oil) and global equity indices", freshness: "~15 min" },
  { source: "LISGIS",                         data: "Consumer price index (inflation), population estimates, national statistics", freshness: "As published" },
  { source: "Ministry of Finance (MFDP)",     data: "National budget, fiscal data, public debt, revenue and expenditure", freshness: "As published" },
  { source: "World Bank Open Data",           data: "GDP, inflation, debt-to-GDP, employment, trade balance, development indicators", freshness: "Annual / quarterly" },
  { source: "International Monetary Fund",     data: "World Economic Outlook projections, Article IV reports, fiscal data", freshness: "Semi-annual" },
  { source: "TrueRate Research",              data: "Proprietary analysis, company profiles, survey data — always labelled as estimates", freshness: "As published" },
];

const NOTES = [
  {
    title: 'Indicative, not executable',
    body: "Rates and prices shown on TrueRate \u2014 including those on the live market rail, watchlist, and analytics dashboards \u2014 are indicative market levels aggregated from the sources above. They should not be read as transactable quotes. If you need to trade, use a licensed broker or bank, whose rates may differ.",
  },
  {
    title: 'Delays and gaps',
    body: "Live market rates refresh frequently from our data providers, but quoted levels can still lag the market and some feeds are delayed. Economic series from institutions like the World Bank, IMF, CBL, and LISGIS are published quarterly or annually and may lag by weeks. We label freshness where we can; when in doubt, check the source.",
  },
  {
    title: 'CBL data warehouse',
    body: "TrueRate maintains a structured data warehouse of Central Bank of Liberia statistical series used across our reporting, analytics, and economy pages. Every economic figure published in articles is verified against this warehouse before publication using automated fact-checking tools. The warehouse reflects data as published by the CBL; any lag or revision in the original source will be reflected here.",
  },
  {
    title: 'Estimates are flagged',
    body: "Where a number is a TrueRate estimate or a projection (for example, economic forecasts or company valuations), we label it clearly with \u201cEstimate\u201d, \u201cProjected\u201d, or \u201cTrueRate Research\u201d. These are our best effort, not audited figures.",
  },
  {
    title: 'Corrections',
    body: "We correct data errors publicly. If you spot one, send it via the Feedback page and we will review within one business day. Corrections are marked on the page where the error appeared.",
  },
  {
    title: 'Not investment advice',
    body: "Market data on TrueRate is published for informational purposes. It is not investment, legal, tax, or financial advice. Consult a licensed adviser before making decisions based on it. TrueRate is not liable for losses arising from use of the data.",
  },
];

export default function DataDisclaimerPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-8 pb-10">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Data Disclaimer' }]} />

        <div className="border-b border-gray-200 pb-10 mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Data</p>
          <h1 className="text-3xl sm:text-3xl font-bold leading-[1.08] tracking-tight text-gray-900 max-w-[780px] mb-5">
            Data disclaimer
          </h1>
          <p className="text-md text-gray-500 leading-[1.8] max-w-[640px]">
            Where the numbers come from, how often they update, and what they should &mdash; and should not &mdash; be used for.
          </p>
          <p className="mt-6 text-sm text-gray-500">Last updated: June 22, 2026</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-36">
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">On this page</p>
              <ul className="space-y-1">
                <li><a href="#sources" className="block py-1.5 text-base text-gray-500 hover:text-gray-900 no-underline">Data sources</a></li>
                <li><a href="#notes" className="block py-1.5 text-base text-gray-500 hover:text-gray-900 no-underline">Important notes</a></li>
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link href="/about/terms" className="block text-base text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Terms of Service →</Link>
                <Link href="/about/privacy" className="block text-base text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Privacy Policy →</Link>
                <Link href="/about/ads" className="block text-base text-gray-500 hover:text-gray-900 transition-colors no-underline">About Our Ads →</Link>
              </div>
            </div>
          </aside>

          <div className="max-w-[780px]">
            <section id="sources" className="mb-14 scroll-mt-36">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Where our data comes from</h2>
              <p className="text-md text-gray-700 leading-[1.9] mb-6">
                TrueRate aggregates market and economic data from primary and licensed sources. The Central Bank of Liberia data warehouse is the backbone of our economic reporting; live market feeds power the market rail and watchlist. This table lists what we use and how often each series refreshes.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-base">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-2xs font-bold uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">What we use</th>
                      <th className="px-4 py-3">Freshness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {SOURCES.map(r => (
                      <tr key={r.source} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-bold text-gray-900 align-top">{r.source}</td>
                        <td className="px-4 py-3 text-gray-600 align-top">{r.data}</td>
                        <td className="px-4 py-3 text-gray-500 tabular-nums align-top">{r.freshness}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="notes" className="mb-10 scroll-mt-36">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Important notes</h2>
              <div className="divide-y divide-gray-100">
                {NOTES.map(n => (
                  <div key={n.title} className="py-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{n.title}</h3>
                    <p className="text-md text-gray-600 leading-[1.85]">{n.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 mb-2">Disclaimer</p>
              <p className="text-md text-amber-900 leading-[1.8]">
                Nothing on TrueRate constitutes investment, legal, tax, or financial advice. Always consult a licensed financial adviser before making any investment decision.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/about" className="text-base text-gray-500 hover:text-gray-900 transition-colors no-underline">About TrueRate</Link>
              <Link href="/about/terms" className="text-base text-gray-500 hover:text-gray-900 transition-colors no-underline">Terms of Service</Link>
              <Link href="/about/privacy" className="text-base text-gray-500 hover:text-gray-900 transition-colors no-underline">Privacy Policy</Link>
              <Link href="/feedback" className="text-base text-gray-500 hover:text-gray-900 transition-colors no-underline">Send Feedback</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
