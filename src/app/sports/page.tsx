'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NewsThumbnail, HeroVisual, VideoThumbnail } from '@/components/NewsThumbnail';
import { getCatColor as CATEGORY_COLORS_FN } from '@/lib/category-colors';

/* ── data ── */

const SCORES = [
  { home: 'Liberia',          away: 'Ghana',           homeScore: 2,  awayScore: 1,  status: 'FT',   competition: 'WAFU Cup' },
  { home: 'Nigeria',          away: 'Ivory Coast',     homeScore: 0,  awayScore: 0,  status: "67'",  competition: 'AFCON Qual.' },
  { home: 'Monrovia FC',      away: 'LISCR FC',        homeScore: 1,  awayScore: 1,  status: 'HT',   competition: 'LFA League' },
  { home: 'Rivers Hoopers',   away: 'Bayelsa Wave',    homeScore: 78, awayScore: 65, status: 'Q3',   competition: 'NBL Africa' },
  { home: 'Senegal',          away: 'Kenya',           homeScore: 3,  awayScore: 1,  status: 'FT',   competition: 'Africa Cup' },
  { home: 'BYC FC',           away: 'Barrack Young',   homeScore: 0,  awayScore: 2,  status: 'FT',   competition: 'LFA League' },
  { home: 'Guinea',           away: 'Burkina Faso',    homeScore: 1,  awayScore: 0,  status: "42'",  competition: 'WAFU Cup' },
  { home: 'Monrovia Ballers', away: 'Accra Lions',     homeScore: 62, awayScore: 71, status: 'FT',   competition: 'NBL Africa' },
];

const HERO = {
  category: 'Football',
  title: "AFCON 2027 broadcast rights: who's paying — and what Liberia's qualification is worth to CAF",
  summary: "Liberia's historic qualification has boosted regional viewership projections for AFCON 2027 by an estimated 12%. We break down the $340M broadcast deal, CAF's prize money structure, and what the Lone Star stands to earn.",
  source: 'TrueRate Sports Business',
  time: '1h ago',
};

const TOP_STORIES = [
  { category: 'Football',   title: "Premier League Africa TV rights renewal: beIN Sports vs SuperSport bidding war nears $180M", source: 'Reuters', time: '2h ago' },
  { category: 'Basketball', title: "NBA Africa Series 2026 confirmed for Monrovia — estimated $4.2M economic impact", source: 'NBA Africa', time: '4h ago' },
  { category: 'Athletics',  title: "World Athletics signs $80M West Africa development sponsorship with MTN Group", source: 'World Athletics', time: '6h ago' },
];

const FEED = [
  { category: 'Football',   title: "Monrovia FC's new stadium deal: $18M PPP project explained",                                    summary: "The club's groundbreaking public-private partnership with the Liberian government and a Ghanaian construction firm could transform club revenues within three seasons.",    source: 'TrueRate Sports', time: '3h ago' },
  { category: 'Football',   title: "LFA commercial revenue up 31% — but the league still runs at a $2.1M annual deficit",           summary: "Growing sponsorship and gate receipts mask a structural funding gap that the Football Association has yet to close with broadcast income.",                          source: 'LFA / TrueRate', time: '5h ago' },
  { category: 'Basketball', title: "NBL Africa franchise expansion: what a Monrovia team would cost and generate",                   summary: "A new NBA Africa-backed franchise report estimates $6M entry fee and $2.8M annual operating costs against projected $4.1M in revenue by year three.",               source: 'NBA Africa', time: '7h ago' },
  { category: 'Football',   title: "How Marcus Pewee became the most valuable Liberian player since Weah — the numbers",            summary: "Rivers Hoopers' $840K contract and pre-draft NBA valuation make Pewee the highest-earning Liberian athlete in active competition.",                               source: 'TrueRate Sports', time: '9h ago' },
  { category: 'Football',   title: "Shirt sponsorship in West African football: deals, values, and the brands that pay the most",  summary: "A survey of 40 top-flight clubs finds median jersey deal values of $120K/year — with Monrovia FC's Orange partnership among the region's top 10.",            source: 'Sportcal', time: '1d ago' },
  { category: 'Athletics',  title: "Comfort Brown's commercial value: sponsorship worth $220K — and growing fast",                  summary: "After breaking the West African 100m record, the sprinter has attracted Puma, MTN, and Liberia Petroleum as sponsors in a six-month window.",                    source: 'TrueRate Sports', time: '1d ago' },
  { category: 'Football',   title: "WAFU Cup semi-final preview: Liberia vs Guinea — tactical and financial breakdown",              summary: "Liberia's Lone Star faces Guinea in the WAFU Cup semi-final. We break down the prize money at stake, the tactics, and what a final appearance would mean commercially.", source: 'TrueRate Sports', time: '2d ago' },
  { category: 'Basketball', title: "NBA Africa Monrovia 2026: venue, ticket revenue, and the long-term legacy",                     summary: "With a venue confirmed and ticket sales open, we model the $4.2M economic impact — and ask whether a permanent NBA Africa franchise in Liberia is now realistic.",    source: 'TrueRate Sports', time: '2d ago' },
  { category: 'Football',   title: "Liberia's youth football pipeline: how the U20 system could become a commercial asset",        summary: "With four Liberian under-20s attracting European scout interest, the LFA is exploring a $500K academy partnership model with a Premier League club.",             source: 'TrueRate Sports', time: '3d ago' },
  { category: 'Athletics',  title: "West Africa Athletics Grand Prix returns to Monrovia — $180K prize pool announced",             summary: "The continental circuit event returns after a two-year absence, with prize money up 60% and broadcast coverage confirmed on SuperSport.",                       source: 'World Athletics', time: '3d ago' },
];

