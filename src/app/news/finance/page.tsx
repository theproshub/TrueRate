import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { newsItems } from '@/data/news';
import { NewsThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { Heading, Text } from '@/components/ui';
import { NewsFeedTabs } from './FinanceNewsClient';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-04').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ── static data: finance / economy / business ── */

const TRENDING = [
  { label: 'FOREX', text: 'Liberian dollar ended March 2026 at L$183.93 per US dollar — about 8% stronger than a year earlier (CBL)' },
  { label: 'POLICY', text: 'CBL held the Monetary Policy Rate at 16.3% through May 2026, after a one-point cut from 17.3% (CBL)' },
  { label: 'INFLATION', text: 'Headline inflation eased to 4.5% year-on-year in March 2026, though core prices held near 6% (CBL)' },
  { label: 'ECONOMY', text: 'Real GDP grew 4.6% in 2025, up from 4.0% a year earlier; nominal GDP reached US$5.16bn (LISGIS)' },
  { label: 'TRADE', text: 'Exports jumped 58% to US$2.07bn in 2025, led by gold; imports rose 55% to US$2.35bn (CBL)' },
  { label: 'MONEY', text: 'Broad money grew 10.7% to L$299.4bn in March 2026; reserve money rose 31% year-on-year (CBL)' },
  { label: 'COMMODITIES', text: 'Gold exports more than doubled year-on-year to about US$175m in March 2026; rubber earnings fell ~54% (CBL)' },
  { label: 'MINING', text: 'Gold output rose 15% and diamond output more than doubled year-on-year in March 2026; rubber fell ~30% (LISGIS)' },
];

const HERO_STORIES = [
  {
    category: 'Forex',
    title: "Liberian Dollar Ends March Near L$184 — Up 8% on the Year as CBL Reserves Climb",
    summary: "The Liberian dollar's strongest quarterly performance since 2019, backed by rising foreign-exchange reserves and a central bank holding its policy rate steady at 16.3%.",
    source: 'TrueRate',
    time: '1d ago',
    href: '/news/1',
  },
  {
    category: 'Economy',
    title: "Liberia's Economy Grew 4.6% in 2025 — Mining and Services Led the Expansion",
    summary: "Nominal GDP reached US$5.16 billion as iron ore, gold, and trade services drove the acceleration from 4.0% in 2024. Agriculture and construction also contributed.",
    source: 'TrueRate',
    time: '3d ago',
    href: '/news/5',
  },
];

const ECONOMY_STORIES = [
  { href: '/news/5', category: 'economy', title: "Liberia's Economy Grew 4.6% in 2025 as Nominal GDP Reached US$5.2 Billion", source: 'TrueRate', time: '1d ago' },
  { href: '/news/2', category: 'economy', title: "Inflation Eases to 4.5% in March, but Core Prices Stay Near 6%", source: 'TrueRate', time: '2d ago' },
  { href: '/news/4', category: 'economy', title: "Exports Jump 58% to US$2.1 Billion in 2025, Led by Gold", source: 'TrueRate', time: '4d ago' },
];

const MARKETS_STORIES = [
  { href: '/news/1', category: 'forex', title: "Liberian Dollar Ends March Near L$184, Up 8% on the Year", source: 'TrueRate', time: '1d ago' },
  { href: '/news/3', category: 'policy', title: "Broad Money Grows 11% as the CBL Holds Its Rate at 16.3%", source: 'TrueRate', time: '2d ago' },
  { href: '/news/6', category: 'commodities', title: "Mining Output Climbs as Gold and Iron Ore Lead; Rubber Falls", source: 'TrueRate', time: '6d ago' },
];

const TRADE_STORIES = [
  { category: 'Trade', title: "Exports Jumped 58% to US$2.07bn in 2025 — Gold Did the Heavy Lifting", source: 'TrueRate', time: '2d ago', href: '/news/4' },
  { category: 'Trade', title: "Imports Rose 55% to US$2.35bn, Widening the Trade Deficit to US$280m", source: 'TrueRate', time: '3d ago', href: '/news/4' },
  { category: 'Mining', title: "Gold Output Rose 15% and Diamond Output More Than Doubled Year-on-Year", source: 'TrueRate', time: '4d ago', href: '/news/6' },
  { category: 'Agriculture', title: "Rubber Earnings Fell 54% as Global Prices and Liberian Output Declined", source: 'TrueRate', time: '5d ago', href: '/news/6' },
];

const POLICY_STORIES = [
  { category: 'Monetary Policy', title: "CBL Held the Policy Rate at 16.3% Through May 2026", source: 'TrueRate', time: '1d ago', href: '/news/3' },
  { category: 'Fiscal', title: "Mid-Year Budget Review Due April 14 — Legislature Expected to Push for Mining Revenue Transparency", source: 'TrueRate', time: '3d ago', href: '/economy' },
  { category: 'IMF', title: "IMF Staff Mission Begins April 22 — Fourth Review Under the Extended Credit Facility", source: 'TrueRate', time: '5d ago', href: '/economy' },
];

const OPINION = [
  { title: "Liberia's rubber pricing model leaves smallholders exposed. Here's how to fix it.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '2d ago' },
  { title: "Liberia needs a sovereign wealth framework before the mining boom peaks.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '3d ago' },
  { title: "A West African single currency is still coming. Liberia should help shape it, not just join it.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '4d ago' },
];

const MOST_READ = [
  { title: "Liberian dollar ends March near L$184, up 8% on the year", tag: 'Forex' },
  { title: "Inflation eases to 4.5% but core prices stay near 6%", tag: 'Economy' },
  { title: "Liberia's economy grew 4.6% in 2025", tag: 'Economy' },
  { title: "Broad money grows 11% as the CBL holds its rate at 16.3%", tag: 'Policy' },
  { title: "Exports jump 58% to US$2.1 billion in 2025, led by gold", tag: 'Trade' },
  { title: "Mining output climbs as gold and iron ore lead; rubber falls", tag: 'Commodities' },
  { title: "Gold exports more than doubled year-on-year in March 2026", tag: 'Mining' },
  { title: "IMF staff mission begins April 22", tag: 'IMF' },
  { title: "ArcelorMittal's Nimba expansion: three scenarios for fiscal future", tag: 'Mining' },
  { title: "Public debt reached 54.6% of GDP — what it means for policy", tag: 'Fiscal' },
];

/* ── page (server component) ── */
export default async function FinanceNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const searchResults = query
    ? newsItems.filter(n => {
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
            {[...TRENDING, ...TRENDING].map((b, i) => (
              <Link key={i} href="/news/finance" className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-gray-200">
                <span className={`text-2xs font-black uppercase tracking-widest ${getCatColor(b.label)}`}>{b.label}</span>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-950 transition-colors">{b.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout: two columns + sidebar ── */}
      <div className="flex gap-6 items-start">

        {/* ── Left: main content ── */}
        <div className="flex-1 min-w-0 pb-8">

          {/* Hero story */}
          <Link href={HERO_STORIES[0].href} className="group relative block no-underline overflow-hidden rounded-xl mb-6">
            <NewsThumbnail category={HERO_STORIES[0].category.toLowerCase()} className="w-full h-[300px] sm:h-[380px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(HERO_STORIES[0].category.toLowerCase())}`}>{HERO_STORIES[0].category}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <Heading level={2} as="h1" className="leading-snug text-white group-hover:text-brand-accent transition-colors drop-shadow-lg line-clamp-3 mb-2">{HERO_STORIES[0].title}</Heading>
              <Text className="text-sm text-white/70 line-clamp-2 mb-1.5">{HERO_STORIES[0].summary}</Text>
              <Text className="text-xs text-white/50">{HERO_STORIES[0].source} &middot; {HERO_STORIES[0].time}</Text>
            </div>
          </Link>

          {/* Tabbed finance feed */}
          <NewsFeedTabs />

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
              {ECONOMY_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
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
              {MARKETS_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
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
              {TRADE_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-3 no-underline border-t border-gray-100 pt-4 first:border-t-0 first:pt-0 [&:nth-child(2)]:border-t-0 [&:nth-child(2)]:pt-0 sm:[&:nth-child(2)]:border-t-0">
                  <NewsThumbnail category={s.category.toLowerCase()} className="shrink-0 h-[80px] w-[100px] rounded-xl" />
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
              {POLICY_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <NewsThumbnail category={s.category.toLowerCase().replace(/\s+/g, '-')} className="shrink-0 h-[80px] w-[120px] rounded-xl" />
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
              {OPINION.map((op, i) => (
                <Link key={i} href="/news/finance" className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
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
              {MOST_READ.slice(0, 6).map((item, i) => (
                <Link key={i} href="/news/finance" className="flex items-start gap-3 px-4 py-3 no-underline group hover:bg-gray-50 transition-colors">
                  <span className="shrink-0 text-lg font-black text-gray-200 tabular-nums w-5 text-right">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Text className="text-sm font-bold leading-snug text-gray-700 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</Text>
                    <span className="text-2xs font-semibold uppercase tracking-wide text-gray-400 mt-1 block">{item.tag}</span>
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
