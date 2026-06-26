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

/* ─── Top Stories (Builders | Top Stories) ─── */
export const HERO_STORY: Story = {
  href: '/news/cost-of-credit-liberian-business-borrowing',
  category: 'Credit',
  title: "The Cost of Credit: Why Liberian Businesses Pay 13% to Borrow",
  dek: 'The average lending rate stands at 13.11% while savings accounts pay 1.94% — an 11-point spread that prices most small businesses out of formal credit and keeps bank lending nearly flat.',
  source: 'TrueRate Business',
  time: 'Jun 20, 2026',
};

export const SECONDARY_STORIES: Story[] = [
  { href: '/news/liberia-5-billion-economy-sectoral-breakdown', category: 'Economy',  title: "Where Liberia's $5.2 Billion Economy Really Comes From",                      source: 'TrueRate Business', time: 'Jun 19, 2026' },
  { href: '/news/liberia-exports-two-billion-europe-dominance',  category: 'Trade',    title: "Exports Top $2 Billion — Europe Takes 82% of Everything Liberia Sells",       source: 'TrueRate Business', time: 'Jun 18, 2026' },
  { href: '/news/cement-output-surges-construction-boom',        category: 'Industry', title: "Cement Output Surges 52% as Liberia Builds",                                  source: 'TrueRate Business', time: 'Jun 17, 2026' },
];

/* ─── Latest News (2-col text grid) ─── */
export const LATEST_NEWS: Headline[] = [
  { href: '/news/iron-ore-production-quintuples-mining-revival',       title: "Iron Ore Output Quintuples in a Year, Reshaping Liberia's Mining Economy",         source: 'TrueRate Business' },
  { href: '/news/private-sector-credit-stalls-money-supply-swells',    title: 'Bank Lending to Business Barely Grows While Deposits Pile Up',                     source: 'TrueRate Business' },
  { href: '/news/government-revenue-surges-march-2026',                title: 'Government Revenue Hits $304 Million in March — What It Means for State Vendors',  source: 'TrueRate Business' },
  { href: '/news/trade-hospitality-sector-services-boom',              title: "Liberia's Trade and Hospitality Sector Hits $506 Million",                         source: 'TrueRate Business' },
  { href: '/news/cost-of-credit-liberian-business-borrowing',          title: 'Personal Loans Cost 16.16% — The Hidden Tax on Informal Entrepreneurs',           source: 'TrueRate Business' },
  { href: '/news/liberia-exports-two-billion-europe-dominance',        title: "China Buys $134 Million of Liberian Exports After Near-Zero in 2024",              source: 'TrueRate Business' },
];

/* ─── Entrepreneur | Build Your Business ─── */
export const ENTREPRENEUR_CARDS: Card[] = [
  { href: '/news/cost-of-credit-liberian-business-borrowing',          category: 'Credit',   title: 'What 13% Lending Rates Really Mean for Your Business Expansion Plan',                                source: 'TrueRate Business' },
  { href: '/news/cement-output-surges-construction-boom',              category: 'Industry', title: 'Cement Is Up 52%, Electricity Is at Record Highs — Where the Supply-Chain Openings Are',              source: 'TrueRate Business' },
  { href: '/news/government-revenue-surges-march-2026',                category: 'Policy',   title: 'Government Spending Hit $136.57M in March — How to Position Your Business as a State Vendor',        source: 'TrueRate Business' },
  { href: '/news/trade-hospitality-sector-services-boom',              category: 'Trade',    title: "The $506 Million Services Sector Is Where Most Small Businesses Compete — Here's How It's Growing",  source: 'TrueRate Business' },
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
  { href: '/news/iron-ore-production-quintuples-mining-revival',       category: 'Mining',    title: 'Mining Output Quintupled — 5 Side Businesses That Serve the Concession Supply Chain',               source: 'TrueRate Business' },
  { href: '/news/liberia-5-billion-economy-sectoral-breakdown',        category: 'Economy',   title: "Manufacturing Is Just 6.4% of GDP — That's a Gap You Could Fill",                                   source: 'TrueRate Business' },
  { href: '/news/liberia-exports-two-billion-europe-dominance',        category: 'Trade',     title: "Liberia Imports $2.35 Billion a Year — What if You Could Make 1% of That Locally?",                 source: 'TrueRate Business' },
  { href: '/news/private-sector-credit-stalls-money-supply-swells',    category: 'Finance',   title: 'Banks Won\'t Lend? 4 Alternative Capital Sources Liberian Entrepreneurs Are Actually Using',        source: 'TrueRate Business' },
];

