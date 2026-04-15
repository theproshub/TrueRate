'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { exchangeRates } from '@/data/exchangeRates';
import type { NormalizedRate } from '@/app/api/rates/route';

const CHART_PAIRS = [
  { pair: 'USD/LRD', from: 'USD', color: '#BFEA36' },
  { pair: 'EUR/LRD', from: 'EUR', color: '#3b82f6' },
  { pair: 'GBP/LRD', from: 'GBP', color: '#10b981' },
  { pair: 'CNY/LRD', from: 'CNY', color: '#f59e0b' },
];

const TIME_RANGES = ['1Y', '5Y'] as const;
type ChartRange = typeof TIME_RANGES[number];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-brand-card px-3 py-2 shadow-xl">
      <p className="mb-1 text-[11px] text-gray-500">{label}</p>
      <p className="tabular-nums text-[13px] font-bold text-white">
        {Number(payload[0].value).toFixed(2)} <span className="font-normal text-gray-500">LRD</span>
      </p>
    </div>
  );
}

function ForexChart() {
  const [activePair, setActivePair] = useState('USD/LRD');
  const [range, setRange] = useState<ChartRange>('1Y');

  const { data, color } = useMemo(() => {
    const entry = CHART_PAIRS.find(p => p.pair === activePair)!;
    const rate = exchangeRates.find(r => r.pair === activePair);
    const raw = rate?.historicalData ?? [];

    if (!raw.length) return { data: [], color: entry.color };

    // Filter relative to the last data point (not a hardcoded "now")
    const lastDate = new Date(raw[raw.length - 1].date);
    const daysBack = range === '1Y' ? 365 : 1825;
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - daysBack);

    const filtered = raw.filter(d => new Date(d.date) >= cutoff);
    // Downsample to weekly points to keep Recharts fast
    const sampled = filtered.filter((_, i) => i % 7 === 0 || i === filtered.length - 1);

    return {
      data: sampled.map(d => ({
        date: d.date,
        value: d.value,
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      })),
      color: entry.color,
    };
  }, [activePair, range]);

  const { minVal, maxVal } = useMemo(() => {
    if (!data.length) return { minVal: 0, maxVal: 0 };
    const vals = data.map(d => d.value);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * 0.1;
    return { minVal: lo - pad, maxVal: hi + pad };
  }, [data]);

  const gradientId = `forex-grad-${activePair.replace('/', '')}`;

  return (
    <div className="mb-6 rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          {CHART_PAIRS.map(p => (
            <button
              key={p.pair}
              onClick={() => setActivePair(p.pair)}
              className={`rounded px-2.5 py-1 text-[12px] font-bold transition-colors ${
                activePair === p.pair
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={activePair === p.pair ? { backgroundColor: `${p.color}22`, color: p.color } : {}}
            >
              {p.pair}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {TIME_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded px-2 py-0.5 text-[11px] font-bold transition-colors ${
                range === r
                  ? 'bg-white/[0.1] text-white'
                  : 'text-gray-400 hover:text-gray-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[220px] w-full px-2 pt-4 pb-2" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#555' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minVal, maxVal]}
              tick={{ fontSize: 10, fill: '#555' }}
              tickLine={false}
              axisLine={false}
              width={48}
              tickFormatter={v => Number(v).toFixed(0)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="border-t border-white/[0.05] px-5 py-2 text-[11px] text-gray-500">
        Historical LRD exchange rates · Source: CBL Annual Reports · IMF Article IV
      </div>
    </div>
  );
}

function Pill({ text, up }: { text: string; up: boolean }) {
  return (
    <span className={`tabular-nums text-[12px] font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
      {up ? '▲' : '▼'} {text}
    </span>
  );
}

interface Props {
  /** Seed rates passed from the server component (instant render, no flash) */
  seedRates: NormalizedRate[];
  seedDate: string | null;
}

