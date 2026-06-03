'use client';

import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ACCENT } from './colors';

/**
 * <TrendChart/> — single area chart for the focused item over the selected
 * timeframe. Real dated points. One accent color, clean right axis, minimal
 * gridlines. aria-hidden (decorative); the value + context panel carry the data.
 */
export default function TrendChart({
  points,
  unit = '',
  height = 260,
}: {
  points: { date: string; value: number }[];
  unit?: string;
  height?: number;
}) {
  const gid = `trend-grad-${useId().replace(/:/g, '')}`;
  const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });

  if (points.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded border border-white/[0.06] text-2xs uppercase tracking-[0.1em] text-gray-600"
        style={{ width: '100%', height }}
      >
        Building history — updates daily
      </div>
    );
  }

  const data = points.map((p) => ({ date: p.date, v: p.value }));

  return (
    <div aria-hidden="true" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.22} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" hide />
          <YAxis
            orientation="right"
            width={52}
            tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            domain={['dataMin', 'dataMax']}
            tickFormatter={fmt}
          />
          <Tooltip
            contentStyle={{
              background: '#04101a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
            }}
            labelStyle={{ color: '#9ca3af', fontSize: 11 }}
            itemStyle={{ color: '#fff' }}
            formatter={(v) => [fmt(Number(v)) + (unit ? ` ${unit}` : ''), ''] as [string, string]}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={ACCENT}
            strokeWidth={2}
            fill={`url(#${gid})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
