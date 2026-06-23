'use client';

import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DIRECTION_HEX } from './colors';

/**
 * <TrendChart/> — Yahoo-Finance-style performance chart.
 *
 * Instead of plotting raw values (where a USD/LRD line near 190 and an M2 line
 * near 600,000 are unreadable on the same mental scale), it normalises the
 * window to **percent change from its first observation**. That makes every
 * series tell the same story at a glance: how far above/below the start of the
 * period are we now. The reading is reinforced with:
 *   · a 0% break-even baseline (the line you'd sit on if nothing changed)
 *   · a dashed "current level" guide at the latest reading
 *   · an endpoint pill + dot carrying the net % move, coloured by direction
 *   · a right-hand axis in %, the way finance terminals show relative perf.
 *
 * aria-hidden (decorative): the value + change + context panel carry the data.
 */
export default function TrendChart({
  points,
  unit = '',
  height = 260,
  mode = 'percent',
}: {
  points: { date: string; value: number }[];
  unit?: string;
  height?: number;
  /** 'percent' = normalise to % change (default); 'value' = raw values. */
  mode?: 'percent' | 'value';
}) {
  const gid = `trend-grad-${useId().replace(/:/g, '')}`;

  if (points.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded border border-gray-200 text-2xs uppercase tracking-[0.1em] text-gray-600"
        style={{ width: '100%', height }}
      >
        Building history — updates daily
      </div>
    );
  }

  const isPct = mode === 'percent';
  const base = points[0].value;

  // y = the value we plot; raw = the underlying reading (kept for the tooltip).
  const data = points.map((p) => ({
    date: p.date,
    y: isPct ? (base !== 0 ? ((p.value - base) / Math.abs(base)) * 100 : 0) : p.value,
    raw: p.value,
  }));

  const lastDate = data[data.length - 1].date;
  const lastY = data[data.length - 1].y;
  const dir = lastY > 0.0001 ? 'up' : lastY < -0.0001 ? 'down' : 'neutral';
  const color = DIRECTION_HEX[dir];

  // ── tick + format helpers ──────────────────────────────────────────────
  const tickCount = Math.min(5, data.length);
  const step = Math.max(1, Math.floor((data.length - 1) / (tickCount - 1)));
  const tickIndices = new Set(
    Array.from({ length: tickCount }, (_, i) =>
      i === tickCount - 1 ? data.length - 1 : i * step,
    ),
  );

  const formatDate = (raw: string) => {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
  };

  const fmtPct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;
  const fmtVal = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const fmtAxis = (v: number) => (isPct ? fmtPct(v) : fmtVal(v));

  // ── y-domain: pad so the line + pill don't kiss the edges ──────────────
  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys, isPct ? 0 : Infinity);
  const maxY = Math.max(...ys, isPct ? 0 : -Infinity);
  const pad = (maxY - minY) * 0.12 || 1;

  return (
    <div aria-hidden="true" className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="92%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="2 5"
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
            width={62}
            tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            domain={[minY - pad, maxY + pad]}
            tickFormatter={fmtAxis}
            tickCount={6}
          />

          {/* Break-even baseline — only meaningful in percent mode. */}
          {isPct && (
            <ReferenceLine
              y={0}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={1}
            />
          )}

          {/* Current-level guide, dashed + coloured, with the net-move pill. */}
          <ReferenceLine
            y={lastY}
            stroke={color}
            strokeDasharray="5 4"
            strokeWidth={1}
            ifOverflow="extendDomain"
            label={<EndpointPill value={lastY} color={color} format={fmtAxis} />}
          />

          <Tooltip
            cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
            contentStyle={{
              background: 'rgba(4,16,26,0.95)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '6px 10px',
              boxShadow: 'none',
            }}
            labelStyle={{ color: '#9ca3af', fontSize: 10, marginBottom: 2 }}
            itemStyle={{ color: '#fff', padding: 0 }}
            labelFormatter={(label) => formatDate(String(label))}
            formatter={(_v, _n, item) => {
              const p = item?.payload as { y: number; raw: number } | undefined;
              if (!p) return ['', ''] as [string, string];
              const move = isPct ? fmtPct(p.y) : '';
              const raw = fmtVal(p.raw) + (unit ? ` ${unit}` : '');
              return [isPct ? `${move}  ·  ${raw}` : raw, ''] as [string, string];
            }}
          />

          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gid})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: '#04101a', strokeWidth: 2 }}
            isAnimationActive={false}
          />

          {/* Endpoint marker on the latest reading. */}
          <ReferenceDot
            x={lastDate}
            y={lastY}
            r={4}
            fill={color}
            stroke="#04101a"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Pill drawn at the right end of the dashed current-level line, sitting in the
 * axis gutter and carrying the net move (e.g. "+9.13%"). Recharts injects
 * `viewBox` ({x, y, width, height}) for a horizontal reference-line label.
 */
function EndpointPill({
  viewBox,
  value,
  color,
  format,
}: {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  value: number;
  color: string;
  format: (v: number) => string;
}) {
  if (!viewBox || viewBox.x == null || viewBox.y == null || viewBox.width == null) return null;
  const text = format(value);
  const h = 19;
  const w = text.length * 7 + 12;
  const x = viewBox.x + viewBox.width + 2; // into the axis gutter
  const y = viewBox.y - h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={color} />
      <text
        x={x + w / 2}
        y={viewBox.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight={700}
        fontFamily="var(--font-mono)"
        fill="#04101a"
      >
        {text}
      </text>
    </g>
  );
}
