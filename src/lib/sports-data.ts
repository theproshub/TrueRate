/**
 * Mock sports data for the redesigned /sports page.
 * Single source of truth — easy to wire to a CMS later.
 * Liberian sports landscape only.
 */

export type LeagueKey =
  | 'LPL'
  | 'LWPL'
  | 'LBA'
  | 'LAF'
  | 'NATIONAL'
  | 'DIASPORA'
  | 'YOUTH';

export type MatchStatus = 'live' | 'final' | 'upcoming';

export type Match = {
  id: string;
  league: LeagueKey;
  leagueLabel: string;
  status: MatchStatus;
  /** Scheduled time text — used when status === 'upcoming' (e.g. "Today 4:00 PM", "Sat") */
  when?: string;
  venue: string;
  home: { name: string; short: string; score?: number };
  away: { name: string; short: string; score?: number };
  /** Extra info shown when status === 'upcoming' (e.g. "WAFU Qualifier") */
  note?: string;
};

export type Story = {
  href: string;
  category: string;
  title: string;
  dek?: string;
  source: string;
  time: string;
};

export type LeagueNavItem = { label: string; href: string };

/* ------------------------------------------------------------------ */
/* 1. League nav strip                                                 */
/* ------------------------------------------------------------------ */

export const LEAGUE_NAV: LeagueNavItem[] = [
  { label: 'LPL',           href: '/sports/lpl' },
  { label: 'LWPL',          href: '/sports/lwpl' },
  { label: 'LBA',           href: '/sports/lba' },
  { label: 'National Team', href: '/sports/national-team' },
  { label: 'Athletics',     href: '/sports/athletics' },
  { label: 'Diaspora',      href: '/sports/diaspora' },
  { label: 'Transfers',     href: '/sports/transfers-deals' },
  { label: 'County Meet',   href: '/sports/county-meet' },
  { label: 'Youth',         href: '/sports/youth' },
  { label: 'Watch',         href: '/sports/watch' },
  { label: 'More',          href: '/sports/more' },
];

/* ------------------------------------------------------------------ */
/* 2. Live scoreboard                                                  */
/* ------------------------------------------------------------------ */

export const SCOREBOARD: Match[] = [
  {
    id: 'lpl-barr-ie',
    league: 'LPL',
    leagueLabel: 'LPL',
    status: 'final',
    venue: 'ATS',
    home: { name: 'Mighty Barrolle', short: 'BAR', score: 1 },
    away: { name: 'Invincible Eleven', short: 'IE',  score: 0 },
  },
  {
    id: 'lpl-liscr-watanga',
    league: 'LPL',
    leagueLabel: 'LPL',
    status: 'upcoming',
    when: 'Today 4:00 PM',
    venue: 'SKD',
    home: { name: 'LISCR FC',  short: 'LIS' },
    away: { name: 'Watanga FC', short: 'WAT' },
  },
  {
    id: 'lpl-nimba-bea',
    league: 'LPL',
    leagueLabel: 'LPL',
    status: 'final',
    venue: 'Sanniquellie',
    home: { name: 'Nimba United',  short: 'NIM', score: 2 },
    away: { name: 'Bea Mountain',  short: 'BEA', score: 2 },
  },
  {
    id: 'lba-pythons-oilers',
    league: 'LBA',
    leagueLabel: 'LBA',
    status: 'final',
    venue: 'SKD Indoor',
    home: { name: 'NPA Pythons', short: 'NPA', score: 78 },
    away: { name: 'LPRC Oilers', short: 'LPR', score: 72 },
  },
  {
    id: 'lwpl-determine-world',
    league: 'LWPL',
    leagueLabel: 'LWPL',
    status: 'final',
    venue: 'ATS',
    home: { name: 'Determine Girls', short: 'DET', score: 3 },
    away: { name: 'World Girls',     short: 'WOR', score: 1 },
  },
  {
    id: 'nat-lonestar-sl',
    league: 'NATIONAL',
    leagueLabel: 'National',
    status: 'upcoming',
    when: 'Sat',
    venue: 'SKD',
    note: 'WAFU Qualifier',
    home: { name: 'Lone Star',     short: 'LBR' },
    away: { name: 'Sierra Leone',  short: 'SLE' },
  },
  {
    id: 'laf-trials',
    league: 'LAF',
    leagueLabel: 'Athletics',
    status: 'live',
    venue: 'SKD Track',
    note: 'National Trials Day 2',
    home: { name: 'National Trials', short: 'NT' },
    away: { name: 'Day 2',           short: 'D2' },
  },
];

