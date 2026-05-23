'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { feedAdminClient } from '@/lib/feed/db';
import { requireAdmin } from '@/lib/auth/admin';

// Breaking cards are time-sensitive; everything else stays live until pulled.
const TTL_HOURS: Record<string, number> = { breaking: 24 };

export async function publishCard(id: string) {
  await requireAdmin('/admin/feed');
  const supabase = feedAdminClient();

  const { data: card, error: readErr } = await supabase
    .from('content_cards')
    .select('type')
    .eq('id', id)
    .single();
  if (readErr || !card) {
    return redirect(`/admin/feed?error=${encodeURIComponent(readErr?.message ?? 'Card not found')}`);
  }

  const ttl = TTL_HOURS[(card as { type: string }).type];
  const expires_at = ttl ? new Date(Date.now() + ttl * 3600_000).toISOString() : null;

  const { error } = await supabase
    .from('content_cards')
    .update({ status: 'published', published_at: new Date().toISOString(), expires_at })
    .eq('id', id);
  if (error) {
    return redirect(`/admin/feed?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/feed');
  redirect('/admin/feed?ok=published');
}

export async function unpublishCard(id: string) {
  await requireAdmin('/admin/feed');
  const supabase = feedAdminClient();
  const { error } = await supabase
    .from('content_cards')
    .update({ status: 'draft', published_at: null, expires_at: null })
    .eq('id', id);
  if (error) {
    return redirect(`/admin/feed?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/admin/feed');
  redirect('/admin/feed?ok=unpublished');
}

export async function deleteCard(id: string) {
  await requireAdmin('/admin/feed');
  const supabase = feedAdminClient();
  const { error } = await supabase.from('content_cards').delete().eq('id', id);
  if (error) {
    return redirect(`/admin/feed?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath('/admin/feed');
  redirect('/admin/feed?ok=deleted');
}
