import Link from 'next/link';
import type { Match } from '@/lib/sports-data';
import TeamCrest from './TeamCrest';
import { Text } from '@/components/ui';

const STATUS_LABEL: Record<Match['status'], string> = {
  live:     'LIVE',
  final:    'FINAL',
  upcoming: 'UPCOMING',
};

/**
 * Yahoo-style match card on dark theme:
 *   ┌──────── orange→red top stripe ────────┐
 *   │ TIME / WHEN              BROADCASTER  │
 *   │ ◇ Home name             record   78  │
 *   │ ◇ Away name             record   72  │
 *   │ note · venue                          │
 *   └──────────────────────────────────────┘
 */
export default function ScoreboardCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const isUpcoming = match.status === 'upcoming';
  const isLive     = match.status === 'live';

  const homeWin = !isUpcoming && (match.home.score ?? 0) > (match.away.score ?? 0);
  const awayWin = !isUpcoming && (match.away.score ?? 0) > (match.home.score ?? 0);

  return (
    <Link
      href={`/sports/match/${match.id}`}
      className={`group flex flex-col bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-colors no-underline overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 focus-visible:ring-offset-brand-dark ${compact ? 'w-full' : 'shrink-0 w-[210px] sm:w-[230px]'}`}
      aria-label={`${match.leagueLabel}: ${match.home.name} vs ${match.away.name}, ${STATUS_LABEL[match.status]}`}
    >
      {/* Yahoo-style top stripe — green theme */}
      <div aria-hidden className="h-1 w-full bg-gradient-to-r from-brand-accent via-brand-accent to-teal-600" />

      <div className="px-3 pt-2 pb-2.5">
        {/* Top row: time / status */}
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide mb-1">
          <span className="text-gray-400">
            {isUpcoming ? (match.when ?? 'UPCOMING') : isLive ? (
              <span className="inline-flex items-center gap-1 text-brand-accent">
                <span aria-hidden className="motion-safe:animate-pulse h-1.5 w-1.5 rounded-full bg-brand-accent" />
                LIVE
              </span>
            ) : 'FINAL'}
          </span>
          <span className="text-gray-500">{match.leagueLabel}</span>
        </div>

        {/* Teams */}
        <div className="flex flex-col gap-1.5">
          <Row name={match.home.name} short={match.home.short} score={match.home.score} isUpcoming={isUpcoming} dimmed={awayWin} />
          <Row name={match.away.name} short={match.away.short} score={match.away.score} isUpcoming={isUpcoming} dimmed={homeWin} />
        </div>

        {/* Bottom: venue / note */}
        {!compact && (
          <Text variant="meta" className="mt-2 text-gray-500 line-clamp-1 border-t border-white/[0.06] pt-1.5">
            {match.note ? `${match.note} · ` : ''}{match.venue}
          </Text>
        )}
      </div>
    </Link>
  );
}

function Row({
  name,
  short,
  score,
  isUpcoming,
  dimmed,
}: {
  name: string;
  short: string;
  score?: number;
  isUpcoming: boolean;
  dimmed: boolean;
}) {
  const nameColor = dimmed ? 'text-gray-400' : 'text-white';
  const scoreColor = dimmed ? 'text-gray-400' : 'text-white';
  return (
    <div className="flex items-center gap-2">
      <TeamCrest short={short} size={20} />
      <span className={`flex-1 truncate text-base font-semibold ${nameColor}`}>{name}</span>
      <span className={`tabular-nums text-md font-bold w-7 text-right ${scoreColor}`}>
        {isUpcoming || score === undefined ? '—' : score}
      </span>
    </div>
  );
}
