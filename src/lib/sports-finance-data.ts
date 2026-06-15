/**
 * Sports finance vertical — single source of truth for mock content.
 *
 * All five sports routes consume this file. Numbers are mock but the
 * Liberian/West African context (LFA, LPL, IE, Mighty Barrolle, Orange
 * Liberia, Lonestar Cell) is consistent with the rest of the site.
 *
 * Designed to be swapped for a CMS feed later — every page imports
 * named exports from this file and never holds inline mock data.
 */

/* ─────────────────────────────────────────────────────────────────────────
   TICKER — sports finance scrolling strip (rendered in SportsChrome)
   ───────────────────────────────────────────────────────────────────────── */

export type SportsTickerItem = {
  label: string;
  value: string;
  delta?: { text: string; up: boolean };
  sub?: string;
};

export const SPORTS_TICKER: SportsTickerItem[] = [
  { label: 'LFA Budget 2026',   value: 'US$4.2M',  delta: { text: '+12% YoY', up: true } },
  { label: 'LFA Title Sponsor', value: 'Orange', sub: 'US$1.8M / yr' },
  { label: 'Stadium Q1 Rev',    value: 'US$620K',  sub: 'gate + concessions' },
  { label: 'Top LPL Transfer',  value: 'US$85K',   sub: 'Barrolle → IE' },
  { label: 'LPL TV Rights',     value: 'US$300K',  sub: 'LNTV / season' },
  { label: 'LBA Budget',        value: 'US$1.1M',  delta: { text: '+8% YoY', up: true } },
  { label: 'Diaspora Earnings', value: 'US$12M',   sub: 'estimated, 2025' },
];

/* ─────────────────────────────────────────────────────────────────────────
   STATUS — square-edge bordered chips for deal status
   ───────────────────────────────────────────────────────────────────────── */

export type DealStatus = 'done' | 'active' | 'expiring' | 'negotiating' | 'rumour' | 'hot';

/* ─────────────────────────────────────────────────────────────────────────
   /sports — DASHBOARD INDEX
   ───────────────────────────────────────────────────────────────────────── */

/** Editorial flag shown as a coloured kicker chip (newsroom furniture). */
export type StoryFlag = 'Exclusive' | 'Analysis' | 'Live' | 'Opinion' | 'Data' | 'Interview';

export const DASHBOARD_HERO = {
  kicker: 'Sponsorship · Lead deal',
  flag: 'Exclusive' as StoryFlag,
  dateline: 'MONROVIA',
  bigNumber: 'US$1.8M',
  bigNumberLabel: 'Annual title fee',
  title: 'LFA Secures Orange Liberia Title Sponsorship — Biggest in League History',
  dek: "The three-year title deal lifts the Liberian Premier League's annual operating budget sharply, paying for broadcast production upgrades, referee salaries, and the first centralised player wage floor in the league's history.",
  source: 'TrueRate Sports',
  author: 'Sarah Kollie',
  authorRole: 'Sports Business Editor',
  readTime: '6 min read',
  time: '2 days ago',
  updated: 'Updated Jun 6, 3:42 PM GMT',
  href: '/sports/sponsorship',
};

/** Headline cards rendered as an image-and-headline rail beneath the lead. */
export type TopStory = {
  category: string;
  title: string;
  source: string;
  time: string;
  href: string;
  author?: string;
  dateline?: string;
  readTime?: string;
  flag?: StoryFlag;
};

export const DASHBOARD_TOP_STORIES: TopStory[] = [
  {
    category: 'Club Finance',
    title: 'Mighty Barrolle Reports First Profitable Quarter Since 2018',
    source: 'Daily Observer',
    author: 'James Dweh',
    dateline: 'MONROVIA',
    readTime: '5 min read',
    flag: 'Exclusive',
    time: '1d ago',
    href: '/sports/club-finance',
  },
  {
    category: 'Broadcast',
    title: 'LBA Lands Multi-Year ClarTV Broadcast Deal Across Five Seasons',
    source: 'FrontPage Africa',
    author: 'Tina Mensah',
    dateline: 'MONROVIA',
    readTime: '4 min read',
    time: '2d ago',
    href: '/sports/broadcast-rights',
  },
  {
    category: 'Transfers',
    title: "Williams to ES Tunis — Liberia's Biggest Transfer of 2026",
    source: 'TrueRate Sports',
    author: 'Emmanuel Toe',
    dateline: 'TUNIS',
    readTime: '3 min read',
    flag: 'Analysis',
    time: '4d ago',
    href: '/sports/transfers-deals',
  },
  {
    category: 'Stadium',
    title: 'Antoinette Tubman Phase 2 Approved — Renovation Adds Commercial Concourse',
    source: 'The New Dawn',
    author: 'Patrice Williams',
    dateline: 'MONROVIA',
    readTime: '7 min read',
    time: '5d ago',
    href: '/sports/club-finance',
  },
  {
    category: 'Sponsorship',
    title: 'Lonestar Cell Renews Invincible Eleven Shirt Deal Through 2029',
    source: 'TrueRate Sports',
    author: 'Sarah Kollie',
    dateline: 'MONROVIA',
    readTime: '4 min read',
    time: '6d ago',
    href: '/sports/sponsorship',
  },
  {
    category: 'Athletics',
    title: 'World Athletics Commits Funding to Liberia Federation Development Programme',
    source: 'World Athletics',
    author: 'Comfort Davies',
    dateline: 'MONACO',
    readTime: '3 min read',
    time: '1w ago',
    href: '/sports',
  },
];

