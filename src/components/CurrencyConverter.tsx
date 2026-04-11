'use client';

import { useState, useEffect, useCallback } from 'react';

const SUPPORTED = ['LRD', 'USD', 'EUR', 'GBP', 'GHS', 'NGN', 'SLL', 'XOF'];

const LABELS: Record<string, string> = {
  LRD: 'Liberian Dollar',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  GHS: 'Ghanaian Cedi',
  NGN: 'Nigerian Naira',
  SLL: 'Sierra Leonean Leone',
  XOF: 'CFA Franc (BCEAO)',
};

interface Props {
  /** Pre-loaded lookup map from /api/rates { currency: rateToLRD } */
  initialLookup?: Record<string, number>;
}

export default function CurrencyConverter({ initialLookup }: Props) {
  const [lookup, setLookup] = useState<Record<string, number>>(
    initialLookup ?? { LRD: 1, USD: 192.5, EUR: 209.85, GBP: 245.3, GHS: 13.2, NGN: 0.131, SLL: 0.0094, XOF: 0.322 }
  );
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('LRD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(!initialLookup);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch live rates if not pre-loaded
  useEffect(() => {
    if (initialLookup) return;
    fetch('/api/rates')
      .then(r => r.json())
      .then(data => {
        if (data.lookup) {
          setLookup(data.lookup);
          if (data.date) setLastUpdated(data.date);
        }
      })
      .catch(() => {/* keep seed lookup */})
      .finally(() => setLoading(false));
  }, [initialLookup]);

  const convert = useCallback(() => {
    const n = parseFloat(amount);
    if (isNaN(n) || n < 0) { setResult(null); return; }
    // Convert: amount (from) → LRD → (to)
    const fromRate = lookup[from] ?? 1;   // how many LRD per 1 `from`
    const toRate   = lookup[to]   ?? 1;   // how many LRD per 1 `to`
    setResult((n * fromRate) / toRate);
  }, [amount, from, to, lookup]);

  useEffect(() => { convert(); }, [convert]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div>
          <h2 className="text-[15px] font-bold text-white">Currency Converter</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">LRD-based · rates from CBL / open market</p>
        </div>
        {loading && (
          <span className="text-[11px] text-gray-500">Fetching rates…</span>
        )}
        {!loading && lastUpdated && (
          <span className="text-[11px] text-gray-500">Updated {lastUpdated}</span>
        )}
      </div>

      <div className="px-5 py-5">
        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Amount</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-lg border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-[16px] font-bold text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition tabular-nums"
            placeholder="Enter amount"
          />
        </div>

        {/* From / Swap / To row */}
        <div className="flex items-end gap-2 mb-5">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">From</label>
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full rounded-lg border border-white/[0.1] bg-[#1c1c22] px-3 py-2.5 text-[14px] font-semibold text-white outline-none focus:border-emerald-500/50 transition appearance-none cursor-pointer"
            >
              {SUPPORTED.filter(c => lookup[c] !== undefined || c === 'LRD').map(c => (
                <option key={c} value={c}>{c} — {LABELS[c]}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swap}
            title="Swap currencies"
            className="shrink-0 mb-0.5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.05] text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div className="flex-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">To</label>
            <select
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full rounded-lg border border-white/[0.1] bg-[#1c1c22] px-3 py-2.5 text-[14px] font-semibold text-white outline-none focus:border-emerald-500/50 transition appearance-none cursor-pointer"
            >
              {SUPPORTED.filter(c => lookup[c] !== undefined || c === 'LRD').map(c => (
                <option key={c} value={c}>{c} — {LABELS[c]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-4 text-center">
          <p className="text-[13px] text-gray-400 mb-1">
            {amount || '1'} {from} =
          </p>
          <p className="text-[28px] font-black text-white tabular-nums leading-tight">
            {result !== null ? fmt(result) : '—'}{' '}
            <span className="text-[20px] text-emerald-400">{to}</span>
          </p>
          {result !== null && (
            <p className="text-[12px] text-gray-500 mt-1.5">
              1 {from} = {fmt((lookup[from] ?? 1) / (lookup[to] ?? 1))} {to}
            </p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-gray-500 text-center">
          Rates are indicative. For official CBL rates visit cbl.org.lr
        </p>
      </div>
    </div>
  );
}
