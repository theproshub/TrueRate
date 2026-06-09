'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Horizontally-scrolling desk nav for the sports section. Client component so it
 * can mark the active desk (aria-current + visual underline). On mobile the
 * track runs edge-to-edge with a right fade hinting that more desks scroll into
 * view; touch targets stay ≥44px and focus is always visible.
 */
const DESKS: { label: string; href: string }[] = [
  { label: 'All',                href: '/sports' },
  { label: 'Football',           href: '/sports/football' },
  { label: 'Basketball',         href: '/sports/basketball' },
  { label: 'Athletics',          href: '/sports/athletics' },
  { label: 'Youth Sports',       href: '/sports/youth-sports' },
  { label: "Women's Sports",     href: '/sports/womens-sports' },
  { label: 'Transfers',          href: '/sports/transfers-deals' },
  { label: 'Sports Business',    href: '/sports/sponsorship' },
  { label: 'Sports Finance',     href: '/sports/club-finance' },
  { label: 'Governance',         href: '/sports/governance' },
  { label: 'Technology',         href: '/sports/technology' },
  { label: 'Interviews',         href: '/sports/interviews' },
  { label: 'Data & Research',    href: '/sports/data-research' },
  { label: 'Opinion',            href: '/sports/opinion' },
];

export default function DeskNav() {
  const pathname = usePathname();

  return (
    // Break out of the masthead's px-4 so the track scrolls edge-to-edge on
    // mobile; the inner px-4 keeps the first/last desk aligned with the page.
    <div className="relative -mx-4">
      <nav
        aria-label="Sports desks"
        className="flex gap-0 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DESKS.map((d, i) => {
          const active =
            d.href === '/sports' ? pathname === '/sports' : pathname.startsWith(d.href);
          return (
            <Link
              key={`${d.label}-${i}`}
              href={d.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center min-h-[44px] whitespace-nowrap px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1 ${
                active
                  ? 'text-brand-accent-ink border-brand-accent-ink'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {d.label}
            </Link>
          );
        })}
      </nav>

      {/* Right-edge fade: signals more desks are scrollable off-screen on
          narrow viewports. Decorative and click-through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-brand-surface to-transparent sm:hidden"
      />
    </div>
  );
}
