import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'About Our Ads — TrueRate',
  description: 'Why TrueRate shows advertising, how we keep it honest, and the controls you have over personalised ads.',
};

const SECTIONS = [
  {
    id: 'why',
    title: 'Why we show ads',
    body: [
      "TrueRate is free to read because advertising helps pay for original reporting, data licensing, and the engineers and journalists who build the site. We think keeping business and economic coverage accessible to every Liberian is worth the trade-off.",
    ],
  },
  {
    id: 'formats',
    title: 'What you will see',
    body: [
      "Display ads placed in clearly labeled slots on articles, section pages, and newsletters.",
      "Sponsored content, always marked with a \u201cSponsored\u201d or \u201cPaid partner\u201d label and visually distinct from editorial copy.",
      "Partner integrations \u2014 for example, webinar or event announcements \u2014 where relevance to our readership is meaningful.",
    ],
  },
  {
    id: 'partners',
    title: 'Who our partners are',
    body: [
      "We work with a small set of vetted ad technology partners to sell and measure ads. These partners may set cookies to measure how many people saw an ad, whether it loaded correctly, and whether it led to clicks.",
      "Where personalised advertising is available, partners may use non-identifying signals (such as the type of page you are reading) to show ads more likely to interest you.",
    ],
  },
  {
    id: 'editorial',
    title: 'Editorial independence',
    body: [
      "Advertisers do not influence what we cover or how we cover it. Our journalists do not see commercial bookings, and our commercial team does not see editorial plans.",
      "If we ever write about a company that advertises with us, the reporting stands on its own merit \u2014 positive or negative.",
    ],
  },
  {
    id: 'your-choices',
    title: 'Your choices',
    body: [
      "Personalised ads: you can opt out at any time from your account preferences. You will still see ads, but they will be contextual (tied to the content of the page) rather than personalised.",
      "Cookie preferences: when required by law, we ask for your consent before loading non-essential ad cookies. You can change your choice any time from the cookie banner.",
      "Ad-blockers: we don\u2019t paywall the site or detect blockers. If you use one, TrueRate will still work \u2014 though supporting our Daily Brief helps us keep going.",
    ],
  },
  {
    id: 'report',
    title: 'Report an ad',
    body: [
      "Seen an ad that feels misleading, inappropriate, or broken? Tell us via the Feedback page and we\u2019ll investigate within one business day.",
    ],
  },
  {
    id: 'advertise',
    title: 'Advertise with TrueRate',
    body: [
      "Want to reach decision-makers across Liberian business, finance, and technology? Email advertise@truerate.com with your brief and budget. We\u2019ll respond within two business days with available formats and indicative rates.",
    ],
  },
];

export default function AdsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-10 pt-8 pb-16">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'About Our Ads' }]} />

        <div className="border-b border-gray-200 pb-10 mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-5">Commercial</p>
          <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.08] tracking-tight text-gray-900 max-w-[780px] mb-5">
            About our ads
          </h1>
          <p className="text-[14px] text-gray-500 leading-[1.8] max-w-[640px]">
            Advertising keeps TrueRate free. Here&apos;s how we run commercial relationships, where the lines between editorial and ads sit, and what you can control.
          </p>
          <p className="mt-6 text-[12px] text-gray-400">Last updated: April 1, 2026</p>
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
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link href="/about/terms" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Terms of Service →</Link>
                <Link href="/about/privacy" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline mb-2">Privacy Policy →</Link>
                <Link href="/about/data-disclaimer" className="block text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Data Disclaimer →</Link>
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

            <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">Advertise with us</p>
              <p className="text-[14px] text-gray-900 mb-3">Reach business decision-makers across Liberia and West Africa.</p>
              <a href="mailto:advertise@truerate.com" className="inline-block rounded-lg bg-gray-900 text-white px-4 py-2 text-[13px] font-semibold no-underline hover:bg-gray-800 transition-colors">advertise@truerate.com</a>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/about" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">About TrueRate</Link>
              <Link href="/about/terms" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Terms of Service</Link>
              <Link href="/about/privacy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Privacy Policy</Link>
              <Link href="/feedback" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Send Feedback</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
