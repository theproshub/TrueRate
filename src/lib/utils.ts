import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HistoricalDataPoint, NewsItem, TimeRange } from './types';
import { newsItems } from '@/data/news';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNews(id: string): NewsItem | undefined {
  return newsItems.find(n => n.id === id);
}

export function newsFeed(ids: string[]): NewsItem[] {
  return ids
    .map(id => newsItems.find(n => n.id === id))
    .filter((n): n is NewsItem => n !== undefined);
}

export function timeAgo(dateStr: string, now: number = Date.now()): string {
  const ms = now - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
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

/**
 * Generate realistic daily historical data anchored to real annual values.
 *
 * Instead of a pure random walk from a single base value, this interpolates
 * between known real-world data points (e.g. World Bank annual GDP) and adds
 * controlled noise around the true trend. Charts built from this reflect actual
 * historical trajectories rather than synthetic random motion.
 *
 * @param anchors  Array of { year, value } pairs, sorted oldest → newest
 * @param volatility  Daily noise factor (e.g. 0.008 = 0.8% daily std)
 * @param seed  Deterministic seed for the random number generator
 */
export function generateHistoricalDataFromAnchors(
  anchors: { year: number; value: number }[],
  volatility: number,
  seed: number
): HistoricalDataPoint[] {
  if (anchors.length < 2) {
    // Fallback: single-point random walk
    return generateHistoricalData(anchors[0]?.value ?? 0, volatility, 365, seed);
  }

  const random = seededRandom(seed);
  const result: HistoricalDataPoint[] = [];

  for (let i = 0; i < anchors.length - 1; i++) {
    const startDate = new Date(`${anchors[i].year}-01-01`);
    const endDate = new Date(`${anchors[i + 1].year}-01-01`);
    const startVal = anchors[i].value;
    const endVal = anchors[i + 1].value;
    const totalDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 86_400_000
    );

    let value = startVal;

    for (let d = 0; d < totalDays; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);

      const progress = d / totalDays;
      // Linear interpolated "true" value between the two anchors
      const target = startVal + (endVal - startVal) * progress;
      // Pull toward the true trend (mean reversion)
      const pull = (target - value) * 0.04;
      // Random daily noise
      const noise = (random() - 0.5) * 2 * volatility * Math.abs(value);

      value = value + pull + noise;
      // Hard clamp: don't let synthetic noise stray more than ±30% from target
      value = Math.max(value, target * 0.7);
      value = Math.min(value, target * 1.3);

      result.push({
        date: date.toISOString().split('T')[0],
        value: Number(value.toFixed(4)),
      });
    }
  }

  // Append the final anchor date itself
  const last = anchors[anchors.length - 1];
  result.push({
    date: `${last.year}-01-01`,
    value: last.value,
  });

  return result;
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
