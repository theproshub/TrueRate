import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SectionEndNav from '@/components/SectionEndNav';
import { getNewsItems } from '@/lib/news-source';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { Heading, Text } from '@/components/ui';
import { NewsFeedTabs } from './FinanceNewsClient';
import { HeroCarousel } from '../NewsClient';
import StickySidebar from '@/components/StickySidebar';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';
import EconomicEventsCalendar from '@/components/EconomicEventsCalendar';
import NewsletterWidget from '@/components/NewsletterWidget';

// Always render from the live database — no ISR cache, so newly published
// articles appear immediately.
export const dynamic = 'force-dynamic';

/* ── helpers ── */
function timeAgo(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/* ── DB-derived card helpers ───────────────────────────────────────────────
   Every section below is built from the live `articles` table (via
   getNewsItems()) instead of hardcoded story lists, so all published articles
   surface and stay in sync with the CMS. */
type Card = {
  id: string; href: string; category: string;
  title: string; summary: string; source: string; time: string;
  image?: string;
};
const toCard = (n: NewsItem): Card => ({
  id: n.id,
  href: `/news/${n.id}`,
  category: n.category,
  title: n.title,
  summary: n.summary,
  image: n.image,
  source: n.source,
  time: timeAgo(n.date),
});
const inCats = (items: NewsItem[], cats: string[]) =>
  items.filter(n => cats.includes(n.category.toLowerCase()));

/* ── page (server component) ── */
export default async function FinanceNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const items = await getNewsItems();

  // Section feeds, all sourced from the live articles table.
  const economyStories  = inCats(items, ['economy']).slice(0, 4).map(toCard);
  const marketsStories  = inCats(items, ['forex', 'markets', 'commodities']).slice(0, 4).map(toCard);
  const tradeStories    = inCats(items, ['commodities', 'forex']).slice(0, 4).map(toCard);
  const policyStories   = inCats(items, ['policy', 'banking']).slice(0, 4).map(toCard);
  const opinionStories  = inCats(items, ['analysis', 'opinion']).slice(0, 3).map((n) => ({
    id: n.id,
    href: `/news/${n.id}`,
    title: n.title,
    author: n.author ?? n.source,
    role: n.category.toLowerCase() === 'opinion' ? 'Opinion' : 'Analysis',
    time: timeAgo(n.date),
  }));
  const mostRead        = items.slice(0, 6).map(toCard);
  const ticker          = items.slice(0, 8).map((n) => ({ label: n.category, text: n.title, href: `/news/${n.id}` }));

  const searchResults = query
    ? items.filter(n => {
        const lower = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(lower) ||
          n.summary.toLowerCase().includes(lower) ||
          n.category.toLowerCase().includes(lower) ||
          n.source.toLowerCase().includes(lower)
        );
      })
    : [];

  return (
    <div className="bg-brand-surface min-h-screen">
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: 'Finance' }]} light />

      {/* ── Search results view ── */}
      {query && (
        <div className="mb-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <Heading level={2} as="h1" className="text-gray-900">
                Search results for{' '}
                <span className="text-brand-accent-ink">&ldquo;{query}&rdquo;</span>
              </Heading>
              <Text className="mt-1 text-base text-gray-500">
                {searchResults.length} article{searchResults.length !== 1 ? 's' : ''} found
              </Text>
            </div>
            <Link href="/news/finance" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">
              &larr; Finance news
            </Link>
          </div>

          {searchResults.length === 0 ? (
            <div className="border-b border-gray-200 py-10 text-center">
              <Heading level={4} as="h2" className="mb-1 font-bold text-gray-900">No results found</Heading>
              <Text className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500">
                Try searching for &ldquo;inflation&rdquo;, &ldquo;forex&rdquo;, &ldquo;rubber&rdquo; or &ldquo;CBL&rdquo;.
              </Text>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100">
                {searchResults.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-5 last:pb-5 no-underline">
                    <NewsThumbnail category={item.category} id={item.id} src={item.image} className="shrink-0 h-[70px] w-[96px] sm:h-[90px] sm:w-[140px] rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>
                        {item.category}
                      </span>
                      <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2">
                        {item.title}
                      </Heading>
                      <Text className="mt-1 text-base leading-relaxed text-gray-500 line-clamp-2">{item.summary}</Text>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-500">{item.source}</span>
                        <span>&middot;</span>
                        <span>{timeAgo(item.date)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Normal news view (hidden when searching) ── */}
      {!query && (<>

      {/* Trending ticker */}
      <div className="mb-5 flex items-center gap-0 border-b border-gray-200 overflow-hidden">
        <div className="shrink-0 bg-brand-accent px-3 py-2.5 z-10">
          <span className="text-2xs font-black uppercase tracking-widest text-brand-accent-ink">Trending</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-scroll flex w-max">
            {[...ticker, ...ticker].map((b, i) => (
              <Link key={i} href={b.href} className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-gray-200">
                <span className={`text-2xs font-black uppercase tracking-widest ${getCatColor(b.label)}`}>{b.label}</span>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-950 transition-colors">{b.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout: two columns + sidebar ── */}
      <div className="flex gap-0 items-start">

        {/* ── Left: main content ── */}
        <div className="flex-1 min-w-0 pb-8 lg:pr-5">

          {/* Hero carousel — swipeable cards on mobile, overlay on desktop */}
          <div className="mb-6">
            <HeroCarousel items={items} />
          </div>

          {/* Tabbed finance feed */}
          <NewsFeedTabs items={items} />

          {/* ── Economy section ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Economy</Heading>
              </div>
              <Link href="/economy" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More economy &rsaquo;</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {economyStories.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category} id={s.id} src={s.image} className="shrink-0 h-[60px] w-[88px] sm:h-[80px] sm:w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-500">{s.source}</span>
                      <span>&middot;</span>
                      <span>{s.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Markets & Forex section ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Markets &amp; Forex</Heading>
              </div>
              <Link href="/markets" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More markets &rsaquo;</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {marketsStories.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category} id={s.id} src={s.image} className="shrink-0 h-[60px] w-[88px] sm:h-[80px] sm:w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-500">{s.source}</span>
                      <span>&middot;</span>
                      <span>{s.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Trade & Commodities section ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Trade &amp; Commodities</Heading>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tradeStories.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-3 no-underline border-t border-gray-100 pt-4 first:border-t-0 first:pt-0 [&:nth-child(2)]:border-t-0 [&:nth-child(2)]:pt-0 sm:[&:nth-child(2)]:border-t-0">
                  <NewsThumbnail category={s.category.toLowerCase()} id={s.id} src={s.image} className="shrink-0 h-[60px] w-[88px] sm:h-[80px] sm:w-[100px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category.toLowerCase())}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-3">{s.title}</Heading>
                    <Text className="mt-1.5 text-xs text-gray-500">{s.source} &middot; {s.time}</Text>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Policy & Central Bank section ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Policy &amp; Central Bank</Heading>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {policyStories.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category.toLowerCase().replace(/\s+/g, '-')} id={s.id} src={s.image} className="shrink-0 h-[60px] w-[88px] sm:h-[80px] sm:w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category.toLowerCase())}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-500">{s.source}</span>
                      <span>&middot;</span>
                      <span>{s.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Opinion ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Opinion</Heading>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {opinionStories.map((op, i) => (
                <Link key={i} href={op.href} className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-full">
                    <AuthorAvatar name={op.author} className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2 mb-1">{op.title}</Heading>
                    <Text className="text-sm text-gray-500">{op.author} &middot; <span className="text-gray-500">{op.role}</span> &middot; <span className="text-gray-500">{op.time}</span></Text>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-500 transition-colors" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right sidebar (desktop) ── */}
        <aside className="hidden lg:block w-[280px] shrink-0 lg:self-stretch lg:border-l lg:border-gray-200 lg:pl-5" aria-label="Sidebar">
          <StickySidebar>

          {/* Newsletter */}
          <div className="mb-5">
            <NewsletterWidget title="TrueRate Finance Brief" description="Forex, policy, commodities and macro — delivered every morning." />
          </div>

          {/* Economic Calendar */}
          <div className="mb-5">
            <EconomicEventsCalendar limit={4} />
          </div>

          {/* Most Read */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-5">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <Heading level={6} as="h3" className="text-gray-900">Most Read</Heading>
            </div>
            <div className="divide-y divide-gray-100">
              {mostRead.map((item, i) => (
                <Link key={i} href={item.href} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} id={item.id} src={item.image} className="h-[60px] w-[80px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text className="text-sm font-bold leading-snug text-gray-700 group-hover:underline decoration-1 underline-offset-2 line-clamp-2">{item.title}</Text>
                    <span className={`text-2xs font-semibold uppercase tracking-wide mt-1 block ${getCatColor(item.category)}`}>{item.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Markets link */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 mb-5">
            <Heading level={6} as="h3" className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500 mb-2">Markets</Heading>
            <Text className="text-sm text-gray-500 mb-3">Live USD/LRD, commodities, and indicators — updated from our data providers.</Text>
            <Link href="/markets" className="block text-center text-sm font-semibold text-gray-900 hover:text-brand-accent-ink transition-colors no-underline">Open the markets page ›</Link>
          </div>

          {/* In Focus topics */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 mb-5">
            <Heading level={6} as="h3" className="text-sm font-bold text-gray-900 mb-3">In Focus</Heading>
            <div className="flex flex-wrap gap-2">
              {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
                <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="rounded-lg border border-gray-300 px-4 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
              ))}
            </div>
          </div>

          {/* Explore more — emoji icons matching Market Women Mode */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em] mb-3">Explore More</Heading>
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
            <Text variant="meta" className="text-center">&copy; 2026 TrueRate. All rights reserved.</Text>
          </div>
          </StickySidebar>
        </aside>
      </div>
    </>)}

    <SectionEndNav currentHref="/news" />

    </main>
    </div>
  );
}
