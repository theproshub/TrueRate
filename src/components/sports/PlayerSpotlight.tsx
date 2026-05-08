import Link from 'next/link';
import { HeroVisual } from '@/components/NewsThumbnail';
import type { PlayerSpotlight as Data } from '@/lib/sports-data';

/**
 * Wembanyama-style player card: portrait visual, name, team, three stat tiles.
 */
export default function PlayerSpotlight({ player }: { player: Data }) {
  return (
    <Link
      href="#"
      className="group block border border-gray-200 hover:border-gray-400 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
    >
      <div className="overflow-hidden">
        <HeroVisual category={player.category} className="h-[180px]" />
      </div>
      <div className="px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-red-700 mb-1">Player Spotlight</p>
        <h3 className="text-[16px] font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
          {player.name}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">{player.team}</p>
        <p className="text-[12px] text-gray-700 leading-snug mt-2">{player.blurb}</p>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
          {player.stats.map(s => (
            <div key={s.label} className="text-center">
              <dt className="text-[10px] uppercase tracking-wide text-gray-500">{s.label}</dt>
              <dd className="text-[18px] font-bold text-gray-900 tabular-nums leading-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
}
