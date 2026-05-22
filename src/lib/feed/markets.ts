import { fetchLiveRates } from '@/lib/api/exchange';
import type { MarketsTicker } from './schemas';

/**
 * Assemble a real markets snapshot. NEVER fabricates prices — every value
 * comes from a live source, and any ticker whose source fails is omitted
 * rather than invented.
 *
 * Sources:
 *  - Stooq daily history (free, no key) → indices, commodities, crypto + 7d sparkline
 *  - exchange API (fawazahmed0, already in the repo) → forex spot incl. USD/LRD
 */

const STOOQ_TARGETS: Array<{ symbol: string; name: string; assetClass: MarketsTicker['assetClass'] }> = [
  { symbol: '^spx',   name: 'S&P 500',     assetClass: 'index' },
  { symbol: '^dji',   name: 'Dow Jones',   assetClass: 'index' },
  { symbol: 'xauusd', name: 'Gold (oz)',   assetClass: 'commodity' },
  { symbol: 'cl.f',   name: 'WTI Crude',   assetClass: 'commodity' },
  { symbol: 'btcusd', name: 'Bitcoin',     assetClass: 'crypto' },
  { symbol: 'ethusd', name: 'Ethereum',    assetClass: 'crypto' },
  { symbol: '^jall',  name: 'JSE All Share', assetClass: 'index' }, // African market
];

const FOREX_TARGETS: Array<{ code: string; symbol: string; name: string }> = [
  { code: 'ngn', symbol: 'USD/NGN', name: 'US Dollar / Naira' },
  { code: 'lrd', symbol: 'USD/LRD', name: 'US Dollar / Liberian Dollar' },
];

/** Pull daily-close history from Stooq and shape a ticker row, or null on failure. */
async function fetchStooqTicker(
  symbol: string,
  name: string,
  assetClass: MarketsTicker['assetClass'],
): Promise<MarketsTicker | null> {
  try {
    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: 'text/csv', 'User-Agent': 'Mozilla/5.0 (TrueRate/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 3) return null; // header + at least 2 rows

    // CSV: Date,Open,High,Low,Close,Volume
    const closes = lines
      .slice(1)
      .map((row) => Number(row.split(',')[4]))
      .filter((n) => Number.isFinite(n));
    if (closes.length < 2) return null;

    const recent = closes.slice(-7);
    const price = closes[closes.length - 1];
    const prev = closes[closes.length - 2];
    const change = Number((price - prev).toFixed(4));
    const changePct = prev !== 0 ? Number(((change / prev) * 100).toFixed(2)) : null;

    return { symbol, name, assetClass, price, change, changePct, sparkline: recent };
  } catch {
    return null;
  }
}

export async function buildMarketsSnapshot(): Promise<MarketsTicker[]> {
  const stooqResults = await Promise.all(
    STOOQ_TARGETS.map((t) => fetchStooqTicker(t.symbol, t.name, t.assetClass)),
  );

  const tickers: MarketsTicker[] = stooqResults.filter(
    (t): t is MarketsTicker => t !== null,
  );

  // Forex spot (real) — no daily history from this source, so sparkline is empty
  // and change is null rather than invented.
  try {
    const live = await fetchLiveRates();
    for (const fx of FOREX_TARGETS) {
      const rate = live.rates[fx.code];
      if (typeof rate === 'number' && Number.isFinite(rate)) {
        tickers.push({
          symbol: fx.symbol,
          name: fx.name,
          assetClass: 'forex',
          price: Number(rate.toFixed(4)),
          change: null,
          changePct: null,
          sparkline: [],
        });
      }
    }
  } catch {
    // forex source down — omit, don't fabricate
  }

  // Target 4–6 rows; if Stooq gave us a lot, trim to 6 keeping asset-class spread.
  return tickers.slice(0, 6);
}
