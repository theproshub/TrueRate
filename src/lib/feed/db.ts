import { createClient } from '@supabase/supabase-js';

/**
 * Supabase clients for the content-feed tables (content_cards,
 * markets_snapshot, generation_log).
 *
 * These are intentionally NOT generic over the generated `Database` type:
 * those tables were added in migration 008, which postdates the current
 * src/lib/supabase/types.ts. Once 008 is applied and types are regenerated
 * (`npx supabase gen types typescript --project-id <ref> --schema public`),
 * switch these to the typed clients in ./client / ./admin and delete this file.
 */

export function feedAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function feedPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
