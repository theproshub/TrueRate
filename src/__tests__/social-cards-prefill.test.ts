import { describe, it, expect } from 'vitest';
import { storyEdits, rateEdits, marketEdits, marketsPrefillReady, statEdits, calendarEventEdits } from '@/app/admin/social-cards/_components/prefill';
import type { CommodityQuote } from '@/domain/markets/commodities';

describe('storyEdits', () => {
  it('maps title, category, summary, and image to card fields', () => {
    const e = storyEdits({
      slug: 'vat-overhaul', title: 'VAT Set to Replace GST', summary: 'Big change.',
      category: 'policy', source: 'TrueRate', image: 'https://x/hero.webp',
    });
    expect(e.headline).toBe('VAT Set to Replace GST');
    expect(e.articleTitle).toBe('VAT Set to Replace GST');
    expect(e.coverTitle).toBe('VAT Set to Replace GST');
    expect(e.explainerHook).toBe('VAT Set to Replace GST');   // explainer sourced from the real article
    expect(e.storyHook).toBe('VAT Set to Replace GST');       // story hook too
    expect(e.explainerTitle).toBe('');                        // stale subhead cleared
    expect(e.category).toBe('Economy');          // policy → Economy via TR_CAT_MAP
    expect(e.subtext).toBe('Big change.');
    expect(e.articleExcerpt).toBe('Big change.');
    expect(e.breakingImage).toBe('https://x/hero.webp');
    expect(e.articleImage).toBe('https://x/hero.webp');
    expect(e.coverImage).toBe('https://x/hero.webp');
  });

  it('defaults unknown categories to News and omits image keys when absent', () => {
    const e = storyEdits({ slug: 's', title: 'T', summary: '', category: 'weird', source: 'TrueRate' });
    expect(e.category).toBe('News');
    expect('breakingImage' in e).toBe(false);
    expect('subtext' in e).toBe(false);
  });
});

describe('rateEdits', () => {
  it('fills value and dates from the USD lookup, leaves change/buy/sell alone', () => {
    const e = rateEdits({ LRD: 1, USD: 183.9312 }, 'Jul 14, 2026');
    expect(e.rateValue).toBe('183.93');
    expect(e.rateDate).toBe('Jul 14, 2026');
    expect(e.market1Label).toBe('LRD / USD');
    expect(e.market1Value).toBe('183.93');
    expect('rateChange' in e).toBe(false);
    expect('rateBuy' in e).toBe(false);
  });

  it('returns {} when USD is missing (stale/failed feed — no fabricated data)', () => {
    expect(rateEdits({ LRD: 1 }, 'Jul 14, 2026')).toEqual({});
  });
});

describe('marketEdits', () => {
  const q = (name: string, unit: string, price: number | null, changePercent: number | null): CommodityQuote =>
    ({ name, symbol: 'X', unit, note: '', price, prevClose: null, date: null, change: null, changePercent });

  it('fills rows 2-4 from the first three fully-live quotes (price and changePercent both finite)', () => {
    const e = marketEdits({ LRD: 1, USD: 183.93 }, [
      q('Gold', '$/oz', 2285.4, 0.82),
      q('Brent crude', '$/bbl', null, null),      // skipped: no price
      q('Cocoa', '$/t', 8123, -1.2),
      q('Coffee', '¢/lb', 301.5, 0),
    ], 'Jul 14, 2026 · Close');
    expect(e.marketDate).toBe('Jul 14, 2026 · Close');
    expect(e.market2Label).toBe('Gold ($/oz)');
    expect(e.market2Value).toBe('2,285.40');
    expect(e.market2Change).toBe('0.82%');
    expect(e.market2Up).toBe(true);
    expect(e.market3Label).toBe('Cocoa ($/t)');
    expect(e.market3Up).toBe(false);
    expect(e.market4Label).toBe('Coffee (¢/lb)');
    expect(e.market4Up).toBe(true);               // 0 counts as up (flat)
  });

  it('excludes a priced quote whose changePercent is null (never mixes live price with seed change)', () => {
    const e = marketEdits({ LRD: 1, USD: 183.93 }, [
      q('Gold', '$/oz', 2285.4, null),             // priced but no change — excluded
      q('Cocoa', '$/t', 8123, -1.2),
      q('Coffee', '¢/lb', 301.5, 0),
      q('Palm oil', '$/t', 950.2, 1.1),
    ], 'Jul 14, 2026 · Close');
    expect(e.market2Label).toBe('Cocoa ($/t)');
    expect(e.market3Label).toBe('Coffee (¢/lb)');
    expect(e.market4Label).toBe('Palm oil ($/t)');
    expect('market2Label' in e && e.market2Label === 'Gold ($/oz)').toBe(false);
  });

  it('empties market1Change even when the live USD rate is applied', () => {
    const e = marketEdits({ LRD: 1, USD: 183.93 }, [
      q('Gold', '$/oz', 2285.4, 0.82),
      q('Cocoa', '$/t', 8123, -1.2),
      q('Coffee', '¢/lb', 301.5, 0),
    ], 'Jul 14, 2026 · Close');
    expect(e.market1Value).toBe('183.93');
    expect(e.market1Change).toBe('');
    expect('market1Up' in e).toBe(false);
  });
});