/** Numbered "Most Read" rail — classic newsroom engagement furniture. */
export const DASHBOARD_MOST_READ: { title: string; category: string; href: string }[] = [
  { title: 'The diaspora pipeline: how 340 Liberian footballers became an export industry', category: 'Analysis',     href: '/sports/transfers-deals' },
  { title: 'Why Liberian club football is finally bankable after two decades in the red',     category: 'Club Finance', href: '/sports/club-finance' },
  { title: 'Inside the Orange title deal — the clauses nobody is talking about',              category: 'Exclusive',    href: '/sports/sponsorship' },
  { title: 'Can Antoinette Tubman pay for itself? The break-even maths',                       category: 'Stadium',      href: '/sports/club-finance' },
  { title: 'A streaming carve-out could double the LPL audience overnight',                    category: 'Broadcast',    href: '/sports/broadcast-rights' },
];

/** "Business of Liberian Sport" podcast — engagement module. */
export type PodcastEpisode = {
  ep: number;
  title: string;
  guest: string;
  duration: string;
  date: string;
  href: string;
};

export const PODCAST_EPISODES: PodcastEpisode[] = [
  { ep: 24, title: 'The wage-cap experiment that saved Mighty Barrolle', guest: 'Cassell Kuoh, Chairman', duration: '38 min', date: 'Jun 5', href: '/sports/club-finance' },
  { ep: 23, title: 'Why telecoms own Liberian sport now',                guest: 'Aretha Karbo, Orange Liberia', duration: '41 min', date: 'May 29', href: '/sports/sponsorship' },
  { ep: 22, title: 'Selling the league: inside the LPL rights tender',   guest: 'Mustapha Raji, LFA',   duration: '45 min', date: 'May 22', href: '/sports/broadcast-rights' },
];

export const DASHBOARD_STATS: { label: string; value: string; delta: string; up: boolean | null; source: string }[] = [
  { label: 'LPL Annual Revenue',       value: 'US$6.4M',   delta: '+18% YoY', up: true,  source: 'LFA filing'    },
  { label: 'Avg Top-Tier Wage',        value: 'US$850/mo', delta: '+9% YoY',  up: true,  source: 'TrueRate'      },
  { label: 'Sponsorship Pool',         value: 'US$3.2M',   delta: '+24% YoY', up: true,  source: 'LFA / clubs'   },
  { label: 'Stadium Utilisation',      value: '62%',     delta: '+5pp YoY', up: true,  source: 'NSA'           },
  { label: 'Broadcast Reach',          value: '480K',    delta: '+14% YoY', up: true,  source: 'LNTV'          },
  { label: 'Diaspora Player Earnings', value: 'US$12M',    delta: 'Strong',   up: null,  source: 'TrueRate est.' },
];

export type DealFeedItem = {
  type: 'Sponsorship' | 'Transfer' | 'Broadcast' | 'Club';
  party: string;       // e.g. 'Orange Liberia → LFA'
  detail: string;      // e.g. '3-year title sponsorship'
  fee: string;         // e.g. 'US$1.8M / yr'
  status: DealStatus;
  age: string;         // '2d', '4h'
  href: string;
};

export const DASHBOARD_DEAL_FEED: DealFeedItem[] = [
  { type: 'Sponsorship', party: 'Orange Liberia → LFA',                detail: 'Title sponsorship · 3yr',          fee: 'US$1.8M / yr', status: 'done',        age: '2d', href: '/sports/sponsorship' },
  { type: 'Transfer',    party: 'M. Williams: Mighty Barrolle → ES Tunis', detail: '4-year contract',              fee: 'US$145K',     status: 'done',        age: '4d', href: '/sports/transfers-deals' },
  { type: 'Broadcast',   party: 'LBA × ClarTV',                         detail: '5-year regional broadcast',       fee: 'US$1.4M',     status: 'active',      age: '5d', href: '/sports/broadcast-rights' },
  { type: 'Sponsorship', party: 'Lonestar Cell × Invincible Eleven',    detail: 'Shirt deal renewal · 4yr',         fee: 'US$240K / yr', status: 'done',        age: '6d', href: '/sports/sponsorship' },
  { type: 'Transfer',    party: 'E. Kollie: LISCR FC → Mighty Barrolle', detail: '2-year contract',                  fee: 'US$85K',      status: 'negotiating', age: '6d', href: '/sports/transfers-deals' },
  { type: 'Club',        party: 'Mighty Barrolle Q1 results',            detail: 'First profitable quarter since 2018', fee: '+US$180K profit', status: 'done', age: '1w', href: '/sports/club-finance' },
];

export const DASHBOARD_VALUATIONS: { rank: number; club: string; value: string; yoy: string; up: boolean }[] = [
  { rank: 1, club: 'Mighty Barrolle',  value: 'US$8.4M', yoy: '+11%', up: true },
  { rank: 2, club: 'Invincible Eleven', value: 'US$7.9M', yoy: '+8%',  up: true },
  { rank: 3, club: 'LISCR FC',          value: 'US$6.1M', yoy: '+4%',  up: true },
  { rank: 4, club: 'Monrovia Club Breweries', value: 'US$3.8M', yoy: '+2%', up: true },
  { rank: 5, club: 'BYC FC',            value: 'US$3.2M', yoy: '-3%',  up: false },
];

export const DASHBOARD_SPONSOR_PREVIEW: { rank: number; club: string; sponsor: string; total: string }[] = [
  { rank: 1, club: 'LFA (Federation)',  sponsor: 'Orange Liberia',     total: 'US$1.8M / yr' },
  { rank: 2, club: 'Invincible Eleven', sponsor: 'Lonestar Cell',      total: 'US$240K / yr' },
  { rank: 3, club: 'Mighty Barrolle',   sponsor: 'CBL Liberia Bank',   total: 'US$210K / yr' },
  { rank: 4, club: 'LISCR FC',          sponsor: 'LISCR Group',        total: 'US$180K / yr' },
  { rank: 5, club: 'BYC FC',            sponsor: 'Liberia Petroleum',  total: 'US$95K / yr'  },
];

