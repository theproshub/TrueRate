import { NextResponse } from 'next/server';
import { publicClient } from '@/lib/supabase/public';

export const revalidate = 0;

/**
 * Slim published-article index for the global search typeahead. Returns just
 * the fields the SearchBox filters/renders, mapped into the NewsItem-compatible
 * shape (id === slug) so existing client code works unchanged.
 */
export async function GET() {
  const { data, error } = await publicClient
    .from('articles')
    .select('slug, title, dek, source_name, category:categories(slug)')
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
    category: { slug: string } | null;
  }) => ({
    id: a.slug,
    title: a.title,
    summary: a.dek ?? '',
    category: a.category?.slug ?? 'economy',
    source: a.source_name ?? 'TrueRate',
  }));

  return NextResponse.json(
    { items },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
