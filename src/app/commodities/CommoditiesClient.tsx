'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { commodities } from '@/data/commodities';
import type { Commodity } from '@/lib/types';

/* ── Types ── */
type TabKey = 'All' | 'Metals' | 'Agriculture' | 'Timber';
type Range  = '1Y' | '5Y';

/* ── Category mapping ── */
const COMMODITY_META: Record<string, {
  tab: TabKey;
  color: string;
  icon: string;
  lrImpact: string;
  exportShare: string;
  keyPlayer: string;
  description: string;
}> = {
  'Natural Rubber': {
    tab: 'Agriculture',
    color: '#84cc16',
    icon: '🌿',
    lrImpact: 'High',
    exportShare: '28.4%',
    keyPlayer: 'Firestone Harbel (Bridgestone)',
    description: 'Liberia hosts the world\'s largest rubber plantation — Firestone Harbel in Margibi County at ~220,000 acres. Natural rubber is the country\'s largest export by revenue, with prices directly linked to LRD strength. Every 10% rise in global rubber prices correlates with ~1.8% LRD appreciation over 60 days.',
  },
  'Iron Ore': {
    tab: 'Metals',
    color: '#f97316',
    icon: '⛏️',
    lrImpact: 'High',
    exportShare: '25.3%',
    keyPlayer: 'ArcelorMittal Liberia (Nimba County)',
    description: 'ArcelorMittal\'s Nimba County operations export iron ore via a 267 km private railway to the Port of Buchanan — one of West Africa\'s most significant mining operations. With a $1.6B expansion underway targeting 15Mtpa, iron ore drives the largest single FX inflow per export season.',
  },
  'Gold': {
    tab: 'Metals',
    color: '#eab308',
    icon: '🥇',
    lrImpact: 'Moderate',
    exportShare: '17.8%',
    keyPlayer: 'Bea Mountain Mining (Grand Cape Mount)',
    description: 'Bea Mountain Mining Corp (formerly Avesoro Resources) operates the Weasua gold field in Grand Cape Mount County. USD-denominated gold proceeds provide a partial natural hedge against LRD volatility. Artisanal mining adds significant informal sector contribution estimated at an additional $40–60M annually.',
  },
  'Palm Oil': {
    tab: 'Agriculture',
    color: '#f59e0b',
    icon: '🌴',
    lrImpact: 'Moderate',
    exportShare: '13.0%',
    keyPlayer: 'SOCFIN Agricultural Company Liberia',
    description: 'Palm oil production is concentrated in Sinoe and Grand Bassa counties. SOCFIN operates large plantation concessions. Declining global prices in 2025 exerted mild downward pressure on Q3 LRD performance. Government is investing in downstream processing to capture higher value-added margins.',
  },
  'Diamonds': {
    tab: 'Metals',
    color: '#60a5fa',
    icon: '💎',
    lrImpact: 'Low',
    exportShare: '4.2%',
    keyPlayer: 'Liberia Extractive Industries Transparency Initiative',
    description: 'Liberia\'s diamond sector operates largely through artisanal and small-scale mining under the Kimberly Process Certification Scheme (KPCS). The country became compliant in 2007 after the civil war-era "blood diamonds" trade. Revenue is modest but significant for rural communities in Lofa and Nimba counties.',
  },
  'Cocoa': {
    tab: 'Agriculture',
    color: '#a16207',
    icon: '🍫',
    lrImpact: 'Low',
    exportShare: '4.5%',
    keyPlayer: 'Smallholder cooperatives (Nimba, Lofa)',
    description: 'Cocoa is a smallholder crop grown primarily in Nimba and Lofa counties. Liberia\'s total production (~6,000–8,000 MT/year) is small relative to Ghana and Côte d\'Ivoire, but government programs aim to triple output by 2028. The global cocoa price surge in 2023–24 boosted farmer incomes significantly.',
  },
  'Timber (Logs)': {
    tab: 'Timber',
    color: '#15803d',
    icon: '🌲',
    lrImpact: 'Low',
    exportShare: '3.1%',
    keyPlayer: 'Forestry Development Authority (FDA)',
    description: 'Liberia holds approximately 4.6 million hectares of tropical forest — the largest remaining in West Africa. The FDA regulates commercial timber under community forestry management agreements (CFMAs). Exports are tightly controlled following post-war reconstruction of forest governance, with EU FLEGT verification required for exports to Europe.',
  },
};

function getMeta(name: string) {
  return COMMODITY_META[name] ?? {
    tab: 'All' as TabKey,
    color: '#94a3b8',
    icon: '📦',
    lrImpact: 'Low',
    exportShare: '—',
    keyPlayer: '—',
    description: '',
  };
}

