import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import SportsMasthead from '@/components/sports/SportsMasthead';
import VerticalHero from '@/components/sports/VerticalHero';
import SectionHead from '@/components/sports/SectionHead';
import IntelTable from '@/components/sports/IntelTable';
import InvestigationCard from '@/components/sports/InvestigationCard';
import SidebarFooter from '@/components/sports/SidebarFooter';
import Delta from '@/components/sports/Delta';
import { fetchClubs } from '@/lib/sports/intel';
import {
  CLUB_FINANCE_HERO,
  STADIUM_ECONOMICS,
  SPEND_VS_PERF,
  CLUB_FINANCE_EDITORIAL,
  type ClubValuation,
  type ClubPnL,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Club Finance — Sports Intelligence',
  description: 'Liberian Premier League club valuations, P&L, stadium economics and the spending-vs-performance picture.',
};

export const revalidate = 300;

export default async function ClubFinancePage() {
  const { valuations, pnl } = await fetchClubs();
  const maxSpend = Math.max(...SPEND_VS_PERF.map((d) => d.spend));
  const maxPerf = Math.max(...SPEND_VS_PERF.map((d) => d.perf));

  return (
    <div className="min-h-screen bg-brand-surface text-gray-800">
      <SportsMasthead />
      <main className="mx-auto max-w-container px-4 py-6">
        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Club Finance' }]} />

        <div className="mt-4">
          <VerticalHero {...CLUB_FINANCE_HERO} />
        </div>

        {/* Valuations */}
        <section aria-labelledby="valuations" className="mb-12">
          <SectionHead id="valuations" title="LPL Club Valuations · 2026 estimate" />
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
        </section>

        {/* P&L */}
        <section aria-labelledby="pnl" className="mb-12">
          <SectionHead id="pnl" title="Club P&amp;L · 2025 season" />
          <IntelTable<ClubPnL>
            caption="Liberian Premier League club profit and loss, 2025 season"
            rows={pnl}
            getRowKey={(r) => r.club}
            columns={[
              { key: 'club', label: 'Club', primary: true },
              { key: 'revenue', label: 'Revenue', numeric: true, primary: true },
              { key: 'wages', label: 'Wage bill', numeric: true, render: (r) => <span className="text-gray-500">{r.wages}</span> },
              { key: 'profit', label: 'P&L', numeric: true, render: (r) => <span className={`font-semibold tabular-nums ${r.profitable ? 'text-pos' : 'text-neg'}`}>{r.profit}</span> },
              { key: 'margin', label: 'Margin', numeric: true, hideOnMobile: true, render: (r) => <Delta text={r.margin} up={r.profitable} className="text-xs justify-end" /> },
            ]}
          />
        </section>

        {/* Stadium + scatter */}
        <section aria-labelledby="stadium" className="mb-12 grid gap-x-8 gap-y-10 lg:grid-cols-2">
          <div>
            <SectionHead id="stadium" title={STADIUM_ECONOMICS.venue} />
            <dl className="grid grid-cols-2 gap-px rounded-lg overflow-hidden border border-gray-200 bg-gray-200">
              <div className="bg-white px-4 py-3">
                <dt className="text-2xs uppercase tracking-wide text-gray-500">Capacity</dt>
                <dd className="mt-1 text-stat-sm font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.capacity}</dd>
              </div>
              <div className="bg-white px-4 py-3">
                <dt className="text-2xs uppercase tracking-wide text-gray-500">Utilisation</dt>
                <dd className="mt-1 text-stat-sm font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.utilisation}</dd>
              </div>
              <div className="bg-white px-4 py-3">
                <dt className="text-2xs uppercase tracking-wide text-gray-500">Renovation</dt>
                <dd className="mt-1 text-md font-semibold text-gray-900">{STADIUM_ECONOMICS.renovation_phase} <span className="text-sm font-normal text-gray-500 tabular-nums">· {STADIUM_ECONOMICS.renovation_total}</span></dd>
              </div>
              <div className="bg-white px-4 py-3">
                <dt className="text-2xs uppercase tracking-wide text-gray-500">Break-even</dt>
                <dd className="mt-1 text-stat-sm font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.break_even_year}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-2.5">
              {STADIUM_ECONOMICS.notes.map((n, i) => (
                <li key={i} className="text-sm leading-relaxed text-gray-600 pl-3 border-l-2 border-gray-300">{n}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHead id="spend-perf" title="Wage bill vs LPL points · 2025" />
            <figure>
              <div
                className="relative aspect-[5/3] border-l border-b border-gray-300 ml-10 mb-8 mt-2"
                role="img"
                aria-label="Scatter plot of club wage bill against league points; higher-spending clubs generally finish with more points."
              >
                {SPEND_VS_PERF.map((d) => {
                  const x = (d.spend / maxSpend) * 100;
                  const y = (d.perf / maxPerf) * 100;
                  return (
                    <span
                      key={d.club}
                      title={`${d.club}: $${d.spend}K wages · ${d.perf} pts`}
                      className={`absolute h-2.5 w-2.5 rounded-full -translate-x-1/2 translate-y-1/2 ${d.profitable ? 'bg-pos' : 'bg-neg'}`}
                      style={{ left: `${x}%`, bottom: `${y}%` }}
                    />
                  );
                })}
                <span className="absolute -left-9 top-0 text-2xs uppercase tracking-wide text-gray-500">Pts</span>
                <span className="absolute -bottom-6 right-0 text-2xs uppercase tracking-wide text-gray-500">Wages →</span>
              </div>
              <figcaption className="flex items-center gap-5 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pos" /> Profitable</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-neg" /> Loss-making</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Editorial */}
        <section aria-labelledby="cf-depth" className="mb-12">
          <SectionHead id="cf-depth" title="In Depth" />
          <div className="grid gap-6 sm:grid-cols-3">
            {CLUB_FINANCE_EDITORIAL.map((e) => (
              <InvestigationCard key={e.title} item={e} imageCategory="club finance" />
            ))}
          </div>
        </section>

        <div className="mt-4">
          <SidebarFooter />
        </div>
        <p className="sr-only">
          <Link href="/sports">Back to TrueRate Sports</Link>
        </p>
      </main>
    </div>
  );
}
