import Link from 'next/link';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';
import FooterVisibility from './FooterVisibility';

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  'Explore Further': [
    { label: 'News',              href: '/news' },
    { label: 'Markets',           href: '/markets' },
    { label: 'Economy',           href: '/economy' },
    { label: 'Technology',        href: '/technology' },
  ],
  'Life & Culture': [
    { label: 'Business',          href: '/small-business' },
    { label: 'Videos',            href: '/videos' },
  ],
  'Company': [
    { label: 'About TrueRate',    href: '/about' },
    { label: 'Help',              href: '/help' },
    { label: 'Feedback',          href: '/feedback' },
    { label: 'Data Disclaimer',   href: '/about/data-disclaimer' },
    { label: 'Terms of Service',  href: '/about/terms' },
    { label: 'Privacy Policy',    href: '/about/privacy' },
    { label: 'About Our Ads',     href: '/about/ads' },
  ],
};

const TRENDING_LINKS = [
  { label: 'News',              href: '/news' },
  { label: 'Markets',           href: '/markets' },
  { label: 'Economy',           href: '/economy' },
  { label: 'Technology',        href: '/technology' },
  { label: 'Business',          href: '/small-business' },
  { label: 'Videos',            href: '/videos' },
  { label: 'Watchlist',         href: '/watchlist' },
];

const LEGAL_LINKS = [
  { label: 'Data Disclaimer',  href: '/about/data-disclaimer' },
  { label: 'Help',             href: '/help' },
  { label: 'Feedback',         href: '/feedback' },
  { label: 'Terms of Service', href: '/about/terms' },
  { label: 'Privacy Policy',   href: '/about/privacy' },
  { label: 'About Our Ads',    href: '/about/ads' },
];

export default function Footer() {
  return (
    <FooterVisibility>
    <footer className="mt-4 sm:mt-10 border-t border-white/[0.06] bg-brand-dark">

      <div className="mx-auto max-w-container px-4 py-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">

          {/* Left: logo + copyright + socials (column 1 of the footer grid) */}
          <div className="shrink-0 flex flex-col sm:w-[220px]">
            <Link href="/" className="no-underline inline-block -ml-3 -mt-8 sm:-mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TrueRate" style={{ height: '112px', width: 'auto' }} />
            </Link>
            <Text className="-mt-9 text-gray-400 leading-relaxed">
              Copyright © 2026 TrueRate.<br />All rights reserved.
            </Text>
            {/* Social icons */}
            <ul className="mt-3 flex items-center gap-3 list-none p-0 m-0">
              {ACTIVE_SOCIAL_LINKS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`TrueRate on ${s.label}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-gray-900 hover:bg-white transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark">
                    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: link columns */}
          <nav aria-label="Footer" className="grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10 flex-1">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <Heading level={6} as="h4" className="mb-4 font-bold text-white">{title}</Heading>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-base text-gray-300 hover:text-white no-underline transition-colors focus-visible:outline-none focus-visible:underline">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

        </div>

        {/* Trending topics */}
        <div className="mt-6 border-t border-white/[0.05] pt-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Trending topics</p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="mt-6 border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 mb-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-gray-500 hover:text-white no-underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <Text variant="meta">Copyright © 2026 TrueRate. All rights reserved. · Not investment advice</Text>
          <Text variant="caption" className="mt-1 text-gray-400">Data: Central Bank of Liberia · LISGIS · World Bank · IMF · Yahoo Finance · TrueRate Research</Text>
        </div>

      </div>
    </footer>
    </FooterVisibility>
  );
}
