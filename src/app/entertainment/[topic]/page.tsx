import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import EntertainmentTopicTabs from '@/components/EntertainmentTopicTabs';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { ENTERTAINMENT_TOPIC_BY_SLUG, ENTERTAINMENT_TOPICS } from '@/lib/entertainment-topics';
import { ENTERTAINMENT_TOPIC_CONTENT } from '@/lib/entertainment-topic-content';

export function generateStaticParams() {
  return ENTERTAINMENT_TOPICS.map(t => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = ENTERTAINMENT_TOPIC_BY_SLUG[slug];
  if (!topic) return { title: 'Entertainment — TrueRate' };
  return {
    title: `${topic.label} — Entertainment | TrueRate`,
    description: topic.blurb,
  };
}

export default async function EntertainmentTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = ENTERTAINMENT_TOPIC_BY_SLUG[slug];
  if (!topic) notFound();

  const content = ENTERTAINMENT_TOPIC_CONTENT[topic.slug];

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-container px-4 py-6">
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Entertainment', href: '/entertainment' }, { label: topic.label }]} />
          <EntertainmentTopicTabs activeSlug={topic.slug} />
        </div>

        {!content ? (
          <section className="border-t border-gray-200 pt-6 pb-10 text-center">
            <p className="text-md text-gray-700 mb-2">Coverage in progress for this topic.</p>
            <p className="text-base text-gray-500 mb-6">Browse the full newsroom while we build this section out.</p>
            <Link href="/news" className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-base font-bold text-white hover:bg-gray-700 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
              All news
            </Link>
          </section>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main column */}
            <div className="flex-1 min-w-0">

              {/* Hero — full-width stacked image with overlay */}
              <Link href="/news" className="group relative block rounded-xl overflow-hidden mb-6 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4">
                <HeroVisual category={content.hero.category} className="w-full h-[260px] sm:h-[360px] lg:h-[420px] group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded px-2 py-0.5 text-2xs font-black uppercase tracking-widest bg-brand-accent text-brand-dark">Top Story</span>
                    <span className="text-2xs font-bold uppercase tracking-widest text-white/70">
                      {content.hero.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.08] text-white mb-3 tracking-tight text-balance max-w-[720px]">
                    {content.hero.title}
                  </h1>
                  <p className="text-base sm:text-md leading-relaxed text-white/80 line-clamp-2 mb-3 max-w-[640px]">{content.hero.summary}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/60">
                    {content.hero.byline && (
                      <>
                        <span className="font-semibold text-white/80">{content.hero.byline}</span>
                        <span aria-hidden>·</span>
                      </>
                    )}
                    <span className="font-semibold text-white/80">{content.hero.source}</span>
                    <span aria-hidden>·</span>
                    <time>{content.hero.time}</time>
                    {content.hero.readTime && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{content.hero.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>

              {/* Top stories — 3-up card row */}
              {content.strip.length >= 3 && (
                <section className="mb-8 pb-8 border-b border-gray-200" aria-labelledby={`${topic.slug}-top-heading`}>
                  <h2 id={`${topic.slug}-top-heading`} className="sr-only">Top {topic.label} stories</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                    {content.strip.slice(0, 3).map((card, i) => (
                      <Link key={i} href="/news" className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded">
                        <div className="overflow-hidden rounded-lg mb-3">
                          <NewsThumbnail category={card.category} className="w-full h-[160px] group-hover:scale-[1.03] transition-transform duration-500" />
                        </div>
                        <span className="text-2xs font-bold uppercase tracking-widest mb-1.5 text-gray-500">
                          {card.category}
                        </span>
                        <h3 className="text-md font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-3 text-pretty">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-xs text-gray-500 truncate">
                          <span className="text-gray-600">{card.source}</span>
                          <span aria-hidden className="mx-1.5 text-gray-300">·</span>
                          <time>{card.time}</time>
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Strip */}
              <section className="mb-10" aria-labelledby={`${topic.slug}-strip-heading`}>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
                    <h2 id={`${topic.slug}-strip-heading`} className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Latest in {topic.label}</h2>
                  </div>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
                </div>
                <ul className="flex flex-col divide-y divide-gray-200 list-none p-0 m-0">
                  {content.strip.slice(3).map((card, i) => (
                    <li key={i}>
                      <Link href="/news" className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-gray-50 -mx-2 px-2 rounded">
                        <p className="text-2xs font-bold uppercase tracking-[0.12em] mb-1.5 text-gray-500">
                          {card.category}
                        </p>
                        <h3 className="text-sm sm:text-md font-semibold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors text-pretty">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 truncate">
                          <span className="text-gray-600">{card.source}</span>
                          <span aria-hidden className="mx-1.5 text-gray-300">·</span>
                          <time>{card.time}</time>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tracker */}
              <section className="mb-10" aria-labelledby={`${topic.slug}-tracker-heading`}>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                  <h2 id={`${topic.slug}-tracker-heading`} className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">{content.tracker.title}</h2>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">{content.tracker.subtitle}</span>
                </div>
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                  <table className="w-full min-w-[520px] text-base">
                    <caption className="sr-only">{content.tracker.title} — {content.tracker.subtitle}</caption>
                    <thead className="border-b border-gray-200 text-2xs font-bold uppercase tracking-wide text-gray-500">
                      <tr>
                        {content.tracker.columns.map(col => (
                          <th
                            key={col.key}
                            scope="col"
                            className={`pb-3 pr-4 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {content.tracker.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          {content.tracker.columns.map(col => (
                            <td
                              key={col.key}
                              className={`py-3 pr-4 ${col.align === 'right' ? 'text-right tabular-nums' : 'text-left'} ${col.hideOnMobile ? 'hidden sm:table-cell' : ''} ${col.emphasize ? 'font-bold text-gray-900' : 'text-gray-700'}`}
                            >
                              {row[col.key] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Analysis feed */}
              <div className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">In-Depth — {topic.label}</h2>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-gray-200">
                  {content.feed.map((item, i) => (
                    <Link key={i} href="/news" className="group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline">
                      <div className="shrink-0 overflow-hidden rounded-lg">
                        <NewsThumbnail category={item.category} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-2xs font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block text-gray-500">
                          {item.category}
                        </span>
                        <h3 className="text-base sm:text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="hidden sm:block text-base leading-relaxed text-gray-600 line-clamp-2 mb-2">{item.summary}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="text-gray-500 truncate">{item.source}</span>
                          <span aria-hidden>·</span>
                          <span className="whitespace-nowrap">{item.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right rail */}
            <aside className="hidden lg:block w-full lg:w-[280px] shrink-0">
              <div className="sticky top-header-lg flex flex-col gap-8">

                {/* Most Read */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Most Read</h3>
                  <ol className="flex flex-col divide-y divide-gray-100">
                    {content.mostRead.map((t, i) => (
                      <li key={i} className="py-2.5 first:pt-0">
                        <Link href="/news" className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                          <span className="font-bold uppercase text-2xs tracking-wide mr-1.5 text-gray-400">{t.tag}</span>
                          {t.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Calendar */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Calendar</h3>
                  <div className="flex flex-col divide-y divide-gray-100">
                    {content.calendar.map((ev, i) => (
                      <div key={i} className="py-2.5 first:pt-0">
                        <p className="text-xs font-semibold text-brand-accent-ink mb-0.5">{ev.date}</p>
                        <p className="text-sm font-semibold text-gray-700 leading-snug">{ev.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Entertainment Brief</h3>
                  <p className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 mb-4">Liberian film, music, and culture stories — weekly in your inbox.</p>
                  <form aria-label="Sign up for the Entertainment Brief newsletter">
                    <label htmlFor={`ent-email-${topic.slug}`} className="sr-only">Email address</label>
                    <input id={`ent-email-${topic.slug}`} type="email" required placeholder="Your email" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
                    <button type="submit" className="w-full rounded-lg bg-gray-900 py-2 text-base font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                      Sign up free
                    </button>
                  </form>
                </div>

              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
