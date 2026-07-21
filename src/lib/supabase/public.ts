import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Module-level Supabase client for server-side reads of publicly-readable
 * tables (anything with `select using (true)` RLS). No session, no cookies,
 * safe to share across requests inside a single Fluid Compute instance.
 *
 * Do NOT use for user-scoped queries (watchlists, alerts, drafts) — those
 * need the cookie-aware client from `./server.ts` so RLS gets the right
 * auth.uid().
 */
// Fall back to inert placeholders when the env is absent so module evaluation
// never throws — e.g. preview builds on branches that don't carry the Supabase
// vars (they're scoped to `develop`). Where the env is configured (production,
// develop) the real values are used; where it isn't, callers already guard
// query failures and degrade to fallback data (see news-sitemap route,
// getNewsItems). This keeps `supabaseUrl is required` from crashing the build.
export const publicClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
  { auth: { persistSession: false, autoRefreshToken: false } },
);
