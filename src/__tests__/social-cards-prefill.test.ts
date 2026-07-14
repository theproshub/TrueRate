import { describe, it, expect } from 'vitest';
import { storyEdits, rateEdits, marketEdits } from '@/app/admin/social-cards/_components/prefill';
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

  it('fills rows 2-4 from the first three priced quotes', () => {
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
});
