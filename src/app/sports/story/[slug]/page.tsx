import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';
import { TrendingPanel, RightRail } from '@/components/NewsSidebars';
import { getCatColor } from '@/lib/category-colors';
import {
  SPORTS_STORIES,
  getSportsStory,
  type SportsSection,
} from '@/data/sports-stories';

const SECTION_LABELS: Record<SportsSection, { label: string; href: string }> = {
  main:        { label: 'Sports',            href: '/sports' },
  sponsorship: { label: 'Sponsorship',       href: '/sports/sponsorship' },
  transfers:   { label: 'Transfers & Deals', href: '/sports/transfers-deals' },
  broadcast:   { label: 'Broadcast Rights',  href: '/sports/broadcast-rights' },
};

export function generateStaticParams() {
  return SPORTS_STORIES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getSportsStory(slug);
  if (!story) return { title: 'Story not found — TrueRate Sports' };
  const description = story.summary.length > 160 ? story.summary.slice(0, 157) + '…' : story.summary;
  return {
    title: `${story.title} — TrueRate Sports`,
    description,
    openGraph: {
      title: story.title,
      description,
      type: 'article',
      siteName: 'TrueRate',
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description,
    },
  };
}

export default async function SportsStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getSportsStory(slug);
  if (!story) notFound();

  const section = SECTION_LABELS[story.section];
  const sameSection = SPORTS_STORIES.filter(s => s.slug !== story.slug && s.section === story.section);
  const related = sameSection.slice(0, 3);
  const relatedSlugs = new Set(related.map(r => r.slug));
  const moreStories = SPORTS_STORIES
    .filter(s => s.slug !== story.slug && !relatedSlugs.has(s.slug))
    .slice(0, 8);

  return (
    <div className="bg-brand-surface min-h-screen">
      <main className="mx-auto max-w-container px-4 py-6">

        <Breadcrumb
          light
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sports', href: '/sports' },
            ...(story.section === 'main' ? [] : [{ label: section.label, href: section.href }]),
            { label: story.category, color: getCatColor(story.category) },
          ]}
        />

        <div className="flex gap-6 items-start">

          <TrendingPanel />

          <article className="flex-1 min-w-0 pb-8">

            <div className="pb-8 mb-8 border-b border-gray-100">
              <div className={`text-2xs font-bold uppercase tracking-widest mb-2 ${getCatColor(story.category)}`}>
                {story.category}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 mb-4">
                {story.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-base text-gray-500 pb-5 border-b border-gray-100 mb-6">
                <span className="font-semibold text-gray-700">{story.source}</span>
                <span>·</span>
                <span>{story.time}</span>
              </div>

              <HeroVisual category={story.category} className="w-full rounded-xl h-[260px] sm:h-[340px] mb-8" />

              <div className="text-md leading-[1.8] text-gray-600 space-y-5 mb-8">
                {story.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {Array.from(new Set([story.category, section.label, 'Liberia', 'West Africa', 'Sports'])).map(tag => (
                  <Link
                    key={tag}
                    href={section.href}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Related</h2>
                  <Link href={section.href} className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">More ›</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.slug} href={`/sports/story/${r.slug}`} className="group no-underline">
                      <div className="overflow-hidden rounded-xl mb-2.5">
                        <NewsThumbnail category={r.category} className="w-full h-[110px]" />
                      </div>
                      <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(r.category)} mb-1`}>{r.category}</div>
                      <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{r.title}</h3>
                      <div className="text-xs text-gray-400">{r.source} · {r.time}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More stories */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">More from TrueRate Sports</h2>
                <Link href="/sports" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400 hover:text-gray-700 transition-colors no-underline">All sports ›</Link>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {moreStories.map(s => (
                  <Link key={s.slug} href={`/sports/story/${s.slug}`} className="group flex gap-3.5 py-4 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      <NewsThumbnail category={s.category} className="h-[70px] w-[105px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)} mb-1`}>{s.category}</div>
                      <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                      <p className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-400">{s.source} · {s.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </article>

          <RightRail />

        </div>
      </main>
    </div>
  );
}
