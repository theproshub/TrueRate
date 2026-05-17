import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import LeagueTable from '@/components/sports/LeagueTable';
import {
  CLUB_FINANCE_HERO,
  CLUB_VALUATIONS,
  CLUB_PNL,
  STADIUM_ECONOMICS,
  SPEND_VS_PERF,
  CLUB_FINANCE_EDITORIAL,
} from '@/lib/sports-finance-data';

export const metadata: Metadata = {
  title: 'Club Finance — Sports Finance | TrueRate',
  description: 'Club valuations, P&L summaries, stadium economics, and the spending-vs-performance picture across the Liberian Premier League.',
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-1.5 mb-4">
      {children}
    </h2>
  );
}

export default function ClubFinancePage() {
  const maxSpend = Math.max(...SPEND_VS_PERF.map(d => d.spend));
  const maxPerf  = Math.max(...SPEND_VS_PERF.map(d => d.perf));

  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">

        <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Club Finance' }]} />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <article className="mb-10 pb-8 border-b border-gray-300">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Most-improved club</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-3 max-w-[820px]">
            {CLUB_FINANCE_HERO.title}
          </h1>
          <p className="text-md leading-relaxed text-gray-600 max-w-[760px] mb-3">
            {CLUB_FINANCE_HERO.dek}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{CLUB_FINANCE_HERO.source}</span>
            <span className="mx-1.5">·</span>
            <time>{CLUB_FINANCE_HERO.time}</time>
          </p>
        </article>

        {/* ── Valuations ──────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>LPL club valuations · 2026 estimate</H2>
          <LeagueTable
            columns={[
              { key: 'rank',     label: '#',          align: 'left',  width: '32px',  render: r => <span className="text-gray-400 tabular-nums">{r.rank}</span> },
              { key: 'club',     label: 'Club',       align: 'left',  primary: true },
              { key: 'estValue', label: 'Est. Value', align: 'right', numeric: true, primary: true },
              { key: 'yoy',      label: 'YoY',        align: 'right', render: r => (
                <span className={`text-sm tabular-nums ${r.up ? 'text-emerald-700' : 'text-red-700'}`}>
                  {r.up ? '+' : ''}{r.yoy}
                </span>
              ) },
              { key: 'capacity', label: 'Capacity',   align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.capacity}</span> },
              { key: 'founded',  label: 'Founded',    align: 'right', hideOnMobile: true,
                render: r => <span className="text-sm text-gray-500 tabular-nums">{r.founded}</span> },
            ]}
            rows={CLUB_VALUATIONS}
            caption="Estimated club valuations, top of LPL"
          />
        </section>

        {/* ── P&L ────────────────────────────────────────────────── */}
        <section className="mb-12">
          <H2>Club P&L · 2025 season</H2>
          <LeagueTable
            columns={[
              { key: 'club',    label: 'Club',     align: 'left',  primary: true },
              { key: 'revenue', label: 'Revenue',  align: 'right', numeric: true },
              { key: 'wages',   label: 'Wage Bill',align: 'right',
                render: r => <span className="text-sm tabular-nums text-gray-700">{r.wages}</span> },
              { key: 'profit',  label: 'P&L',      align: 'right',
                render: r => (
                  <span className={`text-base font-semibold tabular-nums ${r.profitable ? 'text-emerald-700' : 'text-red-700'}`}>
                    {r.profit}
                  </span>
                )
              },
              { key: 'margin',  label: 'Margin',   align: 'right', hideOnMobile: true,
                render: r => (
                  <span className={`text-sm tabular-nums ${r.profitable ? 'text-emerald-700' : 'text-red-700'}`}>
                    {r.margin}
                  </span>
                )
              },
            ]}
            rows={CLUB_PNL}
            caption="Club profit and loss, 2025 season"
          />
        </section>

        {/* ── Stadium + Spend vs Perf ─────────────────────────────── */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">

          <div>
            <H2>{STADIUM_ECONOMICS.venue}</H2>
            <dl className="grid grid-cols-2 border-y border-gray-200 [&>*+*]:border-l [&>*+*]:border-gray-200 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(odd)]:border-l-0 [&>*:nth-child(3)]:border-l-0">
              <div className="px-4 py-3">
                <dt className="text-xs text-gray-500 mb-1">Capacity</dt>
                <dd className="text-[20px] font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.capacity}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-gray-500 mb-1">Utilisation</dt>
                <dd className="text-[20px] font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.utilisation}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-gray-500 mb-1">Renovation</dt>
                <dd className="text-md font-semibold text-gray-900">{STADIUM_ECONOMICS.renovation_phase} <span className="text-sm font-normal text-gray-500 tabular-nums">· {STADIUM_ECONOMICS.renovation_total}</span></dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-xs text-gray-500 mb-1">Break-even</dt>
                <dd className="text-[20px] font-bold text-gray-900 tabular-nums">{STADIUM_ECONOMICS.break_even_year}</dd>
              </div>
            </dl>
            <ul className="mt-4 space-y-2.5">
              {STADIUM_ECONOMICS.notes.map((n, i) => (
                <li key={i} className="text-base leading-relaxed text-gray-600 pl-3 border-l-2 border-gray-300">
                  {n}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <H2>Wage bill vs LPL points · 2025</H2>
            <div className="relative aspect-[5/3] border-l border-b border-gray-300 ml-10 mb-8 mt-4">
              {SPEND_VS_PERF.map(d => {
                const x = (d.spend / maxSpend) * 100;
                const y = (d.perf  / maxPerf)  * 100;
                return (
                  <div
                    key={d.club}
                    title={`${d.club}: $${d.spend}K wages · ${d.perf} pts`}
                    className={`absolute h-2.5 w-2.5 rounded-full -translate-x-1/2 translate-y-1/2 ${d.profitable ? 'bg-emerald-700' : 'bg-red-700'}`}
                    style={{ left: `${x}%`, bottom: `${y}%` }}
                  />
                );
              })}
              <span className="absolute -left-9 top-0 text-2xs uppercase tracking-wide text-gray-500">Pts</span>
              <span className="absolute -bottom-6 right-0 text-2xs uppercase tracking-wide text-gray-500">Wages →</span>
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-700" /> Profitable</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-700" /> Loss-making</span>
            </div>
          </div>

        </section>

        {/* ── Editorial ────────────────────────────────────────────── */}
        <section>
          <H2>In depth</H2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CLUB_FINANCE_EDITORIAL.map(e => (
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
