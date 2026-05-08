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
      className="group block bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050d11]"
    >
      <div className="overflow-hidden">
        <HeroVisual category={player.category} className="h-[180px]" />
      </div>
      <div className="px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 mb-1">Player Spotlight</p>
        <h3 className="text-[16px] font-bold text-white leading-tight group-hover:text-gray-100 transition-colors">
          {player.name}
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">{player.team}</p>
        <p className="text-[12px] text-gray-300 leading-snug mt-2">{player.blurb}</p>

        <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3">
          {player.stats.map(s => (
            <div key={s.label} className="text-center">
              <dt className="text-[10px] uppercase tracking-wide text-gray-500">{s.label}</dt>
              <dd className="text-[18px] font-bold text-white tabular-nums leading-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Link>
  );
}
