import type { Metadata } from 'next';
import { Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Help & FAQ',
  alternates: { canonical: '/help' },
  description: 'Answers to common questions about TrueRate — data sources, pricing, mobile access, and more.',
};

const FAQS = [
  { q: 'Is TrueRate free to use?', a: 'Yes. TrueRate’s news, market data, currency converter, and research are free to read — no payment required. You can create a free account to save articles and use the watchlist. We may add premium products later, but our core coverage stays free.' },
  { q: 'Where does TrueRate get its data?', a: 'Live exchange rates come from a free third-party currency feed (with LRD cross-rates computed as a mid-market reference), commodity prices from Stooq, and economic figures from primary sources — the Central Bank of Liberia, LISGIS, the Ministry of Finance, the World Bank, and the IMF. Primary sources always outrank aggregators.' },
  { q: 'How do I report an error in the data?', a: 'Please use the Feedback page to report any data issues. Our team reviews all submissions within 24 hours.' },
  { q: 'Can I access TrueRate on mobile?', a: 'Yes. TrueRate is fully responsive and works on all modern mobile browsers. A dedicated app is coming soon.' },
  { q: 'Do I need an account to read TrueRate?', a: 'No. All content is freely accessible without an account. Creating an account lets you save articles and use the watchlist.' },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-[860px] px-4 py-12">
      <Heading level={2} as="h1" className="mb-1 text-white">Help Center</Heading>
      <p className="mb-8 text-base text-gray-500">Answers to common questions about TrueRate</p>

      <div className="divide-y divide-white/[0.07]">
        {FAQS.map(faq => (
          <div key={faq.q} className="py-5">
            <h3 className="mb-2 text-sm font-bold text-white">{faq.q}</h3>
            <p className="text-base leading-relaxed text-gray-500">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-white/[0.07] pt-8 text-center">
        <h2 className="mb-2 text-lg font-bold text-white">Still need help?</h2>
        <p className="mb-4 text-base text-gray-500">Send us a message and we&apos;ll get back to you within 24 hours.</p>
        <a href="/feedback" className="inline-block rounded-full bg-white px-6 py-2.5 text-base font-semibold text-brand-ink hover:bg-white/90 transition no-underline">
          Contact Support
        </a>
      </div>
    </main>
  );
}
