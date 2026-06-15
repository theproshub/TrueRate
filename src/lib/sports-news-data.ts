/**
 * Content for the /sports "Business of Liberian Sport" front — a sports-business
 * news page that mirrors the /news design (Bloomberg Business-of-Sports style).
 *
 * Mock/editorial placeholder content for the design preview (kept behind the
 * section's Sample-data banner). Headline-led, deliberately number-light — raw
 * figures live on the desk pages, not scattered across the front. When real
 * sports articles are published they drive the hero + feed and link to the
 * /news reader; this content is the fallback.
 */

export type SportsTab =
  | 'For You'
  | 'Club Finance'
  | 'Sponsorship'
  | 'Transfers'
  | 'Broadcast'
  | 'Governance'
  | 'Athletes';

export const SPORTS_TABS: SportsTab[] = [
  'For You',
  'Club Finance',
  'Sponsorship',
  'Transfers',
  'Broadcast',
  'Governance',
  'Athletes',
];

/** Desk hrefs reused across the front (mock cards point at these). */
export const DESK = {
  club: '/sports/club-finance',
  sponsor: '/sports/sponsorship',
  transfers: '/sports/transfers-deals',
  broadcast: '/sports/broadcast-rights',
  governance: '/sports/governance',
} as const;

export interface SportsCard {
  category: string;       // display label / tab
  imageCategory: string;  // slug for NewsThumbnail/HeroVisual
  title: string;
  summary?: string;
  source: string;
  time: string;
  href: string;
  image?: string | null;  // real hero photo (CMS), when available
}

/* ── Breaking strip — short sports-business lines (no scattered figures) ── */
export const SPORTS_BREAKING: { label: string; text: string }[] = [
  { label: 'LEAGUE',     text: 'LFA approves a centralised player-wage floor for the Liberian Premier League from next season' },
  { label: 'SPONSOR',    text: 'Orange Liberia signs on as LFA title sponsor in the biggest deal in league history' },
  { label: 'TRANSFER',   text: 'Mannah Williams completes a move to ES Tunis — the standout Liberian transfer of 2026' },
  { label: 'BROADCAST',  text: 'LBA lands a multi-year ClarTV broadcast deal spanning five seasons' },
  { label: 'CLUB',       text: 'Mighty Barrolle reports its first profitable quarter since 2018' },
  { label: 'STADIUM',    text: 'Antoinette Tubman Stadium Phase 2 approved — renovation adds a commercial concourse' },
  { label: 'GOVERNANCE', text: 'LFA publishes new club-licensing financial criteria ahead of the 2026 season' },
  { label: 'ATHLETE',    text: 'Marcus Pewee headlines a rising class of Liberian athletes drawing regional interest' },
];

/* ── Hero carousel slides ── */
export const SPORTS_HERO_SLIDES: SportsCard[] = [
  { category: 'Sponsorship', imageCategory: 'sponsorship', title: 'LFA Secures Orange Liberia Title Sponsorship — Biggest in League History', source: 'TrueRate Sports', time: '2h ago', href: DESK.sponsor },
  { category: 'Club Finance', imageCategory: 'club-finance', title: 'Why Liberian Club Football Is Finally Bankable After Two Decades in the Red', source: 'TrueRate Sports', time: '5h ago', href: DESK.club },
  { category: 'Transfers', imageCategory: 'transfers-deals', title: "Williams to ES Tunis — Liberia's Biggest Transfer of 2026 and the Diaspora Pipeline Behind It", source: 'TrueRate Sports', time: '8h ago', href: DESK.transfers },
  { category: 'Broadcast', imageCategory: 'broadcast-rights', title: 'A Streaming Carve-Out Could Double the Liberian Premier League Audience Overnight', source: 'TrueRate Sports', time: '12h ago', href: DESK.broadcast },
  { category: 'Governance', imageCategory: 'sports', title: 'Inside the LFA Club-Licensing Overhaul That Will Reshape Liberian Football Finance', source: 'TrueRate Sports', time: '1d ago', href: DESK.governance },
];

/* ── Three sub-stories under the hero ── */
export const SPORTS_SUBSTORIES: SportsCard[] = [
  { category: 'Club Finance', imageCategory: 'club-finance', title: 'Mighty Barrolle Reports First Profitable Quarter Since 2018', source: 'Daily Observer', time: '1d ago', href: DESK.club },
  { category: 'Broadcast', imageCategory: 'broadcast-rights', title: 'LBA Lands Multi-Year ClarTV Broadcast Deal Across Five Seasons', source: 'FrontPage Africa', time: '2d ago', href: DESK.broadcast },
  { category: 'Stadium', imageCategory: 'sports', title: 'Antoinette Tubman Phase 2 Approved — Renovation Adds Commercial Concourse', source: 'The New Dawn', time: '5d ago', href: DESK.club },
];

