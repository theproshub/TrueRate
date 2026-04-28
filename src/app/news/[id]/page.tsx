import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { newsItems } from '@/data/news';
import { notFound } from 'next/navigation';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';

function timeAgo(d: string) {
  const days = Math.floor((new Date('2026-04-01').getTime() - new Date(d).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function generateStaticParams() {
  return newsItems.map(item => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = newsItems.find(n => n.id === id);
  if (!item) return { title: 'Article Not Found — TrueRate' };
  const description = item.summary.length > 160 ? item.summary.slice(0, 157) + '…' : item.summary;
  return {
    title: `${item.title} — TrueRate`,
    description,
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
  const item = newsItems.find(n => n.id === id);
  if (!item) notFound();

  const related = newsItems.filter(n => n.id !== id && n.category === item.category).slice(0, 3);
  const relatedIds = new Set(related.map(r => r.id));
  const moreStories = newsItems.filter(n => n.id !== id && !relatedIds.has(n.id)).slice(0, 8);

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">

        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: item.category.charAt(0).toUpperCase() + item.category.slice(1), color: getCatColor(item.category) }]} light />

        <div className="flex gap-6 items-start">

          {/* ── Left: Trending + Markets + In Focus ── */}
          <TrendingPanel />

          {/* ── Centre: article ── */}
          <div className="flex-1 min-w-0 pb-8">

            {/* Article header */}
            <div className="pb-8 mb-8 border-b border-gray-100">
              <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${getCatColor(item.category)}`}>
                {item.category}
              </div>

              <h1 className="text-[22px] sm:text-[32px] font-black leading-tight text-gray-900 mb-4">{item.title}</h1>

              <div className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 pb-5 border-b border-gray-100 mb-6">
                {item.author && <span className="font-semibold text-gray-700">{item.author}</span>}
                {item.author && <span>·</span>}
                <span>{item.source}</span>
                <span>·</span>
                <span>{timeAgo(item.date)}</span>
                {item.readTime && <><span>·</span><span>{item.readTime}</span></>}
              </div>

              <HeroVisual category={item.category} className="w-full rounded-xl h-[260px] sm:h-[340px] mb-8" />

              <div className="text-[14px] leading-[1.8] text-gray-600 space-y-5 mb-8">
                {item.body?.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {[item.category, 'Liberia', 'West Africa', 'Economy'].map(tag => (
                  <Link key={tag} href="/news" className="rounded-lg border border-gray-200 px-3 py-1 text-[12px] text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Related</h2>
                  <Link href="/news" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors no-underline">More ›</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.id} href={`/news/${r.id}`} className="group no-underline">
                      <div className="overflow-hidden rounded-xl mb-2.5">
                        <NewsThumbnail category={r.category} className="w-full h-[110px]" />
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(r.category)} mb-1`}>{r.category}</div>
                      <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{r.title}</h3>
                      <div className="text-[11px] text-gray-400">{r.source} · {timeAgo(r.date)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More Stories */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">More Stories</h2>
                <Link href="/news" className="text-[12px] text-gray-400 hover:text-gray-700 transition-colors no-underline">All news ›</Link>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {moreStories.map(s => (
                  <Link key={s.id} href={`/news/${s.id}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      <NewsThumbnail category={s.category} className="h-[70px] w-[105px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(s.category)} mb-1`}>{s.category}</div>
                      <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                      <p className="text-[12px] text-gray-400">{s.source} · {timeAgo(s.date)}</p>
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
