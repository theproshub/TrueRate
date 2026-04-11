import Link from 'next/link';

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  'Finance': [
    { label: 'Economy',           href: '/economy' },
    { label: 'News',              href: '/news' },
    { label: 'Research',          href: '/research' },
    { label: 'Videos',            href: '/videos' },
    { label: 'Community',         href: '/community' },
  ],
  'Explore': [
    { label: 'Business Directory', href: '/directory' },
    { label: 'Currency Converter', href: '/forex' },
    { label: 'Economic Data',     href: '/economy' },
    { label: 'West Africa',       href: '/news' },
    { label: 'Central Bank',      href: '/economy' },
  ],
  'Media': [
    { label: 'Culture',           href: '/entertainment' },
    { label: 'Sports',            href: '/sports' },
    { label: 'Videos',            href: '/videos' },
  ],
  'About': [
    { label: 'About TrueRate',    href: '/about' },
    { label: 'Help',              href: '/help' },
    { label: 'Feedback',          href: '/feedback' },
    { label: 'Licensing',         href: '/about' },
  ],
};

const TRENDING_LINKS = [
  { label: 'LRD/USD',           href: '/forex' },
  { label: 'Iron Ore',          href: '/economy' },
  { label: 'Rubber',            href: '/economy' },
  { label: 'CBL Rate',          href: '/economy' },
  { label: 'Gold',              href: '/economy' },
  { label: 'ArcelorMittal',     href: '/directory/arcelormittal-liberia' },
  { label: 'Firestone',         href: '/directory/firestone-liberia' },
  { label: 'Liberia GDP',       href: '/economy' },
  { label: 'Companies',         href: '/directory' },
  { label: 'Mining Policy',     href: '/economy' },
];

const LEGAL_LINKS = [
  { label: 'Data Disclaimer',        href: '/about' },
  { label: 'Help',                   href: '/help' },
  { label: 'Feedback',               href: '/feedback' },
  { label: 'Terms & Privacy Policy', href: '/about' },
  { label: 'About Our Ads',          href: '/about' },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/[0.06] bg-[#0a0a0d]">

      {/* Newsletter */}
      <div className="border-b border-white/[0.05] px-4 py-10">
        <div className="mx-auto max-w-[1320px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-white">TrueRate Daily Brief</h3>
            <p className="mt-1 text-[14px] text-gray-500">Business and economy news from Liberia, delivered daily</p>
          </div>
          <div className="flex w-full max-w-[420px] gap-2.5">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-gray-400 outline-none focus:border-white/40 transition-colors"
            />
            <button className="shrink-0 rounded-lg bg-white px-6 py-3 text-[13px] font-semibold text-[#0a0a0d] hover:brightness-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">

          {/* Left: logo + copyright + socials */}
          <div className="shrink-0 flex flex-col gap-6 sm:w-[200px]">
            <Link href="/" className="no-underline inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="TrueRate" style={{ height: '80px', width: 'auto' }} />
            </Link>
            <p className="text-[13px] text-gray-400 leading-relaxed">
              Copyright © 2026 TrueRate.<br />All rights reserved.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors no-underline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.479 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors no-underline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors no-underline">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 flex-1">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="mb-4 text-[13px] font-bold text-white">{title}</h4>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-[13px] text-gray-400 hover:text-white no-underline transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Trending topics */}
        <div className="mt-10 border-t border-white/[0.05] pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Trending topics</p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-lg border border-white/20 px-3 py-1 text-[12px] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors no-underline"
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
              <Link key={label} href={href} className="text-[11px] text-gray-500 hover:text-white no-underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-gray-400">Copyright © 2026 TrueRate. All rights reserved. · Not investment advice</p>
          <p className="mt-1 text-[10px] text-gray-400">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM</p>
        </div>

      </div>
    </footer>
  );
}
