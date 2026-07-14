import type { CardTweaks } from './templates/types';
import type { CommodityQuote } from '@/domain/markets/commodities';

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
  banking: 'Markets', investing: 'Markets', commodities: 'Markets', forex: 'Markets',
};

const LONG_DATE = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function storyEdits(s: StoryItem): Partial<CardTweaks> {
  const edits: Partial<CardTweaks> = {
    headline: s.title, articleTitle: s.title, coverTitle: s.title,
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

/** Markets card prefill: row 1 = LRD/USD, rows 2–4 = first priced commodities. */
export function marketEdits(
  lookup: Record<string, number>,
  commodities: CommodityQuote[],
  dateLabel: string,
): Partial<CardTweaks> {
  const edits: Partial<CardTweaks> = { marketDate: dateLabel, ...rateEdits(lookup, dateLabel) };
  delete edits.rateValue;
  delete edits.rateDate;

  const priced = commodities.filter(
    (c) => typeof c.price === 'number' && Number.isFinite(c.price),
  ).slice(0, 3);

  priced.forEach((c, i) => {
    const n = i + 2; // rows 2..4
    (edits as Record<string, unknown>)[`market${n}Label`] = `${c.name} (${c.unit})`;
    (edits as Record<string, unknown>)[`market${n}Value`] = NUM.format(c.price as number);
    if (typeof c.changePercent === 'number' && Number.isFinite(c.changePercent)) {
      (edits as Record<string, unknown>)[`market${n}Change`] = `${Math.abs(c.changePercent).toFixed(2)}%`;
      (edits as Record<string, unknown>)[`market${n}Up`] = c.changePercent >= 0;
    }
  });
  return edits;
}
