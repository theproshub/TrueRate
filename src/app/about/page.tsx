import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — TrueRate',
  description: "Why we built TrueRate: covering business, investing, technology, entrepreneurship, leadership and lifestyle across Liberia.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-14 pb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">About TrueRate</p>
          <h1 className="text-[32px] sm:text-[48px] font-black leading-[1.05] tracking-tight text-gray-900 max-w-[780px] mb-6">
            We built TrueRate because Liberia&apos;s business story wasn&apos;t being told.
          </h1>
          <p className="text-[16px] text-gray-500 leading-[1.8] max-w-[600px] mb-8">
            Every day, deals close, markets move, and companies grow — and most of it goes unreported. TrueRate covers business, investing, technology, entrepreneurship, leadership, and lifestyle across Liberia.
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-gray-100 pt-7">
            {[
              { label: 'Founded',  value: '2026' },
              { label: 'Based in', value: 'Monrovia, Liberia' },
              { label: 'Coverage', value: '6 verticals' },
              { label: 'Access',   value: 'Free, always' },
              { label: 'Founder',  value: 'Moses Julian Sackey' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
                <p className="text-[14px] font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 py-14 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-8">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">On this page</p>
              <ul className="space-y-1">
                {[
                  { label: 'Our Story',      id: 'our-story'  },
                  { label: 'What We Cover',  id: 'coverage'   },
                  { label: 'Our Standards',  id: 'standards'  },
                  { label: 'Disclaimer',     id: 'disclaimer' },
                ].map(({ label, id }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="flex items-center gap-2 py-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors no-underline group">
                      <span className="w-3 h-px bg-gray-300 group-hover:bg-gray-900 group-hover:w-5 transition-all duration-200" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">Get in touch</p>
              <Link href="/feedback" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Send feedback →</Link>
              <Link href="/help" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Help center →</Link>
              <Link href="/about" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Advertise with us →</Link>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">Data sources</p>
              {['Central Bank of Liberia', 'World Bank', 'IMF', 'Ghana Stock Exchange', 'BRVM', 'Reuters'].map(s => (
                <p key={s} className="text-[12px] text-gray-400 mb-1.5">{s}</p>
              ))}
            </div>

          </div>
        </aside>

        {/* Content */}
        <div className="max-w-[680px]">

          <section id="our-story" className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-6">Our Story</p>
            <p className="text-[17px] text-gray-800 leading-[1.9] mb-5">
              TrueRate was founded by <span className="font-bold text-gray-900">Moses Julian Sackey</span> with one conviction: Liberia&apos;s economy deserves serious, independent coverage. Companies are raising capital, deals are closing, markets are moving — and most of it goes unreported.
            </p>
            <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
              There is no shortage of things happening in Liberia. Entrepreneurs are building businesses. Investors are looking at the region. Policymakers are making decisions that affect millions of people. What has been missing is a media organisation willing to cover it properly — not press releases, not wire copy, not aggregated headlines from international outlets that barely know Liberia exists.
            </p>
            <p className="text-[17px] text-gray-700 leading-[1.9]">
              We built TrueRate to close that gap. Original journalism. Real-time market data. Coverage built for people who have something at stake in how Liberia&apos;s economy develops.
            </p>
          </section>

          <section id="coverage" className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-8">What We Cover</p>
            <div className="divide-y divide-gray-100">
              {[
                {
                  title: 'Business',
                  desc: "Corporate earnings, deals, company news, and the people running Liberia's largest organisations. From ArcelorMittal to the SMEs growing out of Paynesville.",
                },
                {
                  title: 'Investing',
                  desc: "LRD/USD rates, CBL policy, market data for rubber, iron ore, gold, and palm oil. The numbers that matter to anyone with money moving in or out of Liberia.",
                },
                {
                  title: 'Technology',
                  desc: "Fintech, mobile money, digital infrastructure. What's changing in how Liberians transact, communicate, and build — and where the real opportunities are.",
                },
                {
                  title: 'Entrepreneurship',
                  desc: "Founders, SMEs, and the capital flowing into the ecosystem. Who is building, how they are doing it, and what they need to go further.",
                },
                {
                  title: 'Leadership',
                  desc: "The executives, ministers, and decision-makers whose choices shape what happens next. Interviews, profiles, and accountability reporting.",
                },
                {
                  title: 'Lifestyle',
                  desc: "Sports, culture, and the side of Liberia that doesn't show up in GDP figures but matters deeply to how people actually live.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="py-6 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                  <p className="text-[14px] font-bold text-gray-900 pt-0.5">{title}</p>
                  <p className="text-[14px] text-gray-500 leading-[1.8]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="standards" className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-6">Our Standards</p>
            <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
              Market data is sourced from the Central Bank of Liberia, World Bank, IMF, Ghana Stock Exchange, BRVM, and licensed data providers. Where data is estimated, we say so.
            </p>
            <p className="text-[17px] text-gray-700 leading-[1.9] mb-5">
              Our editorial operation is independent. Advertisers have no influence over what we report or how we report it. When we get something wrong, we correct it publicly and explain what happened.
            </p>
            <p className="text-[17px] text-gray-700 leading-[1.9]">
              We follow the West Africa Journalists Association code of ethics. Sources are protected without exception. We do not publish unverified claims, and we do not accept payment for coverage.
            </p>
          </section>

          <section id="disclaimer" className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">Disclaimer</p>
            <p className="text-[14px] text-gray-400 leading-[1.85]">
              TrueRate publishes financial and market information for informational purposes only. Nothing on this platform constitutes investment advice, financial advice, or a recommendation to buy or sell any asset. Always consult a licensed financial adviser before making any investment decision. TrueRate is not responsible for decisions made based on content published on this platform.
            </p>
          </section>

          <div className="border-t border-gray-100 pt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: 'Help Center',      href: '/help' },
              { label: 'Send Feedback',    href: '/feedback' },
              { label: 'Advertise',        href: '/about' },
              { label: 'Privacy Policy',   href: '/about' },
              { label: 'Terms of Service', href: '/about' },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[13px] text-gray-400 no-underline hover:text-gray-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