describe('marketsPrefillReady', () => {
  const q = (price: number | null, changePercent: number | null): CommodityQuote =>
    ({ name: 'X', symbol: 'X', unit: 'u', note: '', price, prevClose: null, date: null, change: null, changePercent });

  it('is false when fewer than 3 quotes have finite price and changePercent', () => {
    expect(marketsPrefillReady({ USD: 183.93 }, [q(1, 0.1), q(2, null), q(3, 0.3)])).toBe(false);
  });

  it('is true when at least 3 quotes have finite price and changePercent', () => {
    expect(marketsPrefillReady({ USD: 183.93 }, [q(1, 0.1), q(2, 0.2), q(3, 0.3)])).toBe(true);
  });

  it('is false when USD is missing even if commodities are sufficient', () => {
    expect(marketsPrefillReady({}, [q(1, 0.1), q(2, 0.2), q(3, 0.3)])).toBe(false);
  });
});

describe('statEdits', () => {
  const ind = {
    key: 'CBL_RATE', name: 'CBL Policy Rate', value: 16.25, previousValue: 16.5,
    change: -0.25, changePercent: -1.5152, unit: '%', period: 'Jun-26',
    source: 'Central Bank of Liberia', history: [],
  };

  it('formats the exact value with unit and builds a factual context line', () => {
    const e = statEdits(ind);
    expect(e.stat).toBe('16.25%');
    expect(e.statLabel).toBe('CBL Policy Rate, Jun-26');
    expect(e.statContext).toBe('Previous reading: 16.5%. Source: Central Bank of Liberia.');
  });

  it('omits the previous-reading sentence when previousValue is missing', () => {
    const e = statEdits({ ...ind, previousValue: null });
    expect(e.statContext).toBe('Source: Central Bank of Liberia.');
  });

  it('handles non-percent units with thousands separators', () => {
    const e = statEdits({ ...ind, name: 'Total Exports', value: 5159.74, previousValue: null, unit: 'US$M', period: 'Mar-26' });
    expect(e.stat).toBe('5,159.74 US$M');
    expect(e.statLabel).toBe('Total Exports, Mar-26');
  });
});

describe('calendarEventEdits', () => {
  it('maps the calendar event and clears unknown time/venue (no fabrication)', () => {
    const e = calendarEventEdits({
      id: 'mpc-2026-q3', date: '2026-07-15',
      title: 'CBL Monetary Policy Committee Meeting',
      body: 'Quarterly MPC decision.', category: 'monetary-policy',
      impact: 'high', source: 'Central Bank of Liberia',
    });
    expect(e.eventKind).toBe('Monetary Policy');
    expect(e.eventTitle).toBe('CBL Monetary Policy Committee Meeting');
    expect(e.eventDate).toBe('Jul 15, 2026');
    expect(e.eventTime).toBe('');
    expect(e.eventVenue).toBe('');
    expect(e.eventCTA).toBe('truerateliberia.com');
  });
});
