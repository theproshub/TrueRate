import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import VerticalHero from '@/components/sports/VerticalHero';
import SectionHead from '@/components/sports/SectionHead';
import IntelTable from '@/components/sports/IntelTable';
import InvestigationCard from '@/components/sports/InvestigationCard';
import SidebarFooter from '@/components/sports/SidebarFooter';
import { fetchSponsorships } from '@/lib/sports/intel';
import {
  SPONSORSHIP_HERO,
  SPONSORSHIP_BRANDS,
  SPONSORSHIP_ATHLETES,
  SPONSORSHIP_FEDERATION,
  SPONSORSHIP_EDITORIAL,
  type Sponsorship,
  type SponsorBrand,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Sponsorship & Business — Sports Intelligence',
  description: 'Active partnerships, brand-category spend, athlete endorsements and federation deals across Liberian sport.',
};

export const revalidate = 300;

export default async function SponsorshipPage() {
  const leaderboard = await fetchSponsorships();
  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Sponsorship' }]} />

        <div className="mt-4">
          <VerticalHero {...SPONSORSHIP_HERO} />
        </div>

        {/* Leaderboard */}
        <section aria-labelledby="sp-leaderboard" className="mb-12">
          <SectionHead id="sp-leaderboard" title="Sponsorship Leaderboard" />
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
              { key: 'totalValue', label: 'Total', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.totalValue}</span> },
              { key: 'expiry', label: 'Through', numeric: true, hideOnMobile: true, render: (r) => <span className="text-gray-500">{r.expiry}</span> },
            ]}
          />
        </section>

        {/* Brands + athletes/federation */}
        <section aria-labelledby="sp-brands" className="mb-12 grid gap-x-8 gap-y-10 lg:grid-cols-2">
          <div>
            <SectionHead id="sp-brands" title="Top Brands by Spend" />
            <IntelTable<SponsorBrand>
              caption="Brands ranked by total annual sports sponsorship spend"
              rows={SPONSORSHIP_BRANDS}
              getRowKey={(r) => r.brand}
              columns={[
                { key: 'rank', label: '#', render: (r) => <span className="text-gray-400">{r.rank}</span> },
                { key: 'brand', label: 'Brand', primary: true },
                { key: 'sector', label: 'Sector', render: (r) => <span className="text-gray-500">{r.sector}</span> },
                { key: 'deals', label: 'Deals', numeric: true, render: (r) => <span className="text-gray-700">{r.deals}</span> },
                { key: 'totalAnnual', label: 'Annual', numeric: true, primary: true },
              ]}
            />
          </div>

          <div className="space-y-10">
            <div>
              <SectionHead id="sp-athletes" title="Athlete Endorsements" />
              <ul className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
                {SPONSORSHIP_ATHLETES.map((a) => (
                  <li key={a.name} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 truncate">{a.name}</span>
                      <span className="block text-xs text-gray-500 truncate">{a.sport} · {a.deals.join(', ')}</span>
                    </span>
                    <span className="text-sm font-bold tabular-nums text-gray-900 shrink-0">{a.total}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHead id="sp-fed" title="Federation Deals" />
              <ul className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
                {SPONSORSHIP_FEDERATION.map((f) => (
                  <li key={f.fed} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 truncate">{f.fed}</span>
                      <span className="block text-xs text-gray-500 truncate">{f.sponsor} · since {f.since}</span>
                    </span>
                    <span className="text-sm font-bold tabular-nums text-gray-900 shrink-0">{f.annual}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Editorial */}
        <section aria-labelledby="sp-depth" className="mb-12">
          <SectionHead id="sp-depth" title="In Depth" />
          <div className="grid gap-6 sm:grid-cols-3">
            {SPONSORSHIP_EDITORIAL.map((e) => (
              <InvestigationCard key={e.title} item={e} imageCategory="sponsorship" />
            ))}
          </div>
        </section>

        <div className="mt-4">
          <SidebarFooter />
        </div>
      </main>
    </div>
  );
}
