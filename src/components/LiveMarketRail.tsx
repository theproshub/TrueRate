'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   LiveMarketRail — homepage sidebar market data, sourced from live endpoints.

   FX rates  → /api/rates       (live LRD mid-rates; the % change in the seed is
                                  NOT live, so we deliberately omit it rather than
                                  display a fabricated delta)
   Indicators→ /api/indicators  (Supabase / World Bank macro series — value,
                                  change, period and source are genuinely sourced)

   No section renders fabricated values. If an endpoint returns nothing, that
   block is omitted entirely (delete, don't seed).
───────────────────────────────────────────────────────────────────────────── */

type Rate = {
  pair: string;
  from: string;
  to: string;
  rate: number;
};

type Indicator = {
  key: string;
  name: string;
  value: number;
  change: number | null;
  changePercent: number | null;
  unit: string;
  period: string;
  source: string;
};

/** FX pairs surfaced on the homepage, in display order. */
const FX_FROM = ['USD', 'EUR', 'GBP'];

/** Macro indicators surfaced on the homepage, in display order. */
const INDICATOR_KEYS = ['GDP', 'INFLATION', 'CBL_RATE', 'RESERVES', 'TRADE_BALANCE', 'GOVT_DEBT'];

function formatRate(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatIndicator(value: number, unit: string): string {
  const u = unit.trim();
  if (u === '%') return `${value}%`;
  if (!u) return `${value}`;
  return `${value} ${u}`;
}

/** Literal direction: arrow + color follow the SIGN of the change (Bloomberg/Reuters convention). */
function deltaParts(change: number | null): { arrow: string; cls: string } {
  if (change === null || change === 0) return { arrow: '', cls: 'text-gray-400' };
  return change > 0
    ? { arrow: '▲', cls: 'text-pos' }
    : { arrow: '▼', cls: 'text-neg' };
}

export default function LiveMarketRail() {
  const [rates, setRates] = useState<Rate[] | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<Indicator[] | null>(null);
  const [indicatorsAsOf, setIndicatorsAsOf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/rates').then(r => r.json()).catch(() => null),
      fetch('/api/indicators').then(r => r.json()).catch(() => null),
    ]).then(([ratesData, indicatorsData]) => {
      if (cancelled) return;
      if (ratesData?.rates?.length) {
        setRates(ratesData.rates);
        setRateDate(ratesData.date ?? null);
      }
      if (indicatorsData?.indicators?.length) {
        setIndicators(indicatorsData.indicators);
        setIndicatorsAsOf(indicatorsData.updatedAt ?? null);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading market data">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-10 rounded bg-white/[0.04] motion-safe:animate-pulse" />
        ))}
      </div>
    );
  }

  const fx = (rates ?? [])
    .filter(r => FX_FROM.includes(r.from))
    .sort((a, b) => FX_FROM.indexOf(a.from) - FX_FROM.indexOf(b.from));

  const macro = (indicators ?? [])
    .filter(i => INDICATOR_KEYS.includes(i.key))
    .sort((a, b) => INDICATOR_KEYS.indexOf(a.key) - INDICATOR_KEYS.indexOf(b.key));

  // Nothing live to show → render nothing rather than seed fake data.
  if (fx.length === 0 && macro.length === 0) return null;

  const asOfDate = indicatorsAsOf
    ? new Date(indicatorsAsOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Exchange rates */}
      {fx.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Exchange rates</h2>
            <Link href="/markets" className="text-2xs text-gray-500 hover:text-brand-accent transition-colors no-underline">Converter ›</Link>
          </div>
          <p className="text-xs text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">
            Indicative mid · LRD{rateDate ? ` · ${rateDate}` : ''}
          </p>
          <div className="divide-y divide-white/[0.04]">
            {fx.map(r => (
              <Link key={r.pair} href="/markets" className="flex items-center justify-between gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
                <span className="text-sm font-semibold text-white/85 tabular-nums">{r.pair}</span>
                <span className="text-base font-bold text-white tabular-nums">{formatRate(r.rate)}</span>
              </Link>
            ))}
          </div>
          <p className="text-2xs text-gray-500 mt-3 leading-relaxed">
            Source: live currency feed. Indicative mid-rate, not a dealing rate.
          </p>
        </div>
      )}

      {/* Liberia at a glance */}
      {macro.length > 0 && (
        <div className={fx.length > 0 ? 'border-t border-white/[0.05] pt-5' : ''}>
          <div className="flex items-end justify-between mb-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.12em]">Liberia at a glance</h2>
            <Link href="/economy" className="text-2xs text-gray-500 hover:text-brand-accent transition-colors no-underline">All ›</Link>
          </div>
          <p className="text-xs text-gray-500 mb-3 pb-3 border-b border-white/[0.07]">
            Macro indicators{asOfDate ? ` · as of ${asOfDate}` : ''}
          </p>
          <div className="divide-y divide-white/[0.04]">
            {macro.map(ind => {
              const d = deltaParts(ind.change);
              return (
                <Link key={ind.key} href="/economy" className="flex items-start justify-between gap-3 py-3 hover:opacity-75 transition-opacity no-underline group">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white/85">{ind.name}</div>
                    <div className="text-2xs text-gray-500 mt-0.5">{ind.period} · {ind.source}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-base font-bold text-white tabular-nums">{formatIndicator(ind.value, ind.unit)}</div>
                    {d.arrow && (
                      <div className={`text-xs font-semibold tabular-nums ${d.cls}`}>
                        <span aria-hidden className="mr-0.5">{d.arrow}</span>
                        {ind.change! > 0 ? '+' : ''}{ind.change}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