const TRANSFERS = [
  { player: 'Emmanuel Kollie', from: 'Monrovia FC',   to: 'LISCR FC',              fee: '$280K',       status: 'Rumour',    confirmed: false },
  { player: 'James Dolo',      from: 'BYC FC',        to: 'Barrack Young',         fee: '$45K',        status: 'Confirmed', confirmed: true  },
  { player: 'Marcus Pewee',    from: 'Free Agent',    to: 'Rivers Hoopers',        fee: '$840K / 2yr', status: 'Done',      confirmed: true  },
  { player: 'Eric Kpah',       from: 'LISCR FC',      to: 'Club de Foot Abidjan',  fee: '$190K',       status: 'Confirmed', confirmed: true  },
  { player: 'Samuel Toe',      from: 'FC Nimba',      to: 'Monrovia FC',           fee: 'Undisclosed', status: 'Rumour',    confirmed: false },
  { player: 'Alvin Sumo',      from: 'Barrack Young', to: 'Semassi FC (Togo)',     fee: '$60K',        status: 'Confirmed', confirmed: true  },
  { player: 'George Flomo',    from: 'Free Agent',    to: 'BYC FC',               fee: '$22K',        status: 'Done',      confirmed: true  },
  { player: 'Ibrahim Kamara',  from: 'LISCR FC',      to: 'Williamsville AC (CIV)', fee: '$310K',      status: 'Negotiating', confirmed: false },
];

const BROADCAST = [
  { competition: 'AFCON 2027',          rightsholder: 'SuperSport / beIN',   value: '$340M', territory: 'Global',      expiry: '2027' },
  { competition: 'Premier League',      rightsholder: 'SuperSport',          value: '$180M', territory: 'Sub-Saharan', expiry: '2028' },
  { competition: 'LFA League',          rightsholder: 'ELBC / Orange',       value: '$1.8M', territory: 'Liberia',     expiry: '2026' },
  { competition: 'NBL Africa',          rightsholder: 'NBA Africa / DStv',   value: '$22M',  territory: 'Pan-Africa',  expiry: '2027' },
  { competition: 'WAFU Cup',            rightsholder: 'CAF Media',           value: '$12M',  territory: 'West Africa', expiry: '2026' },
];

const SPONSORSHIP = [
  { club: 'Monrovia FC',  sponsor: 'Orange Liberia',      category: 'Shirt',       value: '$320K/yr', since: '2023' },
  { club: 'LISCR FC',     sponsor: 'Lonestar Cell MTN',   category: 'Kit',         value: '$180K/yr', since: '2024' },
  { club: 'LFA',          sponsor: 'CBL / Govt. Liberia', category: 'Federation',  value: '$600K/yr', since: '2022' },
  { club: 'NBL Africa',   sponsor: 'NBA / SAP Africa',    category: 'Title',       value: '$8M/yr',   since: '2021' },
];

