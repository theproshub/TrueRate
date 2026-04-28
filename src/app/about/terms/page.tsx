import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service — TrueRate',
  description: 'The terms that govern your use of TrueRate.com and related products.',
};

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of terms',
    body: [
      "By accessing or using TrueRate.com, our mobile experiences, newsletters, or any service we operate (\u201cthe Service\u201d), you agree to these Terms of Service. If you do not agree, do not use the Service.",
      "We may update these terms from time to time. When we do, we will update the effective date below. Material changes will be announced on the site. Continued use of the Service after a change constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: 'eligibility',
    title: '2. Who can use TrueRate',
    body: [
      "You must be at least 13 years old to use TrueRate. If you are under 18, you may only use the Service with the consent of a parent or legal guardian.",
      "If you are using TrueRate on behalf of an organisation, you represent that you have authority to bind that organisation to these terms.",
    ],
  },
  {
    id: 'accounts',
    title: '3. Accounts and watchlists',
    body: [
      "Some features \u2014 including watchlists, saved articles, and newsletter preferences \u2014 require an account. You agree to provide accurate information and to keep your credentials secure.",
      "You are responsible for activity that happens under your account. If you suspect unauthorised use, contact us immediately via the Feedback page.",
    ],
  },
  {
    id: 'content',
    title: '4. Our content',
    body: [
      "All editorial content, market data, charts, images, and analysis published on TrueRate are owned by TrueRate Media or licensed from our data partners (including the Central Bank of Liberia, World Bank, IMF, Ghana Stock Exchange, BRVM, and Reuters).",
      "You may share individual articles for personal, non-commercial use with proper attribution. You may not republish, scrape, syndicate, or build derivative products on top of our content without written permission.",
    ],
  },
  {
    id: 'not-advice',
    title: '5. Not investment advice',
    body: [
      "TrueRate publishes journalism and market information. Nothing on the Service \u2014 not prices, charts, articles, newsletters, nor commentary \u2014 constitutes investment, legal, tax, or financial advice.",
      "Do your own research. Consult a licensed adviser before making any investment decision. TrueRate is not responsible for losses resulting from decisions based on information published on the Service.",
    ],
  },
  {
    id: 'acceptable-use',
    title: '6. Acceptable use',
    body: [
      "You agree not to: interfere with or disrupt the Service; access the Service using automated means beyond reasonable browsing; attempt to reverse engineer any part of the Service; use the Service to violate any law or third party right; or post unlawful, harassing, or misleading content via interactive features.",
    ],
  },
  {
    id: 'termination',
    title: '7. Termination',
    body: [
      "We may suspend or terminate your access at any time if you violate these terms or if we are required to do so by law. You may stop using TrueRate at any time.",
    ],
  },
  {
    id: 'disclaimer',
    title: '8. Disclaimers and limitation of liability',
    body: [
      "The Service is provided \"as is\" without warranty of any kind. TrueRate does not guarantee accuracy, completeness, or uninterrupted availability. Market data may be delayed or estimated; we flag estimates where possible.",
      "To the maximum extent permitted by law, TrueRate is not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.",
    ],
  },
  {
    id: 'law',
    title: '9. Governing law',
    body: [
      "These terms are governed by the laws of the Republic of Liberia. Any dispute will be resolved in the courts of Monrovia unless otherwise required by applicable consumer protection law.",
    ],
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: [
      "Questions about these terms? Reach us via the Feedback page or email legal@truerate.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-8 pb-16">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Terms of Service' }]} />

        <div className="border-b border-gray-200 pb-10 mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">Legal</p>
          <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.08] tracking-tight text-gray-900 max-w-[780px] mb-5">
            Terms of Service
          </h1>
          <p className="text-[14px] text-gray-500 leading-[1.8] max-w-[640px]">
            These terms govern your use of TrueRate. Read them carefully &mdash; they cover what we publish, what you can do with it, and where our responsibilities start and end.
          </p>
          <p className="mt-6 text-[12px] text-gray-400">Effective: April 1, 2026</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">On this page</p>
              <ul className="space-y-1">
                {SECTIONS.map(s => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex items-center gap-2 py-1.5 text-[13px] text-gray-400 hover:text-gray-900 transition-colors no-underline group">
                      <span className="w-3 h-px bg-gray-300 group-hover:bg-gray-900 group-hover:w-5 transition-all duration-200" />
                      {s.title.replace(/^\d+\.\s/, '')}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link href="/about/privacy" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Privacy Policy →</Link>
                <Link href="/about/data-disclaimer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Data Disclaimer →</Link>
                <Link href="/about/ads" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">About Our Ads →</Link>
              </div>
            </div>
          </aside>

          <div className="max-w-[680px]">
            {SECTIONS.map(s => (
              <section key={s.id} id={s.id} className="mb-10">
                <h2 className="text-[18px] font-black text-gray-900 mb-4">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="text-[14px] text-gray-700 leading-[1.9] mb-3">{p}</p>
                ))}
              </section>
            ))}

            <div className="border-t border-gray-100 pt-8 mt-4 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/about" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">About TrueRate</Link>
              <Link href="/about/privacy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Privacy Policy</Link>
              <Link href="/about/ads" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">About Our Ads</Link>
              <Link href="/feedback" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Send Feedback</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
