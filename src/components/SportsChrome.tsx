'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SPORTS_TICKER } from '@/lib/sports-finance-data';

const TABS: { label: string; href: string }[] = [
  { label: 'All',                href: '/sports' },
  { label: 'Transfers & Deals',  href: '/sports/transfers-deals' },
  { label: 'Broadcast Rights',   href: '/sports/broadcast-rights' },
  { label: 'Club Finance',       href: '/sports/club-finance' },
  { label: 'Sponsorship',        href: '/sports/sponsorship' },
];

export default function SportsChrome() {
  const pathname = usePathname();
  const activeHref = TABS.find(t =>
    t.href === '/sports' ? pathname === '/sports' : pathname === t.href || pathname.startsWith(t.href + '/')
  )?.href ?? '/sports';

  return (
    <div className="bg-[#08151c] border-b border-white/[0.08]">

      {/* Ticker — quiet single line, no headline strap above it */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1320px] overflow-hidden">
          <div className="ticker-scroll flex items-center h-8">
            {[...SPORTS_TICKER, ...SPORTS_TICKER].map((item, i) => (
              <span key={i} className="flex items-center shrink-0">
                <span className="inline-flex items-baseline gap-1.5 px-4 whitespace-nowrap">
                  <span className="text-[11px] text-gray-500">{item.label}</span>
                  <span className="text-[12px] tabular-nums font-semibold text-white">{item.value}</span>
                  {item.delta && (
                    <span className={`text-[11px] tabular-nums ${item.delta.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.delta.up ? '+' : ''}{item.delta.text}
                    </span>
                  )}
                  {item.sub && !item.delta && (
                    <span className="text-[11px] text-gray-500">· {item.sub}</span>
                  )}
                </span>
                <span aria-hidden="true" className="self-center h-3 w-px bg-white/[0.08]" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav
        aria-label="Sports topics"
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto max-w-[1320px] px-2 sm:px-4 flex gap-0">
          {TABS.map(t => {
            const active = t.href === activeHref;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-semibold uppercase tracking-wide border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-red-400 ${
                  active
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-300 hover:text-red-400'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
