import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { getCatColor } from '@/lib/category-colors';
import EntertainmentTopicTabs from '@/components/EntertainmentTopicTabs';

const HERO = {
  category: 'Movies',
  title: "Nollywood-Liberia co-production 'Sundown in Sinkor' opens to record diaspora pre-sales — biggest Liberian film launch in five years",
  summary: "The $1.4M feature, shot in Monrovia and Lagos and produced by Filmhouse Group with Liberian co-producer Patrice Juah, has crossed 38,000 pre-sale tickets across the U.S., U.K., and West African corridor ahead of its May 2 theatrical release.",
  source: 'TrueRate Culture',
  time: '1h ago',
};

const STRIP_CARDS = [
  { category: 'Music',     title: "Hipco star Bucky Raw lines up Madison Square Garden warm-up date — first Liberian artist to play the Garden as a billed act",       source: 'TrueRate Culture',  time: '2h ago' },
  { category: 'TV',        title: "Showmax orders second season of Monrovia-set crime drama 'Bassa Avenue' after 4.1M streams in opening month",                       source: 'FrontPage Africa', time: '3h ago' },
  { category: 'Celebrity', title: "George Weah's son Timothy makes surprise cameo at Liberian Music Awards — performs an unreleased verse with MC Caro",               source: 'Liberian Observer', time: '5h ago' },
  { category: 'Movies',    title: "Cannes Marché du Film accepts three Liberian shorts — first time more than one Liberian title has been picked in a single edition", source: 'TrueRate Culture',  time: '6h ago' },
  { category: 'Music',     title: "Afrobeats festival 'Lib Wave' confirms Davido, Tems, and Stonebwoy headliners for Antoinette Tubman Stadium July 27",               source: 'The New Dawn',     time: '7h ago' },
  { category: 'TV',        title: "Liberia Broadcasting System overhauls primetime slate — drops 9pm news for a 30-minute Kolokwa magazine show",                      source: 'FrontPage Africa', time: '9h ago' },
  { category: 'Celebrity', title: "Liberian-American actress Wayétu Moore optioned by A24 for a memoir adaptation she'll co-produce",                                  source: 'Variety',          time: '10h ago' },
  { category: 'Movies',    title: "Boakai administration approves 15% rebate for foreign productions shooting on Liberian soil — Lagos studios already inquiring",      source: 'TrueRate',         time: '12h ago' },
  { category: 'Music',     title: "Streaming royalties from Liberian artists hit $2.3M in 2025 — up 64% YoY as Spotify expands MTN-bundled plans",                     source: 'TrueRate Culture',  time: '14h ago' },
  { category: 'TV',        title: "Netflix Africa scouts a Monrovia office — sources say first slate of Liberian originals could land Q4 2026",                        source: 'TechCabal',        time: '18h ago' },
];

const RELEASES = [
  { title: 'Sundown in Sinkor',         type: 'Movie',   creator: 'Patrice Juah · Filmhouse',     release: 'May 2',  platform: 'Theatrical · Diaspora' },
  { title: 'Mama Salone (Season 2)',    type: 'TV',      creator: 'Showmax Originals',            release: 'May 9',  platform: 'Showmax'                },
  { title: 'Kolokwa Love Songs',        type: 'Album',   creator: 'Soul Fresh',                   release: 'May 14', platform: 'Spotify · Apple Music'  },
  { title: 'Bassa Avenue (Season 2)',   type: 'TV',      creator: 'Showmax Originals',            release: 'Jun 6',  platform: 'Showmax'                },
  { title: 'Lib Wave 2026',             type: 'Concert', creator: 'Lib Wave Live',                release: 'Jul 27', platform: 'Antoinette Tubman Stadium' },
  { title: 'Hipco Anthology Vol. III',  type: 'Album',   creator: 'Christoph the Change',         release: 'Aug 11', platform: 'YouTube · Audiomack'    },
];

