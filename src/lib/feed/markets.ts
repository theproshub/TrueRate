import { fetchLiveRates } from '@/lib/api/exchange';
import type { MarketsTicker } from './schemas';

/**
 * Assemble a real markets snapshot. NEVER fabricates prices — every value
 * comes from a live source, and any ticker whose source fails is omitted
 * rather than invented.
 *
 * Sources:
 *  - Yahoo Finance chart API (free, no key) → indices, commodities, crypto,
 *    major FX, African index — real price + 7-day sparkline.
 *  - exchange API (fawazahmed0, already in the repo) → USD/LRD spot, which
 *    Yahoo does not cover. Real spot, no sparkline.
 */

const YAHOO_TARGETS: Array<{ symbol: string; name: string; assetClass: MarketsTicker['assetClass'] }> = [
  { symbol: '^GSPC',     name: 'S&P 500',       assetClass: 'index' },
  { symbol: 'GC=F',      name: 'Gold (oz)',     assetClass: 'commodity' },
  { symbol: 'BTC-USD',   name: 'Bitcoin',       assetClass: 'crypto' },
  { symbol: 'USDNGN=X',  name: 'US Dollar / Naira', assetClass: 'forex' },
  { symbol: '^DJI',      name: 'Dow Jones',     assetClass: 'index' },
  { symbol: 'CL=F',      name: 'WTI Crude',     assetClass: 'commodity' },
  { symbol: 'ETH-USD',   name: 'Ethereum',      assetClass: 'crypto' },
  { symbol: '^J203.JO',  name: 'JSE All Share', assetClass: 'index' }, // African market
];

interface YahooChartResult {
  meta?: { regularMarketPrice?: number; chartPreviousClose?: number };
  indicators?: { quote?: Array<{ close?: Array<number | null> }> };
}

async function fetchYahooTicker(
  symbol: string,
  name: string,
  assetClass: MarketsTicker['assetClass'],
): Promise<MarketsTicker | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (TrueRate/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { chart?: { result?: YahooChartResult[] } };
    const result = json.chart?.result?.[0];
    if (!result?.meta) return null;

    const price = result.meta.regularMarketPrice;
    if (typeof price !== 'number' || !Number.isFinite(price)) return null;

    const closes = (result.indicators?.quote?.[0]?.close ?? []).filter(
      (c): c is number => typeof c === 'number' && Number.isFinite(c),
    );
    const prevClose =
      result.meta.chartPreviousClose ?? (closes.length >= 2 ? closes[closes.length - 2] : null);

    const change = prevClose != null ? Number((price - prevClose).toFixed(4)) : null;
    const changePct =
      prevClose != null && prevClose !== 0 ? Number((((price - prevClose) / prevClose) * 100).toFixed(2)) : null;

    return {
      symbol,
      name,
      assetClass,
      price: Number(price.toFixed(4)),
      change,
      changePct,
      sparkline: closes.slice(-7),
    };
  } catch {
    return null;
  }
}

async function fetchLrdSpot(): Promise<MarketsTicker | null> {
  try {
    const live = await fetchLiveRates();
    const rate = live.rates.lrd;
    if (typeof rate !== 'number' || !Number.isFinite(rate)) return null;
    return {
      symbol: 'USD/LRD',
      name: 'US Dollar / Liberian Dollar',
      assetClass: 'forex',
      price: Number(rate.toFixed(4)),
      change: null,
      changePct: null,
      sparkline: [],
    };
  } catch {
    return null;
  }
}

export async function buildMarketsSnapshot(): Promise<MarketsTicker[]> {
  // USD/LRD first (TrueRate's core pair), then live cross-asset rows.
  const [lrd, ...yahoo] = await Promise.all([
    fetchLrdSpot(),
    ...YAHOO_TARGETS.map((t) => fetchYahooTicker(t.symbol, t.name, t.assetClass)),
  ]);

  const tickers = [lrd, ...yahoo].filter((t): t is MarketsTicker => t !== null);
  return tickers.slice(0, 6);
}
