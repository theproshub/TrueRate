import Link from 'next/link';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';
import FooterVisibility from './FooterVisibility';

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  'Sections': [
    { label: 'News',              href: '/news' },
    { label: 'Markets',           href: '/markets' },
    { label: 'Economy',           href: '/economy' },
    { label: 'Analytics',         href: '/analytics' },
    { label: 'Business',          href: '/small-business' },
    { label: 'Technology',        href: '/technology' },
    { label: 'Videos',            href: '/videos' },
  ],
  'Tools': [
    { label: 'My Watchlist',      href: '/watchlist' },
    { label: 'Saved Articles',    href: '/saved' },
    { label: 'Finance News',      href: '/news/finance' },
    { label: 'Newsletter',        href: '/about' },
    { label: 'RSS Feed',          href: '/feed' },
  ],
  'Company': [
    { label: 'About TrueRate',    href: '/about' },
    { label: 'Data Sources',      href: '/about#data-sources' },
    { label: 'Data Disclaimer',   href: '/about/data-disclaimer' },
    { label: 'Advertise',         href: '/about/ads' },
    { label: 'Help',              href: '/help' },
    { label: 'Feedback',          href: '/feedback' },
  ],
};

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '/about/terms' },
  { label: 'Privacy Policy',   href: '/about/privacy' },
  { label: 'Data Disclaimer',  href: '/about/data-disclaimer' },
  { label: 'About Our Ads',    href: '/about/ads' },
];

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark';

export default function Footer() {
  return (
    <FooterVisibility>
    <footer className="mt-4 sm:mt-10 border-t border-gray-200 bg-[#1E1E1E] text-gray-300">

      <div className="mx-auto max-w-container px-4 pt-8 pb-6">

        <div className="lg:flex lg:items-start lg:justify-between lg:gap-12">
          {/* Brand column */}
          <div className="mb-8 lg:mb-0 lg:max-w-[280px] lg:shrink-0">
            <Link href="/" className="no-underline inline-block -ml-3 -mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TrueRate" style={{ height: '96px', width: 'auto' }} />
            </Link>
            <p className="-mt-6 text-[#9ca3af] text-base font-body leading-relaxed max-w-[260px]">
              Liberia&apos;s financial intelligence platform — news, live market data, and economic analytics.
            </p>

            {/* Social icons */}
            <ul className="mt-4 flex items-center gap-3 list-none p-0 m-0">
              {ACTIVE_SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`TrueRate on ${s.label}`}
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-gray-300 hover:bg-white/[0.15] hover:text-white transition-colors no-underline ${focusRing}`}>
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:flex-1">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <Heading level={6} as="h4" className="mb-3 sm:mb-4 font-bold text-white">{title}</Heading>
                <ul className="space-y-2 sm:space-y-2.5">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className={`text-xs sm:text-sm text-gray-400 hover:text-white no-underline transition-colors ${focusRing}`}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Data sources bar */}
        <div className="mt-8 border-t border-white/[0.05] pt-5">
          <p className="text-2xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-2">Data sources</p>
          <Text variant="caption" className="text-gray-400 leading-relaxed">
            Central Bank of Liberia&ensp;&middot;&ensp;LISGIS&ensp;&middot;&ensp;Ministry of Finance (MFDP)&ensp;&middot;&ensp;World Bank&ensp;&middot;&ensp;IMF&ensp;&middot;&ensp;Yahoo Finance&ensp;&middot;&ensp;TrueRate Research
          </Text>
        </div>

        {/* Legal bottom bar */}
        <div className="mt-5 border-t border-white/[0.05] pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className={`text-xs text-gray-500 hover:text-white no-underline transition-colors ${focusRing}`}>
                {label}
              </Link>
            ))}
          </div>
          <Text variant="meta" className="text-gray-500 shrink-0">
            &copy; 2026 TrueRate. All rights reserved. &middot; Not investment advice
          </Text>
        </div>

      </div>
    </footer>
    </FooterVisibility>
  );
}
