import Link from 'next/link';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';

export function TrendingPanel({ items = newsItems }: { items?: NewsItem[] }) {
  // Trending list is the most recent published articles from the DB — no
  // hardcoded story list, so it never goes stale.
  const trending = items.slice(0, 5).map((n, i) => ({
    rank: i + 1,
    id: n.id,
    href: `/news/${n.id}`,
    title: n.title,
    category: n.category,
  }));
  return (
    <aside className="hidden lg:block w-[270px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-brand-accent-ink" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <Heading level={5} as="h2" className="font-bold text-gray-900 uppercase tracking-wide">Trending</Heading>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {trending.map(item => (
            <Link key={item.rank} href={item.href} className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <NewsThumbnail category={item.category} id={item.id} className="h-[72px] w-[72px] shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 self-center">
                <p className="text-base font-semibold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
            <span className="text-base text-gray-500 group-hover:text-brand-accent-ink transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-400 group-hover:text-brand-accent-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Markets link — live data lives on the Markets page, never hardcoded here */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">Markets</h3>
          <p className="text-sm text-gray-500 mb-3">Live USD/LRD, commodities, and indicators — updated from our data providers.</p>
          <Link href="/markets" className="block text-center text-sm font-semibold text-gray-900 hover:text-brand-accent-ink transition-colors no-underline">Open the markets page ›</Link>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href="/news" className="rounded-lg border border-gray-300 px-4 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function RightRail({ items = newsItems }: { items?: NewsItem[] }) {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
      <div className="flex flex-col gap-5">

        {/* Newsletter */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-1">TrueRate Daily Brief</h3>
          <p className="text-sm text-gray-500 mb-3">Liberia business & economy, delivered every morning.</p>
          <input type="email" placeholder="Email address"
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
          <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition">Sign up free</button>
        </div>

        {/* Upcoming events */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Upcoming Events</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { date: 'Apr 7',  label: 'CBL Monetary Policy Meeting',   type: 'Policy'      },
              { date: 'Apr 10', label: 'Q1 GDP Advance Estimate',        type: 'Economy'     },
              { date: 'Apr 14', label: 'Mid-Year Budget Review',         type: 'Policy'      },
              { date: 'Apr 14', label: 'Liberia Investment Forum',       type: 'Trade'       },
              { date: 'Apr 18', label: 'World Bank Country Dialogue',    type: 'Development' },
              { date: 'Apr 22', label: 'ArcelorMittal Q1 Earnings Call', type: 'Markets'     },
            ].map((ev, i) => (
              <Link key={i} href="/economy" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
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
            {items.slice(0, 5).map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <p className="text-sm font-bold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Compact site footer */}
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
