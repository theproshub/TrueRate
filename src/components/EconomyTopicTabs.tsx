import Link from 'next/link';
import { ECONOMY_TOPICS } from '@/lib/economy-topics';

interface Props {
  /** Slug of the active topic. Use 'all' for the index page. */
  activeSlug: string;
}

export default function EconomyTopicTabs({ activeSlug }: Props) {
  const items = [
    { slug: 'all', label: 'All', href: '/economy' },
    ...ECONOMY_TOPICS.map(t => ({ slug: t.slug, label: t.label, href: `/economy/${t.slug}` })),
  ];

  return (
    <div className="relative mb-6">
      <nav
        aria-label="Economy topics"
        className="flex gap-0 border-b border-gray-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(t => {
          const active = t.slug === activeSlug;
          return (
            <Link
              key={t.slug}
              href={t.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center min-h-[44px] whitespace-nowrap px-3.5 sm:px-5 py-2.5 text-sm sm:text-base font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                active
                  ? 'border-brand-accent text-brand-accent-ink'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {/* Scroll fade hint on mobile */}
      <div className="absolute right-0 top-0 bottom-px w-8 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none lg:hidden" aria-hidden="true" />
    </div>
  );
}
