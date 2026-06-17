import Link from 'next/link';
import { getCatColor } from '@/lib/category-colors';
import { timeAgo } from '@/lib/utils';
import IndicatorsStrip from '@/components/IndicatorsStrip';
import VideosSection from '@/components/VideosSection';
import LiveMarketRail from '@/components/LiveMarketRail';
import StickySidebar from '@/components/sports/StickySidebar';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { SEED_INDICATORS } from '@/data/ticker-seed';
import { TODAYS_VIDEOS } from '@/data/todays-videos';
import { Heading, Text } from '@/components/ui';
import { getHomeFeed, type HomeArticle } from '@/lib/home-feed';

export const metadata = {
  alternates: { canonical: '/' },
};

export const revalidate = 0; // always read the latest published articles from the DB

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED PIECES
───────────────────────────────────────────────────────────────────────────── */

/** Byline · time meta line. Category badges are reserved for the news pages. */
function Meta({ a, byline = true }: { a: HomeArticle; byline?: boolean }) {
  return (
    <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
      {byline && a.byline && (
        <>
          <span>{a.byline}</span>
          <span className="mx-1.5 text-gray-700">·</span>
        </>
      )}
      {timeAgo(a.date)}
    </Text>
  );
}

/** Standard horizontal story row: text + thumbnail (thumb side configurable). */
function StoryRow({ a, thumb = 'right' }: { a: HomeArticle; thumb?: 'left' | 'right' | 'none' }) {
  const Thumbnail = (
    <div className="shrink-0 overflow-hidden rounded-lg">
      <NewsThumbnail category={a.categorySlug} id={a.seedId} src={a.src} className="h-[64px] w-[96px] sm:h-[80px] sm:w-[120px]" />
    </div>
  );
  return (
    <Link href={a.href} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
      {thumb === 'left' && Thumbnail}
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-3">
          {a.title}
        </h3>
        <Meta a={a} />
      </div>
      {thumb === 'right' && Thumbnail}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COLUMNS
───────────────────────────────────────────────────────────────────────────── */

function FeaturedColumn({ items }: { items: HomeArticle[] }) {
  const [lead, ...subs] = items;
  if (!lead) return null;
  return (
    <div className="flex flex-col gap-0">
      {/* Lead story */}
      <Link href={lead.href} className="group block no-underline">
        <div className="overflow-hidden -mx-2 sm:mx-0 rounded-none sm:rounded-xl mb-4">
          <HeroVisual category={lead.categorySlug} id={lead.seedId} src={lead.src} className="h-[200px] sm:h-[260px]" />
        </div>
        <div className="text-center max-w-[640px] mx-auto px-1">
          <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-3">
            <span>Lead story</span>
            <span className="mx-2 text-gray-700">·</span>
            <span className={getCatColor(lead.categorySlug)}>{lead.categoryLabel}</span>
          </Text>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-[1.15] text-white group-hover:text-white/80 transition-colors mb-3 tracking-tight text-balance">
            {lead.title}
          </h1>
          {lead.dek && (
            <p className="text-base sm:text-lg font-medium leading-relaxed text-gray-300 mb-3 text-pretty line-clamp-3">{lead.dek}</p>
          )}
          <Text variant="meta" className="text-gray-500 mb-2">
            {lead.byline && (
              <>
                <span>{lead.byline}</span>
                <span aria-hidden className="mx-1.5">·</span>
              </>
            )}
            <time>{timeAgo(lead.date)}</time>
          </Text>
        </div>
      </Link>

      {/* Sub-stories */}
      {subs.length > 0 && (
        <div className="mt-6 flex flex-col divide-y divide-white/[0.06]">
          {subs.map((a) => (
            <Link key={a.href} href={a.href} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
              <div className="shrink-0 overflow-hidden rounded-lg">
                <NewsThumbnail category={a.categorySlug} id={a.seedId} src={a.src} className="h-[64px] w-[96px] sm:h-[80px] sm:w-[120px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-3">{a.title}</h3>
                <Meta a={a} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsListColumn({ items }: { items: HomeArticle[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="top-stories-heading">
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <h2 id="top-stories-heading" className="text-base font-bold text-white uppercase tracking-[0.12em]">Top Stories</h2>
        <Link href="/news" className="text-sm text-gray-400 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((a) => (
          <Link key={a.href} href={a.href} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
            <div className="overflow-hidden rounded-xl shrink-0">
              <NewsThumbnail category={a.categorySlug} id={a.seedId} src={a.src} className="h-[64px] w-[96px] sm:h-[90px] sm:w-[130px]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-3 text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors">{a.title}</h3>
              <Meta a={a} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LatestColumn({ items }: { items: HomeArticle[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="latest-feed-heading">
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <h2 id="latest-feed-heading" className="text-base font-bold text-white uppercase tracking-[0.12em]">Latest</h2>
        <Link href="/news" className="text-sm text-gray-400 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((a) => (
          <Link key={a.href} href={a.href} className="flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline group">
            <div className="shrink-0 overflow-hidden rounded-xl">
              <NewsThumbnail category={a.categorySlug} id={a.seedId} src={a.src} className="h-[64px] w-[96px] sm:h-[90px] sm:w-[130px]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-md font-bold leading-snug text-white line-clamp-3 group-hover:text-white/80 transition-colors">{a.title}</h3>
              <Meta a={a} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function DeepReadsColumn({ items }: { items: HomeArticle[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <div>
      <div className="flex items-end justify-between border-b border-white/20 pb-3 mb-4">
        <div>
          <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-0.5">Long reads</Text>
          <Heading level={5} className="text-white">In depth</Heading>
        </div>
        <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">More ›</Link>
      </div>
      <Link href={lead.href} className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.categorySlug} id={lead.seedId} src={lead.src} className="w-full h-[180px]" />
        </div>
        <h3 className="text-sm font-bold leading-snug text-white group-hover:text-white/80 transition-colors">{lead.title}</h3>
        <div className="mt-2 text-xs text-gray-500">{lead.byline ? `${lead.byline} · ` : ''}{timeAgo(lead.date)}</div>
      </Link>
      {rest.length > 0 && (
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {rest.map((a) => <StoryRow key={a.href} a={a} thumb="right" />)}
        </div>
      )}
    </div>
  );
}

function MoreNewsColumn({ items }: { items: HomeArticle[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="across-liberia-heading">
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <h2 id="across-liberia-heading" className="text-base font-bold text-white uppercase tracking-[0.12em]">Across Liberia</h2>
        <Link href="/news" className="text-sm text-gray-400 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((a) => <StoryRow key={a.href} a={a} thumb="right" />)}
      </div>
    </section>
  );
}

function QuickReadsColumn({ items }: { items: HomeArticle[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <div>
      <div className="flex items-end justify-between border-b border-white/20 pb-3 mb-4">
        <div>
          <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-0.5">Desk notes</Text>
          <Heading level={5} className="text-white">In brief</Heading>
        </div>
        <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">More ›</Link>
      </div>

      {/* Lead — image + headline + meta */}
      <Link href={lead.href} className="group block no-underline mb-4">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.categorySlug} id={lead.seedId} src={lead.src} className="w-full h-[180px]" />
        </div>
        <h3 className="text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors text-balance mb-1">{lead.title}</h3>
        <Text variant="meta" className="text-gray-500">{lead.byline ? `${lead.byline} · ` : ''}{timeAgo(lead.date)}</Text>
      </Link>

      {/* Follow list — headline + source · time */}
      <div className="flex flex-col divide-y divide-white/[0.06] border-t border-white/[0.06]">
        {rest.map((a) => (
          <Link key={a.href} href={a.href} className="group block py-3 no-underline">
            <h4 className="text-sm font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-2 mb-1 text-pretty">{a.title}</h4>
            <Text variant="meta" className="text-gray-500">{a.byline ? `${a.byline} · ` : ''}{timeAgo(a.date)}</Text>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MostReadWidget({ items }: { items: HomeArticle[] }) {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-white/[0.05] pt-5">
      <div className="flex items-center justify-between mb-3">
        <Heading level={6} className="text-white uppercase tracking-[0.12em]">Most Read</Heading>
        <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((a) => (
          <Link key={a.href} href={a.href} className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <div className="min-w-0">
              <p className="text-base font-semibold leading-snug text-white/80 group-hover:text-white/80 transition-colors line-clamp-2">{a.title}</p>
              <Text variant="meta" className="mt-1">{a.byline ? `${a.byline} · ` : ''}{timeAgo(a.date)}</Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LatestSidebar({ latest, mostRead }: { latest: HomeArticle[]; mostRead: HomeArticle[] }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Live market data (FX + macro indicators) */}
      <LiveMarketRail />

      {/* Latest headlines */}
      {latest.length > 0 && (
        <div className="border-t border-white/[0.05] pt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Latest</h2>
            <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
          </div>
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {latest.map((a) => (
              <Link key={a.href} href={a.href} className="block py-3 first:pt-0 no-underline group">
                <span className="text-base font-medium leading-snug text-white/80 group-hover:text-white/80 transition-colors">{a.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <MostReadWidget items={mostRead} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default async function Home() {
  const { articles } = await getHomeFeed();

  // Slice the pool into the layout's sections. Main columns are sequential and
  // distinct; the sidebar widgets reuse the top stories (Latest / Most Read).
  const featured = articles.slice(0, 5);
  const newsList = articles.slice(5, 9);
  const latest = articles.slice(9, 17);
  const deepReads = articles.slice(17, 27);
  const moreNews = articles.slice(27, 35);
  const quickReads = articles.slice(9, 13);
  const sidebarLatest = articles.slice(0, 8);
  const mostRead = articles.slice(0, 5);

  return (
    <div className="min-h-screen">
      <IndicatorsStrip initial={SEED_INDICATORS} />

      <main className="mx-auto max-w-container px-4 sm:px-5 py-6 sm:py-8 pb-4 sm:pb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">

          {/* LEFT — col 1-5 */}
          <div className="order-1 lg:col-span-5 flex flex-col gap-5">
            <FeaturedColumn items={featured} />
            <div className="border-t border-white/[0.05] pt-5">
              <VideosSection videos={TODAYS_VIDEOS} />
            </div>
            {moreNews.length > 0 && (
              <div className="border-t border-white/[0.05] pt-5">
                <MoreNewsColumn items={moreNews} />
              </div>
            )}
            {quickReads.length > 0 && (
              <div className="hidden lg:block border-t border-white/[0.05] pt-5">
                <QuickReadsColumn items={quickReads} />
              </div>
            )}
          </div>

          {/* CENTER — col 6-9 */}
          <div className="order-2 lg:col-span-4 lg:border-l lg:border-white/[0.05] lg:pl-5 flex flex-col gap-5">
            <NewsListColumn items={newsList} />
            {latest.length > 0 && (
              <div className="border-t border-white/[0.05] pt-5">
                <LatestColumn items={latest} />
              </div>
            )}
            {deepReads.length > 0 && (
              <div className="border-t border-white/[0.05] pt-5">
                <DeepReadsColumn items={deepReads} />
              </div>
            )}
          </div>

          {/* RIGHT — col 10-12 (desktop only) */}
          <aside className="hidden lg:block order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5">
            <StickySidebar>
              <LatestSidebar latest={sidebarLatest} mostRead={mostRead} />
            </StickySidebar>
          </aside>

        </div>
      </main>
    </div>
  );
}