/* ── Main feed (filtered by tab) ── */
export const SPORTS_FEED: SportsCard[] = [
  { category: 'Sponsorship', imageCategory: 'sponsorship', title: 'How Lonestar and Orange Are Rewriting West African Sports Sponsorship', summary: 'Telecoms now anchor the Liberian Premier League. We trace how shirt deals and title sponsorships became the league\'s most reliable revenue line — and what clubs give up in return.', source: 'TrueRate Sports', time: '3h ago', href: DESK.sponsor },
  { category: 'Club Finance', imageCategory: 'club-finance', title: 'The Wage-Cap Experiment That Saved Mighty Barrolle', summary: 'A controlled wage structure pulled the club back from the brink. The chairman explains the trade-offs that came with discipline — and whether rivals will follow.', source: 'TrueRate Sports', time: '6h ago', href: DESK.club },
  { category: 'Transfers', imageCategory: 'transfers-deals', title: 'The Diaspora Pipeline: How Liberian Footballers Became an Export Industry', summary: 'From Monrovia academies to North African and European clubs, a look at the agents, sell-on clauses, and development economics behind Liberia\'s most valuable football export.', source: 'TrueRate Sports', time: '9h ago', href: DESK.transfers },
  { category: 'Broadcast', imageCategory: 'broadcast-rights', title: 'Selling the League: Inside the Liberian Premier League Rights Tender', summary: 'The LFA is testing whether a domestic streaming carve-out can grow the audience without alienating free-to-air viewers. The structure of the tender tells you where the league thinks its future is.', source: 'TrueRate Sports', time: '14h ago', href: DESK.broadcast },
  { category: 'Governance', imageCategory: 'sports', title: 'New Club-Licensing Rules Put Financial Discipline at the Centre of Liberian Football', summary: 'The LFA\'s revised licensing criteria tie a club\'s right to compete to its books. Smaller clubs warn the bar is high; reformers say it is overdue.', source: 'TrueRate Sports', time: '18h ago', href: DESK.governance },
  { category: 'Athletes', imageCategory: 'sports', title: 'Marcus Pewee and the New Economics of Liberian Basketball', summary: 'A standout season has turned a Liberian forward into a regional draw. We look at what an athlete\'s rising market value means for the clubs, leagues, and sponsors around him.', source: 'TrueRate Sports', time: '1d ago', href: DESK.transfers },
  { category: 'Sponsorship', imageCategory: 'sponsorship', title: 'Lonestar Cell Renews Invincible Eleven Shirt Deal Through 2029', summary: 'A long renewal locks in one of the league\'s most visible partnerships. What it signals about telecom appetite for Liberian football going into the next cycle.', source: 'TrueRate Sports', time: '1d ago', href: DESK.sponsor },
  { category: 'Club Finance', imageCategory: 'club-finance', title: 'Stadium Economics: Can Antoinette Tubman Pay for Itself?', summary: 'A renovation adds a commercial concourse and conference space. The path to break-even runs through concerts, conferences, and matchday spend — not gate receipts alone.', source: 'TrueRate Sports', time: '2d ago', href: DESK.club },
  { category: 'Broadcast', imageCategory: 'broadcast-rights', title: "World Athletics Backing Gives Liberia's Federation a Development Tailwind", summary: 'A multi-year development commitment funds coaching, officiating, and grassroots pathways. We map where the money is meant to go — and how it will be tracked.', source: 'TrueRate Sports', time: '2d ago', href: DESK.governance },
  { category: 'Transfers', imageCategory: 'transfers-deals', title: 'Kollie to Mighty Barrolle: The Domestic Transfer Market Finds a Floor', summary: 'A notable in-league move shows Liberian clubs can compete for talent without selling abroad. The contract terms hint at a maturing domestic market.', source: 'TrueRate Sports', time: '3d ago', href: DESK.transfers },
];

/* ── Desk blocks — sports-business verticals shown as mini-sections ── */
export interface DeskBlock { label: string; href: string; items: SportsCard[] }

export const SPORTS_DESK_BLOCKS: DeskBlock[] = [
  { label: 'Club Finance',      href: DESK.club,      items: SPORTS_FEED.filter(c => c.category === 'Club Finance').slice(0, 3) },
  { label: 'Transfers & Deals', href: DESK.transfers, items: SPORTS_FEED.filter(c => c.category === 'Transfers').slice(0, 3) },
  { label: 'Sponsorship',       href: DESK.sponsor,   items: SPORTS_FEED.filter(c => c.category === 'Sponsorship').slice(0, 3) },
  { label: 'Broadcast & Media', href: DESK.broadcast, items: SPORTS_FEED.filter(c => c.category === 'Broadcast').slice(0, 3) },
];

