import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import EntertainmentTopicTabs from '@/components/EntertainmentTopicTabs';
import { fetchEntertainmentArticles, toEntStory, type EntStory } from '@/lib/entertainment/feed';

export const metadata = {
  alternates: { canonical: '/entertainment' },
};

export const revalidate = 300; // refresh every 5 min, like /economy and /sports

/* ──────────────────────────────────────────────────────────────────────────
   MOCK CONTENT — design-preview fallback only.
   Per TrueRate's "no fabricated data" principle, this is shown ONLY when no
   real entertainment articles are published yet, and always behind a visible
   "Sample data" banner. The moment articles exist, the real feed takes over.
   ────────────────────────────────────────────────────────────────────────── */

const MOCK_HERO = {
  category: 'Movies',
  categorySlug: 'movies',
  title: "Nollywood-Liberia Co-Production 'Sundown in Sinkor' Opens to Record Diaspora Pre-Sales",
  summary: "The feature, shot in Monrovia and Lagos and produced by Filmhouse Group with Liberian co-producer Patrice Juah, is drawing strong diaspora demand across the U.S., U.K., and West African corridor ahead of its theatrical release.",
  source: 'TrueRate Culture',
  time: '1h ago',
  href: '/news',
};

const MOCK_STRIP: { category: string; title: string; source: string; time: string; href: string }[] = [
  { category: 'Music',     title: "Hipco star Bucky Raw lines up Madison Square Garden warm-up date — first Liberian artist to play the Garden as a billed act",       source: 'TrueRate Culture',  time: '2h ago',  href: '/news' },
  { category: 'TV',        title: "Showmax orders second season of Monrovia-set crime drama 'Bassa Avenue' after a strong streaming debut",                            source: 'FrontPage Africa', time: '3h ago',  href: '/news' },
  { category: 'Celebrity', title: "George Weah's son Timothy makes surprise cameo at Liberian Music Awards — performs an unreleased verse with MC Caro",               source: 'Liberian Observer', time: '5h ago',  href: '/news' },
  { category: 'Movies',    title: "Cannes Marché du Film accepts three Liberian shorts — first time more than one Liberian title has been picked in a single edition", source: 'TrueRate Culture',  time: '6h ago',  href: '/news' },
  { category: 'Music',     title: "Afrobeats festival 'Lib Wave' confirms Davido, Tems, and Stonebwoy headliners for Antoinette Tubman Stadium July 27",               source: 'The New Dawn',     time: '7h ago',  href: '/news' },
  { category: 'TV',        title: "Liberia Broadcasting System overhauls primetime slate — drops 9pm news for a 30-minute Kolokwa magazine show",                      source: 'FrontPage Africa', time: '9h ago',  href: '/news' },
  { category: 'Celebrity', title: "Liberian-American actress Wayétu Moore optioned by A24 for a memoir adaptation she'll co-produce",                                  source: 'Variety',          time: '10h ago', href: '/news' },
  { category: 'Movies',    title: "Boakai administration approves a rebate for foreign productions shooting on Liberian soil — Lagos studios already inquiring",          source: 'TrueRate',         time: '12h ago', href: '/news' },
  { category: 'Music',     title: "Streaming royalties for Liberian artists climb sharply as Spotify expands MTN-bundled plans",                                       source: 'TrueRate Culture',  time: '14h ago', href: '/news' },
  { category: 'TV',        title: "Netflix Africa scouts a Monrovia office — sources say a first slate of Liberian originals could follow",                            source: 'TechCabal',        time: '18h ago', href: '/news' },
];

const MOCK_RELEASES = [
  { title: 'Sundown in Sinkor',         type: 'Movie',   creator: 'Patrice Juah · Filmhouse',     release: 'May 2',  platform: 'Theatrical · Diaspora' },
  { title: 'Mama Salone (Season 2)',    type: 'TV',      creator: 'Showmax Originals',            release: 'May 9',  platform: 'Showmax'                },
  { title: 'Kolokwa Love Songs',        type: 'Album',   creator: 'Soul Fresh',                   release: 'May 14', platform: 'Spotify · Apple Music'  },
  { title: 'Bassa Avenue (Season 2)',   type: 'TV',      creator: 'Showmax Originals',            release: 'Jun 6',  platform: 'Showmax'                },
  { title: 'Lib Wave 2026',             type: 'Concert', creator: 'Lib Wave Live',                release: 'Jul 27', platform: 'Antoinette Tubman Stadium' },
  { title: 'Hipco Anthology Vol. III',  type: 'Album',   creator: 'Christoph the Change',         release: 'Aug 11', platform: 'YouTube · Audiomack'    },
];

