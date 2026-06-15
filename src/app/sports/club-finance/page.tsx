import type { Metadata } from 'next';
import IntelTable from '@/components/sports/IntelTable';
import Delta from '@/components/sports/Delta';
import SportsDeskLayout from '@/components/sports/SportsDeskLayout';
import { fetchClubs } from '@/lib/sports/intel';
import { sportsStoriesBySection } from '@/data/sports-stories';
import { type ClubValuation } from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Club Finance — TrueRate Sports',
  description: 'The money behind Liberian Premier League clubs — valuations, revenue, and the turnaround stories.',
  alternates: { canonical: '/sports/club-finance' },
};

export const revalidate = 300;

const FINANCE_RE = /finance|revenue|deficit|stadium|ppp|valuation|franchise|budget|profit|cost|economic|worth|commercial/i;
// Core club-finance themes lead; broader finance-adjacent stories follow.
const CORE_RE = /revenue|deficit|stadium|ppp|valuation|profit|budget|finance|commercial|club|lfa/i;

export default async function ClubFinancePage() {
  const { valuations } = await fetchClubs();
  const all = sportsStoriesBySection('main', { includeHero: true });
  const matched = all
    .filter((s) => FINANCE_RE.test(s.title))
    .sort((a, b) => Number(CORE_RE.test(b.title)) - Number(CORE_RE.test(a.title)));
  const stories = matched.length >= 5 ? matched : all;

  return (
    <SportsDeskLayout
      label="Club Finance"
      blurb="The money behind Liberian Premier League clubs — valuations, revenue, and the discipline driving the turnaround. Who's bankable, and who's still bleeding."
      stories={stories}
      variant="horizontal"
      dataTitle="LPL Club Valuations · 2026"
      dataNote="Estimated valuations · TrueRate Sports / club filings · illustrative sample data."
    >
      <IntelTable<ClubValuation>
        caption="Estimated Liberian Premier League club valuations, 2026"
        rows={valuations}
        getRowKey={(r) => r.club}
        columns={[
          { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
          { key: 'club', label: 'Club', primary: true },
          { key: 'estValue', label: 'Est. value', numeric: true, primary: true },
          { key: 'yoy', label: 'YoY', numeric: true, render: (r) => <Delta text={r.yoy} up={r.up} className="text-xs justify-end" /> },
          { key: 'capacity', label: 'Capacity', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.capacity}</span> },
          { key: 'founded', label: 'Founded', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.founded}</span> },
        ]}
      />
    </SportsDeskLayout>
  );
}
