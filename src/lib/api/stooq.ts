/**
 * Stooq commodities client.
 * Free CSV endpoint, no API key. End-of-day prices.
 *   https://stooq.com/q/?s=<symbol>
 *   https://stooq.com/q/l/?s=<symbol>&f=sd2t2ohlcv&h&e=csv
 *
 * Returns a single most-recent OHLC row per symbol.
 */

const BASE = 'https://stooq.com/q/l/';

export interface CommodityQuote {
  /** Display name e.g. "Gold" */
  name: string;
  /** Stooq symbol e.g. "gc.f" */
  symbol: string;
  /** Display unit, e.g. "$/oz" */
  unit: string;
  /** Why a Liberia reader should care */
  note: string;
  /** Last close — null when the upstream feed is unavailable */
  price: number | null;
  /** Previous close, used to compute change */
  prevClose: number | null;
  /** Date string from upstream (YYYY-MM-DD) */
  date: string | null;
  /** Absolute change vs prev close */
  change: number | null;
  /** Percent change vs prev close */
  changePercent: number | null;
}

/** Commodities tracked on the Markets page — Liberia-relevant cuts. */
export const COMMODITIES: Array<Pick<CommodityQuote, 'name' | 'symbol' | 'unit' | 'note'>> = [
  { name: 'Gold',         symbol: 'gc.f', unit: '$/oz', note: 'CBL reserve composition; safe-haven proxy' },
  { name: 'Brent crude',  symbol: 'cb.f', unit: '$/bbl', note: 'Sets fuel pump and freight costs nationwide' },
  { name: 'Cocoa',        symbol: 'cc.f', unit: '$/t',   note: 'West Africa benchmark; affects Lofa farmgate' },
  { name: 'Coffee',       symbol: 'kc.f', unit: '¢/lb',  note: 'Lofa Robusta exporters track this weekly' },
  { name: 'Sugar',        symbol: 'sb.f', unit: '¢/lb',  note: 'Refined-sugar imports through Freeport' },
  { name: 'Iron ore (proxy: BHP)', symbol: 'bhp.us', unit: '$ ADR', note: 'Iron ore not on Stooq free; BHP tracks 62% Fe price' },
];

interface StooqRow {
  symbol: string;
  date: string | null;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}

/**
 * Stooq snapshot endpoint with `&h` returns a 2-line CSV:
 *   Symbol,Date,Time,Open,High,Low,Close,Volume
 *   GC.F,2026-04-24,23:00:00,4715.6,4757.1,4672.2,4740.9,
 * One row per symbol — no prior-session row, so we report intraday change
 * (close vs. session open) rather than vs. previous close.
 */
async function fetchStooqSnapshot(symbol: string): Promise<StooqRow | null> {
  const url = `${BASE}?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 900 }, // 15 min
      headers: {
        Accept: 'text/csv',
        // Stooq sometimes blocks default fetch UA strings
        'User-Agent': 'Mozilla/5.0 (compatible; TrueRate/1.0; +https://truerate.com)',
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return null;
    const header = lines[0].toLowerCase().split(',');
    const idx = {
      sym: header.indexOf('symbol'),
      date: header.indexOf('date'),
      open: header.indexOf('open'),
      high: header.indexOf('high'),
      low: header.indexOf('low'),
      close: header.indexOf('close'),
    };
    const cols = lines[1].split(',');
    const num = (v: string | undefined) => {
      if (!v || v === 'N/D') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    return {
      symbol: cols[idx.sym] ?? symbol,
      date: cols[idx.date] ?? null,
      open: num(cols[idx.open]),
      high: num(cols[idx.high]),
      low: num(cols[idx.low]),
      close: num(cols[idx.close]),
    };
  } catch {
    return null;
  }
}

/** Fetch quotes for every tracked commodity in parallel. */
export async function fetchCommodities(): Promise<CommodityQuote[]> {
  const results = await Promise.allSettled(
    COMMODITIES.map(async c => {
      const row = await fetchStooqSnapshot(c.symbol);
      const price = row?.close ?? null;
      const open = row?.open ?? null;
      // Intraday change = close - open (session move)
      const change = price !== null && open !== null ? price - open : null;
      const changePercent = change !== null && open ? (change / open) * 100 : null;
      return {
        ...c,
        price,
        prevClose: open, // semantically "session open" now; kept on type for layout
        date: row?.date ?? null,
        change,
        changePercent,
      } satisfies CommodityQuote;
    })
  );
  return results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...COMMODITIES[i], price: null, prevClose: null, date: null, change: null, changePercent: null }
  );
}