const FEED = [
  { category: 'Movies',    title: "Inside the financing of 'Sundown in Sinkor': how a $1.4M Nollywood-Liberia co-pro got made",       summary: "From a Lagos completion-bond facility to a Monrovia tax rebate that didn't yet exist when production started, a behind-the-scenes look at the deal stack that put Liberia back on the West African film map.",                source: 'TrueRate Culture',  time: '11 min read' },
  { category: 'Music',     title: "Bucky Raw at the Garden: how Liberia's hipco generation finally crossed over",                     summary: 'A decade after Takun J brought Kolokwa rap into the Liberian mainstream, an MSG-warm-up booking signals the genre has crossed the diaspora threshold. We trace the streaming numbers, the tour math, and what comes next.', source: 'TrueRate Culture',  time: '9 min read'  },
  { category: 'TV',        title: "'Bassa Avenue' and the streaming math: 4.1M streams, but is it actually profitable for Showmax?", summary: 'Streaming hits in West Africa rarely translate to franchise economics the way they do in Lagos or Nairobi. We break down the per-stream payout, production cost, and renewal calculus.',                                source: 'FrontPage Africa', time: '8 min read'  },
  { category: 'Celebrity', title: "Wayétu Moore's A24 deal isn't just a book sale — it's a foothold for Liberian voices in U.S. prestige TV", summary: 'The novelist-turned-co-producer is the most senior Liberian creator inside an American studio system right now. Why that matters for the next ten years of the diaspora pipeline.',                                source: 'Variety',          time: '7 min read'  },
  { category: 'Movies',    title: "The 15% rebate: what Liberia's new film incentive actually does — and what it leaves out",        summary: 'Below-the-line crew, post-production, and music licensing are still excluded. A pragmatic read on whether the new policy attracts real productions or just paperwork.',                                                source: 'TrueRate',         time: '8 min read'  },
  { category: 'Music',     title: "Streaming royalties cleared $2M for Liberian artists in 2025 — but distribution is brutally uneven", summary: 'Top-decile artists captured 78% of total payouts. We pulled DistroKid and Audiomack data and compared it with Nigeria and Ghana to show how concentrated Liberia\'s streaming market still is.',                       source: 'TrueRate Culture',  time: '10 min read' },
  { category: 'TV',        title: "Why Netflix scouting Monrovia matters more than the headlines suggest",                            summary: 'The platform has cooled on African originals after the 2024 reorganisation. A Liberia office — even a small one — would signal a recommitment that goes well beyond Lagos and Cape Town.',                                source: 'TechCabal',        time: '6 min read'  },
  { category: 'Celebrity', title: "Liberian Music Awards 2026: the winners, the snubs, and the power shift no one's writing about",   summary: "A new generation of female hipco and gospel artists swept the night. The boardroom story behind the votes is more interesting than the trophies.",                                                                          source: 'Liberian Observer', time: '7 min read'  },
  { category: 'Music',     title: "Lib Wave's logistics gamble: putting Davido, Tems, and Stonebwoy on the same Monrovia stage",       summary: 'Tour-routing, hotel inventory, and stadium upgrades that still don\'t exist. Inside the operational risk a Liberian promoter is taking with a single July date.',                                                          source: 'The New Dawn',     time: '8 min read'  },
  { category: 'Movies',    title: "Cannes' 2026 Liberian shorts: full breakdown of the three films and what each is selling",         summary: 'A documentary on the LRD, a coming-of-age set in Paynesville, and a horror short shot in Bong County. We watched all three.',                                                                                            source: 'TrueRate Culture',  time: '9 min read'  },
];

const UPCOMING = [
  { date: 'May 2',  event: "'Sundown in Sinkor' theatrical release — Monrovia, NYC, London" },
  { date: 'May 9',  event: "'Mama Salone' Season 2 drops — Showmax" },
  { date: 'May 14', event: 'Soul Fresh — Kolokwa Love Songs album release' },
  { date: 'Jul 27', event: 'Lib Wave 2026 — Antoinette Tubman Stadium' },
];

