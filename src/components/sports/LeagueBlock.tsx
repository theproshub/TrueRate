import Link from 'next/link';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import type { LeagueBlockData } from '@/lib/sports-data';
import SectionHead from './SectionHead';
import LeagueRail from './LeagueRail';
import PlayerSpotlight from './PlayerSpotlight';

/**
 * Composite league section — featured story + 3 secondaries + mini scoreboard rail
 * + player spotlight. Mirrors Yahoo's per-league blocks (NBA, MLB, etc).
 */
export default function LeagueBlock({ data }: { data: LeagueBlockData }) {
  return (
    <section aria-labelledby={`league-${data.key}`} className="mt-12 first:mt-0">
      <SectionHead title={data.title} action={data.href} actionLabel="Read more" />
      <span id={`league-${data.key}`} className="sr-only">{data.title}</span>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured story (image left on desktop) */}
        <Link
          href={data.featured.href}
          className="lg:col-span-8 group flex flex-col sm:flex-row gap-4 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
        >
          <div className="overflow-hidden sm:shrink-0">
            <HeroVisual category={data.featured.category} className="w-full sm:w-[260px] h-[160px] sm:h-[176px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-red-400 mb-1.5">{data.featured.category}</p>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-white leading-snug group-hover:text-gray-100 transition-colors">
              {data.featured.title}
            </h3>
            <p className="mt-2 text-[13px] text-gray-300 leading-relaxed line-clamp-3">{data.featured.dek}</p>
            <p className="mt-2 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-400">{data.featured.source}</span>
              <span className="mx-1.5">·</span>
              {data.featured.time}
            </p>
          </div>
        </Link>

        {/* Player spotlight */}
        <div className="lg:col-span-4">
          <PlayerSpotlight player={data.spotlight} />
        </div>
      </div>

      {/* 3 secondary headlines + mini scoreboard rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.08] pt-4">
          {data.secondaries.map(s => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
              >
                <div className="overflow-hidden mb-2">
                  <NewsThumbnail category={s.category} className="w-full h-[110px]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-red-400 mb-1">{s.category}</p>
                <h4 className="text-[13px] font-semibold text-gray-100 leading-snug group-hover:text-white transition-colors line-clamp-3">
                  {s.title}
                </h4>
                <p className="mt-1 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-400">{s.source}</span>
                  <span className="mx-1">·</span>
                  {s.time}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-4 lg:border-l lg:border-white/[0.08] lg:pl-6 border-t lg:border-t-0 border-white/[0.08] pt-4 lg:pt-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-2">Recent Results</p>
          <LeagueRail matches={data.miniScores} ariaLabel={`${data.title} recent results`} compact />
        </div>
      </div>
    </section>
  );
}
