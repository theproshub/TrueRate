import type { CardTweaks } from './templates/types';
import type { CommodityQuote } from '@/domain/markets/commodities';
import type { NormalizedIndicator } from '@/types/indicators';
import { CATEGORY_LABELS, type EconomicEvent } from '@/data/economic-events';
import { HOOK_BANK, type HookEntry } from './hookBank';

/** slug → hook pack, so a pulled story resolves to its 1:1 article-tied hook + points. */
const HOOK_BY_SLUG: Map<string, HookEntry> = new Map(
  HOOK_BANK.flatMap((g) => g.hooks).map((h) => [h.slug, h]),
);

export interface StoryItem {
  slug: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  image?: string;
}

/** Site category slug → card chip label (from the handoff's tr_sync.jsx). */
export const TR_CAT_MAP: Record<string, string> = {
  economy: 'Economy', markets: 'Markets', business: 'Business',
  technology: 'Technology', analytics: 'Analytics', news: 'News',
  videos: 'Videos', finance: 'Markets', policy: 'Economy',
  banking: 'Banking', commodities: 'Commodities', forex: 'Forex',
  investing: 'Markets', // no dedicated chip — closest umbrella
  // Site sections that don't have a dedicated chip: analysis reads as Analytics,
  // startups group under Technology. Without these, both fell back to 'News'.
  analysis: 'Analytics', startups: 'Technology',
};

const LONG_DATE = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function storyEdits(s: StoryItem): Partial<CardTweaks> {
  // Resolve the article's 1:1 hook pack. When found, the explainer carousel is
  // seeded with the plain-language hook + the three article-specific point titles.
  const pack = HOOK_BY_SLUG.get(s.slug);
  const edits: Partial<CardTweaks> = {
    headline: s.title, articleTitle: s.title, coverTitle: s.title,
    // Explainer hook prefers the plain-language pack hook (built for a lay reader);
    // fall back to the headline when the article has no pack. Story template keeps
    // the headline. explainerTitle cleared so no stale default subhead lingers.
    explainerHook: pack ? pack.hook : s.title, storyHook: s.title, explainerTitle: '',
    // Point slides: seed the article's own three takeaways + plain-language bodies
    // when we have a pack; otherwise CLEAR them. Either way the default market-woman
    // / susu / family copy is wiped, so no two explainers share stale point text.
    ex1Title: pack ? pack.points[0] : '', ex1Body: pack ? pack.bodies[0] : '',
    ex2Title: pack ? pack.points[1] : '', ex2Body: pack ? pack.bodies[1] : '',
    ex3Title: pack ? pack.points[2] : '', ex3Body: pack ? pack.bodies[2] : '',
    category: TR_CAT_MAP[(s.category || '').toLowerCase()] || 'News',
    date: LONG_DATE.format(new Date()),
  };
  if (s.summary) { edits.subtext = s.summary; edits.articleExcerpt = s.summary; }
  if (s.image) { edits.breakingImage = s.image; edits.articleImage = s.image; edits.coverImage = s.image; }
  return edits;
}

/**
 * Daily Rate prefill from /api/rates-style lookup (LRD per 1 X).
 * Change %, bank buy/sell have no live source — left for the editor.
 * Returns {} when USD/LRD is unavailable: never seed from stale data.
 */
export function rateEdits(lookup: Record<string, number>, dateLabel: string): Partial<CardTweaks> {
  const usd = lookup.USD;
  if (typeof usd !== 'number' || !Number.isFinite(usd)) return {};
  const value = usd.toFixed(2);
  return {
    rateValue: value, rateDate: dateLabel,
    market1Label: 'LRD / USD', market1Value: value,
  };
}

const NUM = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function isFullyLive(c: CommodityQuote): boolean {
  return typeof c.price === 'number' && Number.isFinite(c.price) &&
    typeof c.changePercent === 'number' && Number.isFinite(c.changePercent);
}

/**
 * True when markets prefill can be fully live: USD rate + ≥3 quotes with finite price AND changePercent.
 */
export function marketsPrefillReady(lookup: Record<string, number>, commodities: CommodityQuote[]): boolean {
  const usd = lookup.USD;
  if (typeof usd !== 'number' || !Number.isFinite(usd)) return false;
  return commodities.filter(isFullyLive).length >= 3;
}

/** Markets card prefill: row 1 = LRD/USD, rows 2–4 = first fully-live commodities. */
export function marketEdits(
  lookup: Record<string, number>,
  commodities: CommodityQuote[],
  dateLabel: string,
): Partial<CardTweaks> {
  const edits: Partial<CardTweaks> = { marketDate: dateLabel, ...rateEdits(lookup, dateLabel) };
  delete edits.rateValue;
  delete edits.rateDate;
  // Live LRD/USD value with an emptied change cell — the editor supplies the day's change;
  // never leave the seed figure implied-live.
  edits.market1Change = '';

  const priced = commodities.filter(isFullyLive).slice(0, 3);

  priced.forEach((c, i) => {
    const n = i + 2; // rows 2..4
    (edits as Record<string, unknown>)[`market${n}Label`] = `${c.name} (${c.unit})`;
    (edits as Record<string, unknown>)[`market${n}Value`] = NUM.format(c.price as number);
    (edits as Record<string, unknown>)[`market${n}Change`] = `${Math.abs(c.changePercent as number).toFixed(2)}%`;
    (edits as Record<string, unknown>)[`market${n}Up`] = (c.changePercent as number) >= 0;
  });
  return edits;
}

/** Exact stored value with unit — "16.25%", "5,159.74 US$M". No rounding beyond storage. */
function formatIndicatorValue(value: number, unit: string): string {
  const v = value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (unit === '%') return `${v}%`;
  return unit ? `${v} ${unit}` : v;
}

/**
 * Big Stat prefill from a dashboard indicator. Context is strictly factual —
 * previous reading (when the data exists) and source, nothing editorial.
 */
export function statEdits(ind: NormalizedIndicator): Partial<CardTweaks> {
  const prev = ind.previousValue;
  const prevLine = typeof prev === 'number' && Number.isFinite(prev)
    ? `Previous reading: ${formatIndicatorValue(prev, ind.unit)}. `
    : '';
  return {
    stat: formatIndicatorValue(ind.value, ind.unit),
    statLabel: `${ind.name}, ${ind.period}`,
    statContext: `${prevLine}Source: ${ind.source}.`,
    date: LONG_DATE.format(new Date()),
  };
}

const EVENT_DATE = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * Event card prefill from the economic calendar. Time and venue are cleared —
 * the calendar doesn't know them, and stamping seed values would fabricate.
 */
export function calendarEventEdits(event: EconomicEvent): Partial<CardTweaks> {
  return {
    eventKind: CATEGORY_LABELS[event.category],
    eventTitle: event.title,
    eventDate: EVENT_DATE.format(new Date(event.date + 'T00:00:00')),
    eventTime: '',
    eventVenue: '',
    eventCTA: 'truerateliberia.com',
  };
}
