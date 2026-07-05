/**
 * Yahoo Finance commodities client.
 * Free JSON chart endpoint, no API key.
 *   https://query1.finance.yahoo.com/v8/finance/chart/<symbol>?interval=1d&range=1d
 *
 * Replaces the former Stooq CSV feed, which moved its free endpoints behind an
 * anti-bot wall (the snapshot path now 404s and the bulk path serves a
 * JavaScript proof-of-work challenge) — neither is fetchable server-side.
 *
 * Returns one most-recent quote per symbol with day change vs previous close.
 */

const BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

export interface CommodityQuote {
  /** Display name e.g. "Gold" */
  name: string;
  /** Yahoo symbol e.g. "GC=F" */
  symbol: string;
  /** Display unit, e.g. "$/oz" */
  unit: string;
  /** Why a Liberia reader should care */
  note: string;
  /** Last price — null when the upstream feed is unavailable */
  price: number | null;
  /** Previous close, used to compute change */
  prevClose: number | null;
  /** Date string (YYYY-MM-DD) from the quote timestamp */
  date: string | null;
  /** Absolute change vs prev close */
  change: number | null;
  /** Percent change vs prev close */
  changePercent: number | null;
}

/** Commodities tracked on the Markets page — Liberia-relevant cuts. */
export const COMMODITIES: Array<Pick<CommodityQuote, 'name' | 'symbol' | 'unit' | 'note'>> = [
  { name: 'Gold',         symbol: 'GC=F', unit: '$/oz', note: 'CBL reserve composition; safe-haven proxy' },
  { name: 'Brent crude',  symbol: 'BZ=F', unit: '$/bbl', note: 'Sets fuel pump and freight costs nationwide' },
  { name: 'Cocoa',        symbol: 'CC=F', unit: '$/t',   note: 'West Africa benchmark; affects Lofa farmgate' },
  { name: 'Coffee',       symbol: 'KC=F', unit: '¢/lb',  note: 'Lofa Robusta exporters track this weekly' },
  { name: 'Sugar',        symbol: 'SB=F', unit: '¢/lb',  note: 'Refined-sugar imports through Freeport' },
  { name: 'Iron ore (proxy: BHP)', symbol: 'BHP', unit: '$ ADR', note: 'Iron ore not on the free feed; BHP tracks 62% Fe price' },
];

interface ChartMeta {
  regularMarketPrice?: number;
  chartPreviousClose?: number;
  previousClose?: number;
  regularMarketTime?: number;
}

/**
 * Yahoo chart endpoint returns JSON whose `meta` block carries the latest price
 * and the prior session's close — enough for a one-row daily quote without
 * walking the candle series.
 */
async function fetchYahooQuote(symbol: string): Promise<{
  price: number | null;
  prevClose: number | null;
  date: string | null;
} | null> {
  const url = `${BASE}${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 900 }, // 15 min
      headers: {
        Accept: 'application/json',
        // Yahoo blocks default fetch UA strings.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      signal: AbortSignal.timeout(5000), // don't let a hung upstream stall the function
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      chart?: { result?: Array<{ meta?: ChartMeta }>; error?: unknown };
    };
    const meta = json.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
    const price = num(meta.regularMarketPrice);
    const prevClose = num(meta.chartPreviousClose) ?? num(meta.previousClose);
    const date =
      typeof meta.regularMarketTime === 'number'
        ? new Date(meta.regularMarketTime * 1000).toISOString().slice(0, 10)
        : null;

    return { price, prevClose, date };
  } catch {
    return null;
  }
}

/** Fetch quotes for every tracked commodity in parallel. */
export async function fetchCommodities(): Promise<CommodityQuote[]> {
  const results = await Promise.allSettled(
    COMMODITIES.map(async c => {
      const row = await fetchYahooQuote(c.symbol);
      const price = row?.price ?? null;
      const prevClose = row?.prevClose ?? null;
      // Day change = last price - previous close.
      const change = price !== null && prevClose !== null ? price - prevClose : null;
      const changePercent = change !== null && prevClose ? (change / prevClose) * 100 : null;
      return {
        ...c,
        price,
        prevClose,
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