/* ------------------------------------------------------------------ */
/* 3. Top headlines strip (six one-liners)                             */
/* ------------------------------------------------------------------ */

export const TOP_HEADLINES: Story[] = [
  { href: '/sports/story/lonestar-sl-wafu',     category: 'National', title: 'Lone Star edges Sierra Leone 2-1 in WAFU qualifier',         source: 'Daily Observer',   time: '2h ago' },
  { href: '/sports/story/barrolle-top-table',   category: 'LPL',      title: 'Mighty Barrolle reclaims top of LPL table after Watanga win',  source: 'FrontPage Africa', time: '4h ago' },
  { href: '/sports/story/williams-tunis-goal',  category: 'Diaspora', title: 'Liberian winger Williams scores again for Tunisian side',      source: 'TrueRate Sports',  time: '5h ago' },
  { href: '/sports/story/lba-finals-saturday',  category: 'LBA',      title: 'LBA finals tip-off Saturday at SKD Indoor',                    source: 'The New Dawn',     time: '6h ago' },
  { href: '/sports/story/determine-girls-9',    category: 'LWPL',     title: 'Determine Girls extend LWPL unbeaten run to 9',                source: 'Liberian Observer',time: '8h ago' },
  { href: '/sports/story/lfa-2026-calendar',    category: 'LPL',      title: 'LFA confirms 2026 league calendar with 16-team format',        source: 'TrueRate Sports',  time: '10h ago' },
];

/* ------------------------------------------------------------------ */
/* 4. Hero feature + related                                           */
/* ------------------------------------------------------------------ */

export const HERO: Story & { dek: string } = {
  href: '/sports/story/lonestar-wafu-revival',
  category: 'National',
  title: "Lone Star's WAFU revival: how a young squad is restoring belief in Liberian football",
  dek: 'A wave of diaspora call-ups, a younger spine, and a new attacking identity have turned a 2-1 win in Freetown into a referendum on the next decade of Liberian football. Inside the squad rebuild — and what qualification would unlock for the LFA budget.',
  source: 'Daily Observer',
  time: '1h ago',
};

export const HERO_RELATED: Story[] = [
  { href: '/sports/story/toe-breakout',         category: 'LPL',      title: "Mendoza-style: 19-year-old Toe is the LPL's breakout name",   source: 'TrueRate Sports',   time: '2h ago' },
  { href: '/sports/story/lonestar-captain-sl',  category: 'National', title: "Lone Star captain on the Sierra Leone win: 'We're hungry again'", source: 'FrontPage Africa', time: '3h ago' },
  { href: '/sports/story/diaspora-pipeline',    category: 'Diaspora', title: "Why Liberia's diaspora pipeline is finally producing results", source: 'TrueRate Analysis', time: '4h ago' },
];

/* ------------------------------------------------------------------ */
/* 5. My Teams sidebar                                                 */
/* ------------------------------------------------------------------ */

export type MyTeamCard = {
  name: string;
  short: string;
  league: string;
  next: string;
  last?: { result: 'W' | 'L' | 'D'; text: string };
};

export const MY_TEAMS: MyTeamCard[] = [
  { name: 'Lone Star',          short: 'LBR', league: 'National', next: 'Sat vs Sierra Leone',  last: { result: 'W', text: '2-1 vs SLE' } },
  { name: 'Mighty Barrolle',    short: 'BAR', league: 'LPL',      next: 'Sun vs LISCR',         last: { result: 'W', text: '1-0 vs IE'  } },
  { name: 'Invincible Eleven',  short: 'IE',  league: 'LPL',      next: 'Wed vs Nimba United',  last: { result: 'L', text: '0-1 vs BAR' } },
  { name: 'NPA Pythons',        short: 'NPA', league: 'LBA',      next: 'Sat vs LPRC Oilers',   last: { result: 'W', text: '78-72 vs LPR' } },
];

/* ------------------------------------------------------------------ */
/* 6. League blocks                                                    */
/* ------------------------------------------------------------------ */

export type PlayerSpotlight = {
  name: string;
  team: string;
  category: string;
  blurb: string;
  stats: { label: string; value: string }[];
};

export type LeagueBlockData = {
  key: LeagueKey;
  title: string;
  href: string;
  featured: Story & { dek: string };
  secondaries: Story[];
  miniScores: Match[];
  spotlight: PlayerSpotlight;
};

