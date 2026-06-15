import type { Metadata } from 'next';
import IntelTable from '@/components/sports/IntelTable';
import SportsDeskLayout from '@/components/sports/SportsDeskLayout';
import { fetchTransfers } from '@/lib/sports/intel';
import { sportsStoriesBySection } from '@/data/sports-stories';
import { type Transfer } from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Transfers & Deals — TrueRate Sports',
  description: 'The Liberian transfer market — fees, moves, and the diaspora pipeline turning players into an export industry.',
  alternates: { canonical: '/sports/transfers-deals' },
};

export const revalidate = 300;

const DIRECTION_STYLE: Record<Transfer['direction'], string> = {
  inbound: 'text-pos',
  outbound: 'text-sky-600',
  domestic: 'text-gray-500',
};

export default async function TransfersDealsPage() {
  const top10 = await fetchTransfers();
  const stories = sportsStoriesBySection('transfers', { includeHero: true });

  return (
    <SportsDeskLayout
      label="Transfers & Deals"
      blurb="The Liberian transfer market — fees, contracts and the diaspora pipeline turning homegrown players into the country's most valuable football export."
      stories={stories}
      variant="stacked"
      dataTitle="Biggest Transfers · 2026 window"
      dataNote="Ten largest fees · TrueRate Sports · illustrative sample data."
    >
      <IntelTable<Transfer>
        caption="Ten largest Liberian transfer fees in the 2026 window"
        rows={top10}
        getRowKey={(r) => `${r.rank}-${r.player}`}
        columns={[
          { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
          { key: 'player', label: 'Player', primary: true },
          { key: 'pos', label: 'Pos', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.pos}</span> },
          { key: 'move', label: 'Move', render: (r) => <span className="text-gray-700">{r.from} → {r.to}</span> },
          { key: 'fee', label: 'Fee', numeric: true, primary: true },
          { key: 'direction', label: 'Flow', hideOnMobile: true, render: (r) => <span className={`uppercase text-2xs font-bold tracking-wide ${DIRECTION_STYLE[r.direction]}`}>{r.direction}</span> },
          { key: 'status', label: 'Status', hideOnMobile: true, render: (r) => <span className="text-gray-500 capitalize">{r.status}</span> },
        ]}
      />
    </SportsDeskLayout>
  );
}
