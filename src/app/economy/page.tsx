import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import EconomyTopicTabs from '@/components/EconomyTopicTabs';
import { publicClient } from '@/lib/supabase/public';
import { getDashboardIndicators } from '@/lib/data/indicators';
import type { NormalizedIndicator } from '@/lib/types/indicators';
import { newsItems } from '@/data/news';

export const metadata = {
  alternates: { canonical: '/economy' },
};

export const revalidate = 0; // always read the latest published articles from the DB

// Categories that belong on the Economy front. Includes the finance desks
// (policy, forex, commodities, banking) so every economic story surfaces here.
const ECONOMY_CATEGORY_SLUGS = ['economy', 'markets', 'business', 'analysis', 'opinion', 'world', 'policy', 'forex', 'commodities', 'banking'];

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
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
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
const ECONOMY_FALLBACK_SLUGS = ['economy', 'policy', 'analysis', 'commodities', 'banking', 'forex'];

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
  const topStories = articles.slice(1, 6);
  const grid = articles.slice(6);

  return (
    <main className="mx-auto max-w-container px-4 py-6">
      <h1 className="sr-only">Economy — TrueRate</h1>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Economy' }]} />

      <EconomyTopicTabs activeSlug="all" />

      {/* Hero + Top Stories */}
      {hero ? (
        <section className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 border-b border-white/[0.08]">
          {/* Lead feature */}
          <div className="lg:col-span-2">
            <Link href={`/news/${hero.slug}`} className="group block no-underline">
              <div className="overflow-hidden -mx-2 sm:mx-0 rounded-none sm:rounded-xl mb-4">
                <HeroVisual category={hero.category?.slug ?? 'economy'} src={hero.hero_image} className="w-full h-[280px] sm:h-[380px]" />
              </div>
              <span className={`text-2xs font-bold uppercase tracking-[0.18em] mb-2 block ${getCatColor(hero.category?.slug ?? 'economy')}`}>
                {hero.category?.label ?? 'Economy'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-[1.15] tracking-tight text-white group-hover:text-white/80 transition-colors mb-3 text-balance">
                {hero.title}
              </h2>
              {hero.dek && (
                <p className="text-base leading-relaxed text-gray-400 mb-3 line-clamp-3 max-w-[680px]">{hero.dek}</p>
              )}
              <div className="text-xs text-gray-500">
                {hero.author?.name && <><span className="font-semibold text-gray-300">{hero.author.name}</span><span className="mx-1.5 text-gray-700">&middot;</span></>}
                <span>{timeAgo(hero.published_at)}</span>
              </div>
            </Link>
          </div>

          {/* Top Stories sidebar */}
          {topStories.length > 0 && (
            <aside className="lg:border-l lg:border-white/[0.08] lg:pl-6">
              <h2 className="text-sm font-black text-white uppercase tracking-wide pb-3 mb-4 border-b border-white/[0.07]">Top Stories</h2>
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {topStories.map((s) => (
                  <Link key={s.id} href={`/news/${s.slug}`} className="group flex gap-3 py-3 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      <NewsThumbnail category={s.category?.slug ?? 'economy'} src={s.hero_image} className="h-[64px] w-[96px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1">{s.title}</h3>
                      <span className="text-xs text-gray-500">{timeAgo(s.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </section>
      ) : (
        <div className="mb-10 rounded-2xl border border-white/[0.07] bg-brand-card p-10 text-center">
          <p className="text-base text-gray-400">
            No economy stories published yet.{' '}
            <Link href="/admin/articles/new" className="text-brand-accent no-underline hover:text-brand-accent-hover">
              Publish one
            </Link>{' '}
            to populate this page.
          </p>
        </div>
      )}

      {/* Main content + right rail */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        <div className="flex-1 min-w-0 space-y-10">
          {grid.length > 0 && (
            <section aria-labelledby="latest-economy">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 id="latest-economy" className="text-base font-bold text-white uppercase tracking-[0.12em]">Latest in Economy</h2>
                </div>
                <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-white transition-colors no-underline">All stories ›</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                    <h3 className="text-sm font-bold leading-snug text-white group-hover:text-white/70 transition-colors line-clamp-3 mb-1.5">{s.title}</h3>
                    <span className="text-xs text-gray-400">{timeAgo(s.published_at)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right rail (sticky on desktop, matching the news sidebars) */}
        <aside className="w-full lg:w-[260px] shrink-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Data snapshot — live from Supabase (World Bank series) */}
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">Data Snapshot</h2>
            {wbIndicators.length === 0 ? (
              <p className="text-sm text-gray-500">Indicator data unavailable.</p>
            ) : (
              <>
                <dl className="space-y-3">
                  {wbIndicators.map((ind) => {
                    const change = formatIndicatorChange(ind);
                    const up = (ind.changePercent ?? 0) >= 0;
                    return (
                      <div key={ind.key} className="flex items-center justify-between">
                        <dt className="text-sm text-gray-400">{ind.name}</dt>
                        <dd className="flex items-center gap-2">
                          <span className="text-base font-bold text-white tabular-nums">{formatIndicatorValue(ind)}</span>
                          {change && (
                            <span className={`text-xs font-semibold ${up ? 'text-pos' : 'text-neg'}`}>{change}</span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <p className="text-2xs text-gray-600 mt-4">Source: World Bank · Liberia</p>
              </>
            )}
          </div>

          {/* More from Economy — recent published articles (no fabricated "most read") */}
          {articles.length > 0 && (
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wide border-b border-white/[0.07] pb-3 mb-4">More from Economy</h2>
              <ol className="flex flex-col divide-y divide-white/[0.05]">
                {articles.slice(0, 6).map((item) => (
                  <li key={item.id} className="py-2.5 first:pt-0">
                    <Link href={`/news/${item.slug}`} className="text-sm font-medium text-white/80 hover:text-brand-accent transition-colors no-underline line-clamp-2 leading-snug block">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
