/** TrueRate Builders — Liberian small business & entrepreneurship hub data */

export type Source = string;

export type Story = {
  href: string;
  title: string;
  category: string;
  source: Source;
  time: string;
  dek?: string;
};

export type Headline = { href: string; title: string; source: Source };

export type Card = {
  href: string;
  title: string;
  source: Source;
  category: string;
  badge?: string; // small inline badge e.g. "MCD -0.42%"
};

export type Video = {
  href: string;
  title: string;
  source: Source;
  duration: string;
  category: string;
  dek?: string;
  /** YouTube video ID — set to embed the player inline. */
  youtubeId?: string;
};

export type TrendingSME = { name: string; sector: string; signal: string };
export type Gainer = { label: string; change: string };
export type EconEvent = { date: string; title: string };

/* ─── Top Stories (Builders | Top Stories) ─── */
export const HERO_STORY: Story = {
  href: '/news/15',
  category: 'SME',
  title: '15 things every Liberian small business owner should know going into 2026',
  dek: 'From mobile-money adoption and LRA compliance to capital access and ECOWAS trade — how the Liberian SME landscape is shifting, and which moves matter before Q2.',
  source: 'TrueRate Analysis',
  time: 'Jun 20, 2026',
};

export const SECONDARY_STORIES: Story[] = [
  { href: '/news/12', category: 'Policy',   title: 'The new federal SME standard reshaping Liberian franchising',          source: 'Daily Observer',   time: 'Jun 20, 2026' },
  { href: '/news/15', category: 'Founders', title: 'Monrovia founder Marc Tarpeh on his plan to take Konnect public',     source: 'TrueRate Business',time: 'Jun 20, 2026' },
  { href: '/news/7',  category: 'SMEs',     title: 'Why most networking advice fails Liberian founders',                  source: 'FrontPage Africa', time: 'Jun 20, 2026' },
];

/* ─── Latest News (2-col text grid) ─── */
export const LATEST_NEWS: Headline[] = [
  { href: '/news/5',  title: 'Vietnamese sneaker supply shift opens window for Liberian rubber SMEs',           source: 'Reuters' },
  { href: '/news/3',  title: 'Private employment accelerated in Q1 as Monrovia SMEs drive job growth',          source: 'TrueRate' },
  { href: '/news/12', title: 'Ecobank Liberia expands SME desk with five new appointments in Ganta',            source: 'FrontPage Africa' },
  { href: '/news/7',  title: 'LRA warns 30% trust tax proposal would hit small businesses and families',        source: 'Daily Observer' },
  { href: '/news/27', title: 'Orange Money for Business hits 24,000 active SME merchants',                      source: 'The New Dawn' },
  { href: '/news/29', title: 'AfDB approves $12M SME credit line for Liberian women-led enterprises',           source: 'AfDB' },
];

/* ─── Entrepreneur | Build Your Business ─── */
export const ENTREPRENEUR_CARDS: Card[] = [
  { href: '/news/15', category: 'Founders', title: 'The One Trait That Quietly Determines Whether Liberian Founders Win or Fade Out',                source: 'TrueRate Founders' },
  { href: '/news/3',  category: 'Branding', title: 'Why a Well-Designed Website Is No Longer Enough — and What Actually Turns Liberian Visitors Into Buyers', source: 'TrueRate Founders' },
  { href: '/news/12', category: 'Policy',   title: 'Free Webinar | June 3: How to Build a Legit Liberian Business Without the LRA Headaches',         source: 'TrueRate Founders' },
  { href: '/news/29', category: 'Trade',    title: 'Liberian Retail Returns Climbed to $85M Last Year — Try These 3 Fixes Before Your Margins Disappear', source: 'TrueRate Founders' },
];

/* ─── Top Videos ─── */
export const FEATURED_VIDEO: Video = {
  href: '/videos/builders/1',
  title: 'Sinkor founder lists the top mistakes Liberians make when buying a small business',
  dek: 'Codie Tweh, founder of Konnect Capital, joins TrueRate Live to discuss 4 questions every Liberian small business buyer should ask before signing.',
  source: 'TrueRate Live',
  duration: '12:04',
  category: 'Founders',
};

export const VIDEO_THUMBS: Video[] = [
  { href: '/videos/builders/2', title: 'Sinkor founder lists the top mistakes Liberians make when buying a small business', source: 'TrueRate Live',  duration: 'NOW',  category: 'Founders' },
  { href: '/videos/builders/3', title: 'AI in the corner shop: How this Monrovia CEO is changing Liberian retail',           source: 'TrueRate Video', duration: '02:58', category: 'Fintech' },
  { href: '/videos/builders/4', title: 'How Sinkor Foods built a successful brand after 100 investors said no',              source: 'TrueRate Video', duration: '03:57', category: 'AgriTech' },
  { href: '/videos/builders/5', title: 'How one Buchanan woman turned content creation into a million-dollar retail brand',  source: 'TrueRate Video', duration: '02:12', category: 'Branding' },
];

/* ─── Start a Side Hustle ─── */
export const SIDE_HUSTLE_CARDS: Card[] = [
  { href: '/news/3',  category: 'SMEs',     title: 'This Dry Season Is the Perfect Time to Start a Consulting Side Hustle in Monrovia. Here\'s Your Game Plan.', source: 'TrueRate Founders' },
  { href: '/news/27', category: 'Founders', title: 'I Was a Hiring Manager at a Ministry. Here\'s the Biggest CV Mistake — and How I Turned It Into a $40K Side Hustle.', source: 'TrueRate Founders' },
  { href: '/news/12', category: 'Finance',  title: 'How to Make Money While You Sleep Is Only Partially Real — The Honest Truth About Passive Income in Liberia in 2026', source: 'TrueRate Founders' },
  { href: '/news/5',  category: 'AgriTech', title: "This 34-Year-Old's $5K-a-Month Buchanan Side Hustle Started With a Family Tradition — Now Tracking for $100K in Year One",     source: 'TrueRate Founders' },
];

