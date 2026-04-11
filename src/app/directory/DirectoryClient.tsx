'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Company, CompanySector } from '@/lib/types';

const SECTOR_ACCENT: Record<string, string> = {
  Mining:      'text-orange-400',
  Banking:     'text-brand-accent',
  Telecom:     'text-blue-400',
  Agriculture: 'text-lime-400',
  Energy:      'text-yellow-400',
  Logistics:   'text-purple-400',
  Insurance:   'text-pink-400',
  Regulatory:  'text-slate-400',
  'Oil & Gas': 'text-amber-400',
  Retail:      'text-cyan-400',
};

const STATUS_DOT: Record<string, string> = {
  Active:        'bg-brand-accent',
  Suspended:     'bg-red-400',
  'Under Review': 'bg-amber-400',
};

// ── Company Card ───────────────────────────────────────────────────────────────
function CompanyCard({ company }: { company: Company }) {
  const sectorAccent = SECTOR_ACCENT[company.sector] ?? 'text-gray-400';
  const statusDot    = STATUS_DOT[company.status] ?? 'bg-gray-500';

  return (
    <Link
      href={`/directory/${company.id}`}
      className="group block rounded-xl border border-white/[0.07] bg-brand-card p-5 hover:border-white/[0.14] hover:bg-white/[0.03] transition-colors no-underline"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold text-white leading-snug group-hover:text-white/80 transition-colors truncate">
            {company.name}
          </h3>
          {company.shortName && company.shortName !== company.name && (
            <p className="text-[12px] text-gray-400 mt-0.5">{company.shortName}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot}`} />
          <span className="text-[11px] text-gray-500">{company.status}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
        {company.description}
      </p>

      {/* Key fact */}
      <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 mb-4 border-l-2 border-white/[0.08] pl-3">
        {company.keyFact}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 text-[11px]">
          <span className={`font-semibold ${sectorAccent}`}>{company.sector}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-400">{company.ownership}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span>{company.headquarters}</span>
          {company.founded && <span>Est. {company.founded}</span>}
        </div>
      </div>
    </Link>
  );
}

// ── Filter bar ─────────────────────────────────────────────────────────────────
const ALL_SECTORS: (CompanySector | 'All')[] = [
  'All', 'Banking', 'Mining', 'Agriculture', 'Energy', 'Oil & Gas', 'Telecom', 'Logistics', 'Insurance', 'Regulatory'
];

const OWNERSHIP_OPTS = ['All', 'Private', 'State-Owned', 'Mixed', 'Public'];

interface Filters {
  search: string;
  sector: string;
  ownership: string;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function DirectoryClient({ companies }: { companies: Company[] }) {
  const [filters, setFilters] = useState<Filters>({ search: '', sector: 'All', ownership: 'All' });

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return companies.filter(c => {
      if (filters.sector !== 'All' && c.sector !== filters.sector) return false;
      if (filters.ownership !== 'All' && c.ownership !== filters.ownership) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.headquarters.toLowerCase().includes(q) && !c.sector.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [companies, filters]);

  const sectors = ALL_SECTORS.filter(s => s === 'All' || companies.some(c => c.sector === s));

  return (
    <div>
      {/* Search + ownership */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-sm flex items-center rounded-lg bg-white/[0.05] border border-white/[0.07] focus-within:border-white/[0.18] transition overflow-hidden">
          <svg className="ml-3 h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search companies"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-gray-400"
          />
        </div>
        <select
          value={filters.ownership}
          onChange={e => setFilters(f => ({ ...f, ownership: e.target.value }))}
          className="rounded-lg bg-white/[0.05] border border-white/[0.07] px-3 py-2.5 text-[13px] text-gray-400 outline-none cursor-pointer hover:border-white/[0.18] transition"
        >
          {OWNERSHIP_OPTS.map(o => (
            <option key={o} value={o} className="bg-[#1a1a1e]">{o === 'All' ? 'All ownership' : o}</option>
          ))}
        </select>
      </div>

      {/* Sector tabs */}
      <div className="flex gap-0 overflow-x-auto border-b border-white/[0.06] mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sectors.map(s => (
          <button
            key={s}
            onClick={() => setFilters(f => ({ ...f, sector: s }))}
            className={`whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              filters.sector === s
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count + clear */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[13px] text-gray-400">
          {filtered.length} of {companies.length} companies
        </p>
        {(filters.search || filters.sector !== 'All' || filters.ownership !== 'All') && (
          <button
            onClick={() => setFilters({ search: '', sector: 'All', ownership: 'All' })}
            className="text-[12px] text-gray-400 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-[16px] font-bold text-white mb-2">No companies found</h3>
          <p className="text-[13px] text-gray-400 mb-5">Try adjusting your filters or search term.</p>
          <button
            onClick={() => setFilters({ search: '', sector: 'All', ownership: 'All' })}
            className="rounded-lg border border-white/[0.15] px-5 py-2 text-[13px] font-medium text-white hover:bg-white/[0.06] transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