/* ── Editor's Picks (image + excerpt) ── */
export const SPORTS_EDITORS_PICKS: {
  href: string; imageCategory: string; category: string; title: string; excerpt: string; author: string; readTime: string; time: string;
}[] = [
  { href: DESK.sponsor, imageCategory: 'sponsorship', category: 'Analysis', title: 'The Orange Title Deal: The Clauses Nobody Is Talking About', excerpt: 'Beyond the headline partnership lies a structure that reshapes how the LFA funds production, officiating, and player welfare. We read the deal for what it actually changes.', author: 'Sarah Kollie', readTime: '8 min read', time: '1d ago' },
  { href: DESK.club, imageCategory: 'club-finance', category: 'Explainer', title: 'Why Liberian Club Football Is Finally Bankable', excerpt: 'For two decades, top-flight clubs ran in the red. A mix of sponsorship, wage discipline, and matchday reform has changed the math. Here is how the turnaround happened.', author: 'TrueRate Sports', readTime: '6 min read', time: '2d ago' },
  { href: DESK.broadcast, imageCategory: 'broadcast-rights', category: 'Explainer', title: "Inside the League's Streaming Bet", excerpt: 'A domestic streaming carve-out could grow the audience and the rights fee — or fragment a free-to-air habit built over decades. We explain the wager the LFA is making.', author: 'TrueRate Sports', readTime: '7 min read', time: '3d ago' },
];

/* ── Analysis & Opinion ── */
export const SPORTS_OPINION: { title: string; author: string; role: string; time: string }[] = [
  { title: 'Sponsorship money is flowing into Liberian sport. Governance has to catch up.', author: 'TrueRate Editorial Board', role: 'Opinion', time: '2d ago' },
  { title: 'The diaspora pipeline is a strength and a dependency. Liberia should build at home too.', author: 'TrueRate Editorial Board', role: 'Opinion', time: '3d ago' },
  { title: 'A streaming-only carve-out is a gamble worth taking — with guardrails.', author: 'TrueRate Editorial Board', role: 'Opinion', time: '4d ago' },
  { title: 'Club-licensing reform is overdue. The hard part is enforcing it evenly.', author: 'TrueRate Editorial Board', role: 'Opinion', time: '5d ago' },
  { title: 'Stadiums should be civic assets, not just matchday venues. Antoinette Tubman is a test.', author: 'TrueRate Editorial Board', role: 'Opinion', time: '6d ago' },
];

/* ── Data Stories (headline cards; figures live on the data desk) ── */
export const SPORTS_DATA_STORIES: { href: string; imageCategory: string; category: string; title: string; time: string }[] = [
  { href: DESK.club, imageCategory: 'club-finance', category: 'Club Finance', title: 'Liberian Premier League Club Valuations: Who Is Rising, Who Is Slipping', time: '1d ago' },
  { href: DESK.transfers, imageCategory: 'transfers-deals', category: 'Transfers', title: 'Athlete Market Values: The Liberians Drawing Regional and European Interest', time: '2d ago' },
  { href: DESK.sponsor, imageCategory: 'sponsorship', category: 'Sponsorship', title: 'The Sponsorship Leaderboard: Which Clubs Command the Biggest Partnerships', time: '3d ago' },
  { href: DESK.broadcast, imageCategory: 'broadcast-rights', category: 'Broadcast', title: 'Broadcast Deals Tracker: Rights, Territories, and Renewal Windows', time: '4d ago' },
  { href: DESK.club, imageCategory: 'club-finance', category: 'Club Finance', title: 'Club Profit & Loss: How the Top Flight Made and Spent Its Money', time: '5d ago' },
  { href: DESK.transfers, imageCategory: 'transfers-deals', category: 'Transfers', title: 'The Transfer Ledger: Domestic and Outbound Moves This Window', time: '6d ago' },
];

/* ── From the Archives ── */
export const SPORTS_ARCHIVES: { title: string; date: string; category: string; readTime: string }[] = [
  { title: 'From State Subsidy to Sponsorship: The Long Reinvention of Liberian Football Finance', date: 'Jan 2026', category: 'Club Finance', readTime: '12 min read' },
  { title: 'How the Diaspora Rebuilt the Liberian Talent Pipeline After the War Years', date: 'Nov 2025', category: 'Transfers', readTime: '14 min read' },
  { title: 'Broadcast Rights in West Africa: What Liberia Can Learn From Ghana and Nigeria', date: 'Sep 2025', category: 'Broadcast', readTime: '10 min read' },
  { title: 'The Stadium Question: Public Venues, Private Money, and Who Pays to Maintain Them', date: 'Jul 2025', category: 'Club Finance', readTime: '9 min read' },
];

