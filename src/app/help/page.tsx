import type { Metadata } from 'next';
import Link from 'next/link';
import { Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Help & FAQ',
  alternates: { canonical: '/help' },
  description: 'Answers to common questions about TrueRate — data sources, pricing, mobile access, and more.',
};

const FAQS = [
  { q: "Is TrueRate free to use?", a: "Yes. All news, market data, analytics dashboards, videos, and research on TrueRate are free to read — no payment required. You can create a free account to save articles, build a personalised watchlist, and subscribe to our newsletter. We may add premium products later, but our core coverage stays free." },
  { q: "Where does TrueRate get its data?", a: "Live exchange rates come from a licensed currency feed (with LRD cross-rates computed as a mid-market reference), commodity prices and global indices from Yahoo Finance, and economic figures from primary sources — the Central Bank of Liberia (via our CBL data warehouse), LISGIS, the Ministry of Finance, the World Bank, and the IMF. TrueRate Research produces proprietary analysis, always labelled as estimates. Primary sources always outrank aggregators. See the Data Disclaimer for full details." },
  { q: "What is the CBL data warehouse?", a: "TrueRate maintains a structured data warehouse of Central Bank of Liberia statistical series — exchange rates, monetary aggregates, inflation, trade, fiscal data, and more. Every economic figure in our reporting is verified against this warehouse before publication using automated fact-checking tools." },
  { q: "How does the watchlist work?", a: "Sign in and visit the Watchlist page to add currencies, commodities, and market instruments you want to track. Your watchlist updates in real time and syncs across devices." },
  { q: "How do I save articles?", a: "Click the bookmark icon on any article to save it. Your saved articles are accessible from the Saved page and sync across devices when you are signed in." },
  { q: "Is there an RSS feed?", a: "Yes. A full-content RSS feed is available at /feed. You can subscribe with any feed reader." },
  { q: "How do I subscribe to the newsletter?", a: "Enter your email in the newsletter widget on any page, or visit your account settings to manage your subscription. We send a curated digest of the most important financial news." },
  { q: "How do I report an error in the data?", a: "Please use the Feedback page to report any data issues. Our team reviews all submissions within 24 hours." },
  { q: "Can I access TrueRate on mobile?", a: "Yes. TrueRate is fully responsive and works on all modern mobile browsers. A dedicated app is coming soon." },
  { q: "Do I need an account to read TrueRate?", a: "No. All content is freely accessible without an account. Creating an account unlocks saved articles, the personalised watchlist, and newsletter subscriptions." },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-12">
      <Heading level={2} as="h1" className="mb-1 text-gray-900">Help Center</Heading>
      <p className="mb-8 text-base text-gray-500">Answers to common questions about TrueRate</p>

      <div className="divide-y divide-gray-200">
        {FAQS.map(faq => (
          <div key={faq.q} className="py-5">
            <h3 className="mb-2 text-sm font-bold text-gray-900">{faq.q}</h3>
            <p className="text-base leading-relaxed text-gray-500">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-8 text-center">
        <h2 className="mb-2 text-lg font-bold text-gray-900">Still need help?</h2>
        <p className="mb-4 text-base text-gray-500">Send us a message and we&apos;ll get back to you within 24 hours.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/feedback" className="inline-block rounded-full bg-white px-6 py-2.5 text-base font-semibold text-brand-ink hover:bg-white/90 transition no-underline">
            Contact Support
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
