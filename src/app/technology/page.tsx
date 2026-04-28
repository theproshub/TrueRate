import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import TechnologyTopicTabs from '@/components/TechnologyTopicTabs';

const HERO = {
  category: 'Fintech',
  title: "Liberia's mobile money market hits $2.1B in annual transactions as Orange Money leads expansion",
  summary: 'Orange Money Liberia crossed the billion-dollar transaction threshold in Q1 2026, driven by rural adoption and merchant payment integrations across 12 counties.',
  source: 'TrueRate Tech',
  time: '1h ago',
};

const STRIP_CARDS = [
  { category: 'Fintech',    title: 'Monrovia startup Ducor Pay raises $4.2M Series A to expand USSD lending across West Africa', source: 'TechCabal',      time: '2h ago' },
  { category: 'Hardware',   title: 'iPhone 16 demand surges in Monrovia, but Randall Street retailers pull units as import duty hike bites margins', source: 'FrontPage Africa', time: '4h ago' },
  { category: 'Startups',   title: 'Orange Digital Center Liberia opens DevOps sandbox — first cohort of 120 engineers begin 6-month residency',      source: 'TrueRate Tech',    time: '5h ago' },
  { category: 'Education',  title: 'BlueCrest University to graduate 340 new CS and software engineering students in June — biggest class to date',   source: 'Liberian Observer', time: '6h ago' },
  { category: 'Government', title: 'Audit finds 4 ministry offices still running Windows 7; cybersecurity team warns of patch exposure',              source: 'The New Dawn',     time: '8h ago' },
  { category: 'Government', title: 'National registry database crashes for third time this quarter — MoICT pledges full infrastructure audit',        source: 'FrontPage Africa', time: '10h ago' },
  { category: 'AI',         title: 'Liberia joins AU AI Task Force — plans national AI policy framework by Q3 2026',                                   source: 'The New Dawn',     time: '12h ago' },
  { category: 'Telecom',    title: 'Lonestar MTN rolls out 4G to 8 new counties, bringing coverage to 74% of the population',                          source: 'FrontPage Africa', time: '14h ago' },
  { category: 'Startups',   title: "Liberia's first tech hub, iCampus, secures $1.5M from USAID to expand coding bootcamps",                           source: 'Liberian Observer', time: '16h ago' },
  { category: 'E-Commerce', title: "Jumia Liberia's GMV rises 28% YoY as smartphone penetration crosses 40% threshold",                                source: 'Reuters',          time: '1 day ago' },
];

const STARTUP_TRACKER = [
  { name: 'Ducor Pay',       sector: 'Fintech',       raise: '$4.2M',    stage: 'Series A', investors: 'Partech Africa · Ventures Platform', date: 'Apr 2026'  },
  { name: 'AgriLink LR',     sector: 'AgriTech',      raise: '$800K',    stage: 'Seed',     investors: 'GreenTec Capital',                   date: 'Mar 2026'  },
  { name: 'HealthBridge',    sector: 'HealthTech',     raise: '$1.2M',    stage: 'Seed',     investors: 'Chandaria Capital · Angel network',  date: 'Mar 2026'  },
  { name: 'TruckersPro LR',  sector: 'Logistics',     raise: '$500K',    stage: 'Pre-seed', investors: 'Self-funded + grants',               date: 'Feb 2026'  },
  { name: 'LernerAI',        sector: 'EdTech',        raise: '$350K',    stage: 'Pre-seed', investors: 'MEST Africa',                        date: 'Jan 2026'  },
];

