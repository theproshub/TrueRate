import type { AnalyticsItem } from './types';

/** Abbreviated number: 1.2K / 3.4M / 5.6B. */
export function abbreviate(n: number, decimals = 1): string {
  const abs = Math.abs(n);
  if (abs >= 1e12) return `${(n / 1e12).toFixed(decimals)}T`;
  if (abs >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(decimals)}K`;
  return n.toFixed(decimals);
}

/** Format a value per an item's declared format. */
export function formatValue(value: number | null, format: AnalyticsItem['format']): string {
  if (value == null || !Number.isFinite(value)) return '—';
  switch (format) {
    case 'rate':
      return value.toLocaleString('en-US', { maximumFractionDigits: 4 });
    case 'price':
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    case 'pct':
      return `${value.toFixed(1)}%`;
    case 'usd':
      return `$${abbreviate(value)}`;
    case 'people':
      return abbreviate(value, 2);
    default:
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
}

/** Value with its unit suffix where useful (rates → " LRD"). */
export function formatValueWithUnit(value: number | null, item: Pick<AnalyticsItem, 'format' | 'unit'>): string {
  const base = formatValue(value, item.format);
  if (base === '—') return base;
  if (item.format === 'rate') return `${base} LRD`;
  return base;
}

/** Signed percent: +1.2% / −3.4%. Returns '—' for null. */
export function formatPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return '—';
  const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
  return `${sign}${Math.abs(pct).toFixed(2)}%`;
}

/** Signed absolute change in the item's value space. */
export function formatChange(change: number | null, format: AnalyticsItem['format']): string {
  if (change == null || !Number.isFinite(change)) return '—';
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  return `${sign}${formatValue(Math.abs(change), format)}`;
}

/** Tailwind text color for a delta (pairs with ▲/▼ — never color-only). */
export function deltaColor(n: number | null): string {
  if (n == null || n === 0) return 'text-gray-400';
  return n > 0 ? 'text-pos' : 'text-neg';
}

/** Arrow glyph for a delta. */
export function deltaArrow(n: number | null): string {
  if (n == null || n === 0) return '';
  return n > 0 ? '▲' : '▼';
}
