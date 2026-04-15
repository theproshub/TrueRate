import type { Metadata } from 'next';
import { COMPANIES, FEATURED_COMPANIES } from '@/data/companies';
import DirectoryClient from './DirectoryClient';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Business Directory — TrueRate',
  description: 'Profiles of major companies operating in Liberia across mining, banking, agriculture, energy, telecom, and logistics sectors.',
};

export const revalidate = 86400;

// ── Sector stat bar ────────────────────────────────────────────────────────────
function SectorStats() {
  const sectorCounts = COMPANIES.reduce<Record<string, number>>((acc, c) => {
    acc[c.sector] = (acc[c.sector] ?? 0) + 1;
    return acc;
  }, {});

  const topSectors = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalActive   = COMPANIES.filter(c => c.status === 'Active').length;
  const totalSectors  = Object.keys(sectorCounts).length;

  return (
    <div className="rounded-xl border border-white/[0.07] bg-brand-card overflow-hidden mb-8">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/[0.05] border-b border-white/[0.05]">
        {[
          { value: COMPANIES.length, label: 'Total Companies' },
          { value: totalActive,      label: 'Active' },
          { value: totalSectors,     label: 'Sectors' },
          { value: FEATURED_COMPANIES.length, label: 'Featured' },
        ].map(({ value, label }) => (
          <div key={label} className="px-5 py-4">
            <p className="text-[26px] font-black text-white tabular-nums leading-none mb-1">{value}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* By-sector row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-white/[0.05]">
        {topSectors.map(([sector, count]) => (
          <div key={sector} className="px-5 py-3.5 flex items-center justify-between gap-2">
            <p className="text-[13px] text-gray-400">{sector}</p>
            <span className="text-[13px] font-bold text-white tabular-nums">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Featured strip ─────────────────────────────────────────────────────────────
function FeaturedStrip() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Featured Companies</h2>
        <span className="text-[11px] text-gray-500">{FEATURED_COMPANIES.length} profiles</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {FEATURED_COMPANIES.map(c => (
          <Link
            key={c.id}
            href={`/directory/${c.id}`}
            className="rounded-xl border border-white/[0.07] bg-brand-card px-4 py-3.5 no-underline group hover:border-white/[0.14] hover:bg-white/[0.03] transition-colors"
          >
            <p className="text-[13px] font-semibold text-white group-hover:text-white/80 transition-colors truncate">
              {c.shortName ?? c.name}
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">{c.sector}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-gray-500">{c.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Business Directory' }]} className="mb-0" />
        <span className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-gray-400">
          {COMPANIES.length} companies
        </span>
      </div>

      {/* Sector stats */}
      <SectorStats />

      {/* Featured */}
      <FeaturedStrip />

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-widest whitespace-nowrap">All Companies</h2>
        <div className="flex-1 border-t border-white/[0.06]" />
      </div>

      {/* All companies (Client — filters, search) */}
      <DirectoryClient companies={COMPANIES} />
    </main>
  );
}
