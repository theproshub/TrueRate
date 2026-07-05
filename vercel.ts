import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',

  crons: [
    { path: '/api/cron/generate-feed', schedule: '0 6 * * *' },
    { path: '/api/cron/snapshot-quotes', schedule: '30 22 * * *' },
    { path: '/api/cron/sync-cbl', schedule: '5 6 * * *' },
  ],
};
