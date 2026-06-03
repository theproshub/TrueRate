import type { SeriesPoint, PeriodStats, Timeframe } from './types';

/** Days back for each timeframe. ALL → Infinity. 1D handled specially. */
const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 31,
  '3M': 93,
  '1Y': 366,
  ALL: Number.POSITIVE_INFINITY,
};

/** Slice a series to the window for a timeframe (inclusive of the cutoff). */
export function sliceByTimeframe(series: SeriesPoint[], tf: Timeframe): SeriesPoint[] {
  if (series.length === 0) return [];
  if (tf === 'ALL') return series;
  const days = TIMEFRAME_DAYS[tf];
  const lastDate = new Date(series[series.length - 1].date).getTime();
  const cutoff = lastDate - days * 86_400_000;
  const windowed = series.filter((p) => new Date(p.date).getTime() >= cutoff);
  // Always keep at least the last two points so change can be shown.
  if (windowed.length < 2 && series.length >= 2) return series.slice(-2);
  return windowed;
}

/** Compute period stats over a pre-sliced window. */
export function periodStats(windowed: SeriesPoint[]): PeriodStats {
  if (windowed.length === 0) {
    return { first: null, last: null, change: null, changePct: null, high: null, low: null, direction: null, count: 0 };
  }
  const values = windowed.map((p) => p.value);
  const first = values[0];
  const last = values[values.length - 1];
  const high = Math.max(...values);
  const low = Math.min(...values);
  const change = windowed.length >= 2 ? last - first : null;
  const changePct = change !== null && first !== 0 ? (change / Math.abs(first)) * 100 : null;
  const direction: PeriodStats['direction'] =
    change === null ? null : change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  return { first, last, change, changePct, high, low, direction, count: windowed.length };
}

/** Convenience: stats for a series at a timeframe. */
export function statsFor(series: SeriesPoint[], tf: Timeframe): PeriodStats {
  return periodStats(sliceByTimeframe(series, tf));
}

/** Downsample a series to at most `max` points for compact sparklines. */
export function downsample(series: SeriesPoint[], max = 32): SeriesPoint[] {
  if (series.length <= max) return series;
  const step = (series.length - 1) / (max - 1);
  const out: SeriesPoint[] = [];
  for (let i = 0; i < max; i++) out.push(series[Math.round(i * step)]);
  return out;
}
