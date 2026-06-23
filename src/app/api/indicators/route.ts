/**
 * GET /api/indicators
 *
 * Returns Liberia economic indicators sourced from Supabase
 * (`macro_series` + `macro_values`, hydrated by the World Bank scraper
 * and future CBL/IMF jobs). Falls back to the in-repo seed data if the
 * DB is empty or unreachable.
 *
 * Response shape: { updatedAt: string | null; indicators: NormalizedIndicator[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { getDashboardIndicators } from '@/lib/data/indicators';
import { economicIndicators } from '@/data/economicIndicators';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

// ISR: cache the route for 24h, revalidate in the background.
export const revalidate = 86400;

export type { NormalizedIndicator };

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed, remaining } = rateLimit(`api-indicators:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(remaining, 60, 60_000) },
    );
  }

  try {
    const indicators = await getDashboardIndicators();
    if (indicators.length === 0) {
      throw new Error('No indicators returned from DB; falling back to seed');
    }
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), indicators },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=3600',
        },
      },
    );
  } catch (err) {
    console.error('[/api/indicators] DB read failed, using seed:', err);

    const NAME_TO_KEY: Record<string, string> = {
      'GDP':                 'GDP',
      'GDP Growth':          'GDP_GROWTH',
      'Inflation Rate':      'INFLATION',
      'CBL Policy Rate':     'CBL_RATE',
      'Unemployment':        'UNEMPLOYMENT',
      'Trade Balance':       'TRADE_BALANCE',
      'Foreign Reserves':    'RESERVES',
      'Government Debt/GDP': 'GOVT_DEBT',
      'Population':          'POPULATION',
    };

    const fallback: NormalizedIndicator[] = economicIndicators.map(ind => ({
      key: NAME_TO_KEY[ind.name] ?? ind.name.toUpperCase().replace(/\s+/g, '_'),
      name: ind.name,
      value: ind.value,
      previousValue:
        ind.historicalData && ind.historicalData.length >= 2
          ? ind.historicalData[ind.historicalData.length - 2].value
          : null,
      change: ind.change,
      changePercent: ind.changePercent,
      unit: ind.unit,
      period: ind.period,
      source: ind.source,
      history: (ind.historicalData ?? []).map(d => ({
        date: String(d.date),
        value: d.value,
      })),
    }));

    return NextResponse.json(
      { updatedAt: null, indicators: fallback },
      { status: 200 },
    );
  }
}
