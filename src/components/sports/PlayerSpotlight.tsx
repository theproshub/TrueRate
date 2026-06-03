import Link from 'next/link';
import { HeroVisual } from '@/components/NewsThumbnail';
import type { PlayerSpotlight as Data } from '@/lib/sports-data';
import { Heading, Text } from '@/components/ui';

/**
 * Wembanyama-style player card: portrait visual, name, team, three stat tiles.
 */
export default function PlayerSpotlight({ player }: { player: Data }) {
  return (
    <Link
      href="#"
      className="group block bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
    >
      <div className="overflow-hidden">
        <HeroVisual category={player.category} className="h-[160px] sm:h-[200px]" />
      </div>
      <div className="px-4 py-3">
        <Text variant="caption" className="font-bold uppercase tracking-wide text-gray-400 mb-1">Player Spotlight</Text>
        <Heading level={4} className="text-white leading-tight group-hover:text-gray-100 transition-colors">
          {player.name}
        </Heading>
        <Text variant="meta" className="text-gray-500 mt-0.5">{player.team}</Text>
        <Text className="text-sm text-gray-300 leading-snug mt-2">{player.blurb}</Text>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3">
          {player.stats.map(s => (
            <div key={s.label} className="text-center">
              <dt className="text-2xs uppercase tracking-wide text-gray-500">{s.label}</dt>
              <dd className="text-xl font-bold text-white tabular-nums leading-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
}
