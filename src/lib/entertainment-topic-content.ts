/**
 * Topic-specific business-of-entertainment content for /entertainment/[topic].
 * Numbers below are illustrative editorial figures, not live feeds.
 */

export interface Kpi {
  label: string;
  value: string;
  delta?: string;
  /** 'up' = green, 'down' = red, 'flat' = grey, undefined = neutral. */
  deltaDirection?: 'up' | 'down' | 'flat';
  note?: string;
}

export interface StripCard {
  category: string;
  title: string;
  source: string;
  time: string;
}

export interface TrackerColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  hideOnMobile?: boolean;
  emphasize?: boolean;
}

export type TrackerRow = Record<string, string>;

export interface Tracker {
  title: string;
  subtitle: string;
  columns: TrackerColumn[];
  rows: TrackerRow[];
}

export interface FeedItem {
  category: string;
  title: string;
  summary: string;
  source: string;
  time: string;
}

export interface MostReadItem {
  rank: number;
  title: string;
  tag: string;
}

export interface CalendarItem {
  date: string;
  event: string;
}

export interface HeroStat {
  value: string;
  label: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'flat';
  sub?: string;
}

export interface TopicContent {
  hero: { category: string; title: string; summary: string; source: string; time: string; byline?: string; readTime?: string };
  heroStat: HeroStat;
  kpis: Kpi[];
  strip: StripCard[];
  tracker: Tracker;
  feed: FeedItem[];
  mostRead: MostReadItem[];
  calendar: CalendarItem[];
}

