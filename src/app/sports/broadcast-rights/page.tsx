import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import StatusPill from '@/components/sports/StatusPill';
import LeagueTable from '@/components/sports/LeagueTable';
import {
  BROADCAST_HERO,
  BROADCAST_DEALS,
  BROADCAST_TENDER,
  BROADCAST_REACH,
  BROADCAST_ECONOMICS,
  BROADCAST_EDITORIAL,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Broadcast Rights — Sports Finance | TrueRate',
  description: 'Live broadcast deals, rights tenders, and the per-fixture economics of Liberian and West African sports media.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1.5 mb-4">
      {children}
    </h2>
  );
}

export default function BroadcastRightsPage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">

        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Broadcast Rights' }]} />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <article className="mb-10 pb-8 border-b border-gray-300">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Latest deal</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-3 max-w-[820px]">
            {BROADCAST_HERO.title}
          </h1>
          <p className="text-md leading-relaxed text-gray-600 max-w-[760px] mb-3">
            {BROADCAST_HERO.dek}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{BROADCAST_HERO.source}</span>
            <span className="mx-1.5">·</span>
            <time>{BROADCAST_HERO.time}</time>
          </p>
        </article>

        {/* ── Deals table ─────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Active rights deals</H2>
          <LeagueTable
            columns={[
              { key: 'comp',      label: 'Competition', align: 'left',  primary: true },
              { key: 'rights',    label: 'Holder',      align: 'left',  hideOnMobile: true },
              { key: 'value',     label: 'Total',       align: 'right', numeric: true, primary: true },
              { key: 'perSeason', label: 'Per Year',    align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.perSeason}</span> },
              { key: 'territory', label: 'Territory',   align: 'left',  hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500">{r.territory}</span> },
              { key: 'expiry',    label: 'Expires',     align: 'right',
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.expiry}</span> },
              { key: 'status',    label: 'Status',      align: 'right', render: r => <StatusPill status={r.status} /> },
            ]}
            rows={BROADCAST_DEALS}
            caption="Active broadcast rights deals across Liberia and West Africa"
          />
        </section>

        {/* ── Tender + Reach ──────────────────────────────────────── */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-10">

          <div>
            <H2>Open tender</H2>
            <p className="text-2xs uppercase tracking-wide text-red-700 mb-2">Opens in</p>
            <p className="text-[44px] font-bold text-gray-900 tabular-nums leading-none">
              {BROADCAST_TENDER.daysOut}<span className="text-xl font-semibold text-gray-500 ml-2">days</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{BROADCAST_TENDER.opensOn}</p>

            <dl className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div>
                <dt className="text-xs text-gray-500">Reserve price</dt>
                <dd className="text-lg font-semibold text-gray-900 tabular-nums">{BROADCAST_TENDER.reservePrice}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-1">Expected bidders</dt>
                <dd className="text-base text-gray-700">{BROADCAST_TENDER.expectedBidders.join(' · ')}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-200 pt-3">{BROADCAST_TENDER.note}</p>
          </div>

          <div className="lg:col-span-2">
            <H2>LPL broadcast reach</H2>
            <dl className="grid grid-cols-2 sm:grid-cols-4 border-y border-gray-200 [&>*+*]:border-l [&>*+*]:border-gray-200 sm:[&>*:nth-child(odd)]:border-l-0 sm:[&>*:nth-child(3)]:border-l">
              {[
                { label: 'Households reached',   value: BROADCAST_REACH.households,                            delta: BROADCAST_REACH.households_yoy,    up: true  as boolean | null },
                { label: 'Fixtures per season',  value: String(BROADCAST_REACH.fixtures_per_season),           delta: '',                                up: null  as boolean | null },
                { label: 'Avg audience / match', value: BROADCAST_REACH.avg_audience_per_match,                delta: '',                                up: null  as boolean | null },
                { label: 'Digital share',        value: BROADCAST_REACH.digital_share,                         delta: BROADCAST_REACH.digital_share_yoy, up: true  as boolean | null },
              ].map(s => (
                <div key={s.label} className="px-4 py-3">
                  <dt className="text-xs text-gray-500 mb-1">{s.label}</dt>
                  <dd className="text-[20px] font-bold text-gray-900 tabular-nums">{s.value}</dd>
                  {s.delta && <p className={`mt-0.5 text-sm tabular-nums ${s.up ? 'text-emerald-700' : 'text-gray-500'}`}>{s.up ? '+' : ''}{s.delta}</p>}
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Flagship match</p>
              <p className="text-md text-gray-700 mb-1">{BROADCAST_REACH.flagship_match}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{BROADCAST_REACH.flagship_audience}<span className="text-sm font-normal text-gray-500 ml-2">peak audience</span></p>
            </div>
          </div>
        </section>

        {/* ── Economics ────────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>What a fixture actually costs</H2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 border-y border-gray-200 [&>*+*]:border-l [&>*+*]:border-gray-200 sm:[&>*:nth-child(odd)]:border-l-0 sm:[&>*:nth-child(3)]:border-l">
            {BROADCAST_ECONOMICS.map(m => (
              <div key={m.label} className="px-4 py-3">
                <dt className="text-xs text-gray-500 mb-1">{m.label}</dt>
                <dd className="text-[20px] font-bold text-gray-900 tabular-nums">{m.value}</dd>
                <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section>
          <H2>In depth</H2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BROADCAST_EDITORIAL.map(e => (
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
