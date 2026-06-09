import type { StoryFlag } from '@/lib/sports-finance-data';

/** Newsroom story flag — tuned for light editorial surfaces. */
const STYLE: Record<StoryFlag, string> = {
  Exclusive: 'bg-brand-ink text-white',
  Live:      'bg-neg text-white',
  Analysis:  'border border-violet-300 text-violet-700 bg-violet-50',
  Opinion:   'border border-amber-300 text-amber-800 bg-amber-50',
  Data:      'border border-sky-300 text-sky-700 bg-sky-50',
  Interview: 'border border-emerald-300 text-emerald-700 bg-emerald-50',
};

export default function FlagChip({ flag, className = '' }: { flag: StoryFlag; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-2xs font-bold uppercase tracking-wider ${STYLE[flag]} ${className}`}>
      {flag === 'Live' && (
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
      )}
      {flag}
    </span>
  );
}
