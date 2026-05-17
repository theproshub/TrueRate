import type { Match } from '@/lib/sports-data';
import ScoreboardCard from './ScoreboardCard';

/**
 * Horizontal scroll-snap rail of ScoreboardCards.
 * Used at the top of the page (live scoreboard) and inside each league block.
 * Pure CSS — no JS, no carousel libs.
 */
export default function LeagueRail({
  matches,
  ariaLabel,
  compact = false,
}: {
  matches: Match[];
  ariaLabel: string;
  compact?: boolean;
}) {
  return (
    <section aria-label={ariaLabel} aria-live="polite">
      {compact ? (
        <div className="flex flex-col gap-2">
          {matches.map(m => (
            <ScoreboardCard key={m.id} match={m} compact />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:thin] focus-visible:outline-none">
          {matches.map(m => (
            <div key={m.id} className="snap-start">
              <ScoreboardCard match={m} compact={false} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
