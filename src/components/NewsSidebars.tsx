import Link from 'next/link';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { Heading, Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';
import NewsletterWidget from '@/components/NewsletterWidget';
import EconomicEventsCalendar from '@/components/EconomicEventsCalendar';
import StickySidebar from '@/components/StickySidebar';

export function TrendingPanel({ items = newsItems, popularItems }: { items?: NewsItem[]; popularItems?: NewsItem[] }) {
  const source = popularItems && popularItems.length >= 3 ? popularItems : items;
  const trending = source.slice(0, 5).map((n, i) => ({
    rank: i + 1,
    id: n.id,
    href: `/news/${n.id}`,
    title: n.title,
    category: n.category,
    image: n.image,
  }));
  return (
    <aside className="hidden lg:block w-[270px] shrink-0 lg:self-stretch lg:border-r lg:border-gray-200 lg:pr-5 lg:mr-5">
      <StickySidebar>
        <div className="flex items-center gap-2 mb-3">
          <svg className="h-4 w-4 text-brand-accent-ink" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <Heading level={5} as="h2" className="font-bold text-gray-900 uppercase tracking-wide">Trending</Heading>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
          {trending.map(item => (
            <Link key={item.rank} href={item.href} className="flex items-start gap-3 px-4 py-3.5 no-underline group hover:bg-gray-50 transition-colors">
              <NewsThumbnail category={item.category} id={item.id} src={item.image} className="h-[72px] w-[72px] shrink-0 rounded-md" />
              <div className="min-w-0 flex-1 self-center">
                <p className="text-base font-semibold leading-snug text-gray-700 group-hover:underline decoration-1 underline-offset-2 line-clamp-3">{item.title}</p>
              </div>
            </Link>
          ))}
          <Link href="/news" className="flex items-center justify-between px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
            <span className="text-base text-gray-500 group-hover:text-brand-accent-ink transition-colors">See more stories</span>
            <svg className="h-4 w-4 text-gray-500 group-hover:text-brand-accent-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Explore more — emoji icons matching Market Women Mode */}
        <div className="mt-5 rounded-xl bg-gray-50 border border-gray-200 p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-900 mb-3">Explore More</h3>
          <nav aria-label="Explore more sections">
            <ul className="flex flex-col list-none p-0 m-0">
              {[
                { label: 'News', href: '/news', icon: '📰' },
                { label: 'Markets', href: '/markets', icon: '📈' },
                { label: 'Economy', href: '/economy', icon: '🏦' },
                { label: 'Analytics', href: '/analytics', icon: '📊' },
                { label: 'Business', href: '/small-business', icon: '🏪' },
                { label: 'Videos', href: '/videos', icon: '🎬' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-3 min-h-[40px] px-2 -mx-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
                    <span aria-hidden="true" className="w-[22px] shrink-0 text-center text-xl leading-none">
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* In Focus topics */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">In Focus</h3>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
              <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="rounded-lg border border-gray-300 px-4 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>
      </StickySidebar>
    </aside>
  );
}

export function RightRail({ items = newsItems, popularItems }: { items?: NewsItem[]; popularItems?: NewsItem[] }) {
  const mostReadSource = popularItems && popularItems.length >= 3 ? popularItems : items;
  return (
    <aside className="hidden xl:block w-[280px] shrink-0 lg:self-stretch lg:border-l lg:border-gray-200 lg:pl-5 lg:ml-5">
      <StickySidebar>

        {/* Newsletter */}
        <NewsletterWidget />

        {/* Economic Calendar */}
        <EconomicEventsCalendar limit={4} />

        {/* Most read */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Most Read</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {mostReadSource.slice(5, 10).map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                <p className="text-sm font-bold leading-snug text-gray-700 group-hover:underline decoration-1 underline-offset-2 line-clamp-3">{item.title}</p>
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
            {[
              { label: 'About', href: '/about' },
              { label: 'Advertise', href: '/about/ads' },
              { label: 'Help', href: '/help' },
              { label: 'Feedback', href: '/feedback' },
              { label: 'Privacy', href: '/about/privacy' },
              { label: 'Terms', href: '/about/terms' },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-xs text-gray-500 hover:text-gray-700 transition-colors no-underline">{l.label}</Link>
            ))}
          </div>
          <Text variant="meta" className="text-center">© 2026 TrueRate. All rights reserved.</Text>
        </div>

      </StickySidebar>
    </aside>
  );
}
