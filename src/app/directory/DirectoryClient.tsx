'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Company, CompanySector } from '@/lib/types';

const SECTOR_COLOR: Record<string, string> = {
  Mining:        'text-orange-400',
  Banking:       'text-emerald-400',
  Telecom:       'text-blue-400',
  Agriculture:   'text-lime-400',
  Energy:        'text-yellow-400',
  Logistics:     'text-purple-400',
  Insurance:     'text-pink-400',
  Regulatory:    'text-slate-400',
  'Oil & Gas':   'text-amber-400',
  Retail:        'text-cyan-400',
};

const SECTOR_BG: Record<string, string> = {
  Mining:        'bg-orange-400/10 text-orange-400',
  Banking:       'bg-emerald-400/10 text-emerald-400',
  Telecom:       'bg-blue-400/10 text-blue-400',
  Agriculture:   'bg-lime-400/10 text-lime-400',
  Energy:        'bg-yellow-400/10 text-yellow-400',
  Logistics:     'bg-purple-400/10 text-purple-400',
  Insurance:     'bg-pink-400/10 text-pink-400',
  'Oil & Gas':   'bg-amber-400/10 text-amber-400',
  Retail:        'bg-cyan-400/10 text-cyan-400',
};

const STATUS_DOT: Record<string, string> = {
  Active:          'bg-emerald-500',
  Suspended:       'bg-red-400',
  'Under Review':  'bg-amber-400',
};

const OWNERSHIP_BADGE: Record<string, string> = {
  Private: 'text-gray-400',
  Mixed:   'text-gray-500',
  Public:  'text-gray-400',
};

const ALL_SECTORS: (CompanySector | 'All')[] = [
  'All', 'Banking', 'Mining', 'Agriculture', 'Energy', 'Oil & Gas', 'Telecom', 'Logistics', 'Insurance',
];

const OWNERSHIP_OPTS = ['All', 'Private', 'Mixed'];

interface Filters { search: string; sector: string; ownership: string; }

/** Format the key financial stat for a company based on what data is available */
function primaryStat(c: Company): string | null {
  const f = c.financials;
  if (f.employees && f.concessionArea) return `${f.employees.toLocaleString()} employees · ${f.concessionArea}`;
  if (f.employees && f.totalAssets)    return `${f.employees.toLocaleString()} employees · $${f.totalAssets}M assets`;
  if (f.employees && f.revenue)        return `${f.employees.toLocaleString()} employees · $${f.revenue}M revenue`;
  if (f.employees && f.exportVolume)   return `${f.employees.toLocaleString()} employees · ${f.exportVolume}`;
  if (f.employees)                     return `${f.employees.toLocaleString()} employees`;
  if (f.concessionArea)                return f.concessionArea;
  return null;
}

