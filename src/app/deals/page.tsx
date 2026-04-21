import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Deals \u2014 M&A, FDI & Venture Funding in Liberia | TrueRate',
  description: 'A live register of mergers, acquisitions, foreign direct investment and venture funding rounds announced in Liberia, tracked against NIC filings and LRA disclosures.',
};

type DealStatus = 'Announced' | 'Closed' | 'Signed' | 'Under review' | 'Terminated';

const DEALS: {
  date: string;
  target: string;
  sector: string;
  value: number | null;
  valueDisplay: string;
  acquirer: string;
  acquirerCountry: string;
  type: 'M&A' | 'FDI' | 'Venture' | 'Concession';
  status: DealStatus;
  note: string;
}[] = [
  { date: 'Apr 16, 2026', target: 'Liberty Finance Liberia',    sector: 'Banking',         value: 48.0,  valueDisplay: '$48.0M', acquirer: 'Ecobank Transnational',   acquirerCountry: 'Togo',        type: 'M&A',        status: 'Signed',       note: 'Majority stake; subject to CBL fit-and-proper review' },
  { date: 'Apr 14, 2026', target: 'Farmerline Liberia',         sector: 'Agritech',        value: 6.2,   valueDisplay: '$6.2M',  acquirer: 'Partech Africa II',        acquirerCountry: 'France',       type: 'Venture',    status: 'Closed',       note: 'Series A; MEST Africa co-invest' },
  { date: 'Apr 11, 2026', target: 'Nimba Iron JV',              sector: 'Mining',          value: 210.0, valueDisplay: '$210M',  acquirer: 'HPX Commodities',          acquirerCountry: 'USA',          type: 'FDI',        status: 'Signed',       note: 'Multi-user rail access settlement filed with Ministry of Mines' },
  { date: 'Apr 09, 2026', target: 'MonroviaPay',                sector: 'Fintech',         value: 3.4,   valueDisplay: '$3.4M',  acquirer: 'Flourish Ventures',        acquirerCountry: 'USA',          type: 'Venture',    status: 'Closed',       note: 'Seed extension; LRA e-invoicing integration' },
  { date: 'Apr 02, 2026', target: 'Bong Palm Holdings',         sector: 'Agriculture',     value: null,  valueDisplay: 'n/d',    acquirer: 'Wilmar International',     acquirerCountry: 'Singapore',    type: 'M&A',        status: 'Under review',  note: 'Competition Commission review opened Apr 03' },
  { date: 'Mar 28, 2026', target: 'Freeport Logistics Corridor',sector: 'Logistics',       value: 82.0,  valueDisplay: '$82.0M', acquirer: 'Bolloré / MSC JV',         acquirerCountry: 'France',       type: 'Concession', status: 'Signed',       note: 'Port of Monrovia Phase II; 18-year concession' },
  { date: 'Mar 24, 2026', target: 'Sunbird Bioenergy Liberia',  sector: 'Energy',          value: null,  valueDisplay: 'n/d',    acquirer: 'Management / undisclosed', acquirerCountry: 'UK',            type: 'M&A',        status: 'Terminated',   note: 'Talks ended over land tenure and ESG clauses' },
  { date: 'Mar 19, 2026', target: 'HealthLib',                  sector: 'Healthtech',      value: 1.8,   valueDisplay: '$1.8M',  acquirer: 'Novastar Ventures',        acquirerCountry: 'Kenya',        type: 'Venture',    status: 'Closed',       note: 'Pre-A; Ministry of Health digital records pilot' },
  { date: 'Mar 14, 2026', target: 'Harbel Rubber Processing',   sector: 'Manufacturing',   value: 18.5,  valueDisplay: '$18.5M', acquirer: 'Firestone Liberia',         acquirerCountry: 'USA',          type: 'FDI',        status: 'Announced',    note: 'Downstream processing investment; LOI with Ministry of Commerce' },
  { date: 'Mar 09, 2026', target: 'Lofa Coffee Cooperative',    sector: 'Agriculture',     value: 2.1,   valueDisplay: '$2.1M',  acquirer: 'Olam Food Ingredients',    acquirerCountry: 'Singapore',    type: 'FDI',        status: 'Closed',       note: 'Outgrower aggregation and traceability facility' },
  { date: 'Mar 05, 2026', target: 'Ecobank Liberia (card unit)',sector: 'Banking',         value: 9.6,   valueDisplay: '$9.6M',  acquirer: 'Mastercard Foundation',    acquirerCountry: 'Canada',       type: 'Venture',    status: 'Signed',       note: 'Strategic investment; SME card-acquiring rollout' },
  { date: 'Feb 27, 2026', target: 'Grand Bassa Power',          sector: 'Energy',          value: 64.0,  valueDisplay: '$64.0M', acquirer: 'Africa50',                 acquirerCountry: 'Morocco',      type: 'FDI',        status: 'Signed',       note: '22 MW solar; PPA with LEC for 15 years' },
];

