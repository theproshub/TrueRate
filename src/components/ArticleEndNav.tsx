import Link from 'next/link';

interface ArticleEndNavProps {
  categoryLabel: string;
  categoryHref: string;
}

const SECTIONS = [
  { label: 'Markets',    href: '/markets' },
  { label: 'Economy',    href: '/economy' },
  { label: 'Technology', href: '/technology' },
  { label: 'Videos',     href: '/videos' },
];

export default function ArticleEndNav({ categoryLabel, categoryHref }: ArticleEndNavProps) {
  return (
    <nav aria-label="Continue reading" className="flex flex-wrap items-center gap-2 py-5 my-2 border-t border-b border-gray-200">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold no-underline transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
        </svg>
        Home
      </Link>

      <Link
        href={categoryHref}
        className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {categoryLabel}
      </Link>

      <span className="hidden sm:block w-px h-5 bg-gray-300 mx-1" aria-hidden="true" />

      {SECTIONS.filter(s => s.href !== categoryHref).slice(0, 3).map(({ label, href }) => (
        <Link
          key={href}
          href={href}
          className="inline-flex items-center min-h-[44px] px-3 py-2 rounded-lg text-sm text-gray-500 no-underline transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
