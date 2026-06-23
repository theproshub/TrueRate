import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import { fetchBusinessArticles, toBusinessStory, type BusinessStory } from '@/lib/business/feed';
import { newsItems } from '@/data/news';
import StickySidebar from '@/components/StickySidebar';
import LiveMarketsMini from '@/components/builders/LiveMarketsMini';

export const metadata: Metadata = {
  title: 'Business — Liberian Business & Entrepreneurship',
  alternates: { canonical: '/small-business' },
  description:
    "News, analysis, and data for Liberia's business community — companies, trade, entrepreneurship, credit, and the sectors driving economic growth.",
};

export const revalidate = 300;

/* ── Fallback mock data (design-preview only) ── */

const MOCK_HERO = {
  category: 'Credit',
  categorySlug: 'credit',
  title: "The Cost of Credit: Why Liberian Businesses Pay 13% to Borrow",
  summary: 'The average lending rate stands at 13.11% while savings accounts pay 1.94% — an 11-point spread that prices most small businesses out of formal credit and keeps bank lending nearly flat.',
  source: 'TrueRate Business',
  time: 'Jun 20, 2026',
  href: '/news/cost-of-credit-liberian-business-borrowing',
};

const MOCK_LEADS = [
  { category: 'Economy', categorySlug: 'economy', title: "Where Liberia's $5.2 Billion Economy Really Comes From", source: 'TrueRate Business', time: 'Jun 19, 2026', href: '/news/liberia-5-billion-economy-sectoral-breakdown' },
  { category: 'Trade', categorySlug: 'trade', title: "Exports Top $2 Billion — Europe Takes 82% of Everything Liberia Sells", source: 'TrueRate Business', time: 'Jun 18, 2026', href: '/news/liberia-exports-two-billion-europe-dominance' },
  { category: 'Industry', categorySlug: 'industry', title: "Cement Output Surges 52% as Liberia Builds", source: 'TrueRate Business', time: 'Jun 17, 2026', href: '/news/cement-output-surges-construction-boom' },
];

const MOCK_FEED = [
  { category: 'Mining', categorySlug: 'mining', title: "Iron Ore Output Quintuples in a Year, Reshaping Liberia's Mining Economy", summary: "A production surge of over 400% in a single year makes iron ore Liberia's fastest-growing export sector.", source: 'TrueRate Business', time: 'Jun 16, 2026', href: '/news/iron-ore-production-quintuples-mining-revival' },
  { category: 'Finance', categorySlug: 'finance', title: 'Bank Lending to Business Barely Grows While Deposits Pile Up', summary: 'Private sector credit rose just 2.7% year-on-year while the money supply expanded more than 10%.', source: 'TrueRate Business', time: 'Jun 15, 2026', href: '/news/private-sector-credit-stalls-money-supply-swells' },
  { category: 'Policy', categorySlug: 'policy', title: 'Government Revenue Hits $304 Million in March — What It Means for State Vendors', summary: 'A 12.3% year-on-year revenue surge lifts government spending capacity and expands the addressable market for vendors.', source: 'TrueRate Business', time: 'Jun 14, 2026', href: '/news/government-revenue-surges-march-2026' },
  { category: 'Services', categorySlug: 'trade', title: "Liberia's Trade and Hospitality Sector Hits $506 Million", summary: 'The services sector now accounts for nearly 40% of GDP, led by trade, hotels, and restaurants.', source: 'TrueRate Business', time: 'Jun 13, 2026', href: '/news/trade-hospitality-sector-services-boom' },
  { category: 'Credit', categorySlug: 'credit', title: 'Personal Loans Cost 16.16% — The Hidden Tax on Informal Entrepreneurs', summary: 'Consumer lending rates remain among the highest in the region, squeezing small operators who fund growth with personal borrowing.', source: 'TrueRate Business', time: 'Jun 12, 2026', href: '/news/cost-of-credit-liberian-business-borrowing' },
  { category: 'Trade', categorySlug: 'trade', title: "China Buys $134 Million of Liberian Exports After Near-Zero in 2024", summary: "A new bilateral trade dynamic is emerging as China joins Europe as a significant buyer of Liberian commodities.", source: 'TrueRate Business', time: 'Jun 11, 2026', href: '/news/liberia-exports-two-billion-europe-dominance' },
];

