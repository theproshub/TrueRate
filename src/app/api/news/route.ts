import { NextRequest, NextResponse } from 'next/server';
import { publicClient } from '@/lib/supabase/public';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed, remaining } = await rateLimit(`api-news:${ip}`, 60, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(remaining, 60, 60_000) },
    );
  }

  const { data, error } = await publicClient
    .from('articles')
    .select('slug, title, dek, source_name, hero_image, category:categories(slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  const items = (data ?? []).map((a: {
    slug: string;
    title: string;
    dek: string | null;
    source_name: string | null;
    hero_image: string | null;
    category: { slug: string } | null;
  }) => ({
    id: a.slug,
    title: a.title,
    summary: a.dek ?? '',
    category: a.category?.slug ?? 'economy',
    source: a.source_name ?? 'TrueRate',
    image: a.hero_image ?? undefined,
  }));

  return NextResponse.json(
    { items },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
