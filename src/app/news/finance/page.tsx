import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getNewsItems } from '@/lib/news-source';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { Heading, Text } from '@/components/ui';
import { NewsFeedTabs } from './FinanceNewsClient';

// Always render from the live database — no ISR cache, so newly published
// articles appear immediately.
export const dynamic = 'force-dynamic';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ── DB-derived card helpers ───────────────────────────────────────────────
   Every section below is built from the live `articles` table (via
   getNewsItems()) instead of hardcoded story lists, so all published articles
   surface and stay in sync with the CMS. */
type Card = {
  id: string; href: string; category: string;
  title: string; summary: string; source: string; time: string;
};
const toCard = (n: NewsItem): Card => ({
  id: n.id,
  href: `/news/${n.id}`,
  category: n.category,
  title: n.title,
  summary: n.summary,
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
  const heroStory       = items[0] ? toCard(items[0]) : null;
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
                    <NewsThumbnail category={item.category} id={item.id} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>
                        {item.category}
                      </span>
                      <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">
                        {item.title}
                      </Heading>
                      <Text className="mt-1 text-base leading-relaxed text-gray-500 line-clamp-2">{item.summary}</Text>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
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
          <span className="text-2xs font-black uppercase tracking-widest text-brand-dark">Trending</span>
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
      <div className="flex gap-4 sm:gap-6 items-start">

        {/* ── Left: main content ── */}
        <div className="flex-1 min-w-0 pb-8">

          {/* Hero story (newest published article) */}
          {heroStory && (
            <Link href={heroStory.href} className="group relative block no-underline overflow-hidden rounded-xl mb-6">
              <NewsThumbnail category={heroStory.category} id={heroStory.id} className="w-full h-[220px] sm:h-[380px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(heroStory.category)}`}>{heroStory.category}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <Heading level={2} as="h1" className="leading-snug text-white group-hover:text-brand-accent transition-colors drop-shadow-lg line-clamp-3 mb-2">{heroStory.title}</Heading>
                <Text className="text-sm text-white/70 line-clamp-2 mb-1.5">{heroStory.summary}</Text>
                <Text className="text-xs text-white/50">{heroStory.source} &middot; {heroStory.time}</Text>
              </div>
            </Link>
          )}

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
                  <NewsThumbnail category={s.category} id={s.id} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
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
                  <NewsThumbnail category={s.category} id={s.id} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
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
                  <NewsThumbnail category={s.category.toLowerCase()} id={s.id} className="shrink-0 h-[80px] w-[100px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category.toLowerCase())}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{s.title}</Heading>
                    <Text className="mt-1.5 text-xs text-gray-400">{s.source} &middot; {s.time}</Text>
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
                  <NewsThumbnail category={s.category.toLowerCase().replace(/\s+/g, '-')} id={s.id} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category.toLowerCase())}`}>{s.category}</span>
                    <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{s.title}</Heading>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
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
                    <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2 mb-1">{op.title}</Heading>
                    <Text className="text-sm text-gray-500">{op.author} &middot; <span className="text-gray-400">{op.role}</span> &middot; <span className="text-gray-400">{op.time}</span></Text>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right sidebar (desktop) ── */}
        <aside className="hidden lg:block w-[300px] shrink-0 sticky top-24" aria-label="Sidebar">

          {/* Newsletter */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-5">
            <Heading level={6} as="h2" className="text-gray-900 mb-1">TrueRate Finance Brief</Heading>
            <Text className="text-sm text-gray-500 mb-3">Forex, policy, commodities and macro — delivered every morning.</Text>
            <label htmlFor="finance-email" className="sr-only">Email address</label>
            <input id="finance-email" type="email" placeholder="Email address"
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors mb-2" />
            <button className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 transition focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none">Sign up free</button>
          </div>

          {/* Upcoming economic events */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-5">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <Heading level={6} as="h3" className="text-gray-900">Upcoming Events</Heading>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { date: 'Apr 7',  label: 'CBL Monetary Policy Meeting',   type: 'Policy' },
                { date: 'Apr 10', label: 'Q1 GDP Advance Estimate',        type: 'Economy' },
                { date: 'Apr 14', label: 'Mid-Year Budget Review',         type: 'Fiscal' },
                { date: 'Apr 14', label: 'Liberia Investment Forum',       type: 'Trade' },
                { date: 'Apr 22', label: 'IMF Staff Mission Begins',       type: 'IMF' },
                { date: 'Apr 28', label: 'ArcelorMittal Q1 Earnings Call', type: 'Markets' },
              ].map((ev, i) => (
                <Link key={i} href="/economy" className="flex items-center gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                  <span className="shrink-0 w-[40px] text-xs font-medium text-gray-400 tabular-nums">{ev.date}</span>
                  <div className="min-w-0 flex-1 border-l border-gray-100 pl-3">
                    <Text className="text-sm font-semibold text-gray-700 group-hover:text-brand-accent-ink transition-colors leading-snug">{ev.label}</Text>
                    <span className="text-2xs font-medium text-gray-400 uppercase tracking-wide">{ev.type}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Most Read */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-5">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <Heading level={6} as="h3" className="text-gray-900">Most Read</Heading>
            </div>
            <div className="divide-y divide-gray-100">
              {mostRead.map((item, i) => (
                <Link key={i} href={item.href} className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                  <span className="shrink-0 text-lg font-black text-gray-200 tabular-nums w-5 text-right">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Text className="text-sm font-bold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</Text>
                    <span className="text-2xs font-semibold uppercase tracking-wide text-gray-400 mt-1 block">{item.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Markets link */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 mb-5">
            <Heading level={6} as="h3" className="text-xs font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">Markets</Heading>
            <Text className="text-sm text-gray-500 mb-3">Live USD/LRD, commodities, and indicators — updated from our data providers.</Text>
            <Link href="/markets" className="block text-center text-sm font-semibold text-gray-900 hover:text-brand-accent-ink transition-colors no-underline">Open the markets page ›</Link>
          </div>

          {/* In Focus topics */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 mb-5">
            <Heading level={6} as="h3" className="text-sm font-bold text-gray-900 mb-3">In Focus</Heading>
            <div className="flex flex-wrap gap-2">
              {['Iron Ore', 'LRD/USD', 'Rubber', 'CBL Rate', 'Remittances', 'ECOWAS', 'Mining Policy', 'Inflation', 'Gold', 'ESG Bonds'].map(t => (
                <Link key={t} href="/news/finance" className="rounded-lg border border-gray-300 px-4 py-1.5 text-base font-semibold text-gray-700 hover:bg-gray-100 transition-colors no-underline">{t}</Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
            <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em] mb-4">Explore</Heading>
            <nav aria-label="Quick links">
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {[
                  { label: 'All News', href: '/news' },
                  { label: 'Markets', href: '/markets' },
                  { label: 'Economy', href: '/economy' },
                  { label: 'Analytics', href: '/analytics' },
                  { label: 'Small Business', href: '/small-business' },
                  { label: 'Videos', href: '/videos' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center min-h-[44px] -my-1 text-base font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline">
                      {link.label}
                      <svg className="ml-auto h-4 w-4 text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </>)}

    </main>
    </div>
  );
}
