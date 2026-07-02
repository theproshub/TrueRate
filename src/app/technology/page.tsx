import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import TechnologyTopicTabs from '@/components/TechnologyTopicTabs';
import { fetchTechnologyArticles, toTechStory, type TechStory } from '@/lib/technology/feed';
import { newsItems } from '@/data/news';
import StickySidebar from '@/components/StickySidebar';
import NewsletterWidget from '@/components/NewsletterWidget';

export const metadata = {
  alternates: { canonical: '/technology' },
};

export const revalidate = 300; // refresh every 5 min, like /economy and /sports

/* ──────────────────────────────────────────────────────────────────────────
   MOCK CONTENT — design-preview fallback only.
   Per TrueRate's "no fabricated data" principle, this is shown ONLY when no
   real technology articles are published yet, and always behind a visible
   "Sample data" banner. The moment articles exist, the real feed takes over.
   ────────────────────────────────────────────────────────────────────────── */

const MOCK_HERO = {
  category: 'Fintech',
  categorySlug: 'fintech',
  title: "Orange Money Leads Expansion in Liberia's Mobile Money Market",
  summary: 'Orange Money Liberia is widening its lead as rural adoption and merchant-payment integrations push mobile money deeper into the formal economy.',
  source: 'TrueRate Tech',
  time: 'Jun 20, 2026',
  href: '/news',
};

const MOCK_STRIP: { category: string; title: string; source: string; time: string; href: string }[] = [
  { category: 'Fintech',    title: 'Monrovia startup Ducor Pay closes Series A to expand USSD lending across West Africa',                        source: 'TechCabal',      time: 'Jun 20, 2026',  href: '/news' },
  { category: 'Hardware',   title: 'iPhone 16 demand surges in Monrovia, but Randall Street retailers pull units as import duty hike bites margins', source: 'FrontPage Africa', time: 'Jun 20, 2026', href: '/news' },
  { category: 'Startups',   title: 'Orange Digital Center Liberia opens DevOps sandbox — first cohort of engineers begins residency',                source: 'TrueRate Tech',    time: 'Jun 20, 2026',  href: '/news' },
  { category: 'Education',  title: 'BlueCrest University lines up its biggest class yet of CS and software engineering graduates',                   source: 'Liberian Observer', time: 'Jun 20, 2026', href: '/news' },
  { category: 'Government', title: 'Audit finds ministry offices still running Windows 7; cybersecurity team warns of patch exposure',               source: 'The New Dawn',     time: 'Jun 20, 2026',  href: '/news' },
  { category: 'Government', title: 'National registry database crashes again — MoICT pledges full infrastructure audit',                            source: 'FrontPage Africa', time: 'Jun 20, 2026', href: '/news' },
  { category: 'AI',         title: 'Liberia joins AU AI Task Force, plans national AI policy framework',                                            source: 'The New Dawn',     time: 'Jun 19, 2026', href: '/news' },
  { category: 'Telecom',    title: 'Lonestar MTN extends 4G to more counties, widening national coverage',                                          source: 'FrontPage Africa', time: 'Jun 19, 2026', href: '/news' },
  { category: 'Startups',   title: "Liberia's first tech hub, iCampus, secures USAID funding to expand coding bootcamps",                           source: 'Liberian Observer', time: 'Jun 19, 2026', href: '/news' },
  { category: 'E-Commerce', title: "Jumia Liberia's sales climb as smartphone penetration deepens",                                                 source: 'Reuters',          time: 'Jun 19, 2026', href: '/news' },
];

