'use client';

import { DIRECTION_HEX, type Direction } from './colors';

/**
 * <RangeBar/> — Bloomberg-style low–high bar with a marker showing where the
 * current value sits in the period range. `position` is a precomputed 0–1 from
 * the view-model (real low/high/current). Marker colored by direction.
 */
export default function RangeBar({
  position,
  lowLabel,
  highLabel,
  label,
  direction,
}: {
  position: number;
  lowLabel: string;
  highLabel: string;
  label: string;
  direction: Direction;
}) {
  const pct = `${(Math.min(1, Math.max(0, position)) * 100).toFixed(1)}%`;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-2xs uppercase tracking-[0.1em] text-gray-500">{label}</span>
      </div>
      <div
        className="relative h-[3px] w-full rounded-full bg-white/12"
        role="img"
        aria-label={`${label}: ${lowLabel} to ${highLabel}, current near ${pct} of range`}
      >
        <span
          className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-brand-dark"
          style={{ left: pct, background: DIRECTION_HEX[direction] }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-2xs tabular-nums text-gray-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
