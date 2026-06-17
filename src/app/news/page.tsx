import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getNewsItems } from '@/lib/news-source';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail, VideoThumbnail, AuthorAvatar } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';
import { Heading, Text } from '@/components/ui';
import { HeroCarousel, GeneralNewsTabs } from './NewsClient';
import PlayableVideo from '@/components/PlayableVideo';

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

/* ── static data: general / multi-topic ── */

/* Article-bearing sections are derived from the live DB inside the component
   (see NewsPage). Only non-article widgets (events, videos) remain static. */

const UPCOMING_EVENTS = [
  { date: 'Apr 7',  title: 'CBL Monetary Policy Committee Meeting',     type: 'Policy' },
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
  { title: "Liberia's Film Rebate, Explained in Two Minutes", duration: '2:12', category: 'entertainment', time: '30m ago', youtubeId: '' },
  { title: "LISCR FC's Unbeaten Season: The Key Moments", duration: '3:45', category: 'sports', time: '2h ago', youtubeId: '' },
  { title: "Why the CBL Is Holding Its Policy Rate at 16.25%", duration: '2:48', category: 'policy', time: '6h ago', youtubeId: '' },
  { title: "How 'Pay Na-Na' Connects MTN and Orange Mobile Money", duration: '1:52', category: 'economy', time: '12h ago', youtubeId: '' },
  { title: "Mining Drove 2025 Growth: Iron Ore and Gold, Explained", duration: '2:31', category: 'Mining', time: '1d ago', youtubeId: '' },
  { title: "5G in Monrovia: What It Means and When It's Coming", duration: '2:05', category: 'technology', time: '2d ago', youtubeId: '' },
];


/* ── server-rendered sub-stories ── */
function SubStoryRow({ items: all }: { items: NewsItem[] }) {
  const items = all.slice(5, 8);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group no-underline">
          <div className="overflow-hidden rounded-xl">
            <NewsThumbnail category={item.category} id={item.id} src={item.image} className="w-full h-[130px]" />
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

  const items = await getNewsItems();

  // Editorial sections, all sourced from the live articles table.
  const analysisItems = items.filter((n) => ['analysis', 'opinion'].includes(n.category.toLowerCase()));
  const ticker = items.slice(0, 8).map((n) => ({ label: n.category, text: n.title, href: `/news/${n.id}` }));
  const editorsPicks = items.slice(0, 3).map((n) => ({
    href: `/news/${n.id}`,
    category: n.category,
    title: n.title,
    excerpt: n.summary,
    image: n.image,
    author: n.author ?? n.source,
    readTime: n.readTime ?? '',
    time: timeAgo(n.date),
  }));
  const dataStories = items.slice(8, 14).map((n) => ({
    href: `/news/${n.id}`,
    category: n.category,
    title: n.title,
    image: n.image,
    time: timeAgo(n.date),
  }));
  const archives = items.slice(-4).map((n) => ({
    href: `/news/${n.id}`,
    title: n.title,
    category: n.category,
    image: n.image,
    readTime: n.readTime ?? '',
    date: new Date(n.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }));
  const opinion = (analysisItems.length ? analysisItems : items).slice(0, 5).map((n) => ({
    href: `/news/${n.id}`,
    title: n.title,
    author: n.author ?? n.source,
    role: n.category.toLowerCase() === 'opinion' ? 'Opinion' : 'Analysis',
    time: timeAgo(n.date),
  }));
  const communityVoices = (analysisItems.length ? analysisItems : items).slice(0, 4).map((n) => ({
    href: `/news/${n.id}`,
    title: n.title,
    excerpt: n.summary,
    author: n.author ?? n.source,
    role: n.category.toLowerCase() === 'opinion' ? 'Opinion' : 'Analysis',
    time: timeAgo(n.date),
  }));

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
              &larr; All news
            </Link>
          </div>

          {searchResults.length === 0 ? (
            <div className="border-b border-gray-200 py-10 text-center">
              <Heading level={4} as="h2" className="mb-1 font-bold text-gray-900">No results found</Heading>
              <Text className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500">
                Try searching for &ldquo;inflation&rdquo;, &ldquo;sports&rdquo;, &ldquo;entertainment&rdquo; or &ldquo;technology&rdquo;.
              </Text>
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="flex-1 min-w-0 flex flex-col divide-y divide-gray-100">
                {searchResults.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-5 last:pb-5 no-underline">
                    <NewsThumbnail category={item.category} id={item.id} src={item.image} className="shrink-0 h-[70px] w-[100px] sm:h-[90px] sm:w-[140px] rounded-xl" />
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

      {/* Three-column layout */}
      <div className="flex gap-4 sm:gap-6 items-start">

        {/* Left: Trending */}
        <TrendingPanel items={items} />

        {/* Center: main feed */}
        <div className="flex-1 min-w-0 pb-8">

          {/* Hero carousel (client island) */}
          <HeroCarousel items={items} />

          {/* 3 sub-stories */}
          <SubStoryRow items={items} />

          {/* Tab bar + feed (client island) */}
          <GeneralNewsTabs items={items} />

          {/* Editor's Picks */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Editor&apos;s Picks</Heading>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {editorsPicks.map((p, i) => (
                <Link key={i} href={p.href} className="group flex flex-col sm:flex-row gap-3 sm:gap-4 py-5 first:pt-0 no-underline hover:opacity-75 transition-opacity">
                  <div className="shrink-0 overflow-hidden rounded-xl order-first sm:order-last">
                    <NewsThumbnail category={p.category} src={p.image} className="h-[180px] w-full sm:h-[110px] sm:w-[160px]" />
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
              <Link href="/news/finance" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">All stories ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x divide-y sm:divide-y-0 divide-gray-100 border-t border-b border-gray-100">
              {items.slice(20, 24).map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-row sm:flex-col gap-3 sm:gap-2.5 p-4 no-underline hover:bg-gray-50 transition-colors">
                  <div className="shrink-0 sm:shrink overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} id={item.id} src={item.image} className="h-[80px] w-[110px] sm:w-full" />
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
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {opinion.map((op, i) => (
                <Link key={i} href={op.href} className="group flex items-center gap-4 py-4 first:pt-0 no-underline">
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
              <Link href="/news/finance" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dataStories.map((s, i) => (
                <Link key={i} href={s.href} className="group flex flex-col no-underline">
                  <div className="overflow-hidden rounded-xl mb-3">
                    <NewsThumbnail category={s.category} src={s.image} className="w-full h-[140px]" />
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
              {archives.map((a, i) => (
                <Link key={i} href={a.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-xl">
                    <NewsThumbnail category={a.category} src={a.image} className="h-[80px] w-[120px]" />
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

          {/* From the Newsroom */}
          <div className="mt-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">From the Newsroom</Heading>
              </div>
              <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-base text-gray-500 hover:text-brand-accent-ink transition-colors no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityVoices.map((cv, i) => (
                <Link key={i} href={cv.href} className="group flex flex-col no-underline border-t border-gray-100 pt-4">
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

          {/* Upcoming Events */}
          <div className="mt-10 mb-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Upcoming Events</Heading>
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
        <RightRail items={items} />
      </div>
    </>)}

    </main>
    </div>
  );
}
