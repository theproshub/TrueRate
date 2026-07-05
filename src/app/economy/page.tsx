import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import EconomyTopicTabs from '@/components/EconomyTopicTabs';
import { publicClient } from '@/lib/supabase/public';
import { getDashboardIndicators } from '@/domain/cbl/dashboard-indicators';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { newsItems } from '@/data/news';
import StickySidebar from '@/components/StickySidebar';
import EconomicEventsCalendar from '@/components/EconomicEventsCalendar';

export const metadata = {
  alternates: { canonical: '/economy' },
};

export const revalidate = 0; // always read the latest published articles from the DB

// Categories that belong on the Economy front. Includes the finance desks
// (policy, forex, commodities, banking) so every economic story surfaces here.
const ECONOMY_CATEGORY_SLUGS = ['economy', 'policy', 'analysis', 'opinion', 'world'];

interface EconomyArticle {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  hero_image: string | null;
  hero_alt: string | null;
  published_at: string | null;
  category: { slug: string; label: string } | null;
  author: { name: string } | null;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatIndicatorValue(ind: NormalizedIndicator): string {
  const { value: v, unit: u } = ind;
  if (u === 'B USD') return `$${v.toFixed(2)}B`;
  if (u === 'M USD') return `$${v.toFixed(0)}M`;
  if (u === 'M') return `${v.toFixed(2)}M`;
  if (u === '%') return `${v.toFixed(1)}%`;
  return `${v}`;
}

function formatIndicatorChange(ind: NormalizedIndicator): string | null {
  if (ind.change === null || ind.changePercent === null) return null;
  if (ind.unit === '%') {
    return `${ind.change >= 0 ? '+' : ''}${ind.change.toFixed(1)}pp`;
  }
  return `${ind.changePercent >= 0 ? '+' : ''}${ind.changePercent.toFixed(1)}%`;
}

// Static fallback: when no DB articles are published, surface the seed
// articles from news.ts so the Economy front isn't empty.
const ECONOMY_FALLBACK_SLUGS = ['economy', 'policy', 'analysis', 'opinion', 'world'];

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function economyFallbackArticles(): EconomyArticle[] {
  return newsItems
    .filter((n) => ECONOMY_FALLBACK_SLUGS.includes(n.category))
    .slice()
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 13)
    .map((n) => ({
      id: n.id,
      slug: n.id,
      title: n.title,
      dek: n.summary ?? null,
      hero_image: null,
      hero_alt: null,
      published_at: n.date ?? null,
      category: { slug: n.category, label: titleCase(n.category) },
      author: n.author ? { name: n.author } : null,
    }));
}

async function fetchEconomyArticles(): Promise<EconomyArticle[]> {
  const { data: cats } = await publicClient.from('categories').select('id, slug');
  const ids = (cats ?? [])
    .filter((c) => ECONOMY_CATEGORY_SLUGS.includes((c as { slug: string }).slug))
    .map((c) => (c as { id: string }).id);
  if (ids.length === 0) return economyFallbackArticles();

  const { data } = await publicClient
    .from('articles')
    .select(
      `id, slug, title, dek, hero_image, hero_alt, published_at,
       category:categories(slug, label),
       author:authors(name)`,
    )
    .eq('status', 'published')
    .in('category_id', ids)
    .order('published_at', { ascending: false })
    .limit(50);

  const rows = (data ?? []) as unknown as EconomyArticle[];
  return rows.length > 0 ? rows : economyFallbackArticles();
}