export default function EntertainmentPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1320px] px-4 py-6">

        {/* Breadcrumb + tabs */}
        <div className="mb-6">
          <Breadcrumb light items={[{ label: 'Home', href: '/' }, { label: 'Entertainment' }]} />
          <EntertainmentTopicTabs activeSlug="all" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Main column */}
          <div className="flex-1 min-w-0">

            {/* Hero */}
            <Link href="/news" className="group flex flex-col md:flex-row gap-5 md:gap-6 no-underline mb-10 pb-10 border-b border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded">
              <div className="w-full md:w-[58%] shrink-0 overflow-hidden rounded-xl">
                <HeroVisual category={HERO.category} className="w-full h-[220px] sm:h-[320px] group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-brand-accent text-[#050d11]">Top Story</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {HERO.category}
                  </span>
                </div>
                <h1 className="text-[22px] sm:text-[32px] lg:text-[32px] font-black leading-[1.1] text-gray-900 group-hover:text-gray-700 transition-colors mb-4 tracking-tight text-balance">
                  {HERO.title}
                </h1>
                <p className="text-[14px] leading-relaxed text-gray-600 line-clamp-3 mb-4">{HERO.summary}</p>
                <div className="flex items-center gap-2 mt-auto text-[12px] text-gray-500">
                  <span className="font-semibold text-gray-600">{HERO.source}</span>
                  <span aria-hidden>·</span>
                  <span>{HERO.time}</span>
                </div>
              </div>
            </Link>

            {/* Strip — single column list */}
            <section className="mb-10" aria-labelledby="latest-signals-heading">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent motion-safe:animate-pulse" />
                  <h2 id="latest-signals-heading" className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Stories For You</h2>
                </div>
                <Link href="/news" className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors no-underline">More ›</Link>
              </div>
              <ul className="flex flex-col divide-y divide-gray-200 list-none p-0 m-0">
                {STRIP_CARDS.map((card, i) => (
                  <li key={i}>
                    <Link href="/news" className="group block py-4 no-underline focus-visible:outline-none focus-visible:bg-gray-50 -mx-2 px-2 rounded">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 text-gray-500">
                        {card.category}
                      </p>
                      <h3 className="text-[12px] sm:text-[14px] font-semibold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors text-pretty">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[11px] text-gray-500 truncate">
                        <span className="text-gray-600">{card.source}</span>
                        <span aria-hidden className="mx-1.5 text-gray-300">·</span>
                        <time>{card.time}</time>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Releases tracker */}
            <section className="mb-10" aria-labelledby="releases-heading">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                <h2 id="releases-heading" className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">Releases This Quarter</h2>
                <span className="text-[11px] text-gray-500 uppercase tracking-wide font-bold">Q2–Q3 2026</span>
              </div>
              <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                <table className="w-full min-w-[500px] text-[13px]">
                  <caption className="sr-only">Upcoming Liberian and West African entertainment releases</caption>
                  <thead className="border-b border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    <tr>
                      <th scope="col" className="pb-3 text-left pr-4">Title</th>
                      <th scope="col" className="pb-3 text-left pr-4">Type</th>
                      <th scope="col" className="pb-3 text-left pr-4">Creator</th>
                      <th scope="col" className="pb-3 text-right pr-4">Release</th>
                      <th scope="col" className="hidden sm:table-cell pb-3 text-left">Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {RELEASES.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 font-bold text-gray-900 pr-4">{r.title}</td>
                        <td className="py-3 text-[10px] font-bold uppercase tracking-wide text-gray-500 pr-4">{r.type}</td>
                        <td className="py-3 text-gray-600 pr-4">{r.creator}</td>
                        <td className="tabular-nums py-3 text-right font-bold text-emerald-600 pr-4">{r.release}</td>
                        <td className="hidden sm:table-cell py-3 text-gray-500 text-[12px]">{r.platform}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Analysis feed */}
            <div className="mb-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
                  <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-[0.12em]">In-Depth</h2>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-gray-200">
                {FEED.map((item, i) => (
                  <Link key={i} href="/news" className="group flex gap-3 sm:gap-4 py-4 sm:py-5 first:pt-0 no-underline">
                    <div className="shrink-0 overflow-hidden rounded-lg">
                      <NewsThumbnail category={item.category} className="h-[72px] w-[96px] sm:h-[90px] sm:w-[140px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide mb-1 sm:mb-1.5 block ${getCatColor(item.category)}`}>
                        {item.category}
                      </span>
                      <h3 className="text-[13.5px] sm:text-[12px] font-black leading-snug text-gray-900 group-hover:text-gray-700 transition-colors mb-1 sm:mb-1.5 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="hidden sm:block text-[13px] leading-relaxed text-gray-600 line-clamp-2 mb-2">{item.summary}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-gray-500">
                        <span className="text-gray-500 truncate">{item.source}</span>
                        <span aria-hidden>·</span>
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
                <h3 className="text-[12px] font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Most Read</h3>
                <ol className="space-y-4">
                  {[
                    { rank: 1, title: "'Sundown in Sinkor' pre-sales blow past 38,000 — diaspora theaters add screens", tag: 'Movies' },
                    { rank: 2, title: "Bucky Raw books MSG warm-up — first Liberian artist on the bill",                tag: 'Music' },
                    { rank: 3, title: "Showmax greenlights 'Bassa Avenue' Season 2 after 4.1M streams",                  tag: 'TV' },
                    { rank: 4, title: "Wayétu Moore signs A24 memoir option — co-producer credit attached",              tag: 'Celebrity' },
                    { rank: 5, title: "Lib Wave confirms Davido, Tems, Stonebwoy for July 27",                            tag: 'Music' },
                  ].map(t => (
                    <li key={t.rank} className="flex gap-3">
                      <span aria-hidden className="shrink-0 text-[18px] font-black text-gray-300 tabular-nums w-5 leading-none">{t.rank}</span>
                      <div className="min-w-0">
                        <Link href="/news" className="text-[12px] font-semibold text-gray-700 hover:text-gray-900 transition-colors no-underline line-clamp-2 leading-snug block">{t.title}</Link>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{t.tag}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Calendar */}
              <div>
                <h3 className="text-[12px] font-bold text-gray-900 uppercase tracking-[0.12em] border-b border-gray-200 pb-3 mb-4">Culture Calendar</h3>
                <div className="space-y-3">
                  {UPCOMING.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="shrink-0 text-[11px] font-bold text-gray-700 w-12 tabular-nums">{ev.date}</span>
                      <p className="text-[12px] text-gray-600 leading-snug">{ev.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-[12px] font-black text-gray-900 uppercase tracking-wide mb-1">Entertainment Brief</h3>
                <p className="text-[12px] text-gray-500 mb-4">Liberian film, music, and culture stories — weekly in your inbox.</p>
                <form aria-label="Sign up for the Entertainment Brief newsletter">
                  <label htmlFor="ent-email" className="sr-only">Email address</label>
                  <input id="ent-email" type="email" required placeholder="Your email" className="w-full bg-transparent border-b border-gray-300 px-0 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors mb-3" />
                  <button type="submit" className="w-full rounded-lg bg-gray-900 py-2 text-[13px] font-bold text-white hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2">
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
