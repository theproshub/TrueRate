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
 * <TrendChart/> — single area chart for the focused item. Styled to feel
 * editorial (Bloomberg / FT), not template-generated: thin muted gridlines,
 * short date labels on the x-axis, restrained accent color, no box shadow on
 * the tooltip. aria-hidden (decorative); the value + context panel carry data.
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

  // Show ~5 evenly-spaced date ticks regardless of data density
  const tickCount = Math.min(5, data.length);
  const step = Math.max(1, Math.floor((data.length - 1) / (tickCount - 1)));
  const tickIndices = new Set(
    Array.from({ length: tickCount }, (_, i) =>
      i === tickCount - 1 ? data.length - 1 : i * step,
    ),
  );

  // Short date formatter: "Mar 26" or "2025" for yearly data
  const formatDate = (raw: string) => {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // If all dates share the same month, show day: "Mar 4"
    return `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
  };

  // Compute Y domain with ~5% padding so the line doesn't touch edges
  const values = data.map((d) => d.v);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const pad = (maxV - minV) * 0.05 || 1;

  return (
    <div aria-hidden="true" className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity={0.15} />
              <stop offset="90%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 4"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val, i) => (tickIndices.has(i) ? formatDate(val) : '')}
            interval={0}
            dy={4}
          />

          <YAxis
            orientation="right"
            width={48}
            tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            domain={[minV - pad, maxV + pad]}
            tickFormatter={fmt}
            tickCount={5}
          />

          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
            contentStyle={{
              background: 'rgba(4,16,26,0.95)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '6px 10px',
              boxShadow: 'none',
            }}
            labelStyle={{ color: '#9ca3af', fontSize: 10, marginBottom: 2 }}
            itemStyle={{ color: '#fff', padding: 0 }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(v) =>
              [fmt(Number(v)) + (unit ? ` ${unit}` : ''), ''] as [string, string]
            }
          />

          <Area
            type="monotone"
            dataKey="v"
            stroke={ACCENT}
            strokeWidth={1.5}
            fill={`url(#${gid})`}
            dot={false}
            activeDot={{
              r: 3,
              fill: ACCENT,
              stroke: '#04101a',
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
