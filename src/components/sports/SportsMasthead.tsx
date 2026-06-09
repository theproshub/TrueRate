import Link from 'next/link';
import DeskNav from '@/components/sports/DeskNav';

/**
 * Sports section masthead — wordmark lockup, tagline, the editorial desks,
 * and a search affordance. Light, editorial (Bloomberg/FT-style) header.
 * The desk nav lives in <DeskNav>, a client component that marks the active
 * desk and scrolls horizontally on mobile.
 */
export default function SportsMasthead() {
  return (
    <header className="border-b border-gray-900/15 bg-brand-surface">
      <div className="mx-auto max-w-container px-4">
        {/* Wordmark + tagline + search */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div className="min-w-0">
            <Link
              href="/sports"
              className="inline-flex items-baseline gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">TrueRate</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-accent-ink">Sports</span>
            </Link>
            <p className="mt-1 text-sm text-gray-500 hidden sm:block">
              The business, finance &amp; intelligence of Liberian sport
            </p>
          </div>

          <Link
            href="/search"
            aria-label="Search TrueRate Sports"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2 min-h-[44px]"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <circle cx="9" cy="9" r="6" /><path d="m20 20-4.5-4.5" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Search clubs, athletes, deals</span>
          </Link>
        </div>

        {/* Desk nav */}
        <DeskNav />
      </div>
    </header>
  );
}