const FEED = [
  { category: 'Government', title: "Inside Liberia's database crisis: why government records keep going offline",               summary: "From the National Identification Registry to Ministry of Finance payroll systems, legacy Oracle installations with no failover have cost the state an estimated 430 working hours in downtime this year alone. Engineers say the problem is architectural, not budgetary.", source: 'TrueRate',         time: '11 min read' },
  { category: 'Hardware',   title: "Why iPhones are flying off Monrovia streets but disappearing from formal retailers",         summary: 'A 35% import duty hike has pushed authorized resellers to pull iPhone 16 units from display, even as grey-market volumes on Randall Street hit record highs. Inside the split market and what it signals for the formal tech economy.',                                source: 'FrontPage Africa', time: '9 min read' },
  { category: 'Startups',   title: "Orange Digital Center Liberia is quietly building the country's first real DevOps pipeline", summary: 'Its new sandbox environment — funded by Orange Foundation and MEST — gives 120 Liberian engineers access to CI/CD tooling, Kubernetes clusters, and cloud credits. The long-term bet: a local talent pool that enterprises can actually hire from.',                  source: 'TrueRate Tech',    time: '10 min read' },
  { category: 'Education',  title: "BlueCrest's class of 2026: 340 new CS grads hit the market — but will the market hire them?", summary: "The country's biggest tech-adjacent graduating class enters a market where only 14% of local software jobs offer structured onboarding. A look at the pipeline gap between classrooms and production codebases.",                                                       source: 'Liberian Observer', time: '8 min read' },
  { category: 'AI',         title: "Can Liberia leapfrog traditional banking with AI credit scoring?",                           summary: 'Three Monrovia fintechs are deploying machine-learning models trained on mobile money data to extend micro-loans to unbanked Liberians in under 90 seconds.',                                                                                                         source: 'TrueRate',         time: '8 min read' },
  { category: 'Government', title: "Windows 7 in the ministries: how outdated OS installs became a national security risk",      summary: 'An internal cybersecurity review found unpatched Windows 7 machines at four ministries, some handling procurement and civil service records. The cost of migration: roughly $2.8M. The cost of not migrating: harder to calculate.',                                   source: 'The New Dawn',     time: '7 min read' },
  { category: 'Startups',   title: "The iCampus generation: how Liberia's first tech hub is producing founders",                 summary: 'Since 2020, iCampus Monrovia has trained 1,400 developers and seen 38 startups emerge. A look at what is — and isn\'t — working.',                                                                                                                                   source: 'TechCabal',        time: '10 min read' },
  { category: 'Fintech',    title: "Orange Money Liberia's billion-dollar quarter: inside the numbers",                          summary: 'An in-depth breakdown of transaction volumes, merchant acceptance rates, and the rural rollout strategy that put Liberia\'s mobile money market in focus.',                                                                                                         source: 'TrueRate',         time: '7 min read' },
  { category: 'Telecom',    title: "4G coverage hits 74%: what it means for Liberia's digital economy",                          summary: 'Lonestar MTN\'s latest rural expansion is reshaping access. But data costs remain among the highest in West Africa, limiting actual usage growth.',                                                                                                                   source: 'The New Dawn',     time: '6 min read' },
  { category: 'E-Commerce', title: "Jumia Liberia vs. local platforms: who is winning the last-mile battle?",                    summary: 'Despite Jumia\'s GMV growth, local logistics startup TruckersPro claims faster last-mile delivery in Margibi and Bong counties.',                                                                                                                                  source: 'FrontPage Africa', time: '5 min read' },
  { category: 'AI',         title: "AI in Liberia's classrooms: USAID pilots adaptive learning tools in 40 public schools",     summary: 'An $800K pilot in Montserrado County is testing AI-adaptive reading software. Early results show a 1.4-grade-level improvement in 6 months.',                                                                                                                        source: 'Liberian Observer', time: '9 min read' },
];

const UPCOMING = [
  { date: 'Apr 22', event: 'Digital Liberia Summit — Monrovia Convention Center' },
  { date: 'May 5',  event: 'MEST Africa Liberia Demo Day' },
  { date: 'May 12', event: 'CBL Digital Finance Policy Update' },
  { date: 'Jun 2',  event: 'Africa Tech Summit — Kigali (Liberian delegation)' },
];

