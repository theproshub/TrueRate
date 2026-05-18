'use client';

import Link, { useLinkStatus } from 'next/link';
import { ENTERTAINMENT_TOPICS } from '@/lib/entertainment-topics';

interface Props {
  /** Slug of the active topic. Use 'all' for the index page. */
  activeSlug: string;
}

/** Sits inside each <Link> so it can read the navigation pending state. */
function TabLabel({ label, active }: { label: string; active: boolean }) {
  const { pending } = useLinkStatus();
  const highlighted = active || pending;
  return (
    <span
      className={`inline-flex items-center min-h-[44px] whitespace-nowrap px-4 sm:px-5 py-2.5 text-base font-semibold border-b-[3px] -mb-px transition-colors ${
        highlighted
          ? 'border-gray-900 text-gray-900'
          : 'border-transparent text-gray-500'
      }`}
    >
      {label}
    </span>
  );
}

export default function EntertainmentTopicTabs({ activeSlug }: Props) {
  const items = [
    { slug: 'all', label: 'All', href: '/entertainment' },
    ...ENTERTAINMENT_TOPICS.map(t => ({ slug: t.slug, label: t.label, href: `/entertainment/${t.slug}` })),
  ];

  return (
    <nav
      aria-label="Entertainment topics"
      className="flex gap-0 border-b border-gray-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map(t => {
        const active = t.slug === activeSlug;
        return (
          <Link
            key={t.slug}
            href={t.href}
            prefetch
            aria-current={active ? 'page' : undefined}
            className="no-underline focus-visible:outline-none"
          >
            <TabLabel label={t.label} active={active} />
          </Link>
        );
      })}
    </nav>
  );
}
