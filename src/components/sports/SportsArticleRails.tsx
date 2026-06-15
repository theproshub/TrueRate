import Link from 'next/link';
import { getCatColor } from '@/lib/category-colors';
import type { SportsStory } from '@/data/sports-stories';

/**
 * Desktop sidebars for the sports article reader (/sports/news/[slug]).
 * Hidden on mobile to keep reading focused; every link opens a full story.
 */

/** Left rail — Trending (sticky). */
export function SportsReaderTrending({ stories }: { stories: SportsStory[] }) {
  if (stories.length === 0) return null;
  return (
    <aside className="hidden lg:block w-[260px] shrink-0 self-start sticky top-header-md" aria-label="Trending in sports">
      <div className="flex items-center gap-2 mb-3">
        <svg className="h-4 w-4 text-brand-accent-ink" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">Trending</h2>
      </div>
      <ol className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
        {stories.map((s, i) => (
          <li key={s.slug}>
            <Link href={`/sports/news/${s.slug}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
              <span aria-hidden className="font-mono text-sm font-black tabular-nums leading-none text-gray-300 pt-0.5">{i + 1}</span>
              <span className="text-sm font-semibold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{s.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** Right rail — newsletter + Latest (sticky). */
export function SportsReaderRail({ stories }: { stories: SportsStory[] }) {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 self-start sticky top-header-md" aria-label="Newsletter and latest stories">
      <div className="flex flex-col gap-5">
        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-gray-900 mb-1">Sports Business Brief</h2>
          <p className="text-sm text-gray-500 mb-3">The money behind Liberian sport, in your inbox every week.</p>
          <form aria-label="Sign up for the Sports Business Brief">
            <label htmlFor="sb-rail-email" className="sr-only">Email address</label>
            <input id="sb-rail-email" type="email" required placeholder="Email address" className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
            <button type="submit" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">Sign up free</button>
          </form>
        </div>

        {/* Latest */}
        {stories.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Latest</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {stories.map((s) => (
                <Link key={s.slug} href={`/sports/news/${s.slug}`} className="block px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                  <span className={`block text-2xs font-bold uppercase tracking-wide mb-0.5 ${getCatColor(s.category)}`}>{s.category}</span>
                  <span className="block text-sm font-semibold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{s.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Browse desks */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Browse desks</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Club Finance', href: '/sports/club-finance' },
              { label: 'Sponsorship', href: '/sports/sponsorship' },
              { label: 'Transfers', href: '/sports/transfers-deals' },
              { label: 'Broadcast', href: '/sports/broadcast-rights' },
            ].map((d) => (
              <Link key={d.label} href={d.href} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{d.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