export default async function EconomyPage() {
  const [articles, indicators] = await Promise.all([
    fetchEconomyArticles(),
    getDashboardIndicators(),
  ]);

  // The snapshot is captioned "Source: World Bank", so exclude the
  // administered CBL policy rate (a Central Bank figure) from this list.
  const wbIndicators = indicators.filter((ind) => ind.key !== 'CBL_RATE');

  const hero = articles[0] ?? null;
  const topStories = articles.slice(1, 4);
  const grid = articles.slice(4);

  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <h1 className="sr-only">Economy — TrueRate</h1>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Economy' }]} />

      <EconomyTopicTabs activeSlug="all" />

      {/* Hero + Top Stories */}
      {hero ? (
        <section aria-labelledby="econ-top-heading" className="mb-8 sm:mb-10">
          <h2 id="econ-top-heading" className="text-lg sm:text-xl font-extrabold text-gray-900 pb-3 border-b border-gray-300 mb-4 sm:mb-5">
            Economy
          </h2>

          {/* Lead story + At a Glance sidebar */}
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
            {/* Lead story */}
            <article className="lg:flex-1 min-w-0">
              <Link href={`/news/${hero.slug}`} className="group flex flex-col md:flex-row gap-4 md:gap-6 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2">
                <div className="md:w-[55%] shrink-0 overflow-hidden rounded-lg">
                  <HeroVisual category={hero.category?.slug ?? 'economy'} src={hero.hero_image} className="w-full aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.02]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className={`text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.08em] ${getCatColor(hero.category?.slug ?? 'economy')}`}>
                    {hero.category?.label ?? 'Economy'}
                  </span>
                  <h3 className="mt-1 sm:mt-1.5 text-[20px] sm:text-[24px] lg:text-[26px] font-black leading-[1.15] text-gray-900 group-hover:underline decoration-2 underline-offset-2">
                    {hero.title}
                  </h3>
                  {hero.dek && (
                    <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] leading-[1.55] text-gray-500 line-clamp-2 sm:line-clamp-3">{hero.dek}</p>
                  )}
                  <div className="mt-2 sm:mt-3 text-xs text-gray-500">
                    {hero.author?.name && <><span className="font-semibold text-gray-700">{hero.author.name}</span><span className="mx-1.5 text-gray-400">&middot;</span></>}
                    <span>{timeAgo(hero.published_at)}</span>
                  </div>
                </div>
              </Link>
            </article>

            {/* Liberia at a Glance — desktop only; mobile gets the Data Snapshot in the right rail */}
            <aside className="hidden lg:block lg:w-[280px] shrink-0 lg:border-l lg:border-gray-200 lg:pl-6" aria-labelledby="at-a-glance-heading">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 id="at-a-glance-heading" className="text-sm font-black text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3 mb-3">
                  Liberia at a Glance
                </h3>
                {indicators.length === 0 ? (
                  <p className="text-sm text-gray-500">Data unavailable.</p>
                ) : (
                  <dl className="space-y-2.5">
                    {indicators.map((ind) => {
                      const change = formatIndicatorChange(ind);
                      const up = (ind.changePercent ?? 0) >= 0;
                      return (
                        <div key={ind.key} className="flex items-baseline justify-between gap-2">
                          <dt className="text-sm text-gray-500 min-w-0 truncate">{ind.name}</dt>
                          <dd className="flex items-baseline gap-1.5 shrink-0">
                            <span className="text-sm font-bold text-gray-900 tabular-nums">{formatIndicatorValue(ind)}</span>
                            {change && (
                              <span className={`text-2xs font-semibold ${up ? 'text-pos' : 'text-neg'}`}>
                                {change}
                              </span>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                )}
                <p className="text-2xs text-gray-400 mt-3 pt-2 border-t border-gray-100">Source: CBL &middot; World Bank</p>
              </div>
            </aside>
          </div>

          {/* Secondary stories */}
          {topStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
              {topStories.slice(0, 3).map((s) => (
                <Link key={s.id} href={`/news/${s.slug}`} className="group flex sm:flex-col gap-3 no-underline">
                  <div className="shrink-0 sm:shrink overflow-hidden rounded-lg">
                    <NewsThumbnail category={s.category?.slug ?? 'economy'} src={s.hero_image} className="h-[64px] w-[96px] sm:w-full sm:h-auto sm:aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.02]" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center sm:justify-start">
                    <span className={`text-[11px] font-extrabold uppercase tracking-[0.08em] mb-0.5 sm:mb-1 ${getCatColor(s.category?.slug ?? 'economy')}`}>
                      {s.category?.label ?? 'Economy'}
                    </span>
                    <h3 className="text-[13px] sm:text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-2 sm:line-clamp-3">{s.title}</h3>
                    <span className="text-xs text-gray-500 mt-1">{timeAgo(s.published_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-base text-gray-500">
            No economy stories published yet.{' '}
            <Link href="/admin/articles/new" className="text-brand-accent-ink no-underline hover:text-brand-accent-hover">
              Publish one
            </Link>{' '}
            to populate this page.
          </p>
        </div>
      )}

      {/* Main content + right rail */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 lg:items-start">
        <div className="flex-1 min-w-0 space-y-10 lg:pr-6">
          {grid.length > 0 && (
            <section aria-labelledby="latest-economy">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 id="latest-economy" className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Latest in Economy</h2>
                </div>
                <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">All stories ›</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {grid.map((s) => (
                  <Link key={s.id} href={`/news/${s.slug}`} className="group flex flex-col no-underline">
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      {s.hero_image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={s.hero_image} alt={s.hero_alt ?? ''} className="block w-full h-[170px] object-cover rounded-xl" />
                      ) : (
                        <NewsThumbnail category={s.category?.slug ?? 'economy'} className="w-full h-[170px]" />
                      )}
                    </div>
                    <span className={`text-2xs font-bold uppercase tracking-widest mb-1 ${getCatColor(s.category?.slug ?? 'economy')}`}>
                      {s.category?.label ?? 'Economy'}
                    </span>
                    <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-xs text-gray-500">{timeAgo(s.published_at)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right rail */}
        <aside className="w-full lg:w-[300px] shrink-0 lg:self-stretch border-t border-gray-200 pt-8 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-6">
          <StickySidebar className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          {/* Newsletter signup */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3 mb-3">Stay Informed</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Get Liberia&apos;s key economic data and market moves delivered to your inbox every week.
            </p>
            <form action="/api/subscribe" method="POST" className="flex flex-col gap-2.5">
              <label htmlFor="economy-email" className="sr-only">Email address</label>
              <input
                id="economy-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-[#1E1E1E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                Subscribe
              </button>
              <p className="text-2xs text-gray-400">Free. No spam. Unsubscribe anytime.</p>
            </form>
          </div>

          <EconomicEventsCalendar limit={4} />

          {/* More from Economy — recent published articles (no fabricated "most read") */}
          {articles.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2 lg:col-span-1">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3 mb-3">More from Economy</h2>
              <ol className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col divide-y sm:divide-y-0 lg:divide-y divide-gray-200 sm:gap-x-4 lg:gap-x-0">
                {articles.slice(0, 6).map((item) => (
                  <li key={item.id} className="py-2.5 first:pt-0 sm:py-2 lg:py-2.5 lg:first:pt-0">
                    <Link href={`/news/${item.slug}`} className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
          </StickySidebar>
        </aside>
      </div>
    </main>
  );
}
