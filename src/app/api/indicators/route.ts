/**
 * GET /api/indicators
 *
 * Returns live Liberia economic indicators from the World Bank API.
 * Revalidates once per day — data is annual, so hourly fetching is wasteful.
 *
 * Response shape: { updatedAt: string; indicators: NormalizedIndicator[] }
 */

import { NextResponse } from 'next/server';
import {
  fetchLiberiaIndicators,
  latestValue,
  previousValue,
  WBDataPoint,
} from '@/lib/api/worldbank';
import { economicIndicators } from '@/data/economicIndicators';

// ISR: Vercel caches this route for 24 hours then revalidates in the background
export const revalidate = 86400;

export interface NormalizedIndicator {
  key: string;
  name: string;
  value: number;
  previousValue: number | null;
  change: number | null;
  changePercent: number | null;
  unit: string;
  period: string;
  source: string;
  /** Annual data points, newest first, for sparkline/chart use */
  history: { date: string; value: number }[];
}

const META: Record<
  string,
  { name: string; unit: string; source: string; scale?: number }
> = {
  GDP: {
    name: 'GDP',
    unit: 'B USD',
    source: 'World Bank',
    scale: 1e-9, // API returns raw USD, we want billions
  },
  GDP_GROWTH: {
    name: 'GDP Growth',
    unit: '%',
    source: 'World Bank',
  },
  INFLATION: {
    name: 'Inflation Rate',
    unit: '%',
    source: 'Central Bank of Liberia',
  },
  POPULATION: {
    name: 'Population',
    unit: 'M',
    source: 'World Bank',
    scale: 1e-6,
  },
  UNEMPLOYMENT: {
    name: 'Unemployment',
    unit: '%',
    source: 'World Bank / LISGIS',
  },
  RESERVES: {
    name: 'Foreign Reserves',
    unit: 'B USD',
    source: 'Central Bank of Liberia',
    scale: 1e-9,
  },
  TRADE_BALANCE: {
    name: 'Trade Balance',
    unit: 'B USD',
    source: 'World Bank',
    scale: 1e-9,
  },
  GOVT_DEBT: {
    name: 'Government Debt/GDP',
    unit: '%',
    source: 'IMF',
  },
};

function normalize(
  key: string,
  series: WBDataPoint[]
): NormalizedIndicator | null {
  const meta = META[key];
  if (!meta) return null;

  const scale = meta.scale ?? 1;
  const valid = series.filter(d => d.value !== null);
  if (!valid.length) return null;

  const raw = latestValue(valid);
  const rawPrev = previousValue(valid);
  if (raw === null) return null;

  const value = Number((raw * scale).toFixed(4));
  const prev = rawPrev !== null ? Number((rawPrev * scale).toFixed(4)) : null;
  const change = prev !== null ? Number((value - prev).toFixed(4)) : null;
  const changePercent =
    prev !== null && prev !== 0
      ? Number(((change! / Math.abs(prev)) * 100).toFixed(2))
      : null;

  const history = valid
    .slice(0, 10)
    .map(d => ({
      date: d.date,
      value: Number(((d.value as number) * scale).toFixed(4)),
    }));

  return {
    key,
    name: meta.name,
    value,
    previousValue: prev,
    change,
    changePercent,
    unit: meta.unit,
    period: valid[0]?.date ?? 'Latest',
    source: meta.source,
    history,
  };
}

export async function GET() {
  try {
    const raw = await fetchLiberiaIndicators();

    const indicators: NormalizedIndicator[] = Object.entries(raw)
      .map(([key, series]) => normalize(key, series))
      .filter((x): x is NormalizedIndicator => x !== null);

    return NextResponse.json(
      { updatedAt: new Date().toISOString(), indicators },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err) {
    console.error('[/api/indicators] fetch failed, falling back to seed data:', err);

    // Fallback: map seed EconomicIndicator[] → NormalizedIndicator[]
    const NAME_TO_KEY: Record<string, string> = {
      'GDP':                 'GDP',
      'Inflation Rate':      'INFLATION',
      'CBL Policy Rate':     'CBL_RATE',
      'Unemployment':        'UNEMPLOYMENT',
      'Trade Balance':       'TRADE_BALANCE',
      'Foreign Reserves':    'RESERVES',
      'Government Debt/GDP': 'GOVT_DEBT',
      'Population':          'POPULATION',
    };

    const fallback: NormalizedIndicator[] = economicIndicators.map(ind => ({
      key:           NAME_TO_KEY[ind.name] ?? ind.name.toUpperCase().replace(/\s+/g, '_'),
      name:          ind.name,
      value:         ind.value,
      previousValue: ind.historicalData?.length >= 2
                       ? ind.historicalData[ind.historicalData.length - 2].value
                       : null,
      change:        ind.change,
      changePercent: ind.changePercent,
      unit:          ind.unit,
      period:        ind.period,
      source:        ind.source,
      history:       (ind.historicalData ?? []).map(d => ({ date: String(d.date), value: d.value })),
    }));

    return NextResponse.json(
      { updatedAt: null, indicators: fallback },
      { status: 200 }
    );
  }
}