const movies: TopicContent = {
  hero: {
    category: 'Movies',
    title: "'Sundown in Sinkor' opens to $1.2M opening weekend across diaspora screens — biggest Liberian-led release since 2019",
    summary: "The Nollywood-Liberia co-production grossed an estimated $1.18M across 142 screens in the U.S., U.K., and ECOWAS theatrical corridor. Producer Patrice Juah confirmed Filmhouse is exercising its option for a sequel.",
    source: 'TrueRate Culture',
    byline: 'By the TrueRate Culture Desk',
    readTime: '6 min read',
    time: '1h ago',
  },
  heroStat: {
    value: '$1.18M',
    label: 'Opening weekend gross',
    delta: '+22% vs benchmark',
    deltaDirection: 'up',
    sub: '142 screens · LR + diaspora corridor',
  },
  kpis: [
    { label: 'Liberian box office (2025)',   value: '$3.4M',  delta: '+22% YoY', deltaDirection: 'up',  note: 'TrueRate estimate · domestic + diaspora' },
    { label: 'Avg local production budget',  value: '$185K',  delta: '+8% YoY',  deltaDirection: 'up',  note: 'Up from $171K in 2024' },
    { label: 'Cinema screens nationwide',    value: '14',     delta: '+4 in 12mo', deltaDirection: 'up', note: 'Monrovia, Paynesville, Buchanan' },
    { label: 'New Liberian rebate',          value: '15%',    delta: 'Effective Q2 2026', deltaDirection: 'flat', note: 'Foreign productions only' },
  ],
  strip: [
    { category: 'Movies', title: "'Sundown in Sinkor' clears 38,000 diaspora pre-sales — Filmhouse adds 14 screens in NYC and London",                              source: 'TrueRate Culture',  time: '3h ago' },
    { category: 'Movies', title: 'Boakai administration approves 15% film rebate — Lagos studios already inquiring about Q3 shoots',                                source: 'TrueRate',          time: '5h ago' },
    { category: 'Movies', title: 'Cannes Marché du Film accepts three Liberian shorts — first time more than one Liberian title has been picked in a single edition', source: 'TrueRate Culture',  time: '6h ago' },
    { category: 'Movies', title: 'Silverbird Cinemas signs LOI to open four-screen multiplex in Sinkor by Q4 2026 — $2.8M build-out',                                source: 'FrontPage Africa',  time: '8h ago' },
    { category: 'Movies', title: "Liberian Film Authority's 2025 census: 47 features in development, 11 in production, 6 in post",                                   source: 'Liberian Observer', time: '10h ago' },
    { category: 'Movies', title: 'Netflix Africa licenses three Liberian features for Pan-African slate — undisclosed minimum guarantee',                            source: 'Variety',           time: '14h ago' },
    { category: 'Movies', title: 'AfreximBank launches $30M creative-industries facility — Liberian producers eligible from May 1',                                  source: 'Reuters',           time: '18h ago' },
    { category: 'Movies', title: "Diaspora distributor ArtMattan picks up 'Pepper Soup' for North American theatrical run",                                          source: 'TrueRate Culture',  time: '1 day ago' },
  ],
  tracker: {
    title: '2026 Theatrical Tracker',
    subtitle: 'Liberia + diaspora openings',
    columns: [
      { key: 'title',    label: 'Title',          align: 'left',  emphasize: true },
      { key: 'budget',   label: 'Budget',         align: 'right' },
      { key: 'opening',  label: 'Opening Wknd',   align: 'right' },
      { key: 'screens',  label: 'Screens',        align: 'right' },
      { key: 'studio',   label: 'Producer',       align: 'left',  hideOnMobile: true },
      { key: 'status',   label: 'Status',         align: 'left',  hideOnMobile: true },
    ],
    rows: [
      { title: 'Sundown in Sinkor',     budget: '$1.4M',  opening: '$1.18M', screens: '142', studio: 'Filmhouse · Patrice Juah',     status: 'Wide release' },
      { title: 'Pepper Soup',           budget: '$420K',  opening: '$310K',  screens: '38',  studio: 'Liberty Films',                status: 'Limited' },
      { title: 'Bong County',           budget: '$280K',  opening: '$94K',   screens: '12',  studio: 'Korkormi Pictures',            status: 'Domestic' },
      { title: 'Mama Ellen',            budget: '$1.1M',  opening: 'TBD',    screens: '—',   studio: 'Filmhouse · Inkblot',          status: 'Post-prod' },
      { title: 'The River Mano',        budget: '$650K',  opening: 'TBD',    screens: '—',   studio: 'Korkormi · ECOWAS Co-Pro Fund', status: 'Production' },
      { title: 'Gbessay',               budget: '$210K',  opening: 'TBD',    screens: '—',   studio: 'Liberty Films · independent',   status: 'Development' },
    ],
  },
  feed: [
    { category: 'Movies', title: "Inside the financing of 'Sundown in Sinkor': how a $1.4M Nollywood-Liberia co-pro got made",        summary: 'From a Lagos completion-bond facility to a Monrovia tax rebate that did not yet exist when production started, a behind-the-scenes look at the deal stack that put Liberia back on the West African film map.', source: 'TrueRate Culture', time: '11 min read' },
    { category: 'Movies', title: 'The 15% rebate: what Liberia\'s new film incentive actually does — and what it leaves out',         summary: 'Below-the-line crew, post-production, and music licensing are still excluded. A pragmatic read on whether the new policy attracts real productions or just paperwork.',                                            source: 'TrueRate',         time: '8 min read'  },
    { category: 'Movies', title: 'Why Silverbird is betting $2.8M on a Sinkor multiplex while ticket prices have stagnated',         summary: 'Liberian average ticket price has held at $4.50 for three years. We modelled the cinema chain\'s break-even and found a four-screen build-out needs 39% capacity utilisation to clear hurdle rate.',                source: 'FrontPage Africa', time: '9 min read'  },
    { category: 'Movies', title: 'Cannes\' 2026 Liberian shorts: the three films, the budgets, and the sales agents attached',        summary: 'A documentary on the LRD ($72K budget, no sales agent yet), a coming-of-age set in Paynesville ($45K, repped by Pulse), and a horror short shot in Bong County ($110K, MK2 attached).',                          source: 'TrueRate Culture', time: '9 min read'  },
    { category: 'Movies', title: 'Diaspora theatrical: the 142-screen math that opened "Sundown in Sinkor"',                          summary: 'How a Liberian producer cobbled together AMC, Cineworld, and independent ECOWAS-corridor venues for a single weekend — and why the model is replicable for the next four titles.',                            source: 'TrueRate Culture', time: '10 min read' },
    { category: 'Movies', title: 'AfreximBank\'s $30M creative facility: the eligibility criteria nobody is reading',                summary: 'The fund is open to Liberian features, but the 30% local-spend requirement and the post-production carve-out exclude most active producers we spoke to. We break down what qualifies.',                            source: 'Reuters',          time: '7 min read'  },
    { category: 'Movies', title: 'Netflix Africa\'s Liberian licensing slate: what the contracts actually say',                       summary: 'Three features at undisclosed MGs in the $80K–$150K range, 7-year exclusive windows, and reversion clauses that producers are pushing back on. The line-by-line.',                                              source: 'Variety',          time: '8 min read'  },
    { category: 'Movies', title: 'Liberian Film Authority\'s 2025 census: where the 47 features in development actually are',         summary: 'Of 47 declared in development, only 11 are funded past 50%. Of those 11, 4 are co-productions with Lagos. We mapped the pipeline.',                                                                            source: 'Liberian Observer', time: '6 min read'  },
  ],
  mostRead: [
    { rank: 1, title: "'Sundown in Sinkor' clears $1.18M opening — biggest Liberian-led release since 2019", tag: 'Movies' },
    { rank: 2, title: 'Boakai signs 15% film rebate into law — what qualifies and what doesn\'t',             tag: 'Movies' },
    { rank: 3, title: 'Silverbird\'s $2.8M Sinkor multiplex: the break-even math',                           tag: 'Movies' },
    { rank: 4, title: 'Netflix Africa\'s Liberian licensing terms — line by line',                            tag: 'Movies' },
    { rank: 5, title: 'AfreximBank\'s $30M facility: who qualifies, who doesn\'t',                            tag: 'Movies' },
  ],
  calendar: [
    { date: 'May 2',  event: "'Sundown in Sinkor' theatrical wide release" },
    { date: 'May 14', event: 'AfreximBank creative-industries facility — applications open' },
    { date: 'Jun 6',  event: 'Cannes Marché du Film — Liberian shorts screening' },
    { date: 'Sep 1',  event: 'Liberian Film Authority annual census release' },
  ],
};

