import Link from 'next/link';
import { newsItems } from '@/data/news';
import { getNewsCatColor } from '@/lib/category-colors';
import { getNews, newsFeed, timeAgo } from '@/lib/utils';
import IndicatorsStrip from '@/components/IndicatorsStrip';
import VideosSection from '@/components/VideosSection';
import { NewsThumbnail, HeroVisual as SharedHeroVisual } from '@/components/NewsThumbnail';
import { SEED_INDICATORS } from '@/data/ticker-seed';
import { TODAYS_VIDEOS } from '@/data/todays-videos';
import { Heading, Text } from '@/components/ui';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

/** Per-story real photography, keyed by news item id */
const STORY_PHOTOS: Record<string, string> = {};

/** Related ticker chips shown beneath the lead story byline */
const STORY_CHIPS: Record<string, { label: string; value: string; up?: boolean }[]> = {
  '1': [
    { label: 'CBL Rate', value: '16.25%' },
    { label: 'LRD/USD', value: '+0.65%', up: true },
  ],
};

/** Homepage hero size wrapper — uses real photo when available, falls back to gradient tile */
function HeroVisual({ category, storyId }: { category: string; storyId?: string }) {
  const photo = storyId ? STORY_PHOTOS[storyId] : undefined;
  if (photo) {
    return (
      <div className="h-[200px] sm:h-[260px] w-full overflow-hidden bg-gray-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          className="w-full h-full object-cover object-top"
          aria-hidden="true"
        />
      </div>
    );
  }
  return <SharedHeroVisual category={category} className="h-[200px] sm:h-[260px]" />;
}
type ChipDir = 'up' | 'down' | 'flat';
type Chip = { label: string; pct: string; dir: ChipDir };

const LATEST_NEWS_IDS: { id: string; chips?: Chip[] }[] = [
  { id: '1',  chips: [{ label: 'CBL Rate', pct: '16.25%', dir: 'flat' }, { label: 'LRD/USD', pct: '+0.65%', dir: 'up' }] },
  { id: '30', chips: [{ label: 'LEC tariff', pct: '+12%', dir: 'up' }, { label: 'Diesel gen.', pct: '-4%', dir: 'down' }] },
  { id: '3',  chips: [{ label: 'Iron Ore', pct: '-2.08%', dir: 'down' }, { label: 'Gold', pct: '+0.82%', dir: 'up' }] },
  { id: '16' },
  { id: '12', chips: [{ label: 'Ecobank LIB', pct: '+3.1%', dir: 'up' }, { label: 'NPL ratio', pct: '9.4%', dir: 'flat' }] },
  { id: '11', chips: [{ label: 'LRD/USD', pct: '192.50', dir: 'flat' }, { label: '30d', pct: '-1.8%', dir: 'down' }] },
  { id: '5',  chips: [{ label: 'Rubber', pct: '+2.38%', dir: 'up' }, { label: 'Firestone output', pct: '+6%', dir: 'up' }] },
  { id: '8' },
];

const CHIP_STYLE: Record<ChipDir, string> = {
  up:   'text-emerald-400',
  down: 'text-red-400',
  flat: 'text-gray-400',
};

const MORE_NEWS_IDS = ['33', '9', '10', '7', '29', '22', '13', '31'];

const QUICK_READS_IDS = ['2', '35', '12', '26', '30', '32', '17', '19', '21', '23', '25'];

/* ─────────────────────────────────────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────────────────────────────────────── */