const MOCK_FEED: { category: string; title: string; summary: string; source: string; time: string; href: string }[] = [
  { category: 'Movies',    title: "Inside the financing of 'Sundown in Sinkor': how the Nollywood-Liberia co-pro got made",            summary: "From a Lagos completion-bond facility to a Monrovia tax rebate that didn't yet exist when production started, a behind-the-scenes look at the deal stack that put Liberia back on the West African film map.",                source: 'TrueRate Culture',  time: '11 min read', href: '/news' },
  { category: 'Music',     title: "Bucky Raw at the Garden: how Liberia's hipco generation finally crossed over",                     summary: 'A decade after Takun J brought Kolokwa rap into the Liberian mainstream, an MSG-warm-up booking signals the genre has crossed the diaspora threshold. We trace the streaming numbers, the tour math, and what comes next.', source: 'TrueRate Culture',  time: '9 min read',  href: '/news' },
  { category: 'TV',        title: "'Bassa Avenue' and the streaming math: a hit debut, but is it actually profitable for Showmax?",  summary: 'Streaming hits in West Africa rarely translate to franchise economics the way they do in Lagos or Nairobi. We break down the per-stream payout, production cost, and renewal calculus.',                                source: 'FrontPage Africa', time: '8 min read',  href: '/news' },
  { category: 'Celebrity', title: "Wayétu Moore's A24 deal isn't just a book sale — it's a foothold for Liberian voices in U.S. prestige TV", summary: 'The novelist-turned-co-producer is the most senior Liberian creator inside an American studio system right now. Why that matters for the next ten years of the diaspora pipeline.',                                source: 'Variety',          time: '7 min read',  href: '/news' },
  { category: 'Movies',    title: "Liberia's new film rebate: what the incentive actually does — and what it leaves out",            summary: 'Below-the-line crew, post-production, and music licensing are still excluded. A pragmatic read on whether the new policy attracts real productions or just paperwork.',                                                source: 'TrueRate',         time: '8 min read',  href: '/news' },
  { category: 'Music',     title: "Streaming royalties grew for Liberian artists in 2025 — but distribution is brutally uneven",      summary: 'A small group of top artists captured the bulk of total payouts. We pulled DistroKid and Audiomack data and compared it with Nigeria and Ghana to show how concentrated Liberia\'s streaming market still is.',          source: 'TrueRate Culture',  time: '10 min read', href: '/news' },
  { category: 'TV',        title: "Why Netflix scouting Monrovia matters more than the headlines suggest",                            summary: 'The platform has cooled on African originals after the 2024 reorganisation. A Liberia office — even a small one — would signal a recommitment that goes well beyond Lagos and Cape Town.',                                source: 'TechCabal',        time: '6 min read',  href: '/news' },
  { category: 'Celebrity', title: "Liberian Music Awards 2026: the winners, the snubs, and the power shift no one's writing about",   summary: "A new generation of female hipco and gospel artists swept the night. The boardroom story behind the votes is more interesting than the trophies.",                                                                          source: 'Liberian Observer', time: '7 min read',  href: '/news' },
  { category: 'Music',     title: "Lib Wave's logistics gamble: putting Davido, Tems, and Stonebwoy on the same Monrovia stage",       summary: 'Tour-routing, hotel inventory, and stadium upgrades that still don\'t exist. Inside the operational risk a Liberian promoter is taking with a single July date.',                                                          source: 'The New Dawn',     time: '8 min read',  href: '/news' },
  { category: 'Movies',    title: "Cannes' 2026 Liberian shorts: full breakdown of the three films and what each is selling",         summary: 'A documentary on the LRD, a coming-of-age set in Paynesville, and a horror short shot in Bong County. We watched all three.',                                                                                            source: 'TrueRate Culture',  time: '9 min read',  href: '/news' },
];

const MOCK_UPCOMING = [
  { date: 'May 2',  event: "'Sundown in Sinkor' theatrical release — Monrovia, NYC, London" },
  { date: 'May 9',  event: "'Mama Salone' Season 2 drops — Showmax" },
  { date: 'May 14', event: 'Soul Fresh — Kolokwa Love Songs album release' },
  { date: 'Jul 27', event: 'Lib Wave 2026 — Antoinette Tubman Stadium' },
];

