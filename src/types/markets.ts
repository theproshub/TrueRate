/**
 * Shared types for market data consumed by client components.
 * These match the shapes returned by /api/rates and /api/indicators.
 */

export type MarketRate = {
  pair: string;
  from: string;
  to?: string;
  rate: number;
  change?: number;
  changePercent?: number;
};

export type MarketIndicator = {
  key: string;
  name: string;
  value: number;
  unit: string;
  change: number | null;
  changePercent: number | null;
  period?: string;
  source?: string;
};