const MOCK_FEED: { category: string; title: string; summary: string; source: string; time: string; href: string }[] = [
  { category: 'Government', title: "Inside Liberia's database crisis: why government records keep going offline",               summary: "From the National Identification Registry to Ministry of Finance payroll systems, legacy Oracle installations with no failover have cost the state an estimated 430 working hours in downtime this year alone. Engineers say the problem is architectural, not budgetary.", source: 'TrueRate',         time: '11 min read', href: '/news' },
  { category: 'Hardware',   title: "Why iPhones are flying off Monrovia streets but disappearing from formal retailers",         summary: 'A 35% import duty hike has pushed authorized resellers to pull iPhone 16 units from display, even as grey-market volumes on Randall Street hit record highs. Inside the split market and what it signals for the formal tech economy.',                                source: 'FrontPage Africa', time: '9 min read', href: '/news' },
  { category: 'Startups',   title: "Orange Digital Center Liberia is quietly building the country's first real DevOps pipeline", summary: 'Its new sandbox environment — funded by Orange Foundation and MEST — gives 120 Liberian engineers access to CI/CD tooling, Kubernetes clusters, and cloud credits. The long-term bet: a local talent pool that enterprises can actually hire from.',                  source: 'TrueRate Tech',    time: '10 min read', href: '/news' },
  { category: 'Education',  title: "BlueCrest's class of 2026: a wave of new CS grads hits the market — but will the market hire them?", summary: "The country's biggest tech-adjacent graduating class enters a market where few local software jobs offer structured onboarding. A look at the pipeline gap between classrooms and production codebases.",                                                       source: 'Liberian Observer', time: '8 min read', href: '/news' },
  { category: 'AI',         title: "Can Liberia leapfrog traditional banking with AI credit scoring?",                           summary: 'Several Monrovia fintechs are deploying machine-learning models trained on mobile money data to extend micro-loans to unbanked Liberians within minutes.',                                                                                                          source: 'TrueRate',         time: '8 min read', href: '/news' },
  { category: 'Government', title: "Windows 7 in the ministries: how outdated OS installs became a national security risk",      summary: 'An internal cybersecurity review found unpatched Windows 7 machines at four ministries, some handling procurement and civil service records. The cost of migration runs into the millions; the cost of not migrating is harder to calculate.',                        source: 'The New Dawn',     time: '7 min read', href: '/news' },
  { category: 'Startups',   title: "The iCampus generation: how Liberia's first tech hub is producing founders",                 summary: 'Since 2020, iCampus Monrovia has trained hundreds of developers and helped dozens of startups emerge. A look at what is — and isn\'t — working.',                                                                                                                    source: 'TechCabal',        time: '10 min read', href: '/news' },
  { category: 'Fintech',    title: "Orange Money Liberia's breakout quarter: inside the numbers",                                summary: 'An in-depth breakdown of transaction volumes, merchant acceptance rates, and the rural rollout strategy that put Liberia\'s mobile money market in focus.',                                                                                                         source: 'TrueRate',         time: '7 min read', href: '/news' },
  { category: 'Telecom',    title: "Liberia's widening 4G coverage: what it means for the digital economy",                      summary: 'Lonestar MTN\'s latest rural expansion is reshaping access. But data costs remain among the highest in West Africa, limiting actual usage growth.',                                                                                                                   source: 'The New Dawn',     time: '6 min read', href: '/news' },
  { category: 'E-Commerce', title: "Jumia Liberia vs. local platforms: who is winning the last-mile battle?",                    summary: 'Despite Jumia\'s sales growth, local logistics startup TruckersPro claims faster last-mile delivery in Margibi and Bong counties.',                                                                                                                                 source: 'FrontPage Africa', time: '5 min read', href: '/news' },
  { category: 'AI',         title: "AI in Liberia's classrooms: USAID pilots adaptive learning tools in public schools",        summary: 'A USAID pilot in Montserrado County is testing AI-adaptive reading software. Early results point to meaningful reading gains within months.',                                                                                                                       source: 'Liberian Observer', time: '9 min read', href: '/news' },
];

const MOCK_UPCOMING = [
  { date: 'Apr 22', event: 'Digital Liberia Summit — Monrovia Convention Center' },
  { date: 'May 5',  event: 'MEST Africa Liberia Demo Day' },
  { date: 'May 12', event: 'CBL Digital Finance Policy Update' },
  { date: 'Jun 2',  event: 'Africa Tech Summit — Kigali (Liberian delegation)' },
];

const MOCK_MOST_READ = [
  { title: "Ducor Pay's Series A: what the term sheet looked like",     tag: 'Fintech' },
  { title: 'Orange Money crosses a major quarterly milestone',          tag: 'Fintech' },
  { title: "iCampus: inside Liberia's startup pipeline and what's next", tag: 'Startups' },
  { title: '4G is spreading — but data costs still block adoption',     tag: 'Telecom' },
  { title: "Liberia's AI policy framework: what's proposed",            tag: 'AI' },
];

/* ── Common card shape rendered by the page (satisfied by both DB + mock). ── */
type Card = {
  category: string;
  categorySlug?: string;
  title: string;
  summary?: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;
};