/* ── Card shape shared across DB + mock ── */

type Card = {
  category: string;
  categorySlug?: string;
  title: string;
  summary?: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;
};

function storyToCard(s: BusinessStory): Card {
  return {
    category: s.category,
    categorySlug: s.categorySlug,
    title: s.title,
    summary: s.dek,
    source: s.author ?? 'TrueRate Business',
    time: s.time,
    href: s.href,
    image: s.image,
  };
}

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark';

export default async function SmallBusinessPage() {
  const db = await fetchBusinessArticles({ limit: 24 });
  const useDb = db.length > 0;
  const stories = db.map(toBusinessStory);

  const BIZ_CATS = new Set(['business', 'trade', 'industry', 'mining', 'credit', 'finance', 'banking', 'entrepreneurship']);
  const seedArticles: Card[] = newsItems
    .filter((n) => BIZ_CATS.has(n.category))
    .map((n) => ({
      category: n.category.charAt(0).toUpperCase() + n.category.slice(1),
      categorySlug: n.category,
      title: n.title,
      summary: n.summary,
      source: n.author ?? n.source,
      time: (() => { const d = new Date(n.date); const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; })(),
      href: `/news/${n.id}`,
      image: n.image ?? null,
    }));
  const hasSeed = seedArticles.length > 0;

  const hero: Card = useDb ? storyToCard(stories[0]) : hasSeed ? seedArticles[0] : MOCK_HERO;
  const leads: Card[] = useDb ? stories.slice(1, 4).map(storyToCard) : hasSeed ? seedArticles.slice(1, 4) : MOCK_LEADS;
  const feed: Card[] = useDb
    ? stories.slice(1).filter((s) => s.dek).slice(0, 10).map(storyToCard)
    : hasSeed ? seedArticles.slice(4, 14) : MOCK_FEED;
  const sidebarStories = useDb ? stories.slice(0, 6) : null;

  return (
    <>
      {!useDb && !hasSeed && (
        <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
          <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="leading-snug">
              <span className="font-bold uppercase tracking-wide">Sample data</span>
              {' — '}
              this section uses placeholder content for design preview. Headlines and figures are
              illustrative, not real reporting. They disappear automatically once business stories
              are published.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Business' }]} />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Main column */}
          <div className="flex-1 min-w-0 lg:pr-5">

            {/* Hero */}
            <Link href={hero.href} className={`group flex flex-col md:flex-row gap-5 md:gap-6 no-underline mb-6 pb-6 border-b border-gray-200 rounded ${focusRing}`}>
              <div className="w-full md:w-[58%] shrink-0 overflow-hidden rounded-xl">
                {hero.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={hero.image} alt="" className="w-full h-[220px] sm:h-[320px] object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <HeroVisual category={hero.categorySlug ?? hero.category} className="w-full h-[220px] sm:h-[320px] group-hover:scale-[1.02] transition-transform duration-500" />
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded px-2 py-0.5 text-2xs font-black uppercase tracking-widest bg-brand-accent text-brand-dark">Top Story</span>
                  <span className={`text-2xs font-bold uppercase tracking-widest ${getCatColor(hero.categorySlug ?? hero.category)}`}>
                    {hero.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-[1.1] text-gray-900 group-hover:text-gray-600 transition-colors mb-4 tracking-tight">
                  {hero.title}
                </h1>
                {hero.summary && <p className="text-md leading-relaxed text-gray-500 line-clamp-3 mb-4">{hero.summary}</p>}
                <div className="flex items-center gap-2 mt-auto text-sm text-gray-500">
                  <span className="font-semibold text-gray-500">{hero.source}</span>
                  <span>&middot;</span>
                  <span>{hero.time}</span>
                </div>
              </div>
            </Link>

            {/* Lead stories — 3-up row */}
            {leads.length > 0 && (
              <section className="mb-8" aria-labelledby="biz-leads-heading">
                <h2 id="biz-leads-heading" className="sr-only">More top stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pb-6 border-b border-gray-200">
                  {leads.map((card, i) => (
                    <Link key={card.href + i} href={card.href} className={`group flex flex-col no-underline rounded ${focusRing}`}>
                      <div className="overflow-hidden rounded-lg mb-3">
                        <NewsThumbnail category={card.categorySlug ?? card.category} src={card.image ?? undefined} className="w-full h-[160px] group-hover:scale-[1.03] transition-transform duration-500" />
                      </div>
                      <span className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${getCatColor(card.categorySlug ?? card.category)}`}>
                        {card.category}
                      </span>
                      <h3 className="text-md font-bold leading-snug text-gray-900 group-hover:text-gray-900/75 transition-colors line-clamp-3 text-pretty">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-500 truncate">
                        <span className="text-gray-500">{card.source}</span>
                        <span aria-hidden className="mx-1.5 text-gray-700">&middot;</span>
                        <time>{card.time}</time>
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Story feed */}
            {feed.length > 0 && (
              <section className="mb-6" aria-labelledby="biz-feed-heading">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                    <h2 id="biz-feed-heading" className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">
                      {useDb || hasSeed ? 'Latest in Business' : 'Business Stories'}
                    </h2>
                  </div>
                  <Link href="/news" className={`inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline ${focusRing}`}>
                    More &#x203A;
                  </Link>
                </div>
                <div className="flex flex-col divide-y divide-gray-200">
                  {feed.map((item, i) => (
                    <Link key={item.href + i} href={item.href} className={`group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline rounded ${focusRing}`}>
                      <div className="shrink-0 overflow-hidden rounded-lg">
                        <NewsThumbnail category={item.categorySlug ?? item.category} src={item.image ?? undefined} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-2xs font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block ${getCatColor(item.categorySlug ?? item.category)}`}>
                          {item.category}
                        </span>
                        <h3 className="text-base sm:text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-900/75 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.summary && <p className="hidden sm:block text-base leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="text-gray-500 truncate">{item.source}</span>
                          <span>&middot;</span>
                          <span className="whitespace-nowrap">{item.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right rail */}
          <aside className="w-full lg:w-[280px] shrink-0 lg:self-stretch lg:border-l lg:border-gray-200 lg:pl-5" aria-label="Business sidebar">
            <StickySidebar>

              {/* Live markets */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">Liberia Markets</h3>
                <LiveMarketsMini />
              </div>

              {/* More stories / sidebar list */}
              {sidebarStories && (
                <div className="hidden lg:block rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">More from Business</h3>
                  <ol className="flex flex-col divide-y divide-gray-200">
                    {sidebarStories.map((s, i) => (
                      <li key={s.href + i} className="py-2.5 first:pt-0">
                        <Link href={s.href} className={`text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block ${focusRing}`}>
                          <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getCatColor(s.categorySlug)}`}>{s.category}</span>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Newsletter */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Business Brief</h3>
                <p className="text-sm text-gray-500 mb-4">Liberia&apos;s business and trade stories, weekly in your inbox.</p>
                <form aria-label="Sign up for the Business Brief newsletter">
                  <label htmlFor="biz-email" className="sr-only">Email address</label>
                  <input id="biz-email" type="email" required placeholder="Your email" className="w-full bg-transparent border-b border-gray-200 px-0 py-2 text-base text-gray-900 placeholder:text-gray-500 outline-none focus:border-gray-200 transition-colors mb-3" />
                  <button type="submit" className={`w-full rounded-lg bg-white py-2 text-base font-bold text-brand-ink hover:brightness-90 transition-all ${focusRing}`}>
                    Sign up free
                  </button>
                </form>
              </div>

            </StickySidebar>
          </aside>
        </div>
      </main>
    </>
  );
}
