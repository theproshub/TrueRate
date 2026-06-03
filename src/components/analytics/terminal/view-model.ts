/**
 * View-model: turns a live AnalyticsItem + selected timeframe into the display
 * fields the terminal components render. All numbers are real (from the data
 * layer); only the editorial `note` / `liberiaAngle` are static copy.
 */
import type { AnalyticsItem, Timeframe } from '@/lib/analytics/types';
import { statsFor, sliceByTimeframe, downsample } from '@/lib/analytics/stats';
import { formatValue, formatValueWithUnit, formatPct } from '@/lib/analytics/format';
import { editorialFor } from './editorial';
import type { Direction } from './colors';

export type { Timeframe } from '@/lib/analytics/types';

export interface StatView {
  id: string;
  label: string;
  kind: 'macro' | 'currency' | 'commodity';
  region: 'LR' | 'global';
  unit: string;

  // Glance
  /** Current value, formatted (no unit suffix — unit shown separately). */
  value: string;
  numeric: number | null;
  direction: Direction;
  /** Signed % for the selected timeframe; null when not computable. */
  change: string | null;
  /** Timeframe-aware change label, e.g. "1M" or "YoY" for annual macro. */
  period: string;

  // Detail
  /** Prior reading (period start), formatted. */
  prior: string;
  /** Range marker [0,1] within low–high, or null when no range. */
  rangePos: number | null;
  rangeLowLabel: string;
  rangeHighLabel: string;
  /** Range descriptor tied to the timeframe, e.g. "1M range". */
  rangeLabel: string;

  // Trend
  /** Downsampled values for sparkline (oldest → newest). */
  spark: number[];
  /** Dated points for the focus chart. */
  chart: { date: string; value: number }[];

  // Provenance + copy
  source: string;
  updatedAt: string;
  note: string;
  liberiaAngle: string | null;

  /** True when history is too thin for the selected window. */
  buildingHistory: boolean;
}

/** Ordered timeframe options for the tabs. */
export const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export interface TickerView {
  id: string;
  label: string;
  value: string;
  /** Signed % over the item's natural short window, or period note for macro. */
  note: string;
  direction: Direction;
}

/**
 * Compact ticker row. Markets show their shortest meaningful change (1D, or the
 * latest move if only sparse history exists); macro shows its period note.
 */
export function toTickerView(item: AnalyticsItem): TickerView {
  const isMacro = item.assetClass === 'macro';
  // Macro shows its YoY move; markets show their 1-day move. Both colour by direction.
  const tf: Timeframe = isMacro ? '1Y' : '1D';
  const stats = statsFor(item.series, tf);
  return {
    id: item.id,
    label: item.label,
    value: formatValue(item.current, item.format),
    note: isMacro ? (item.frequency === 'annual' ? 'YoY' : 'latest') : formatPct(stats.changePct),
    direction: dirOf(stats.changePct),
  };
}

const KIND: Record<AnalyticsItem['assetClass'], StatView['kind']> = {
  fx: 'currency',
  commodity: 'commodity',
  macro: 'macro',
};

function dirOf(changePct: number | null): Direction {
  if (changePct == null || changePct === 0) return 'neutral';
  return changePct > 0 ? 'up' : 'down';
}

/** Human label for the change period. Annual macro reads "YoY" at 1Y/ALL. */
function periodLabel(item: AnalyticsItem, tf: Timeframe): string {
  if (item.frequency === 'annual') return tf === 'ALL' ? 'all' : 'YoY';
  return tf;
}

export function toStatView(item: AnalyticsItem, tf: Timeframe): StatView {
  const stats = statsFor(item.series, tf);
  const windowed = sliceByTimeframe(item.series, tf);
  const direction = dirOf(stats.changePct);

  const rangeAvailable = stats.low != null && stats.high != null && stats.high > stats.low;
  const rangePos =
    rangeAvailable && stats.last != null
      ? Math.min(1, Math.max(0, (stats.last - stats.low!) / (stats.high! - stats.low!)))
      : null;

  const ed = editorialFor(item.id);

  return {
    id: item.id,
    label: item.label,
    kind: KIND[item.assetClass],
    region: item.region,
    unit: item.unit,

    value: formatValue(item.current, item.format),
    numeric: item.current,
    direction,
    change: formatPct(stats.changePct),
    period: periodLabel(item, tf),

    prior: stats.first != null ? formatValueWithUnit(stats.first, item) : '—',
    rangePos,
    rangeLowLabel: stats.low != null ? formatValue(stats.low, item.format) : '—',
    rangeHighLabel: stats.high != null ? formatValue(stats.high, item.format) : '—',
    rangeLabel: `${tf} range`,

    spark: downsample(windowed, 32).map((p) => p.value),
    chart: windowed,

    source: item.source,
    updatedAt:
      item.series.length > 0 ? item.series[item.series.length - 1].date : '—',
    note: ed.note,
    liberiaAngle: ed.liberiaAngle ?? null,

    buildingHistory: item.buildingHistory || stats.count < 2,
  };
}