function storyToCard(s: TechStory): Card {
  return {
    category: s.category,
    categorySlug: s.categorySlug,
    title: s.title,
    summary: s.dek,
    source: s.author ?? 'TrueRate Tech',
    time: s.time,
    href: s.href,
    image: s.image,
  };
}

export default async function TechnologyPage() {
  const db = await fetchTechnologyArticles({ limit: 24 });
  const useDb = db.length > 0;
  const stories = db.map(toTechStory);

  const TECH_CATS = new Set(['technology', 'startups', 'ai']);
  const seedArticles: Card[] = newsItems
    .filter((n) => TECH_CATS.has(n.category))
    .map((n) => ({
      category: n.category.charAt(0).toUpperCase() + n.category.slice(1),
      categorySlug: n.category,
      title: n.title,
      summary: n.summary,
      source: n.author ?? n.source,
      time: (() => { const d = new Date(n.date); const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; })(),
      href: `/news/${n.id}`,
      image: n.image ?? null,
    }));
  const hasSeed = seedArticles.length > 0;

  const hero: Card = useDb ? storyToCard(stories[0]) : hasSeed ? seedArticles[0] : MOCK_HERO;
  const leads: Card[] = useDb ? stories.slice(1, 4).map(storyToCard) : hasSeed ? seedArticles.slice(1, 4) : MOCK_STRIP.slice(0, 3);
  const strip: Card[] = useDb ? stories.slice(4, 12).map(storyToCard) : MOCK_STRIP;
  const feed: Card[] = useDb
    ? stories.slice(1).filter((s) => s.dek).slice(0, 10).map(storyToCard)
    : MOCK_FEED;

  return (
    <>
      {/* Sample-data notice — only while running on placeholder content. */}
      {!useDb && !hasSeed && (
        <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
          <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="leading-snug">
              <span className="font-bold uppercase tracking-wide">Sample data</span>
              {' — '}
              this section uses placeholder content for design preview. Headlines and figures are
              illustrative, not real reporting. They disappear automatically once technology stories
              are published.
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-container px-4 py-6">

        {/* Breadcrumb + tabs */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Technology' }]} />
          <TechnologyTopicTabs activeSlug="all" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">
          {/* Main column */}
          <div className="flex-1 min-w-0 lg:pr-5">

            {/* Hero */}
            <Link href={hero.href} className="group flex flex-col md:flex-row gap-5 md:gap-6 no-underline mb-6 pb-6 border-b border-gray-200">
              <div className="w-full md:w-[58%] shrink-0 overflow-hidden rounded-xl">
                {hero.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={hero.image} alt="" className="w-full h-[220px] sm:h-[320px] object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <HeroVisual category={hero.categorySlug ?? hero.category} className="w-full h-[220px] sm:h-[320px] group-hover:scale-[1.02] transition-transform duration-500" />
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded px-2 py-0.5 text-2xs font-black uppercase tracking-widest bg-brand-accent text-brand-accent-ink">Top Story</span>
                  <span className={`text-2xs font-bold uppercase tracking-widest ${getCatColor(hero.categorySlug ?? hero.category)}`}>
                    {hero.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-[1.1] text-gray-900 group-hover:underline decoration-1 underline-offset-2 mb-4 tracking-tight">
                  {hero.title}
                </h1>
                {hero.summary && <p className="text-md leading-relaxed text-gray-500 line-clamp-3 mb-4">{hero.summary}</p>}
                <div className="flex items-center gap-2 mt-auto text-sm text-gray-500">
                  <span className="font-semibold text-gray-500">{hero.source}</span>
                  <span>·</span>
                  <span>{hero.time}</span>
                </div>
              </div>
            </Link>

            {/* Top Stories — 3-up lead row under the hero */}
            {leads.length > 0 && (
              <section className="mb-8" aria-labelledby="top-stories-heading">
                <h2 id="top-stories-heading" className="sr-only">More top stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pb-6 border-b border-gray-200">
                  {leads.map((card, i) => (
                    <Link key={card.href + i} href={card.href} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark rounded">
                      <div className="overflow-hidden rounded-lg mb-3">
                        <NewsThumbnail category={card.categorySlug ?? card.category} src={card.image ?? undefined} className="w-full h-[160px] group-hover:scale-[1.03] transition-transform duration-500" />
                      </div>
                      <span className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${getCatColor(card.categorySlug ?? card.category)}`}>
                        {card.category}
                      </span>
                      <h3 className="text-md font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 line-clamp-3 text-pretty">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-500 truncate">
                        <span className="text-gray-500">{card.source}</span>
                        <span aria-hidden className="mx-1.5 text-gray-700">·</span>
                        <time>{card.time}</time>
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Strip — single column list */}
            {strip.length > 0 && (
              <section className="mb-6" aria-labelledby="latest-signals-heading">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
                    <h2 id="latest-signals-heading" className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">{useDb ? 'Latest in Technology' : 'Latest Signals'}</h2>
                  </div>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
                </div>
                <ul className="flex flex-col divide-y divide-gray-200 list-none p-0 m-0">
                  {strip.map((card, i) => (
                    <li key={card.href + i}>
                      <Link href={card.href} className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-white -mx-2 px-2 rounded">
                        <p className={`text-2xs font-bold uppercase tracking-[0.12em] mb-1.5 ${getCatColor(card.categorySlug ?? card.category)}`}>
                          {card.category}
                        </p>
                        <h3 className="text-sm sm:text-md font-semibold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 text-pretty">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 truncate">
                          <span className="text-gray-500">{card.source}</span>
                          <span aria-hidden className="mx-1.5 text-gray-700">·</span>
                          <time>{card.time}</time>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* In-Depth feed */}
            {feed.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">In-Depth Analysis</h2>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-gray-200">
                  {feed.map((item, i) => (
                    <Link key={item.href + i} href={item.href} className="group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline">
                      <div className="shrink-0 overflow-hidden rounded-lg">
                        <NewsThumbnail category={item.categorySlug ?? item.category} src={item.image ?? undefined} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-2xs font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block ${getCatColor(item.categorySlug ?? item.category)}`}>
                          {item.category}
                        </span>
                        <h3 className="text-base sm:text-sm font-bold leading-snug text-gray-900 group-hover:underline decoration-1 underline-offset-2 mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.summary && <p className="hidden sm:block text-base leading-relaxed text-gray-500 line-clamp-2 mb-2">{item.summary}</p>}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="text-gray-500 truncate">{item.source}</span>
                          <span>·</span>
                          <span className="whitespace-nowrap">{item.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right rail — visible on mobile too (newsletter + calendar);
              Most Read is desktop-only since it duplicates the main feed. */}
          <aside className="w-full lg:w-[280px] shrink-0 lg:border-l lg:border-gray-200 lg:pl-5" aria-label="Technology sidebar">
            <StickySidebar>

              {/* More from / Most Read — real recent articles in DB mode (no
                  fabricated "most read"), mock list only in preview mode. */}
              <div className="hidden lg:block rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">{useDb || hasSeed ? 'More from Technology' : 'Most Read'}</h3>
                <ol className="flex flex-col divide-y divide-gray-200">
                  {useDb
                    ? stories.slice(0, 6).map((s, i) => (
                        <li key={s.href + i} className="py-2.5 first:pt-0">
                          <Link href={s.href} className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                            <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getCatColor(s.categorySlug)}`}>{s.category}</span>
                            {s.title}
                          </Link>
                        </li>
                      ))
                    : hasSeed
                    ? seedArticles.map((s, i) => (
                        <li key={s.href + i} className="py-2.5 first:pt-0">
                          <Link href={s.href} className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                            <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getCatColor(s.categorySlug ?? s.category)}`}>{s.category}</span>
                            {s.title}
                          </Link>
                        </li>
                      ))
                    : MOCK_MOST_READ.map((t, i) => (
                        <li key={i} className="py-2.5 first:pt-0">
                          <Link href="/news" className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                            <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getCatColor(t.tag)}`}>{t.tag}</span>
                            {t.title}
                          </Link>
                        </li>
                      ))}
                </ol>
              </div>

              {/* Tech Calendar — forward-looking schedule with no live source,
                  shown ONLY in design-preview (mock) mode. */}
              {!useDb && (
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-3">Tech Calendar</h3>
                  <div className="flex flex-col divide-y divide-gray-200">
                    {MOCK_UPCOMING.map((ev, i) => (
                      <div key={i} className="py-2.5 first:pt-0">
                        <p className="text-xs font-semibold text-brand-accent-ink mb-0.5">{ev.date}</p>
                        <p className="text-sm font-semibold text-gray-700 leading-snug">{ev.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <NewsletterWidget title="Tech Brief" description="Liberia's digital economy stories, weekly in your inbox." />

            </StickySidebar>
          </aside>
        </div>
      </main>
    </>
  );
}
