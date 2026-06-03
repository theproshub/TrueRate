'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { currentUserId, resolveRef, ensureDefaultGroup } from '@/lib/analytics/watchlist';

export type WatchlistActionResult =
  | { ok: true; watching: boolean }
  | { ok: false; reason: 'unauthenticated' | 'unknown-item' | 'error' };

/**
 * Toggle a ref id (ticker or macro series_id) in the signed-in user's default
 * watchlist group. Idempotent: adding an existing item is a no-op add; removing
 * a missing item is a no-op remove. RLS guarantees users only touch their own.
 */
export async function toggleWatchlistItem(refId: string): Promise<WatchlistActionResult> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { ok: false, reason: 'unauthenticated' };

  const target = await resolveRef(sb, refId);
  if (!target) return { ok: false, reason: 'unknown-item' };

  const groupId = await ensureDefaultGroup(sb, userId);
  if (!groupId) return { ok: false, reason: 'error' };

  const col = 'symbol_id' in target ? 'symbol_id' : 'macro_id';
  const val = 'symbol_id' in target ? target.symbol_id : target.macro_id;

  // Already present?
  const { data: existing, error: readErr } = await sb
    .from('watchlist_items')
    .select('id')
    .eq('group_id', groupId)
    .eq(col, val)
    .maybeSingle();
  if (readErr) return { ok: false, reason: 'error' };

  if (existing) {
    const { error } = await sb.from('watchlist_items').delete().eq('id', existing.id);
    if (error) return { ok: false, reason: 'error' };
    revalidatePath('/analytics');
    revalidatePath('/watchlist');
    return { ok: true, watching: false };
  }

  const insertRow: { group_id: string; symbol_id?: string; macro_id?: string } = { group_id: groupId };
  if ('symbol_id' in target) insertRow.symbol_id = target.symbol_id;
  else insertRow.macro_id = target.macro_id;
  const { error } = await sb.from('watchlist_items').insert(insertRow);
  if (error) return { ok: false, reason: 'error' };
  revalidatePath('/analytics');
  revalidatePath('/watchlist');
  return { ok: true, watching: true };
}

/** Explicit remove (used by the /watchlist remove buttons). */
export async function removeWatchlistItem(refId: string): Promise<WatchlistActionResult> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { ok: false, reason: 'unauthenticated' };

  const target = await resolveRef(sb, refId);
  if (!target) return { ok: false, reason: 'unknown-item' };

  const col = 'symbol_id' in target ? 'symbol_id' : 'macro_id';
  const val = 'symbol_id' in target ? target.symbol_id : target.macro_id;

  const { error } = await sb.from('watchlist_items').delete().eq(col, val);
  if (error) return { ok: false, reason: 'error' };
  revalidatePath('/analytics');
  revalidatePath('/watchlist');
  return { ok: true, watching: false };
}