export type EditorialItem = {
  category: string;
  title: string;
  dek: string;
  source: string;
  time: string;
  href: string;
  /** Optional CMS hero photo; falls back to the category gradient. */
  image?: string | null;
};

export const DASHBOARD_EDITORIAL: EditorialItem[] = [
  {
    category: 'Analysis',
    title: 'Why Liberian Club Football Is Finally Bankable',
    dek: "After two decades in the red, three of the four largest LPL clubs cleared profit in 2025. Inside the structural shifts that turned the league's economics around.",
    source: 'TrueRate Analysis',
    time: '1 day ago',
    href: '/sports/club-finance',
  },
  {
    category: 'Sponsorship',
    title: 'How Lonestar and Orange Are Rewriting West African Sports Sponsorship',
    dek: "Telecom operators now account for the majority of LPL sponsorship spend — and they're doing it because the alternative customer-acquisition channels in Liberia have stopped working at scale.",
    source: 'TrueRate Sports',
    time: '3 days ago',
    href: '/sports/sponsorship',
  },
  {
    category: 'Stadium',
    title: 'Stadium Economics: Can Antoinette Tubman Pay for Itself?',
    dek: "A major renovation. A 22,000-seat capacity. The path to break-even runs through concerts, conferences, and a new commercial concourse.",
    source: 'FrontPage Africa',
    time: '4 days ago',
    href: '/sports/club-finance',
  },
];

export type WestAfricaCard = {
  country: string;
  dateline: string;
  category: string;
  headline: string;
  stat: string;
  value: string;
  delta: string;
  up: boolean | null;
  byline: string;
  time: string;
  href: string;
};

export const DASHBOARD_WEST_AFRICA: WestAfricaCard[] = [
  { country: 'Ghana',         dateline: 'ACCRA',    category: 'Sponsorship',     headline: 'GFA signs Betway extension — title sponsorship locked in for three more years.',               stat: 'GFA Title Deal', value: 'US$4.2M',  delta: '+18% on prior cycle', up: true,  byline: 'Adanna Okonkwo', time: '4h ago',  href: '/sports' },
  { country: 'Nigeria',       dateline: 'LAGOS',    category: 'Broadcast',       headline: 'NPFL broadcast rights hit a record on the back of a streaming-only carve-out won by NBCi.',      stat: 'NPFL Rights',     value: 'US$9.0M',  delta: '+62% YoY',           up: true,  byline: 'Tope Akande',    time: '6h ago',  href: '/sports/broadcast-rights' },
  { country: "Côte d'Ivoire", dateline: 'ABIDJAN',  category: 'Club Finance',    headline: 'AFCON 2024 legacy keeps boosting Abidjan club valuations, led by ASEC Mimosas.',                 stat: 'ASEC Valuation',  value: 'US$14.6M', delta: '+22% YoY',           up: true,  byline: 'James Dweh',     time: '9h ago',  href: '/sports/club-finance' },
  { country: 'Senegal',       dateline: 'DAKAR',    category: 'Development',     headline: 'Faye government commits major funding to football academies — biggest single public investment in W. Africa youth development.', stat: 'State Funding',  value: 'US$30M', delta: '5-yr programme',      up: null,  byline: 'Sarah Kollie',   time: '12h ago', href: '/sports' },
];

