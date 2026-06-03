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
 * Path-aware topic tab strip for /videos and its sub-pages.
 * Rendered by the videos layout so it shows on every /videos/* page.
 */
export default function VideosTopicTabs() {
  const pathname = usePathname();
  const activeHref = TABS.find(t =>
    t.href === '/videos' ? pathname === '/videos' : pathname === t.href
  )?.href ?? '/videos';

  return (
    <div className="mx-auto max-w-container px-4 pt-4">
      <nav
        aria-label="Videos topics"
        className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map(t => {
          const active = t.href === activeHref;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center min-h-[44px] whitespace-nowrap px-4 sm:px-5 py-2.5 text-base font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-brand-accent ${
                active
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
