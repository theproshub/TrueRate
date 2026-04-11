/**
 * World Bank API client for Liberia economic data.
 * Free — no API key required.
 * Docs: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
 */

const BASE = 'https://api.worldbank.org/v2';
const COUNTRY = 'LR'; // Liberia ISO2 code

export interface WBDataPoint {
  date: string;   // "2023", "2022", etc.
  value: number | null;
}

export interface WBIndicatorResult {
  indicator: string;
  name: string;
  unit: string;
  data: WBDataPoint[]; // sorted newest → oldest
}

/** Indicator codes for Liberia */
export const WB_INDICATORS = {
  GDP:            'NY.GDP.MKTP.CD',       // GDP (current US$)
  GDP_GROWTH:     'NY.GDP.MKTP.KD.ZG',   // GDP growth (annual %)
  INFLATION:      'FP.CPI.TOTL.ZG',      // Inflation, consumer prices (annual %)
  POPULATION:     'SP.POP.TOTL',          // Population, total
  UNEMPLOYMENT:   'SL.UEM.TOTL.ZS',      // Unemployment (% of labor force)
  RESERVES:       'FI.RES.TOTL.CD',      // Total reserves (incl. gold, current US$)
  TRADE_BALANCE:  'NE.RSB.GNFS.CD',      // External balance on goods & services (US$)
  GOVT_DEBT:      'GC.DOD.TOTL.GD.ZS',  // Central govt debt (% of GDP)
  CURRENT_ACCT:   'BN.CAB.XOKA.CD',      // Current account balance (US$)
  EXPORTS:        'NE.EXP.GNFS.CD',      // Exports of goods and services (US$)
} as const;

type IndicatorCode = typeof WB_INDICATORS[keyof typeof WB_INDICATORS];

/** Raw shape returned by World Bank API */
type WBApiResponse = [
  { page: number; pages: number; total: number },
  Array<{ date: string; value: number | null }>
];

async function fetchIndicator(
  indicator: IndicatorCode,
  mrv = 15
): Promise<WBDataPoint[]> {
  const url = `${BASE}/country/${COUNTRY}/indicator/${indicator}?format=json&mrv=${mrv}&per_page=${mrv}`;

  const res = await fetch(url, {
    next: { revalidate: 86400 }, // cache 24 hours
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) throw new Error(`World Bank API error: ${res.status} for ${indicator}`);

  const json: WBApiResponse = await res.json();
  const rows = json[1] ?? [];

  return rows
    .filter(r => r.value !== null)
    .map(r => ({ date: r.date, value: r.value as number }));
}

/** Fetch multiple indicators in parallel */
export async function fetchLiberiaIndicators(): Promise<
  Record<string, WBDataPoint[]>
> {
  const entries = Object.entries(WB_INDICATORS) as [string, IndicatorCode][];

  const results = await Promise.allSettled(
    entries.map(async ([key, code]) => {
      const data = await fetchIndicator(code);
      return [key, data] as [string, WBDataPoint[]];
    })
  );

  return Object.fromEntries(
    results
      .filter((r): r is PromiseFulfilledResult<[string, WBDataPoint[]]> => r.status === 'fulfilled')
      .map(r => r.value)
  );
}

/** Pull the most recent non-null value from a series */
export function latestValue(series: WBDataPoint[]): number | null {
  const hit = series.find(d => d.value !== null);
  return hit?.value ?? null;
}

/** Pull previous year's value (for computing change) */
export function previousValue(series: WBDataPoint[]): number | null {
  const valid = series.filter(d => d.value !== null);
  return valid[1]?.value ?? null;
}
