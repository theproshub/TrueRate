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
    { label: 'Currency Converter', href: '/forex' },
    { label: 'Economic Data',     href: '/economy' },
    { label: 'West Africa',       href: '/news' },
    { label: 'Central Bank',      href: '/economy' },
  ],
  'Media': [
    { label: 'Entertainment',     href: '/entertainment' },
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
  { label: 'LRD/USD',       href: '/forex' },
  { label: 'Iron Ore',      href: '/economy' },
  { label: 'Rubber',        href: '/economy' },
  { label: 'CBL Rate',      href: '/economy' },
  { label: 'Gold',          href: '/economy' },
  { label: 'Remittances',   href: '/economy' },
  { label: 'Liberia GDP',   href: '/economy' },
  { label: 'Inflation',     href: '/economy' },
  { label: 'ECOWAS Trade',  href: '/economy' },
  { label: 'Mining Policy', href: '/economy' },
];

const LEGAL_LINKS = [
  { label: 'Data Disclaimer',       href: '/about' },
  { label: 'Help',                  href: '/help' },
  { label: 'Feedback',              href: '/feedback' },
  { label: 'Terms & Privacy Policy', href: '/about' },
  { label: 'About Our Ads',         href: '/about' },
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
              className="flex-1 rounded-lg bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-[13px] text-white placeholder:text-gray-600 outline-none focus:border-white/40 transition-colors"
            />
            <button className="shrink-0 rounded-lg bg-white px-6 py-3 text-[13px] font-semibold text-[#0a0a0d] hover:brightness-90 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 py-10">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 mb-10">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-gray-600 hover:text-white no-underline transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trending topics */}
        <div className="mb-8 border-t border-white/[0.05] pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-600">Trending topics</p>
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
        <div className="border-t border-white/[0.05] pt-6">
          <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-[11px] text-gray-700 hover:text-white no-underline transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-gray-800">Copyright © 2026 TrueRate. All rights reserved. · Not investment advice</p>
          <p className="mt-1 text-[10px] text-gray-800">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM</p>
        </div>
      </div>
    </footer>
  );
}