/* ─── The Hustle ─── */
export const THE_HUSTLE_CARDS: Card[] = [
  { href: '/news/3',  category: 'AgriTech', title: 'Ball of fire',                                                            source: 'The Hustle' },
  { href: '/news/12', category: 'Food',     title: 'Soft serve, hard margins',                                                 source: 'The Hustle' },
  { href: '/news/29', category: 'Trade',    title: 'Cold-chain gold',                                                          source: 'The Hustle' },
  { href: '/news/7',  category: 'Policy',   title: 'End of the line',                                                          source: 'The Hustle' },
];

/* ─── Franchise ─── */
export const FRANCHISE_CARDS: Card[] = [
  { href: '/news/15', category: 'Founders', title: "Total Energies' Expanded Monrovia Map Is Beating Expectations — And Franchisees Are Seeing the Value", source: 'TrueRate Business', badge: 'TOT +1.20%' },
  { href: '/news/27', category: 'Women',    title: "'It Was Hard, Be Honest' — How This Liberian Couple Divorced, But Still Grew Their Bakery to 16 Locations and $1.4M In Revenue",  source: 'TrueRate Business' },
  { href: '/news/12', category: 'Founders', title: "Capitol Hill Coffee's CEO Took Calls From 1,500 Customers. What Happened Next Is Already Showing Up in Sinkor Cafés.",            source: 'TrueRate Business' },
  { href: '/news/3',  category: 'Trade',    title: "Why Monrovia's Hot Bread Co. Is Hitting Pause on Franchising: 'We Have a Lot to Prove'",                                          source: 'TrueRate Business' },
];

/* ─── More Business Stories (vertical list) ─── */
export const MORE_STORIES: Story[] = [
  { href: '/news/5',  category: 'AgriTech', title: 'Cassava SMEs hit record output as Ministry of Agriculture pricing reform kicks in',                      source: 'The New Dawn',     time: 'Jun 19, 2026' },
  { href: '/news/12', category: 'Fintech',  title: 'Liberia\'s Small Businesses Are Booming, Just Not Their Retirement Plans',                                source: 'TrueRate',         time: 'Jun 19, 2026' },
  { href: '/news/3',  category: 'Trade',    title: 'Mom-and-Pop Liberian businesses hit by brutal job losses as iron-ore slowdown bites',                     source: 'FrontPage Africa', time: 'Jun 18, 2026' },
  { href: '/news/27', category: 'Women',    title: 'Women-led Bong County agri-co-op secures $180K AfDB grant',                                              source: 'AfDB',             time: 'Jun 18, 2026' },
  { href: '/news/7',  category: 'Policy',   title: 'New LRA digital filing system cuts SME compliance time by 60%',                                          source: 'Daily Observer',   time: 'Jun 17, 2026' },
  { href: '/news/15', category: 'Fintech',  title: 'Diaspora-backed Monrovia fintech crosses 50,000 SME accounts',                                           source: 'TrueRate',         time: 'Jun 17, 2026' },
  { href: '/news/3',  category: 'SMEs',     title: "Why Ganta is emerging as Liberia's next SME hotspot",                                                    source: 'The New Dawn',     time: 'Jun 16, 2026' },
  { href: '/news/29', category: 'Security', title: 'Mobile money fraud is rising — how Liberian SMEs are fighting back',                                     source: 'Reuters',          time: 'Jun 15, 2026' },
];

/* ─── Right rail data ─── */
/* Liberia Markets panel is now live — see components/builders/LiveMarketsMini. */

export const TRENDING_SMES: TrendingSME[] = [
  { name: 'Konnect Fintech',     sector: 'Fintech',      signal: '+35% MoM users'        },
  { name: 'Sinkor Foods',        sector: 'Agribusiness', signal: 'Expanding to Buchanan' },
  { name: 'Liberty Lender',      sector: 'Microfinance', signal: '$2M Series A'          },
  { name: 'Monrovia Tech Hub',   sector: 'Coworking',    signal: '42 new members'        },
  { name: 'Red Light Logistics', sector: 'Trade',        signal: 'New ECOWAS route'      },
  { name: 'Bong Poultry Co-op',  sector: 'Agri',         signal: '+18% revenue YoY'      },
];

export const TOP_GAINERS: Gainer[] = [
  { label: 'Agribusiness',           change: '+18% YoY' },
  { label: 'Mobile Money Merchants', change: '+12% MoM' },
  { label: 'Logistics & Freight',    change: '+9% QoQ'  },
  { label: 'Fintech SMEs',           change: '+24% YoY' },
  { label: 'Construction Materials', change: '+7% QoQ'  },
  { label: 'Women-Led Enterprises',  change: '+15% YoY' },
];

export const ECON_EVENTS: EconEvent[] = [
  { date: 'Apr 7',  title: 'CBL Monetary Policy Meeting'         },
  { date: 'Apr 10', title: 'Q1 GDP Advance Estimate'             },
  { date: 'Apr 14', title: 'Liberia Investment Forum (Monrovia)' },
  { date: 'Apr 18', title: 'LRA SME Tax Workshop'                },
  { date: 'Apr 25', title: 'ECOWAS SME Finance Summit'           },
];
