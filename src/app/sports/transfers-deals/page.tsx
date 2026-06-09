import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import VerticalHero from '@/components/sports/VerticalHero';
import SectionHead from '@/components/sports/SectionHead';
import IntelTable from '@/components/sports/IntelTable';
import InvestigationCard from '@/components/sports/InvestigationCard';
import SidebarFooter from '@/components/sports/SidebarFooter';
import { fetchTransfers } from '@/lib/sports/intel';
import {
  TRANSFERS_HERO,
  TRANSFERS_FLOW,
  DIASPORA_PIPELINE,
  TRANSFERS_MONTHLY,
  TRANSFERS_EDITORIAL,
  type Transfer,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Transfers & Deals — Sports Intelligence',
  description: 'The Liberian transfer window: top fees, inbound/outbound flow, the diaspora pipeline and the money behind the moves.',
};

const DIRECTION_STYLE: Record<Transfer['direction'], string> = {
  inbound: 'text-pos',
  outbound: 'text-sky-600',
  domestic: 'text-gray-500',
};

const maxMonthly = Math.max(...TRANSFERS_MONTHLY.map((m) => m.count));

export const revalidate = 300;

export default async function TransfersPage() {
  const top10 = await fetchTransfers();
  const flow = [
    { ...TRANSFERS_FLOW.outbound, key: 'Outbound' },
    { ...TRANSFERS_FLOW.inbound, key: 'Inbound' },
    { ...TRANSFERS_FLOW.domestic, key: 'Domestic' },
  ];

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Transfers & Deals' }]} />

        <div className="mt-4">
          <VerticalHero
            kicker={TRANSFERS_HERO.kicker}
            title={TRANSFERS_HERO.title}
            dek={`${TRANSFERS_HERO.player}, ${TRANSFERS_HERO.position}, age ${TRANSFERS_HERO.age} — ${TRANSFERS_HERO.from} → ${TRANSFERS_HERO.to}, ${TRANSFERS_HERO.contract}.`}
            source={TRANSFERS_HERO.source}
            time={TRANSFERS_HERO.time}
            bigNumber={TRANSFERS_HERO.bigNumber}
            bigNumberLabel={TRANSFERS_HERO.bigNumberLabel}
          />
        </div>

        {/* Window flow */}
        <section aria-labelledby="tr-flow" className="mb-12">
          <SectionHead id="tr-flow" title="Window Flow · 2026" />
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {flow.map((f) => (
              <div key={f.key} className="rounded-lg border border-gray-200 bg-white px-5 py-4">
                <dt className="text-2xs font-bold uppercase tracking-wider text-gray-500">{f.key}</dt>
                <dd className="mt-2 flex items-baseline gap-2">
                  <span className="text-stat-md font-black tabular-nums text-gray-900">{f.value}</span>
                  <span className="text-sm text-gray-500">· {f.count} {f.count === 1 ? 'deal' : 'deals'}</span>
                </dd>
                <dd className="mt-1 text-xs text-gray-500">{f.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Top 10 */}
        <section aria-labelledby="tr-top10" className="mb-12">
          <SectionHead id="tr-top10" title="Top 10 Transfers · 2026 window" />
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
        </section>

        {/* Diaspora + monthly */}
        <section aria-labelledby="tr-diaspora" className="mb-12 grid gap-x-8 gap-y-10 lg:grid-cols-2">
          <div>
            <SectionHead id="tr-diaspora" title="Diaspora Pipeline" />
            <div className="flex gap-8 mb-5">
              <div>
                <p className="text-stat-md font-black tabular-nums text-gray-900">{DIASPORA_PIPELINE.totalEarnings}</p>
                <p className="text-xs text-gray-500">Est. annual earnings abroad</p>
              </div>
              <div>
                <p className="text-stat-md font-black tabular-nums text-gray-900">{DIASPORA_PIPELINE.playersAbroad}</p>
                <p className="text-xs text-gray-500">Liberian players abroad</p>
              </div>
            </div>
            <ul className="space-y-3">
              {DIASPORA_PIPELINE.topLeagues.map((l) => (
                <li key={l.league}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{l.league}</span>
                    <span className="text-gray-500 tabular-nums">{l.players} · {l.share}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-accent-ink" style={{ width: `${l.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHead id="tr-monthly" title="Transfers by Month" />
            <figure>
              <div className="flex items-end gap-2 h-40 border-b border-gray-300 pb-px" role="img" aria-label="Monthly transfer counts from September to April, peaking in February with 11 deals.">
                {TRANSFERS_MONTHLY.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                    <span className="text-2xs text-gray-500 tabular-nums">{m.count}</span>
                    <div className="w-full rounded-t bg-brand-accent-ink/80" style={{ height: `${(m.count / maxMonthly) * 100}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-1.5">
                {TRANSFERS_MONTHLY.map((m) => (
                  <span key={m.month} className="flex-1 text-center text-2xs uppercase tracking-wide text-gray-500">{m.month}</span>
                ))}
              </div>
            </figure>
          </div>
        </section>

        {/* Editorial */}
        <section aria-labelledby="tr-depth" className="mb-12">
          <SectionHead id="tr-depth" title="In Depth" />
          <div className="grid gap-6 sm:grid-cols-3">
            {TRANSFERS_EDITORIAL.map((e) => (
              <InvestigationCard key={e.title} item={e} imageCategory="transfers" />
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
