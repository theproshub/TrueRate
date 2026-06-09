import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import VerticalHero from '@/components/sports/VerticalHero';
import SectionHead from '@/components/sports/SectionHead';
import IntelTable from '@/components/sports/IntelTable';
import InvestigationCard from '@/components/sports/InvestigationCard';
import SidebarFooter from '@/components/sports/SidebarFooter';
import { fetchBroadcastDeals } from '@/lib/sports/intel';
import {
  BROADCAST_HERO,
  BROADCAST_TENDER,
  BROADCAST_REACH,
  BROADCAST_ECONOMICS,
  BROADCAST_EDITORIAL,
  type BroadcastDeal,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Broadcast Rights — Sports Intelligence',
  description: 'Media-rights deals, the LPL tender, audience reach and the economics of broadcasting Liberian and West African sport.',
};

export const revalidate = 300;

export default async function BroadcastPage() {
  const deals = await fetchBroadcastDeals();
  const reach: { label: string; value: string }[] = [
    { label: 'Households reached', value: `${BROADCAST_REACH.households} (${BROADCAST_REACH.households_yoy})` },
    { label: 'Fixtures / season', value: String(BROADCAST_REACH.fixtures_per_season) },
    { label: 'Avg audience / match', value: BROADCAST_REACH.avg_audience_per_match },
    { label: 'Digital share', value: `${BROADCAST_REACH.digital_share} (${BROADCAST_REACH.digital_share_yoy})` },
    { label: 'Flagship audience', value: BROADCAST_REACH.flagship_audience },
  ];

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Broadcast Rights' }]} />

        <div className="mt-4">
          <VerticalHero {...BROADCAST_HERO} />
        </div>

        {/* Rights deals */}
        <section aria-labelledby="bc-deals" className="mb-12">
          <SectionHead id="bc-deals" title="Media-Rights Deals" />
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
        </section>

        {/* Tender + reach */}
        <section aria-labelledby="bc-tender" className="mb-12 grid gap-x-8 gap-y-10 lg:grid-cols-2">
          <div>
            <SectionHead id="bc-tender" title="Open Tender" />
            <div className="rounded-lg border border-brand-accent-ink/30 bg-brand-accent-ink/5 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-md font-bold text-gray-900">{BROADCAST_TENDER.competition}</h3>
                <span className="text-2xs font-bold uppercase tracking-wide text-brand-accent-ink tabular-nums">Opens in {BROADCAST_TENDER.daysOut} days</span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-gray-500">Opens</dt>
                <dd className="text-right text-gray-900">{BROADCAST_TENDER.opensOn}</dd>
                <dt className="text-gray-500">Reserve price</dt>
                <dd className="text-right text-gray-900 tabular-nums">{BROADCAST_TENDER.reservePrice}</dd>
              </dl>
              <p className="mt-3 text-2xs uppercase tracking-wide text-gray-500 mb-1">Expected bidders</p>
              <ul className="flex flex-wrap gap-1.5">
                {BROADCAST_TENDER.expectedBidders.map((b) => (
                  <li key={b} className="rounded-sm border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-700">{b}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{BROADCAST_TENDER.note}</p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <SectionHead id="bc-reach" title="Audience Reach" />
              <dl className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-200">
                {reach.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-gray-600">{r.label}</dt>
                    <dd className="text-sm font-bold tabular-nums text-gray-900">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-2xs text-gray-500">Flagship: {BROADCAST_REACH.flagship_match}</p>
            </div>

            <div>
              <SectionHead id="bc-econ" title="Broadcast Economics" />
              <dl className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border border-gray-200 bg-gray-200">
                {BROADCAST_ECONOMICS.map((e) => (
                  <div key={e.label} className="bg-white px-4 py-3">
                    <dt className="text-2xs uppercase tracking-wide text-gray-500 leading-tight">{e.label}</dt>
                    <dd className="mt-1 text-stat-sm font-bold tabular-nums text-gray-900">{e.value}</dd>
                    <dd className="text-2xs text-gray-500">{e.sub}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Editorial */}
        <section aria-labelledby="bc-depth" className="mb-12">
          <SectionHead id="bc-depth" title="In Depth" />
          <div className="grid gap-6 sm:grid-cols-3">
            {BROADCAST_EDITORIAL.map((e) => (
              <InvestigationCard key={e.title} item={e} imageCategory="broadcast" />
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
