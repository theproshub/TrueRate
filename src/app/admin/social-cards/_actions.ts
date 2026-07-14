'use server';

import { publicClient } from '@/lib/supabase/public';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';
import { fetchLiveRates, toLRDRates } from '@/domain/markets/exchange';
import { fetchCommodities, type CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './_components/prefill';

const BUCKET = 'article-images';
const HERO_FOLDER = 'heroes';

export interface RatesPayload {
  date: string | null;
  lookup: Record<string, number>;
  stale: boolean;
}

/** Same query as /api/news, limited to the 12 the panel shows. */
export async function refreshStories(): Promise<StoryItem[]> {
  await requireAdmin();
  const { data, error } = await publicClient
    .from('articles')
    .select('slug, title, dek, source_name, hero_image, category:categories(slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(12);
  if (error || !data) return [];
  return data.map((a: {
    slug: string;
    title: string;
    dek: string | null;
    source_name: string | null;
    hero_image: string | null;
    category: { slug: string } | null;
  }) => ({
    slug: a.slug,
    title: a.title,
    summary: a.dek ?? '',
    category: a.category?.slug ?? 'economy',
    source: a.source_name ?? 'TrueRate',
    image: a.hero_image ?? undefined,
  }));
}

export async function refreshRates(): Promise<RatesPayload> {
  await requireAdmin();
  try {
    const live = await fetchLiveRates();
    if (live.stale) return { date: null, lookup: {}, stale: true };
    return { date: live.date, lookup: toLRDRates(live), stale: false };
  } catch {
    return { date: null, lookup: {}, stale: true };
  }
}

export async function refreshCommodities(): Promise<CommodityQuote[]> {
  await requireAdmin();
  try {
    return await fetchCommodities();
  } catch {
    return [];
  }
}

/** Newest hero images from the article-images bucket, as public URLs. */
export async function listStorageImages(): Promise<{ name: string; url: string }[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(HERO_FOLDER, { limit: 60, sortBy: { column: 'created_at', order: 'desc' } });
  if (error || !data) return [];
  return data
    .filter((f) => f.name && !f.name.startsWith('.'))
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(`${HERO_FOLDER}/${f.name}`).data.publicUrl,
    }));
}
