import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';

export const metadata: Metadata = {
  title: 'Sponsorship — TrueRate Sports',
  description: 'Shirt, kit, federation, and athlete sponsorship deals across Liberia and West African sport \u2014 values, terms, and what\u2019s next.',
};

const HERO = {
  title: "Shirt sponsorship in West African football: the 10 biggest deals, ranked",
  summary: "A survey of 40 top-flight clubs finds median jersey deal values of $120K/yr \u2014 with Monrovia FC\u2019s Orange partnership among the region\u2019s top 10. Here are the full numbers.",
  category: 'Football',
  source: 'TrueRate Sports Business',
  time: '3h ago',
};

const SPONSORSHIP = [
  { entity: 'Monrovia FC',  sponsor: 'Orange Liberia',      type: 'Shirt',      value: '$320K/yr', since: '2023', expiry: '2026' },
  { entity: 'LISCR FC',     sponsor: 'Lonestar Cell MTN',   type: 'Kit',        value: '$180K/yr', since: '2024', expiry: '2027' },
  { entity: 'LFA',          sponsor: 'CBL / Govt. Liberia', type: 'Federation', value: '$600K/yr', since: '2022', expiry: '2026' },
  { entity: 'NBL Africa',   sponsor: 'NBA / SAP Africa',    type: 'Title',      value: '$8M/yr',   since: '2021', expiry: '2027' },
  { entity: 'Lone Star (NT)', sponsor: 'Puma',              type: 'Kit',        value: '$450K/yr', since: '2023', expiry: '2026' },
  { entity: 'BYC FC',       sponsor: 'Liberia Petroleum',    type: 'Shirt',      value: '$95K/yr',  since: '2024', expiry: '2027' },
  { entity: 'Barrack Young', sponsor: 'Cemenco',            type: 'Shirt',      value: '$80K/yr',  since: '2023', expiry: '2026' },
];

const ATHLETES = [
  { name: 'Comfort Brown',   sport: 'Athletics',  sponsors: ['Puma', 'MTN', 'Liberia Petroleum'], value: '$220K/yr', note: 'Fastest-growing athlete brand in W. Africa' },
  { name: 'Marcus Pewee',    sport: 'Basketball', sponsors: ['NBA Africa', 'Orange'],             value: '$140K/yr', note: 'Rising star post-NBA combine' },
  { name: 'Emmanuel Kollie', sport: 'Football',   sponsors: ['Cemenco'],                           value: '$40K/yr',  note: 'Local-only deal, under review' },
];

const STATS = [
  { label: 'Top 40 clubs\u2019 total sponsorship (W. Africa)', value: '$48M/yr', delta: '+22% YoY',  up: true },
  { label: 'Median top-flight shirt deal',                    value: '$120K/yr', delta: '+8% YoY',   up: true },
  { label: 'Telco share of sponsorship spend',                value: '38%',     delta: '+5pp',      up: true },
  { label: 'Deals expiring in 2026',                          value: '9',       delta: '~$2.4M at stake', up: true },
];

const STORIES = [
  { category: 'Football',   title: "Orange vs MTN: the Liberian telco sponsorship arms race",          summary: "Both carriers are expanding football portfolios to reach young male subscribers.",    source: 'TrueRate Sports', time: '5h ago' },
  { category: 'Athletics',  title: "How Comfort Brown\u2019s brand value tripled in six months",       summary: "A record run, a US agent, and the first Liberian athlete to clear $200K in sponsorships.", source: 'TrueRate Sports', time: '1d ago' },
  { category: 'Football',   title: "The LFA\u2019s federation sponsorship up for renewal \u2014 bidders lining up", summary: "CBL, Orange, and a new entrant have all signalled interest.",                      source: 'TrueRate Sports', time: '2d ago' },
  { category: 'Basketball', title: "NBA Africa\u2019s SAP title deal: what comes next at $8M/yr",      summary: "Three options on the table, including a pivot to a consumer brand.",                    source: 'TrueRate Sports', time: '2d ago' },
];

