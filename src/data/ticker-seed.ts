export type TickerItem = { label: string; value: string; pct: string; up: boolean };

export const SEED_INDICATORS: TickerItem[] = [
  { label: 'GDP Growth', value: '4.5%',     pct: 'YoY',    up: true  },
  { label: 'Inflation',  value: '10.2%',    pct: 'YoY',    up: false },
  { label: 'CBL Rate',   value: '17.50%',   pct: 'Steady', up: true  },
  { label: 'LRD/USD',    value: '192.50',   pct: '+0.65%', up: true  },
  { label: 'LRD/EUR',    value: '209.85',   pct: '-0.44%', up: false },
  { label: 'LRD/GBP',    value: '243.15',   pct: '+0.87%', up: true  },
  { label: 'Iron Ore',   value: '108.50',   pct: '-2.08%', up: false },
  { label: 'Rubber',     value: '1.72',     pct: '+2.38%', up: true  },
  { label: 'Gold',       value: '2,285.40', pct: '+0.82%', up: true  },
];