export default function TechnologyPage() {
  return (
    <main className="mx-auto max-w-[1320px] px-4 py-6">

      {/* Breadcrumb + tabs */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Technology' }]} />
        <TechnologyTopicTabs activeSlug="all" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Main column */}
        <div className="flex-1 min-w-0">

          {/* Hero */}
          <Link href="/news" className="group flex flex-col md:flex-row gap-5 md:gap-6 no-underline mb-10 pb-10 border-b border-white/[0.07]">
            <div className="w-full md:w-[58%] shrink-0 overflow-hidden rounded-xl">
              <HeroVisual category={HERO.category} className="w-full h-[220px] sm:h-[320px] group-hover:scale-[1.02] transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-[#050d11]">Top Story</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${getCatColor(HERO.category)}`}>
                  {HERO.category}
                </span>
              </div>
              <h2 className="text-[22px] sm:text-[32px] lg:text-[32px] font-black leading-[1.1] text-white group-hover:text-white/80 transition-colors mb-4 tracking-tight">
                {HERO.title}
              </h2>
              <p className="text-[14px] leading-relaxed text-gray-400 line-clamp-3 mb-4">{HERO.summary}</p>
              <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                <span className="font-semibold text-gray-400">{HERO.source}</span>
                <span>·</span>
                <span>{HERO.time}</span>
              </div>
            </div>
          </Link>

          {/* Strip — single column list */}
          <section className="mb-10" aria-labelledby="latest-signals-heading">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-2">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
                <h2 id="latest-signals-heading" className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Latest Signals</h2>
              </div>
              <Link href="/news" className="text-[12px] text-gray-400 hover:text-white transition-colors no-underline">More ›</Link>
            </div>
            <ul className="flex flex-col divide-y divide-white/[0.05] list-none p-0 m-0">
              {STRIP_CARDS.map((card, i) => (
                <li key={i}>
                  <Link href="/news" className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-white/[0.03] -mx-2 px-2 rounded">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 ${getCatColor(card.category)}`}>
                      {card.category}
                    </p>
                    <h3 className="text-[12px] sm:text-[14px] font-semibold leading-snug text-white group-hover:text-white/75 transition-colors text-pretty">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] text-gray-500 truncate">
                      <span className="text-gray-400">{card.source}</span>
                      <span aria-hidden className="mx-1.5 text-gray-700">·</span>
                      <time>{card.time}</time>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Startup Tracker */}
          <section className="mb-10">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
              <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Startup Funding Tracker</h2>
              <span className="text-[11px] text-gray-500 uppercase tracking-wide font-bold">2026 Rounds</span>
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
              <table className="w-full min-w-[500px] text-[13px]">
                <thead className="border-b border-white/[0.07] text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="pb-3 text-left pr-4">Company</th>
                    <th className="pb-3 text-left pr-4">Sector</th>
                    <th className="pb-3 text-right pr-4">Raise</th>
                    <th className="pb-3 text-left pr-4">Stage</th>
                    <th className="hidden sm:table-cell pb-3 text-left pr-4">Investors</th>
                    <th className="hidden sm:table-cell pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {STARTUP_TRACKER.map((s, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-bold text-white pr-4">{s.name}</td>
                      <td className={`py-3 text-[10px] font-bold uppercase tracking-wide pr-4 ${getCatColor(s.sector)}`}>{s.sector}</td>
                      <td className="tabular-nums py-3 text-right font-bold text-emerald-400 pr-4">{s.raise}</td>
                      <td className="py-3 text-gray-400 pr-4">{s.stage}</td>
                      <td className="hidden sm:table-cell py-3 text-gray-500 text-[12px] pr-4">{s.investors}</td>
                      <td className="hidden sm:table-cell tabular-nums py-3 text-right text-gray-400">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Analysis feed */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">In-Depth Analysis</h2>
              </div>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.05]">
              {FEED.map((item, i) => (
                <Link key={i} href="/news" className="group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline">
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    <NewsThumbnail category={item.category} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block ${getCatColor(item.category)}`}>
                      {item.category}
                    </span>
                    <h3 className="text-[13.5px] sm:text-[12px] font-black leading-snug text-white group-hover:text-white/75 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="hidden sm:block text-[13px] leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-gray-400">
                      <span className="text-gray-500 truncate">{item.source}</span>
                      <span>·</span>
                      <span className="whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right rail */}
        <aside className="hidden lg:block w-full lg:w-[280px] shrink-0">
          <div className="sticky top-[120px] flex flex-col gap-8">

            {/* Most Read */}
            <div>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Most Read</h3>
              <ol className="space-y-4">
                {[
                  { rank: 1, title: "Ducor Pay's $4.2M raise: what the term sheet looked like", tag: 'Fintech' },
                  { rank: 2, title: 'Orange Money crosses $1B quarterly milestone',              tag: 'Fintech' },
                  { rank: 3, title: "iCampus: Liberia's 38 startups and what comes next",         tag: 'Startups' },
                  { rank: 4, title: '4G at 74% — but data costs still block adoption',            tag: 'Telecom' },
                  { rank: 5, title: "Liberia's AI policy framework: what's proposed",             tag: 'AI' },
                ].map(t => (
                  <li key={t.rank} className="flex gap-3">
                    <span className="shrink-0 text-[18px] font-black text-white/10 tabular-nums w-5 leading-none">{t.rank}</span>
                    <div className="min-w-0">
                      <Link href="/news" className="text-[12px] font-semibold text-gray-400 hover:text-white transition-colors no-underline line-clamp-2 leading-snug block">{t.title}</Link>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${getCatColor(t.tag)}`}>{t.tag}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Calendar */}
            <div>
              <h3 className="text-[12px] font-bold text-white uppercase tracking-[0.12em] border-b border-white/[0.07] pb-3 mb-4">Tech Calendar</h3>
              <div className="space-y-3">
                {UPCOMING.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 text-[11px] font-bold text-gray-400 w-12">{ev.date}</span>
                    <p className="text-[12px] text-gray-400 leading-snug">{ev.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-t border-white/[0.07] pt-6">
              <h3 className="text-[12px] font-black text-white uppercase tracking-wide mb-1">Tech Brief</h3>
              <p className="text-[12px] text-gray-500 mb-4">Liberia&apos;s digital economy stories, weekly in your inbox.</p>
              <input type="email" placeholder="Your email" className="w-full bg-transparent border-b border-white/20 px-0 py-2 text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-white/60 transition-colors mb-3" />
              <button className="w-full rounded-lg bg-white py-2 text-[13px] font-bold text-[#0a0a0d] hover:brightness-90 transition-all">
                Sign up free
              </button>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