export const LEAGUE_BLOCKS: LeagueBlockData[] = [
  {
    key: 'LPL',
    title: 'Liberian Premier League',
    href: '/sports/lpl',
    featured: {
      href: '/sports/story/lpl-title-three-way',
      category: 'LPL',
      title: 'Title race tightens: three clubs separated by a single point with six matches left',
      dek: 'Mighty Barrolle, LISCR FC and Watanga FC are heading into the run-in inside one point of each other — and the head-to-head fixtures are loaded into the final fortnight.',
      source: 'TrueRate Sports',
      time: '3h ago',
    },
    secondaries: [
      { href: '/sports/story/lpl-watanga-defense',  category: 'LPL', title: "Watanga's back four is the league's most underrated story",  source: 'Daily Observer',    time: '6h ago' },
      { href: '/sports/story/liscr-young-keeper',   category: 'LPL', title: "LISCR's 18-year-old keeper has yet to concede at home",       source: 'FrontPage Africa',  time: '8h ago' },
      { href: '/sports/story/nimba-promotion-push', category: 'LPL', title: 'Nimba United climb into the Europa places after Bea draw',     source: 'TrueRate Sports',   time: '12h ago' },
    ],
    miniScores: [
      { id: 'm1', league: 'LPL', leagueLabel: 'LPL', status: 'final',    venue: 'ATS',          home: { name: 'Mighty Barrolle', short: 'BAR', score: 1 }, away: { name: 'Invincible Eleven', short: 'IE',  score: 0 } },
      { id: 'm2', league: 'LPL', leagueLabel: 'LPL', status: 'final',    venue: 'Sanniquellie', home: { name: 'Nimba United',    short: 'NIM', score: 2 }, away: { name: 'Bea Mountain',      short: 'BEA', score: 2 } },
      { id: 'm3', league: 'LPL', leagueLabel: 'LPL', status: 'upcoming', when: 'Today 4:00 PM', venue: 'SKD', home: { name: 'LISCR FC',  short: 'LIS' }, away: { name: 'Watanga FC',  short: 'WAT' } },
    ],
    spotlight: {
      name: 'Emmanuel Toe',
      team: 'Mighty Barrolle · Forward',
      category: 'LPL',
      blurb: '19-year-old academy product leading the LPL goal chart in his first senior season.',
      stats: [
        { label: 'Goals',    value: '11' },
        { label: 'Assists',  value: '4'  },
        { label: 'Apps',     value: '14' },
      ],
    },
  },
  {
    key: 'LBA',
    title: 'Liberia Basketball Association',
    href: '/sports/lba',
    featured: {
      href: '/sports/story/lba-finals-preview',
      category: 'LBA',
      title: 'Pythons vs Oilers: the LBA finals matchup the league has wanted for three years',
      dek: 'NPA Pythons enter the finals at full strength after dispatching Monrovia Club Breweries; LPRC Oilers arrive on a 9-game streak. Inside the tactical chess match.',
      source: 'TrueRate Sports',
      time: '5h ago',
    },
    secondaries: [
      { href: '/sports/story/lba-mvp-race',         category: 'LBA', title: 'The LBA MVP race comes down to two veterans and one rookie', source: 'The New Dawn',    time: '9h ago' },
      { href: '/sports/story/lba-tv-deal',          category: 'LBA', title: 'LBA finals will be free-to-air on LNTV for the first time',  source: 'FrontPage Africa', time: '14h ago' },
      { href: '/sports/story/lba-women-bridging',   category: 'LBA', title: "Women's LBA bridging division gets approval for 2026",        source: 'Daily Observer',   time: '1d ago' },
    ],
    miniScores: [
      { id: 'b1', league: 'LBA', leagueLabel: 'LBA', status: 'final',    venue: 'SKD Indoor', home: { name: 'NPA Pythons',  short: 'NPA', score: 78 }, away: { name: 'LPRC Oilers', short: 'LPR', score: 72 } },
      { id: 'b2', league: 'LBA', leagueLabel: 'LBA', status: 'final',    venue: 'SKD Indoor', home: { name: 'MCB',          short: 'MCB', score: 65 }, away: { name: 'NPA Pythons', short: 'NPA', score: 81 } },
      { id: 'b3', league: 'LBA', leagueLabel: 'LBA', status: 'upcoming', when: 'Sat 7:00 PM', venue: 'SKD Indoor', home: { name: 'NPA Pythons', short: 'NPA' }, away: { name: 'LPRC Oilers', short: 'LPR' } },
    ],
    spotlight: {
      name: 'Patrick Konah',
      team: 'NPA Pythons · Guard',
      category: 'LBA',
      blurb: 'Veteran point guard leading the LBA in assists and steals heading into the finals.',
      stats: [
        { label: 'PPG', value: '18.4' },
        { label: 'APG', value: '7.9'  },
        { label: 'SPG', value: '2.3'  },
      ],
    },
  },
  {
    key: 'NATIONAL',
    title: 'Lone Star',
    href: '/sports/national-team',
    featured: {
      href: '/sports/story/lonestar-camp-rotation',
      category: 'National',
      title: "Inside Lone Star's rotation policy: why the manager picked five debutants for Freetown",
      dek: 'A young midfield, a diaspora-heavy back line and the bet on minutes — how the Sierra Leone win was set up months in advance, and what changes for the Cape Verde return leg.',
      source: 'FrontPage Africa',
      time: '6h ago',
    },
    secondaries: [
      { href: '/sports/story/lonestar-women-camp', category: 'National', title: "Lone Star Women begin camp ahead of WAFU Zone A draw",      source: 'TrueRate Sports', time: '11h ago' },
      { href: '/sports/story/lfa-stipends',        category: 'National', title: 'LFA confirms increased match-day stipends for both squads', source: 'Daily Observer',   time: '14h ago' },
      { href: '/sports/story/lonestar-shirt',      category: 'National', title: 'New Lone Star shirt deal — what we know about the Orange extension', source: 'TrueRate Analysis', time: '1d ago' },
    ],
    miniScores: [
      { id: 'n1', league: 'NATIONAL', leagueLabel: 'WAFU',   status: 'final',    venue: 'Freetown', home: { name: 'Sierra Leone', short: 'SLE', score: 1 }, away: { name: 'Lone Star',   short: 'LBR', score: 2 } },
      { id: 'n2', league: 'NATIONAL', leagueLabel: 'Friendly', status: 'final',  venue: 'SKD',      home: { name: 'Lone Star',    short: 'LBR', score: 1 }, away: { name: 'Cape Verde', short: 'CPV', score: 1 } },
      { id: 'n3', league: 'NATIONAL', leagueLabel: 'WAFU',   status: 'upcoming', when: 'Sat',       venue: 'SKD', note: 'Return leg', home: { name: 'Lone Star',  short: 'LBR' }, away: { name: 'Sierra Leone', short: 'SLE' } },
    ],
    spotlight: {
      name: 'Joseph Williams',
      team: 'Lone Star · Winger',
      category: 'National',
      blurb: 'Tunisia-based forward back in the squad after a 14-month absence and providing two assists on debut return.',
      stats: [
        { label: 'Caps',    value: '23' },
        { label: 'Goals',   value: '6'  },
        { label: 'Assists', value: '8'  },
      ],
    },
  },
  {
    key: 'LAF',
    title: 'Athletics',
    href: '/sports/athletics',
    featured: {
      href: '/sports/story/national-trials-day1',
      category: 'Athletics',
      title: "National trials Day 1: two national records on the track, three more in field events",
      dek: 'A 14-year senior 400m mark goes down on the SKD track, and the 100m women\'s heat sets up a final between three sub-12 athletes for the first time.',
      source: 'TrueRate Sports',
      time: '4h ago',
    },
    secondaries: [
      { href: '/sports/story/laf-budget-2026',    category: 'Athletics', title: 'LAF approves 2026 budget with 22% increase for senior travel', source: 'Daily Observer',  time: '7h ago' },
      { href: '/sports/story/laf-coach-deal',     category: 'Athletics', title: 'New head coach for sprints group on a 2-year contract',          source: 'TrueRate Sports', time: '13h ago' },
      { href: '/sports/story/laf-junior-squad',   category: 'Athletics', title: 'Junior squad of 12 named for West Africa Region 2 meet',         source: 'The New Dawn',     time: '1d ago' },
    ],
    miniScores: [
      { id: 'a1', league: 'LAF', leagueLabel: 'Trials', status: 'live',     venue: 'SKD Track', note: 'Day 2 in progress', home: { name: 'National Trials', short: 'NT' }, away: { name: 'Day 2', short: 'D2' } },
      { id: 'a2', league: 'LAF', leagueLabel: 'Region', status: 'upcoming', when: 'Next week',  venue: 'Accra',           home: { name: 'WA Region 2',     short: 'WA2' }, away: { name: 'Junior meet', short: 'JR' } },
    ],
    spotlight: {
      name: 'Sarah Jallah',
      team: 'Liberia · 400m',
      category: 'Athletics',
      blurb: 'Broke a 14-year senior 400m mark on Day 1 of the National Trials at SKD.',
      stats: [
        { label: 'PB',    value: '51.18' },
        { label: 'Rank',  value: 'WA #3' },
        { label: 'Age',   value: '22'    },
      ],
    },
  },
  {
    key: 'DIASPORA',
    title: 'Diaspora',
    href: '/sports/diaspora',
    featured: {
      href: '/sports/story/williams-tunis-form',
      category: 'Diaspora',
      title: "Williams's Tunis form: 6 in 8 and a Lone Star return that's reshaping the wing",
      dek: 'A run of starts in the Tunisian top flight has put the 26-year-old back in international contention. Inside the system that\'s unlocked his finishing.',
      source: 'TrueRate Analysis',
      time: '5h ago',
    },
    secondaries: [
      { href: '/sports/story/diaspora-portugal',   category: 'Diaspora', title: "Two Liberian-eligible teenagers signed by Portuguese second-division clubs", source: 'TrueRate Sports', time: '9h ago' },
      { href: '/sports/story/diaspora-us-college', category: 'Diaspora', title: "US college pipeline: five Liberian-American forwards to watch",                source: 'FrontPage Africa', time: '14h ago' },
      { href: '/sports/story/diaspora-morocco',    category: 'Diaspora', title: 'Casablanca move on the cards for an LPL-bred midfielder',                       source: 'Reuters',         time: '1d ago' },
    ],
    miniScores: [
      { id: 'd1', league: 'DIASPORA', leagueLabel: 'Tunisia',  status: 'final', venue: 'Radès',  home: { name: 'ES Tunis',  short: 'EST', score: 2 }, away: { name: 'Sfaxien',   short: 'CSS', score: 0 } },
      { id: 'd2', league: 'DIASPORA', leagueLabel: 'Portugal', status: 'final', venue: 'Porto',  home: { name: 'Penafiel',  short: 'PEN', score: 1 }, away: { name: 'Académico', short: 'ACV', score: 1 } },
      { id: 'd3', league: 'DIASPORA', leagueLabel: 'Morocco',  status: 'final', venue: 'Casa',   home: { name: 'Raja',      short: 'RAJ', score: 3 }, away: { name: 'FUS Rabat', short: 'FUS', score: 2 } },
    ],
    spotlight: {
      name: 'Joseph Williams',
      team: 'ES Tunis · Winger',
      category: 'Diaspora',
      blurb: 'Six goals in eight Tunisian top-flight appearances and back in the Lone Star squad.',
      stats: [
        { label: 'Goals',   value: '6'  },
        { label: 'Apps',    value: '8'  },
        { label: 'Mins/G',  value: '94' },
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/* 7. Topic hub banners                                                */
/* ------------------------------------------------------------------ */

export type TopicHub = {
  href: string;
  category: string;
  kicker: string;
  title: string;
  dek: string;
  lead: Story;
  subs: Story[];
};

export const TOPIC_HUBS: TopicHub[] = [
  {
    href: '/sports/lpl-title-race',
    category: 'LPL',
    kicker: 'LPL Title Race',
    title: 'Three clubs, six matches, one trophy',
    dek: 'A live hub on the points, head-to-heads and fixtures that will decide the 2026 LPL.',
    lead: { href: '/sports/story/lpl-title-h2h', category: 'LPL', title: 'Why the head-to-head fixtures in matchweek 22 will decide the title', source: 'TrueRate Sports',  time: '2h ago' },
    subs: [
      { href: '/sports/story/lpl-title-fixtures',  category: 'LPL', title: 'The remaining six fixtures, ranked by difficulty',         source: 'TrueRate Analysis', time: '3h ago' },
      { href: '/sports/story/lpl-title-keeper',    category: 'LPL', title: "LISCR's keeper situation could swing the run-in",          source: 'Daily Observer',   time: '5h ago' },
      { href: '/sports/story/lpl-title-money',     category: 'LPL', title: 'The prize money difference between 1st and 3rd is now $48K', source: 'TrueRate Sports', time: '7h ago' },
    ],
  },
  {
    href: '/sports/wafu-zone-a',
    category: 'National',
    kicker: 'WAFU Zone A Qualifiers',
    title: "Lone Star's road to the WAFU Cup",
    dek: 'The fixtures, the squad, and the qualification math through the group stage.',
    lead: { href: '/sports/story/wafu-group-math', category: 'National', title: 'The qualification math: what Lone Star needs from its last two games',  source: 'FrontPage Africa', time: '4h ago' },
    subs: [
      { href: '/sports/story/wafu-cape-verde',   category: 'National', title: 'Cape Verde return leg: tactical preview',                       source: 'TrueRate Sports',   time: '6h ago' },
      { href: '/sports/story/wafu-squad-list',   category: 'National', title: '23-player squad named, three uncapped, two diaspora returns',   source: 'Daily Observer',     time: '8h ago' },
      { href: '/sports/story/wafu-broadcast',    category: 'National', title: 'How to watch: the Lone Star broadcast deal explained',          source: 'TrueRate Analysis',   time: '10h ago' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 8. Watch / videos                                                   */
/* ------------------------------------------------------------------ */

export type VideoCard = {
  href: string;
  category: string;
  title: string;
  duration: string;
  source: string;
};

export const VIDEOS: VideoCard[] = [
  { href: '/sports/watch/lonestar-press', category: 'National', title: 'Lone Star manager press conference: WAFU campaign', duration: '12:04', source: 'TrueRate Sports' },
  { href: '/sports/watch/lpl-mw12',       category: 'LPL',      title: 'LPL Matchday 12 highlights',                          duration: '08:31', source: 'TrueRate Sports' },
  { href: '/sports/watch/lba-finals',     category: 'LBA',      title: 'LBA finals preview: Pythons vs Oilers',                duration: '06:48', source: 'TrueRate Analysis' },
  { href: '/sports/watch/williams-tunis', category: 'Diaspora', title: 'Inside the diaspora: training with Williams in Tunis', duration: '14:22', source: 'TrueRate Sports' },
  { href: '/sports/watch/county-meet',    category: 'Athletics',title: 'County Meet 2026 opening ceremony',                    duration: '04:55', source: 'TrueRate Sports' },
  { href: '/sports/watch/trials-day1',    category: 'Athletics',title: 'Athletics trials Day 1 highlights',                    duration: '07:12', source: 'TrueRate Sports' },
];

/* ------------------------------------------------------------------ */
/* 9. Most read / trending                                             */
/* ------------------------------------------------------------------ */

export const MOST_READ: Story[] = [
  { href: '/sports/story/lonestar-wafu-revival',  category: 'National', title: "Lone Star's WAFU revival: how a young squad is restoring belief", source: 'Daily Observer',    time: '1h' },
  { href: '/sports/story/williams-tunis-form',    category: 'Diaspora', title: "Williams's Tunis form: 6 in 8 and a Lone Star return",            source: 'TrueRate Analysis', time: '5h' },
  { href: '/sports/story/lpl-title-three-way',    category: 'LPL',      title: 'LPL title race tightens to three clubs separated by a point',       source: 'TrueRate Sports',   time: '3h' },
  { href: '/sports/story/lba-finals-preview',     category: 'LBA',      title: 'Pythons vs Oilers: the LBA finals matchup the league wanted',       source: 'TrueRate Sports',   time: '5h' },
  { href: '/sports/story/national-trials-day1',   category: 'Athletics',title: 'Two national records fall on Day 1 of the National Trials',         source: 'TrueRate Sports',   time: '4h' },
  { href: '/sports/story/toe-breakout',           category: 'LPL',      title: "Mendoza-style: 19-year-old Toe is the LPL's breakout name",         source: 'TrueRate Sports',   time: '2h' },
  { href: '/sports/story/lfa-2026-calendar',      category: 'LPL',      title: 'LFA confirms 2026 league calendar with 16-team format',             source: 'TrueRate Sports',   time: '10h' },
  { href: '/sports/story/lba-tv-deal',            category: 'LBA',      title: 'LBA finals will be free-to-air on LNTV for the first time',         source: 'FrontPage Africa',  time: '14h' },
  { href: '/sports/story/diaspora-pipeline',      category: 'Diaspora', title: "Why Liberia's diaspora pipeline is finally producing results",      source: 'TrueRate Analysis', time: '4h' },
  { href: '/sports/story/lonestar-shirt',         category: 'National', title: 'New Lone Star shirt deal — what we know about the Orange extension',source: 'TrueRate Analysis', time: '1d' },
];
