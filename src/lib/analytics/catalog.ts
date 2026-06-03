/**
 * Canonical catalog of instruments the Trends & Analytics page tracks, plus the
 * region classification that drives conditional theming.
 *
 * REGION FLAG (data-model addition — see migration 009):
 *   - 'LR'     → Liberia-local. Rendered in TrueRate's brand theme (lime accent).
 *   - 'global' → International benchmark. Rendered Bloomberg/Yahoo-dense (neutral).
 *
 * Region lives here as the source of truth because the live `symbols` table is
 * seeded via the REST API (no direct Postgres access in this environment to run
 * the ALTER that adds symbols.region). Migration 009 adds the column + RLS so the
 * DB and this catalog agree once it's applied. Until then, the app reads region
 * from this map by ticker.
 */

export type Region = 'LR' | 'global';
export type AssetClass = 'fx' | 'commodity' | 'macro';

export interface CatalogSymbol {
  /** Stored ticker — matches the live source key exactly. */
  ticker: string;
  assetClass: Exclude<AssetClass, 'macro'>;
  name: string;
  region: Region;
  unit: string;
  /** Source key used by the snapshot cron. For fx: the base currency code
   *  (USD→usd in the exchange API). For commodity: the Stooq symbol. */
  sourceKey: string;
}

/** FX cross-rates vs LRD — these ARE the local market → region 'LR'. */
export const FX_SYMBOLS: CatalogSymbol[] = [
  { ticker: 'USD/LRD', assetClass: 'fx', name: 'US Dollar / Liberian Dollar',      region: 'LR', unit: 'LRD per USD', sourceKey: 'usd' },
  { ticker: 'EUR/LRD', assetClass: 'fx', name: 'Euro / Liberian Dollar',           region: 'LR', unit: 'LRD per EUR', sourceKey: 'eur' },
  { ticker: 'GBP/LRD', assetClass: 'fx', name: 'British Pound / Liberian Dollar',  region: 'LR', unit: 'LRD per GBP', sourceKey: 'gbp' },
  { ticker: 'CNY/LRD', assetClass: 'fx', name: 'Chinese Yuan / Liberian Dollar',   region: 'LR', unit: 'LRD per CNY', sourceKey: 'cny' },
  { ticker: 'GHS/LRD', assetClass: 'fx', name: 'Ghanaian Cedi / Liberian Dollar',  region: 'LR', unit: 'LRD per GHS', sourceKey: 'ghs' },
  { ticker: 'NGN/LRD', assetClass: 'fx', name: 'Nigerian Naira / Liberian Dollar', region: 'LR', unit: 'LRD per NGN', sourceKey: 'ngn' },
];

/** Commodity benchmarks — international price discovery → region 'global'. */
export const COMMODITY_SYMBOLS: CatalogSymbol[] = [
  { ticker: 'gc.f',   assetClass: 'commodity', name: 'Gold',                     region: 'global', unit: '$/oz',  sourceKey: 'gc.f' },
  { ticker: 'cb.f',   assetClass: 'commodity', name: 'Brent crude',             region: 'global', unit: '$/bbl', sourceKey: 'cb.f' },
  { ticker: 'cc.f',   assetClass: 'commodity', name: 'Cocoa',                   region: 'global', unit: '$/t',   sourceKey: 'cc.f' },
  { ticker: 'kc.f',   assetClass: 'commodity', name: 'Coffee',                  region: 'global', unit: '¢/lb',  sourceKey: 'kc.f' },
  { ticker: 'sb.f',   assetClass: 'commodity', name: 'Sugar',                   region: 'global', unit: '¢/lb',  sourceKey: 'sb.f' },
  { ticker: 'bhp.us', assetClass: 'commodity', name: 'Iron ore (BHP ADR proxy)', region: 'global', unit: '$ ADR', sourceKey: 'bhp.us' },
];

export const ALL_SYMBOLS: CatalogSymbol[] = [...FX_SYMBOLS, ...COMMODITY_SYMBOLS];

const REGION_BY_TICKER = new Map(ALL_SYMBOLS.map((s) => [s.ticker, s.region]));

/** Region for a price symbol ticker; defaults to 'global' if unknown. */
export function regionForTicker(ticker: string): Region {
  return REGION_BY_TICKER.get(ticker) ?? 'global';
}

/**
 * Region for a macro series. All macro series in this product are Liberia data
 * (CBL + World-Bank-for-Liberia), so every macro item is local.
 */
export function regionForMacro(): Region {
  return 'LR';
}
