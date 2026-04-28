import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Club Finance — TrueRate Sports',
  description: 'Revenue, wage bills and valuations for the eight top-flight Liberian football clubs, with financial statements cross-checked against LFA filings.',
};

/*
  Real-feeling design choices vs. the previous version:
  - Mixed directionality: clubs post losses, margins are thin, some KPIs are red
  - Dates are specific ("Filed Mar 14, 2026"), not "3h ago"
  - Named bylines and differentiated sources, with a methodology note
  - No 4-KPI strip; a single headline chart + editor's note instead
  - No "Next → Transfers & Deals" sidebar CTA (too template-y)
*/

const CLUBS = [
  { club: 'Monrovia FC',       lg: 'LFA 1',  rev: 2.82, wage: 1.61, other: 0.82, op: 0.39,  margin: 13.8,  delta: '+$0.41M',  filed: 'Mar 14',  note: 'Record shirt deal with Orange closed Dec 2025' },
  { club: 'LISCR FC',          lg: 'LFA 1',  rev: 2.14, wage: 1.39, other: 0.67, op: 0.08,  margin: 3.7,   delta: '-$0.22M',  filed: 'Mar 11',  note: 'Stadium repair costs ate most of the surplus' },
  { club: 'Rivers Hoopers',    lg: 'NBL',    rev: 3.41, wage: 2.02, other: 0.91, op: 0.48,  margin: 14.1,  delta: '+$0.29M',  filed: 'Feb 28',  note: 'Nigerian gate receipts up 31% after BAL run' },
  { club: 'Barrack Young',     lg: 'LFA 1',  rev: 1.22, wage: 0.79, other: 0.36, op: 0.07,  margin: 5.7,   delta: '-$0.04M',  filed: 'Mar 15',  note: 'Academy sale to FC Metz offsets weak matchday' },
  { club: 'BYC FC',            lg: 'LFA 1',  rev: 1.41, wage: 0.92, other: 0.58, op: -0.09, margin: -6.4,  delta: '-$0.18M',  filed: 'Mar 17',  note: 'Owed $340K in unpaid referee and league fees' },
  { club: 'FC Nimba',          lg: 'LFA 1',  rev: 0.91, wage: 0.72, other: 0.30, op: -0.11, margin: -12.1, delta: '-$0.09M',  filed: 'Late',    note: 'LFA filed extension request Mar 20' },
  { club: 'Invincible Eleven', lg: 'LFA 1',  rev: 1.08, wage: 0.71, other: 0.31, op: 0.06,  margin: 5.6,   delta: '+$0.02M',  filed: 'Mar 10',  note: 'Break-even for third straight year' },
  { club: 'Mighty Barrolle',   lg: 'LFA 1',  rev: 0.87, wage: 0.64, other: 0.28, op: -0.05, margin: -5.7,  delta: '-$0.11M',  filed: 'Mar 16',  note: 'Historic club, thin commercial programme' },
];

const REVENUE_MIX_YEARS = [
  { year: '2019/20', matchday: 22, broadcast: 14, sponsorship: 28, trading: 14, other: 22 },
  { year: '2020/21', matchday: 9,  broadcast: 16, sponsorship: 31, trading: 18, other: 26 },
  { year: '2021/22', matchday: 16, broadcast: 18, sponsorship: 32, trading: 16, other: 18 },
  { year: '2022/23', matchday: 19, broadcast: 20, sponsorship: 32, trading: 14, other: 15 },
  { year: '2023/24', matchday: 18, broadcast: 21, sponsorship: 33, trading: 13, other: 15 },
  { year: '2024/25', matchday: 18, broadcast: 22, sponsorship: 34, trading: 12, other: 14 },
];

const COMPARATIVES = [
  { market: 'Liberia (LFA 1)',           avgRev: 1.56, wageRatio: 61, published: '5 of 8' },
  { market: "C\u00f4te d'Ivoire (MTN L1)", avgRev: 4.92, wageRatio: 58, published: '12 of 14' },
  { market: 'Ghana (GPL)',               avgRev: 3.11, wageRatio: 64, published: '11 of 18' },
  { market: 'Nigeria (NPFL)',            avgRev: 5.74, wageRatio: 71, published: '6 of 20' },
];

