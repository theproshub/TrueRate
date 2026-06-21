'use client';

import dynamic from 'next/dynamic';
import RangeBar from './RangeBar';

const TrendChart = dynamic(() => import('./TrendChart'), {
  ssr: false,
  loading: () => <div className="h-[260px] w-full animate-pulse rounded bg-white/[0.04]" />,
});
import ContextNote from './ContextNote';
import SourceTag from './SourceTag';
import TimeframeTabs from './TimeframeTabs';
import { directionClass, arrow } from './colors';
import type { StatView, Timeframe } from './view-model';

/**
 * <FocusPanel/> — the focused historical chart with the FULL context panel:
 * big value + change, timeframe tabs, range bar, prior, the "what this means"
 * note, Liberia angle, and source. All values are live (from the data layer).
 */
export default function FocusPanel({
  view,
  timeframe,
  onTimeframe,
}: {
  view: StatView;
  timeframe: Timeframe;
  onTimeframe: (tf: Timeframe) => void;
}) {
  const isMacro = view.kind === 'macro';

  return (
    <figure className="m-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      {/* Header: value + change + timeframe */}
      <figcaption className="mb-4 border-b border-white/15 pb-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">
              {view.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl leading-none tabular-nums text-white">
                {view.value}
              </span>
              {view.unit && view.kind === 'commodity' && (
                <span className="font-mono text-sm text-gray-500">{view.unit}</span>
              )}
              <span className={`font-mono text-base tabular-nums ${directionClass(view.direction)}`}>
                {arrow(view.direction) && <span className="mr-0.5">{arrow(view.direction)}</span>}
                {view.change ?? '—'}
                <span className="ml-1 text-2xs uppercase tracking-wide text-gray-600">
                  {view.period}
                </span>
              </span>
            </div>
            <div className="mt-1 font-mono text-2xs tabular-nums text-gray-600">
              {isMacro ? 'Prior' : 'Prev close'} {view.prior}
            </div>
          </div>
          <TimeframeTabs value={timeframe} onChange={onTimeframe} />
        </div>
      </figcaption>

      <TrendChart points={view.chart} unit={view.kind === 'commodity' ? view.unit : ''} />

      {/* Context panel */}
      <div className="mt-4 space-y-3.5">
        {view.rangePos != null && (
          <RangeBar
            position={view.rangePos}
            lowLabel={view.rangeLowLabel}
            highLabel={view.rangeHighLabel}
            label={view.rangeLabel}
            direction={view.direction}
          />
        )}
        {view.note && <ContextNote text={view.note} />}
        {view.liberiaAngle && <ContextNote text={view.liberiaAngle} variant="liberia" />}
        <SourceTag source={view.source} updatedAt={view.updatedAt} />
      </div>
    </figure>
  );
}
