// Droplet job runner.
//
//   npx tsx src/lib/jobs/run.ts sync-cbl
//
// Invoked by systemd (see infra/systemd/). Runs a job from src/lib/jobs/,
// then asks the live site to drop the ISR caches the job invalidated —
// `revalidatePath` only exists inside the Next runtime, so off-platform we go
// through the site's own /api/revalidate endpoint instead.
//
// Env required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//               CRON_SECRET, TRUERATE_SITE_URL

import { syncCbl, SYNC_CBL_REVALIDATE_TAGS } from './sync-cbl';

/** Fraction of series that may fail before the run counts as failed overall. */
const FAILURE_THRESHOLD = 0.1;

interface JobOutcome {
  result: Record<string, unknown>;
  /** Non-fatal problems: the run succeeded, but not cleanly. */
  degraded: boolean;
  tags: readonly string[];
}

const JOBS: Record<string, (log: (m: string) => void) => Promise<JobOutcome>> = {
  'sync-cbl': async (log) => {
    const result = await syncCbl(log);
    const total = result.series_synced + result.failed_count;
    // A handful of transient portal errors is normal and shouldn't page anyone.
    // A large fraction failing means the portal changed shape or is down.
    const degraded = total > 0 && result.failed_count / total > FAILURE_THRESHOLD;
    return { result: { ...result }, degraded, tags: SYNC_CBL_REVALIDATE_TAGS };
  },
};

function log(message: string) {
  // journald adds its own timestamp, but this keeps `tsx ... | tee` readable too.
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Trim long string arrays before logging. A full list of 364 failed mnemonics
 * buries the one field that explains the failure.
 */
function summarize(result: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(result)) {
    if (Array.isArray(value) && value.length > 5) {
      out[key] = [...value.slice(0, 5), `…and ${value.length - 5} more`];
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Ask the live site to revalidate. A failure here leaves the site serving stale
 * data until the next ISR window — bad, but the data is already committed, so
 * it is reported rather than thrown.
 */
async function revalidate(tags: readonly string[]): Promise<boolean> {
  const siteUrl = process.env.TRUERATE_SITE_URL;
  const secret = process.env.CRON_SECRET;
  if (!siteUrl || !secret) {
    log('WARN revalidate skipped: TRUERATE_SITE_URL or CRON_SECRET is unset');
    return false;
  }

  try {
    const res = await fetch(`${siteUrl.replace(/\/$/, '')}/api/revalidate`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    });
    if (!res.ok) {
      log(`WARN revalidate failed: HTTP ${res.status} ${await res.text()}`);
      return false;
    }
    log(`revalidated: ${tags.join(', ')}`);
    return true;
  } catch (err) {
    log(`WARN revalidate failed: ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

async function main() {
  const name = process.argv[2];
  const job = name ? JOBS[name] : undefined;

  if (!job) {
    console.error(
      `Unknown job ${JSON.stringify(name)}. Available: ${Object.keys(JOBS).join(', ')}`,
    );
    process.exit(2);
  }

  log(`${name}: start`);
  const { result, degraded, tags } = await job(log);
  log(`${name}: ${JSON.stringify(summarize(result))}`);

  await revalidate(tags);

  if (degraded) {
    log(`${name}: FAILED — too many series failed`);
    process.exit(1);
  }
  log(`${name}: done`);
}

// Any throw exits non-zero, which is what fires the systemd OnFailure alert.
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
