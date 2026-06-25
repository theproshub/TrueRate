import { publicClient } from '@/lib/supabase/public';

const SITE_URL = 'https://truerateliberia.com';

export async function GET() {
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  let articles: { slug: string; title: string; published_at: string }[] = [];
  try {
    const { data } = await publicClient
      .from('articles')
      .select('slug, title, published_at')
      .eq('status', 'published')
      .gte('published_at', twoDaysAgo)
      .order('published_at', { ascending: false })
      .limit(1000);

    if (data) articles = data as typeof articles;
  } catch {
    // Ship an empty news sitemap if Supabase is unreachable.
  }

  const entries = articles
    .map((a) => {
      const pubDate = new Date(a.published_at).toISOString();
      const escaped = a.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      return `  <url>
    <loc>${SITE_URL}/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>TrueRate</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escaped}</news:title>
    </news:news>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  });
}