const tv: TopicContent = {
  hero: {
    category: 'TV',
    title: "Showmax greenlights 'Bassa Avenue' Season 2 after 4.1M streams — biggest Liberian-set commission to date",
    summary: "MultiChoice's streaming arm has formally ordered a 10-episode renewal at an estimated per-episode budget of $185K, up from $140K in Season 1. Production restarts in Monrovia in June.",
    source: 'TrueRate Culture',
    byline: 'By the TrueRate Culture Desk',
    readTime: '5 min read',
    time: '1h ago',
  },
  heroStat: {
    value: '4.1M',
    label: 'Streams · Bassa Avenue S1',
    delta: '$185K / ep — S2 budget',
    deltaDirection: 'up',
    sub: 'Up from $140K in Season 1',
  },
  kpis: [
    { label: 'Showmax Liberia subscribers', value: '88,400', delta: '+27% YoY',   deltaDirection: 'up',   note: 'Estimate · paid + bundled' },
    { label: 'LBS ad revenue (2025)',       value: '$2.1M',  delta: '−6% YoY',    deltaDirection: 'down', note: 'State broadcaster · auditor-general filing' },
    { label: 'Avg drama ep. budget',        value: '$185K',  delta: '+32% YoY',   deltaDirection: 'up',   note: 'Local productions, scripted' },
    { label: 'Hours of LR originals',       value: '74 hrs', delta: '+18 hrs YoY', deltaDirection: 'up',  note: 'Across all platforms' },
  ],
  strip: [
    { category: 'TV', title: "'Bassa Avenue' Season 2 confirmed — Showmax raises per-episode budget to $185K",                                source: 'TrueRate Culture',  time: '2h ago' },
    { category: 'TV', title: 'Liberia Broadcasting System overhauls primetime slate — drops 9pm news for a 30-minute Kolokwa magazine show', source: 'FrontPage Africa', time: '4h ago' },
    { category: 'TV', title: 'Netflix Africa scouts a Monrovia office — sources say first slate of Liberian originals could land Q4 2026',    source: 'TechCabal',        time: '6h ago' },
    { category: 'TV', title: 'DStv Liberia subscriber base falls 9% YoY as cord-cutting accelerates — MultiChoice flags pricing review',     source: 'Reuters',          time: '7h ago' },
    { category: 'TV', title: "'Mama Salone' Season 2 drops May 9 — Showmax confirms simultaneous Pan-African release",                       source: 'TrueRate Culture',  time: '9h ago' },
    { category: 'TV', title: 'Clar TV launches 24/7 Kolokwa news channel — first ad-supported all-Kolokwa linear stream',                    source: 'Liberian Observer', time: '11h ago' },
    { category: 'TV', title: 'YouTube TV viewing in Liberia hits 480M monthly minutes — overtakes linear primetime by July',                  source: 'TrueRate',         time: '14h ago' },
    { category: 'TV', title: 'IFC partners with LBS on a $4M production-fund facility — first commissions go to documentary',                source: 'Reuters',          time: '20h ago' },
  ],
  tracker: {
    title: 'Streaming Top 10 — Liberia',
    subtitle: 'Mar 2026 · Showmax + Netflix combined',
    columns: [
      { key: 'rank',    label: '#',          align: 'left',  emphasize: true },
      { key: 'title',   label: 'Title',      align: 'left' },
      { key: 'origin',  label: 'Origin',     align: 'left',  hideOnMobile: true },
      { key: 'streams', label: 'Streams',    align: 'right' },
      { key: 'change',  label: 'WoW',        align: 'right' },
      { key: 'platform',label: 'Platform',   align: 'left',  hideOnMobile: true },
    ],
    rows: [
      { rank: '1',  title: 'Bassa Avenue',           origin: 'Liberia',   streams: '4.1M', change: '+12%', platform: 'Showmax' },
      { rank: '2',  title: 'Crime & Justice Lagos',  origin: 'Nigeria',   streams: '3.7M', change: '+4%',  platform: 'Showmax' },
      { rank: '3',  title: 'Squid Game (S3)',        origin: 'Korea',     streams: '2.9M', change: '−18%', platform: 'Netflix' },
      { rank: '4',  title: 'Mama Salone',            origin: 'SL · LR',   streams: '2.4M', change: '+22%', platform: 'Showmax' },
      { rank: '5',  title: 'Money Heist (rerun)',    origin: 'Spain',     streams: '1.9M', change: '−6%',  platform: 'Netflix' },
      { rank: '6',  title: 'Big Brother Naija',      origin: 'Nigeria',   streams: '1.7M', change: '−4%',  platform: 'Showmax' },
      { rank: '7',  title: 'Blood & Water',          origin: 'S. Africa', streams: '1.4M', change: '+1%',  platform: 'Netflix' },
      { rank: '8',  title: 'Liberia Now',            origin: 'Liberia',   streams: '1.1M', change: '+38%', platform: 'YouTube' },
      { rank: '9',  title: 'Adulting',               origin: 'Nigeria',   streams: '0.9M', change: '−2%',  platform: 'Showmax' },
      { rank: '10', title: 'King of Boys',           origin: 'Nigeria',   streams: '0.8M', change: '+5%',  platform: 'Netflix' },
    ],
  },
  feed: [
    { category: 'TV', title: "'Bassa Avenue' and the streaming math: 4.1M streams, but is it actually profitable for Showmax?", summary: 'We pulled MultiChoice\'s Q4 ARPU disclosures and modelled the show\'s contribution margin at roughly 18% — thin, but justified by the subscriber-acquisition halo across Liberia and Sierra Leone.',                                       source: 'FrontPage Africa', time: '8 min read' },
    { category: 'TV', title: 'Why Netflix scouting Monrovia matters more than the headlines suggest',                            summary: 'The platform has cooled on African originals after the 2024 reorganisation. A Liberia office — even a small one — would signal a recommitment that goes well beyond Lagos and Cape Town.',                                                source: 'TechCabal',        time: '6 min read' },
    { category: 'TV', title: 'DStv\'s 9% subscriber decline is masking a bigger problem — bundling',                            summary: 'Cord-cutting in Liberia is real, but the more pressing issue is that DStv\'s premium tier is being unbundled into a la carte purchases via VPN. We modelled the leakage.',                                                                  source: 'Reuters',          time: '9 min read' },
    { category: 'TV', title: 'LBS ad revenue is shrinking — and that should worry every public-interest broadcaster',           summary: 'A 6% revenue decline in 2025 in nominal terms means a near-double-digit drop in real terms. The state broadcaster\'s ad-led model is structurally challenged. We propose a scenario.',                                                  source: 'TrueRate',         time: '7 min read' },
    { category: 'TV', title: 'The IFC-LBS production facility: a $4M bet that could reshape Liberian documentary',              summary: 'The structure is unusual: matched commissions with reversion to LBS at year five. We talked to two producers already pitching into the first window.',                                                                                  source: 'Reuters',          time: '6 min read' },
    { category: 'TV', title: 'Clar TV\'s 24/7 Kolokwa channel: the audience case nobody saw coming',                           summary: 'A vernacular linear channel ad-supported only — in 2026. The Clar TV business plan is contrarian, but its first 30 days of metrics show 110,000 unique viewers. We reviewed the data.',                                                  source: 'Liberian Observer', time: '8 min read' },
    { category: 'TV', title: 'YouTube TV in Liberia: 480M monthly minutes and what it means for ad spend',                     summary: 'Linear primetime is no longer where Liberian eyeballs are. Brands are slow to follow. A look at how three local agencies are pricing the gap.',                                                                                          source: 'TrueRate',         time: '10 min read' },
    { category: 'TV', title: '$185K an episode: the new floor for Liberian-set scripted drama',                                summary: 'Showmax\'s budget bump on Bassa Avenue is the new benchmark. We broke down where the extra $45K per episode is going — and which crew lines absorbed most of it.',                                                                          source: 'TrueRate Culture', time: '7 min read' },
  ],
  mostRead: [
    { rank: 1, title: "'Bassa Avenue' Season 2 greenlit at $185K/episode",         tag: 'TV' },
    { rank: 2, title: 'DStv Liberia loses 9% of subscribers in a single year',     tag: 'TV' },
    { rank: 3, title: 'Showmax Top 10 — Liberian shows take 3 of 5 top slots',    tag: 'TV' },
    { rank: 4, title: 'Netflix Africa scouting Monrovia — what we know',          tag: 'TV' },
    { rank: 5, title: 'IFC + LBS launch a $4M production fund',                   tag: 'TV' },
  ],
  calendar: [
    { date: 'May 9',  event: "'Mama Salone' Season 2 drops — Showmax" },
    { date: 'Jun 6',  event: "'Bassa Avenue' Season 2 production begins" },
    { date: 'Jun 18', event: 'IFC-LBS production fund — first call for proposals' },
    { date: 'Sep 22', event: 'MultiChoice Africa Investor Day — Johannesburg' },
  ],
};

