import Link from 'next/link';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';
import { SPORTS_TRENDING, SPORTS_IN_FOCUS, SPORTS_EVENTS, type MostReadItem } from '@/lib/sports-news-data';

export function SportsTrendingPanel() {
  return (
    <aside className="hidden lg:block w-[270px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-brand-accent-ink" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <Heading level={5} as="h2" className="font-bold text-gray-900 uppercase tracking-wide">Trending</Heading>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {SPORTS_TRENDING.map(item => (
            <Link key={item.rank} href={item.href} className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sports data desk — figures live there, never scattered on the front */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">Sports Data</h3>
          <p className="text-sm text-gray-500 mb-3">Club valuations, athlete market values, transfers and broadcast deals — on the data desk.</p>
          <Link href="/sports/club-finance" className="block text-center text-sm font-semibold text-gray-900 hover:text-brand-accent-ink transition-colors no-underline">Open the data desk ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {SPORTS_IN_FOCUS.map(t => (
              <Link key={t} href="/sports" className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function SportsRightRail({ mostRead }: { mostRead: MostReadItem[] }) {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div className="flex flex-col gap-5">

        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">Sports Business Brief</h3>
          <p className="text-sm text-gray-500 mb-3">The money behind Liberian sport, in your inbox every week.</p>
          <form aria-label="Sign up for the Sports Business Brief">
            <label htmlFor="sports-rail-email" className="sr-only">Email address</label>
            <input id="sports-rail-email" type="email" required placeholder="Email address"
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
            <button type="submit" className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">Sign up free</button>
          </form>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Upcoming</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {SPORTS_EVENTS.map((ev, i) => (
              <Link key={i} href="/sports" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <span className="shrink-0 w-[40px] text-xs font-medium text-gray-400 tabular-nums">{ev.date}</span>
                <div className="min-w-0 flex-1 border-l border-gray-100 pl-3">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-brand-accent-ink transition-colors leading-snug">{ev.label}</p>
                  <span className="text-2xs font-medium text-gray-400 uppercase tracking-wide">{ev.type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most read */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Most Read</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {mostRead.map((item, i) => (
              <Link key={`${item.href}-${i}`} href={item.href} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <p className="text-sm font-bold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compact footer */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            {ACTIVE_SOCIAL_LINKS.map(s => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-gray-900 hover:bg-gray-400 transition-colors no-underline" aria-label={`TrueRate on ${s.label}`}>
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {['About', 'Advertise', 'Careers', 'Help', 'Feedback', 'Privacy', 'Terms'].map(l => (
              <Link key={l} href="/about" className="text-xs text-gray-400 hover:text-gray-700 transition-colors no-underline">{l}</Link>
            ))}
          </div>
          <Text variant="meta" className="text-center">© 2026 TrueRate. All rights reserved.</Text>
        </div>

      </div>
    </aside>
  );
}
