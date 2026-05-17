import Link from 'next/link';
import { MY_TEAMS } from '@/lib/sports-data';
import TeamCrest from './TeamCrest';
import SectionHead from './SectionHead';
import { Text } from '@/components/ui';

const RESULT_BG: Record<'W' | 'L' | 'D', string> = {
  W: 'bg-lime-500/15 text-lime-300 border border-lime-500/30',
  L: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
  D: 'bg-white/[0.06] text-gray-300 border border-white/[0.12]',
};

/**
 * Sticky right rail (desktop) — mirrors Yahoo's My Teams panel.
 * Collapses below content on mobile.
 */
export default function MyTeamsSidebar() {
  return (
    <div>
      <SectionHead title="My Teams" />

      <div className="border-y border-white/[0.08]">
        {MY_TEAMS.map(t => (
          <div
            key={t.name}
            className="flex items-center gap-3 py-3 border-b border-white/[0.06] last:border-0"
          >
            <TeamCrest short={t.short} size={32} />
            <div className="min-w-0 flex-1">
              <Text className="text-base font-semibold text-white leading-tight truncate">{t.name}</Text>
              <Text variant="caption" className="uppercase tracking-wide text-gray-500 mt-0.5">{t.league}</Text>
              <Text variant="meta" className="text-gray-400 mt-1 truncate">{t.next}</Text>
            </div>
            {t.last && (
              <span
                className={`shrink-0 px-2 py-1 text-2xs font-bold tabular-nums ${RESULT_BG[t.last.result]}`}
                aria-label={`Last result: ${t.last.result === 'W' ? 'Win' : t.last.result === 'L' ? 'Loss' : 'Draw'}, ${t.last.text}`}
              >
                <span aria-hidden>{t.last.result}</span>
                <span className="ml-1.5 font-semibold">{t.last.text}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
