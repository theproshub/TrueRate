'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

type FindingStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface ReviewFindingState {
  error?: string;
}

export async function reviewFinding(
  _prev: ReviewFindingState,
  form: FormData,
): Promise<ReviewFindingState> {
  await requireAdmin('/admin/data-integrity');

  const id = form.get('id');
  const status = form.get('status');
  const note = form.get('resolution_note');

  if (typeof id !== 'string' || !id) return { error: 'Missing finding id.' };
  if (
    typeof status !== 'string' ||
    !['open', 'reviewing', 'resolved', 'dismissed'].includes(status)
  ) {
    return { error: `Invalid status: ${String(status)}` };
  }

  const supabase = await createClient();
  const patch: {
    status: FindingStatus;
    resolution_note: string | null;
    resolved_at: string | null;
  } = {
    status: status as FindingStatus,
    resolution_note: typeof note === 'string' && note.trim() ? note.trim() : null,
    resolved_at:
      status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from('data_integrity_findings')
    .update(patch)
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/data-integrity');
  revalidatePath('/admin');
  return {};
}
