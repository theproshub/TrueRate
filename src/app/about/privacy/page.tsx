import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy — TrueRate',
  description: 'What data TrueRate collects, why we collect it, and the rights you have over your information.',
};

const SECTIONS = [
  {
    id: 'what-we-collect',
    title: '1. What we collect',
    body: [
      "Account information you give us: your name, email address, and password when you create an account or subscribe to a newsletter.",
      "Usage information we collect automatically: pages visited, referring site, device type, rough location based on IP, and interactions with articles and widgets. We use this to understand what our readers care about.",
      "Payments, when applicable: if you subscribe to a paid product, we receive your billing email and a tokenised payment reference from our payments processor. We do not store full card numbers on our servers.",
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How we use your data',
    body: [
      "To deliver the service: serving articles, customising your watchlist, sending newsletters you have signed up for, responding to support requests.",
      "To improve the service: aggregated analytics on what stories resonate, what breaks, and what to build next.",
      "To comply with law: responding to lawful requests from authorities and preserving records where required.",
    ],
  },
  {
    id: 'advertising',
    title: '3. Advertising and analytics',
    body: [
      "TrueRate shows advertising to keep journalism free. We work with vetted ad partners who may set cookies to measure ad performance and show you more relevant ads. You can read more on the About Our Ads page and opt out of personalised advertising there.",
      "We use privacy-respecting analytics on the site. Where required by law, we ask for consent before setting non-essential cookies.",
    ],
  },
  {
    id: 'sharing',
    title: '4. Who we share data with',
    body: [
      "Service providers we rely on to run TrueRate: hosting (Vercel), email delivery, payments, customer support, and analytics. These providers are contractually limited to processing data on our behalf.",
      "Regulators, law enforcement, or courts when we are legally required to disclose information.",
      "We do not sell your personal information.",
    ],
  },
  {
    id: 'retention',
    title: '5. How long we keep your data',
    body: [
      "Account data is retained while your account is active and for a reasonable period afterwards to handle disputes and meet legal obligations. Aggregated analytics that cannot identify you may be retained longer.",
    ],
  },
  {
    id: 'your-rights',
    title: '6. Your rights',
    body: [
      "You can access, correct, export, or delete your personal data at any time. To do so, visit your account settings or email privacy@truerate.com. Depending on where you live, you may also have rights to object to processing or to complain to a data protection authority.",
    ],
  },
  {
    id: 'security',
    title: '7. Security',
    body: [
      "We protect your data with industry-standard controls: encryption in transit, encrypted databases, access controls, and regular reviews. No system is perfectly secure; if you believe your account has been compromised, contact us immediately.",
    ],
  },
  {
    id: 'children',
    title: '8. Children',
    body: [
      "TrueRate is not directed at children under 13. We do not knowingly collect personal data from children under 13. If you believe a child has created an account, contact us and we will remove the data.",
    ],
  },
  {
    id: 'international',
    title: '9. International transfers',
    body: [
      "TrueRate is based in Liberia and uses service providers located in other countries. When data is transferred internationally we rely on appropriate safeguards such as standard contractual clauses.",
    ],
  },
  {
    id: 'contact',
    title: '10. Contact',
    body: [
      "Questions about this policy or your data? Email privacy@truerate.com or send feedback through the Feedback page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-8 pb-16">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Privacy Policy' }]} />

        <div className="border-b border-gray-200 pb-10 mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">Legal</p>
          <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.08] tracking-tight text-gray-900 max-w-[780px] mb-5">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-gray-500 leading-[1.8] max-w-[640px]">
            Plainly: what we collect, what we do with it, and the controls you have. We take the protection of your data seriously and try to keep this policy readable.
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
                <Link href="/about/terms" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Terms of Service →</Link>
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
              <Link href="/about/terms" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Terms of Service</Link>
              <Link href="/about/ads" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">About Our Ads</Link>
              <Link href="/feedback" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Send Feedback</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
