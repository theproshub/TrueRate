import Link from 'next/link';
import { ENTERTAINMENT_TOPICS } from '@/lib/entertainment-topics';

interface Props {
  /** Slug of the active topic. Use 'all' for the index page. */
  activeSlug: string;
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
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap px-4 sm:px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-gray-900 ${
              active
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
