import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import StatusPill from '@/components/sports/StatusPill';
import LeagueTable from '@/components/sports/LeagueTable';
import {
  SPONSORSHIP_HERO,
  SPONSORSHIP_LEADERBOARD,
  SPONSORSHIP_BRANDS,
  SPONSORSHIP_ATHLETES,
  SPONSORSHIP_FEDERATION,
  SPONSORSHIP_EDITORIAL,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Sponsorship — Sports Finance | TrueRate',
  description: 'Title, shirt, and federation sponsorship deals across Liberian and West African sports — clubs ranked, brands ranked, and the deal economics behind the headlines.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1.5 mb-4">
      {children}
    </h2>
  );
}

export default function SponsorshipPage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">

        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Sponsorship' }]} />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <article className="mb-10 pb-8 border-b border-gray-300">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">League title sponsorship</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-3 max-w-[820px]">
            {SPONSORSHIP_HERO.title}
          </h1>
          <p className="text-md leading-relaxed text-gray-600 max-w-[760px] mb-3">
            {SPONSORSHIP_HERO.dek}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{SPONSORSHIP_HERO.source}</span>
            <span className="mx-1.5">·</span>
            <time>{SPONSORSHIP_HERO.time}</time>
          </p>
        </article>

        {/* ── Leaderboard ─────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Sponsorship leaderboard · clubs & federations</H2>
          <LeagueTable
            columns={[
              { key: 'rank',       label: '#',          align: 'left',  width: '32px',  render: r => <span className="text-gray-400 tabular-nums">{r.rank}</span> },
              { key: 'party',      label: 'Party',      align: 'left',  primary: true },
              { key: 'sponsor',    label: 'Sponsor',    align: 'left',  hideOnMobile: true },
              { key: 'category',   label: 'Type',       align: 'left',  hideOnMobile: true,
                render: r => <span className="text-xs uppercase tracking-wide text-gray-500">{r.category}</span> },
              { key: 'annual',     label: 'Annual',     align: 'right', numeric: true, primary: true },
              { key: 'totalValue', label: 'Total',      align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.totalValue}</span> },
              { key: 'expiry',     label: 'Expires',    align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.expiry}</span> },
              { key: 'status',     label: 'Status',     align: 'right', render: r => <StatusPill status={r.status} /> },
            ]}
            rows={SPONSORSHIP_LEADERBOARD}
            caption="Sponsorship leaderboard ranked by annual value"
          />
        </section>

        {/* ── Brand activity + Federation deals ───────────────────── */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">

          <div>
            <H2>Top brands · annual spend</H2>
            <LeagueTable
              columns={[
                { key: 'rank',        label: '#',       align: 'left',  width: '32px', render: r => <span className="text-gray-400 tabular-nums">{r.rank}</span> },
                { key: 'brand',       label: 'Brand',   align: 'left',  primary: true },
                { key: 'sector',      label: 'Sector',  align: 'left',  hideOnMobile: true,
                  render: r => <span className="text-xs uppercase tracking-wide text-gray-500">{r.sector}</span> },
                { key: 'totalAnnual', label: 'Annual',  align: 'right', numeric: true, primary: true },
                { key: 'deals',       label: 'Deals',   align: 'right',
                  render: r => <span className="text-sm tabular-nums text-gray-700">{r.deals}</span> },
                { key: 'topDeal',     label: 'Top deal', align: 'left', hideOnMobile: true,
                  render: r => <span className="text-xs text-gray-500">{r.topDeal}</span> },
              ]}
              rows={SPONSORSHIP_BRANDS}
              caption="Top sports sponsors ranked by total annual spend"
            />
          </div>

          <div>
            <H2>National federation deals</H2>
            <ul className="border-y border-gray-200">
              {SPONSORSHIP_FEDERATION.map(f => (
                <li key={f.fed} className="px-1 py-3 border-b border-gray-100 last:border-0 flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-md font-semibold text-gray-900 leading-snug">{f.fed}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {f.sponsor} <span className="text-gray-400">· since {f.since}</span>
                    </p>
                  </div>
                  <p className="shrink-0 text-lg font-bold text-gray-900 tabular-nums">{f.annual}</p>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* ── Athlete endorsements ─────────────────────────────────── */}
        <section className="mb-12">
          <H2>Athlete endorsements</H2>
          <ul className="border-y border-gray-200">
            {SPONSORSHIP_ATHLETES.map(a => (
              <li key={a.name} className="px-1 py-4 border-b border-gray-100 last:border-0 grid grid-cols-1 sm:grid-cols-[200px_1fr_auto] gap-3 sm:gap-6 items-baseline">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-0.5">{a.sport}</p>
                  <p className="text-lg font-semibold text-gray-900">{a.name}</p>
                </div>
                <p className="text-base text-gray-600">
                  Sponsors: <span className="text-gray-900">{a.deals.join(' · ')}</span>
                </p>
                <p className="text-lg font-bold text-gray-900 tabular-nums sm:text-right">{a.total}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section>
          <H2>In depth</H2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {SPONSORSHIP_EDITORIAL.map(e => (
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
