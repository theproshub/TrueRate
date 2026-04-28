'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: { label: string; href: string }[] = [
  { label: 'All',               href: '/sports' },
  { label: 'Transfers & Deals', href: '/sports/transfers-deals' },
  { label: 'Broadcast Rights',  href: '/sports/broadcast-rights' },
  { label: 'Club Finance',      href: '/sports/club-finance' },
  { label: 'Sponsorship',       href: '/sports/sponsorship' },
];

/**
 * Mobile-only horizontal tab strip for the Sports section.
 * Desktop already has these tabs in the Header secondary nav (hidden sm:block),
 * so this component is `sm:hidden` to avoid duplication.
 */
export default function SportsMobileTabs() {
  const pathname = usePathname();
  const activeHref = TABS.find(t =>
    t.href === '/sports' ? pathname === '/sports' : pathname === t.href
  )?.href ?? '/sports';

  return (
    <nav
      aria-label="Sports topics"
      className="sm:hidden bg-[#f8f9fa] border-b border-gray-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex gap-0 px-4">
        {TABS.map(t => {
          const active = t.href === activeHref;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-gray-900 ${
                active
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
