import { createAdminClient } from '@/lib/supabase/admin';
import { publicClient } from '@/lib/supabase/public';

/**
 * Re-exports of the centralized Supabase clients for feed table access.
 * The Database type now includes content_cards / generation_log (migration 008+).
 */

export function feedAdminClient() {
  return createAdminClient();
}

export function feedPublicClient() {
  return publicClient;
}
