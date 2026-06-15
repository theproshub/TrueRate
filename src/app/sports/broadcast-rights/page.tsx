import type { Metadata } from 'next';
import IntelTable from '@/components/sports/IntelTable';
import SportsDeskLayout from '@/components/sports/SportsDeskLayout';
import { fetchBroadcastDeals } from '@/lib/sports/intel';
import { sportsStoriesBySection } from '@/data/sports-stories';
import { type BroadcastDeal } from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Broadcast Rights — TrueRate Sports',
  description: 'The media-rights money shaping what Liberian audiences watch — deals, territories, and the streaming bet.',
  alternates: { canonical: '/sports/broadcast-rights' },
};

export const revalidate = 300;

export default async function BroadcastRightsPage() {
  const deals = await fetchBroadcastDeals();
  const stories = sportsStoriesBySection('broadcast', { includeHero: true });

  return (
    <SportsDeskLayout
      label="Broadcast Rights"
      blurb="The media-rights money shaping what Liberian audiences watch — league and tournament deals, territories, and the domestic streaming bet that could grow the audience."
      stories={stories}
      variant="overlay"
      dataTitle="Media-Rights Deals"
      dataNote="Active and pending deals affecting Liberian audiences · TrueRate Sports · illustrative sample data."
    >
      <IntelTable<BroadcastDeal>
        caption="Active and pending sports media-rights deals affecting Liberian audiences"
        rows={deals}
        getRowKey={(r) => r.comp}
        columns={[
          { key: 'comp', label: 'Competition', primary: true },
          { key: 'rights', label: 'Rights holder', render: (r) => <span className="text-gray-700">{r.rights}</span> },
          { key: 'value', label: 'Value', numeric: true, primary: true },
          { key: 'perSeason', label: 'Per season', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.perSeason}</span> },
          { key: 'territory', label: 'Territory', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.territory}</span> },
          { key: 'expiry', label: 'Expiry', numeric: true, render: (r) => <span className="text-gray-500">{r.expiry}</span> },
        ]}
      />
    </SportsDeskLayout>
  );
}
