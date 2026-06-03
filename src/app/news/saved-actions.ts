'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { currentUserId } from '@/lib/saved-articles';

export type SavedActionResult =
  | { ok: true; saved: boolean }
  | { ok: false; reason: 'unauthenticated' | 'error' };

/**
 * Toggle whether the signed-in user has saved an article.
 * Idempotent: saving an already-saved article is a no-op add; removing a
 * missing one is a no-op remove. RLS guarantees users only touch their own
 * rows (the user_id on insert must equal auth.uid()).
 */
export async function toggleSavedArticle(articleId: string): Promise<SavedActionResult> {
  const sb = await createClient();
  const userId = await currentUserId(sb);
  if (!userId) return { ok: false, reason: 'unauthenticated' };

  const { data: existing, error: readErr } = await sb
    .from('saved_articles')
    .select('id')
    .eq('article_id', articleId)
    .maybeSingle();
  if (readErr) return { ok: false, reason: 'error' };

  if (existing) {
    const { error } = await sb.from('saved_articles').delete().eq('id', existing.id);
    if (error) return { ok: false, reason: 'error' };
    revalidatePath('/saved');
    return { ok: true, saved: false };
  }

  const { error } = await sb
    .from('saved_articles')
    .insert({ user_id: userId, article_id: articleId });
  if (error) return { ok: false, reason: 'error' };
  revalidatePath('/saved');
  return { ok: true, saved: true };
}
