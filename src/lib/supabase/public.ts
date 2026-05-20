import { createClient } from '@supabase/supabase-js';

/**
 * Module-level Supabase client for server-side reads of publicly-readable
 * tables (anything with `select using (true)` RLS). No session, no cookies,
 * safe to share across requests inside a single Fluid Compute instance.
 *
 * Do NOT use for user-scoped queries (watchlists, alerts, drafts) — those
 * need the cookie-aware client from `./server.ts` so RLS gets the right
 * auth.uid().
 */
export const publicClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
