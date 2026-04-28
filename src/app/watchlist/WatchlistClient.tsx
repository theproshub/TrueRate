'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { exchangeRates } from '@/data/exchangeRates';
import { economicIndicators } from '@/data/economicIndicators';
import { commodities } from '@/data/commodities';

type WatchedItem = { id: string; type: 'rate' | 'indicator' | 'commodity' };

const STORAGE_KEY = 'truerate_watchlist';

function loadWatched(): WatchedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveWatched(items: WatchedItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* full */ }
}

function ChangePill({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${up ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
      {up ? '▲' : '▼'} {Math.abs(value).toFixed(2)}{suffix}
    </span>
  );
}

function AddModal({ onAdd, existing, onClose }: {
  onAdd: (item: WatchedItem) => void;
  existing: WatchedItem[];
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'rate' | 'indicator' | 'commodity'>('rate');
  const existingIds = new Set(existing.map(e => e.id));

  const options = {
    rate:      exchangeRates.map(r => ({ id: r.pair, label: r.pair, sub: `${r.rate.toFixed(4)} LRD` })),
    indicator: economicIndicators.map(i => ({ id: i.name, label: i.name, sub: `${i.value} ${i.unit}` })),
    commodity: commodities.map(c => ({ id: c.name, label: c.name, sub: `$${c.price} ${c.currency}${c.unit}` })),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-brand-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-white">Add to Watchlist</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5">
          {(['rate', 'indicator', 'commodity'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-md py-1.5 text-[12px] font-semibold capitalize transition-colors ${tab === t ? 'bg-white/[0.10] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {t === 'rate' ? 'Rates' : t === 'indicator' ? 'Indicators' : 'Commodities'}
            </button>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {options[tab].map(opt => {
            const already = existingIds.has(opt.id);
            return (
              <button key={opt.id} disabled={already}
                onClick={() => { onAdd({ id: opt.id, type: tab }); onClose(); }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors ${already ? 'cursor-default opacity-40' : 'hover:bg-white/[0.05] cursor-pointer'}`}>
                <div>
                  <div className="text-[13px] font-semibold text-white">{opt.label}</div>
                  <div className="text-[11px] text-gray-500">{opt.sub}</div>
                </div>
                {already
                  ? <span className="text-[10px] font-bold uppercase text-emerald-400">Watching</span>
                  : <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WatchlistClient() {
  const [watched, setWatched] = useState<WatchedItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWatched(loadWatched());
    setHydrated(true);
  }, []);

  function addItem(item: WatchedItem) {
    const next = [...watched, item];
    setWatched(next);
    saveWatched(next);
  }

  function removeItem(id: string) {
    const next = watched.filter(w => w.id !== id);
    setWatched(next);
    saveWatched(next);
  }

  if (!hydrated) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-white/[0.04] animate-pulse" />)}
      </div>
    );
  }

  const watchedRates       = watched.filter(w => w.type === 'rate').map(w => exchangeRates.find(r => r.pair === w.id)).filter(Boolean);
  const watchedIndicators  = watched.filter(w => w.type === 'indicator').map(w => economicIndicators.find(i => i.name === w.id)).filter(Boolean);
  const watchedCommodities = watched.filter(w => w.type === 'commodity').map(w => commodities.find(c => c.name === w.id)).filter(Boolean);
  const isEmpty = watched.length === 0;

  return (
    <>
      {showModal && <AddModal onAdd={addItem} existing={watched} onClose={() => setShowModal(false)} />}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {isEmpty && (
            <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] p-12 text-center">
              <div className="mb-3 text-5xl">📊</div>
              <h2 className="mb-1 text-[16px] font-bold text-white">Your watchlist is empty</h2>
              <p className="mb-6 text-[13px] text-gray-500">Add exchange rates, economic indicators, or commodities to track them here.</p>
              <button onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 text-[13px] font-semibold text-brand-dark hover:brightness-90 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add your first item
              </button>
            </div>
          )}

          {watchedRates.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">Exchange Rates</h2>
              <div className="divide-y divide-white/[0.05]">
                {watchedRates.map(r => r && (
                  <div key={r.pair} className="flex items-center justify-between py-4">
                    <div>
                      <div className="text-[14px] font-bold text-white">{r.pair}</div>
                      <div className="text-[11px] text-gray-500">LRD-denominated</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="tabular-nums text-[18px] font-bold text-white">{r.rate.toFixed(4)}</div>
                        <ChangePill value={r.changePercent} />
                      </div>
                      <button onClick={() => removeItem(r.pair)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {watchedIndicators.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">Economic Indicators</h2>
              <div className="divide-y divide-white/[0.05]">
                {watchedIndicators.map(ind => ind && (
                  <div key={ind.name} className="flex items-center justify-between py-4">
                    <div>
                      <div className="text-[14px] font-bold text-white">{ind.name}</div>
                      <div className="text-[11px] text-gray-500">{ind.period} · {ind.source}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="tabular-nums text-[18px] font-bold text-white">{ind.value} <span className="text-[12px] font-normal text-gray-500">{ind.unit}</span></div>
                        <ChangePill value={ind.changePercent} />
                      </div>
                      <button onClick={() => removeItem(ind.name)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {watchedCommodities.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">Commodities</h2>
              <div className="divide-y divide-white/[0.05]">
                {watchedCommodities.map(c => c && (
                  <div key={c.name} className="flex items-center justify-between py-4">
                    <div>
                      <div className="text-[14px] font-bold text-white">{c.name}</div>
                      <div className="text-[11px] text-gray-500">per {c.unit} · {c.currency}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="tabular-nums text-[18px] font-bold text-white">{c.price.toFixed(2)}</div>
                        <ChangePill value={c.changePercent} />
                      </div>
                      <button onClick={() => removeItem(c.name)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <button onClick={() => setShowModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.10] bg-white/[0.02] py-4 text-[13px] font-semibold text-gray-400 hover:border-brand-accent/50 hover:text-brand-accent transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add to watchlist
          </button>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">Quick links</h3>
            <div className="divide-y divide-white/[0.05]">
              {[
                { href: '/markets', label: 'Markets' },
                { href: '/economy', label: 'Economy Dashboard' },
                { href: '/news',    label: 'Latest News' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between py-3 text-[13px] text-gray-400 hover:text-white transition-colors no-underline">
                  {l.label}
                  <span className="text-gray-600">→</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-2">Rate Alerts</h3>
            <p className="text-[12px] text-gray-500 leading-relaxed">Get notified when LRD/USD moves past your threshold. Email and SMS alerts coming soon.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