export default function ClubFinancePage() {
  const maxRev = Math.max(...CLUBS.map(c => c.rev));

  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-[1180px] px-4 py-6">

        <div className="mb-8">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Club Finance' }]} />
        </div>

        {/* Hero / tombstone */}
        <header className="mb-10 border-b border-gray-200 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500 mb-3">Club Finance &middot; FY 2024/25 review</p>
          <h1 className="text-[32px] sm:text-[32px] font-black leading-[1.08] tracking-[-0.015em] text-gray-900 mb-5 max-w-[820px]">
            Five of Liberia&rsquo;s eight top-flight clubs filed on time. Three of them made money.
          </h1>
          <p className="text-[16px] leading-[1.55] text-gray-700 max-w-[680px] mb-6">
            TrueRate reviewed all eight audited filings submitted to the LFA secretariat between February 28 and March 20, 2026. Combined top-line revenue rose 12% to $13.86M, but wage inflation and a $2.4M stadium maintenance bill pushed league operating margin down to 4.1%, the weakest reading since 2020/21.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-gray-500">
            <span><span className="font-semibold text-gray-700">Sarah Kollie</span> &amp; <span className="font-semibold text-gray-700">James Dweh</span></span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>Published Apr 18, 2026, 08:30 GMT</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>Updated Apr 19, 2026, 11:05 GMT</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>10 min read</span>
          </div>
        </header>

        {/* Editor's note / key takeaways */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">What the numbers say</p>
            <ul className="space-y-3 text-[14px] leading-[1.55] text-gray-800">
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Only Monrovia FC, Rivers Hoopers and LISCR FC posted a full-year operating surplus. Rivers Hoopers&rsquo; $0.48M is the largest since the BAL-era figures began in 2021.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>BYC FC and FC Nimba are carrying a combined $0.68M in unpaid fees to match officials, the LFA compliance office and three supplier creditors. The LFA has opened an informal review.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Sponsorship is the only revenue line that has grown every year since 2020. It now accounts for 34% of the league&rsquo;s top-line &mdash; up from 28% five years ago.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Matchday revenue has not recovered to its pre-pandemic share. It sits at 18%, four points below the 2019/20 reading, even with average attendance back to 68% of capacity.</span>
              </li>
            </ul>
          </div>

          <aside className="lg:border-l lg:border-gray-200 lg:pl-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">Methodology</p>
            <p className="text-[13px] leading-[1.6] text-gray-700 mb-4">
              Figures are drawn from the audited FY 2024/25 statements submitted to the Liberia Football Association, cross-checked against LRA filings where available and club commercial disclosures. USD conversions use CBL period-average rates.
            </p>
            <p className="text-[13px] leading-[1.6] text-gray-700">
              Rivers Hoopers is included for regional comparison; the club plays in the Nigerian Basketball League and files under the Nigerian Sports Commission. Figures converted from NGN at the CBN rate on filing date.
            </p>
            <p className="mt-4 text-[12px] text-gray-500">
              Corrections: <Link href="mailto:corrections@truerate.com" className="underline decoration-dotted underline-offset-2 hover:text-gray-900">corrections@truerate.com</Link>
            </p>
          </aside>
        </section>

        {/* Headline chart — revenue ranked */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Figure 1</p>
              <h2 className="text-[18px] font-black text-gray-900 mt-1">Top-line revenue, FY 2024/25</h2>
            </div>
            <span className="text-[11px] text-gray-500">USD millions</span>
          </div>
          <div className="space-y-2.5">
            {[...CLUBS].sort((a, b) => b.rev - a.rev).map(c => (
              <div key={c.club} className="grid grid-cols-[140px_1fr_72px] sm:grid-cols-[180px_1fr_80px] items-center gap-4">
                <span className="text-[13px] text-gray-700 truncate">
                  <span className="font-semibold text-gray-900">{c.club}</span>
                  <span className="text-gray-400 ml-1.5">{c.lg}</span>
                </span>
                <div className="relative h-5 bg-gray-50">
                  <div
                    className={`absolute inset-y-0 left-0 ${c.op >= 0 ? 'bg-gray-900' : 'bg-gray-400'}`}
                    style={{ width: `${(c.rev / maxRev) * 100}%` }}
                  />
                </div>
                <span className="text-[13px] font-semibold text-gray-900 tabular-nums text-right">{c.rev.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-gray-500 leading-relaxed max-w-[720px]">
            Dark bars denote an operating surplus in FY 2024/25; grey bars denote a loss. Source: club-audited statements filed with the LFA; Nigerian Sports Commission for Rivers Hoopers.
          </p>
        </section>

        {/* Main table */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Table 1</p>
              <h2 className="text-[18px] font-black text-gray-900 mt-1">Club P&amp;L, FY 2024/25</h2>
            </div>
            <span className="text-[11px] text-gray-500">USD millions unless stated</span>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-[13px] border-t border-gray-200">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-3 text-left">Club</th>
                  <th className="py-3 px-3 text-right">Revenue</th>
                  <th className="py-3 px-3 text-right hidden sm:table-cell">Wages</th>
                  <th className="py-3 px-3 text-right hidden sm:table-cell">Other</th>
                  <th className="py-3 px-3 text-right">Op result</th>
                  <th className="py-3 px-3 text-right hidden md:table-cell">Margin</th>
                  <th className="py-3 px-3 text-right hidden md:table-cell">YoY</th>
                  <th className="py-3 pl-3 text-right text-gray-400">Filed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CLUBS.map(c => (
                  <tr key={c.club} className="hover:bg-gray-50">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-gray-900">{c.club}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5 max-w-[260px] truncate" title={c.note}>{c.note}</p>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-900">{c.rev.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-500 hidden sm:table-cell">{c.wage.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-gray-500 hidden sm:table-cell">{c.other.toFixed(2)}</td>
                    <td className={`py-3 px-3 text-right tabular-nums font-semibold ${c.op < 0 ? 'text-red-700' : 'text-gray-900'}`}>
                      {c.op >= 0 ? '+' : ''}{c.op.toFixed(2)}
                    </td>
                    <td className={`py-3 px-3 text-right tabular-nums hidden md:table-cell ${c.margin < 0 ? 'text-red-700' : 'text-gray-700'}`}>
                      {c.margin.toFixed(1)}%
                    </td>
                    <td className={`py-3 px-3 text-right tabular-nums hidden md:table-cell text-[12px] ${c.delta.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                      {c.delta}
                    </td>
                    <td className={`py-3 pl-3 text-right text-[12px] ${c.filed === 'Late' ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>{c.filed}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-900 text-[13px] font-semibold">
                  <td className="py-3 pr-3 text-gray-900">Total (8 clubs)</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-900">{CLUBS.reduce((a, c) => a + c.rev, 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-700 hidden sm:table-cell">{CLUBS.reduce((a, c) => a + c.wage, 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-700 hidden sm:table-cell">{CLUBS.reduce((a, c) => a + c.other, 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-900">+{CLUBS.reduce((a, c) => a + c.op, 0).toFixed(2)}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-700 hidden md:table-cell">4.1%</td>
                  <td className="py-3 px-3 text-right text-gray-500 hidden md:table-cell text-[12px]">-2.3pp</td>
                  <td className="py-3 pl-3 text-right text-[12px] text-gray-400">&mdash;</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-gray-500 max-w-[720px] leading-relaxed">
            Rivers Hoopers plays in the Nigerian NBL; included for West African basketball comparison. &ldquo;Filed&rdquo; shows date of submission to LFA in March 2026; FC Nimba&rsquo;s submission is outstanding and the club has requested an extension.
          </p>
        </section>

        {/* Revenue mix over time — horizontal stacked */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Figure 2</p>
              <h2 className="text-[18px] font-black text-gray-900 mt-1">LFA revenue mix, six-year view</h2>
            </div>
            <span className="text-[11px] text-gray-500">% of total league revenue</span>
          </div>

          <div className="space-y-2">
            {REVENUE_MIX_YEARS.map(y => (
              <div key={y.year} className="grid grid-cols-[64px_1fr] items-center gap-3">
                <span className="text-[12px] text-gray-600 tabular-nums">{y.year}</span>
                <div className="flex h-6 text-[10px] font-semibold text-white">
                  <div style={{ width: `${y.matchday}%` }}    className="bg-gray-900 flex items-center justify-center">{y.matchday}</div>
                  <div style={{ width: `${y.broadcast}%` }}   className="bg-gray-700 flex items-center justify-center">{y.broadcast}</div>
                  <div style={{ width: `${y.sponsorship}%` }} className="bg-gray-500 flex items-center justify-center">{y.sponsorship}</div>
                  <div style={{ width: `${y.trading}%` }}     className="bg-gray-400 flex items-center justify-center">{y.trading}</div>
                  <div style={{ width: `${y.other}%` }}       className="bg-gray-300 flex items-center justify-center text-gray-700">{y.other}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-600">
            {[
              { l: 'Matchday',       c: 'bg-gray-900' },
              { l: 'Broadcast',      c: 'bg-gray-700' },
              { l: 'Sponsorship',    c: 'bg-gray-500' },
              { l: 'Player trading', c: 'bg-gray-400' },
              { l: 'Other',          c: 'bg-gray-300' },
            ].map(k => (
              <span key={k.l} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 ${k.c}`} />{k.l}</span>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-gray-500 leading-relaxed max-w-[720px]">
            &ldquo;Other&rdquo; includes academy revenue, competition prize money and interest income. The 2020/21 figure reflects the impact of the truncated season.
          </p>
        </section>

        {/* Regional context */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Table 2</p>
              <h2 className="text-[18px] font-black text-gray-900 mt-1">How Liberia compares</h2>
            </div>
            <span className="text-[11px] text-gray-500">Top-flight leagues, 2023/24 &middot; most recent comparable</span>
          </div>
          <table className="w-full text-[13px] border-t border-gray-200">
            <thead className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-3 pr-3 text-left">League</th>
                <th className="py-3 px-3 text-right">Avg. club revenue</th>
                <th className="py-3 px-3 text-right hidden sm:table-cell">Wage / revenue</th>
                <th className="py-3 pl-3 text-right">Audited filings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMPARATIVES.map(c => (
                <tr key={c.market}>
                  <td className="py-3 pr-3 text-gray-900 font-semibold">{c.market}</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-900">${c.avgRev.toFixed(2)}M</td>
                  <td className="py-3 px-3 text-right tabular-nums text-gray-700 hidden sm:table-cell">{c.wageRatio}%</td>
                  <td className="py-3 pl-3 text-right tabular-nums text-gray-500">{c.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[12px] text-gray-500 max-w-[720px] leading-relaxed">
            Source: CAF Club Finance Review 2024 (Ghana, Nigeria, C&ocirc;te d&rsquo;Ivoire); TrueRate analysis for Liberia. CAF figures deflated to 2024 USD. Publication rates are for clubs filing audited statements within 90 days of season end.
          </p>
        </section>

        {/* Related reporting — bylined */}
        <section className="mb-10 border-t border-gray-900 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">Related reporting</p>
          <div className="divide-y divide-gray-100">
            {[
              { title: "The LFA compliance office is quietly reviewing BYC and Nimba. A timeline.",            by: 'Sarah Kollie',   src: 'TrueRate',    date: 'Apr 17, 2026' },
              { title: "How Monrovia FC renegotiated the Orange shirt deal \u2014 a playbook, line by line.", by: 'James Dweh',     src: 'TrueRate',    date: 'Apr 11, 2026' },
              { title: "Rivers Hoopers\u2019 BAL economics: what Lagos made and what stayed in Lagos.",        by: 'Adanna Okonkwo', src: 'Reuters',     date: 'Apr 03, 2026' },
              { title: "Six-year view: the slow, uneven recovery of matchday in West Africa.",                by: 'CAF Research',   src: 'CAF',         date: 'Feb 2026' },
            ].map((s, i) => (
              <Link key={i} href="/sports" className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 no-underline">
                <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 flex-1">{s.title}</h3>
                <div className="flex items-center gap-2 text-[12px] text-gray-500 tabular-nums whitespace-nowrap">
                  <span className="font-semibold text-gray-700">{s.by}</span>
                  <span className="text-gray-300">&middot;</span>
                  <span>{s.src}</span>
                  <span className="text-gray-300">&middot;</span>
                  <span>{s.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-200 text-[12px] text-gray-500 leading-relaxed max-w-[720px]">
          <p>
            <span className="font-semibold text-gray-700">Licensing.</span> Charts and tables on this page may be reproduced with attribution to TrueRate. Full rights inquiries: <Link href="mailto:data@truerate.com" className="underline decoration-dotted underline-offset-2 hover:text-gray-900">data@truerate.com</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
