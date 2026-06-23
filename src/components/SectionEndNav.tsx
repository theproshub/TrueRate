import Link from 'next/link';

const ALL_SECTIONS = [
  { label: 'News',       href: '/news' },
  { label: 'Markets',    href: '/markets' },
  { label: 'Analytics',  href: '/analytics' },
  { label: 'Economy',    href: '/economy' },
  { label: 'Business',   href: '/small-business' },
  { label: 'Technology', href: '/technology' },
  { label: 'Videos',     href: '/videos' },
];

interface SectionEndNavProps {
  currentHref: string;
}

export default function SectionEndNav({ currentHref }: SectionEndNavProps) {
  const siblings = ALL_SECTIONS.filter(s => s.href !== currentHref);

  return (
    <nav aria-label="Explore more" className="mt-10 mb-4 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold no-underline transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
          </svg>
          Home
        </Link>

        <span className="hidden sm:block w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />

        {siblings.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm text-gray-500 no-underline transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
