/**
 * Markets page — Liberian physical markets, sectors, and daily commerce.
 */

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 3600;

export default function MarketsPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8 pb-24">

      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Markets' }]} />


      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-x-16">

        {/* ── MAIN CONTENT ── */}
        <div>

          {/* ── Major Markets ── */}
          <section className="mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-0">Liberia&apos;s Major Markets</h2>

            <div className="mt-0 divide-y divide-white/[0.07]">
              {[
                {
                  name: 'Duala Market',
                  location: 'Congo Town, Monrovia',
                  note: 'Largest market in Liberia',
                  desc: "Duala is where you go when you need something and don't know where else to look. The market runs in zones — Chinese shops selling electronics and household goods on one side, fabric vendors and market women on the other, spare parts dealers in between. Prices are in LRD and USD depending on who you're buying from. Everything is negotiable. It opens early and it closes late.",
                  goods: 'Electronics, fabrics, food, household goods, spare parts, clothing, building materials',
                },
                {
                  name: 'Redlight Market',
                  location: 'Paynesville, Monrovia',
                  note: 'Busiest junction market',
                  desc: "Redlight is a junction, not just a market — but the trading never stops. Keke line up, taxis drop off, and vendors sell from tables, carts, and their hands. You can buy a used phone, a bag of pepper, a school uniform, and a SIM card without walking more than 100 meters. Most transactions are cash. Most sellers know their regulars by name.",
                  goods: 'Secondhand clothing, produce, mobile accessories, cosmetics, food, household goods',
                },
                {
                  name: 'Waterside Market',
                  location: 'Broad Street, Monrovia',
                  note: 'Oldest market in Monrovia',
                  desc: "Waterside sits just off Broad Street, close enough to the port that you can tell when a container ship has come in — the goods show up in the stalls within days. Lebanese traders have been here for generations. You'll find fresh fish brought in from the waterfront, fabric sellers side by side, and traders from Guinea and Sierra Leone who come regularly for the prices.",
                  goods: 'Imports, fresh produce, fabrics, port goods, cross-border West African trade',
                },
              ].map((m, i) => (
                <div key={i} className="py-8">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <h3 className="text-[22px] font-black text-white">{m.name}</h3>
                    <span className="text-[12px] text-gray-500">{m.location}</span>
                  </div>
                  <p className="text-[11px] text-brand-accent font-semibold uppercase tracking-wide mb-4">{m.note}</p>
                  <p className="text-[15px] text-gray-300 leading-[1.85] mb-4">{m.desc}</p>
                  <p className="text-[12px] text-gray-500"><span className="text-gray-400 font-medium">Primary goods:</span> {m.goods}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Sectors ── */}
          <section className="mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-6">Sectors Driving Daily Commerce</h2>

            <div className="divide-y divide-white/[0.07]">
              {[
                {
                  sector: 'Fashion & Textiles',
                  stat: '~$180M annual sector value',
                  desc: "From Lappa fabric vendors at Duala and Waterside to secondhand bale importers supplying Redlight, fashion is one of Liberia's most active informal sectors. Thousands of market tailors, Chinese fabric importers, and local designers work across every market in Monrovia.",
                },
                {
                  sector: 'Technology & Mobile',
                  stat: '68% mobile money adoption',
                  desc: "Mobile phones, accessories, and repair shops are everywhere. Airtime resellers, data bundle hawkers, and used electronics stalls stretch from Carey Street to Redlight. Mobile money has changed how traders receive payments and manage cash.",
                },
                {
                  sector: 'Agriculture & Food',
                  stat: '~40% of informal employment',
                  desc: "Cassava, pepper, palm butter, and rice — Liberia's staple food economy runs through its markets every day. Produce flows from Bong, Lofa, Nimba, and Margibi into Monrovia's central markets. Prices shift with the rains, Guinea border trade, and the cost of transport.",
                },
                {
                  sector: 'Transportation',
                  stat: '15,000+ keke operators in Monrovia',
                  desc: "Yellow taxis, keke (motorbikes), and minibuses connect traders to markets and markets to customers. Without them, goods don't move. Fuel prices, road conditions, and permit costs all feed directly into what vendors charge at the stall.",
                },
                {
                  sector: 'Trading & Import',
                  stat: '$600M+ goods cleared annually',
                  desc: "Chinese, Lebanese, Indian, and Liberian traders import through Freeport of Monrovia. What lands at the port hits Waterside, Duala, and Chicken Soup Factory within days. Import duties, container costs, and LRD/USD rates determine what traders pay.",
                },
                {
                  sector: 'Services & Finance',
                  stat: 'LRD 2.1B in daily mobile transfers',
                  desc: "Mobile money, informal moneylenders, and market-side credit have become part of how trade works at every major market. Most transactions are cash or mobile money — the formal banking system is rarely part of the picture at the stall level.",
                },
              ].map(({ sector, stat, desc }, i) => (
                <div key={i} className="py-6 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
                  <div className="pt-0.5">
                    <p className="text-[14px] font-bold text-white mb-1">{sector}</p>
                    <p className="text-[11px] text-gray-500">{stat}</p>
                  </div>
                  <p className="text-[14px] text-gray-400 leading-[1.8]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── What Moves Market Prices ── */}
          <section className="mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-6">What Moves Market Prices</h2>

            <div className="divide-y divide-white/[0.07]">
              {[
                { factor: 'LRD / USD Rate',      impact: 'Direct',      desc: 'Most imported goods are priced in USD. When the LRD weakens, market prices rise almost immediately — traders adjust within days, sometimes hours.' },
                { factor: 'Fuel & Transport',    impact: 'Direct',      desc: 'Petrol prices affect keke fares, truck freight, and delivery costs. A fuel price increase reaches market stall prices within a week across Monrovia.' },
                { factor: 'Guinea Border Trade', impact: 'Significant', desc: 'Vegetables, palm oil, and staples cross from Guinea daily. Border closures, rain, or security issues in Lofa and Nimba rapidly tighten Monrovia supply.' },
                { factor: 'Freeport Throughput', impact: 'Significant', desc: 'Container backlogs delay Chinese and Asian imports by 1–3 weeks, creating shortages and price spikes at Duala and Waterside.' },
                { factor: 'Rainy Season',        impact: 'Seasonal',    desc: 'June–October rains flood market stalls, damage roads, and cut upcountry supply. Produce prices rise sharply in this period every year.' },
                { factor: 'School Calendar',     impact: 'Seasonal',    desc: 'Back-to-school months drive uniform, fabric, and stationery demand. Fashion and textile sectors peak in August and January.' },
                { factor: 'Government Payroll',  impact: 'Cyclical',    desc: 'Civil servant payday (end of month) creates a predictable surge in spending. Traders at Duala and Redlight report their highest single-day sales on pay weeks.' },
                { factor: 'Mobile Money Float',  impact: 'Systemic',    desc: 'When Orange Money or Lonestar Cash go down, market trade slows immediately. Many traders no longer carry large amounts of physical cash.' },
              ].map((f, i) => (
                <div key={i} className="py-5 grid grid-cols-1 sm:grid-cols-[180px_90px_1fr] gap-x-6 gap-y-1">
                  <p className="text-[14px] font-semibold text-white">{f.factor}</p>
                  <p className={`text-[11px] font-bold uppercase tracking-wide self-center ${
                    f.impact === 'Direct'      ? 'text-red-400' :
                    f.impact === 'Significant' ? 'text-orange-400' :
                    f.impact === 'Seasonal'    ? 'text-sky-400' :
                    'text-purple-400'
                  }`}>{f.impact}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Market News ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">Market News</h2>
              <Link href="/news" className="text-[12px] text-gray-500 hover:text-white transition-colors no-underline">All stories →</Link>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {[
                { tag: 'Trade Policy',    date: 'Apr 14',  title: 'Fashion import tariffs are reshaping how traders source fabric at Waterside and Duala',                             desc: 'New CBL guidelines on foreign currency and revised import duties are pushing fabric traders toward local sourcing. Lappa demand is up 22% year-on-year.' },
                { tag: 'Electronics',    date: 'Apr 12',  title: 'Redlight vendors report 20% drop in electronics sales as Chinese imports slow through the Freeport',             desc: 'Port congestion and a weaker Yuan-LRD spread are extending restock timelines by 3–4 weeks. Stall owners say prices are up but inventory is thin.' },
                { tag: 'Transportation', date: 'Apr 10',  title: "Keke riders push for formal recognition and licensing reform across Greater Monrovia",                            desc: 'An estimated 15,000 keke operators are calling for a unified registration system, third-party insurance, and protection from police harassment.' },
                { tag: 'Mobile Finance', date: 'Apr 8',   title: 'Mobile money adoption reaches 68% among Duala market traders, new CBL survey shows',                             desc: 'Orange Money and Lonestar Cash now handle the majority of wholesale transactions at Duala. Cash is still dominant at retail stalls, but the shift is accelerating.' },
                { tag: 'Agriculture',    date: 'Apr 6',   title: 'Produce prices spike at Waterside as cross-border supply from Guinea slows',                                      desc: 'Pepper, cassava leaf, and bitter ball prices rose 15–30% in two weeks. Guinea border crossing volumes are down 18% compared to the same period last year.' },
                { tag: 'Infrastructure', date: 'Apr 4',   title: 'Duala traders petition government for covered stalls ahead of rainy season — again',                             desc: 'Hundreds of traders lose goods every rainy season to flooding. A 2022 covered market pledge remains unfulfilled. Traders say the losses are unsustainable.' },
              ].map((item, i) => (
                <Link key={i} href="/news" className="group block py-5 hover:opacity-75 transition-opacity no-underline">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-brand-accent">{item.tag}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-[11px] text-gray-500">{item.date}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white leading-snug mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* ── SIDEBAR ── */}
        <aside className="mt-0 space-y-12 lg:border-l lg:border-white/[0.06] lg:pl-10">

          {/* Exchange Rates */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-0">LRD Exchange Rates</h2>
            <p className="text-[11px] text-gray-500 mt-1 mb-4 leading-relaxed">Prices at Liberian markets are quoted in both LRD and USD. Rate movements affect every transaction.</p>
            <div className="divide-y divide-white/[0.07]">
              {[
                { pair: 'USD / LRD', rate: '192.50', change: '+0.65%', up: true  },
                { pair: 'EUR / LRD', rate: '209.85', change: '-0.44%', up: false },
                { pair: 'GBP / LRD', rate: '243.15', change: '+0.87%', up: true  },
                { pair: 'GHS / LRD', rate: '13.20',  change: '-1.78%', up: false },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <p className="text-[13px] font-semibold text-white">{r.pair}</p>
                  <div className="text-right">
                    <p className="text-[15px] font-black text-white tabular-nums">{r.rate}</p>
                    <p className={`text-[11px] font-semibold tabular-nums ${r.up ? 'text-emerald-400' : 'text-red-400'}`}>{r.up ? '▲' : '▼'} {r.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More Markets */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent mb-4">More Markets</h2>
            <div className="divide-y divide-white/[0.07]">
              {[
                { name: 'Carey Street',         location: 'Central Monrovia',     note: 'Electronics, phones, laptops, TVs — new and used. Stock comes through the Freeport from China and Dubai. Buy, sell, or repair on the same block.' },
                { name: 'Clara Town',           location: 'Clara Town, Monrovia', note: 'Auto parts, mechanics, and used components. Tyres, engines, batteries — mostly imported, some pulled from wrecked vehicles.' },
                { name: 'Chicken Soup Factory', location: 'Central Monrovia',     note: 'Electronics, Chinese goods, wholesale trade. Smaller traders stock up here before selling at Duala or Redlight.' },
                { name: 'Gardnesville Market',  location: 'Gardnesville',         note: 'Produce from Margibi and Montserrado farms. Much of the cassava and greens sold in Monrovia passes through here first.' },
                { name: 'Kakata Market',        location: 'Margibi County',       note: 'Main market town between Monrovia and the interior. Rubber workers, farmers, and traders all mix.' },
                { name: 'Gbarnga Market',       location: 'Bong County',          note: "Central Liberia's busiest market town. Agricultural goods and supplies heading to the mining counties all pass through." },
                { name: 'Buchanan Market',      location: 'Grand Bassa County',   note: 'Port city. Fresh fish, timber, imported goods. ArcelorMittal workers and supply vendors are regulars.' },
                { name: 'Voinjama Market',      location: 'Lofa County',          note: "Borders Guinea. Cross-border traders from Macenta and N'Zérékoré. Cocoa, coffee, and rice move both ways." },
                { name: 'Harper Market',        location: 'Maryland County',      note: "Southeast corner, near Côte d'Ivoire. Fish is the main trade. Palm oil and Ivorian cross-border goods also move regularly." },
                { name: 'Sanniquellie Market',  location: 'Nimba County',         note: 'Mining country. Market shaped by ArcelorMittal workers and contractors. Guinea and Côte d\'Ivoire both nearby.' },
              ].map((m, i) => (
                <div key={i} className="py-4">
                  <p className="text-[13px] font-bold text-white">{m.name}</p>
                  <p className="text-[11px] text-brand-accent mb-1">{m.location}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{m.note}</p>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </main>
  );
}
