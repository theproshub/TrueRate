import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import StatusPill from '@/components/sports/StatusPill';
import LeagueTable from '@/components/sports/LeagueTable';
import {
  TRANSFERS_HERO,
  TRANSFERS_TOP10,
  TRANSFERS_FLOW,
  DIASPORA_PIPELINE,
  TRANSFERS_MONTHLY,
  TRANSFERS_EDITORIAL,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Transfers & Deals — Sports Finance | TrueRate',
  description: 'Player moves, fees, contract lengths, and the diaspora pipeline economics behind West African football and basketball transfers.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1.5 mb-4">
      {children}
    </h2>
  );
}

export default function TransfersDealsPage() {
  const maxMonth = Math.max(...TRANSFERS_MONTHLY.map(m => m.count));

  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-container px-4 py-6">

        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Transfers & Deals' }]} />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <article className="mb-10 pb-8 border-b border-gray-300">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Window leader</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-3 max-w-[820px]">
            {TRANSFERS_HERO.title}
          </h1>

          {/* Inline transfer detail — compact key-value pairs, no card */}
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-2 max-w-[820px] mb-4 py-4 border-y border-gray-200">
            <div>
              <dt className="text-2xs uppercase tracking-wide text-gray-500 mb-0.5">Player</dt>
              <dd className="text-md font-semibold text-gray-900">{TRANSFERS_HERO.player}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-wide text-gray-500 mb-0.5">Position</dt>
              <dd className="text-md text-gray-700">{TRANSFERS_HERO.position}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-wide text-gray-500 mb-0.5">From</dt>
              <dd className="text-md text-gray-700">{TRANSFERS_HERO.from}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-wide text-gray-500 mb-0.5">To</dt>
              <dd className="text-md text-gray-700">{TRANSFERS_HERO.to}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-wide text-gray-500 mb-0.5">Fee</dt>
              <dd className="text-md font-bold text-gray-900 tabular-nums">{TRANSFERS_HERO.bigNumber}</dd>
            </div>
          </dl>

          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{TRANSFERS_HERO.source}</span>
            <span className="mx-1.5">·</span>
            <time>{TRANSFERS_HERO.time}</time>
          </p>
        </article>

        {/* ── Flow split ──────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Window flow</H2>
          <dl className="grid grid-cols-3 border-y border-gray-300">
            {[
              { ...TRANSFERS_FLOW.inbound,  key: 'in' },
              { ...TRANSFERS_FLOW.outbound, key: 'out' },
              { ...TRANSFERS_FLOW.domestic, key: 'dom' },
            ].map((f, i) => (
              <div key={f.key} className={`px-4 py-4 ${i > 0 ? 'border-l border-gray-200' : ''}`}>
                <dt className="text-xs text-gray-500 mb-1">{f.label}</dt>
                <dd className="text-stat-md font-bold text-gray-900 tabular-nums">{f.value}</dd>
                <p className="text-sm text-gray-500 tabular-nums mt-1">{f.count} deals</p>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Top 10 transfers ────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Top 10 transfers · 2026 window</H2>
          <LeagueTable
            columns={[
              { key: 'rank',     label: '#',         align: 'left',  width: '32px',  render: r => <span className="text-gray-400 tabular-nums">{r.rank}</span> },
              { key: 'player',   label: 'Player',    align: 'left',  primary: true },
              { key: 'pos',      label: 'Pos',       align: 'left',  hideOnMobile: true },
              { key: 'from',     label: 'From',      align: 'left',  hideOnMobile: true },
              { key: 'to',       label: 'To',        align: 'left' },
              { key: 'fee',      label: 'Fee',       align: 'right', numeric: true, primary: true },
              { key: 'contract', label: 'Term',      align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.contract}</span> },
              { key: 'status',   label: 'Status',    align: 'right', render: r => <StatusPill status={r.status} /> },
              { key: 'date',     label: 'Date',      align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.date}</span> },
            ]}
            rows={TRANSFERS_TOP10}
            caption="Top 10 Liberian transfers ranked by fee"
            total={{ player: 'Total · 10 deals', fee: '$1.45M' }}
          />
        </section>

        {/* ── Diaspora pipeline ─────────────────────────────────────── */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-10">
          <div>
            <H2>Diaspora earnings</H2>
            <p className="text-stat-xl font-bold text-gray-900 tabular-nums leading-[0.95]">
              {DIASPORA_PIPELINE.totalEarnings}
            </p>
            <p className="mt-2 text-base text-gray-600 leading-relaxed">
              Combined annual earnings of <span className="font-semibold text-gray-900 tabular-nums">{DIASPORA_PIPELINE.playersAbroad}</span> Liberian footballers playing professionally outside the country, 2025 estimate.
            </p>
          </div>
          <div className="lg:col-span-2">
            <H2>By league</H2>
            <ul className="border-y border-gray-200">
              {DIASPORA_PIPELINE.topLeagues.map(l => (
                <li key={l.league} className="px-1 py-2.5 border-b border-gray-100 last:border-0 grid grid-cols-[1fr_auto_auto] items-center gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900 mb-1">{l.league}</p>
                    <div className="h-1 bg-gray-100 overflow-hidden">
                      <div className="h-full bg-gray-700" style={{ width: `${l.share}%` }} />
                    </div>
                  </div>
                  <span className="text-base text-gray-700 tabular-nums">{l.players}</span>
                  <span className="text-sm text-gray-500 tabular-nums w-10 text-right">{l.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Monthly volume ──────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Transfers per month · 2025-26 window</H2>
          <div className="grid grid-cols-8 gap-3 sm:gap-4 items-end h-32 border-b border-gray-300 pb-3">
            {TRANSFERS_MONTHLY.map(m => (
              <div key={m.month} className="flex flex-col items-center gap-2 h-full">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full bg-gray-700"
                    style={{ height: `${(m.count / maxMonth) * 100}%` }}
                    aria-label={`${m.count} transfers in ${m.month}`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-gray-900 tabular-nums leading-none">{m.count}</p>
                  <p className="text-2xs uppercase tracking-wide text-gray-500 mt-1">{m.month}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Editorial ─────────────────────────────────────────────── */}
        <section>
          <H2>In depth</H2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TRANSFERS_EDITORIAL.map(e => (
              <Link key={e.title} href={e.href} className="group flex flex-col no-underline">
                <div className="overflow-hidden mb-3">
                  <NewsThumbnail category={e.category} className="w-full h-[160px]" />
                </div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1.5">{e.category}</p>
                <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight group-hover:text-gray-700 transition-colors mb-2">{e.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed line-clamp-3 mb-3">{e.dek}</p>
                <p className="text-xs text-gray-500 mt-auto">
                  <span className="font-semibold text-gray-700">{e.source}</span>
                  <span className="mx-1.5">·</span>
                  {e.time}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
