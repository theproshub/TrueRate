import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',

  // No crons. All three scheduled jobs (sync-cbl, snapshot-quotes,
  // generate-feed) run as systemd timers on the droplet — see
  // infra/systemd/README.md. The /api/cron/* routes remain as authenticated
  // manual triggers and share their implementation with the timers via
  // src/lib/jobs/.
};
