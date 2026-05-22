import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Service-role Supabase client. Bypasses RLS and can use the auth admin API
 * (listing users, reading emails from auth.users). SERVER-ONLY — never import
 * this into a client component or expose the key to the browser.
 *
 * Use sparingly and only behind an admin gate (requireAdmin / proxy gate).
 * For ordinary user-scoped reads/writes prefer the cookie-aware client so RLS
 * still applies.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'createAdminClient requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
