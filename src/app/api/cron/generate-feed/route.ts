import { NextRequest, NextResponse } from 'next/server';
import { generateFeed } from '@/lib/jobs/generate-feed';

/**
 * GET /api/cron/generate-feed
 *
 * Manual/on-demand trigger. The scheduled run is a systemd timer on the
 * droplet (see infra/systemd/); the job itself lives in
 * src/lib/jobs/generate-feed.ts so both callers share one implementation.
 *
 * This job INSERTs rather than upserts, so it must never run in two places at
 * once. Its 30-minute duplicate guard is the only protection.
 *
 * Auth: Authorization: Bearer <CRON_SECRET>.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateFeed();
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
