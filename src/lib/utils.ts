import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HistoricalDataPoint, TimeRange } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLRD(value: number): string {
  return `L$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

// Seeded random for deterministic data generation
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateHistoricalData(
  baseValue: number,
  volatility: number,
  days: number,
  seed: number,
  trend: number = 0
): HistoricalDataPoint[] {
  const random = seededRandom(seed);
  const data: HistoricalDataPoint[] = [];
  let value = baseValue * (1 - volatility * 0.5);
  const endDate = new Date('2026-03-31');

  for (let i = days; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    // Gradually pull value toward baseValue near the end
    const meanReversion = (baseValue - value) * 0.002;
    const pullStrength = i < 30 ? (baseValue - value) * (1 - i / 30) * 0.05 : 0;
    const change = (random() - 0.5) * 2 * volatility * baseValue + trend * baseValue + meanReversion + pullStrength;
    value = Math.max(value + change, baseValue * 0.5);
    value = Math.min(value, baseValue * 1.5);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(value.toFixed(4)),
    });
  }

  return data;
}

export function filterDataByTimeRange(
  data: HistoricalDataPoint[],
  range: TimeRange
): HistoricalDataPoint[] {
  const now = new Date('2026-03-31');
  const rangeMap: Record<TimeRange, number> = {
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '5Y': 1825,
  };
  const daysBack = rangeMap[range];
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - daysBack);
  return data.filter((d) => new Date(d.date) >= cutoff);
}
