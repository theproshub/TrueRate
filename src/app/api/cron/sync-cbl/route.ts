// CBL Statistics sync — Vercel Cron entrypoint.
// Repo path: src/app/api/cron/sync-cbl/route.ts
//
// The sync itself lives in src/lib/jobs/sync-cbl.ts so the droplet can run the
// same code without a Next runtime (see infra/systemd/). This handler is only
// the Vercel-shaped wrapper: auth, cache invalidation, JSON response.
//
// Env required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET
// Vercel automatically sends `Authorization: Bearer <CRON_SECRET>` to cron routes
// when CRON_SECRET is set in project env.

import { syncCbl } from '@/lib/jobs/sync-cbl';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Pro plan ceiling; the droplet timer has no such limit

export async function GET(req: Request) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await syncCbl();

  // Bust ISR caches so fresh data is served immediately
  revalidatePath('/api/rates');
  revalidatePath('/api/indicators');
  revalidatePath('/economy');
  revalidatePath('/markets');

  return Response.json(result);
}
