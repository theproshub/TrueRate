/**
 * GET /api/indicators
 *
 * Returns Liberia economic indicators sourced from Supabase
 * (`macro_series` + `macro_values` + `cbl_observations`).
 * Returns an empty array when the DB is unreachable — no stale seed fallback.
 *
 * Response shape: { updatedAt: string | null; indicators: NormalizedIndicator[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { getDashboardIndicators } from '@/lib/data/indicators';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export const revalidate = 900; // 15 min — match analytics page cadence

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
    return NextResponse.json(
      { updatedAt: new Date().toISOString(), indicators },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=900, stale-while-revalidate=300',
        },
      },
    );
  } catch (err) {
    console.error('[/api/indicators] DB read failed:', err);
    return NextResponse.json(
      { updatedAt: null, indicators: [] },
      { status: 200 },
    );
  }
}