export default function ForexClient({ seedRates, seedDate }: Props) {
  const [rates, setRates] = useState<NormalizedRate[]>(seedRates);
  const [rateDate, setRateDate] = useState<string | null>(seedDate);
  const [isLive, setIsLive] = useState(false);
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('LRD');

  // Build lookup: { USD: 192.5, EUR: 209.8, ... LRD: 1 }
  const lookup = useMemo(() => {
    const map: Record<string, number> = { LRD: 1 };
    for (const r of rates) map[r.from] = r.rate;
    return map;
  }, [rates]);

  const currencies = useMemo(() => Object.keys(lookup).sort(), [lookup]);

  // Client-side live refresh (runs once after hydration)
  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.rates?.length) {
          setRates(data.rates);
          setRateDate(data.date);
          setIsLive(true);
        }
      })
      .catch(() => { /* silent — seed data remains */ });
  }, []);

  const converted = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const fromRate = lookup[from] ?? 1;
    const toRate = lookup[to] ?? 1;
    return ((amt * fromRate) / toRate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }, [amount, from, to, lookup]);

  const displayRate = useMemo(() => {
    const fromRate = lookup[from] ?? 1;
    const toRate = lookup[to] ?? 1;
    return (fromRate / toRate).toFixed(4);
  }, [from, to, lookup]);

  const dateLabel = rateDate
    ? new Date(rateDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Fetching…';

  return (
    <>
      {/* Historical Chart */}
      <ForexChart />

      {/* Status bar */}
      <div className="mb-6 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`} />
        <span className="text-[12px] text-gray-500">
          {isLive ? `Live rates · Updated ${dateLabel}` : `Fetching live data…`}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Converter ── */}
        <div className="rounded-xl border border-white/[0.07] bg-brand-card p-5">
          <h2 className="mb-4 text-[15px] font-bold text-white">Currency Converter</h2>
          <div className="space-y-3">
            {/* Amount + From */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Amount
              </label>
              <div className="flex overflow-hidden rounded border border-white/[0.07] transition focus-within:border-emerald-400/50 focus-within:ring-1 focus-within:ring-emerald-400/20">
                <input
                  type="number"
                  value={amount}
                  min="0"
                  onChange={e => setAmount(e.target.value)}
                  className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white outline-none bg-white/[0.05]"
                />
                <select
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="border-l border-white/[0.07] bg-brand-card px-2 py-2 text-[13px] font-bold text-white outline-none"
                >
                  {currencies.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-brand-card" />
              <button
                onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.05] text-gray-500 transition hover:border-emerald-400/50 hover:text-emerald-400"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
              <div className="h-px flex-1 bg-brand-card" />
            </div>

            {/* Result */}
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Converted
              </label>
              <div className="flex overflow-hidden rounded border border-white/[0.07] bg-white/[0.05]">
                <div className="tabular-nums w-full px-3 py-2.5 text-[14px] font-bold text-white">
                  {converted}
                </div>
                <select
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="border-l border-white/[0.07] bg-brand-card px-2 py-2 text-[13px] font-bold text-white outline-none"
                >
                  {currencies.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <p className="text-center text-[12px] text-gray-500">
              1 {from} = <span className="tabular-nums font-bold text-white">{displayRate}</span> {to}
            </p>
          </div>
        </div>

        {/* ── Rate table ── */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white">Exchange Rate Table</h2>
            {isLive && (
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="border-b border-white/[0.05] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-3 sm:px-5 py-3 text-left">Pair</th>
                  <th className="px-3 sm:px-5 py-3 text-right">Rate (LRD)</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">Change</th>
                  <th className="px-3 sm:px-5 py-3 text-right">% Chg</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W High</th>
                  <th className="hidden sm:table-cell px-5 py-3 text-right">52W Low</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {rates.map(r => (
                  <tr key={r.pair} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-3 sm:px-5 py-3 font-bold text-emerald-400">{r.pair}</td>
                    <td className="tabular-nums px-3 sm:px-5 py-3 text-right font-semibold text-white">
                      {r.rate.toFixed(4)}
                    </td>
                    <td className={`hidden sm:table-cell tabular-nums px-5 py-3 text-right font-semibold ${r.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {r.change >= 0 ? '+' : ''}{r.change.toFixed(4)}
                    </td>
                    <td className="px-3 sm:px-5 py-3 text-right">
                      <Pill text={`${Math.abs(r.changePercent).toFixed(2)}%`} up={r.changePercent >= 0} />
                    </td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">
                      {r.high52w.toFixed(4)}
                    </td>
                    <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-500">
                      {r.low52w.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/[0.05] px-5 py-2 text-[11px] text-gray-500">
            Source: fawazahmed0/exchange-api · Central Bank of Liberia ·{' '}
            {isLive ? `Updated ${dateLabel}` : 'Fetching live data…'}
          </div>
        </div>
      </div>
    </>
  );
}
