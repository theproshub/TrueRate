export type TickerItem = { label: string; value: string; pct: string; up: boolean };

/**
 * Label-only placeholders for the homepage ticker. Values render as dashes
 * server-side; the client hydrates them from live APIs (see IndicatorsStrip).
 *
 * Also used by SearchBox for label matching — values are irrelevant there.
 */
export const TICKER_LABELS: TickerItem[] = [
  { label: 'GDP Growth', value: '—', pct: '', up: true },
  { label: 'Inflation',  value: '—', pct: '', up: true },
  { label: 'CBL Rate',   value: '—', pct: '', up: true },
  { label: 'LRD/USD',    value: '—', pct: '', up: true },
  { label: 'LRD/EUR',    value: '—', pct: '', up: true },
  { label: 'LRD/GBP',    value: '—', pct: '', up: true },
  { label: 'Gold',       value: '—', pct: '', up: true },
];

/** @deprecated Use TICKER_LABELS instead */
export const SEED_INDICATORS = TICKER_LABELS;
