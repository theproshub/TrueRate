import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import FlagChip from '@/components/sports/FlagChip';
import { SportsReaderTrending, SportsReaderRail } from '@/components/sports/SportsArticleRails';
import { HeroVisual, NewsThumbnail } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { SPORTS_STORIES, type SportsSection } from '@/data/sports-stories';
import { DESK_STORIES } from '@/data/sports-desk-stories';
import { getSportsDesk } from '@/lib/sports-desks';

// All readable sports articles: section stories + category-specific desk stories.
const ALL_STORIES = [...SPORTS_STORIES, ...DESK_STORIES];
const findStory = (slug: string) => ALL_STORIES.find((s) => s.slug === slug);

const SECTION_LABELS: Record<SportsSection, { label: string; href: string }> = {
  main:        { label: 'Sports',            href: '/sports' },
  sponsorship: { label: 'Sponsorship',       href: '/sports/sponsorship' },
  transfers:   { label: 'Transfers & Deals', href: '/sports/transfers-deals' },
  broadcast:   { label: 'Broadcast Rights',  href: '/sports/broadcast-rights' },
};

export function generateStaticParams() {
  return ALL_STORIES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) return { title: 'Story not found — TrueRate Sports' };
  const description = story.summary.length > 160 ? story.summary.slice(0, 157) + '…' : story.summary;
  return {
    title: `${story.title} — TrueRate Sports`,
    description,
    alternates: { canonical: `/sports/news/${story.slug}` },
    openGraph: { title: story.title, description, type: 'article', siteName: 'TrueRate' },
    twitter: { card: 'summary_large_image', title: story.title, description },
  };
}

