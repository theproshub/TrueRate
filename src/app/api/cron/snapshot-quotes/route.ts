import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { snapshotQuotes } from '@/lib/jobs/snapshot-quotes';

/**
 * GET /api/cron/snapshot-quotes
 *
 * Manual/on-demand trigger. The scheduled run is a systemd timer on the
 * droplet (see infra/systemd/); the job itself lives in
 * src/lib/jobs/snapshot-quotes.ts so both callers share one implementation.
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
    const result = await snapshotQuotes();

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: 'no live quotes available this run', detail: result.detail },
        { status: 200 },
      );
    }

    revalidatePath('/api/rates');
    revalidatePath('/api/commodities');
    revalidatePath('/markets');

    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
