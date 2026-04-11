import type { Metadata } from 'next';
import { COMPANIES, FEATURED_COMPANIES } from '@/data/companies';
import DirectoryClient from './DirectoryClient';
import Link from 'next/link';

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

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-white/[0.05]">
        {topSectors.map(([sector, count]) => (
          <div key={sector} className="px-5 py-4">
            <p className="text-[22px] font-black text-white tabular-nums leading-none mb-1">{count}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">{sector}</p>
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
      <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Featured</h2>
      <div className="flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border border-white/[0.07] bg-[#141418] overflow-hidden divide-x divide-white/[0.05]">
        {FEATURED_COMPANIES.map(c => (
          <Link
            key={c.id}
            href={`/directory/${c.id}`}
            className="shrink-0 px-5 py-3.5 no-underline group hover:bg-white/[0.03] transition-colors"
          >
            <p className="text-[13px] font-semibold text-white group-hover:text-white/80 transition-colors whitespace-nowrap">
              {c.shortName ?? c.name}
            </p>
            <p className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">{c.sector}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-4">
          <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
          <span>/</span>
          <span>Business Directory</span>
        </div>
        <div className="flex items-center justify-end gap-4 flex-wrap">
          <p className="text-[13px] text-gray-400 shrink-0">{COMPANIES.length} companies</p>
        </div>
      </div>

      {/* Sector stats */}
      <SectorStats />

      {/* Featured */}
      <FeaturedStrip />

      {/* All companies (Client — filters, search) */}
      <DirectoryClient companies={COMPANIES} />
    </main>
  );
}
