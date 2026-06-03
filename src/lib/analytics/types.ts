import type { Region, AssetClass } from './catalog';

export type { Region, AssetClass };

/** A single observation in a series (oldest → newest in `series`). */
export interface SeriesPoint {
  /** ISO date YYYY-MM-DD */
  date: string;
  value: number;
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

/** Stat block computed for a given timeframe window. */
export interface PeriodStats {
  /** First value in the window. */
  first: number | null;
  /** Latest value (current). */
  last: number | null;
  change: number | null;
  changePct: number | null;
  high: number | null;
  low: number | null;
  /** 'up' | 'down' | 'flat' | null */
  direction: 'up' | 'down' | 'flat' | null;
  /** Number of observations in the window. */
  count: number;
}

/**
 * A fully normalized, decision-ready item. Everything the UI needs to render a
 * card, sparkline, hero chart and movers entry — region-tagged for theming.
 */
export interface AnalyticsItem {
  /** Stable id: ticker for prices, series_id for macro. */
  id: string;
  /** Short display key, e.g. "USD/LRD" or "GDP Growth". */
  label: string;
  name: string;
  assetClass: AssetClass;
  region: Region;
  unit: string;
  /** How to format values in the UI. */
  format: 'rate' | 'price' | 'pct' | 'usd' | 'people' | 'plain';
  source: string;
  /** Latest spot value (live where available, else last stored). */
  current: number | null;
  /** Whole stored history, oldest → newest. */
  series: SeriesPoint[];
  /** Frequency hint for the UI ('daily' | 'annual' | …). */
  frequency: 'daily' | 'annual' | 'monthly' | 'unknown';
  /** True when history is still accruing (e.g. price series just started). */
  buildingHistory: boolean;
}

export interface AnalyticsPayload {
  updatedAt: string;
  items: AnalyticsItem[];
  /** Pre-split for convenience; all also present in `items`. */
  fx: AnalyticsItem[];
  commodities: AnalyticsItem[];
  macro: AnalyticsItem[];
  /** Whether the daily price snapshot has run at least twice (enough for change). */
  priceHistoryReady: boolean;
}