/* ─── The Hustle ─── */
export const THE_HUSTLE_CARDS: Card[] = [
  { href: '/news/cement-output-surges-construction-boom',              category: 'Industry', title: 'Building boom',                                                              source: 'The Hustle' },
  { href: '/news/trade-hospitality-sector-services-boom',              category: 'Food',     title: 'Cookshop economics',                                                         source: 'The Hustle' },
  { href: '/news/iron-ore-production-quintuples-mining-revival',       category: 'Mining',   title: 'Iron rush',                                                                   source: 'The Hustle' },
  { href: '/news/government-revenue-surges-march-2026',                category: 'Policy',   title: 'The LRA is watching',                                                         source: 'The Hustle' },
];

/* ─── Franchise ─── */
export const FRANCHISE_CARDS: Card[] = [
  { href: '/news/cement-output-surges-construction-boom',              category: 'Industry', title: "Construction GDP Hit $200.86M — Cement Distributors and Hardware Dealers Are Expanding Fast",        source: 'TrueRate Business' },
  { href: '/news/trade-hospitality-sector-services-boom',              category: 'Trade',    title: "Trade & Hotels Is a $506M Sector Growing 5.5% — Where Franchise Models Are Gaining Traction",       source: 'TrueRate Business' },
  { href: '/news/liberia-5-billion-economy-sectoral-breakdown',        category: 'Economy',  title: "Services Are 38.7% of GDP — The Sectors Where Chain Operations Could Scale in Liberia",             source: 'TrueRate Business' },
  { href: '/news/cost-of-credit-liberian-business-borrowing',          category: 'Credit',   title: "Financing a Franchise at 13% Interest: The Math on Expansion Capital in Liberia",                   source: 'TrueRate Business' },
];

/* ─── More Business Stories (vertical list) ─── */
export const MORE_STORIES: Story[] = [
  { href: '/news/cost-of-credit-liberian-business-borrowing',          category: 'Credit',   title: 'The Cost of Credit: Why Liberian Businesses Pay 13% to Borrow',                                     source: 'TrueRate Business', time: 'Jun 20, 2026' },
  { href: '/news/liberia-5-billion-economy-sectoral-breakdown',        category: 'Economy',  title: "Where Liberia's $5.2 Billion Economy Really Comes From",                                            source: 'TrueRate Business', time: 'Jun 19, 2026' },
  { href: '/news/liberia-exports-two-billion-europe-dominance',        category: 'Trade',    title: "Exports Top $2 Billion — Europe Takes 82% of Everything Liberia Sells",                              source: 'TrueRate Business', time: 'Jun 18, 2026' },
  { href: '/news/cement-output-surges-construction-boom',              category: 'Industry', title: 'Cement Output Surges 52% as Liberia Builds',                                                         source: 'TrueRate Business', time: 'Jun 17, 2026' },
  { href: '/news/iron-ore-production-quintuples-mining-revival',       category: 'Mining',   title: "Iron Ore Output Quintuples in a Year, Reshaping Liberia's Mining Economy",                            source: 'TrueRate Business', time: 'Jun 16, 2026' },
  { href: '/news/private-sector-credit-stalls-money-supply-swells',    category: 'Finance',  title: 'Bank Lending to Business Barely Grows While Deposits Pile Up',                                       source: 'TrueRate Business', time: 'Jun 15, 2026' },
  { href: '/news/government-revenue-surges-march-2026',                category: 'Policy',   title: 'Government Revenue Hits $304 Million in March — What It Means for State Vendors',                    source: 'TrueRate Business', time: 'Jun 14, 2026' },
  { href: '/news/trade-hospitality-sector-services-boom',              category: 'Services', title: "Liberia's Trade and Hospitality Sector Hits $506 Million — Inside the Quiet Services Boom",          source: 'TrueRate Business', time: 'Jun 13, 2026' },
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
