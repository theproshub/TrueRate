'use client';

import { TIMEFRAMES, type Timeframe } from './view-model';

/**
 * <TimeframeTabs/> — plain text tabs, underline on active. No buttons-with-shadows.
 * Selecting a timeframe re-slices the real history (see toStatView / sliceByTimeframe).
 */
export default function TimeframeTabs({
  value,
  onChange,
}: {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Chart timeframe"
      className="-mx-1.5 flex items-center justify-between sm:mx-0 sm:justify-start sm:gap-5"
    >
      {TIMEFRAMES.map((tf) => {
        const active = tf === value;
        return (
          <button
            key={tf}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tf)}
            className={`flex min-h-11 flex-1 items-center justify-center border-b-2 font-mono text-base tabular-nums tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:-mb-px sm:min-h-0 sm:flex-none sm:pb-1.5 sm:text-sm ${
              active
                ? 'border-brand-accent text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-600'
            }`}
          >
            {tf}
          </button>
        );
      })}
    </div>
  );
}