function SectionHeading({ title, kicker, action, actionLabel = 'View all' }: { title: string; kicker?: string; action?: string; actionLabel?: string }) {
  return (
    <div className="flex items-end justify-between border-b border-white/20 pb-3 mb-5">
      <div>
        {kicker && <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-1">{kicker}</Text>}
        <Heading level={5} className="text-white">{title}</Heading>
      </div>
      {action && <Link href={action} className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-300 hover:text-brand-accent transition-colors no-underline focus-visible:outline-none focus-visible:underline">{actionLabel} ›</Link>}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED ARTICLE
───────────────────────────────────────────────────────────────────────────── */

const FEATURED_BYLINES: Record<string, string> = {
  '1': 'Sarah Kollie',
  '2': 'James Dweh',
  '3': 'Martha Weah',
  '4': 'Tope Akande',
  '5': 'Adanna Okonkwo',
  '7': 'James Dweh',
  '8': 'Martha Weah',
  '11': 'Sarah Kollie',
  '12': 'Tope Akande',
  '16': 'Adanna Okonkwo',
};

function FeaturedColumn() {
  const featured = newsItems[0];
  const subs = [newsItems[1], newsItems[2], newsItems[3], newsItems[4]];

  return (
    <div className="flex flex-col gap-0">

      {/* ── Lead Story ── */}
      <Link href={`/news/${featured.id}`} className="group block no-underline">
        {/* Visual */}
        <div className="overflow-hidden -mx-2 sm:mx-0 rounded-none sm:rounded-xl mb-4">
          <HeroVisual category={featured.category} storyId={featured.id} />
        </div>

        {/* Tombstone: centered kicker / headline / deck / byline */}
        <div className="text-center max-w-[640px] mx-auto px-1">
          {/* Kicker */}
          <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-3">
            <span>Lead story</span>
            <span className="mx-2 text-gray-700">·</span>
            <span className={getNewsCatColor(featured.category)}>{featured.category}</span>
          </Text>

          {/* Headline — page's H1 */}
          <h1 className="text-xl sm:text-2xl font-black leading-[1.2] text-white group-hover:text-white/80 transition-colors mb-2 tracking-tight text-balance">
            {featured.title}
          </h1>

          {/* Deck — clamped so the hero stays tight */}
          <p className="text-md leading-snug text-gray-400 mb-2 text-pretty line-clamp-2">
            {featured.summary}
          </p>

          {/* Byline — Yahoo-style: source · time */}
          <Text variant="meta" className="text-gray-500 mb-2">
            <span>{featured.source}</span>
            <span aria-hidden className="mx-1.5">·</span>
            <time>{timeAgo(featured.date)}</time>
          </Text>

          {/* Related tickers — bordered square-edge chips */}
          {STORY_CHIPS[featured.id] && (
            <div className="flex items-center justify-center gap-2 text-xs">
              {STORY_CHIPS[featured.id].map(chip => (
                <span key={chip.label} className="inline-flex items-center gap-1 border border-white/[0.12] bg-white/[0.04] px-1.5 py-px text-2xs text-gray-400">
                  {chip.label}
                  <span className={chip.up ? 'text-emerald-400 font-semibold' : 'text-gray-300 font-semibold'}>{chip.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* ── Sub-stories — Yahoo-style: text left, thumb right, single row ── */}
      <div className="mt-6 flex flex-col divide-y divide-white/[0.06]">
        {subs.map((item, i) => {
          const sbyline = FEATURED_BYLINES[item.id] ?? item.source;
          return (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
              <div className="shrink-0 overflow-hidden rounded-lg">
                <NewsThumbnail category={item.category} className="h-[64px] w-[96px] sm:h-[80px] sm:w-[120px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-3">
                  {item.title}
                </h3>
                <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
                  <span className={`text-2xs font-semibold uppercase tracking-wide ${getNewsCatColor(item.category)}`}>{item.category}</span>
                  <span className="mx-1.5 text-gray-700">·</span>
                  {i === 0 ? `By ${sbyline}` : sbyline}
                  <span className="mx-1.5 text-gray-700">·</span>
                  {timeAgo(item.date)}
                </Text>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEWS LIST COLUMN
───────────────────────────────────────────────────────────────────────────── */

function NewsListColumn() {
  const items = newsItems.slice(3, 7);
  return (
    <div className="flex flex-col divide-y divide-white/[0.05]">
      {items.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
          <div className="overflow-hidden rounded-xl shrink-0">
            <NewsThumbnail category={item.category} className="h-[64px] w-[96px] sm:h-[90px] sm:w-[130px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-3 text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors">{item.title}</h3>
            <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
              {item.category && (
                <>
                  <span className={`text-2xs font-semibold uppercase tracking-wide ${getNewsCatColor(item.category)}`}>{item.category}</span>
                  <span className="mx-1.5 text-gray-700">·</span>
                </>
              )}
              {item.source}
              <span className="mx-1.5 text-gray-700">·</span>
              {timeAgo(item.date)}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LATEST COLUMN
───────────────────────────────────────────────────────────────────────────── */

function LatestColumn() {
  return (
    <section aria-labelledby="live-feed-heading">
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-red-500 motion-safe:animate-pulse" />
          <h2 id="live-feed-heading" className="text-base font-bold text-white uppercase tracking-[0.12em]">Live feed</h2>
        </div>
        <span className="text-2xs text-gray-400 tabular-nums">Updated 2 min ago</span>
      </div>

      {/* Large-card style — all viewports */}
      <div aria-live="polite" className="flex flex-col divide-y divide-white/[0.05]">
        {LATEST_NEWS_IDS.map(({ id, chips }) => {
          const item = getNews(id);
          if (!item) return null;
          return (
            <Link key={id} href={`/news/${item.id}`} className="flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline group">
              <div className="shrink-0 overflow-hidden rounded-xl">
                <NewsThumbnail category={item.category} className="h-[64px] w-[96px] sm:h-[90px] sm:w-[130px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-md font-bold leading-snug text-white line-clamp-3 group-hover:text-white/80 transition-colors">{item.title}</h3>
                <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
                  <span className={`text-2xs font-semibold uppercase tracking-wide ${getNewsCatColor(item.category)}`}>{item.category}</span>
                  <span className="mx-1.5 text-gray-700">·</span>
                  {item.source}
                  <span className="mx-1.5 text-gray-700">·</span>
                  {timeAgo(item.date)}
                </Text>
                {chips && chips.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {chips.map(chip => (
                      <span key={chip.label} className="inline-flex items-center gap-1 border border-white/[0.12] bg-white/[0.04] px-1.5 py-px text-2xs text-gray-400 tabular-nums">
                        {chip.label} <span className={`font-semibold ${CHIP_STYLE[chip.dir]}`}>{chip.pct}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: TRENDING
───────────────────────────────────────────────────────────────────────────── */




/* ─────────────────────────────────────────────────────────────────────────────
   CURRENCY CONVERTER
───────────────────────────────────────────────────────────────────────────── */

const FX_RATES = [
  { pair: 'USD / LRD', rate: '192.50', change: '+1.25', up: true,  note: 'Dollar strengthening on diaspora inflows' },
  { pair: 'EUR / LRD', rate: '209.85', change: '-0.92', up: false, note: 'Euro softens on ECB rate signals' },
  { pair: 'GBP / LRD', rate: '243.15', change: '+2.10', up: true,  note: 'Sterling up on UK trade data' },
  { pair: 'NGN / LRD', rate: '0.124',  change: '+0.002', up: true, note: 'Naira holds steady this week' },
];

function ForexWidget() {
  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Exchange rates</h2>
        <Link href="/markets" className="text-2xs text-gray-500 hover:text-brand-accent transition-colors no-underline tabular-nums">Converter ›</Link>
      </div>
      <Text variant="meta" className="text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">Indicative mid · LRD</Text>
      <div className="divide-y divide-white/[0.04]">
        {FX_RATES.map(r => (
          <Link key={r.pair} href="/markets" className="flex items-start gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/85 group-hover:text-white/80 transition-colors tabular-nums">{r.pair}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-base font-bold text-white tabular-nums">{r.rate}</div>
              <div className={`text-xs font-semibold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.change}</div>
            </div>
          </Link>
        ))}
      </div>
      <Text variant="caption" className="mt-3 leading-relaxed">
        Source: CBL reference rate, Apr 3 2026 · 15:00 GMT. Change vs prior session.
      </Text>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMMODITIES
───────────────────────────────────────────────────────────────────────────── */

const COMMODITIES_WITH_CONTEXT = [
  { name: 'Rubber',   unit: 'USD/kg', price: '1.72',     pct: '+2.38%', up: true,  note: 'Decade high on Firestone output surge' },
  { name: 'Iron Ore', unit: 'USD/t',  price: '108.50',   pct: '-2.08%', up: false, note: 'Weak China demand weighs on prices' },
  { name: 'Gold',     unit: 'USD/oz', price: '2,285.40', pct: '+0.82%', up: true,  note: 'Safe-haven demand on global uncertainty' },
  { name: 'Palm Oil', unit: 'USD/t',  price: '865.00',   pct: '-1.42%', up: false, note: 'Supply recovery from SE Asia' },
  { name: 'Cocoa',    unit: 'USD/t',  price: '4,820.00', pct: '+1.79%', up: true,  note: 'West Africa crop concerns persist' },
];

function CommoditiesWidget() {
  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Commodities</h2>
        <Link href="/news?q=Commodities" className="text-2xs text-gray-500 hover:text-brand-accent transition-colors no-underline tabular-nums">All ›</Link>
      </div>
      <Text variant="meta" className="text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">Exports that move Liberia&rsquo;s books</Text>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES_WITH_CONTEXT.map(c => (
          <Link key={c.name} href={`/news?q=${encodeURIComponent(c.name)}`} className="flex items-start gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/85 group-hover:text-white/80 transition-colors">{c.name} <span className="text-2xs font-normal text-gray-500">{c.unit}</span></div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{c.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-base font-bold text-white tabular-nums">${c.price}</div>
              <div className={`text-xs font-semibold tabular-nums ${c.up ? 'text-emerald-400' : 'text-red-400'}`}>{c.pct}</div>
            </div>
          </Link>
        ))}
      </div>
      <Text variant="caption" className="mt-3 leading-relaxed">
        Prices: LME / SGX / ICE close, Apr 2 2026. Not a dealing rate. Change vs prior close.
      </Text>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS
───────────────────────────────────────────────────────────────────────────── */

function EconomicWidget() {
  type EconDir = 'up' | 'down' | 'flat';
  const rows: { label: string; value: string; pct: string; dir: EconDir; note: string; asOf: string }[] = [
    { label: 'GDP, 2025',        value: '$4.33B',  pct: '+4.3% y/y',    dir: 'up',   note: 'Fastest growth since 2018',        asOf: 'WB, Mar' },
    { label: 'Headline CPI',     value: '10.2%',   pct: '-0.8 pp m/m',  dir: 'up',   note: 'Still above CBL 8% target band',   asOf: 'LISGIS, Mar' },
    { label: 'CBL policy rate',  value: '16.25%',  pct: 'unchanged',    dir: 'flat', note: 'Held with cautious tightening bias', asOf: 'CBL, Apr 27' },
    { label: 'Unemployment',     value: '3.6%',    pct: '-0.2 pp q/q',  dir: 'up',   note: 'Mining and construction hiring up', asOf: 'LISGIS, Q4&rsquo;25' },
    { label: 'Trade balance',    value: '-$0.82B', pct: '-$0.09B y/y',  dir: 'up',   note: 'Exports outpacing imports',        asOf: 'CBL, Feb' },
    { label: 'Public debt / GDP',value: '55.4%',   pct: '+2.2 pp y/y',  dir: 'down', note: 'IMF urges fiscal consolidation',   asOf: 'IMF Art IV' },
  ];
  const style: Record<EconDir, string> = { up: 'text-emerald-400', down: 'text-red-400', flat: 'text-gray-400' };
  return (
    <div>
      <div className="flex items-end justify-between mb-1">
        <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Liberia at a glance</h2>
        <Link href="/economy" className="text-2xs text-gray-500 hover:text-brand-accent transition-colors no-underline tabular-nums">All ›</Link>
      </div>
      <Text variant="meta" className="text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">Six indicators, six sources</Text>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <Link key={r.label} href="/economy" className="flex items-start gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white/85 group-hover:text-white/80 transition-colors">{r.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.note}</div>
              <div className="text-2xs text-gray-600 mt-0.5 tabular-nums">{r.asOf}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="tabular-nums text-base font-bold text-white">{r.value}</div>
              <div className={`tabular-nums text-xs font-semibold ${style[r.dir]}`}>{r.pct}</div>
            </div>
          </Link>
        ))}
      </div>
      <Text variant="caption" className="mt-3 leading-relaxed">
        Arrows reflect direction of policy/welfare improvement, not simple +/&minus;. Lower inflation &amp; unemployment = up.
      </Text>
    </div>
  );
}

/* Videos section moved to @/components/VideosSection (client island) */

/* ─────────────────────────────────────────────────────────────────────────────
   DEEP READS (center column filler)
───────────────────────────────────────────────────────────────────────────── */

const DEEP_READS_IDS = ['4', '11', '35', '15', '27', '8', '6', '14', '18', '20'];

const MOST_READ_IDS = ['1', '3', '5', '16', '11'];

const UPCOMING_EVENTS = [
  { date: 'Apr 7', label: 'CBL Monetary Policy Meeting', type: 'Policy' },
  { date: 'Apr 10', label: 'Q1 GDP Advance Estimate — Ministry of Finance', type: 'Economy' },
  { date: 'Apr 14', label: 'Liberia Investment Forum — Monrovia', type: 'Trade' },
  { date: 'Apr 18', label: 'World Bank Liberia Country Dialogue', type: 'Development' },
  { date: 'Apr 25', label: 'ECOWAS Finance Ministers Summit', type: 'Trade' },
];

function DeepReadsColumn() {
  const [lead, ...rest] = newsFeed(DEEP_READS_IDS);
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
      <Link href={`/news/${lead.id}`} className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.category} className="w-full h-[180px]" />
        </div>
        <div className={`text-2xs font-bold uppercase tracking-wide ${getNewsCatColor(lead.category)} mb-1.5`}>{lead.category}</div>
        <h3 className="text-sm font-bold leading-snug text-white group-hover:text-white/80 transition-colors">{lead.title}</h3>
        <div className="mt-2 text-xs text-gray-500">{lead.source} · {timeAgo(lead.date)}</div>
      </Link>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rest.map(item => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-3">{item.title}</h3>
              <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
                <span className={`text-2xs font-semibold uppercase tracking-wide ${getNewsCatColor(item.category)}`}>{item.category}</span>
                <span className="mx-1.5 text-gray-700">·</span>
                {item.source}
                <span className="mx-1.5 text-gray-700">·</span>
                {timeAgo(item.date)}
              </Text>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg">
              <NewsThumbnail category={item.category} className="h-[64px] w-[96px] sm:h-[80px] sm:w-[120px]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MORE NEWS (left column filler)
───────────────────────────────────────────────────────────────────────────── */

function MoreNewsColumn() {
  const items = newsFeed(MORE_NEWS_IDS);
  return (
    <div className="flex flex-col divide-y divide-white/[0.05]">
      {items.map(item => (
        <Link key={item.id} href={`/news/${item.id}`} className="group flex items-start gap-3 sm:gap-4 py-4 first:pt-0 no-underline">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-md font-bold leading-snug text-white group-hover:text-white/80 transition-colors line-clamp-3">{item.title}</h3>
            <Text variant="meta" className="mt-2 leading-relaxed text-gray-500">
              <span className={`text-2xs font-semibold uppercase tracking-wide ${getNewsCatColor(item.category)}`}>{item.category}</span>
              <span className="mx-1.5 text-gray-700">·</span>
              {item.source}
              <span className="mx-1.5 text-gray-700">·</span>
              {timeAgo(item.date)}
            </Text>
          </div>
          <div className="shrink-0 overflow-hidden rounded-lg">
            <NewsThumbnail category={item.category} className="h-[64px] w-[96px] sm:h-[80px] sm:w-[120px]" />
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR: LATEST + IN FOCUS
───────────────────────────────────────────────────────────────────────────── */

const SIDEBAR_LATEST_IDS = ['1', '3', '16', '5', '12', '11', '8', '7'];

type SignalDir = 'up' | 'down' | 'flat';
const TODAYS_SIGNAL: { label: string; value: string; delta: string; dir: SignalDir; source: string; href: string }[] = [
  { label: 'Iron ore, 62% Fe',    value: '$108.50 /t',  delta: '-2.08% today',  dir: 'down', source: 'SGX',   href: '/news?q=Iron%20Ore' },
  { label: 'LRD / USD mid',        value: '192.50',      delta: '+0.65% today',  dir: 'up',   source: 'CBL',   href: '/markets' },
  { label: 'Rubber, RSS3',         value: '$1.72 /kg',   delta: '+2.38% today',  dir: 'up',   source: 'SICOM', href: '/news?q=Rubber' },
  { label: 'CBL policy rate',      value: '16.25%',      delta: 'unchanged · Apr 27', dir: 'flat', source: 'CBL',   href: '/economy' },
  { label: 'Brent crude',          value: '$84.20 /bbl', delta: '-0.4% today',   dir: 'down', source: 'ICE',   href: '/news?q=Brent' },
];

const SIGNAL_DELTA_STYLE: Record<SignalDir, string> = {
  up:   'text-emerald-400',
  down: 'text-red-400',
  flat: 'text-gray-400',
};

function LatestSidebar() {
  const items = newsFeed(SIDEBAR_LATEST_IDS);
  return (
    <div className="flex flex-col gap-6">
      {/* Today's Signal */}
      <div>
        <div className="flex items-end justify-between mb-1">
          <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Today&rsquo;s signal</h2>
          <span className="text-2xs text-gray-500 tabular-nums">Apr 3 · 18:30 GMT</span>
        </div>
        <Text variant="meta" className="text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">Five numbers we&rsquo;re watching</Text>
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {TODAYS_SIGNAL.map(s => (
            <Link key={s.label} href={s.href} className="flex items-start justify-between gap-3 py-3 first:pt-0 no-underline group">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white/85 group-hover:text-white/80 transition-colors">{s.label}</div>
                <div className={`text-xs tabular-nums ${SIGNAL_DELTA_STYLE[s.dir]}`}>{s.delta} <span className="text-gray-500">· {s.source}</span></div>
              </div>
              <div className="text-base font-bold text-white tabular-nums shrink-0">{s.value}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Exchange rates */}
      <div className="border-t border-white/[0.05] pt-5">
        <ForexWidget />
      </div>

      {/* Commodities */}
      <div className="border-t border-white/[0.05] pt-5">
        <CommoditiesWidget />
      </div>

      {/* Liberia at a glance */}
      <div className="border-t border-white/[0.05] pt-5">
        <EconomicWidget />
      </div>

      {/* Latest news list */}
      <div className="border-t border-white/[0.05] pt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Latest</h2>
          <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {items.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="block py-3 first:pt-0 no-underline group">
              <span className="text-base font-medium leading-snug text-white/80 group-hover:text-white/80 transition-colors">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Most Read — all viewports */}
      <MostReadWidget />

      {/* Upcoming Events — all viewports */}
      <UpcomingEventsWidget />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   QUICK READS
───────────────────────────────────────────────────────────────────────────── */

/** Compact age token for wire-feed style — "27 days ago" → "27d", "5h ago" → "5h", "just now" → "now" */
function compactAge(dateStr: string): string {
  return timeAgo(dateStr)
    .replace(/^just now$/, 'now')
    .replace(/\s*ago$/, '')
    .replace(/\s+days?$/, 'd')
    .replace(/\s+hours?$/, 'h')
    .replace(/\s+minutes?$/, 'm');
}

function QuickReadsColumn() {
  const items = newsFeed(QUICK_READS_IDS)
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div>
      {/* Header: kicker + title left, live "Updated" pulse right */}
      <div className="flex items-end justify-between border-b border-white/20 pb-3 mb-4">
        <div>
          <Text variant="caption" className="font-semibold uppercase tracking-[0.2em] mb-0.5">Desk notes</Text>
          <Heading level={5} className="text-white">In brief</Heading>
        </div>
        <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">More ›</Link>
      </div>

      <ol className="flex flex-col divide-y divide-white/[0.05]">
        {items.map(item => (
          <li key={item.id}>
            <Link href={`/news/${item.id}`} className="block py-2.5 first:pt-0 no-underline group">
              <h3 className="text-sm font-medium leading-snug text-white/80 group-hover:text-white/80 transition-colors line-clamp-2 text-pretty">
                <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getNewsCatColor(item.category)}`}>{item.category}</span>
                {item.title}
              </h3>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOST READ + UPCOMING EVENTS WIDGETS
───────────────────────────────────────────────────────────────────────────── */

function MostReadWidget() {
  const items = newsFeed(MOST_READ_IDS);
  return (
    <div className="border-t border-white/[0.05] pt-5">
      <div className="flex items-center justify-between mb-3">
        <Heading level={6} className="text-white uppercase tracking-[0.12em]">Most Read</Heading>
        <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-white/50 hover:text-brand-accent transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((item, i) => (
          <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <div className="min-w-0">
              <p className="text-base font-semibold leading-snug text-white/80 group-hover:text-white/80 transition-colors line-clamp-2">{item.title}</p>
              <Text variant="meta" className="mt-1">{item.source} · {timeAgo(item.date)}</Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UpcomingEventsWidget() {
  return (
    <div className="border-t border-white/[0.05] pt-5">
      <Heading level={6} className="text-white uppercase tracking-[0.12em] mb-3">Upcoming Events</Heading>
      <div className="flex flex-col gap-2.5">
        {UPCOMING_EVENTS.map((ev, i) => (
          <Link key={i} href="/economy" className="flex items-start gap-3 py-2.5 first:pt-0 no-underline group">
            <span className="shrink-0 w-[44px] text-xs font-medium text-gray-500 tabular-nums pt-px">{ev.date}</span>
            <div className="min-w-0 flex-1 border-l border-white/[0.08] pl-3">
              <p className="text-sm font-semibold leading-snug text-white/80 group-hover:text-white/80 transition-colors">{ev.label}</p>
              <span className="mt-0.5 inline-block text-2xs font-medium text-gray-500 uppercase tracking-wide">{ev.type}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE BOTTOM TICKER BAR
───────────────────────────────────────────────────────────────────────────── */



/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen">
      <IndicatorsStrip initial={SEED_INDICATORS} />

      <main className="mx-auto max-w-[1320px] px-5 py-8 pb-4 sm:pb-8">

        {/* Three-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">

          {/* LEFT: Featured video + video list — col 1-5 */}
          <div className="order-1 lg:col-span-5 flex flex-col gap-5">
            <FeaturedColumn />
            <div className="border-t border-white/[0.05] pt-5">
              <VideosSection videos={TODAYS_VIDEOS} />
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <MoreNewsColumn />
            </div>
            <div className="hidden lg:block border-t border-white/[0.05] pt-5">
              <QuickReadsColumn />
            </div>
          </div>

          {/* CENTER: News feed — col 6-9 */}
          <div className="order-2 lg:col-span-4 lg:border-l lg:border-white/[0.05] lg:pl-5 flex flex-col gap-5">
            <NewsListColumn />
            <div className="border-t border-white/[0.05] pt-5">
              <LatestColumn />
            </div>
            <div className="border-t border-white/[0.05] pt-5">
              <DeepReadsColumn />
            </div>
          </div>

          {/* RIGHT: Sidebar — col 10-12 (desktop only). Scrolls with the page, no sticky. */}
          <aside className="hidden lg:block order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5 lg:self-start">
            <LatestSidebar />
          </aside>

        </div>

        {/* ── Full-width sections below the grid ── */}


        {/* Regional Spotlight */}
        <div className="mt-14 border-t border-white/[0.05] pt-8">
          <SectionHeading kicker="West Africa" title="What's moving the region today" action="/news" actionLabel="More regional coverage" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-xl overflow-hidden">
            {[
              {
                dateline: 'ACCRA', country: 'Ghana',
                headline: "Ghana's cedi has clawed back 7.2% in three weeks. Traders credit the IMF tranche — and one quiet BoG dollar sale.",
                stat: 'GHS / USD', value: '14.82', delta: '−7.2%', note: '3-week', dir: 'down' as const,
                byline: 'Adanna Okonkwo', time: '4h ago',
                href: '/news?q=Ghana',
              },
              {
                dateline: 'LAGOS', country: 'Nigeria',
                headline: "NGX All-Share closed Q1 up 18.4% — its best quarter since 2008. Banks drove two-thirds of the gain.",
                stat: 'NGX ASI', value: '+18.4%', delta: 'Banks +24%', note: 'Q1', dir: 'up' as const,
                byline: 'Tope Akande', time: '6h ago',
                href: '/news?q=Nigeria',
              },
              {
                dateline: 'FREETOWN', country: 'Sierra Leone',
                headline: "Freetown's $80M port expansion inked with DP World. Monrovia loses its regional tranship lead by 2028.",
                stat: 'SLL / USD', value: '22,100', delta: 'Flat', note: '1-month', dir: 'flat' as const,
                byline: 'Sarah Kollie', time: '8h ago',
                href: '/news?q=Sierra%20Leone',
              },
              {
                dateline: 'ABIDJAN', country: 'Côte d\'Ivoire',
                headline: "BRVM Composite led every regional peer in Q1. Sonatel and Orange CI account for half the move.",
                stat: 'BRVM Composite', value: '+3.4%', delta: 'YTD +9.8%', note: 'Q1', dir: 'up' as const,
                byline: 'James Dweh', time: '10h ago',
                href: '/news?q=Ivory%20Coast',
              },
            ].map((r, i) => {
              const valueColor = r.dir === 'up' ? 'text-emerald-400' : r.dir === 'down' ? 'text-red-400' : 'text-gray-300';
              const deltaColor = r.dir === 'up' ? 'text-emerald-400' : r.dir === 'down' ? 'text-red-400' : 'text-gray-500';
              return (
                <Link key={i} href={r.href} className="group flex flex-col no-underline bg-brand-dark p-5 hover:bg-white/[0.025] transition-colors">
                  {/* City + country */}
                  <div className="mb-3">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">{r.dateline}</p>
                    <Text variant="caption" className="text-gray-600 uppercase tracking-wide">{r.country}</Text>
                  </div>

                  {/* Headline */}
                  <Heading level={6} as="h3" className="leading-snug text-white/90 group-hover:text-white/80 transition-colors mb-4 flex-1">{r.headline}</Heading>

                  {/* Key metric — same chip style as lead story tickers */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="inline-flex items-center gap-1.5 border border-white/[0.12] bg-white/[0.04] px-1.5 py-px text-2xs text-gray-400">
                      {r.stat}
                      <span className={`font-semibold tabular-nums ${valueColor}`}>{r.value}</span>
                    </span>
                    <span className={`inline-flex items-center border border-white/[0.08] bg-white/[0.02] px-1.5 py-px text-2xs font-semibold tabular-nums ${deltaColor}`}>
                      {r.delta}
                    </span>
                    <span className="text-2xs text-gray-600">{r.note}</span>
                  </div>

                  {/* Byline */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">By {r.byline}</span>
                    <span className="text-gray-600">{r.time}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>


      </main>

    </div>
  );
}