const music: TopicContent = {
  hero: {
    category: 'Music',
    title: "Streaming royalties from Liberian artists hit $2.3M in 2025 — up 64% YoY as Spotify expands MTN-bundled plans",
    summary: "Top decile of Liberian artists captured 78% of total payouts; the long tail saw modest gains as Spotify’s MTN bundle drove paid-tier conversions in Greater Monrovia and Margibi.",
    source: 'TrueRate Culture',
    byline: 'By the TrueRate Culture Desk',
    readTime: '7 min read',
    time: '1h ago',
  },
  heroStat: {
    value: '$2.3M',
    label: '2025 streaming royalties',
    delta: '+64% YoY',
    deltaDirection: 'up',
    sub: 'Top decile captured 78% of payouts',
  },
  kpis: [
    { label: 'Streaming royalties (2025)', value: '$2.3M',  delta: '+64% YoY',  deltaDirection: 'up',   note: 'Spotify · Apple · Audiomack · YouTube' },
    { label: 'Top monthly listeners',      value: '3.4M',   delta: '+0.8M YoY', deltaDirection: 'up',   note: 'Bucky Raw — global Spotify' },
    { label: 'Avg ticket — Lib Wave',      value: '$45',    delta: '+$8 YoY',   deltaDirection: 'up',   note: 'GA · 2026 festival pricing' },
    { label: 'Hipco share of streams',     value: '38%',    delta: '+11pp YoY', deltaDirection: 'up',   note: 'Liberian-listener data, all platforms' },
  ],
  strip: [
    { category: 'Music', title: 'Hipco star Bucky Raw lines up Madison Square Garden warm-up date — first Liberian artist on the bill',           source: 'TrueRate Culture',  time: '2h ago' },
    { category: 'Music', title: "Afrobeats festival 'Lib Wave' confirms Davido, Tems, Stonebwoy headliners for ATS — July 27 — $1.8M ticket take", source: 'The New Dawn',     time: '4h ago' },
    { category: 'Music', title: 'Spotify expands MTN-bundled plan to Bong, Nimba, and Margibi — paid-tier Liberian users cross 92,000',           source: 'TrueRate',         time: '5h ago' },
    { category: 'Music', title: 'Sundaygar Dearboy signs with Mavin Records sub-label for distribution and publishing — first Liberian deal',     source: 'Variety',          time: '7h ago' },
    { category: 'Music', title: 'Audiomack Liberia monthly active users hit 1.2M — largest growth corridor in West Africa',                       source: 'TechCabal',        time: '9h ago' },
    { category: 'Music', title: 'MC Caro\'s "Sinkor Dreams" certified gold by Liberian RIAA equivalent — 50K paid downloads + streams',            source: 'Liberian Observer', time: '12h ago' },
    { category: 'Music', title: "Christoph the Change drops 'Hipco Anthology Vol. III' — pre-saves cross 240,000 in 72 hours",                    source: 'TrueRate Culture',  time: '16h ago' },
    { category: 'Music', title: 'Antoinette Tubman Stadium completes $1.2M sound-system upgrade ahead of Lib Wave festival',                      source: 'FrontPage Africa', time: '20h ago' },
  ],
  tracker: {
    title: 'Top Liberian Artists by Streams',
    subtitle: 'Mar 2026 · Spotify + Audiomack + Apple Music',
    columns: [
      { key: 'rank',    label: '#',           align: 'left',  emphasize: true },
      { key: 'artist',  label: 'Artist',      align: 'left' },
      { key: 'genre',   label: 'Genre',       align: 'left',  hideOnMobile: true },
      { key: 'streams', label: 'Mo. Streams', align: 'right' },
      { key: 'royalty', label: 'Est. Mo. $',  align: 'right' },
      { key: 'label',   label: 'Label',       align: 'left',  hideOnMobile: true },
    ],
    rows: [
      { rank: '1', artist: 'Bucky Raw',          genre: 'Hipco',     streams: '8.4M',  royalty: '$24,800', label: 'Independent' },
      { rank: '2', artist: 'MC Caro',            genre: 'Hipco',     streams: '5.7M',  royalty: '$16,900', label: 'Caro Music Group' },
      { rank: '3', artist: 'Christoph the Change',genre: 'Hipco',    streams: '4.9M',  royalty: '$14,500', label: 'Independent' },
      { rank: '4', artist: 'Sundaygar Dearboy',  genre: 'Folk · Pop', streams: '3.8M',  royalty: '$11,200', label: 'Mavin sub-label' },
      { rank: '5', artist: 'Erica Williams',     genre: 'Gospel',    streams: '3.1M',  royalty: '$9,200',  label: 'Independent' },
      { rank: '6', artist: 'Soul Fresh',         genre: 'R&B · Hipco', streams: '2.6M', royalty: '$7,700',  label: 'Independent' },
      { rank: '7', artist: 'Takun J',            genre: 'Hipco',     streams: '2.2M',  royalty: '$6,500',  label: 'Independent' },
      { rank: '8', artist: 'Stunna',             genre: 'Afrobeats', streams: '1.9M',  royalty: '$5,600',  label: 'Independent' },
    ],
  },
  feed: [
    { category: 'Music', title: "Bucky Raw at the Garden: how Liberia's hipco generation finally crossed over",                    summary: 'A decade after Takun J brought Kolokwa rap into the Liberian mainstream, an MSG-warm-up booking signals the genre has crossed the diaspora threshold. We trace the streaming numbers, the tour math, and what comes next.',           source: 'TrueRate Culture',  time: '9 min read' },
    { category: 'Music', title: 'Streaming royalties cleared $2M for Liberian artists in 2025 — but distribution is brutally uneven', summary: 'Top-decile artists captured 78% of total payouts. We pulled DistroKid and Audiomack data and compared it with Nigeria and Ghana to show how concentrated Liberia\'s streaming market still is.',                                  source: 'TrueRate Culture',  time: '10 min read' },
    { category: 'Music', title: "Lib Wave's logistics gamble: putting Davido, Tems, and Stonebwoy on the same Monrovia stage",       summary: 'Tour-routing, hotel inventory, and stadium upgrades that still don\'t exist. Inside the operational risk a Liberian promoter is taking with a single July date.',                                                                source: 'The New Dawn',     time: '8 min read' },
    { category: 'Music', title: 'Mavin\'s deal with Sundaygar Dearboy: the structure, the advance, and the publishing split',         summary: 'A 360 deal at the Mavin sub-label level with a $250K advance against royalties. We obtained a redacted summary of the deal terms and broke down where the upside actually sits.',                                              source: 'Variety',          time: '8 min read' },
    { category: 'Music', title: 'How Spotify\'s MTN bundle changed the math — and what it means for paid-tier growth',                summary: 'A 1,200-LRD-per-month bolt-on to the Spotify Mini plan has crossed 92,000 Liberian subscribers in 14 months. We modelled the contribution margin and the churn picture.',                                                       source: 'TrueRate',         time: '7 min read' },
    { category: 'Music', title: 'Audiomack\'s Liberian moment: 1.2M MAU and a creator-tier business that\'s working',                summary: 'Audiomack overtook Apple Music in Liberian MAU in late 2025. The platform\'s creator monetisation tier is paying out small but consistent royalties to mid-tier artists.',                                                       source: 'TechCabal',        time: '6 min read' },
    { category: 'Music', title: "Hipco's 38% share of Liberian streams: the genre is no longer 'emerging'",                          summary: 'Eleven percentage points of share growth in twelve months. We compared the trajectory with Nigerian Afrobeats\' 2018 inflection point and found striking parallels — but a much smaller addressable audience.',                  source: 'TrueRate Culture',  time: '9 min read' },
    { category: 'Music', title: 'The economics of Antoinette Tubman Stadium\'s $1.2M sound upgrade',                                summary: 'Funded partially by the Lib Wave promoter as a tour-rider concession. The structure leaves the city with the asset, the promoter with discounted dates. We reviewed the contract.',                                              source: 'FrontPage Africa', time: '8 min read' },
  ],
  mostRead: [
    { rank: 1, title: 'Bucky Raw books MSG warm-up — first Liberian artist on the bill',           tag: 'Music' },
    { rank: 2, title: 'Streaming royalties hit $2.3M — but top decile took 78%',                    tag: 'Music' },
    { rank: 3, title: 'Mavin signs Sundaygar Dearboy — the deal terms, line by line',                tag: 'Music' },
    { rank: 4, title: 'Lib Wave 2026 confirms Davido, Tems, Stonebwoy — $1.8M projected gate',       tag: 'Music' },
    { rank: 5, title: 'Spotify-MTN bundle crosses 92,000 paid Liberian subscribers',                  tag: 'Music' },
  ],
  calendar: [
    { date: 'May 14', event: 'Soul Fresh — Kolokwa Love Songs album release' },
    { date: 'Jun 21', event: 'African Music Awards — Accra (Liberian nominees: 4)' },
    { date: 'Jul 27', event: 'Lib Wave 2026 — Antoinette Tubman Stadium' },
    { date: 'Aug 11', event: 'Christoph the Change — Hipco Anthology Vol. III drops' },
  ],
};

