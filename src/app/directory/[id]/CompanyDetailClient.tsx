'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Company } from '@/lib/types';
import { COMPANIES } from '@/data/companies';

// ── Helpers ────────────────────────────────────────────────────────────────────
const SECTOR_ACCENT: Record<string, string> = {
  Mining:      'text-orange-400',
  Banking:     'text-emerald-400',
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
  Active:         'bg-emerald-500',
  Suspended:      'bg-red-400',
  'Under Review': 'bg-amber-400',
};

function fmt(n?: number) {
  if (n === undefined) return '—';
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}B`;
  return `$${n.toFixed(0)}M`;
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'financials' | 'related';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',   label: 'Overview' },
  { id: 'financials', label: 'Financials' },
  { id: 'related',    label: 'Related Companies' },
];

// ── Overview tab ───────────────────────────────────────────────────────────────
function OverviewTab({ company }: { company: Company }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main description */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">About</h3>
          <p className="text-[15px] text-gray-300 leading-relaxed">{company.description}</p>
        </div>

        {/* Key fact */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-3">Key Fact</h3>
          <p className="text-[15px] text-white leading-relaxed border-l-2 border-white/[0.12] pl-4">{company.keyFact}</p>
        </div>

        {/* Concession counties */}
        {company.concessionCounty && company.concessionCounty.length > 0 && (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
            <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Concession Counties</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {company.concessionCounty.map(county => (
                <span key={county} className="text-[13px] text-gray-300">{county} County</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Quick facts */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Quick Facts</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {[
              { label: 'Sector',       value: company.sector },
              { label: 'Subsector',    value: company.subsector },
              { label: 'Ownership',    value: company.ownership },
              { label: 'Headquarters', value: company.headquarters },
              { label: 'Founded',      value: company.founded?.toString() },
              { label: 'Parent Co.',   value: company.parentCompany },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between gap-4 px-5 py-3">
                <span className="text-[12px] text-gray-500 shrink-0">{label}</span>
                <span className="text-[13px] text-gray-200 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
          <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3">Links</h3>
          <div className="space-y-2.5">
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] text-gray-300 hover:text-white transition-colors no-underline"
              >
                Official Website ↗
              </a>
            ) : (
              <p className="text-[13px] text-gray-400">No website listed</p>
            )}
            <Link
              href={`/news?q=${encodeURIComponent(company.shortName ?? company.name)}`}
              className="block text-[13px] text-gray-500 hover:text-white transition-colors no-underline"
            >
              Search news coverage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Financials tab ─────────────────────────────────────────────────────────────
function FinancialsTab({ company }: { company: Company }) {
  const { financials: f } = company;
  const rows = [
    { label: 'Revenue',         value: f.revenue ? fmt(f.revenue) : null,     note: f.revenueYear ? `FY${f.revenueYear}` : undefined },
    { label: 'Market Cap',      value: f.marketCap ? fmt(f.marketCap) : null, note: 'Estimated' },
    { label: 'Total Assets',    value: f.totalAssets ? fmt(f.totalAssets) : null },
    { label: 'Employees',       value: f.employees ? f.employees.toLocaleString() : null },
    { label: 'Concession Area', value: f.concessionArea ?? null },
    { label: 'Export Volume',   value: f.exportVolume ?? null },
    { label: 'Licensed Since',  value: f.licensedSince?.toString() ?? null },
  ].filter(r => r.value !== null);

  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.07]">
          <h3 className="text-[15px] font-bold text-white">Financial Overview</h3>
          {f.revenueYear && (
            <p className="text-[12px] text-gray-500 mt-0.5">Data as of {f.revenueYear} (estimates where noted)</p>
          )}
        </div>
        {rows.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {rows.map(({ label, value, note }) => (
              <div key={label} className="flex items-center justify-between px-6 py-4">
                <span className="text-[14px] text-gray-400">{label}</span>
                <div className="text-right">
                  <span className="text-[16px] font-bold text-white">{value}</span>
                  {note && <p className="text-[11px] text-gray-400 mt-0.5">{note}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px] text-gray-500">Financial data not publicly available</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
        <p className="text-[12px] text-gray-500 leading-relaxed">
          <strong className="text-gray-400">Disclaimer:</strong> Financial figures are sourced from public filings, government reports, and industry estimates. TrueRate makes no representations as to their accuracy or completeness. This is not investment advice.
        </p>
      </div>
    </div>
  );
}

// ── Related companies tab ──────────────────────────────────────────────────────
function RelatedTab({ company }: { company: Company }) {
  const related = COMPANIES
    .filter(c => c.id !== company.id && (c.sector === company.sector || c.concessionCounty?.some(co => company.concessionCounty?.includes(co))))
    .slice(0, 6);

  if (related.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px] text-gray-500">No related companies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {related.map(c => {
        const accent = SECTOR_ACCENT[c.sector] ?? 'text-gray-400';
        return (
          <Link
            key={c.id}
            href={`/directory/${c.id}`}
            className="group block rounded-xl border border-white/[0.07] bg-brand-card p-5 hover:border-white/[0.14] hover:bg-white/[0.03] transition-colors no-underline"
          >
            <h3 className="text-[14px] font-bold text-white group-hover:text-white/80 transition-colors mb-1">{c.name}</h3>
            {c.shortName && c.shortName !== c.name && (
              <p className="text-[11px] text-gray-400 mb-2">{c.shortName}</p>
            )}
            <p className="text-[12px] text-gray-500 line-clamp-2 mb-3">{c.description}</p>
            <span className={`text-[11px] font-semibold ${accent}`}>{c.sector}</span>
          </Link>
        );
      })}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function CompanyDetailClient({ company }: { company: Company }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const sectorAccent = SECTOR_ACCENT[company.sector] ?? 'text-gray-400';
  const statusDot    = STATUS_DOT[company.status] ?? 'bg-gray-500';

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-6">
        <Link href="/" className="hover:text-white transition-colors no-underline">Home</Link>
        <span>/</span>
        <Link href="/directory" className="hover:text-white transition-colors no-underline">Directory</Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{company.name}</span>
      </div>

      {/* Profile header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-[28px] sm:text-[34px] font-black text-white leading-tight tracking-tight">{company.name}</h1>
          {company.shortName && company.shortName !== company.name && (
            <span className="text-[15px] text-gray-500">({company.shortName})</span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-3">
          <span className={`font-semibold ${sectorAccent}`}>{company.sector}</span>
          {company.subsector && <><span className="text-gray-500">·</span><span>{company.subsector}</span></>}
          <span className="text-gray-500">·</span>
          <span>{company.headquarters}</span>
          {company.founded && <><span className="text-gray-500">·</span><span>Est. {company.founded}</span></>}
          {company.ownership && <><span className="text-gray-500">·</span><span>{company.ownership}</span></>}
          {company.parentCompany && <><span className="text-gray-500">·</span><span>Part of {company.parentCompany}</span></>}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
          <span className="text-[12px] text-gray-500">{company.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/[0.06] mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-5 py-3 text-[14px] font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview'   && <OverviewTab company={company} />}
      {activeTab === 'financials' && <FinancialsTab company={company} />}
      {activeTab === 'related'    && <RelatedTab company={company} />}
    </main>
  );
}
