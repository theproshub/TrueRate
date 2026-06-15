import type { Metadata } from 'next';
import IntelTable from '@/components/sports/IntelTable';
import SportsDeskLayout from '@/components/sports/SportsDeskLayout';
import { fetchSponsorships } from '@/lib/sports/intel';
import { sportsStoriesBySection } from '@/data/sports-stories';
import { type Sponsorship } from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Sponsorship — TrueRate Sports',
  description: 'The brands, deals and money behind Liberian sport — from title sponsorships to athlete endorsements.',
  alternates: { canonical: '/sports/sponsorship' },
};

export const revalidate = 300;

export default async function SponsorshipPage() {
  const leaderboard = await fetchSponsorships();
  const stories = sportsStoriesBySection('sponsorship', { includeHero: true });

  return (
    <SportsDeskLayout
      label="Sponsorship"
      blurb="The brands bankrolling Liberian sport — title sponsorships, shirt deals and athlete endorsements, and the telecom arms race driving the money."
      stories={stories}
      variant="grid"
      dataTitle="Sponsorship Leaderboard"
      dataNote="Largest active deals · TrueRate Sports / clubs · illustrative sample data."
    >
      <IntelTable<Sponsorship>
        caption="Largest active sponsorship deals across Liberian sport"
        rows={leaderboard}
        getRowKey={(r) => `${r.party}-${r.sponsor}`}
        columns={[
          { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
          { key: 'party', label: 'Rights holder', primary: true },
          { key: 'sponsor', label: 'Brand', render: (r) => <span className="text-gray-700">{r.sponsor}</span> },
          { key: 'category', label: 'Type', hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.category}</span> },
          { key: 'annual', label: 'Annual', numeric: true, primary: true },
          { key: 'expiry', label: 'Through', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.expiry}</span> },
        ]}
      />
    </SportsDeskLayout>
  );
}
