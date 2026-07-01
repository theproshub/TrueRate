import type { Metadata } from 'next';
import { fetchBusinessArticles, toBusinessStory, type BusinessStory } from '@/lib/business/feed';
import { newsItems } from '@/data/news';
import { RightRail } from '@/components/NewsSidebars';
import { getNewsItems, getPopularNewsItems } from '@/lib/news-source';

import LeadStory from '@/components/business/LeadStory';
import StoryCard from '@/components/business/StoryCard';
import StoryRow from '@/components/business/StoryRow';
import SectorBlock from '@/components/business/SectorBlock';
import VideoSection from '@/components/business/VideoSection';
import NewsletterInline from '@/components/business/NewsletterInline';

export const metadata: Metadata = {
  title: 'Business — Liberian Business & Entrepreneurship',
  alternates: { canonical: '/small-business' },
  description:
    "News, analysis, and data for Liberia's business community — companies, trade, entrepreneurship, credit, and the sectors driving economic growth.",
};

export const revalidate = 300;

/* ── Card shape ── */

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

const VIDEOS = [
  { title: 'Can Liberian Small Businesses Survive the Credit Squeeze?', summary: 'With lending rates above 13% and bank credit to the private sector barely growing, small businesses face a funding wall. TrueRate breaks down what the latest CBL data means for entrepreneurs trying to grow.', source: 'TrueRate Video', time: 'Jun 22, 2026', href: '/videos', duration: '04:12', categorySlug: 'credit' },
  { title: 'LRD Holds Steady — What Exporters and Importers Need to Know', source: 'TrueRate Video', time: 'Jun 20, 2026', href: '/videos', duration: '02:34', categorySlug: 'forex' },
  { title: 'Iron Ore Is Booming — Is Liberia Ready for the Next Commodity Cycle?', source: 'TrueRate Video', time: 'Jun 18, 2026', href: '/videos', duration: '03:15', categorySlug: 'mining' },
  { title: 'Inside Monrovia\'s New Wave of Mobile-Money Merchants', source: 'TrueRate Video', time: 'Jun 15, 2026', href: '/videos', duration: '01:58', categorySlug: 'finance' },
  { title: 'Government Revenue Is Up 12% — Where Is the Money Going?', source: 'TrueRate Video', time: 'Jun 12, 2026', href: '/videos', duration: '02:47', categorySlug: 'policy' },
];

export default async function SmallBusinessPage() {
  const [db, sidebarItems, popularItems] = await Promise.all([
    fetchBusinessArticles({ limit: 24 }),
    getNewsItems(),
    getPopularNewsItems(),
  ]);
  const useDb = db.length > 0;
  const stories = db.map(toBusinessStory);

  const BIZ_CATS = new Set([
    'business', 'trade', 'industry', 'mining', 'credit', 'finance', 'banking', 'entrepreneurship',
  ]);
  const seedArticles: Card[] = newsItems
    .filter((n) => BIZ_CATS.has(n.category))
    .map((n) => ({
      category: n.category.charAt(0).toUpperCase() + n.category.slice(1),
      categorySlug: n.category,
      title: n.title,
      summary: n.summary,
      source: n.author ?? n.source,
      time: (() => {
        const d = new Date(n.date);
        const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      })(),
      href: `/news/${n.id}`,
      image: n.image ?? null,
    }));

  const pool: Card[] = [
    ...(useDb ? stories.map(storyToCard) : []),
    ...seedArticles,
  ];
  const seen = new Set<string>();
  const allCards = pool.filter((c) => {
    if (seen.has(c.href)) return false;
    seen.add(c.href);
    return true;
  });

  const hero = allCards[0];
  const secondaryStories = allCards.slice(1, 4);
  const latestNews = allCards.slice(4, 8);
  const sectorCards = allCards.slice(8, 12);
  const sideHustle = allCards.slice(12, 16);
  const moreStories = allCards.slice(16);

  return (
    <>
      <main className="bg-white min-h-screen">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-5 pt-5 sm:pt-6 pb-10 sm:pb-12">
          <div className="flex flex-col lg:flex-row lg:gap-8">

            {/* ══════════ Main column ══════════ */}
            <div className="flex-1 min-w-0 space-y-5 sm:space-y-6">

              {/* ── 1. Top Stories ── */}
              <section aria-labelledby="biz-top-heading" className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                <h2 id="biz-top-heading" className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] pb-3 border-b border-gray-300 mb-4 sm:mb-5">
                  Small Business<span className="text-gray-300 font-normal mx-2">|</span>Top Stories
                </h2>
                <LeadStory {...hero} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
                  {secondaryStories.map((card, i) => (
                    <StoryCard key={card.href + i} {...card} horizontal />
                  ))}
                </div>
              </section>

              {/* ── 2. Latest News ── */}
              <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6" aria-labelledby="biz-latest-heading">
                <h2 id="biz-latest-heading" className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] pb-3 border-b border-gray-300 mb-4">
                  Latest News
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <div className="flex flex-col divide-y divide-gray-100">
                    {latestNews.slice(0, 2).map((item, i) => (
                      <StoryRow key={item.href + i} {...item} />
                    ))}
                  </div>
                  <div className="flex flex-col divide-y divide-gray-100 border-t sm:border-t-0 border-gray-100">
                    {latestNews.slice(2, 4).map((item, i) => (
                      <StoryRow key={item.href + i} {...item} />
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 3. Top Videos ── */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                <VideoSection videos={VIDEOS} />
              </div>

              {/* ── 4. Banking & Credit ── */}
              <div className="border-t border-gray-200 pt-5 sm:pt-6">
                <SectorBlock title="Banking & Credit" cards={sectorCards} />
              </div>

              {/* ── 5. Start a Business ── */}
              <div className="border-t border-gray-200 pt-5 sm:pt-6">
                <SectorBlock title="Start a Business" cards={sideHustle} />
              </div>

              {/* ── 6. More Business Stories ── */}
              <section className="border-t border-gray-200 pt-5 sm:pt-6" aria-labelledby="biz-more-heading">
                <h2 id="biz-more-heading" className="text-lg sm:text-xl font-extrabold text-[#0A0A0A] pb-3 border-b border-gray-300 mb-4">
                  More Business Stories
                </h2>
                <div className="flex flex-col divide-y divide-gray-100">
                  {moreStories.map((item, i) => (
                    <StoryRow key={item.href + i} {...item} compact />
                  ))}
                </div>
              </section>

              {/* ── 7. Newsletter ── */}
              <div>
                <NewsletterInline />
              </div>
            </div>

            {/* ══════════ Right rail ══════════ */}
            <RightRail items={sidebarItems} popularItems={popularItems} />
          </div>
        </div>
      </main>
    </>
  );
}