export const DASHBOARD_CALENDAR: { date: string; title: string; type: string }[] = [
  { date: 'Apr 9',  title: 'LFA AGM & 2026 Operating Budget Vote',         type: 'Federation' },
  { date: 'Apr 14', title: 'LPL Broadcast Rights Tender Opens',             type: 'Broadcast' },
  { date: 'Apr 22', title: 'West Africa Football Business Summit · Accra',  type: 'Industry'   },
  { date: 'Apr 28', title: 'LBA Sponsorship Roundtable · Monrovia',         type: 'Sponsorship'},
  { date: 'May 5',  title: 'CAF Club Licensing Submission Deadline',        type: 'Compliance' },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports/transfers-deals
   ───────────────────────────────────────────────────────────────────────── */

export const TRANSFERS_HERO = {
  kicker: 'Window leader · 2026',
  bigNumber: 'US$145K',
  bigNumberLabel: 'Highest fee this window',
  title: "Williams to ES Tunis — Liberia's biggest 2026 transfer at US$145K",
  player: 'Mannah Williams',
  position: 'Striker',
  age: 22,
  from: 'Mighty Barrolle',
  to: 'ES Tunis',
  contract: '4-year contract',
  source: 'TrueRate Sports',
  time: '4 days ago',
};

export type Transfer = {
  rank: number;
  player: string;
  pos: string;
  from: string;
  to: string;
  fee: string;
  contract: string;
  status: DealStatus;
  date: string;
  direction: 'inbound' | 'outbound' | 'domestic';
};

export const TRANSFERS_TOP10: Transfer[] = [
  { rank: 1,  player: 'Mannah Williams',  pos: 'ST',  from: 'Mighty Barrolle',  to: 'ES Tunis',          fee: 'US$145K',  contract: '4yr', status: 'done',        date: 'Apr 3',  direction: 'outbound' },
  { rank: 2,  player: 'E. Kpah',          pos: 'CM',  from: 'LISCR FC',         to: 'Club FC Abidjan',   fee: 'US$110K',  contract: '3yr', status: 'done',        date: 'Mar 28', direction: 'outbound' },
  { rank: 3,  player: 'Emmanuel Kollie',  pos: 'ST',  from: 'LISCR FC',         to: 'Mighty Barrolle',   fee: 'US$85K',   contract: '2yr', status: 'negotiating', date: 'Apr 5',  direction: 'domestic' },
  { rank: 4,  player: 'Marcus Pewee',     pos: 'SF',  from: 'Free Agent',       to: 'Rivers Hoopers',    fee: 'US$840K',  contract: '2yr', status: 'done',        date: 'Mar 12', direction: 'outbound' },
  { rank: 5,  player: 'Ibrahim Kamara',   pos: 'CB',  from: 'LISCR FC',         to: 'Williamsville AC',  fee: 'US$70K',   contract: '3yr', status: 'active',      date: 'Apr 1',  direction: 'outbound' },
  { rank: 6,  player: 'Alvin Sumo',       pos: 'GK',  from: 'BYC FC',           to: 'Semassi FC (Togo)', fee: 'US$60K',   contract: '3yr', status: 'done',        date: 'Mar 30', direction: 'outbound' },
  { rank: 7,  player: 'Samuel Toe',       pos: 'CB',  from: 'FC Nimba',         to: 'Mighty Barrolle',   fee: 'US$55K',   contract: '2yr', status: 'rumour',      date: 'Apr 4',  direction: 'domestic' },
  { rank: 8,  player: 'James Dolo',       pos: 'WG',  from: 'BYC FC',           to: 'Barrack Young',     fee: 'US$45K',   contract: '2yr', status: 'done',        date: 'Mar 25', direction: 'domestic' },
  { rank: 9,  player: 'George Flomo',     pos: 'LB',  from: 'Free Agent',       to: 'BYC FC',           fee: 'US$22K',   contract: '1yr', status: 'done',        date: 'Mar 21', direction: 'inbound'  },
  { rank: 10, player: 'Patrick Doe',      pos: 'CDM', from: 'FC Bea Mountain',  to: 'LISCR FC',          fee: 'US$18K',   contract: '2yr', status: 'active',      date: 'Apr 2',  direction: 'domestic' },
];

export const TRANSFERS_FLOW = {
  inbound:  { count: 1, value: 'US$22K',   label: 'Players bought into Liberia' },
  outbound: { count: 5, value: 'US$1.22M', label: 'Players sold abroad'         },
  domestic: { count: 4, value: 'US$203K',  label: 'Within Liberia'              },
};

export const DIASPORA_PIPELINE = {
  totalEarnings: 'US$12M',
  playersAbroad: 340,
  topLeagues: [
    { league: 'Tunisian Ligue Pro 1', players: 11, share: 28 },
    { league: 'Egyptian Premier',     players: 7,  share: 22 },
    { league: 'Belgian Pro',          players: 6,  share: 18 },
    { league: 'Swedish Allsvenskan',  players: 5,  share: 14 },
    { league: 'Other',                players: 311, share: 18 },
  ],
};

export const TRANSFERS_MONTHLY = [
  { month: 'Sep', count: 4 },
  { month: 'Oct', count: 6 },
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 2 },
  { month: 'Jan', count: 8 },
  { month: 'Feb', count: 11 },
  { month: 'Mar', count: 9 },
  { month: 'Apr', count: 5 },
];