const celebrity: TopicContent = {
  hero: {
    category: 'Celebrity',
    title: "Wayétu Moore's A24 deal: $1.2M memoir option, co-producer credit attached, Liberia setting required",
    summary: "The novelist will adapt 'The Dragons, the Giant, the Women' for prestige TV. The deal — Liberia's largest U.S. studio attachment to date — includes a development fund and a first-look provision on her next two projects.",
    source: 'Variety',
    byline: 'By the TrueRate Culture Desk',
    readTime: '6 min read',
    time: '1h ago',
  },
  heroStat: {
    value: '$1.2M',
    label: 'A24 memoir option · Wayétu Moore',
    delta: 'Co-producer credit + dev fund',
    deltaDirection: 'up',
    sub: 'Largest U.S. studio attachment for a Liberian creator',
  },
  kpis: [
    { label: 'Top endorsement (annual)', value: '$420K',  delta: '+18% YoY', deltaDirection: 'up',   note: 'George Weah Foundation · partner brands' },
    { label: 'Brand deals signed (2025)', value: '38',    delta: '+11 YoY',  deltaDirection: 'up',   note: 'Across all Liberian celebrities' },
    { label: 'Active foundations',        value: '14',    delta: '+3 YoY',   deltaDirection: 'up',   note: 'With audited financials filed' },
    { label: 'Disclosed equity stakes',   value: '23',    delta: '+9 YoY',   deltaDirection: 'up',   note: 'Founder + advisor positions' },
  ],
  strip: [
    { category: 'Celebrity', title: "Liberian-American actress Wayétu Moore optioned by A24 for a memoir adaptation she'll co-produce",        source: 'Variety',          time: '2h ago' },
    { category: 'Celebrity', title: "George Weah's son Timothy makes surprise cameo at Liberian Music Awards — performs unreleased verse",      source: 'Liberian Observer', time: '4h ago' },
    { category: 'Celebrity', title: 'Bucky Raw closes Pepsi Liberia endorsement — three-year deal worth an estimated $180K',                  source: 'TrueRate Culture',  time: '6h ago' },
    { category: 'Celebrity', title: 'Patrice Juah becomes second Liberian on the Forbes Africa 30 Under 30 list — film and venture',           source: 'Forbes Africa',    time: '8h ago' },
    { category: 'Celebrity', title: 'MC Caro launches venture fund "Caro Capital" — $1.5M first close for Liberian creative startups',         source: 'TechCabal',        time: '10h ago' },
    { category: 'Celebrity', title: 'Liberian Music Awards 2026 — full winner list, with prize-money tracker by category',                    source: 'Liberian Observer', time: '12h ago' },
    { category: 'Celebrity', title: 'Erica Williams Foundation reports $640K disbursed in 2025 — schools, scholarships, hospital wings',       source: 'TrueRate',         time: '15h ago' },
    { category: 'Celebrity', title: 'Sundaygar Dearboy signs Orange Liberia ambassadorship — exclusive on telecom for 18 months',              source: 'FrontPage Africa', time: '20h ago' },
  ],
  tracker: {
    title: 'Top Earners — Liberian Public Figures',
    subtitle: 'TrueRate estimates · 2025 disclosed and modelled income',
    columns: [
      { key: 'rank',    label: '#',          align: 'left',  emphasize: true },
      { key: 'name',    label: 'Name',       align: 'left' },
      { key: 'sector',  label: 'Sector',     align: 'left',  hideOnMobile: true },
      { key: 'income',  label: 'Est. 2025',  align: 'right' },
      { key: 'deals',   label: 'Brand Deals',align: 'right' },
      { key: 'venture', label: 'Ventures',   align: 'left',  hideOnMobile: true },
    ],
    rows: [
      { rank: '1', name: 'George Weah',         sector: 'Politics · Sports', income: '$1.4M', deals: '5', venture: 'Foundation · property' },
      { rank: '2', name: 'Bucky Raw',           sector: 'Music',             income: '$880K', deals: '7', venture: 'Music label · merch' },
      { rank: '3', name: 'Wayétu Moore',        sector: 'Literature · Film', income: '$640K', deals: '2', venture: 'Production company' },
      { rank: '4', name: 'MC Caro',             sector: 'Music · Venture',   income: '$520K', deals: '4', venture: 'Caro Capital · label' },
      { rank: '5', name: 'Patrice Juah',        sector: 'Film · Venture',    income: '$410K', deals: '3', venture: 'Filmhouse Liberia' },
      { rank: '6', name: 'Sundaygar Dearboy',   sector: 'Music',             income: '$340K', deals: '4', venture: 'Mavin sub-label deal' },
      { rank: '7', name: 'Erica Williams',      sector: 'Music · Faith',     income: '$310K', deals: '3', venture: 'Foundation' },
      { rank: '8', name: 'Christoph the Change',sector: 'Music',             income: '$280K', deals: '2', venture: 'Independent' },
    ],
  },
  feed: [
    { category: 'Celebrity', title: "Wayétu Moore's A24 deal isn't just a book sale — it's a foothold for Liberian voices in U.S. prestige TV", summary: 'The novelist-turned-co-producer is the most senior Liberian creator inside an American studio system right now. Why that matters for the next ten years of the diaspora pipeline.',                              source: 'Variety',          time: '7 min read' },
    { category: 'Celebrity', title: 'The economics of being George Weah in 2026: politics out, brand and property in',                          summary: 'Post-presidency income shifted decisively into endorsement and real-estate cash flow. We modelled the foundation\'s 2025 disclosures alongside disclosed property holdings and partner-brand fees.',                  source: 'TrueRate',         time: '9 min read' },
    { category: 'Celebrity', title: "Caro Capital's $1.5M first close: who's writing the cheques and what they want",                            summary: 'A celebrity-led venture fund with a $25K minimum check size. We talked to three of the first five LP commitments and reviewed the term sheet for one of the first portfolio companies.',                            source: 'TechCabal',        time: '8 min read' },
    { category: 'Celebrity', title: 'Patrice Juah\'s Forbes 30 Under 30 spot: the actual P&L behind Filmhouse Liberia',                          summary: 'Forbes lists are aspirational. We dug into Filmhouse Liberia\'s registry filings and producer\'s notes to estimate annualised revenue and where the multiple is actually defensible.',                                source: 'Forbes Africa',    time: '6 min read' },
    { category: 'Celebrity', title: 'Bucky Raw + Pepsi Liberia: how a $180K endorsement compares with the Nigerian benchmark',                  summary: 'For an artist with 8.4M monthly listeners, Pepsi\'s deal looks underpriced by Lagos standards. We modelled the Liberian-corridor adjustment and where the negotiating leverage sat.',                                  source: 'TrueRate Culture', time: '7 min read' },
    { category: 'Celebrity', title: 'Liberian Music Awards 2026: the boardroom story behind the trophies',                                       summary: 'A new generation of female hipco and gospel artists swept the night. The boardroom story — voting blocs, sponsor influence, and the prize-money allocations — is more interesting than the winners\' list.',          source: 'Liberian Observer', time: '7 min read' },
    { category: 'Celebrity', title: 'Erica Williams Foundation\'s $640K disbursement: where the money actually went',                            summary: 'School construction, scholarship endowment, two hospital wings, and a small administrative line. We compared the audited figures with the 2024 baseline.',                                                            source: 'TrueRate',         time: '8 min read' },
    { category: 'Celebrity', title: 'Orange Liberia ambassadorships: a category review of the new wave of telecom endorsements',                summary: 'Five Liberian artists signed with Orange or Lonestar MTN in the last 18 months. We mapped the deals, the exclusivity windows, and what the telecom CMOs say they\'re actually buying.',                                source: 'FrontPage Africa', time: '6 min read' },
  ],
  mostRead: [
    { rank: 1, title: 'Wayétu Moore signs A24 — $1.2M memoir option with co-producer credit',     tag: 'Celebrity' },
    { rank: 2, title: 'Caro Capital first close: $1.5M and the term sheet that backs it',          tag: 'Celebrity' },
    { rank: 3, title: 'Bucky Raw + Pepsi Liberia: the $180K deal review',                          tag: 'Celebrity' },
    { rank: 4, title: 'Patrice Juah on Forbes 30 Under 30 — the P&L behind Filmhouse',            tag: 'Celebrity' },
    { rank: 5, title: 'Liberian Music Awards 2026 — the boardroom story',                         tag: 'Celebrity' },
  ],
  calendar: [
    { date: 'May 18', event: 'Caro Capital — open office hours, iCampus Monrovia' },
    { date: 'Jun 21', event: 'African Music Awards — Liberian delegation, Accra' },
    { date: 'Sep 15', event: 'George Weah Foundation annual gala — Monrovia' },
    { date: 'Nov 4',  event: 'Forbes Africa 30 Under 30 summit — Cape Town' },
  ],
};

