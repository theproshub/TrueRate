import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { newsItems } from '@/data/news';
import { NewsThumbnail, VideoThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';
import { Heading, Text } from '@/components/ui';
import { HeroCarousel, NewsFeedTabs } from './NewsClient';
import PlayableVideo from '@/components/PlayableVideo';

/* ── helpers ── */
function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-04').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

/* ── static data ── */

const BREAKING = [
  { label: 'FOREX', text: 'Liberian dollar ended March 2026 at L$183.93 per US dollar — about 8% stronger than a year earlier (CBL)' },
  { label: 'POLICY', text: 'CBL held the Monetary Policy Rate at 16.3% through May 2026, after a one-point cut from 17.3% (CBL)' },
  { label: 'INFLATION', text: 'Headline inflation eased to 4.5% year-on-year in March 2026, though core prices held near 6% (CBL)' },
  { label: 'ECONOMY', text: 'Real GDP grew 4.6% in 2025, up from 4.0% a year earlier; nominal GDP reached US$5.16bn (LISGIS)' },
  { label: 'TRADE', text: 'Exports jumped 58% to US$2.07bn in 2025, led by gold; imports rose 55% to US$2.35bn (CBL)' },
  { label: 'MONEY', text: 'Broad money grew 10.7% to L$299.4bn in March 2026; reserve money rose 31% year-on-year (CBL)' },
  { label: 'COMMODITIES', text: 'Gold exports more than doubled year-on-year to about US$175m in March 2026; rubber earnings fell ~54% (CBL)' },
  { label: 'MINING', text: 'Gold output rose 15% and diamond output more than doubled year-on-year in March 2026; rubber fell ~30% (LISGIS)' },
];

const OPINION = [
  { title: "Liberia's rubber pricing model leaves smallholders exposed. Here's how to fix it.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '2d ago' },
  { title: "Liberia needs a sovereign wealth framework before the mining boom peaks.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '3d ago' },
  { title: "A West African single currency is still coming. Liberia should help shape it, not just join it.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '4d ago' },
  { title: "Mobile money is racing ahead of the electricity and connectivity it depends on.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '5d ago' },
  { title: "The Freeport handles most of Liberia's trade. The roads behind it haven't kept up.", author: 'TrueRate Editorial Board', role: 'Opinion', time: '6d ago' },
];

const DATA_STORIES = [
  { href: '/news/5', stat: '4.6%',     statLabel: 'GDP growth',    title: "Liberia's Economy Grew 4.6% in 2025 as Nominal GDP Reached US$5.2 Billion",  time: '1d ago', category: 'economy' },
  { href: '/news/3', stat: '16.3%',    statLabel: 'Policy rate',   title: "Broad Money Grows 11% as the CBL Holds Its Rate at 16.3%",                   time: '2d ago', category: 'policy' },
  { href: '/news/2', stat: '4.5%',     statLabel: 'Inflation',     title: "Inflation Eases to 4.5% in March, but Core Prices Stay Near 6%",             time: '3d ago', category: 'economy' },
  { href: '/news/4', stat: 'US$2.1bn', statLabel: 'Exports 2025',  title: "Liberia's Exports Jump 58% to US$2.1 Billion in 2025, Led by Gold",          time: '4d ago', category: 'economy' },
  { href: '/news/1', stat: 'L$183.9',  statLabel: 'LRD / US$',     title: "Liberian Dollar Ends March Near L$184 to the US Dollar, Up 8% on the Year",  time: '5d ago', category: 'forex' },
  { href: '/news/6', stat: '+112%',    statLabel: 'Gold exports',  title: "Mining Output Climbs as Gold and Iron Ore Lead; Rubber Falls",               time: '6d ago', category: 'commodities' },
];

const EDITORS_PICKS = [
  {
    href: '/news/5',
    category: 'Explainer',
    title: "Liberia Grew 4.6% in 2025. Here's What That Number Means for the Average Liberian.",
    excerpt: "Mining-led growth sounds like good news, but the gains have historically concentrated at the top. We map which sectors drove the expansion — iron ore, trade and services — and where the economy is still failing most people.",
    author: 'TrueRate Economics',
    readTime: '4 min read',
    time: '1d ago',
  },
  {
    href: '/news/4',
    category: 'Deep Dive',
    title: "Liberia's Exports Jumped 58% in 2025. Gold Did the Heavy Lifting.",
    excerpt: "Export earnings reached US$2.07 billion as gold and iron-ore shipments surged. We break down which commodities drove the boom, why the trade deficit still widened, and what it means for foreign-exchange earnings.",
    author: 'TrueRate Economics',
    readTime: '4 min read',
    time: '2d ago',
  },
  {
    href: '/news/3',
    category: 'Explainer',
    title: "Why the CBL Is Holding Its Rate at 16.3% as Money Supply Climbs",
    excerpt: "Broad money grew nearly 11% and reserve money surged 31% over the year, yet the Central Bank has kept its policy rate steady. We explain the balancing act between liquidity, inflation and the cost of credit.",
    author: 'TrueRate Economics',
    readTime: '4 min read',
    time: '3d ago',
  },
];

const ARCHIVES = [
  { title: "Thirty Years of Missed Opportunity: Why Liberia's Rubber Sector Has Never Matched Its Potential",   date: 'Jan 2026', category: 'Agriculture', readTime: '12 min read' },
  { title: "From Post-War Reconstruction to Rate Decisions: The Long Road to CBL Independence",                  date: 'Nov 2025', category: 'policy',      readTime: '15 min read' },
  { title: "Iron Ore, Timber, Rubber: The Three-Commodity Trap That Has Defined Liberia's Economy for 60 Years", date: 'Sep 2025', category: 'Mining',      readTime: '10 min read' },
  { title: "The Invisible Economy: How Monrovia's Informal Sector Powers Half the City — and Gets None of the Credit", date: 'Jul 2025', category: 'economy', readTime: '9 min read' },
];

const UPCOMING_EVENTS = [
  { date: 'Apr 7',  title: 'CBL Monetary Policy Committee Meeting',     type: 'Monetary Policy' },
  { date: 'Apr 10', title: 'Q1 2026 GDP Advance Estimate Release',       type: 'Data' },
  { date: 'Apr 12', title: 'LTA 5G Spectrum Consultation — Monrovia',    type: 'Tech' },
  { date: 'Apr 14', title: 'Mid-Year Budget Review — Legislature',        type: 'Fiscal' },
  { date: 'Apr 14', title: 'Liberia Investment Forum — Monrovia',         type: 'Trade' },
  { date: 'Apr 18', title: 'West Africa Trade Facilitation Summit',       type: 'Trade' },
  { date: 'Apr 22', title: 'IMF Staff Mission Begins',                    type: 'IMF' },
  { date: 'Apr 28', title: 'ArcelorMittal Q1 Earnings Call',             type: 'Markets' },
  { date: 'May 5',  title: 'African Development Bank Annual Meetings',    type: 'Development' },
];

const VIDEOS = [
  { title: "Why the CBL Is Holding Its Policy Rate at 16.25%", duration: '2:48', category: 'policy', time: '55m ago', youtubeId: '' },
  { title: "How 'Pay Na-Na' Connects MTN and Orange Mobile Money", duration: '1:52', category: 'economy', time: '3h ago', youtubeId: '' },
  { title: "Mining Drove 2025 Growth: Iron Ore and Gold, Explained", duration: '2:31', category: 'Mining', time: '12h ago', youtubeId: '' },
  { title: "Liberia's Dual-Currency Economy, Explained in Two Minutes", duration: '3:14', category: 'economy', time: '1d ago', youtubeId: '' },
  { title: "Foreign Reserves and Import Cover: What About US$576M Buys", duration: '4:05', category: 'policy', time: '2d ago', youtubeId: '' },
  { title: "Inflation Cooled to About 3% in Early 2026 — Here's How", duration: '3:22', category: 'economy', time: '3d ago', youtubeId: '' },
];

const COMMUNITY_VOICES = [
  {
    title: "Local-content rules in mining still aren't translating into local contracts",
    excerpt: "Liberia has local-content legislation, but enforcement remains the gap between policy and the businesses it is meant to grow. TrueRate examines where the rules fall short across the mining supply chain.",
    author: 'TrueRate Business',
    role: 'Analysis',
    time: '3d ago',
  },
  {
    title: "Mobile money is reaching rural Liberia faster than electricity and connectivity",
    excerpt: "Adoption is climbing outside Monrovia, but agents in counties like Bong and Lofa face generator costs and unreliable data. The infrastructure gap, not demand, is the real constraint on fintech's reach.",
    author: 'TrueRate Tech',
    role: 'Analysis',
    time: '4d ago',
  },
  {
    title: "Agriculture keeps growing — and keeps getting less attention than mining",
    excerpt: "Mining drives the headline numbers, but smallholder farming and agro-processing remain central to how most Liberians earn and eat. TrueRate looks at why the sector stays under-covered.",
    author: 'TrueRate Economics',
    role: 'Analysis',
    time: '5d ago',
  },
  {
    title: "The Lofa corridor's farm-to-market potential keeps running into unpaved roads",
    excerpt: "Studies repeatedly point to Lofa's agricultural belt as a major opportunity if cold-chain logistics and roads connect it to Monrovia. The constraint has long been infrastructure, not potential.",
    author: 'TrueRate Economics',
    role: 'Analysis',
    time: '6d ago',
  },
];

/* ── server-rendered sub-stories ── */
function SubStoryRow() {
  const items = newsItems.slice(5, 8);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group no-underline">
          <div className="overflow-hidden rounded-xl">
            <NewsThumbnail category={item.category} id={item.id} className="w-full h-[130px]" />
          </div>
          <div className="mt-2.5">
            <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
            <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{item.title}</Heading>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-400">
              <span>{item.source}</span><span>·</span><span>{timeAgo(item.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── page (server component) ── */
export default async function NewsPage({
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
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News' }]} light />

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
            <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">
              ← All news
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
                        <span>·</span>
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

      {/* Breaking ticker */}
      <div className="mb-5 flex items-center gap-0 border-b border-gray-200 overflow-hidden">
        <div className="shrink-0 bg-brand-accent px-3 py-2.5 z-10">
          <span className="text-2xs font-black uppercase tracking-widest text-brand-dark">Live</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-scroll flex w-max">
            {[...BREAKING, ...BREAKING].map((b, i) => (
              <Link key={i} href="/news" className="flex items-center gap-2 px-5 py-2.5 no-underline whitespace-nowrap group shrink-0 border-l border-gray-200">
                <span className={`text-2xs font-black uppercase tracking-widest ${getCatColor(b.label)}`}>{b.label}</span>
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-950 transition-colors">{b.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex gap-6 items-start">

        {/* Left: Trending */}
        <TrendingPanel />

        {/* Center: main feed */}
        <div className="flex-1 min-w-0 pb-8">

          {/* Hero carousel (client island) */}
          <HeroCarousel />

          {/* 3 sub-stories */}
          <SubStoryRow />

          {/* Tab bar + feed (client island) */}
          <NewsFeedTabs />

          {/* Editor's Picks */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Editor&apos;s Picks</Heading>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {EDITORS_PICKS.map((p, i) => (
                <Link key={i} href={p.href} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 py-5 first:pt-0 no-underline hover:opacity-75 transition-opacity">
                  <div className="shrink-0 overflow-hidden rounded-xl order-first sm:order-last">
                    <NewsThumbnail category={i === 0 ? 'Mining' : i === 1 ? 'economy' : 'policy'} className="h-[180px] w-full sm:h-[110px] sm:w-[160px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-wide text-gray-500">{p.category}</span>
                      <span className="text-xs text-gray-400">{p.readTime}</span>
                    </div>
                    <Heading level={4} as="h3" className="font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors mb-2">{p.title}</Heading>
                    <Text className="text-sm sm:text-base text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-2 mb-2">{p.excerpt}</Text>
                    <div className="text-xs sm:text-sm text-gray-400">{p.author} · {p.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* More Stories grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">More Stories</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 sm:divide-x divide-y sm:divide-y-0 divide-gray-100 border-t border-b border-gray-100">
              {newsItems.slice(20, 24).map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-row sm:flex-col gap-3 sm:gap-2.5 p-4 no-underline hover:bg-gray-50 transition-colors">
                  <div className="shrink-0 sm:shrink overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} id={item.id} className="h-[80px] w-[110px] sm:w-full" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-1.5 sm:gap-2.5">
                    <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</div>
                    <Heading level={6} as="h3" className="text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3">{item.title}</Heading>
                    <div className="text-2xs text-gray-400 mt-auto">{item.source} · {timeAgo(item.date)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Videos strip */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Videos</Heading>
              </div>
              <Link href="/videos" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:divide-y-0 divide-y divide-gray-100 border-t border-b sm:border-t-0 sm:border-b-0 border-gray-100">
              {VIDEOS.map((v, i) => (
                <div key={i} className="group flex flex-col py-4 sm:py-0">
                  <PlayableVideo id={v.youtubeId} label={v.title} className="overflow-hidden rounded-xl mb-2 h-[140px] sm:h-[110px]">
                    <VideoThumbnail category={v.category} duration={v.duration} className="absolute inset-0 w-full h-full" />
                  </PlayableVideo>
                  <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 line-clamp-2 mb-1">{v.title}</Heading>
                  <span className="text-xs text-gray-400">{v.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis & Opinion */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Analysis &amp; Opinion</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">View all ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {OPINION.map((op, i) => (
                <Link key={i} href="/news" className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-full">
                    <AuthorAvatar name={op.author} className="h-11 w-11 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2 mb-1">{op.title}</Heading>
                    <div className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500">{op.author} · <span className="text-gray-400">{op.role}</span> · <span className="text-gray-400">{op.time}</span></div>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Data Stories */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Data Stories</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DATA_STORIES.map((s, i) => (
                <Link key={i} href={s.href} className="group flex flex-col no-underline">
                  <div className="overflow-hidden rounded-xl mb-3">
                    <NewsThumbnail category={s.category} className="w-full h-[140px]" />
                  </div>
                  <span className={`text-2xs font-bold uppercase tracking-wide mb-1.5 ${getCatColor(s.category)}`}>{s.category}</span>
                  <Heading level={6} as="h3" className="leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-3 mb-2">{s.title}</Heading>
                  <span className="text-xs text-gray-400 mt-auto">{s.time}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* From the Archives */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">From the Archives</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">Browse archive ›</Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {ARCHIVES.map((a, i) => (
                <Link key={i} href="/news" className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={a.category} className="h-[80px] w-[120px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2 mb-1.5">{a.title}</Heading>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{a.date}</span>
                      <span>·</span>
                      <span>{a.readTime}</span>
                    </div>
                  </div>
                  <svg className="shrink-0 h-4 w-4 text-gray-500 group-hover:text-gray-400 transition-colors self-center" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Community Voices */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">From the Newsroom</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMUNITY_VOICES.map((cv, i) => (
                <Link key={i} href="/news" className="group flex flex-col no-underline border-t border-gray-100 pt-4">
                  <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2 mb-2">{cv.title}</Heading>
                  <Text className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 line-clamp-3 mb-3 flex-1">{cv.excerpt}</Text>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 overflow-hidden rounded-full">
                      <AuthorAvatar name={cv.author} className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <Text className="text-sm font-semibold text-gray-700 truncate">{cv.author}</Text>
                      <Text variant="meta" className="text-gray-400 truncate">{cv.role} · {cv.time}</Text>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Economic Events */}
          <div className="mt-10 mb-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Upcoming Economic Events</Heading>
              </div>
              <Link href="/economy" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">Full calendar ›</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {UPCOMING_EVENTS.map((ev, i) => (
                <Link key={i} href="/economy" className="group flex items-center gap-4 py-3 no-underline">
                  <span className="shrink-0 w-[52px] text-sm font-medium text-gray-400 tabular-nums">{ev.date}</span>
                  <Text className="flex-1 text-base font-semibold text-gray-800 group-hover:text-brand-accent-ink transition-colors leading-snug">{ev.title}</Text>
                  <span className="shrink-0 text-2xs font-medium text-gray-400 uppercase tracking-wide">{ev.type}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <RightRail />
      </div>
    </>)}

    </main>
    </div>
  );
}
