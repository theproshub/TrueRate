import { CBL_POLICY_RATE } from '@/lib/data/cbl-rate';

export type TickerItem = { label: string; value: string; pct: string; up: boolean };

/**
 * Server-rendered placeholders for the homepage ticker. Every row here is
 * hydrated from a live source on the client (see IndicatorsStrip):
 *   - FX pairs        → /api/rates
 *   - GDP / Inflation → /api/indicators (World Bank)
 *   - CBL Rate        → /api/indicators (administered, single source)
 *   - Gold            → /api/commodities (Yahoo Finance)
 *
 * Gold has no trustworthy static value, so it renders a dash until the live
 * price arrives — we never ship a fabricated price. Rows without any live feed
 * (e.g. iron-ore index, rubber) are intentionally omitted.
 */
export const SEED_INDICATORS: TickerItem[] = [
  { label: 'GDP Growth', value: '4.5%',                pct: 'YoY',    up: true  },
  { label: 'Inflation',  value: '10.2%',               pct: 'YoY',    up: false },
  { label: 'CBL Rate',   value: `${CBL_POLICY_RATE}%`, pct: 'Steady', up: true  },
  { label: 'LRD/USD',    value: '182.53',              pct: '+0.65%', up: true  },
  { label: 'LRD/EUR',    value: '209.85',              pct: '-0.44%', up: false },
  { label: 'LRD/GBP',    value: '243.15',              pct: '+0.87%', up: true  },
  { label: 'Gold',       value: '—',                   pct: '',       up: true  },
];
