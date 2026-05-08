import Link from 'next/link';
import { LEAGUE_NAV } from '@/lib/sports-data';

/**
 * Horizontal league nav strip — mirrors Yahoo's NFL/NBA/MLB row.
 * Renders BELOW SportsChrome's existing sub-nav in the page itself.
 */
export default function LeagueNavStrip() {
  return (
    <nav
      aria-label="Sport leagues"
      className="bg-[#08151c] border-b border-white/[0.08] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="mx-auto max-w-[1320px] px-2 sm:px-4 flex items-center gap-0">
        {LEAGUE_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] font-semibold text-gray-300 hover:text-emerald-400 transition-colors no-underline focus-visible:outline-none focus-visible:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[#08151c]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
