import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import LeagueNavStrip from '@/components/sports/LeagueNavStrip';
import LeagueRail from '@/components/sports/LeagueRail';
import LeagueBlock from '@/components/sports/LeagueBlock';
import TopicHubBanner from '@/components/sports/TopicHubBanner';
import WatchRail from '@/components/sports/WatchRail';
import TrendingSidebar from '@/components/sports/TrendingSidebar';
import SportsNetworkRail from '@/components/sports/SportsNetworkRail';
import SectionHead from '@/components/sports/SectionHead';
import SidebarFooter from '@/components/sports/SidebarFooter';
import StickySidebar from '@/components/sports/StickySidebar';
import { Heading, Text } from '@/components/ui';
import {
  SCOREBOARD,
  HERO,
  HERO_RELATED,
  LEAGUE_BLOCKS,
  TOPIC_HUBS,
  VIDEOS,
  MOST_READ,
  SPORTS_NETWORK,
} from '@/lib/sports-data';

export const metadata: Metadata = {
  title: 'Sports — Liberian Football, Basketball & Athletics',
  alternates: { canonical: '/sports' },
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

  return (
    <div className="min-h-screen text-gray-200">
      {/* 1. League nav strip — sits below SportsChrome (rendered by layout) */}
      <LeagueNavStrip />

      <main className="mx-auto max-w-[1320px] px-4 py-5">
        {/* 2. Breadcrumb */}
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sports' }]} />

        {/* 3. Live scoreboard rail */}
        <div className="mt-4">
          <LeagueRail matches={SCOREBOARD} ariaLabel="Live and upcoming scores" />
        </div>

        {/* 5. Three-column main grid: left rail · main · right rail */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-6 xl:gap-x-8 gap-y-10">
          {/* Left rail — Trending (mobile: render last so main + right rail come first) */}
          <aside aria-label="Sports left sidebar" className="order-3 lg:order-1 lg:col-span-2 hidden lg:block">
            <StickySidebar>
              <TrendingSidebar />
              <section aria-labelledby="sidebar-trending">
                <SectionHead id="sidebar-trending" title="Trending in Sport" />
                <ol className="flex flex-col divide-y divide-white/[0.06]">
                  {MOST_READ.map((s) => (
                    <li key={s.href} className="py-2.5 first:pt-0">
                      <Link
                        href={s.href}
                        className="group flex items-start gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
                      >
                        <div className="min-w-0">
                          <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-500 mb-0.5">{s.category}</Text>
                          <Heading level={6} className="text-gray-100 leading-snug group-hover:text-white group-hover:underline group-hover:decoration-white/50 underline-offset-2 transition-colors line-clamp-2">{s.title}</Heading>
                          <Text variant="meta" className="mt-0.5 text-gray-500">{s.source}<span className="mx-1">·</span>{s.time}</Text>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </StickySidebar>
          </aside>

          {/* Main column */}
          <div className="order-1 lg:order-2 lg:col-span-7 min-w-0">
            {/* Hero feature + related bullet links */}
            <section aria-labelledby="hero-feature" className="pb-8 border-b border-white/[0.08]">
              <div className="overflow-hidden mb-5">
                <HeroVisual category={HERO.category} className="w-full h-[260px] sm:h-[400px]" />
              </div>

              <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-400 mb-2">{HERO.category}</Text>

              <Link
                href={HERO.href}
                className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
              >
                <h1
                  id="hero-feature"
                  className="text-2xl sm:text-[26px] font-bold text-white leading-[1.15] tracking-tight no-underline group-hover:underline group-hover:decoration-white/50 underline-offset-4 transition-all mb-4"
                >
                  {HERO.title}
                </h1>
              </Link>

              <Text className="text-md leading-relaxed text-gray-300 mb-3">{HERO.dek}</Text>

              <Text className="text-base mb-5">
                <span className="font-bold text-white">{HERO.source}</span>
                <span className="mx-1.5 text-gray-600">·</span>
                <time className="text-gray-500">{HERO.time}</time>
              </Text>

              <ul className="flex flex-col gap-3">
                {HERO_RELATED.map(s => (
                  <li key={s.href} className="flex items-start gap-2.5">
                    <span aria-hidden className="mt-[5px] shrink-0 h-2 w-2 rounded-full bg-gray-500" />
                    <Link
                      href={s.href}
                      className="text-base font-bold text-white no-underline hover:underline hover:decoration-white/50 underline-offset-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11] leading-snug"
                    >
                      {s.title}
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
          </div>

          {/* Right rail */}
          <aside aria-label="Sports sidebar" className="order-2 lg:order-3 lg:col-span-3 hidden lg:block">
            <StickySidebar>
              <SportsNetworkRail items={SPORTS_NETWORK} />
              <section aria-labelledby="sidebar-watch">
                <SectionHead id="sidebar-watch" title="Watch" action="/sports/watch" actionLabel="More on TrueRate Sports" />
                <WatchRail videos={VIDEOS} layout="sidebar" />
              </section>
              <SidebarFooter />
            </StickySidebar>
          </aside>
        </div>

      </main>
    </div>
  );
}