/* ── Chart tooltip ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#040f18] px-3 py-2 shadow-xl">
      <p className="mb-1 text-[11px] text-gray-500">{label}</p>
      <p className="tabular-nums text-[13px] font-bold text-white">
        {unit === '/oz' || unit === '/tonne' || unit === '/carat' || unit === '/m³'
          ? `$${Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : `$${Number(payload[0].value).toFixed(3)}`}
        <span className="ml-1 font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
}

/* ── Commodity chart ── */
function CommodityChart({ commodity, color, range }: { commodity: Commodity; color: string; range: Range }) {
  const data = useMemo(() => {
    const raw = commodity.historicalData ?? [];
    if (!raw.length) return [];
    const lastDate = new Date(raw[raw.length - 1].date);
    const daysBack = range === '1Y' ? 365 : 1825;
    const cutoff = new Date(lastDate);
    cutoff.setDate(cutoff.getDate() - daysBack);
    const filtered = raw.filter(d => new Date(d.date) >= cutoff);
    const sampled = filtered.filter((_, i) => i % 7 === 0 || i === filtered.length - 1);
    return sampled.map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: d.value,
    }));
  }, [commodity, range]);

  const { minVal, maxVal } = useMemo(() => {
    if (!data.length) return { minVal: 0, maxVal: 0 };
    const vals = data.map(d => d.value);
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    const pad = (hi - lo) * 0.1;
    return { minVal: lo - pad, maxVal: hi + pad };
  }, [data]);

  const gradId = `grad-${commodity.name.replace(/\W/g, '')}`;

  return (
    <div className="h-[180px] w-full">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#555' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[minVal, maxVal]} tick={{ fontSize: 9, fill: '#555' }} tickLine={false} axisLine={false} width={44}
            tickFormatter={v => commodity.unit === '/kg' ? `$${Number(v).toFixed(2)}` : `$${Math.round(v).toLocaleString()}`} />
          <Tooltip content={<ChartTooltip unit={commodity.unit} />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
            fill={`url(#${gradId})`} dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1.5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Impact badge ── */
function ImpactBadge({ level }: { level: string }) {
  const cls =
    level === 'High'     ? 'bg-emerald-500/15 text-emerald-400' :
    level === 'Moderate' ? 'bg-yellow-500/15 text-yellow-400'   :
                           'bg-white/[0.07] text-gray-400';
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {level} LRD Impact
    </span>
  );
}

/* ── Main component ── */
export default function CommoditiesClient() {
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [activeName, setActiveName] = useState<string>('Natural Rubber');
  const [range, setRange] = useState<Range>('1Y');

  const TABS: TabKey[] = ['All', 'Metals', 'Agriculture', 'Timber'];

  const filtered = useMemo(() =>
    activeTab === 'All'
      ? commodities
      : commodities.filter(c => getMeta(c.name).tab === activeTab),
    [activeTab]
  );

  const activeItem = useMemo(
    () => commodities.find(c => c.name === activeName) ?? commodities[0],
    [activeName]
  );
  const activeMeta = getMeta(activeItem.name);

  return (
    <>
      {/* ── Tab filter ── */}
      <div className="mb-6 flex items-center gap-2 flex-wrap border-b border-white/[0.06] pb-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              activeTab === t
                ? 'bg-white text-[#050d11]'
                : 'text-white border border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Top: Price strip ── */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {commodities.map(c => {
          const meta = getMeta(c.name);
          const up = c.changePercent >= 0;
          const isActive = c.name === activeName;
          return (
            <button
              key={c.name}
              onClick={() => setActiveName(c.name)}
              className={`rounded-xl border px-3 py-3 text-left transition-all ${
                isActive
                  ? 'border-white/30 bg-white/[0.08]'
                  : 'border-white/[0.07] bg-brand-card hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[14px] leading-none">{meta.icon}</span>
                <span className="text-[10px] font-bold text-gray-400 leading-snug truncate">{c.name}</span>
              </div>
              <div className="tabular-nums text-[14px] font-black text-white leading-none mb-1">
                {c.unit === '/kg'
                  ? `$${c.price.toFixed(3)}`
                  : c.price >= 1000
                    ? `$${c.price.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
                    : `$${c.price.toFixed(2)}`}
              </div>
              <div className={`text-[11px] font-semibold tabular-nums ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {up ? '▲' : '▼'} {Math.abs(c.changePercent).toFixed(2)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left: table */}
        <div className="w-full lg:w-[340px] shrink-0">
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <h2 className="text-[14px] font-bold text-white">Price Overview</h2>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {filtered.map(c => {
                const meta = getMeta(c.name);
                const up = c.changePercent >= 0;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActiveName(c.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeName === c.name ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-[18px] shrink-0">{meta.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-white leading-none mb-0.5 truncate">{c.name}</div>
                      <div className="text-[10px] text-gray-500">{c.currency} · {c.unit}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="tabular-nums text-[13px] font-bold text-white">
                        {c.unit === '/kg'
                          ? `$${c.price.toFixed(3)}`
                          : c.price >= 1000
                            ? `$${c.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : `$${c.price.toFixed(2)}`}
                      </div>
                      <div className={`tabular-nums text-[11px] font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {up ? '+' : ''}{c.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-5 py-2 border-t border-white/[0.05] text-[10px] text-gray-500">
              Source: World Bank Pink Sheet · Reuters · Bloomberg · Apr 2026
            </div>
          </div>

          {/* Liberia Export Snapshot */}
          <div className="mt-4 rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <h3 className="text-[13px] font-bold text-white">Liberia Export Snapshot</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Q1 2026 · USD millions</p>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {[
                { name: 'Natural Rubber', value: 142, total: 312, color: '#84cc16' },
                { name: 'Iron Ore',       value: 88,  total: 312, color: '#f97316' },
                { name: 'Gold',           value: 38,  total: 312, color: '#eab308' },
                { name: 'Palm Oil',       value: 28,  total: 312, color: '#f59e0b' },
                { name: 'Other',          value: 16,  total: 312, color: '#94a3b8' },
              ].map(item => (
                <div key={item.name} className="px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-white">{item.name}</span>
                    <span className="tabular-nums text-[12px] text-gray-400">${item.value}M</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(item.value / item.total) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.05]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Total Exports</span>
                <span className="tabular-nums text-[13px] font-bold text-white">$312M</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] font-bold text-emerald-400">▲ +14%</span>
                <span className="text-[10px] text-gray-500">vs Q1 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: detail panel */}
        <div className="flex-1 min-w-0">
          {/* Active commodity header */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[24px] leading-none">{activeMeta.icon}</span>
                    <h2 className="text-[20px] font-black text-white leading-none">{activeItem.name}</h2>
                    <ImpactBadge level={activeMeta.lrImpact} />
                  </div>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="tabular-nums text-[32px] font-black text-white leading-none">
                      {activeItem.unit === '/kg'
                        ? `$${activeItem.price.toFixed(3)}`
                        : activeItem.price >= 1000
                          ? `$${activeItem.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                          : `$${activeItem.price.toFixed(2)}`}
                    </span>
                    <span className="text-[14px] text-gray-500">USD{activeItem.unit}</span>
                    <span className={`tabular-nums text-[16px] font-bold ${activeItem.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {activeItem.changePercent >= 0 ? '▲' : '▼'} {Math.abs(activeItem.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
                {/* 52-week range */}
                <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-right shrink-0">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">52-Week Range</div>
                  <div className="tabular-nums text-[12px] font-semibold text-white">
                    ${activeItem.unit === '/kg' ? activeItem.low52w.toFixed(3) : activeItem.low52w.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    <span className="text-gray-500 mx-1">–</span>
                    ${activeItem.unit === '/kg' ? activeItem.high52w.toFixed(3) : activeItem.high52w.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="mt-1.5 h-1.5 w-[140px] rounded-full bg-white/[0.08] overflow-hidden ml-auto">
                    <div
                      className="h-full rounded-full bg-brand-accent"
                      style={{
                        marginLeft: `${((activeItem.price - activeItem.low52w) / (activeItem.high52w - activeItem.low52w)) * 80}%`,
                        width: '8px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/[0.05]">
              {[
                { label: 'Export Share',  value: activeMeta.exportShare },
                { label: 'Key Player',    value: activeMeta.keyPlayer },
                { label: '1-Day Change',  value: `${activeItem.change >= 0 ? '+' : ''}${activeItem.change.toFixed(activeItem.unit === '/kg' ? 4 : 2)}` },
                { label: 'LRD Sensitivity', value: activeMeta.lrImpact },
              ].map(stat => (
                <div key={stat.label} className="px-4 py-3">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{stat.label}</div>
                  <div className="text-[13px] font-semibold text-white leading-snug truncate" title={stat.value}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-5">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <h3 className="text-[14px] font-bold text-white">{activeItem.name} — Price History</h3>
              <div className="flex items-center gap-1">
                {(['1Y', '5Y'] as Range[]).map(r => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`rounded px-2.5 py-1 text-[11px] font-bold transition-colors ${
                      range === r ? 'bg-white/[0.1] text-white' : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 pt-4 pb-2">
              <CommodityChart commodity={activeItem} color={activeMeta.color} range={range} />
            </div>
            <div className="px-5 py-2 border-t border-white/[0.05] text-[11px] text-gray-500">
              Historical price data · Source: World Bank · Reuters · Bloomberg
            </div>
          </div>

          {/* Liberia context */}
          <div className="rounded-xl border border-white/[0.07] bg-brand-card p-5 mb-5">
            <h3 className="text-[14px] font-bold text-white mb-2">Liberia Context</h3>
            <p className="text-[13px] leading-relaxed text-gray-400 font-montserrat">{activeMeta.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}