export default function SponsorshipPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <main className="mx-auto max-w-[1320px] px-4 py-6">
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Sports', href: '/sports' }, { label: 'Sponsorship' }]} />
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">Sports Business</p>
          <h1 className="text-[28px] sm:text-[36px] font-black leading-tight tracking-tight text-gray-900 mb-2">Sponsorship</h1>
          <p className="text-[14px] text-gray-500 max-w-[720px] leading-relaxed">Shirt, kit, federation, and athlete sponsorship deals across Liberia and West Africa \u2014 values, terms, and who&rsquo;s bidding next.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">{s.label}</p>
              <p className="text-[20px] font-black text-gray-900 tabular-nums">{s.value}</p>
              <p className="text-[11px] font-semibold tabular-nums mt-0.5 text-emerald-500">{s.delta}</p>
            </div>
          ))}
        </div>

        <Link href="/sports" className="group flex flex-col lg:flex-row gap-0 overflow-hidden border border-gray-200 bg-white no-underline mb-8">
          <div className="w-full lg:w-[55%] shrink-0">
            <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
          </div>
          <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
            <span className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">{HERO.category}</span>
            <h2 className="text-[22px] font-black leading-snug text-gray-900 group-hover:text-gray-700 mb-3">{HERO.title}</h2>
            <p className="text-[14px] leading-relaxed text-gray-500 line-clamp-3 mb-4">{HERO.summary}</p>
            <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
              <span>{HERO.source}</span><span>·</span><span>{HERO.time}</span>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="mb-10">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Live sponsorship deals</h2>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Liberia &amp; W. Africa</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-5 py-3 text-left">Club / Body</th>
                      <th className="px-5 py-3 text-left">Sponsor</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-left">Type</th>
                      <th className="px-5 py-3 text-right">Annual value</th>
                      <th className="hidden sm:table-cell px-5 py-3 text-right">Since</th>
                      <th className="hidden md:table-cell px-5 py-3 text-right">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {SPONSORSHIP.map(r => (
                      <tr key={r.entity + r.sponsor} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-bold text-gray-900">{r.entity}</td>
                        <td className="px-5 py-3 text-gray-500">{r.sponsor}</td>
                        <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{r.type}</td>
                        <td className="tabular-nums px-5 py-3 text-right font-bold text-gray-900">{r.value}</td>
                        <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-400">{r.since}</td>
                        <td className="hidden md:table-cell tabular-nums px-5 py-3 text-right text-gray-500">{r.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Athlete endorsements</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ATHLETES.map(a => (
                  <div key={a.name} className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">{a.sport}</p>
                    <h3 className="text-[16px] font-black text-gray-900 mb-1">{a.name}</h3>
                    <p className="text-[18px] font-black text-emerald-600 tabular-nums mb-3">{a.value}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {a.sponsors.map(s => (
                        <span key={s} className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-700">{s}</span>
                      ))}
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{a.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Analysis</h2>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {STORIES.map((s, i) => (
                  <Link key={i} href="/sports" className="group flex gap-3 sm:gap-4 py-5 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden"><NewsThumbnail category={s.category} className="h-[80px] w-[100px] sm:h-[90px] sm:w-[140px]" /></div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1.5 block">{s.category}</span>
                      <h3 className="text-[15px] font-black leading-snug text-gray-900 group-hover:text-gray-700 mb-1.5 line-clamp-2">{s.title}</h3>
                      <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{s.summary}</p>
                      <div className="text-[12px] text-gray-400">{s.source} · {s.time}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">Advertise with TrueRate Sports</p>
              <p className="text-[13px] text-gray-700 leading-relaxed mb-3">Reach decision-makers in African sports business.</p>
              <a href="mailto:advertise@truerate.com" className="inline-block rounded-lg bg-gray-900 text-white px-3 py-2 text-[12px] font-semibold no-underline hover:bg-gray-800">advertise@truerate.com</a>
            </div>
            <Link href="/sports/broadcast-rights" className="rounded-xl border border-gray-200 bg-white p-4 no-underline hover:border-gray-400 transition-colors">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">Next: Broadcast Rights →</p>
              <p className="text-[13px] text-gray-700 leading-relaxed">TV deals powering African football.</p>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
