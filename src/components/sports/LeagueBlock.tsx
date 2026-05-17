import Link from 'next/link';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import type { LeagueBlockData } from '@/lib/sports-data';
import SectionHead from './SectionHead';
import LeagueRail from './LeagueRail';
import PlayerSpotlight from './PlayerSpotlight';
import { Heading, Text } from '@/components/ui';

/**
 * Yahoo-style per-league section:
 *   ┌─ Section header (title + "Read more") ───────────────────────────────┐
 *   │                                                                       │
 *   │  [Featured story image — full width of 8/12 col]   [Player card]     │
 *   │  Category kicker                                    4/12 col          │
 *   │  Headline                                                             │
 *   │  Dek                                                                  │
 *   │  Source · Time                                                        │
 *   │                                                                       │
 *   ├───────────────────────────────────────────────────────────────────────┤
 *   │                                                                       │
 *   │  [Thumb 1]   [Thumb 2]   [Thumb 3]          [Recent Results rail]    │
 *   └───────────────────────────────────────────────────────────────────────┘
 */
export default function LeagueBlock({ data }: { data: LeagueBlockData }) {
  const headingId = `league-${data.key}`;
  return (
    <section aria-labelledby={headingId} className="mt-12">
      <SectionHead id={headingId} title={data.title} action={data.href} actionLabel="Read more" />

      {/* Row 1: featured story (8/12) + player spotlight (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Link
          href={data.featured.href}
          className="lg:col-span-8 group block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
        >
          <div className="overflow-hidden mb-3">
            <HeroVisual category={data.featured.category} className="w-full h-[200px] sm:h-[240px]" />
          </div>
          <Text variant="meta" className="font-bold uppercase tracking-wide text-gray-400 mb-1.5">
            {data.featured.category}
          </Text>
          <Heading level={3} className="sm:text-[20px] text-white leading-snug group-hover:text-gray-100 group-hover:underline group-hover:decoration-white/50 underline-offset-2 transition-colors">
            {data.featured.title}
          </Heading>
          <Text className="mt-2 text-md text-gray-300 leading-relaxed line-clamp-3">
            {data.featured.dek}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            <span className="font-semibold text-gray-400">{data.featured.source}</span>
            <span className="mx-1.5">·</span>
            <time>{data.featured.time}</time>
          </Text>
        </Link>

        <div className="lg:col-span-4">
          <PlayerSpotlight player={data.spotlight} />
        </div>
      </div>

      {/* Row 2: secondary stories — horizontal Yahoo-style list */}
      <ul className="mt-6 pt-6 border-t border-white/[0.08] flex flex-col divide-y divide-white/[0.06]">
        {data.secondaries.map(s => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex items-start gap-4 py-4 first:pt-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#050d11]"
            >
              <div className="shrink-0 overflow-hidden">
                <NewsThumbnail category={s.category} className="w-[240px] h-[160px]" />
              </div>
              <div className="min-w-0 flex-1 py-1">
                <Heading level={3} as="h4" className="text-white leading-snug group-hover:text-gray-200 group-hover:underline group-hover:decoration-white/50 underline-offset-2 transition-colors line-clamp-3">
                  {s.title}
                </Heading>
                <Text className="mt-2 text-base text-gray-500">
                  <span className="font-semibold text-gray-400">{s.source}</span>
                  <span className="mx-1.5">·</span>
                  <time>{s.time}</time>
                </Text>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Row 3: recent results — horizontal rail full-width */}
      <div className="mt-6 pt-6 border-t border-white/[0.08]">
        <Text variant="caption" className="font-bold uppercase tracking-widest text-gray-500 mb-3">
          Recent Results
        </Text>
        <LeagueRail matches={data.miniScores} ariaLabel={`${data.title} recent results`} />
      </div>
    </section>
  );
}
