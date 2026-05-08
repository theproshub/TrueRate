import Link from 'next/link';
import type { Match } from '@/lib/sports-data';
import TeamCrest from './TeamCrest';

const STATUS_LABEL: Record<Match['status'], string> = {
  live:     'LIVE',
  final:    'FINAL',
  upcoming: 'UPCOMING',
};

/** Single match card — used inside the scoreboard rail and league mini-rails. */
export default function ScoreboardCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const isUpcoming = match.status === 'upcoming';
  const isLive     = match.status === 'live';

  return (
    <Link
      href={`/sports/match/${match.id}`}
      className="group flex flex-col shrink-0 w-[210px] sm:w-[230px] border border-gray-200 bg-white px-3 py-2.5 hover:border-gray-400 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-1"
      aria-label={`${match.leagueLabel}: ${match.home.name} vs ${match.away.name}, ${STATUS_LABEL[match.status]}`}
    >
      {/* Top: league + status chip */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide mb-2">
        <span className="text-red-700">{match.leagueLabel}</span>
        <span
          className={
            'inline-flex items-center gap-1.5 px-1.5 py-0.5 ' +
            (isLive
              ? 'bg-red-700 text-white'
              : isUpcoming
              ? 'bg-gray-100 text-gray-700'
              : 'bg-gray-900 text-white')
          }
        >
          {isLive && <span aria-hidden className="motion-safe:animate-pulse h-1.5 w-1.5 rounded-full bg-white" />}
          {STATUS_LABEL[match.status]}
        </span>
      </div>

      {/* Time / venue note for upcoming */}
      {isUpcoming && (
        <p className="text-[11px] font-semibold text-gray-700 mb-1">{match.when ?? 'TBD'}</p>
      )}

      {/* Teams */}
      <div className="flex flex-col gap-1.5">
        <Row name={match.home.name} short={match.home.short} score={match.home.score} isUpcoming={isUpcoming} />
        <Row name={match.away.name} short={match.away.short} score={match.away.score} isUpcoming={isUpcoming} />
      </div>

      {/* Bottom: venue / note */}
      {!compact && (
        <p className="mt-2 text-[11px] text-gray-500 line-clamp-1">
          {match.note ? `${match.note} · ` : ''}{match.venue}
        </p>
      )}
    </Link>
  );
}

function Row({
  name,
  short,
  score,
  isUpcoming,
}: {
  name: string;
  short: string;
  score?: number;
  isUpcoming: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <TeamCrest short={short} size={20} />
      <span className="flex-1 truncate text-[13px] font-semibold text-gray-900">{name}</span>
      <span className="tabular-nums text-[14px] font-bold text-gray-900 w-7 text-right">
        {isUpcoming || score === undefined ? '—' : score}
      </span>
    </div>
  );
}