const SECTOR_TOTALS = [
  { sector: 'Mining',        value: 210.0, share: 46.1 },
  { sector: 'Logistics',     value:  82.0, share: 18.0 },
  { sector: 'Energy',        value:  64.0, share: 14.1 },
  { sector: 'Banking',       value:  57.6, share: 12.7 },
  { sector: 'Manufacturing', value:  18.5, share:  4.1 },
  { sector: 'Agritech',      value:   6.2, share:  1.4 },
  { sector: 'Fintech',       value:   3.4, share:  0.7 },
  { sector: 'Agriculture',   value:   2.1, share:  0.5 },
  { sector: 'Healthtech',    value:   1.8, share:  0.4 },
];

const QUARTERLY = [
  { q: 'Q1 2023', disclosed: 118, count: 9  },
  { q: 'Q2 2023', disclosed:  84, count: 7  },
  { q: 'Q3 2023', disclosed: 142, count: 11 },
  { q: 'Q4 2023', disclosed: 201, count: 13 },
  { q: 'Q1 2024', disclosed: 156, count: 10 },
  { q: 'Q2 2024', disclosed: 238, count: 14 },
  { q: 'Q3 2024', disclosed: 197, count: 12 },
  { q: 'Q4 2024', disclosed: 312, count: 17 },
  { q: 'Q1 2025', disclosed: 271, count: 15 },
  { q: 'Q2 2025', disclosed: 188, count: 11 },
  { q: 'Q3 2025', disclosed: 354, count: 16 },
  { q: 'Q4 2025', disclosed: 409, count: 19 },
  { q: 'Q1 2026', disclosed: 446, count: 12 },
];

const STATUS_STYLES: Record<DealStatus, string> = {
  'Announced':    'text-amber-700 bg-amber-50',
  'Signed':       'text-gray-700 bg-gray-100',
  'Closed':       'text-emerald-800 bg-emerald-50',
  'Under review': 'text-blue-700 bg-blue-50',
  'Terminated':   'text-red-700 bg-red-50',
};

