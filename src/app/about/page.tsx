import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from './_TableOfContents';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
  description: "Why we built TrueRate: trusted financial news, live market data, and economic intelligence for Liberia — covering markets, the economy, business, technology, analytics, and more.",
};

const focusRing =
  'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none focus-visible:rounded-sm';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-8 pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">About TrueRate</p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 max-w-[780px] mb-6">
            We built TrueRate because Liberia&apos;s economy deserves financial data it can trust.
          </h1>
          <p className="text-lg text-gray-600 leading-[1.8] max-w-[600px] mb-8">
            TrueRate is a financial news, markets, and economic intelligence platform for Liberia. We bring together reporting, live market data, and economic analysis to help people make better-informed decisions — and to build the country&apos;s most trusted source for financial information.
          </p>
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-gray-100 pt-7">
            {[
              { label: 'Founded',  value: '2026' },
              { label: 'Based in', value: 'Monrovia, Liberia' },
              { label: 'Coverage', value: '8 sections' },
              { label: 'Access',   value: 'Free to read' },
              { label: 'Founder',  value: 'Moses Julian Sackey' },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">{label}</dt>
                <dd className="text-md font-bold text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 space-y-5">

            <TableOfContents />

            <div className="border-t border-gray-100 pt-5">
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">Get in touch</p>
              <Link href="/feedback" className={`block text-base text-gray-600 hover:text-brand-accent-ink transition-colors no-underline py-1.5 ${focusRing}`}>Send feedback →</Link>
              <Link href="/help" className={`block text-base text-gray-600 hover:text-brand-accent-ink transition-colors no-underline py-1.5 ${focusRing}`}>Help center →</Link>
              <Link href="/about/ads" className={`block text-base text-gray-600 hover:text-brand-accent-ink transition-colors no-underline py-1.5 ${focusRing}`}>Advertise with us →</Link>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">Data sources</p>
              <ul>
                {['Central Bank of Liberia', 'LISGIS', 'Ministry of Finance (MFDP)', 'World Bank', 'IMF', 'Yahoo Finance', 'TrueRate Research'].map(s => (
                  <li key={s} className="text-sm text-gray-600 mb-1.5">{s}</li>
                ))}
              </ul>
              <Link href="/about/data-disclaimer" className={`block text-sm text-gray-500 hover:text-brand-accent-ink transition-colors no-underline mt-3 ${focusRing}`}>Full data disclaimer →</Link>
            </div>

          </div>
        </aside>

        {/* Content */}
        <div className="max-w-[680px]">

          <section id="our-story" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Our Story</h2>
            <p className="text-lg text-gray-800 leading-[1.9] mb-5">
              TrueRate was founded by <span className="font-bold text-gray-900">Moses Julian Sackey</span>{' '}with one conviction: Liberia&apos;s economy deserves accurate, independent, and accessible financial information. Markets move, prices change, and policy decisions affect millions of people — yet most of it goes unreported or is hard to find in one trustworthy place.
            </p>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              Our mission is to improve financial literacy, economic understanding, and access to reliable information across Liberia. We follow the principles of the publications we admire — Bloomberg, Reuters, the Financial Times, and Yahoo Finance — and adapt them for Liberia and, over time, West Africa. Every story aims to answer four questions: what happened, why it matters, who is affected, and what happens next.
            </p>
            <p className="text-lg text-gray-700 leading-[1.9]">
              We&apos;re building TrueRate in stages: trustworthy reporting first, then live market data, company and economic intelligence, and research tools. The long-term goal isn&apos;t traffic — it&apos;s trust. We want professionals, investors, entrepreneurs, students, and policymakers to reach for TrueRate first when they need to understand Liberia&apos;s economy.
            </p>
          </section>

          <section id="coverage" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-8">What We Cover</h2>
            <div className="divide-y divide-gray-100">
              {[
                {
                  title: 'News',
                  desc: "Breaking news, features, and analysis across Liberia’s financial landscape. Finance news, policy developments, and corporate stories — filed daily and held to the same sourcing standard as the publications we benchmark against.",
                },
                {
                  title: 'Markets',
                  desc: "Live exchange rates, commodities, and global market data. The USD/LRD rate, iron ore, gold, rubber, palm oil, and crude — the numbers that matter to anyone with money moving in or out of Liberia. Market data is pulled from licensed feeds, never estimated.",
                },
                {
                  title: 'Economy',
                  desc: "Inflation, GDP, employment, trade, government spending, and economic policy. Sub-sections cover monetary policy, trade, and fiscal data. Powered by the Central Bank of Liberia’s statistical warehouse.",
                },
                {
                  title: 'Analytics',
                  desc: "Interactive charts, data dashboards, and economic indicators. Visualize CBL data series, compare trends across multiple indicators, and explore Liberia’s macro environment through tools built for research and decision-making.",
                },
                {
                  title: 'Business',
                  desc: "Companies, deals, corporate developments, and the people running Liberia’s organisations — from ArcelorMittal and the major banks to the SMEs growing out of Paynesville.",
                },
                {
                  title: 'Technology',
                  desc: "Innovation, digital infrastructure, AI, and fintech. What’s changing in how Liberians transact, communicate, and build — and where the real opportunities are.",
                },
                {
                  title: 'Videos',
                  desc: "Video features, interviews, and market briefings. Visual storytelling for stories that benefit from more than text — company profiles, economic explainers, and on-the-ground reporting.",
                },
                {
                  title: 'Watchlist',
                  desc: "A personal dashboard for tracking the markets, currencies, and commodities you care about. Sign in to save instruments and monitor them in one place.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="py-6 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                  <h3 className="text-md font-bold text-gray-900 pt-0.5">{title}</h3>
                  <p className="text-md text-gray-600 leading-[1.8]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="platform" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Platform &amp; Features</h2>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              TrueRate is more than a news site. It is a financial intelligence platform built for Liberia, combining editorial journalism with live data, research tools, and personalization.
            </p>
            <div className="divide-y divide-gray-100">
              {[
                {
                  title: 'Live Market Rail',
                  desc: "A real-time ticker across the top of every page showing the LRD/USD exchange rate, key commodities, and global indices — updated continuously from licensed data feeds.",
                },
                {
                  title: 'CBL Data Warehouse',
                  desc: "TrueRate maintains a structured data warehouse of Central Bank of Liberia statistical series — exchange rates, monetary aggregates, inflation, trade, fiscal data, and more. Every economic figure in our reporting is sourced from this warehouse and verified before publication.",
                },
                {
                  title: 'Personalized Watchlist',
                  desc: "Signed-in users can build a personal watchlist of currencies, commodities, and market instruments. The watchlist updates in real time and serves as a personal dashboard.",
                },
                {
                  title: 'Saved Articles',
                  desc: "Bookmark any article to read later. Your saved stories sync across devices when signed in.",
                },
                {
                  title: 'Newsletter',
                  desc: "A curated digest of the most important financial news, delivered to your inbox. Subscribe from any page on the site.",
                },
                {
                  title: 'RSS Feed',
                  desc: "A full-content RSS feed at /feed for readers who prefer feed readers or need to integrate TrueRate into their own workflows.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="py-6 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3">
                  <h3 className="text-md font-bold text-gray-900 pt-0.5">{title}</h3>
                  <p className="text-md text-gray-600 leading-[1.8]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="data-sources" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Data Sources</h2>
            <p className="text-lg text-gray-700 leading-[1.9] mb-6">
              Every number on TrueRate is traceable to a primary source. We never fabricate, estimate without disclosure, or use unverified aggregators. Our principal data sources are:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-base">
                <caption className="sr-only">TrueRate data sources, what each provides, and how often the data refreshes</caption>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-2xs font-bold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Source</th>
                    <th scope="col" className="px-4 py-3">What We Use</th>
                    <th scope="col" className="px-4 py-3">Freshness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { source: 'Central Bank of Liberia (CBL)', data: 'Exchange rates, policy rate, reserves, monetary aggregates, banking sector data, trade, and fiscal statistics via the CBL data warehouse', freshness: 'As published' },
                    { source: 'Open currency-rate feed (CDN)', data: 'Live USD-base FX rates; LRD cross-rates computed as mid-market reference levels', freshness: 'Hourly' },
                    { source: 'Yahoo Finance', data: 'Commodity prices (gold, oil, iron ore, rubber, palm oil) and global equity indices', freshness: '~15 min delay' },
                    { source: 'LISGIS', data: 'Consumer price index (inflation), population estimates, national statistics', freshness: 'As published' },
                    { source: 'Ministry of Finance (MFDP)', data: 'National budget, fiscal data, public debt, revenue and expenditure', freshness: 'As published' },
                    { source: 'World Bank Open Data', data: 'GDP, inflation, debt-to-GDP, employment, trade balance, development indicators', freshness: 'Annual / quarterly' },
                    { source: 'International Monetary Fund', data: 'World Economic Outlook projections, Article IV reports, fiscal data', freshness: 'Semi-annual' },
                    { source: 'TrueRate Research', data: 'Proprietary analysis, company profiles, survey data — always labelled as estimates', freshness: 'As published' },
                  ].map(r => (
                    <tr key={r.source} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-bold text-gray-900 align-top">{r.source}</td>
                      <td className="px-4 py-3 text-gray-600 align-top">{r.data}</td>
                      <td className="px-4 py-3 text-gray-500 tabular-nums align-top whitespace-nowrap">{r.freshness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              For full details on data freshness, delays, and limitations, see our{' '}
              <Link href="/about/data-disclaimer" className={`text-brand-accent-ink hover:underline ${focusRing}`}>Data Disclaimer</Link>.
            </p>
          </section>

          <section id="standards" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Our Standards</h2>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              Facts come before speed. Market data is pulled live from licensed providers, and never AI-generated. Economic figures are drawn from primary sources — the Central Bank of Liberia, LISGIS, the Ministry of Finance, the World Bank, and the IMF — which always outrank aggregators. We verify names, figures, and quotations before publishing; where a number is an estimate or sources disagree, we say so.
            </p>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              Every economic claim in our reporting is verified against the CBL data warehouse before publication. We use automated fact-checking tools that extract every numerical claim from an article and match it against the underlying data series — checking values, units, time periods, and directional consistency. No article publishes with unverified figures.
            </p>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              Our editorial operation is independent of commercial interests. Advertisers have no influence over what we report, and any sponsored content is clearly labelled and kept separate from editorial. When we get something wrong, we correct it promptly and transparently, and explain what happened.
            </p>
            <p className="text-lg text-gray-700 leading-[1.9]">
              We do not fabricate quotes or publish unverified claims about named people or companies. AI may assist with research, drafting, and data analysis, but every story is held to the same standard and reviewed by a person before it is published.
            </p>
          </section>

          <section id="disclaimer" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-5">Disclaimer</h2>
            <p className="text-md text-gray-600 leading-[1.85]">
              TrueRate publishes financial and market information for informational purposes only. Nothing on this platform constitutes financial, investment, legal, or tax advice, or a recommendation to buy, sell, or hold any asset. Market rates are indicative, may differ from rates offered by banks or exchanges, and should be verified independently. Always consult a qualified professional before making any financial decision. TrueRate is not responsible for decisions made based on content published on this platform.
            </p>
          </section>

          <nav aria-label="More about TrueRate" className="border-t border-gray-100 pt-5 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: 'Help Center',       href: '/help' },
              { label: 'Send Feedback',     href: '/feedback' },
              { label: 'Data Disclaimer',   href: '/about/data-disclaimer' },
              { label: 'Advertise',         href: '/about/ads' },
              { label: 'Privacy Policy',    href: '/about/privacy' },
              { label: 'Terms of Service',  href: '/about/terms' },
            ].map(l => (
              <Link key={l.label} href={l.href} className={`text-base text-gray-600 no-underline hover:text-brand-accent-ink transition-colors py-1 ${focusRing}`}>
                {l.label}
              </Link>
            ))}
          </nav>

        </div>
      </div>
    </div>
  );
}