export default async function SportsNewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = findStory(slug);
  if (!story) notFound();

  const desk = story.topic ? getSportsDesk(story.topic) : undefined;
  const section = desk
    ? { label: desk.label, href: `/sports/${desk.slug}` }
    : SECTION_LABELS[story.section];

  // Related: same desk topic when present, otherwise same section.
  const pool = ALL_STORIES.filter((s) => s.slug !== story.slug);
  const related = (story.topic
    ? pool.filter((s) => s.topic === story.topic)
    : pool.filter((s) => s.section === story.section && !s.topic)
  ).slice(0, 3);
  const relatedSlugs = new Set(related.map(r => r.slug));
  const moreStories = pool.filter(s => !relatedSlugs.has(s.slug)).slice(0, 6);

  // Desktop sidebar content (readable stories).
  const otherStories = SPORTS_STORIES.filter(s => s.slug !== story.slug);
  const trending = otherStories.slice(0, 7);
  const railLatest = otherStories.slice(7, 13);

  // Previous / next story in publication order (wrapping).
  const idx = ALL_STORIES.findIndex((s) => s.slug === story.slug);
  const prevStory = ALL_STORIES[(idx - 1 + ALL_STORIES.length) % ALL_STORIES.length];
  const nextStory = ALL_STORIES[(idx + 1) % ALL_STORIES.length];

  return (
    <div className="bg-brand-surface min-h-screen text-gray-800">
      <SportsMasthead />

      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb
          light
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sports', href: '/sports' },
            ...(desk
              ? [{ label: desk.label, href: `/sports/${desk.slug}` }]
              : story.section !== 'main'
                ? [{ label: section.label, href: section.href }]
                : []),
            ...(desk ? [] : [{ label: story.category }]),
          ]}
        />

        <div className="flex gap-8 items-start">
          {/* Left rail — trending (desktop) */}
          <SportsReaderTrending stories={trending} />

          {/* Center column — the feature + related/more */}
          <div className="flex-1 min-w-0 lg:max-w-[760px]">

        {/* Image-first lede — consistent with the section front */}
        <article className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            {story.flag && <FlagChip flag={story.flag} />}
            <Link
              href={section.href}
              className={`text-2xs font-bold uppercase tracking-[0.18em] ${getCatColor(story.category)} no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2`}
            >
              {story.category}
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] sm:leading-[1.08] tracking-tight text-gray-900 text-balance">
            {story.title}
          </h1>

          {/* Standfirst */}
          <p className="mt-4 max-w-[40rem] text-lg sm:text-xl text-gray-600 leading-relaxed text-pretty">
            {story.summary}
          </p>

          {/* Byline block */}
          <div className="mt-5 border-y border-gray-900/15 py-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-semibold text-gray-900">{story.author ? `By ${story.author}` : story.source}</span>
            {story.authorRole && <span className="text-gray-500">, {story.authorRole}</span>}
            {story.author && (
              <>
                <span aria-hidden className="text-gray-300">·</span>
                <span className="text-gray-500">{story.source}</span>
              </>
            )}
            <span aria-hidden className="text-gray-300">·</span>
            <time className="text-gray-500">{story.time}</time>
            {story.readTime && <><span aria-hidden className="text-gray-300">·</span><span className="text-gray-500">{story.readTime}</span></>}
          </div>

          {/* Lede figure */}
          <figure className="mt-6">
            <HeroVisual category={story.category} className="w-full rounded-xl h-[230px] sm:h-[360px] lg:h-[420px]" />
            <figcaption className="mt-2 text-2xs text-gray-400">TrueRate illustration · {story.category}</figcaption>
          </figure>

          <div className="mt-8 max-w-[42rem] text-[1.0625rem] leading-[1.85] text-gray-700 space-y-5">
            {story.dateline && story.body.length > 0 ? (
              <p>
                <span className="font-bold uppercase tracking-wide text-gray-900">{story.dateline} — </span>
                {story.body[0]}
              </p>
            ) : (
              story.body[0] && (
                <p className="first-letter:float-left first-letter:text-[3rem] first-letter:font-black first-letter:leading-[0.85] first-letter:mr-2 first-letter:mt-1 first-letter:text-gray-900">
                  {story.body[0]}
                </p>
              )
            )}
            {story.body.slice(1).map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* Signoff */}
          <div className="mt-10 max-w-[42rem] text-center">
            <p aria-hidden className="text-gray-300 tracking-[0.5em] leading-none">◆</p>
            <p className="mt-3 text-2xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Reporting by {story.author ?? story.source} · TrueRate Sports
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-6 mt-8 border-t border-gray-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-gray-400 mr-1">Filed under</span>
            {Array.from(new Set([story.category, section.label, 'Liberia', 'West Africa'])).map(tag => (
              <Link key={tag} href={section.href} className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
                {tag}
              </Link>
            ))}
          </div>

          {/* Previous / next story */}
          <nav aria-label="More stories" className="mt-8 grid grid-cols-1 sm:grid-cols-2 border-y-2 border-gray-900 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <Link href={`/sports/news/${prevStory.slug}`} className="group block py-4 sm:pr-6 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
              <span className="block text-2xs font-bold uppercase tracking-[0.16em] text-gray-400 mb-1">← Previous story</span>
              <span className="block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{prevStory.title}</span>
            </Link>
            <Link href={`/sports/news/${nextStory.slug}`} className="group block py-4 sm:pl-6 sm:text-right no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2">
              <span className="block text-2xs font-bold uppercase tracking-[0.16em] text-gray-400 mb-1">Next story →</span>
              <span className="block text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{nextStory.title}</span>
            </Link>
          </nav>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section aria-labelledby="rel-h" className="mt-12">
            <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2 mb-5">
              <h2 id="rel-h" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">Related</h2>
              <Link href={section.href} className="text-2xs font-semibold uppercase tracking-wide text-brand-accent-ink hover:text-brand-ink no-underline">More ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(r => (
                <Link key={r.slug} href={`/sports/news/${r.slug}`} className="group no-underline">
                  <div className="overflow-hidden rounded-md mb-2.5">
                    <NewsThumbnail category={r.category} className="w-full h-[110px]" />
                  </div>
                  <div className={`text-2xs font-bold uppercase tracking-wide mb-1 ${getCatColor(r.category)}`}>{r.category}</div>
                  <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 mb-1">{r.title}</h3>
                  <div className="text-2xs text-gray-400">{r.source} · {r.time}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* More from TrueRate Sports */}
        <section aria-labelledby="more-h" className="mt-12 pb-4">
          <div className="flex items-baseline justify-between border-b-2 border-gray-900 pb-2 mb-4">
            <h2 id="more-h" className="text-sm font-black uppercase tracking-[0.16em] text-gray-900">More from TrueRate Sports</h2>
            <Link href="/sports" className="text-2xs font-semibold uppercase tracking-wide text-brand-accent-ink hover:text-brand-ink no-underline">All sports ›</Link>
          </div>
          <div className="flex flex-col divide-y divide-gray-200">
            {moreStories.map(s => (
              <Link key={s.slug} href={`/sports/news/${s.slug}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
                <div className="shrink-0 overflow-hidden rounded-md order-last">
                  <NewsThumbnail category={s.category} className="h-[72px] w-[108px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-2xs font-bold uppercase tracking-wide mb-1 ${getCatColor(s.category)}`}>{s.category}</div>
                  <h3 className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-1">{s.title}</h3>
                  <p className="text-2xs text-gray-400">{s.source} · {s.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

          </div>{/* /center column */}

          {/* Right rail — newsletter + latest (desktop) */}
          <SportsReaderRail stories={railLatest} />
        </div>
      </main>
    </div>
  );
}