const howToWatch: TopicContent = {
  hero: {
    category: 'How To Watch',
    title: "Showmax's MTN-bundled plan undercuts DStv by 62% — Liberia's streaming pricing war is officially live",
    summary: "MultiChoice's bundling deal with Lonestar MTN puts Showmax Mobile at LRD 1,200/month — the cheapest legal streaming option in Liberia. DStv's compact tier sits at LRD 3,200/month and is losing share fast.",
    source: 'TrueRate',
    byline: 'By the TrueRate Markets Desk',
    readTime: '5 min read',
    time: '1h ago',
  },
  heroStat: {
    value: 'LRD 1,200',
    label: 'Showmax + MTN — cheapest legal tier',
    delta: '−62% vs DStv Compact',
    deltaDirection: 'up',
    sub: '$6.30 USD-equivalent · 88,400 subs',
  },
  kpis: [
    { label: 'Cheapest legal streaming', value: 'LRD 1,200', delta: '−62% vs DStv',   deltaDirection: 'up',   note: 'Showmax Mobile · MTN bundle' },
    { label: 'Most-used service',        value: 'YouTube',   delta: '4.7M MAU',       deltaDirection: 'flat', note: 'Free tier · linear-replacement' },
    { label: 'MTN-bundle uptake',        value: '92,400',    delta: '+38% YoY',       deltaDirection: 'up',   note: 'Spotify + Showmax combined' },
    { label: 'Pirate-stream share',      value: '~31%',      delta: '−4pp YoY',       deltaDirection: 'up',   note: 'TrueRate estimate · video' },
  ],
  strip: [
    { category: 'How To Watch', title: 'Showmax Mobile + MTN bundle hits 88,400 Liberian subscribers — undercuts DStv compact tier by 62%',          source: 'TrueRate',          time: '2h ago' },
    { category: 'How To Watch', title: 'Netflix Africa drops localised LRD pricing — Standard tier now LRD 1,950/mo, Premium LRD 3,100/mo',           source: 'Reuters',           time: '4h ago' },
    { category: 'How To Watch', title: 'GoTV Liberia adds 4 channels at unchanged price — pressure on Smile and DStv pricing intensifies',            source: 'FrontPage Africa',  time: '6h ago' },
    { category: 'How To Watch', title: 'Where to watch Sundown in Sinkor: full list of theaters in Liberia, the U.S., U.K., and ECOWAS corridor',     source: 'TrueRate Culture',   time: '8h ago' },
    { category: 'How To Watch', title: 'Spotify-MTN bundle expands to Bong, Nimba, and Margibi — paid-tier Liberian users cross 92,000',              source: 'TrueRate',          time: '10h ago' },
    { category: 'How To Watch', title: 'YouTube TV in Liberia hits 480M monthly minutes — overtakes linear primetime by July',                        source: 'TrueRate',          time: '13h ago' },
    { category: 'How To Watch', title: 'Apple TV+ launches Liberian storefront — first regional pricing at LRD 1,800/mo with three months free',     source: 'TechCabal',         time: '15h ago' },
    { category: 'How To Watch', title: "Audiomack hits 1.2M MAU in Liberia — free tier remains the highest-share music platform on mobile",          source: 'TechCabal',         time: '20h ago' },
  ],
  tracker: {
    title: 'Streaming Price Tracker — Liberia',
    subtitle: 'May 2026 · monthly retail · LRD',
    columns: [
      { key: 'service',  label: 'Service',     align: 'left',  emphasize: true },
      { key: 'tier',     label: 'Tier',        align: 'left' },
      { key: 'price',    label: 'Price (LRD)', align: 'right' },
      { key: 'usd',      label: 'USD',         align: 'right' },
      { key: 'subs',     label: 'Subs (LR)',   align: 'right', hideOnMobile: true },
      { key: 'note',     label: 'Note',        align: 'left',  hideOnMobile: true },
    ],
    rows: [
      { service: 'Showmax', tier: 'Mobile (MTN bundle)', price: '1,200',  usd: '$6.30',  subs: '88,400', note: 'Cheapest legal · 480p mobile' },
      { service: 'Spotify', tier: 'Mini (MTN bundle)',   price: '900',    usd: '$4.70',  subs: '92,400', note: 'Music · ad-free · 1 device' },
      { service: 'Netflix', tier: 'Standard',            price: '1,950',  usd: '$10.20', subs: '32,100', note: 'Localised LRD pricing · Q2' },
      { service: 'Apple TV+', tier: 'Standard',          price: '1,800',  usd: '$9.40',  subs: '~7,000', note: '3 months free promo · launch' },
      { service: 'GoTV',    tier: 'Plus',                price: '2,400',  usd: '$12.50', subs: '188,000',note: 'Linear · 4 added channels' },
      { service: 'DStv',    tier: 'Compact',             price: '3,200',  usd: '$16.70', subs: '64,200', note: 'Linear · subscriber decline' },
      { service: 'DStv',    tier: 'Premium',             price: '6,800',  usd: '$35.40', subs: '12,800', note: 'Includes Showmax Premier' },
      { service: 'YouTube', tier: 'Free / Premium',      price: '0 / 1,500', usd: '0 / $7.80', subs: '4.7M MAU / 11K paid', note: 'Largest free reach · ad-supported' },
    ],
  },
  feed: [
    { category: 'How To Watch', title: 'The pricing war Liberia just inherited: Showmax vs Netflix vs DStv on a single chart',                       summary: 'Local-currency pricing differences swing 62% between the cheapest and most-used tier. We mapped the full slate, the bundle bolt-ons, and where the long-term ARPU pressure sits.',                                                source: 'TrueRate',          time: '8 min read' },
    { category: 'How To Watch', title: 'How to actually watch Liberian content from the diaspora: a 2026 guide',                                     summary: 'Showmax and Netflix have most of it; YouTube has a surprising amount of the rest. We catalogued where each major Liberian title is licensed and where the rights gaps still are.',                                                source: 'TrueRate Culture',   time: '6 min read' },
    { category: 'How To Watch', title: 'The MTN bundling playbook: how a telecom partnership rewrote streaming pricing in Liberia',                  summary: 'Spotify came first, Showmax second. We modelled the contribution margin to MTN, the platform partners, and the customer — and where the model breaks if the regulator intervenes.',                                                  source: 'TechCabal',         time: '7 min read' },
    { category: 'How To Watch', title: 'Pirate-stream share fell 4 points — here\'s where the displaced viewers actually went',                       summary: 'Most of the displacement landed on YouTube and Showmax Mobile. A small but interesting share moved to Apple TV+\'s launch promo. We surveyed 600 households for the underlying data.',                                              source: 'TrueRate',          time: '9 min read' },
    { category: 'How To Watch', title: 'DStv\'s 9% decline isn\'t just price — it\'s the bundling absence',                                          summary: 'MultiChoice has Showmax. It does not have a telecom partner in Liberia. Until that changes, the linear-DStv subscriber base will keep eroding into Showmax Mobile and Netflix.',                                                       source: 'Reuters',           time: '7 min read' },
    { category: 'How To Watch', title: 'Where to watch Sundown in Sinkor — and what it tells us about Liberian theatrical distribution',             summary: 'Diaspora multiplexes, ECOWAS-corridor independents, two streaming windows already negotiated for Q3. The full distribution stack and where the leakage sits.',                                                                    source: 'TrueRate Culture',   time: '8 min read' },
    { category: 'How To Watch', title: 'Apple TV+\'s Liberian storefront: a launch promo, a slim catalogue, and the long game',                       summary: 'Three free months and a thin local-content slate. Apple\'s Liberia play is a beachhead, not a frontal assault. We compared catalogue depth versus Showmax and Netflix.',                                                              source: 'TechCabal',         time: '6 min read' },
    { category: 'How To Watch', title: 'YouTube as Liberia\'s default linear: 480M minutes monthly and what it costs advertisers',                    summary: 'YouTube has effectively replaced primetime linear for under-35 Liberians. The CPM math, the inventory, and what it means for legacy broadcast ad budgets.',                                                                          source: 'TrueRate',          time: '9 min read' },
  ],
  mostRead: [
    { rank: 1, title: 'Showmax + MTN at LRD 1,200/mo undercuts DStv by 62%',                            tag: 'How To Watch' },
    { rank: 2, title: 'Netflix Liberia localised pricing: full slate, full prices',                      tag: 'How To Watch' },
    { rank: 3, title: 'Where to watch Sundown in Sinkor — full theatre + streaming list',                tag: 'How To Watch' },
    { rank: 4, title: 'Apple TV+ launches in Liberia: pricing, promo, catalogue',                        tag: 'How To Watch' },
    { rank: 5, title: 'YouTube\'s 480M monthly minutes — what advertisers are paying',                    tag: 'How To Watch' },
  ],
  calendar: [
    { date: 'May 6',  event: 'Apple TV+ Liberia launch — 3-month free promo opens' },
    { date: 'May 18', event: 'Lonestar MTN expands Showmax-bundle to Bong and Nimba' },
    { date: 'Jun 1',  event: 'Liberia Telecommunications Authority bundling-rules consultation' },
    { date: 'Aug 15', event: 'MultiChoice Africa Q4 disclosure — Liberia subscriber update' },
  ],
};

export const ENTERTAINMENT_TOPIC_CONTENT: Record<string, TopicContent> = {
  movies,
  tv,
  music,
  celebrity,
  'how-to-watch': howToWatch,
};
