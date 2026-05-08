import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import LeagueNavStrip from '@/components/sports/LeagueNavStrip';
import LeagueRail from '@/components/sports/LeagueRail';
import HeadlineStrip from '@/components/sports/HeadlineStrip';
import LeagueBlock from '@/components/sports/LeagueBlock';
import TopicHubBanner from '@/components/sports/TopicHubBanner';
import WatchRail from '@/components/sports/WatchRail';
import MyTeamsSidebar from '@/components/sports/MyTeamsSidebar';
import SectionHead from '@/components/sports/SectionHead';
import {
  SCOREBOARD,
  TOP_HEADLINES,
  HERO,
  HERO_RELATED,
  LEAGUE_BLOCKS,
  TOPIC_HUBS,
  VIDEOS,
  MOST_READ,
} from '@/lib/sports-data';

export const metadata: Metadata = {
  title: 'Sports — Liberian Football, Basketball & Athletics | TrueRate',
  description:
    'Liberian sports — LPL, LWPL, LBA, Lone Star, athletics and the diaspora. Live scores, headlines, and analysis from across Liberia and West Africa.',
};

export default function SportsPage() {
  // LPL block is featured separately in the body; keep the rest in order.
  const lplBlock      = LEAGUE_BLOCKS.find(b => b.key === 'LPL')!;
  const lbaBlock      = LEAGUE_BLOCKS.find(b => b.key === 'LBA')!;
  const nationalBlock = LEAGUE_BLOCKS.find(b => b.key === 'NATIONAL')!;
  const lafBlock      = LEAGUE_BLOCKS.find(b => b.key === 'LAF')!;
  const diasporaBlock = LEAGUE_BLOCKS.find(b => b.key === 'DIASPORA')!;

  const [hubLpl, hubWafu] = TOPIC_HUBS;
  const mostReadLeft  = MOST_READ.slice(0, 5);
  const mostReadRight = MOST_READ.slice(5, 10);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. League nav strip — sits below SportsChrome (rendered by layout) */}
      <LeagueNavStrip />

      <main className="mx-auto max-w-[1320px] px-4 py-5">
        {/* 2. Breadcrumb */}
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports' }]} />

        {/* 3. Live scoreboard rail */}
        <div className="mt-4">
          <LeagueRail matches={SCOREBOARD} ariaLabel="Live and upcoming scores" />
        </div>

        {/* 4. Six top headlines */}
        <div className="mt-6">
          <HeadlineStrip items={TOP_HEADLINES} />
        </div>

        {/* 5. Two-column main grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10">
          {/* Main column */}
          <div className="lg:col-span-8 min-w-0">
            {/* Hero feature + 3 related */}
            <section aria-labelledby="hero-feature" className="pb-8 border-b border-gray-300">
              <Link href={HERO.href} className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2">
                <div className="overflow-hidden mb-4">
                  <HeroVisual category={HERO.category} className="w-full h-[260px] sm:h-[380px]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-red-700 mb-2">{HERO.category}</p>
                <h1 id="hero-feature" className="text-[26px] sm:text-[32px] font-bold text-gray-900 leading-[1.15] tracking-tight group-hover:text-gray-700 transition-colors mb-3">
                  {HERO.title}
                </h1>
                <p className="text-[14px] leading-relaxed text-gray-600 mb-3">{HERO.dek}</p>
                <p className="text-[12px] text-gray-500">
                  <span className="font-semibold text-gray-700">{HERO.source}</span>
                  <span className="mx-1.5">·</span>
                  <time>{HERO.time}</time>
                </p>
              </Link>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HERO_RELATED.map(s => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="group flex sm:flex-col items-start gap-3 sm:gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1"
                    >
                      <div className="shrink-0 overflow-hidden">
                        <NewsThumbnail category={s.category} className="h-[72px] w-[108px] sm:w-full sm:h-[110px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-1">{s.category}</p>
                        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors line-clamp-3">{s.title}</h3>
                        <p className="mt-1 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700">{s.source}</span>
                          <span className="mx-1">·</span>
                          {s.time}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* LPL Title Race hub */}
            <div className="mt-10">
              <TopicHubBanner hub={hubLpl} />
            </div>

            {/* League blocks */}
            <LeagueBlock data={lplBlock} />
            <LeagueBlock data={lbaBlock} />

            {/* WAFU hub */}
            <div className="mt-12">
              <TopicHubBanner hub={hubWafu} />
            </div>

            <LeagueBlock data={nationalBlock} />
            <LeagueBlock data={lafBlock} />
            <LeagueBlock data={diasporaBlock} />

            {/* Watch rail */}
            <section aria-labelledby="watch" className="mt-12">
              <SectionHead title="Watch" action="/sports/watch" actionLabel="More videos" />
              <span id="watch" className="sr-only">Sports videos</span>
              <WatchRail videos={VIDEOS} />
            </section>

            {/* Most read */}
            <section aria-labelledby="most-read" className="mt-12">
              <SectionHead title="Most Read in Sport" />
              <span id="most-read" className="sr-only">Most read sports stories</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 border-y border-gray-200">
                <ol className="md:border-r md:border-gray-100">
                  {mostReadLeft.map((s, i) => (
                    <li key={s.href} className="border-b border-gray-100 last:border-0">
                      <Link href={s.href} className="group flex items-start gap-3 py-3 pr-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1">
                        <span aria-hidden className="shrink-0 text-[24px] font-bold text-red-700 leading-none w-7 tabular-nums">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-0.5">{s.category}</p>
                          <h3 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">{s.title}</h3>
                          <p className="mt-1 text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">{s.source}</span>
                            <span className="mx-1">·</span>
                            {s.time}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
                <ol start={6}>
                  {mostReadRight.map((s, i) => (
                    <li key={s.href} className="border-b border-gray-100 last:border-0">
                      <Link href={s.href} className="group flex items-start gap-3 py-3 pr-3 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1">
                        <span aria-hidden className="shrink-0 text-[24px] font-bold text-red-700 leading-none w-7 tabular-nums">{i + 6}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-0.5">{s.category}</p>
                          <h3 className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">{s.title}</h3>
                          <p className="mt-1 text-[11px] text-gray-500">
                            <span className="font-semibold text-gray-700">{s.source}</span>
                            <span className="mx-1">·</span>
                            {s.time}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          {/* Right rail */}
          <aside aria-label="My teams" className="lg:col-span-4">
            <MyTeamsSidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
