import Link from 'next/link';
import { TECHNOLOGY_TOPICS } from '@/lib/technology-topics';

interface Props {
  /** Slug of the active topic. Use 'all' for the index page. */
  activeSlug: string;
}

export default function TechnologyTopicTabs({ activeSlug }: Props) {
  const items = [
    { slug: 'all', label: 'All', href: '/technology' },
    ...TECHNOLOGY_TOPICS.map(t => ({ slug: t.slug, label: t.label, href: `/technology/${t.slug}` })),
  ];

  return (
    <nav
      aria-label="Technology topics"
      className="flex gap-0 border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map(t => {
        const active = t.slug === activeSlug;
        return (
          <Link
            key={t.slug}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap px-4 sm:px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px no-underline transition-colors focus-visible:outline-none focus-visible:text-brand-accent ${
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
  );
}