const VIDEOS = [
  { title: "Lone Star's AFCON qualifier — and the $4M prize money on the line", duration: '4:22', category: 'Football' },
  { title: 'NBA Africa Monrovia 2026: the business case explained', duration: '6:10', category: 'Basketball' },
  { title: 'Comfort Brown and the economics of African sprint sponsorship', duration: '3:15', category: 'Athletics' },
  { title: 'WAFU Cup semi-final preview: Liberia vs Guinea', duration: '5:48', category: 'Football' },
  { title: 'Inside Monrovia FC stadium deal — PPP explained', duration: '4:02', category: 'Football' },
  { title: 'LFA annual deficit: where does the money go?', duration: '3:30', category: 'Football' },
];

const STANDINGS = [
  { pos: 1, team: 'Monrovia FC',    p: 24, w: 15, d: 5, l: 4,  pts: 50 },
  { pos: 2, team: 'LISCR FC',       p: 24, w: 13, d: 6, l: 5,  pts: 45 },
  { pos: 3, team: 'BYC FC',         p: 24, w: 12, d: 5, l: 7,  pts: 41 },
  { pos: 4, team: 'Barrack Young',  p: 24, w: 10, d: 7, l: 7,  pts: 37 },
  { pos: 5, team: 'FC Nimba',       p: 24, w: 9,  d: 6, l: 9,  pts: 33 },
  { pos: 6, team: 'Gbarpolu FC',    p: 24, w: 8,  d: 5, l: 11, pts: 29 },
  { pos: 7, team: 'Lofa Rangers',   p: 24, w: 6,  d: 7, l: 11, pts: 25 },
  { pos: 8, team: 'Grand Bassa',    p: 24, w: 5,  d: 5, l: 14, pts: 20 },
];

const PLAYER_SPOTLIGHT = {
  name: 'Comfort Brown',
  sport: 'Athletics',
  achievement: 'West African 100m Record Holder',
  stat: '9.87s',
  statLabel: '100m Personal Best',
  summary: "After breaking the West African 100m record in Dakar, Comfort Brown has emerged as the continent's most commercially valuable sprinter — with $220K in active sponsorships and a shot at the 2028 Olympics.",
  sponsors: ['Puma', 'MTN', 'Liberia Petroleum'],
  nationality: 'Liberia',
};

const TOP_PERFORMERS = [
  { name: 'T. Kollie',     team: 'Monrovia FC',  stat: '16 goals',  category: 'Football',   label: 'Top Scorer' },
  { name: 'E. Kpah',       team: 'LISCR FC',     stat: '11 assists', category: 'Football',   label: 'Assists' },
  { name: 'M. Pewee',      team: 'Rivers Hoopers',stat: '28.4 ppg',  category: 'Basketball', label: 'Points/Game' },
  { name: 'C. Brown',      team: 'Liberia NAT',  stat: '9.87s',     category: 'Athletics',  label: '100m PB' },
  { name: 'A. Sumo',       team: 'Barrack Young',stat: '9 clean sheets', category: 'Football', label: 'Goalkeeper' },
];

const WAFU_STANDINGS = [
  { pos: 1, team: 'Liberia',        pld: 3, w: 3, d: 0, l: 0, gf: 6, ga: 2, pts: 9 },
  { pos: 2, team: 'Nigeria',        pld: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, pts: 7 },
  { pos: 3, team: 'Ghana',          pld: 3, w: 2, d: 0, l: 1, gf: 4, ga: 3, pts: 6 },
  { pos: 4, team: 'Guinea',         pld: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, pts: 4 },
  { pos: 5, team: 'Sierra Leone',   pld: 3, w: 1, d: 0, l: 2, gf: 2, ga: 4, pts: 3 },
  { pos: 6, team: 'Gambia',         pld: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, pts: 0 },
];

const BUSINESS_METRICS = [
  { label: 'LFA Total Prize Pool (2025/26)',   value: '$1.2M',  change: '+15% YoY', up: true  },
  { label: 'W. Africa Sports Sponsorship',     value: '$340M',  change: '+22% YoY', up: true  },
  { label: 'Monrovia FC Est. Valuation',       value: '$8.4M',  change: '+11% YoY', up: true  },
  { label: 'CAF Prize Money (AFCON 2027)',     value: '$22.5M', change: '+18% YoY', up: true  },
  { label: 'WAFU Cup Winner Prize',            value: '$800K',  change: '+25% YoY', up: true  },
  { label: 'NBL Africa Monrovia Gate Revenue', value: '$1.1M',  change: 'Projected', up: true  },
];

