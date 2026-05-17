'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heading, Text } from '@/components/ui';

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  'Explore Further': [
    { label: 'News',              href: '/news' },
    { label: 'Markets',           href: '/markets' },
    { label: 'Economy',           href: '/economy' },
    { label: 'Technology',        href: '/technology' },
  ],
  'Life & Culture': [
    { label: 'Entertainment',     href: '/entertainment' },
    { label: 'Sports',            href: '/sports' },
    { label: 'Entrepreneurship',          href: '/small-business' },
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
  { label: 'Entrepreneurship',          href: '/small-business' },
  { label: 'Entertainment',     href: '/entertainment' },
  { label: 'Sports',            href: '/sports' },
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
  const pathname = usePathname();
  if (pathname.startsWith('/news') || pathname.startsWith('/sports')) return null;
  return (
    <footer className="mt-4 sm:mt-10 border-t border-white/[0.06] bg-brand-dark">

      <div className="mx-auto max-w-[1320px] px-4 py-5">
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
              <li>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="TrueRate on X"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink hover:bg-gray-200 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.479 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="TrueRate on Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink hover:bg-gray-200 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="TrueRate on LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-ink hover:bg-gray-200 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </li>
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
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-gray-500 hover:text-white no-underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <Text variant="meta">Copyright © 2026 TrueRate. All rights reserved. · Not investment advice</Text>
          <Text variant="caption" className="mt-1 text-gray-400">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM · TrueRate Research</Text>
        </div>

      </div>
    </footer>
  );
}
