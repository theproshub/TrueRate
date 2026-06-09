import type { Metadata } from 'next';
import Link from 'next/link';
import TableOfContents from './_TableOfContents';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/about' },
  description: "Why we built TrueRate: trusted financial news, market data, and economic intelligence for Liberia — covering markets, the economy, business, banking, personal finance, and technology.",
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
              { label: 'Coverage', value: '7 sections' },
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
                {['Central Bank of Liberia', 'LISGIS', 'Ministry of Finance (MFDP)', 'World Bank', 'IMF', 'Yahoo Finance'].map(s => (
                  <li key={s} className="text-sm text-gray-600 mb-1.5">{s}</li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

        {/* Content */}
        <div className="max-w-[680px]">

          <section id="our-story" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Our Story</h2>
            <p className="text-lg text-gray-800 leading-[1.9] mb-5">
              TrueRate was founded by <span className="font-bold text-gray-900">Moses Julian Sackey</span> with one conviction: Liberia&apos;s economy deserves accurate, independent, and accessible financial information. Markets move, prices change, and policy decisions affect millions of people — yet most of it goes unreported or is hard to find in one trustworthy place.
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
                  title: 'Markets',
                  desc: "Exchange rates, commodities, and investments. The USD/LRD rate, iron ore, gold, rubber, and palm oil — the numbers that matter to anyone with money moving in or out of Liberia. Market data is pulled live from primary sources, never estimated.",
                },
                {
                  title: 'Economy',
                  desc: "Inflation, GDP, employment, trade, government spending, and economic policy. The CBL policy rate, public debt, and what Liberia's dual-currency economy means for everyday prices.",
                },
                {
                  title: 'Business',
                  desc: "Companies, deals, corporate developments, and the people running Liberia's organisations — from ArcelorMittal and the major banks to the SMEs growing out of Paynesville.",
                },
                {
                  title: 'Banking & Finance',
                  desc: "Banks, fintech, mobile money, insurance, and regulation. Ecobank, UBA, and GTBank; MTN and Orange mobile money; and the CBL's instant-payment system connecting them.",
                },
                {
                  title: 'Personal Finance',
                  desc: "Saving, budgeting, debt, and investing — explained plainly. Practical financial education that helps ordinary readers make better decisions with their money.",
                },
                {
                  title: 'Technology',
                  desc: "Innovation, digital infrastructure, AI, and fintech. What's changing in how Liberians transact, communicate, and build — and where the real opportunities are.",
                },
                {
                  title: 'Interviews',
                  desc: "Business leaders, entrepreneurs, policymakers, and economists. Conversations that seek facts, context, and accountability — not promotion disguised as reporting.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="py-6 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                  <h3 className="text-md font-bold text-gray-900 pt-0.5">{title}</h3>
                  <p className="text-md text-gray-600 leading-[1.8]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="standards" className="mb-10 scroll-mt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 mb-6">Our Standards</h2>
            <p className="text-lg text-gray-700 leading-[1.9] mb-5">
              Facts come before speed. Market data is pulled live from licensed providers, and never AI-generated. Economic figures are drawn from primary sources — the Central Bank of Liberia, LISGIS, the Ministry of Finance, the World Bank, and the IMF — which always outrank aggregators. We verify names, figures, and quotations before publishing; where a number is an estimate or sources disagree, we say so.
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
              { label: 'Help Center',      href: '/help' },
              { label: 'Send Feedback',    href: '/feedback' },
              { label: 'Advertise',        href: '/about/ads' },
              { label: 'Privacy Policy',   href: '/about/privacy' },
              { label: 'Terms of Service', href: '/about/terms' },
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
