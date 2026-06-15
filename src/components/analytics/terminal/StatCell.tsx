'use client';

import { memo, useState } from 'react';
import dynamic from 'next/dynamic';

const Sparkline = dynamic(() => import('./Sparkline'), { ssr: false });
import RangeBar from './RangeBar';
import ContextNote from './ContextNote';
import SourceTag from './SourceTag';
import { directionClass, arrow } from './colors';
import type { StatView } from './view-model';

/**
 * <StatCell/> — two-tier.
 *   GLANCE (always visible): label, large tabular value, signed colored change,
 *     prior reading, sparkline. Whole glance row selects the focus chart.
 *   DETAIL (expand): range bar, "what this means", Liberia angle, source.
 */
export default memo(function StatCell({
  view,
  active,
  onSelect,
}: {
  view: StatView;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const detailId = `detail-${view.id}`;
  const isMacro = view.kind === 'macro';

  return (
    <div className={`transition-colors ${active ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}>
      {/* ── Glance layer ── */}
      <div className="flex items-center gap-4 py-3.5">
        <button
          type="button"
          onClick={() => onSelect(view.id)}
          aria-pressed={active}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {/* label + value + prior */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
                {view.label}
              </span>
              {active && <span aria-hidden className="h-1 w-1 rounded-full bg-brand-accent" />}
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-2xl leading-none tabular-nums text-white">
                {view.value}
              </span>
              {view.unit && view.kind === 'commodity' && (
                <span className="font-mono text-xs text-gray-500">{view.unit}</span>
              )}
            </div>
            <div className="mt-1 font-mono text-2xs tabular-nums text-gray-600">
              {isMacro ? 'Prior' : 'Prev'} {view.prior}
            </div>
          </div>

          {/* change + sparkline */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="text-right">
              <div className={`font-mono text-base tabular-nums ${directionClass(view.direction)}`}>
                {arrow(view.direction) && <span className="mr-0.5">{arrow(view.direction)}</span>}
                {view.change ?? '—'}
              </div>
              <div className="mt-0.5 text-2xs uppercase tracking-wide text-gray-600">
                {view.period}
              </div>
            </div>
            {!isMacro &&
              (view.spark.length >= 2 ? (
                <Sparkline series={view.spark} direction={view.direction} />
              ) : (
                <span className="min-w-[48px] max-w-[80px] w-full text-right font-mono text-2xs text-gray-700">—</span>
              ))}
          </div>
        </button>

        {/* expand toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={detailId}
          aria-label={open ? `Hide details for ${view.label}` : `Show details for ${view.label}`}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-gray-600 transition-colors hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:min-h-0 sm:min-w-0 sm:p-1"
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ── Detail layer ── */}
      {open && (
        <div id={detailId} className="space-y-3 pb-4 pl-0 pr-9">
          {view.rangePos != null ? (
            <RangeBar
              position={view.rangePos}
              lowLabel={view.rangeLowLabel}
              highLabel={view.rangeHighLabel}
              label={view.rangeLabel}
              direction={view.direction}
            />
          ) : (
            <p className="font-mono text-2xs uppercase tracking-[0.08em] text-gray-600">
              {view.rangeLabel} — building history
            </p>
          )}
          {view.note && <ContextNote text={view.note} />}
          {view.liberiaAngle && <ContextNote text={view.liberiaAngle} variant="liberia" />}
          <SourceTag source={view.source} updatedAt={view.updatedAt} />
        </div>
      )}
    </div>
  );
});