export default function DirectoryClient({
  companies,
  featured,
}: {
  companies: Company[];
  featured: Company[];
}) {
  const [filters, setFilters] = useState<Filters>({ search: '', sector: 'All', ownership: 'All' });

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return companies.filter(c => {
      if (filters.sector !== 'All' && c.sector !== filters.sector) return false;
      if (filters.ownership !== 'All' && c.ownership !== filters.ownership) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.sector.toLowerCase().includes(q) && !(c.parentCompany ?? '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [companies, filters]);

  const sectors = ALL_SECTORS.filter(s => s === 'All' || companies.some(c => c.sector === s));
  const isFiltered = filters.search || filters.sector !== 'All' || filters.ownership !== 'All';

  return (
    <div>

      {/* ── Featured ── */}
      {!isFiltered && (
        <section className="mb-14">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-0">Featured Companies</h2>
          <div className="divide-y divide-white/[0.07]">
            {featured.map(c => (
              <Link key={c.id} href={`/directory/${c.id}`}
                className="group flex items-start gap-6 py-6 no-underline hover:opacity-80 transition-opacity">

                {/* Left: name + parent + founded */}
                <div className="w-[190px] shrink-0 pt-0.5">
                  <p className="text-[15px] font-bold text-white group-hover:text-white leading-snug">{c.name}</p>
                  {c.shortName && c.shortName !== c.name && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{c.shortName}</p>
                  )}
                  {c.parentCompany && (
                    <p className="text-[11px] text-gray-600 mt-1 leading-snug">{c.parentCompany}</p>
                  )}
                </div>

                {/* Middle: key fact + stats */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-gray-300 leading-[1.7] line-clamp-2 mb-2">{c.keyFact}</p>
                  {primaryStat(c) && (
                    <p className="text-[11px] text-gray-500">{primaryStat(c)}</p>
                  )}
                </div>

                {/* Right: sector tag + HQ + website */}
                <div className="shrink-0 text-right pt-0.5 hidden sm:flex flex-col items-end gap-1.5">
                  <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${SECTOR_BG[c.sector] ?? 'bg-gray-400/10 text-gray-400'}`}>
                    {c.sector}
                  </span>
                  <p className="text-[11px] text-gray-500">{c.headquarters}</p>
                  {c.website && (
                    <span className="text-[11px] text-brand-accent">↗ website</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Filters ── */}
      <div className="mb-0">
        {/* Search + ownership */}
        <div className="flex flex-wrap items-center gap-3 mb-0">
          <div className="flex items-center rounded-lg bg-white/[0.05] border border-white/[0.07] focus-within:border-white/20 transition overflow-hidden flex-1 min-w-[200px] max-w-sm">
            <svg className="ml-3 h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, sector, or parent…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-gray-500"
            />
          </div>
          <select
            value={filters.ownership}
            onChange={e => setFilters(f => ({ ...f, ownership: e.target.value }))}
            className="rounded-lg bg-white/[0.05] border border-white/[0.07] px-3 py-2.5 text-[13px] text-gray-400 outline-none cursor-pointer hover:border-white/20 transition"
          >
            {OWNERSHIP_OPTS.map(o => (
              <option key={o} value={o} className="bg-[#0a0e14]">{o === 'All' ? 'All ownership' : o}</option>
            ))}
          </select>
        </div>

        {/* Sector tabs */}
        <div className="flex gap-0 overflow-x-auto border-b border-white/[0.07] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sectors.map(s => (
            <button key={s} onClick={() => setFilters(f => ({ ...f, sector: s }))}
              className={`whitespace-nowrap px-4 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                filters.sector === s
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-gray-500 hover:text-white'
              }`}>
              {s}
            </button>
          ))}
          {isFiltered && (
            <button onClick={() => setFilters({ search: '', sector: 'All', ownership: 'All' })}
              className="ml-auto whitespace-nowrap px-4 py-3 text-[12px] text-gray-500 hover:text-white transition-colors border-b-2 border-transparent -mb-px">
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="mt-2 mb-3 flex items-center justify-between">
        <p className="text-[11px] text-gray-500">{filtered.length} {filtered.length === 1 ? 'company' : 'companies'}</p>
      </div>

      {filtered.length > 0 ? (
        <div className="divide-y divide-white/[0.07]">
          {filtered.map(c => {
            const stat = primaryStat(c);
            return (
              <Link key={c.id} href={`/directory/${c.id}`}
                className="group flex items-start gap-4 sm:gap-8 py-5 no-underline hover:opacity-75 transition-opacity">

                {/* Col 1: Name + shortName + parent */}
                <div className="w-[150px] sm:w-[200px] shrink-0 pt-0.5">
                  <p className="text-[14px] font-bold text-white leading-snug">{c.name}</p>
                  {c.shortName && c.shortName !== c.name && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{c.shortName}</p>
                  )}
                  {c.parentCompany && (
                    <p className="text-[11px] text-gray-600 mt-1 leading-snug line-clamp-2">{c.parentCompany}</p>
                  )}
                  {c.founded && (
                    <p className="text-[10px] text-gray-600 mt-1">est. {c.founded}</p>
                  )}
                </div>

                {/* Col 2: Key fact + stat */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <p className="text-[13px] text-gray-400 leading-[1.75] line-clamp-2 mb-1.5">{c.keyFact}</p>
                  {stat && (
                    <p className="text-[11px] text-gray-600">{stat}</p>
                  )}
                </div>

                {/* Col 3: Sector badge + HQ + status + website */}
                <div className="shrink-0 pt-0.5 flex flex-col items-end gap-1.5">
                  <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${SECTOR_BG[c.sector] ?? 'bg-gray-400/10 text-gray-400'}`}>
                    {c.sector}
                  </span>
                  <p className="text-[11px] text-gray-500 text-right">{c.headquarters}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${STATUS_DOT[c.status] ?? 'bg-gray-500'}`} />
                    <span className="text-[11px] text-gray-500">{c.status}</span>
                  </div>
                  {c.website && (
                    <span className="text-[11px] text-brand-accent">↗ site</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-[15px] font-semibold text-white mb-2">No companies found</p>
          <p className="text-[13px] text-gray-500 mb-5">Try adjusting your search or filters.</p>
          <button onClick={() => setFilters({ search: '', sector: 'All', ownership: 'All' })}
            className="rounded-lg border border-white/[0.15] px-5 py-2 text-[13px] text-white hover:bg-white/[0.06] transition-colors">
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
}
