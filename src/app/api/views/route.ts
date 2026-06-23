import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { publicClient } from '@/lib/supabase/public';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export const revalidate = 0;

const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed, remaining } = rateLimit(`api-views:${ip}`, 120, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(remaining, 120, 60_000) },
    );
  }

  let slug: string;
  try {
    const body = await request.json();
    slug = body.slug;
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 });
  }

  const { data: article } = await publicClient
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const viewerHash = hashIp(ip);
  const cutoff = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();

  // Dedup: skip if same viewer saw this article within the window
  const { data: recent } = await publicClient
    .from('article_views')
    .select('id')
    .eq('article_id', article.id)
    .eq('viewer_hash', viewerHash)
    .gte('viewed_at', cutoff)
    .limit(1);

  if (recent && recent.length > 0) {
    return NextResponse.json({ ok: true, dedup: true });
  }

  // Record the view and bump the counter
  const [viewResult, countResult] = await Promise.all([
    publicClient
      .from('article_views')
      .insert({ article_id: article.id, viewer_hash: viewerHash }),
    publicClient.rpc('increment_view_count', { target_id: article.id }),
  ]);

  if (viewResult.error || countResult.error) {
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