const TAB_PARAM_MAP: Record<string, string> = {
  'transfers-deals':  'Transfers & Deals',
  'broadcast-rights': 'Broadcast Rights',
  'club-finance':     'Club Finance',
  'sponsorship':      'Sponsorship',
};

function SportsPageInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') ?? '';
  const activeTab = TAB_PARAM_MAP[tabParam] ?? 'All';

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Sports' }]} light />
      </div>

      {/* Scores ticker */}
      <div className="mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 min-w-max">
          {SCORES.map((s, i) => (
            <Link key={i} href="/sports" className="group flex flex-col items-center border border-gray-200 px-4 py-3 no-underline hover:border-gray-400 transition-colors min-w-[170px]">
              <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">{s.competition}</div>
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-gray-900 truncate">{s.home}</div>
                  <div className="text-[13px] font-bold text-gray-900 truncate">{s.away}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[14px] font-black tabular-nums ${s.homeScore > s.awayScore ? 'text-gray-900' : 'text-gray-500'}`}>{s.homeScore}</div>
                  <div className={`text-[14px] font-black tabular-nums ${s.awayScore > s.homeScore ? 'text-gray-900' : 'text-gray-500'}`}>{s.awayScore}</div>
                </div>
              </div>
              <div className={`mt-2 text-[10px] font-bold ${s.status === 'FT' ? 'text-gray-400' : 'text-emerald-400'}`}>
                {s.status}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active tab label */}
      {activeTab !== 'All' && (
        <div className="mb-5 flex items-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Viewing:</span>
          <span className="text-[12px] font-bold text-gray-900">{activeTab}</span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <Link href="/sports" className="group flex flex-col lg:flex-row gap-0 overflow-hidden border border-gray-200 bg-white no-underline mb-6">
            <div className="w-full lg:w-[55%] shrink-0">
              <HeroVisual category={HERO.category} className="w-full h-[200px] sm:h-[260px] lg:h-full" />
            </div>
            <div className="flex flex-col justify-center px-5 py-6 lg:px-8 lg:py-8 flex-1">
              <span className={`mb-3 text-[10px] font-bold uppercase tracking-widest ${CATEGORY_COLORS_FN(HERO.category)}`}>{HERO.category}</span>
              <h2 className="text-[22px] font-black leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-4">{HERO.title}</h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span>{HERO.source}</span>
                <span className="text-gray-500">·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Top stories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {TOP_STORIES.map((s, i) => (
              <Link key={i} href="/sports" className="group flex flex-col no-underline">
                <div className="overflow-hidden mb-2.5">
                  <NewsThumbnail category={s.category} className="w-full h-[130px]" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 ${CATEGORY_COLORS_FN(s.category)}`}>{s.category}</span>
                <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-3 flex-1 mb-1.5">{s.title}</h3>
                <div className="text-[11px] text-gray-400">{s.source} · {s.time}</div>
              </Link>
            ))}
          </div>

          {/* Transfer table */}
          {(activeTab === 'All' || activeTab === 'Transfers & Deals') && <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Transfer Tracker</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Deal values · Apr 2026</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full min-w-[320px] sm:min-w-[520px] text-[13px]">
                <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-3 sm:px-5 py-3 text-left">Player</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">From</th>
                    <th className="px-3 sm:px-5 py-3 text-left">To</th>
                    <th className="px-3 sm:px-5 py-3 text-right">Fee</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TRANSFERS.map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-5 py-3 font-bold text-gray-900">{t.player}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-400">{t.from}</td>
                      <td className="px-3 sm:px-5 py-3 text-gray-400">{t.to}</td>
                      <td className="tabular-nums px-3 sm:px-5 py-3 text-right font-bold text-gray-900">{t.fee}</td>
                      <td className={`hidden sm:table-cell px-5 py-3 text-right text-[12px] font-semibold ${t.confirmed ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {t.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}

          {/* Broadcast rights */}
          {(activeTab === 'All' || activeTab === 'Broadcast Rights') && <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Broadcast Rights</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Current deals</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Competition</th>
                    <th className="px-5 py-3 text-left">Rights Holder</th>
                    <th className="px-5 py-3 text-right">Deal Value</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-left">Territory</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BROADCAST.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-gray-900">{row.competition}</td>
                      <td className="px-5 py-3 text-gray-400">{row.rightsholder}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-gray-900">{row.value}</td>
                      <td className="hidden sm:table-cell px-5 py-3 text-gray-500">{row.territory}</td>
                      <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-400">{row.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}

          {/* Feed */}
          {(activeTab === 'All' || activeTab === 'Broadcast Rights') && <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Analysis</h2>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {FEED.map((item, i) => (
                <Link key={i} href="/sports" className="group flex gap-3 sm:gap-4 py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden">
                    <NewsThumbnail category={item.category} className="h-[80px] w-[100px] sm:h-[90px] sm:w-[140px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 block ${CATEGORY_COLORS_FN(item.category)}`}>{item.category}</span>
                    <h3 className="text-[12px] font-black leading-snug text-gray-900 group-hover:text-gray-900/75 transition-colors mb-1.5 line-clamp-2">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400">
                      <span className="text-gray-500">{item.source}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>}

          {/* Sponsorship */}
          {(activeTab === 'All' || activeTab === 'Sponsorship') && <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-0">
              <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Major Sponsorship Deals</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wide font-bold">Liberia &amp; West Africa</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Club / Body</th>
                    <th className="px-5 py-3 text-left">Sponsor</th>
                    <th className="px-5 py-3 text-left">Category</th>
                    <th className="px-5 py-3 text-right">Annual Value</th>
                    <th className="hidden sm:table-cell px-5 py-3 text-right">Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SPONSORSHIP.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-gray-900">{row.club}</td>
                      <td className="px-5 py-3 text-gray-400">{row.sponsor}</td>
                      <td className="px-5 py-3 text-gray-500">{row.category}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-bold text-gray-900">{row.value}</td>
                      <td className="hidden sm:table-cell tabular-nums px-5 py-3 text-right text-gray-400">{row.since}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}

          {/* Player Spotlight */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Player Spotlight</h2>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-0 border-t border-gray-200">
              <div className="w-full sm:w-[220px] shrink-0 mt-5">
                <NewsThumbnail category={PLAYER_SPOTLIGHT.sport} className="w-full h-[200px] sm:h-full" />
              </div>
              <div className="py-5 sm:pl-6 flex flex-col justify-between flex-1">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${CATEGORY_COLORS_FN(PLAYER_SPOTLIGHT.sport)}`}>{PLAYER_SPOTLIGHT.sport} · {PLAYER_SPOTLIGHT.nationality}</span>
                  <h3 className="text-[22px] font-black text-gray-900 mb-1">{PLAYER_SPOTLIGHT.name}</h3>
                  <p className="text-[12px] text-gray-500 mb-3">{PLAYER_SPOTLIGHT.achievement}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[32px] font-black text-gray-900 tabular-nums leading-none">{PLAYER_SPOTLIGHT.stat}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">{PLAYER_SPOTLIGHT.statLabel}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 mb-4">{PLAYER_SPOTLIGHT.summary}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Sponsors</p>
                  <div className="flex flex-wrap gap-2">
                    {PLAYER_SPOTLIGHT.sponsors.map(s => (
                      <span key={s} className="rounded-lg bg-gray-100 border border-gray-200 px-3 py-1 text-[12px] font-semibold text-gray-700">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          {(activeTab === 'All' || activeTab === 'Club Finance') && <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Top Performers</h2>
              </div>
            </div>
            <div>
              <table className="w-full text-[13px]">
                <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Athlete</th>
                    <th className="px-5 py-3 text-left hidden sm:table-cell">Club / Body</th>
                    <th className="px-5 py-3 text-right">Stat</th>
                    <th className="px-5 py-3 text-right hidden sm:table-cell">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {TOP_PERFORMERS.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-bold text-gray-900">{p.name} <span className="font-normal text-gray-400 text-[11px]">· {p.label}</span></td>
                      <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{p.team}</td>
                      <td className="tabular-nums px-5 py-3 text-right font-black text-gray-900">{p.stat}</td>
                      <td className={`px-5 py-3 text-right text-[11px] font-bold hidden sm:table-cell ${CATEGORY_COLORS_FN(p.category)}`}>{p.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>}

          {/* WAFU Cup Group Standings */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <div>
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">WAFU Cup 2026</h2>
                  <p className="text-[12px] text-gray-500">Group Stage Standings</p>
                </div>
              </div>
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-600">Live</span>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-[13px] min-w-[280px] sm:min-w-[400px]">
                  <thead className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-3 sm:px-5 py-3 text-left">#</th>
                      <th className="px-3 sm:px-5 py-3 text-left">Team</th>
                      <th className="px-2 sm:px-3 py-3 text-center">P</th>
                      <th className="px-2 sm:px-3 py-3 text-center">W</th>
                      <th className="px-2 sm:px-3 py-3 text-center">D</th>
                      <th className="px-2 sm:px-3 py-3 text-center">L</th>
                      <th className="hidden sm:table-cell px-3 py-3 text-center">GF</th>
                      <th className="hidden sm:table-cell px-3 py-3 text-center">GA</th>
                      <th className="px-3 sm:px-5 py-3 text-right font-black">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {WAFU_STANDINGS.map(row => (
                      <tr key={row.pos} className={`hover:bg-gray-50 transition-colors ${row.team === 'Liberia' ? 'bg-emerald-50/50' : ''}`}>
                        <td className="px-3 sm:px-5 py-3 text-gray-400 font-bold">{row.pos}</td>
                        <td className={`px-3 sm:px-5 py-3 font-bold ${row.team === 'Liberia' ? 'text-emerald-600' : 'text-gray-900'}`}>{row.team}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-gray-500">{row.pld}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-gray-500">{row.w}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-gray-500">{row.d}</td>
                        <td className="px-2 sm:px-3 py-3 text-center text-gray-500">{row.l}</td>
                        <td className="hidden sm:table-cell px-3 py-3 text-center text-gray-500">{row.gf}</td>
                        <td className="hidden sm:table-cell px-3 py-3 text-center text-gray-500">{row.ga}</td>
                        <td className="px-3 sm:px-5 py-3 text-right font-black text-gray-900">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>

          {/* Videos */}
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Videos</h2>
              </div>
              <Link href="/videos" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors no-underline">View all ›</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIDEOS.map((v, i) => (
                <Link key={i} href="/videos" className="group flex flex-col no-underline">
                  <div className="relative overflow-hidden mb-2.5">
                    <VideoThumbnail category={v.category} duration={v.duration} className="w-full h-[130px]" />
                  </div>
                  <h3 className="text-[12px] font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">{v.title}</h3>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden xl:block w-[290px] shrink-0 sticky self-end" style={{ bottom: '16px' }}>
          <div className="flex flex-col gap-5">

            {/* Business snapshot */}
            <div>
              <h3 className="text-[12px] font-bold text-gray-900 border-b border-gray-200 pb-3 mb-0">Sports Business Snapshot</h3>
              <div className="divide-y divide-gray-100">
                {BUSINESS_METRICS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <span className="text-[12px] text-gray-500 pr-3">{m.label}</span>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-bold text-gray-900 tabular-nums">{m.value}</div>
                      <div className={`text-[11px] tabular-nums ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LFA Standings */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                <div>
                  <h3 className="text-[12px] font-bold text-gray-900">LFA League</h3>
                  <p className="text-[10px] text-gray-400">Week 22</p>
                </div>
                <Link href="/sports" className="text-[11px] text-gray-500 hover:text-gray-900 transition-colors no-underline">Full table ›</Link>
              </div>
              <div className="py-2">
                <div className="flex text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1 gap-0">
                  <span className="w-5 shrink-0">#</span>
                  <span className="flex-1">Team</span>
                  <span className="w-5 text-center">P</span>
                  <span className="w-5 text-center">W</span>
                  <span className="w-5 text-center">D</span>
                  <span className="w-5 text-center">L</span>
                  <span className="w-8 text-right font-black">Pts</span>
                </div>
                {STANDINGS.map(row => (
                  <div key={row.pos} className="flex items-center py-2 border-t border-gray-100 text-[12px] gap-0">
                    <span className="w-5 shrink-0 text-gray-400 font-bold">{row.pos}</span>
                    <span className="flex-1 font-semibold text-gray-900 truncate pr-1">{row.team}</span>
                    <span className="w-5 text-center text-gray-500">{row.p}</span>
                    <span className="w-5 text-center text-gray-500">{row.w}</span>
                    <span className="w-5 text-center text-gray-500">{row.d}</span>
                    <span className="w-5 text-center text-gray-500">{row.l}</span>
                    <span className="w-8 text-right font-black text-gray-900">{row.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming fixtures */}
            <div>
              <h3 className="text-[12px] font-bold text-gray-900 border-b border-gray-200 pb-3 mb-0">Upcoming Fixtures</h3>
              <div className="divide-y divide-gray-100">
                {[
                  { home: 'Liberia',        away: 'Guinea',           date: 'Apr 8',  time: '18:00', competition: 'WAFU Cup SF' },
                  { home: 'Monrovia FC',    away: 'FC Nimba',         date: 'Apr 9',  time: '15:00', competition: 'LFA League' },
                  { home: 'LISCR FC',       away: 'BYC FC',           date: 'Apr 10', time: '16:00', competition: 'LFA League' },
                  { home: 'Rivers Hoopers', away: 'Monrovia Ballers',  date: 'Apr 11', time: '20:00', competition: 'NBL Africa' },
                  { home: 'Liberia',        away: 'Nigeria',           date: 'Apr 14', time: '20:00', competition: 'WAFU Cup Final' },
                  { home: 'Barrack Young',  away: 'Gbarpolu FC',       date: 'Apr 16', time: '15:00', competition: 'LFA League' },
                ].map((f, i) => (
                  <Link key={i} href="/sports" className="flex flex-col py-3 no-underline group hover:opacity-75 transition-opacity">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">{f.competition}</div>
                    <div className="text-[12px] font-semibold text-gray-900 group-hover:text-gray-700">{f.home} <span className="text-gray-400 font-normal">vs</span> {f.away}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{f.date} · {f.time} WAT</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most read */}
            <div>
              <h3 className="text-[12px] font-bold text-gray-900 border-b border-gray-200 pb-3 mb-0">Most Read</h3>
              <div className="divide-y divide-gray-100">
                {[
                  { rank: 1, title: "AFCON 2027 broadcast rights: the $340M deal",          tag: 'Football' },
                  { rank: 2, title: "NBA Africa Monrovia — $4.2M impact study",              tag: 'Basketball' },
                  { rank: 3, title: "LFA's $2.1M annual deficit explained",                  tag: 'Football' },
                  { rank: 4, title: "Marcus Pewee's $840K deal — how it compares",           tag: 'Basketball' },
                  { rank: 5, title: "Comfort Brown sponsorship value: $220K and rising",     tag: 'Athletics' },
                  { rank: 6, title: "WAFU Cup semi-final: Liberia vs Guinea preview",        tag: 'Football' },
                  { rank: 7, title: "Monrovia FC stadium PPP: the $18M deal breakdown",      tag: 'Football' },
                ].map(t => (
                  <Link key={t.rank} href="/sports" className="flex items-center gap-3 py-3 no-underline group hover:opacity-75 transition-opacity">
                    <span className="shrink-0 text-[18px] font-black text-gray-300 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2 leading-snug">{t.title}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${CATEGORY_COLORS_FN(t.tag)}`}>{t.tag}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Compact site footer */}
            <div className="pt-2 pb-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                {[
                  { label: 'X',         href: '#', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'Facebook',  href: '#', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { label: 'Instagram', href: '#', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                  { label: 'YouTube',   href: '#', path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                  { label: 'TikTok',    href: '#', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                ].map(s => (
                  <a key={s.label} href={s.href} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label={s.label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
                {['About', 'Advertise', 'Careers', 'Help', 'Feedback', 'Privacy', 'Terms'].map(l => (
                  <Link key={l} href="/about" className="text-[11px] text-gray-400 hover:text-gray-700 transition-colors no-underline">{l}</Link>
                ))}
              </div>
              <p className="text-center text-[11px] text-gray-400">© 2026 TrueRate. All rights reserved.</p>
            </div>

          </div>
        </aside>
      </div>
    </main>
    </div>
  );
}

export default function SportsPage() {
  return (
    <Suspense>
      <SportsPageInner />
    </Suspense>
  );
}
