import Link from 'next/link';
import { newsItems } from '@/data/news';
import { getCatColor } from '@/lib/category-colors';
import { getNews, newsFeed, timeAgo } from '@/lib/utils';
import IndicatorsStrip from '@/components/IndicatorsStrip';
import VideosSection from '@/components/VideosSection';
import { NewsThumbnail, HeroVisual as SharedHeroVisual } from '@/components/NewsThumbnail';
import { SEED_INDICATORS } from '@/data/ticker-seed';
import { TODAYS_VIDEOS } from '@/data/todays-videos';

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */

/** Homepage hero size wrapper around shared HeroVisual */
function HeroVisual({ category }: { category: string }) {
  return <SharedHeroVisual category={category} className="h-[200px] sm:h-[260px]" />;
}
type Chip = { label: string; pct: string; up: boolean };

const LATEST_NEWS_IDS: { id: string; chips?: Chip[] }[] = [
  { id: '1',  chips: [{ label: 'CBL Rate', pct: 'Steady', up: true }, { label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { id: '30', chips: [{ label: 'Energy', pct: '+12%', up: true }] },
  { id: '3',  chips: [{ label: 'Iron Ore', pct: '-2.08%', up: false }, { label: 'Gold', pct: '+0.82%', up: true }] },
  { id: '16' },
  { id: '12', chips: [{ label: 'Ecobank', pct: '+3.1%', up: true }] },
  { id: '11', chips: [{ label: 'LRD/USD', pct: '+0.65%', up: true }] },
  { id: '5',  chips: [{ label: 'Rubber', pct: '+2.38%', up: true }] },
  { id: '8' },
];

const MORE_NEWS_IDS = ['33', '9', '10', '7', '29', '22', '13', '31'];

const QUICK_READS_IDS = ['2', '35', '12', '26', '30', '32'];

/* ─────────────────────────────────────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────────────────────────────────────── */


function SectionHeading({ title, action, actionLabel = 'View all' }: { title: string; action?: string; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
        <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">{title}</h2>
      </div>
      {action && <a href={action} className="text-[12px] font-medium text-gray-400 hover:text-white transition-colors no-underline">{actionLabel} ›</a>}
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED ARTICLE
───────────────────────────────────────────────────────────────────────────── */

function FeaturedColumn() {
  const featured = newsItems[0];
  const subs = [newsItems[1], newsItems[2], newsItems[3], newsItems[4]];

  return (
    <div className="flex flex-col gap-0">

      {/* ── Cover Story Hero ── */}
      <Link href={`/news/${featured.id}`} className="group block no-underline">
        {/* Visual */}
        <div className="overflow-hidden -mx-2 sm:mx-0 rounded-none sm:rounded-xl mb-4">
          <HeroVisual category={featured.category} />
        </div>

        {/* Kicker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-[#050d11]">
            Cover Story
          </span>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${getCatColor(featured.category)}`}>
            {featured.category}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-[22px] sm:text-[26px] font-black leading-tight text-white group-hover:text-white/80 transition-colors mb-2.5 tracking-tight">
          {featured.title}
        </h2>

        {/* Deck */}
        <p className="font-montserrat line-clamp-3 text-[14px] leading-relaxed text-gray-400 mb-3">
          {featured.summary}
        </p>

        {/* Byline */}
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <span className="font-semibold text-gray-400">{featured.source}</span>
          <span>·</span>
          <span>{timeAgo(featured.date)}</span>
          <span>·</span>
          <span>8 min read</span>
        </div>
      </Link>

      {/* ── Sub-stories grid ── */}
      <div className="mt-6 border-t border-white/[0.06] pt-5 flex flex-col divide-y divide-white/[0.06]">
        {subs.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
            <div className="shrink-0 overflow-hidden rounded-lg">
              <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1 block`}>
                {item.category}
              </span>
              <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3">
                {item.title}
              </h3>
              <div className="mt-1.5 text-[11px] text-gray-500">{item.source} · {timeAgo(item.date)}</div>
            </div>
          </Link>
        ))}
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
        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
          <div className="overflow-hidden rounded-xl shrink-0">
            <NewsThumbnail category={item.category} className="h-[72px] w-[108px] sm:h-[90px] sm:w-[130px]" />
          </div>
          <div className="min-w-0 flex-1">
            {item.category && <p className={`mb-1 text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</p>}
            <h3 className="line-clamp-3 text-[14px] font-bold leading-snug text-white group-hover:text-white/70 transition-colors">{item.title}</h3>
            <p className="mt-1 text-[12px] text-gray-500">{item.source} · {timeAgo(item.date)}</p>
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
    <div>
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Latest</h2>
        </div>
      </div>

      {/* Large-card style — all viewports */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {LATEST_NEWS_IDS.map(({ id, chips }) => {
          const item = getNews(id);
          if (!item) return null;
          return (
            <Link key={id} href={`/news/${item.id}`} className="flex gap-3.5 py-4 first:pt-0 no-underline group">
              <div className="shrink-0 overflow-hidden rounded-xl">
                <NewsThumbnail category={item.category} className="h-[72px] w-[108px] sm:h-[90px] sm:w-[130px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-bold leading-snug text-white line-clamp-3 group-hover:text-white/80 transition-colors">{item.title}</h3>
                <p className="mt-1 text-[12px] text-gray-500">{item.source} · {timeAgo(item.date)}</p>
                {chips && chips.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {chips.map(chip => (
                      <span key={chip.label} className="text-[11px] text-gray-400">
                        {chip.label} <span className={chip.up ? 'text-emerald-400' : 'text-red-400'}>{chip.pct}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
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
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-0">
        <div>
          <h2 className="text-[13px] font-bold text-white">Exchange Rates</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">LRD · CBL · Apr 3, 2026</p>
        </div>
        <Link href="/forex" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">Converter ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {FX_RATES.map(r => (
          <Link key={r.pair} href="/forex" className="flex items-start gap-3 py-3.5 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white tabular-nums">{r.pair}</div>
              <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[14px] font-bold text-white tabular-nums">{r.rate}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.up ? '+' : ''}{r.change}</div>
            </div>
          </Link>
        ))}
      </div>
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
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-0">
        <div>
          <h2 className="text-[13px] font-bold text-white">Commodities</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Liberia-relevant · Apr 3, 2026</p>
        </div>
        <Link href="/news?q=Commodities" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">All ›</Link>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {COMMODITIES_WITH_CONTEXT.map(c => (
          <Link key={c.name} href={`/news?q=${encodeURIComponent(c.name)}`} className="flex items-start gap-3 py-3.5 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white">{c.name} <span className="text-[11px] font-normal text-gray-400">{c.unit}</span></div>
              <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{c.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[13px] font-bold text-white tabular-nums">${c.price}</div>
              <div className={`text-[12px] font-semibold tabular-nums ${c.up ? 'text-emerald-400' : 'text-red-400'}`}>{c.pct}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECONOMIC INDICATORS
───────────────────────────────────────────────────────────────────────────── */

function EconomicWidget() {
  const rows = [
    { label: 'GDP',           value: '$4.33B',  pct: '+4.34%', up: true,  note: 'Fastest growth in 5 years' },
    { label: 'Inflation',     value: '10.2%',   pct: '-0.8pp', up: true,  note: 'Declining — CBL target is 8%' },
    { label: 'CBL Rate',      value: '17.50%',  pct: 'Steady', up: true,  note: 'Held for 3rd consecutive quarter' },
    { label: 'Unemployment',  value: '3.6%',    pct: '-0.2pp', up: true,  note: 'Mining & construction hiring up' },
    { label: 'Trade Balance', value: '-$0.82B', pct: 'Improving', up: true, note: 'Export growth outpacing imports' },
    { label: 'Debt / GDP',    value: '55.4%',   pct: '+2.2pp', up: false, note: 'IMF urges fiscal discipline' },
  ];
  return (
    <div>
      <div className="border-b border-white/[0.07] pb-3 mb-0">
        <h2 className="text-[13px] font-bold text-white">Liberia at a Glance</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">Key indicators · CBL, World Bank, IMF</p>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {rows.map(r => (
          <Link key={r.label} href="/economy" className="flex items-start gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white">{r.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{r.note}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="tabular-nums text-[13px] font-bold text-white">{r.value}</div>
              <div className={`tabular-nums text-[12px] font-semibold ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.pct}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* Videos section moved to @/components/VideosSection (client island) */

/* ─────────────────────────────────────────────────────────────────────────────
   DEEP READS (center column filler)
───────────────────────────────────────────────────────────────────────────── */

const DEEP_READS_IDS = ['4', '11', '35', '15', '27', '8'];

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
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">In Depth</h2>
        <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">More ›</Link>
      </div>
      <Link href={`/news/${lead.id}`} className="group block no-underline mb-5">
        <div className="overflow-hidden rounded-xl mb-3">
          <NewsThumbnail category={lead.category} className="w-full h-[180px]" />
        </div>
        <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(lead.category)} mb-1.5`}>{lead.category}</div>
        <h3 className="text-[15px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-2">{lead.title}</h3>
        <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-3">{lead.summary}</p>
        <div className="mt-2 text-[11px] text-gray-500">{lead.source} · {timeAgo(lead.date)}</div>
      </Link>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {rest.map(item => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
            <div className="min-w-0 flex-1">
              <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1`}>{item.category}</div>
              <h3 className="text-[13px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
              <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
              <div className="mt-1.5 text-[11px] text-gray-500">{item.source} · {timeAgo(item.date)}</div>
            </div>
            <div className="shrink-0 overflow-hidden rounded-lg">
              <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
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
        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <div className="min-w-0 flex-1">
            <div className={`text-[11px] font-bold uppercase tracking-wide ${getCatColor(item.category)} mb-1`}>{item.category}</div>
            <h3 className="text-[14px] font-bold leading-snug text-white group-hover:text-white/80 transition-colors mb-1.5">{item.title}</h3>
            <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{item.summary}</p>
            <div className="mt-2 text-[11px] text-gray-500">{item.source} · {timeAgo(item.date)}</div>
          </div>
          <div className="shrink-0 overflow-hidden rounded-lg">
            <NewsThumbnail category={item.category} className="h-[72px] w-[108px]" />
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

const IN_FOCUS_TOPICS = [
  'Iron Ore', 'LRD/USD', 'Rubber Prices', 'CBL Rate',
  'ECOWAS Trade', 'Liberia GDP', 'Mining Policy', 'Remittances',
];

function LatestSidebar() {
  const items = newsFeed(SIDEBAR_LATEST_IDS);
  return (
    <div className="flex flex-col gap-6">
      {/* Latest news list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[12px] font-bold text-white uppercase tracking-[0.12em]">Latest</h2>
          <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">See all latest ›</Link>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.05]">
          {items.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="flex gap-3 py-3 first:pt-0 no-underline group">
              <span className="shrink-0 tabular-nums text-[12px] text-gray-400 w-10 pt-0.5">{timeAgo(item.date)}</span>
              <span className="text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* In Focus */}
      <div className="border-t border-white/[0.05] pt-5">
        <h2 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] mb-3">In Focus</h2>
        <div className="flex flex-wrap gap-2">
          {IN_FOCUS_TOPICS.map(t => (
            <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Data widgets below — desktop sidebar only */}
      <div className="hidden lg:flex flex-col gap-5 border-t border-white/[0.05] pt-5">
        <ForexWidget />
        <CommoditiesWidget />
        <EconomicWidget />
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

function QuickReadsColumn() {
  const items = newsFeed(QUICK_READS_IDS);
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">In Brief</h2>
        <Link href="/news" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors no-underline">More ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map(item => (
          <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3 py-3.5 first:pt-0 no-underline group">
            <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] ${getCatColor(item.category)}`}>
              {item.category}
            </span>
            <span className="flex-1 text-[13px] font-medium leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">
              {item.title}
            </span>
            <span className="shrink-0 tabular-nums text-[11px] text-gray-400 pt-0.5">{timeAgo(item.date)}</span>
          </Link>
        ))}
      </div>
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
        <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Most Read</h2>
        <Link href="/news" className="text-[12px] text-white/50 hover:text-white transition-colors no-underline">See all ›</Link>
      </div>
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {items.map((item, i) => (
          <Link key={item.id} href={`/news/${item.id}`} className="flex items-start gap-3.5 py-3 first:pt-0 no-underline group">
            <span className="shrink-0 tabular-nums text-[22px] font-black text-white/10 leading-none w-6 pt-0.5">{i + 1}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors line-clamp-2">{item.title}</p>
              <p className="mt-1 text-[11px] text-gray-400">{item.source} · {timeAgo(item.date)}</p>
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
      <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em] mb-3">Upcoming Events</h2>
      <div className="flex flex-col gap-2.5">
        {UPCOMING_EVENTS.map((ev, i) => (
          <Link key={i} href="/economy" className="flex items-start gap-3 no-underline group">
            <div className="shrink-0 rounded-lg bg-white/[0.05] border border-white/[0.06] px-2 py-1.5 text-center min-w-[46px]">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{ev.date.split(' ')[0]}</p>
              <p className="text-[15px] font-black text-white leading-none">{ev.date.split(' ')[1]}</p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-snug text-white/80 group-hover:text-white transition-colors">{ev.label}</p>
              <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/[0.06] ${getCatColor(ev.type)}`}>{ev.type}</span>
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

      <main className="mx-auto max-w-[1320px] px-5 py-8 pb-14 sm:pb-8">

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
            <div className="border-t border-white/[0.05] pt-5">
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

          {/* RIGHT: Sidebar — col 10-12 */}
          <aside className="order-3 lg:col-span-3 lg:border-l lg:border-white/[0.05] lg:pl-5 lg:self-start lg:sticky lg:top-[calc(var(--header-h,124px)+16px)] lg:max-h-[calc(100vh-var(--header-h,124px)-32px)] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <LatestSidebar />
          </aside>

        </div>

        {/* ── Full-width sections below the grid ── */}


        {/* Regional Spotlight */}
        <div className="mt-14 border-t border-white/[0.05] pt-8">
          <SectionHeading title="West Africa in Focus" action="/news" actionLabel="More regional news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { country: 'Ghana',         headline: "Ghana cedi at a six-month high — and the IMF tranche is only part of the story", stat: 'GHS/USD 14.82', time: '4h ago', cat: 'forex' },
              { country: 'Nigeria',       headline: "Nigeria's bourse just had its best month in 18 years. Here's who captured the gains.", stat: 'Brent $84.20/bbl', time: '6h ago', cat: 'commodities' },
              { country: 'Sierra Leone',  headline: "Freetown's $80M port expansion is a direct challenge to Monrovia's trade lead", stat: 'SLL/USD 22,100', time: '8h ago', cat: 'Development' },
              { country: "Côte d'Ivoire", headline: "The Abidjan bourse outperformed every regional peer in Q1. These are the stocks that led.", stat: 'BRVM Index +3.4%', time: '10h ago', cat: 'economy' },
            ].map((r, i) => (
              <Link key={i} href={`/news?q=${encodeURIComponent(r.country)}`} className="group flex flex-col no-underline border-t border-white/[0.07] pt-4 hover:border-white/20 transition-colors">
                <div className="overflow-hidden mb-3">
                  <NewsThumbnail category={r.cat} className="w-full h-[120px] rounded-lg" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-accent mb-1.5 block">{r.country}</span>
                <h3 className="text-[13px] font-semibold leading-snug text-white group-hover:text-white/70 transition-colors mb-2">{r.headline}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-bold text-white/40 tabular-nums">{r.stat}</span>
                  <span className="text-[11px] text-gray-500">{r.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>


        {/* Trending Topics */}
        <div className="mt-14 border-t border-white/[0.05] pt-8 pb-4">
          <div className="flex items-center gap-3 border-b border-white/[0.07] pb-3 mb-4">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Iron Ore', 'LRD/USD', 'CBL Rate', 'Rubber Prices', 'ECOWAS Trade', 'Liberia GDP', 'Diaspora Remittances', 'Mining Policy', 'Inflation', 'Gold Prices', 'Firestone', 'ArcelorMittal', 'World Bank', 'IMF Program', 'Port of Monrovia', 'Ecobank', 'Mobile Money'].map(t => (
              <Link key={t} href={`/news?q=${encodeURIComponent(t)}`} className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">{t}</Link>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
