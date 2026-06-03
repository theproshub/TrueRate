'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

/**
 * Admin review actions for Business Claims (migration 011).
 *
 * Only admins may change a claim's status — enforced twice: `requireAdmin`
 * gates the action, and the business_claims_admin_all RLS policy requires
 * is_admin() for any UPDATE. A claimant can never approve their own claim.
 *
 * These return a result object rather than redirecting, since the admin UI
 * (an /admin/business-claims review queue) isn't built yet — wire them to it
 * later. `revalidatePath` is already pointed at that future route.
 */

export type ClaimReviewResult = { ok: true } | { ok: false; error: string };

async function review(
  id: string,
  status: 'approved' | 'rejected',
  reviewNote?: string,
): Promise<ClaimReviewResult> {
  const { user } = await requireAdmin('/admin/business-claims');
  const sb = await createClient();

  const { error } = await sb
    .from('business_claims')
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_note: reviewNote ?? null,
    })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/business-claims');
  return { ok: true };
}

/** Approve a claim — transfers control of the listing to the claimant. */
export async function approveBusinessClaim(id: string, reviewNote?: string): Promise<ClaimReviewResult> {
  return review(id, 'approved', reviewNote);
}

/** Reject a claim. */
export async function rejectBusinessClaim(id: string, reviewNote?: string): Promise<ClaimReviewResult> {
  return review(id, 'rejected', reviewNote);
}
