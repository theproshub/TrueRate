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
    <nav
      aria-label="Economy topics"
      className="mb-6 flex gap-0 border-b border-gray-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map(t => {
        const active = t.slug === activeSlug;
        return (
          <Link
            key={t.slug}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center min-h-[44px] whitespace-nowrap px-4 sm:px-5 py-2.5 text-base font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-brand-accent-ink ${
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
  );
}
