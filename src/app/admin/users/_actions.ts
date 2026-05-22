'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';

/**
 * Grant or revoke the admin flag on a user's profile.
 *
 * Guards:
 *  - Caller must be an admin (requireAdmin).
 *  - An admin cannot remove their own admin flag (prevents accidental lockout).
 */
export async function setUserAdmin(userId: string, makeAdmin: boolean) {
  const { user } = await requireAdmin('/admin/users');

  if (!makeAdmin && userId === user.id) {
    return redirect(
      `/admin/users?error=${encodeURIComponent(
        "You can't remove your own admin access. Ask another admin to do it.",
      )}`,
    );
  }

  // Upsert so users who predate the on_auth_user_created trigger still get a
  // profile row. Only touches id + is_admin; display_name etc. are untouched.
  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .upsert({ id: userId, is_admin: makeAdmin }, { onConflict: 'id' });

  if (error) {
    return redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/users');
  redirect(`/admin/users?ok=${makeAdmin ? 'granted' : 'revoked'}`);
}

/**
 * Backfill a profile row for a user that doesn't have one yet (e.g. signed up
 * before the auto-provision trigger existed). Uses the cookie client so RLS
 * confirms the caller is allowed.
 */
export async function ensureProfile(userId: string) {
  await requireAdmin('/admin/users');
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id' });
  if (error) {
    return redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/admin/users');
  redirect('/admin/users?ok=profile_created');
}
