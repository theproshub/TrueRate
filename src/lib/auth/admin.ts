import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-only guard for /admin/* routes.
 *
 * - Redirects unauthenticated users to /sign-in?next=<path>
 * - Redirects signed-in non-admins to /?error=admin_only
 * - Returns the user + profile to the caller when allowed
 *
 * Call this at the top of any admin server component or server action.
 */
export async function requireAdmin(nextPath = '/admin') {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/?error=admin_only');
  }

  return { user, profile };
}