/* ── From the Newsroom (community voices) ── */
export const SPORTS_NEWSROOM: { title: string; excerpt: string; author: string; role: string; time: string }[] = [
  { title: "Women's football is the league's fastest-growing audience — and its most under-funded", excerpt: 'The LWPL is drawing bigger crowds and more attention, but sponsorship and facilities have not kept pace. The commercial case for investing now is stronger than the budgets suggest.', author: 'TrueRate Sports', role: 'Analysis', time: '3d ago' },
  { title: 'Grassroots academies are doing the league\'s talent development for free', excerpt: 'Community academies feed the top flight and the diaspora pipeline, yet see little of the value they create. A look at how clubs and the federation could share it.', author: 'TrueRate Sports', role: 'Analysis', time: '4d ago' },
  { title: 'Matchday spending is where Liberian clubs leave the most money on the table', excerpt: 'Concessions, ticketing, and hospitality remain underdeveloped at most venues. Small operational changes could meaningfully lift non-sponsorship revenue.', author: 'TrueRate Sports', role: 'Analysis', time: '5d ago' },
  { title: 'Basketball is quietly building a commercial model of its own', excerpt: 'The LBA\'s broadcast deal and a rising athlete profile point to a second Liberian sport with real business potential beyond football.', author: 'TrueRate Sports', role: 'Analysis', time: '6d ago' },
];

/* ── Trending (left rail) ── */
export const SPORTS_TRENDING: { rank: number; href: string; title: string }[] = [
  { rank: 1, href: DESK.transfers, title: 'The diaspora pipeline: how Liberian footballers became an export industry' },
  { rank: 2, href: DESK.club, title: 'Why Liberian club football is finally bankable after two decades in the red' },
  { rank: 3, href: DESK.sponsor, title: 'Inside the Orange title deal — the clauses nobody is talking about' },
  { rank: 4, href: DESK.club, title: 'Can Antoinette Tubman pay for itself? The break-even maths' },
  { rank: 5, href: DESK.broadcast, title: 'A streaming carve-out could double the Liberian Premier League audience overnight' },
  { rank: 6, href: DESK.club, title: 'The wage-cap experiment that saved Mighty Barrolle' },
  { rank: 7, href: DESK.governance, title: 'New club-licensing rules put financial discipline at the centre' },
  { rank: 8, href: DESK.transfers, title: 'Marcus Pewee and the new economics of Liberian basketball' },
  { rank: 9, href: DESK.broadcast, title: 'Selling the league: inside the rights tender' },
  { rank: 10, href: DESK.sponsor, title: 'How telecoms came to own Liberian sport' },
];

/* ── In Focus tags (left rail) ── */
export const SPORTS_IN_FOCUS = [
  'LFA', 'Liberian Premier League', 'LWPL', 'LBA', 'Mighty Barrolle', 'Invincible Eleven',
  'Orange Liberia', 'Lonestar Cell', 'Transfers', 'Broadcast Rights', 'Sponsorship', 'Diaspora',
];

/* ── Most read (right rail) ── */
export interface MostReadItem { title: string; href: string }

export const SPORTS_MOST_READ: MostReadItem[] = [
  { title: 'LFA secures Orange Liberia title sponsorship — biggest in league history', href: DESK.sponsor },
  { title: 'Why Liberian club football is finally bankable after two decades in the red', href: DESK.club },
  { title: "Williams to ES Tunis — Liberia's biggest transfer of 2026", href: DESK.transfers },
  { title: 'A streaming carve-out could double the Liberian Premier League audience', href: DESK.broadcast },
  { title: 'New club-licensing rules put financial discipline at the centre', href: DESK.governance },
];

/* ── Upcoming sports-business events (right rail + center) ── */
export const SPORTS_EVENTS: { date: string; label: string; type: string }[] = [
  { date: 'Apr 9',  label: 'LFA Club-Licensing Deadline',        type: 'Governance'  },
  { date: 'Apr 14', label: 'Liberian Premier League Rights Tender Opens', type: 'Broadcast' },
  { date: 'Apr 18', label: 'LFA Title Sponsorship Announcement', type: 'Sponsorship' },
  { date: 'Apr 22', label: 'Transfer Window Closes',             type: 'Transfers'   },
  { date: 'Apr 27', label: 'Mighty Barrolle Quarterly Results',  type: 'Club Finance' },
  { date: 'May 3',  label: 'Antoinette Tubman Phase 2 Briefing', type: 'Stadium'     },
];
