import Link from 'next/link';

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  Mortgages: [
    { label: 'Best Rates', href: '/personal-finance' },
    { label: 'Calculators', href: '/personal-finance' },
    { label: 'Refinance', href: '/personal-finance' },
    { label: 'Home Equity', href: '/personal-finance' },
  ],
  'Financial News': [
    { label: 'Top Stories', href: '/news' },
    { label: 'Economy', href: '/economy' },
    { label: 'Policy', href: '/policy' },
    { label: 'Mining', href: '/news' },
    { label: 'Agriculture', href: '/news' },
  ],
  'Explore More': [
    { label: 'Currency Converter', href: '/forex' },
    { label: 'Screener', href: '/screener' },
    { label: 'Watchlist', href: '/portfolio' },
    { label: 'Economic Data', href: '/economy' },
  ],
  About: [
    { label: 'About TrueRate', href: '/about' },
    { label: 'Sitemap', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Feedback', href: '/feedback' },
    { label: 'Licensing', href: '/about' },
  ],
};

const TRENDING_LINKS = [
  { label: 'LRD/USD', href: '/forex' },
  { label: 'Iron Ore', href: '/commodities' },
  { label: 'AMTL', href: '/markets?symbol=AMTL' },
  { label: 'ETI', href: '/markets?symbol=ETI' },
  { label: 'Rubber', href: '/commodities' },
  { label: 'CBL Rate', href: '/economy' },
  { label: 'Gold', href: '/commodities' },
  { label: 'LPRC', href: '/markets?symbol=LPRC' },
  { label: 'Remittances', href: '/economy' },
  { label: 'Liberia GDP', href: '/economy' },
];

const LEGAL_LINKS = [
  { label: 'Data Disclaimer', href: '/about' },
  { label: 'Help', href: '/help' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Sitemap', href: '/about' },
  { label: 'Terms and Privacy Policy', href: '/about' },
  { label: 'Privacy Dashboard', href: '/about' },
  { label: 'About Our Ads', href: '/about' },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[#222] bg-[#0e0e10]">
      <div className="border-b border-[#222] bg-[#161618] px-4 py-8">
        <div className="mx-auto max-w-[1280px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-white">TrueRate Morning Brief</h3>
            <p className="mt-0.5 text-[13px] text-[#666]">Sign up for the TrueRate Morning Brief</p>
          </div>
          <div className="flex w-full max-w-[400px] gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-2.5 text-[13px] text-white placeholder:text-[#444] outline-none focus:border-[#6001d2]"
            />
            <button className="shrink-0 rounded bg-[#6001d2] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#490099] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8">
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 mb-8">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#888]">{title}</h4>
              <ul className="space-y-1.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[12px] text-[#555] hover:text-[#a78bfa] no-underline hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-6 border-t border-[#222] pt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#555]">What&apos;s trending</p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded border border-[#2a2a2a] px-3 py-1 text-[12px] text-[#555] hover:border-[#6001d2]/50 hover:text-[#a78bfa] transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-[#222] pt-5">
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className="text-[11px] text-[#444] hover:text-[#a78bfa] no-underline">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-[#333]">Copyright © 2026 TrueRate. All rights reserved. · Quotes delayed 15 min · Not investment advice</p>
          <p className="mt-1 text-[10px] text-[#333]">Data: Central Bank of Liberia · World Bank · IMF · Ghana Stock Exchange · BRVM</p>
        </div>
      </div>
    </footer>
  );
}
