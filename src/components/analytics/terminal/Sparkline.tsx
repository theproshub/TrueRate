'use client';

import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { DIRECTION_HEX, type Direction } from './colors';

/**
 * Tiny inline sparkline (Recharts). Decorative — aria-hidden; the cell's value
 * and signed % carry the meaning. Colored by direction (green/red/neutral).
 * Width is fluid by default so it scales with container on mobile.
 */
export default function Sparkline({
  series,
  direction,
  width = '100%',
  height = 24,
}: {
  series: number[];
  direction: Direction;
  width?: number | string;
  height?: number;
}) {
  const data = series.map((v, i) => ({ i, v }));
  const color = DIRECTION_HEX[direction];

  return (
    <div
      aria-hidden="true"
      className="min-w-[48px] max-w-[80px]"
      style={{ width, height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.08}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
