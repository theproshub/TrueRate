import Link from 'next/link';
import { MY_TEAMS } from '@/lib/sports-data';
import TeamCrest from './TeamCrest';
import SectionHead from './SectionHead';

const RESULT_BG: Record<'W' | 'L' | 'D', string> = {
  W: 'bg-emerald-100 text-emerald-800',
  L: 'bg-red-100 text-red-800',
  D: 'bg-gray-100 text-gray-700',
};

/**
 * Sticky right rail (desktop) — mirrors Yahoo's My Teams panel.
 * Collapses below content on mobile.
 */
export default function MyTeamsSidebar() {
  return (
    <div className="lg:sticky lg:top-4">
      <SectionHead title="My Teams" />

      <div className="border-y border-gray-200">
        {MY_TEAMS.map(t => (
          <div
            key={t.name}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
          >
            <TeamCrest short={t.short} size={32} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight truncate">{t.name}</p>
              <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5">{t.league}</p>
              <p className="text-[11px] text-gray-600 mt-1 truncate">{t.next}</p>
            </div>
            {t.last && (
              <span
                className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold tabular-nums ${RESULT_BG[t.last.result]}`}
                aria-label={`Last result: ${t.last.result === 'W' ? 'Win' : t.last.result === 'L' ? 'Loss' : 'Draw'}, ${t.last.text}`}
              >
                <span aria-hidden>{t.last.result}</span>
                <span className="ml-1.5 font-semibold">{t.last.text}</span>
              </span>
            )}
          </div>
        ))}
      </div>

      <Link
        href="/sign-in"
        className="mt-4 inline-flex w-full items-center justify-center bg-red-700 hover:bg-red-800 text-white text-[12px] font-bold uppercase tracking-wide px-4 py-2.5 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2"
      >
        Sign in to personalize
      </Link>
    </div>
  );
}