const MOCK_MOST_READ = [
  { title: "'Sundown in Sinkor' pre-sales surge — diaspora theaters add screens",             tag: 'Movies' },
  { title: "Bucky Raw books MSG warm-up — first Liberian artist on the bill",                tag: 'Music' },
  { title: "Showmax greenlights 'Bassa Avenue' Season 2 after a strong debut",                tag: 'TV' },
  { title: "Wayétu Moore signs A24 memoir option — co-producer credit attached",              tag: 'Celebrity' },
  { title: "Lib Wave confirms Davido, Tems, Stonebwoy for July 27",                            tag: 'Music' },
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

function storyToCard(s: EntStory): Card {
  return {
    category: s.category,
    categorySlug: s.categorySlug,
    title: s.title,
    summary: s.dek,
    source: s.author ?? 'TrueRate Culture',
    time: s.time,
    href: s.href,
    image: s.image,
  };
}

export default async function EntertainmentPage() {
  // Backend-first: real published entertainment articles drive every surface.
  // Until any are published, the mock content keeps the design preview full and
  // a "Sample data" banner makes the placeholder status unmistakable.
  const db = await fetchEntertainmentArticles({ limit: 24 });
  const useDb = db.length > 0;
  const stories = db.map(toEntStory);

  const hero: Card = useDb ? storyToCard(stories[0]) : MOCK_HERO;
  const leads: Card[] = useDb ? stories.slice(1, 4).map(storyToCard) : MOCK_STRIP.slice(0, 3);
  const strip: Card[] = useDb ? stories.slice(4, 12).map(storyToCard) : MOCK_STRIP.slice(3);
  const feed: Card[] = useDb
    ? stories.slice(1).filter((s) => s.dek).slice(0, 9).map(storyToCard)
    : MOCK_FEED;

  return (
    <main className="bg-white min-h-screen">
      {/* Sample-data notice — only while running on placeholder content. */}
      {!useDb && (
        <div role="note" aria-label="Sample data notice" className="bg-amber-400 text-amber-950">
          <div className="mx-auto max-w-container px-4 py-2 flex items-start gap-2 text-sm">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <p className="leading-snug">
              <span className="font-bold uppercase tracking-wide">Sample data</span>
              {' — '}
              this section uses placeholder content for design preview. Titles, release dates and
              figures are illustrative, not real reporting. They disappear automatically once
              entertainment stories are published.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-container px-4 py-6">

        {/* Breadcrumb + tabs */}
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Entertainment' }]} />
          <EntertainmentTopicTabs activeSlug="all" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          {/* Main column */}
          <div className="flex-1 min-w-0">

            {/* Hero */}
            <Link href={hero.href} className="group flex flex-col md:flex-row gap-5 md:gap-6 no-underline mb-6 pb-6 border-b border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded">
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
                  <span className="rounded px-2 py-0.5 text-2xs font-black uppercase tracking-widest bg-brand-accent text-brand-dark">Top Story</span>
                  <span className="text-2xs font-bold uppercase tracking-widest text-gray-500">
                    {hero.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-[1.1] text-gray-900 group-hover:text-gray-700 transition-colors mb-4 tracking-tight text-balance">
                  {hero.title}
                </h1>
                {hero.summary && <p className="text-md leading-relaxed text-gray-600 line-clamp-3 mb-4">{hero.summary}</p>}
                <div className="flex items-center gap-2 mt-auto text-sm text-gray-500">
                  <span className="font-semibold text-gray-600">{hero.source}</span>
                  <span aria-hidden>·</span>
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
                    <Link key={card.href + i} href={card.href} className="group flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded">
                      <div className="overflow-hidden rounded-lg mb-3">
                        <NewsThumbnail category={card.categorySlug ?? card.category} src={card.image ?? undefined} className="w-full h-[160px] group-hover:scale-[1.03] transition-transform duration-500" />
                      </div>
                      <span className={`text-2xs font-bold uppercase tracking-widest mb-1.5 ${getCatColor(card.categorySlug ?? card.category)}`}>
                        {card.category}
                      </span>
                      <h3 className="text-md font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-3 text-pretty">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-500 truncate">
                        <span className="text-gray-600">{card.source}</span>
                        <span aria-hidden className="mx-1.5 text-gray-300">·</span>
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
                    <h2 id="latest-signals-heading" className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">{useDb ? 'Latest in Entertainment' : 'Stories For You'}</h2>
                  </div>
                  <Link href="/news" className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
                </div>
                <ul className="flex flex-col divide-y divide-gray-200 list-none p-0 m-0">
                  {strip.map((card, i) => (
                    <li key={card.href + i}>
                      <Link href={card.href} className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-gray-50 -mx-2 px-2 rounded">
                        <p className={`text-2xs font-bold uppercase tracking-[0.12em] mb-1.5 ${getCatColor(card.categorySlug ?? card.category)}`}>
                          {card.category}
                        </p>
                        <h3 className="text-sm sm:text-md font-semibold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors text-pretty">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 truncate">
                          <span className="text-gray-600">{card.source}</span>
                          <span aria-hidden className="mx-1.5 text-gray-300">·</span>
                          <time>{card.time}</time>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Releases tracker — forward-looking schedule with no live source,
                so it is shown ONLY in design-preview (mock) mode. */}
            {!useDb && (
              <section className="mb-6" aria-labelledby="releases-heading">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                  <h2 id="releases-heading" className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">Releases This Quarter</h2>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Q2–Q3 2026</span>
                </div>
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                  <table className="w-full min-w-[500px] text-base">
                    <caption className="sr-only">Upcoming Liberian and West African entertainment releases (sample data)</caption>
                    <thead className="border-b border-gray-200 text-2xs font-bold uppercase tracking-wide text-gray-500">
                      <tr>
                        <th scope="col" className="pb-3 text-left pr-4">Title</th>
                        <th scope="col" className="pb-3 text-left pr-4">Type</th>
                        <th scope="col" className="pb-3 text-left pr-4">Creator</th>
                        <th scope="col" className="pb-3 text-right pr-4">Release</th>
                        <th scope="col" className="hidden sm:table-cell pb-3 text-left">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {MOCK_RELEASES.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 font-bold text-gray-900 pr-4">{r.title}</td>
                          <td className="py-3 text-2xs font-bold uppercase tracking-wide text-gray-500 pr-4">{r.type}</td>
                          <td className="py-3 text-gray-600 pr-4">{r.creator}</td>
                          <td className="tabular-nums py-3 text-right font-bold text-brand-accent-ink pr-4">{r.release}</td>
                          <td className="hidden sm:table-cell py-3 text-gray-500 text-sm">{r.platform}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* In-Depth feed */}
            {feed.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-[0.12em]">In-Depth</h2>
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
                        <h3 className="text-base sm:text-sm font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.summary && <p className="hidden sm:block text-base leading-relaxed text-gray-600 line-clamp-2 mb-2">{item.summary}</p>}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                          <span className="text-gray-500 truncate">{item.source}</span>
                          <span aria-hidden>·</span>
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
          <aside className="w-full lg:w-[280px] shrink-0" aria-label="Entertainment sidebar">
            <div className="lg:sticky lg:top-header-lg flex flex-col gap-5">

              {/* More from / Most Read — real recent articles in DB mode (no
                  fabricated "most read"), mock list only in preview mode. */}
              <div className="hidden lg:block">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">{useDb ? 'More from Entertainment' : 'Most Read'}</h3>
                <ol className="flex flex-col divide-y divide-gray-100">
                  {useDb
                    ? stories.slice(0, 6).map((s, i) => (
                        <li key={s.href + i} className="py-2.5 first:pt-0">
                          <Link href={s.href} className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                            <span className={`font-bold uppercase text-2xs tracking-wide mr-1.5 ${getCatColor(s.categorySlug)}`}>{s.category}</span>
                            {s.title}
                          </Link>
                        </li>
                      ))
                    : MOCK_MOST_READ.map((t, i) => (
                        <li key={i} className="py-2.5 first:pt-0">
                          <Link href="/news" className="text-sm font-medium text-gray-700 hover:text-brand-accent-ink transition-colors no-underline line-clamp-2 leading-snug block">
                            <span className="font-bold uppercase text-2xs tracking-wide mr-1.5 text-gray-400">{t.tag}</span>
                            {t.title}
                          </Link>
                        </li>
                      ))}
                </ol>
              </div>

              {/* Culture Calendar — sample schedule, design-preview only. */}
              {!useDb && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Culture Calendar</h3>
                  <div className="flex flex-col divide-y divide-gray-100">
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
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">Entertainment Brief</h3>
                <p className="inline-flex items-center min-h-[44px] -my-2 px-1 -mx-1 text-sm text-gray-500 mb-4">Liberian film, music, and culture stories — weekly in your inbox.</p>
                <form aria-label="Sign up for the Entertainment Brief newsletter">
                  <label htmlFor="ent-email" className="sr-only">Email address</label>
                  <input id="ent-email" type="email" required placeholder="Your email" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
                  <button type="submit" className="w-full rounded-lg bg-gray-900 py-2 text-base font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
                    Sign up free
                  </button>
                </form>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