export default function DealsPage() {
  const maxQ = Math.max(...QUARTERLY.map(q => q.disclosed));
  const disclosedTotal = DEALS.filter(d => d.value !== null).reduce((a, d) => a + (d.value ?? 0), 0);
  const undisclosed = DEALS.filter(d => d.value === null).length;

  return (
    <div className="bg-white min-h-screen">
      <main className="mx-auto max-w-[1180px] px-4 py-6">

        <div className="mb-8">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Deals' }]} />
        </div>

        {/* Hero / tombstone */}
        <header className="mb-10 border-b border-gray-200 pb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500 mb-3">Deals &middot; April 2026 register</p>
          <h1 className="text-[32px] sm:text-[44px] font-black leading-[1.08] tracking-[-0.015em] text-gray-900 mb-5 max-w-[840px]">
            A $210M mining settlement and Ecobank&rsquo;s bank buyout anchor the busiest April on record for Liberian dealmaking.
          </h1>
          <p className="text-[16px] leading-[1.55] text-gray-700 max-w-[700px] mb-6">
            TrueRate tracks every announced, signed or closed M&amp;A, FDI, venture and concession transaction with a Liberian counterparty. Twelve deals are live on this page, carrying <span className="font-semibold text-gray-900">${disclosedTotal.toFixed(1)}M</span> in disclosed value and two undisclosed transactions. The register is cross-checked against NIC filings, LRA disclosures and acquirer releases.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-gray-500">
            <span><span className="font-semibold text-gray-700">Martha Weah</span> &amp; <span className="font-semibold text-gray-700">Tope Akande</span></span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>Updated Apr 19, 2026, 16:40 GMT</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>Refreshes weekly</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link href="mailto:deals@truerate.com" className="underline decoration-dotted underline-offset-2 hover:text-gray-900">Submit a deal</Link>
          </div>
        </header>

        {/* Takeaways + methodology */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">What we&rsquo;re seeing</p>
            <ul className="space-y-3 text-[15px] leading-[1.55] text-gray-800">
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Mining accounts for 46% of disclosed value, driven by a single transaction &mdash; the HPX / ArcelorMittal multi-user rail settlement filed in Nimba.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Cross-border banking M&amp;A is back. Ecobank&rsquo;s move for Liberty Finance is the first Tier-1 bank deal since 2022; CBL fit-and-proper review runs to June.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Venture capital is concentrated in fintech and agritech, averaging $3.8M round size &mdash; roughly half the West African median for comparable stages.</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 mt-2 h-1 w-5 bg-gray-900" />
                <span>Two transactions were terminated in the review window: Sunbird Bioenergy (ESG and tenure) and an unannounced real-estate play at Red Light.</span>
              </li>
            </ul>
          </div>

          <aside className="lg:border-l lg:border-gray-200 lg:pl-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-3">Methodology</p>
            <p className="text-[13px] leading-[1.6] text-gray-700 mb-4">
              Transactions are recorded when at least one of the counterparties confirms the deal in writing, or a primary-source filing appears with the National Investment Commission, the Liberia Revenue Authority or the acquirer&rsquo;s home regulator.
            </p>
            <p className="text-[13px] leading-[1.6] text-gray-700">
              Values are in USD at the CBL period-average rate. Undisclosed transactions are recorded but excluded from sector totals. We do not include rumoured deals.
            </p>
            <p className="mt-4 text-[12px] text-gray-500">
              Corrections: <Link href="mailto:corrections@truerate.com" className="underline decoration-dotted underline-offset-2 hover:text-gray-900">corrections@truerate.com</Link>
            </p>
          </aside>
        </section>

        {/* Quarterly bars */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Figure 1</p>
              <h2 className="text-[20px] font-black text-gray-900 mt-1">Disclosed deal value, by quarter</h2>
            </div>
            <span className="text-[11px] text-gray-500">USD millions &middot; deals with disclosed value</span>
          </div>

          <div className="flex items-end gap-1.5 h-[180px] border-b border-gray-200 pb-0">
            {QUARTERLY.map(q => {
              const h = (q.disclosed / maxQ) * 100;
              const highlight = q.q === 'Q1 2026';
              return (
                <div key={q.q} className="flex-1 flex flex-col items-center justify-end gap-1 group">
                  <span className="text-[10px] tabular-nums text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{q.disclosed}</span>
                  <div className={`w-full ${highlight ? 'bg-gray-900' : 'bg-gray-300 group-hover:bg-gray-500'} transition-colors`} style={{ height: `${h}%` }} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {QUARTERLY.map(q => (
              <span key={q.q} className="flex-1 text-center text-[10px] text-gray-500 tabular-nums truncate">{q.q.replace(' 20', ' ').replace('Q1 ', 'Q1\u200A').replace('Q2 ', 'Q2\u200A').replace('Q3 ', 'Q3\u200A').replace('Q4 ', 'Q4\u200A')}</span>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-gray-500 leading-relaxed max-w-[760px]">
            Q1 2026 (highlighted) is the highest quarterly reading since we began tracking in 2023. The jump is attributable mostly to a single $210M mining settlement; underlying deal count (12) is in line with the trailing four-quarter average.
          </p>
        </section>

        {/* Main deal register */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Table 1</p>
              <h2 className="text-[20px] font-black text-gray-900 mt-1">Live deal register</h2>
            </div>
            <span className="text-[11px] text-gray-500">{DEALS.length} transactions &middot; {undisclosed} undisclosed</span>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-[13px] border-t border-gray-200">
              <thead>
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pr-3 text-left whitespace-nowrap">Date</th>
                  <th className="py-3 px-3 text-left">Target</th>
                  <th className="py-3 px-3 text-left hidden md:table-cell">Acquirer / investor</th>
                  <th className="py-3 px-3 text-left hidden sm:table-cell">Type</th>
                  <th className="py-3 px-3 text-right">Value</th>
                  <th className="py-3 pl-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DEALS.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 pr-3 tabular-nums text-gray-500 whitespace-nowrap align-top">{d.date}</td>
                    <td className="py-3 px-3 align-top">
                      <p className="font-semibold text-gray-900">{d.target}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{d.sector} &middot; <span className="text-gray-400">{d.note}</span></p>
                    </td>
                    <td className="py-3 px-3 text-gray-700 hidden md:table-cell align-top">
                      <p>{d.acquirer}</p>
                      <p className="text-[11px] text-gray-500">{d.acquirerCountry}</p>
                    </td>
                    <td className="py-3 px-3 text-gray-700 hidden sm:table-cell align-top">{d.type}</td>
                    <td className={`py-3 px-3 text-right tabular-nums font-semibold align-top ${d.value === null ? 'text-gray-400' : 'text-gray-900'}`}>{d.valueDisplay}</td>
                    <td className="py-3 pl-3 text-right align-top">
                      <span className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[d.status]}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] text-gray-500 max-w-[760px] leading-relaxed">
            &ldquo;n/d&rdquo; indicates undisclosed value. Status reflects the most recent confirmed stage as of the update timestamp at the top of this page.
          </p>
        </section>

        {/* Sector breakdown */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between border-t border-gray-900 pt-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">Figure 2</p>
              <h2 className="text-[20px] font-black text-gray-900 mt-1">Disclosed value by sector</h2>
            </div>
            <span className="text-[11px] text-gray-500">Q1 2026 &middot; share of total</span>
          </div>

          <div className="space-y-2.5">
            {SECTOR_TOTALS.map(s => (
              <div key={s.sector} className="grid grid-cols-[120px_1fr_120px] sm:grid-cols-[160px_1fr_140px] items-center gap-4">
                <span className="text-[13px] text-gray-900 truncate">{s.sector}</span>
                <div className="relative h-5 bg-gray-50">
                  <div className="absolute inset-y-0 left-0 bg-gray-900" style={{ width: `${s.share}%` }} />
                </div>
                <div className="text-right text-[13px] tabular-nums">
                  <span className="font-semibold text-gray-900">${s.value.toFixed(1)}M</span>
                  <span className="text-gray-500 ml-2">{s.share.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-gray-500 leading-relaxed max-w-[760px]">
            Share calculated on the ${disclosedTotal.toFixed(1)}M disclosed-value base. Excludes two undisclosed transactions. Source: TrueRate Deal Register; NIC filings.
          </p>
        </section>

        {/* Related reporting */}
        <section className="mb-10 border-t border-gray-900 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-4">Related reporting</p>
          <div className="divide-y divide-gray-100">
            {[
              { title: "Inside the HPX / ArcelorMittal rail settlement: what the $210M actually buys.",                    by: 'Martha Weah',   src: 'TrueRate',  date: 'Apr 12, 2026' },
              { title: "Ecobank&rsquo;s Liberty bid is a test of the CBL\u2019s post-2022 fit-and-proper regime.",            by: 'Tope Akande',   src: 'TrueRate',  date: 'Apr 17, 2026' },
              { title: "West African VC in Q1: cheque sizes are smaller, and Liberia is part of the reason why.",          by: 'Dele Olufemi',  src: 'Reuters',   date: 'Apr 08, 2026' },
              { title: "Why the Sunbird deal fell apart: a primer on land tenure clauses in Liberian JVs.",                 by: 'Edwin Flomo',   src: 'TrueRate',  date: 'Mar 30, 2026' },
            ].map((s, i) => (
              <Link key={i} href="/news" className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 no-underline">
                <h3 className="text-[15px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 flex-1" dangerouslySetInnerHTML={{ __html: s.title }} />
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

        <div className="mt-12 pt-6 border-t border-gray-200 text-[12px] text-gray-500 leading-relaxed max-w-[760px]">
          <p>
            <span className="font-semibold text-gray-700">Licensing.</span> Tables and charts on this page may be reproduced with attribution to TrueRate Deal Register. Bulk and historical data feed: <Link href="mailto:data@truerate.com" className="underline decoration-dotted underline-offset-2 hover:text-gray-900">data@truerate.com</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