export const TRANSFERS_EDITORIAL: EditorialItem[] = [
  { category: 'Analysis',  title: "The Diaspora Pipeline — Liberia's Hidden Football Export Industry",     dek: 'Roughly 340 Liberian footballers earn a wage abroad. Their combined remittances now register on the country external accounts.',                                                            source: 'TrueRate Analysis', time: '1d ago', href: '/sports/transfers-deals' },
  { category: 'Profile',   title: 'Who Is Mannah Williams? Inside the US$145K Move That Reset the Window',   dek: "From a Mighty Barrolle academy graduate to a North African contract worth more than every other 2026 LPL transfer combined.",                                                                source: 'Daily Observer',    time: '2d ago', href: '/sports/transfers-deals' },
  { category: 'Investigation', title: 'Where Does the Transfer Fee Actually Go? Tracing US$1.2M of LPL Outbound Sales', dek: "Fees are advertised in headlines but rarely accounted for in detail. We followed five completed deals through every intermediary, fee, and currency conversion.", source: 'TrueRate Investigation', time: '4d ago', href: '/sports/transfers-deals' },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports/broadcast-rights
   ───────────────────────────────────────────────────────────────────────── */

export const BROADCAST_HERO = {
  kicker: 'Latest deal',
  bigNumber: 'US$1.4M',
  bigNumberLabel: 'LBA × ClarTV · 5 years',
  title: 'LBA Negotiates Multi-Year Broadcast Deal With ClarTV — Estimated US$1.4M Total Value',
  dek: "The Liberia Basketball Association's first multi-year regional broadcast deal in over a decade includes a digital streaming carve-out and a guaranteed Saturday primetime slot.",
  source: 'FrontPage Africa',
  time: '5 days ago',
};

export type BroadcastDeal = {
  comp: string;
  rights: string;
  value: string;
  perSeason: string;
  territory: string;
  expiry: string;
  status: DealStatus;
};

export const BROADCAST_DEALS: BroadcastDeal[] = [
  { comp: 'AFCON 2027',          rights: 'SuperSport / beIN',  value: 'US$340M', perSeason: 'US$170M / cycle',   territory: 'Global',      expiry: '2027', status: 'active'      },
  { comp: 'Premier League SSA',  rights: 'SuperSport',          value: 'US$180M', perSeason: 'US$60M / season',   territory: 'Sub-Saharan', expiry: '2028', status: 'active'      },
  { comp: 'NBL Africa',          rights: 'NBA Africa / DStv',  value: 'US$22M',  perSeason: 'US$5.5M / season',  territory: 'Pan-Africa',  expiry: '2027', status: 'active'      },
  { comp: 'WAFU Cup',            rights: 'CAF Media',           value: 'US$12M',  perSeason: 'US$4M / cycle',     territory: 'West Africa', expiry: '2026', status: 'expiring'    },
  { comp: 'Liberian Premier League', rights: 'LNTV (state)',     value: 'US$1.8M', perSeason: 'US$300K / season',  territory: 'Liberia',     expiry: '2026', status: 'expiring'    },
  { comp: 'LBA Pro',             rights: 'ClarTV',              value: 'US$1.4M', perSeason: 'US$280K / season',  territory: 'Liberia + WA', expiry: '2031', status: 'done'        },
  { comp: 'Lone Star Friendlies', rights: 'ELBC',                value: 'US$420K', perSeason: 'US$140K / yr',      territory: 'Liberia',     expiry: '2027', status: 'active'      },
  { comp: 'WAFU U-20',           rights: 'CAF Media',           value: 'US$3M',   perSeason: 'US$1.5M / cycle',   territory: 'West Africa', expiry: '2026', status: 'negotiating' },
];

export const BROADCAST_TENDER = {
  competition: 'Liberian Premier League',
  daysOut: 7,
  opensOn: 'April 14, 2026',
  reservePrice: 'US$450K / season',
  expectedBidders: ['LNTV', 'Orange TV', 'ClarTV', 'StarTimes Africa'],
  note: "Current LNTV deal expires at the end of the 2025-26 season. The LFA has signalled it will accept split bids — linear and streaming awarded separately if a single bid does not clear reserve.",
};

export const BROADCAST_REACH = {
  households: '480K',
  households_yoy: '+14%',
  fixtures_per_season: 132,
  avg_audience_per_match: '36K',
  digital_share: '38%',
  digital_share_yoy: '+12pp',
  flagship_audience: '210K',
  flagship_match: 'Liberia vs Nigeria, WAFU Cup Final',
};

export const BROADCAST_ECONOMICS: { label: string; value: string; sub: string }[] = [
  { label: 'Cost per fixture (LNTV)',  value: 'US$2,272', sub: 'US$300K ÷ 132 fixtures' },
  { label: 'Audience CPM',             value: 'US$0.063', sub: 'cost per 1K viewers' },
  { label: 'Sponsorship offset',       value: '37%',     sub: 'of LNTV outlay'     },
  { label: 'Net broadcaster cost',     value: 'US$189K',   sub: 'after offsets'       },
];

export const BROADCAST_EDITORIAL: EditorialItem[] = [
  { category: 'Analysis',     title: 'The Economics of Broadcasting the LPL: Who Profits, Who Loses',         dek: "LNTV's US$300K-per-season rights deal looks small next to AFCON. But its margin profile, advertiser mix, and digital tail make it one of the more profitable African league broadcasts.",     source: 'Daily Observer',   time: '2d ago', href: '/sports/broadcast-rights' },
  { category: 'Investigation', title: 'Inside the AFCON 2027 Rights Race — beIN, SuperSport, and the US$340M Number', dek: 'The bidding process behind the largest sports media deal in African history, reconstructed from filings, interviews, and an unredacted IMG term sheet.',                              source: 'Reuters',           time: '5d ago', href: '/sports/broadcast-rights' },
  { category: 'Explainer',    title: 'How a Streaming Carve-Out Could Double Liberian Premier League Reach',  dek: "If the LFA awards linear and digital separately, the league's potential audience grows from 480K households to roughly 1.1M unique viewers per season — even before the Lagos diaspora.", source: 'TrueRate Sports',  time: '6d ago', href: '/sports/broadcast-rights' },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports/club-finance
   ───────────────────────────────────────────────────────────────────────── */

export const CLUB_FINANCE_HERO = {
  kicker: 'Most-improved club',
  bigNumber: '+US$180K',
  bigNumberLabel: 'Q1 2026 profit · first since 2018',
  title: 'Mighty Barrolle Reports First Profitable Quarter Since 2018 — Wage Discipline and a Shirt Renewal Drive the Turnaround',
  dek: "Three deliberate decisions — capping the senior squad wage bill at 58% of revenue, renegotiating the CBL Bank shirt deal up 33%, and outsourcing matchday catering — moved Mighty Barrolle from an operating loss of US$90K in Q1 2025 to a US$180K surplus a year later.",
  source: 'Daily Observer',
  time: '1 day ago',
};

export type ClubValuation = {
  rank: number;
  club: string;
  estValue: string;
  yoy: string;
  up: boolean;
  capacity: string;
  founded: number;
};

export const CLUB_VALUATIONS: ClubValuation[] = [
  { rank: 1, club: 'Mighty Barrolle',           estValue: 'US$8.4M', yoy: '+11%', up: true,  capacity: '22,000', founded: 1953 },
  { rank: 2, club: 'Invincible Eleven',          estValue: 'US$7.9M', yoy: '+8%',  up: true,  capacity: '22,000', founded: 1943 },
  { rank: 3, club: 'LISCR FC',                   estValue: 'US$6.1M', yoy: '+4%',  up: true,  capacity: '8,500',  founded: 1996 },
  { rank: 4, club: 'Monrovia Club Breweries',    estValue: 'US$3.8M', yoy: '+2%',  up: true,  capacity: '6,000',  founded: 1962 },
  { rank: 5, club: 'BYC FC',                     estValue: 'US$3.2M', yoy: '-3%',  up: false, capacity: '5,500',  founded: 1972 },
  { rank: 6, club: 'Barrack Young Controllers',  estValue: 'US$2.9M', yoy: '+1%',  up: true,  capacity: '5,500',  founded: 1985 },
  { rank: 7, club: 'FC Nimba United',            estValue: 'US$1.8M', yoy: '-1%',  up: false, capacity: '4,200',  founded: 1995 },
  { rank: 8, club: 'Bea Mountain SC',             estValue: 'US$1.4M', yoy: '+6%',  up: true,  capacity: '3,800',  founded: 2001 },
];

export type ClubPnL = {
  club: string;
  revenue: string;
  wages: string;
  profit: string;
  profitable: boolean;
  margin: string;
};

export const CLUB_PNL: ClubPnL[] = [
  { club: 'Mighty Barrolle',          revenue: 'US$1.42M', wages: 'US$820K', profit: '+US$180K', profitable: true,  margin: '+12.7%' },
  { club: 'Invincible Eleven',         revenue: 'US$1.31M', wages: 'US$790K', profit: '+US$95K',  profitable: true,  margin: '+7.3%'  },
  { club: 'LISCR FC',                  revenue: 'US$1.05M', wages: 'US$640K', profit: '+US$60K',  profitable: true,  margin: '+5.7%'  },
  { club: 'Monrovia Club Breweries',   revenue: 'US$640K',  wages: 'US$420K', profit: '-US$15K',  profitable: false, margin: '-2.3%'  },
  { club: 'BYC FC',                    revenue: 'US$540K',  wages: 'US$390K', profit: '-US$48K',  profitable: false, margin: '-8.9%'  },
  { club: 'Barrack Young Controllers', revenue: 'US$485K',  wages: 'US$320K', profit: '-US$22K',  profitable: false, margin: '-4.5%'  },
  { club: 'FC Nimba United',           revenue: 'US$310K',  wages: 'US$240K', profit: '-US$35K',  profitable: false, margin: '-11.3%' },
  { club: 'Bea Mountain SC',           revenue: 'US$245K',  wages: 'US$165K', profit: '-US$8K',   profitable: false, margin: '-3.3%'  },
];

export const STADIUM_ECONOMICS = {
  venue: 'Antoinette Tubman Stadium',
  capacity: '22,000',
  utilisation: '62%',
  fixtures_year: 14,
  renovation_phase: 'Phase 2',
  renovation_total: 'US$8.0M',
  break_even_year: 2031,
  notes: [
    'A planned commercial concourse adds an estimated US$420K of annual non-matchday revenue.',
    'Concert and conference revenue projected to cover 28% of debt service from year three onward.',
    'Federation must clear annual debt service of US$640K before stadium clears operational profit.',
  ],
};

/** Spend (wage bill) vs Performance (LPL points). Used to render a CSS-grid scatter. */
export type SpendPerf = { club: string; spend: number; perf: number; profitable: boolean };
export const SPEND_VS_PERF: SpendPerf[] = [
  { club: 'Mighty Barrolle',          spend: 820, perf: 50, profitable: true  },
  { club: 'Invincible Eleven',         spend: 790, perf: 45, profitable: true  },
  { club: 'LISCR FC',                  spend: 640, perf: 41, profitable: true  },
  { club: 'Monrovia Club Breweries',   spend: 420, perf: 33, profitable: false },
  { club: 'BYC FC',                    spend: 390, perf: 29, profitable: false },
  { club: 'Barrack Young Controllers', spend: 320, perf: 25, profitable: false },
  { club: 'FC Nimba United',           spend: 240, perf: 20, profitable: false },
  { club: 'Bea Mountain SC',            spend: 165, perf: 18, profitable: false },
];

export const CLUB_FINANCE_EDITORIAL: EditorialItem[] = [
  { category: 'Analysis',  title: 'Why Liberian Club Football Is Finally Bankable',                            dek: 'After two decades in the red, three of the four largest LPL clubs cleared profit in 2025. The structural shifts behind the turnaround.', source: 'TrueRate Analysis', time: '1d ago', href: '/sports/club-finance' },
  { category: 'Profile',   title: "Inside Mighty Barrolle's Profit Turnaround — Three Decisions",              dek: 'Wage cap, shirt-deal renegotiation, catering outsourcing. The board memo that reset the club.',                                            source: 'Daily Observer',    time: '2d ago', href: '/sports/club-finance' },
  { category: 'Stadium',   title: 'Stadium Economics: Can Antoinette Tubman Pay for Itself?',                   dek: 'An US$8M renovation. A 22,000-seat capacity. The path to break-even runs through concerts, conferences, and the new commercial concourse.', source: 'FrontPage Africa',  time: '4d ago', href: '/sports/club-finance' },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports/sponsorship
   ───────────────────────────────────────────────────────────────────────── */

export const SPONSORSHIP_HERO = {
  kicker: 'League title sponsorship',
  bigNumber: 'US$1.8M',
  bigNumberLabel: 'Annual title fee · 3-year deal',
  title: 'LFA Secures US$1.8M Orange Liberia Title Sponsorship — Biggest in League History',
  dek: "Orange Liberia's three-year title agreement with the Liberian Premier League is the largest single sponsorship deal in the LFA's history. The US$5.4M total package includes US$1.8M annually in cash, plus US$600K of telecom infrastructure for stadiums and a US$400K youth-academy commitment.",
  source: 'TrueRate Sports',
  time: '2 days ago',
};

export type Sponsorship = {
  rank: number;
  party: string;        // club or federation
  sponsor: string;
  category: 'Title' | 'Shirt' | 'Kit' | 'Federation' | 'Stadium';
  annual: string;
  totalValue: string;
  since: number;
  expiry: number;
  status: DealStatus;
};

export const SPONSORSHIP_LEADERBOARD: Sponsorship[] = [
  { rank: 1, party: 'LFA (Liberian Premier League)', sponsor: 'Orange Liberia',     category: 'Title',      annual: 'US$1.8M', totalValue: 'US$5.4M',  since: 2026, expiry: 2029, status: 'done' },
  { rank: 2, party: 'Invincible Eleven',              sponsor: 'Lonestar Cell',      category: 'Shirt',      annual: 'US$240K', totalValue: 'US$960K',  since: 2025, expiry: 2029, status: 'done' },
  { rank: 3, party: 'Mighty Barrolle',                 sponsor: 'CBL Liberia Bank',  category: 'Shirt',      annual: 'US$210K', totalValue: 'US$840K',  since: 2024, expiry: 2028, status: 'active' },
  { rank: 4, party: 'LISCR FC',                       sponsor: 'LISCR Group',        category: 'Title',      annual: 'US$180K', totalValue: 'US$540K',  since: 2024, expiry: 2027, status: 'active' },
  { rank: 5, party: 'BYC FC',                         sponsor: 'Liberia Petroleum',  category: 'Kit',        annual: 'US$95K',  totalValue: 'US$285K',  since: 2024, expiry: 2027, status: 'active' },
  { rank: 6, party: 'Antoinette Tubman Stadium',      sponsor: 'Cemenco',            category: 'Stadium',    annual: 'US$80K',  totalValue: 'US$320K',  since: 2023, expiry: 2027, status: 'active' },
  { rank: 7, party: 'LBA',                             sponsor: 'NBA Africa',         category: 'Federation', annual: 'US$60K',  totalValue: 'US$300K',  since: 2024, expiry: 2029, status: 'active' },
  { rank: 8, party: 'Liberia Athletics Federation',    sponsor: 'World Athletics',    category: 'Federation', annual: 'US$45K',  totalValue: 'US$135K',  since: 2025, expiry: 2028, status: 'active' },
];

export type SponsorBrand = {
  rank: number;
  brand: string;
  sector: string;
  totalAnnual: string;
  deals: number;
  topDeal: string;
};

export const SPONSORSHIP_BRANDS: SponsorBrand[] = [
  { rank: 1, brand: 'Orange Liberia',     sector: 'Telecom', totalAnnual: 'US$1.92M', deals: 3, topDeal: 'LFA · US$1.8M / yr'  },
  { rank: 2, brand: 'Lonestar Cell',      sector: 'Telecom', totalAnnual: 'US$310K',  deals: 4, topDeal: 'IE · US$240K / yr'   },
  { rank: 3, brand: 'CBL Liberia Bank',   sector: 'Banking', totalAnnual: 'US$240K',  deals: 2, topDeal: 'Barrolle · US$210K' },
  { rank: 4, brand: 'Liberia Petroleum',  sector: 'Energy',  totalAnnual: 'US$130K',  deals: 3, topDeal: 'BYC FC · US$95K'    },
  { rank: 5, brand: 'Cemenco',            sector: 'Cement',  totalAnnual: 'US$110K',  deals: 2, topDeal: 'Stadium · US$80K'   },
];

export const SPONSORSHIP_ATHLETES: { name: string; sport: string; deals: string[]; total: string }[] = [
  { name: 'Comfort Brown', sport: 'Athletics',  deals: ['Puma', 'MTN', 'Liberia Petroleum'], total: 'US$220K / yr' },
  { name: 'Marcus Pewee',  sport: 'Basketball', deals: ['Nike', 'Orange Liberia'],            total: 'US$180K / yr' },
  { name: 'M. Williams',    sport: 'Football',   deals: ['Lonestar Cell'],                     total: 'US$45K / yr' },
];

export const SPONSORSHIP_FEDERATION: { fed: string; sponsor: string; annual: string; since: number }[] = [
  { fed: 'LFA — Liberia Football Association',  sponsor: 'Orange Liberia',  annual: 'US$1.8M', since: 2026 },
  { fed: 'LBA — Liberia Basketball Association', sponsor: 'NBA Africa',     annual: 'US$60K',  since: 2024 },
  { fed: 'LAF — Liberia Athletics Federation',   sponsor: 'World Athletics', annual: 'US$45K',  since: 2025 },
];

export const SPONSORSHIP_EDITORIAL: EditorialItem[] = [
  { category: 'Analysis',  title: 'How Lonestar and Orange Are Rewriting West African Sports Sponsorship', dek: 'Telecoms now account for 61% of all LPL sponsorship spend. The reasons run deeper than logo placement.',           source: 'TrueRate Sports', time: '3d ago', href: '/sports/sponsorship' },
  { category: 'Investigation', title: 'The Real Value of the US$1.8M Orange Deal — Cash, Kind, and the Fine Print', dek: 'US$1.8M annually in cash. US$600K in telecom infrastructure. US$400K of youth-academy commitments. We read every clause.', source: 'TrueRate Investigation', time: '4d ago', href: '/sports/sponsorship' },
  { category: 'Explainer', title: 'Why Athlete Endorsements Are the Fastest-Growing Bucket',              dek: "Comfort Brown alone now earns more than half the entire LBA sponsorship pool. Inside the rise of athlete-led commercial value.",  source: 'Daily Observer',  time: '5d ago', href: '/sports/sponsorship' },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports — MARKET MOVERS (financial-dashboard style movers board)
   ───────────────────────────────────────────────────────────────────────── */

export type Mover = {
  name: string;
  meta: string;        // club / sport / context line
  value: string;       // headline figure or rank metric
  delta: string;       // movement text e.g. '+18%', '3 deals'
  up: boolean | null;  // true = positive, false = negative, null = neutral
  href: string;
};

/** Grouped movers feeding the Market Movers dashboard on the index. */
export const MARKET_MOVERS: {
  clubs: Mover[];
  athletes: Mover[];
  leagues: Mover[];
} = {
  clubs: [
    { name: 'Mighty Barrolle',   meta: 'LPL · valuation US$8.4M',    value: '#1', delta: '+11% YoY',  up: true,  href: '/sports/club-finance' },
    { name: 'Invincible Eleven', meta: 'LPL · shirt deal renewed', value: '#2', delta: '+8% YoY',   up: true,  href: '/sports/club-finance' },
    { name: 'LISCR FC',          meta: 'LPL · two outbound sales', value: '#3', delta: '+4% YoY',   up: true,  href: '/sports/club-finance' },
    { name: 'BYC FC',            meta: 'LPL · wage pressure',      value: '#5', delta: '-3% YoY',   up: false, href: '/sports/club-finance' },
  ],
  athletes: [
    { name: 'Mannah Williams', meta: 'Striker · ES Tunis',          value: 'US$145K', delta: 'Record move',  up: true,  href: '/sports/transfers-deals' },
    { name: 'Comfort Brown',   meta: 'Athletics · 3 endorsements',  value: 'US$220K', delta: '+ Puma deal',  up: true,  href: '/sports/sponsorship' },
    { name: 'Marcus Pewee',    meta: 'Basketball · Rivers Hoopers', value: 'US$840K', delta: 'Top contract', up: true,  href: '/sports/transfers-deals' },
    { name: 'Emmanuel Kollie', meta: 'Striker · Barrolle target',   value: 'US$85K',  delta: 'In talks',     up: null,  href: '/sports/transfers-deals' },
  ],
  leagues: [
    { name: 'Liberian Premier League', meta: 'Annual revenue',   value: 'US$6.4M', delta: '+18% YoY', up: true, href: '/sports/club-finance' },
    { name: 'LBA Pro',                 meta: 'New ClarTV deal',   value: 'US$1.4M', delta: '5-yr term', up: true, href: '/sports/broadcast-rights' },
    { name: 'Sponsorship pool',        meta: 'All competitions',  value: 'US$3.2M', delta: '+24% YoY', up: true, href: '/sports/sponsorship' },
    { name: 'Stadium utilisation',     meta: 'Antoinette Tubman', value: '62%',   delta: '+5pp YoY', up: true, href: '/sports/club-finance' },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   /sports — ATHLETE INTELLIGENCE (data center)
   ───────────────────────────────────────────────────────────────────────── */

export type AthleteIntel = {
  rank: number;
  name: string;
  pos: string;       // position / discipline
  club: string;
  marketValue: string;
  trend: string;     // movement text
  up: boolean;
};

export const ATHLETE_INTELLIGENCE: AthleteIntel[] = [
  { rank: 1, name: 'Marcus Pewee',    pos: 'SF · Basketball',    club: 'Rivers Hoopers',   marketValue: 'US$840K', trend: '+18%', up: true  },
  { rank: 2, name: 'Comfort Brown',   pos: 'Sprint · Athletics', club: 'LAF National',     marketValue: 'US$310K', trend: '+22%', up: true  },
  { rank: 3, name: 'Mannah Williams', pos: 'ST · Football',      club: 'ES Tunis',         marketValue: 'US$190K', trend: '+31%', up: true  },
  { rank: 4, name: 'E. Kpah',         pos: 'CM · Football',      club: 'Club FC Abidjan',  marketValue: 'US$140K', trend: '+9%',  up: true  },
  { rank: 5, name: 'Emmanuel Kollie', pos: 'ST · Football',      club: 'LISCR FC',         marketValue: 'US$95K',  trend: '+4%',  up: true  },
  { rank: 6, name: 'Ibrahim Kamara',  pos: 'CB · Football',      club: 'Williamsville AC', marketValue: 'US$78K',  trend: '-2%',  up: false },
];

/* ─────────────────────────────────────────────────────────────────────────
   /sports — EXECUTIVE INTERVIEWS
   ───────────────────────────────────────────────────────────────────────── */

export type ExecutiveInterview = {
  name: string;
  role: string;        // title + org
  topic: string;       // category label
  quote: string;       // pull-quote
  time: string;
  href: string;
};

export const EXECUTIVE_INTERVIEWS: ExecutiveInterview[] = [
  {
    name: 'Mustapha Raji',
    role: 'President, Liberia Football Association',
    topic: 'Governance',
    quote: 'A centralised wage floor is not charity — it is the only way the league becomes investable for sponsors who want governance, not guesswork.',
    time: '2 days ago',
    href: '/sports/sponsorship',
  },
  {
    name: 'Cassell Kuoh',
    role: 'Chairman, Mighty Barrolle',
    topic: 'Club Finance',
    quote: 'We capped the senior wage bill at 58% of revenue and renegotiated the shirt deal up a third. Profit was a decision, not luck.',
    time: '3 days ago',
    href: '/sports/club-finance',
  },
  {
    name: 'Comfort Brown',
    role: 'Sprinter & Olympian',
    topic: 'Athlete Economics',
    quote: 'My endorsements now fund three junior athletes a year. The market for a Liberian athlete finally exists — we built it ourselves.',
    time: '5 days ago',
    href: '/sports/sponsorship',
  },
  {
    name: 'Aretha Karbo',
    role: 'Commercial Director, Orange Liberia',
    topic: 'Sponsorship',
    quote: 'Sport is the most efficient customer-acquisition channel left in this market. The title deal pays for itself in airtime alone.',
    time: '1 week ago',
    href: '/sports/sponsorship',
  },
];
