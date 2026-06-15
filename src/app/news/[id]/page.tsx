import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { newsItems } from '@/data/news';
import { notFound } from 'next/navigation';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';
import { Heading, Text } from '@/components/ui';
import { publicClient } from '@/lib/supabase/public';
import { renderMarkdown } from '@/lib/markdown';
import { isArticleSaved } from '@/lib/saved-articles';
import SaveArticleButton from '@/components/SaveArticleButton';

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

interface DbArticle {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  body: string;
  hero_image: string | null;
  hero_alt: string | null;
  published_at: string | null;
  updated_at: string;
  category_id: string | null;
  category: { slug: string; label: string } | null;
  author:   { name: string }                | null;
  source_name?: string | null;
  source_url?: string | null;
}

const fetchDbArticle = cache(async (slug: string): Promise<DbArticle | null> => {
  const { data } = await publicClient
    .from('articles')
    .select(
      `id, slug, title, dek, body, hero_image, hero_alt, published_at, updated_at,
       source_name, source_url, category_id,
       category:categories(slug, label),
       author:authors(name)`,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return (data as unknown as DbArticle | null) ?? null;
});

export const revalidate = 3600; // 1 hr — articles rarely change after publish

export function generateStaticParams() {
  // Only the static seed articles are statically generated. DB-sourced
  // articles render on demand (Next.js falls through to SSR for unknown ids).
  return newsItems.map(item => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  const dbArticle = await fetchDbArticle(id);
  if (dbArticle) {
    const description = dbArticle.dek ?? dbArticle.title;
    return {
      title: dbArticle.title,
      description: description.length > 160 ? description.slice(0, 157) + '…' : description,
      alternates: { canonical: `/news/${id}` },
      openGraph: {
        title: dbArticle.title,
        description,
        type: 'article',
        publishedTime: dbArticle.published_at ?? undefined,
        authors: dbArticle.author ? [dbArticle.author.name] : undefined,
        siteName: 'TrueRate',
        images: dbArticle.hero_image ? [{ url: dbArticle.hero_image, alt: dbArticle.hero_alt ?? dbArticle.title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: dbArticle.title,
        description,
      },
    };
  }

  const item = newsItems.find(n => n.id === id);
  if (!item) return { title: 'Article Not Found' };
  const description = item.summary.length > 160 ? item.summary.slice(0, 157) + '…' : item.summary;
  return {
    title: item.title,
    description,
    alternates: { canonical: `/news/${id}` },
    openGraph: {
      title: item.title,
      description,
      type: 'article',
      publishedTime: item.date,
      authors: item.author ? [item.author] : undefined,
      siteName: 'TrueRate',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Try DB by slug — render DB version if found
  const dbArticle = await fetchDbArticle(id);
  if (dbArticle) {
    return <DbArticleView article={dbArticle} />;
  }

  // 2. Fall back to static seed
  const item = newsItems.find(n => n.id === id);
  if (!item) notFound();

  const related = newsItems.filter(n => n.id !== id && n.category === item.category).slice(0, 3);
  const relatedIds = new Set(related.map(r => r.id));
  const moreStories = newsItems.filter(n => n.id !== id && !relatedIds.has(n.id)).slice(0, 8);

  return (
    <div className="bg-brand-surface min-h-screen">
      <main className="mx-auto max-w-container px-4 py-6">

        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: item.category.charAt(0).toUpperCase() + item.category.slice(1), color: getCatColor(item.category) }]} light />

        <div className="flex gap-6 items-start">

          {/* ── Left: Trending + Markets + In Focus ── */}
          <TrendingPanel />

          {/* ── Centre: article ── */}
          <div className="flex-1 min-w-0 pb-8">

            {/* Article header */}
            <div className="pb-8 mb-8 border-b border-gray-100">
              <div className={`text-2xs font-bold uppercase tracking-widest mb-2 ${getCatColor(item.category)}`}>
                {item.category}
              </div>

              <Heading level={2} as="h1" className="sm:text-3xl font-bold leading-tight text-gray-900 mb-4">{item.title}</Heading>

              <div className="flex flex-wrap items-center gap-2 text-base text-gray-500 pb-5 border-b border-gray-100 mb-6">
                {item.author && <span className="font-semibold text-gray-700">{item.author}</span>}
                {item.author && <span>·</span>}
                <span>{item.source}</span>
                <span>·</span>
                <span>{timeAgo(item.date)}</span>
                {item.readTime && <><span>·</span><span>{item.readTime}</span></>}
              </div>

              <HeroVisual category={item.category} id={item.id} className="w-full rounded-xl h-[260px] sm:h-[340px] mb-8" />

              <div className="text-md leading-[1.8] text-gray-600 space-y-5 mb-8">
                {item.body?.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Save button */}
              <div className="mb-6">
                <SaveArticleButton
                  articleId={item.id}
                  initialSaved={false}
                  authed={false}
                  returnTo={`/news/${item.id}`}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {[item.category, 'Liberia', 'West Africa', 'Economy'].map(tag => (
                  <Link key={tag} href="/news" className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Related</Heading>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">More ›</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.id} href={`/news/${r.id}`} className="group no-underline">
                      <div className="overflow-hidden rounded-xl mb-2.5">
                        <NewsThumbnail category={r.category} id={r.id} className="w-full h-[110px]" />
                      </div>
                      <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(r.category)} mb-1`}>{r.category}</div>
                      <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{r.title}</Heading>
                      <div className="text-xs text-gray-400">{r.source} · {timeAgo(r.date)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More Stories */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">More Stories</Heading>
                <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">All news ›</Link>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {moreStories.map(s => (
                  <Link key={s.id} href={`/news/${s.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      <NewsThumbnail category={s.category} id={s.id} className="h-[70px] w-[105px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)} mb-1`}>{s.category}</div>
                      <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{s.title}</Heading>
                      <Text as="p" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400">{s.source} · {timeAgo(s.date)}</Text>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right: Newsletter + Events + Most Read + Premium ── */}
          <RightRail />

        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DB-sourced article rendering. Mirrors the static layout above so the visual
// experience is identical regardless of where the article is stored.
// ─────────────────────────────────────────────────────────────────────────────

async function fetchRelatedDbArticles(
  categoryId: string | null,
  excludeId: string,
  limit: number,
) {
  if (!categoryId) return [];
  const { data } = await publicClient
    .from('articles')
    .select('id, slug, title, hero_image, hero_alt, published_at, category:categories(slug, label)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Array<{
    id: string; slug: string; title: string; hero_image: string | null;
    hero_alt: string | null; published_at: string | null;
    category: { slug: string; label: string } | null;
  }>;
}

async function fetchMoreDbArticles(excludeIds: string[], limit: number) {
  let q = publicClient
    .from('articles')
    .select('id, slug, title, hero_image, hero_alt, published_at, category:categories(slug, label)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (excludeIds.length > 0) {
    q = q.not('id', 'in', `(${excludeIds.map(id => `"${id}"`).join(',')})`);
  }
  const { data } = await q;
  return (data ?? []) as unknown as Array<{
    id: string; slug: string; title: string; hero_image: string | null;
    hero_alt: string | null; published_at: string | null;
    category: { slug: string; label: string } | null;
  }>;
}

async function DbArticleView({ article }: { article: DbArticle }) {
  const categorySlug  = article.category?.slug  ?? 'news';
  const categoryLabel = article.category?.label ?? 'News';
  const bodyHtml      = renderMarkdown(article.body);
  const dateIso       = article.published_at ?? article.updated_at;

  // Fetch related articles, more stories, and saved state in parallel.
  // category_id is now included in the article SELECT, eliminating the
  // extra categories lookup that previously created a waterfall.
  const categoryId = article.category_id;

  const [related, { authed, saved }] = await Promise.all([
    fetchRelatedDbArticles(categoryId, article.id, 3),
    isArticleSaved(article.id),
  ]);
  const moreStories = await fetchMoreDbArticles(
    [article.id, ...related.map(r => r.id)],
    8,
  );

  return (
    <div className="bg-brand-surface min-h-screen">
      <main className="mx-auto max-w-container px-4 py-6">

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
            { label: categoryLabel, color: getCatColor(categorySlug) },
          ]}
          light
        />

        <div className="flex gap-6 items-start">

          <TrendingPanel />

          <div className="flex-1 min-w-0 pb-8">

            <article className="pb-8 mb-8 border-b border-gray-100">
              <div className={`text-2xs font-bold uppercase tracking-widest mb-2 ${getCatColor(categorySlug)}`}>
                {categoryLabel}
              </div>

              <Heading
                level={2}
                as="h1"
                className="sm:text-3xl font-bold leading-tight text-gray-900 mb-4"
              >
                {article.title}
              </Heading>

              {article.dek && (
                <p className="text-lg leading-relaxed text-gray-700 mb-5">
                  {article.dek}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-base text-gray-500 pb-5 border-b border-gray-100 mb-6">
                {article.author && (
                  <>
                    <span className="font-semibold text-gray-700">{article.author.name}</span>
                    <span>·</span>
                  </>
                )}
                {article.source_name ? (
                  article.source_url ? (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-brand-accent-ink underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                    >
                      {article.source_name}
                    </a>
                  ) : (
                    <span>{article.source_name}</span>
                  )
                ) : (
                  <span>TrueRate</span>
                )}
                <span>·</span>
                <span>{timeAgo(dateIso)}</span>
              </div>

              {article.hero_image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={article.hero_image}
                  alt={article.hero_alt ?? ''}
                  className="w-full rounded-xl h-[260px] sm:h-[340px] mb-8 object-cover"
                />
              ) : (
                <HeroVisual category={categorySlug} className="w-full rounded-xl h-[260px] sm:h-[340px] mb-8" />
              )}

              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              {/* Save button */}
              <div className="mt-8 mb-6">
                <SaveArticleButton
                  articleId={article.id}
                  initialSaved={saved}
                  authed={authed}
                  returnTo={`/news/${article.slug}`}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-5 mt-8 border-t border-gray-100">
                {[categoryLabel, 'Liberia', 'West Africa', 'Economy'].map(tag => (
                  <Link
                    key={tag}
                    href="/news"
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </article>

            {related.length > 0 && (
              <section aria-labelledby="related-heading" className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <Heading level={6} as="h2" id="related-heading" className="text-gray-900 uppercase tracking-[0.12em]">Related</Heading>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">More ›</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => {
                    const catSlug = r.category?.slug ?? 'news';
                    const catLabel = r.category?.label ?? 'News';
                    return (
                      <Link key={r.id} href={`/news/${r.slug}`} className="group no-underline">
                        <div className="overflow-hidden rounded-xl mb-2.5">
                          {r.hero_image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={r.hero_image} alt={r.hero_alt ?? ''} className="w-full h-[110px] object-cover" />
                          ) : (
                            <NewsThumbnail category={catSlug} className="w-full h-[110px]" />
                          )}
                        </div>
                        <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(catSlug)} mb-1`}>{catLabel}</div>
                        <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{r.title}</Heading>
                        <div className="text-xs text-gray-400">TrueRate · {r.published_at ? timeAgo(r.published_at) : ''}</div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {moreStories.length > 0 && (
              <section aria-labelledby="more-heading">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                  <Heading level={6} as="h2" id="more-heading" className="text-gray-900 uppercase tracking-[0.12em]">More Stories</Heading>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">All news ›</Link>
                </div>
                <div className="flex flex-col divide-y divide-gray-100">
                  {moreStories.map(s => {
                    const catSlug = s.category?.slug ?? 'news';
                    const catLabel = s.category?.label ?? 'News';
                    return (
                      <Link key={s.id} href={`/news/${s.slug}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
                        <div className="shrink-0 overflow-hidden rounded-lg">
                          {s.hero_image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={s.hero_image} alt={s.hero_alt ?? ''} className="h-[70px] w-[105px] object-cover" />
                          ) : (
                            <NewsThumbnail category={catSlug} className="h-[70px] w-[105px]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(catSlug)} mb-1`}>{catLabel}</div>
                          <Heading level={6} as="h3" className="text-sm leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{s.title}</Heading>
                          <Text as="p" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400">TrueRate · {s.published_at ? timeAgo(s.published_at) : ''}</Text>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

          </div>

          <RightRail />

        </div>
      </main>
    </div>
  );
}
