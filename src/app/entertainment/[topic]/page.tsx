import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import EntertainmentTopicTabs from '@/components/EntertainmentTopicTabs';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { ENTERTAINMENT_TOPIC_BY_SLUG, ENTERTAINMENT_TOPICS } from '@/lib/entertainment-topics';
import { ENTERTAINMENT_TOPIC_CONTENT, type Kpi } from '@/lib/entertainment-topic-content';

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

function deltaClasses(direction?: Kpi['deltaDirection']): string {
  switch (direction) {
    case 'up':   return 'text-emerald-600';
    case 'down': return 'text-rose-600';
    case 'flat': return 'text-gray-500';
    default:     return 'text-gray-500';
  }
}

/** Slugs whose topic-header strap and "By the numbers" KPI grid are hidden — the hero stat panel covers it. */
const HIDE_TOPIC_INTRO = new Set(['movies', 'tv', 'music', 'celebrity', 'how-to-watch']);

export default async function EntertainmentTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: slug } = await params;
  const topic = ENTERTAINMENT_TOPIC_BY_SLUG[slug];
  if (!topic) notFound();

  const content = ENTERTAINMENT_TOPIC_CONTENT[topic.slug];
  const showIntro = !HIDE_TOPIC_INTRO.has(topic.slug);

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1320px] px-4 py-6">
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Entertainment', href: '/entertainment' }, { label: topic.label }]} />
          <EntertainmentTopicTabs activeSlug={topic.slug} />
        </div>

        {showIntro && (
          <header className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">Entertainment &middot; {topic.label}</p>
            <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.1] tracking-tight text-gray-900 mb-3">{topic.label} — the business behind it</h1>
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[720px]">{topic.blurb}</p>
          </header>
        )}

        {showIntro && content && (
          <section aria-labelledby={`${topic.slug}-kpi-heading`} className="mb-10 border-y border-gray-200 py-5">
            <h2 id={`${topic.slug}-kpi-heading`} className="sr-only">Key {topic.label} numbers</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">By the numbers</p>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
              {content.kpis.map(k => (
                <div key={k.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 leading-snug">{k.label}</dt>
                  <dd className="mt-1.5 text-[22px] sm:text-[22px] font-black tracking-tight text-gray-900 tabular-nums">{k.value}</dd>
                  {k.delta && (
                    <p className={`mt-0.5 text-[12px] font-bold tabular-nums ${deltaClasses(k.deltaDirection)}`}>{k.delta}</p>
                  )}
                  {k.note && (
                    <p className="mt-1 text-[11px] text-gray-500 leading-snug">{k.note}</p>
                  )}
                </div>
              ))}
            </dl>
          </section>
        )}

        {!content ? (
          <section className="border-t border-gray-200 pt-10 pb-16 text-center">
            <p className="text-[14px] text-gray-700 mb-2">Coverage in progress for this topic.</p>
            <p className="text-[13px] text-gray-500 mb-6">Browse the full newsroom while we build this section out.</p>
            <Link href="/news" className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-[13px] font-bold text-white hover:bg-gray-700 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
              All news
            </Link>
          </section>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Main column */}
            <div className="flex-1 min-w-0">

              {/* Hero — editorial layout with stat panel */}
              <article className="mb-10 pb-10 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-7 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-[#050d11]">Top Story</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        {content.hero.category}
                      </span>
                    </div>
                    <Link href="/news" className="no-underline group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded">
                      {showIntro ? (
                        <h2 className="text-[22px] sm:text-[32px] lg:text-[32px] font-black leading-[1.1] text-gray-900 group-hover:text-gray-700 transition-colors mb-4 tracking-tight text-balance">
                          {content.hero.title}
                        </h2>
                      ) : (
                        <h1 className="text-[22px] sm:text-[32px] lg:text-[32px] font-black leading-[1.05] text-gray-900 group-hover:text-gray-700 transition-colors mb-4 tracking-tight text-balance">
                          {content.hero.title}
                        </h1>
                      )}
                    </Link>
                    <p className="text-[14px] leading-relaxed text-gray-700 mb-4 max-w-[640px]">{content.hero.summary}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-gray-500">
                      {content.hero.byline && (
                        <>
                          <span className="font-semibold text-gray-700">{content.hero.byline}</span>
                          <span aria-hidden>·</span>
                        </>
                      )}
                      <span className="font-semibold text-gray-600">{content.hero.source}</span>
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

                  <aside aria-label="Headline number" className="md:col-span-5 md:border-l md:border-gray-200 md:pl-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">The Number</p>
                    <p className="text-[32px] sm:text-[32px] font-black leading-[0.95] tracking-tight text-gray-900 tabular-nums">
                      {content.heroStat.value}
                    </p>
                    <p className="mt-2 text-[13px] font-semibold text-gray-700 leading-snug">
                      {content.heroStat.label}
                    </p>
                    {content.heroStat.delta && (
                      <p className={`mt-3 text-[13px] font-bold tabular-nums ${deltaClasses(content.heroStat.deltaDirection)}`}>
                        {content.heroStat.delta}
                      </p>
                    )}
                    {content.heroStat.sub && (
                      <p className="mt-2 text-[12px] text-gray-500 leading-snug">
                        {content.heroStat.sub}
                      </p>
                    )}
                  </aside>
                </div>
              </article>

              {/* Strip */}
              <section className="mb-10" aria-labelledby={`${topic.slug}-strip-heading`}>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
                    <h2 id={`${topic.slug}-strip-heading`} className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Latest in {topic.label}</h2>
                  </div>
                  <Link href="/news" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
                </div>
                <ul className="flex flex-col divide-y divide-gray-200 list-none p-0 m-0">
                  {content.strip.map((card, i) => (
                    <li key={i}>
                      <Link href="/news" className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-gray-50 -mx-2 px-2 rounded">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 text-gray-500">
                          {card.category}
                        </p>
                        <h3 className="text-[12px] sm:text-[14px] font-semibold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors text-pretty">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-[11px] text-gray-500 truncate">
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
                  <h2 id={`${topic.slug}-tracker-heading`} className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">{content.tracker.title}</h2>
                  <span className="text-[11px] text-gray-500 uppercase tracking-wide font-bold">{content.tracker.subtitle}</span>
                </div>
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                  <table className="w-full min-w-[520px] text-[13px]">
                    <caption className="sr-only">{content.tracker.title} — {content.tracker.subtitle}</caption>
                    <thead className="border-b border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
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
                    <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">In-Depth — {topic.label}</h2>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-gray-200">
                  {content.feed.map((item, i) => (
                    <Link key={i} href="/news" className="group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline">
                      <div className="shrink-0 overflow-hidden rounded-lg">
                        <NewsThumbnail category={item.category} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block text-gray-500">
                          {item.category}
                        </span>
                        <h3 className="text-[13.5px] sm:text-[12px] font-black leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="hidden sm:block text-[13px] leading-relaxed text-gray-600 line-clamp-2 mb-2">{item.summary}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-gray-500">
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
              <div className="sticky top-[120px] flex flex-col gap-8">

                {/* Most Read */}
                <div>
                  <h3 className="text-[12px] font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Most Read</h3>
                  <ol className="space-y-4">
                    {content.mostRead.map(t => (
                      <li key={t.rank} className="flex gap-3">
                        <span aria-hidden className="shrink-0 text-[18px] font-black text-gray-300 tabular-nums w-5 leading-none">{t.rank}</span>
                        <div className="min-w-0">
                          <Link href="/news" className="text-[12px] font-semibold text-gray-700 hover:text-gray-900 transition-colors no-underline line-clamp-2 leading-snug block">{t.title}</Link>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{t.tag}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Calendar */}
                <div>
                  <h3 className="text-[12px] font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Calendar</h3>
                  <div className="space-y-3">
                    {content.calendar.map((ev, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="shrink-0 text-[11px] font-bold text-gray-700 w-12 tabular-nums">{ev.date}</span>
                        <p className="text-[12px] text-gray-600 leading-snug">{ev.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-wide mb-1">Entertainment Brief</h3>
                  <p className="text-[12px] text-gray-500 mb-4">Liberian film, music, and culture stories — weekly in your inbox.</p>
                  <form aria-label="Sign up for the Entertainment Brief newsletter">
                    <label htmlFor={`ent-email-${topic.slug}`} className="sr-only">Email address</label>
                    <input id={`ent-email-${topic.slug}`} type="email" required placeholder="Your email" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
                    <button type="submit" className="w-full rounded-lg bg-gray-900 py-2 text-[13px] font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
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
