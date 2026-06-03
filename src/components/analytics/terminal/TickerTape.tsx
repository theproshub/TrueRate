'use client';

import { directionClass, arrow } from './colors';
import { toTickerView } from './view-model';
import type { AnalyticsItem } from '@/lib/analytics/types';

/**
 * <TickerTape/> — thin, full-bleed, continuously scrolling tape of live figures.
 * Reuses the project's `ticker-scroll` keyframes (80s linear, pauses on hover).
 * Each item: LABEL  VALUE  ▲/▼ change. Mono figures, aligned.
 */
export default function TickerTape({ items }: { items: AnalyticsItem[] }) {
  const views = items.map(toTickerView);
  if (views.length === 0) return null;

  return (
    <div
      role="marquee"
      aria-label="Live Liberian market ticker"
      className="border-y border-white/10 bg-brand-muted"
    >
      <div className="mx-auto max-w-container overflow-hidden">
        <div className="ticker-scroll flex w-max items-center">
          {/* Doubled for a seamless loop. */}
          {[...views, ...views].map((item, i) => (
            <span
              key={`${item.id}-${i}`}
              className="flex shrink-0 items-baseline gap-2 whitespace-nowrap px-5 py-2"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {item.label}
              </span>
              <span className="font-mono text-sm tabular-nums text-white">{item.value}</span>
              <span className={`font-mono text-xs tabular-nums ${directionClass(item.direction)}`}>
                {arrow(item.direction) && <span className="mr-0.5">{arrow(item.direction)}</span>}
                {item.note}
              </span>
              <span aria-hidden className="ml-3 h-3 w-px bg-white/10" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
