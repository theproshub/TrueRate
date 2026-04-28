'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS: { label: string; href: string }[] = [
  { label: 'Latest',           href: '/videos' },
  { label: 'Interviews',       href: '/videos/interviews' },
  { label: 'Entrepreneurship', href: '/videos/entrepreneurship' },
  { label: 'Investing',        href: '/videos/investing' },
  { label: 'Technology',       href: '/videos/technology' },
  { label: 'Leadership',       href: '/videos/leadership' },
];

/**
 * Mobile-only horizontal tab strip for the Videos section.
 * Desktop already has these tabs in the Header secondary nav (hidden sm:block),
 * so this component is `sm:hidden` to avoid duplication.
 */
export default function VideosMobileTabs() {
  const pathname = usePathname();
  const activeHref = TABS.find(t =>
    t.href === '/videos' ? pathname === '/videos' : pathname === t.href
  )?.href ?? '/videos';

  return (
    <nav
      aria-label="Videos topics"
      className="sm:hidden bg-brand-dark border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex gap-0 px-4">
        {TABS.map(t => {
          const active = t.href === activeHref;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-brand-accent ${
                active
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-white/70 hover:text-brand-accent'
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
