import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Business Claim — admin review read layer (migration 011, table
 * `business_claims`).
 *
 * A claim is a request by a user to control a Business Directory listing
 * (`public.issuers`). These helpers power the admin review queue.
 *
 * RLS (business_claims_select_own_or_admin): an admin session sees ALL claims
 * including the private contact_* fields; a non-admin sees only their own. So
 * these helpers are SAFE to call from a non-admin context (they simply return
 * that user's own claims), but they are intended to run behind `requireAdmin`
 * in an /admin route. Reads go through the cookie-aware server client so
 * `is_admin()` is evaluated for the current session.
 */

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export interface BusinessClaimRow {
  /** business_claims.id */
  id: string;
  status: ClaimStatus;
  issuerId: string;
  issuerName: string | null;
  issuerSlug: string | null;
  /** auth.users id of the claimant */
  claimantUserId: string;
  // Private verification data (admin-visible via RLS).
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  roleAtBusiness: string | null;
  evidenceUrl: string | null;
  note: string | null;
  // Review metadata.
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const SELECT = `
  id, status, issuer_id, user_id,
  contact_name, contact_email, contact_phone, role_at_business,
  evidence_url, note, reviewed_by, reviewed_at, review_note,
  created_at, updated_at,
  issuer:issuers ( name, slug )
`;

interface RawClaim {
  id: string;
  status: ClaimStatus;
  issuer_id: string;
  user_id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  role_at_business: string | null;
  evidence_url: string | null;
  note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string | null;
  updated_at: string | null;
  issuer: { name: string; slug: string } | null;
}

function mapRow(r: RawClaim): BusinessClaimRow {
  return {
    id: r.id,
    status: r.status,
    issuerId: r.issuer_id,
    issuerName: r.issuer?.name ?? null,
    issuerSlug: r.issuer?.slug ?? null,
    claimantUserId: r.user_id,
    contactName: r.contact_name,
    contactEmail: r.contact_email,
    contactPhone: r.contact_phone,
    roleAtBusiness: r.role_at_business,
    evidenceUrl: r.evidence_url,
    note: r.note,
    reviewedBy: r.reviewed_by,
    reviewedAt: r.reviewed_at,
    reviewNote: r.review_note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Claims for the admin review queue, newest first.
 * @param status filter by status, or 'all'. Defaults to 'pending' (the queue).
 */
export async function listBusinessClaims(
  status: ClaimStatus | 'all' = 'pending',
): Promise<BusinessClaimRow[]> {
  const sb = await createClient();
  let q = sb.from('business_claims').select(SELECT).order('created_at', { ascending: false });
  if (status !== 'all') q = q.eq('status', status);

  const { data, error } = await q;
  if (error || !data) return [];
  return (data as unknown as RawClaim[]).map(mapRow);
}

/** A single claim with full detail. Null if not found / not visible. */
export async function getBusinessClaim(id: string): Promise<BusinessClaimRow | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from('business_claims')
    .select(SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as unknown as RawClaim);
}
