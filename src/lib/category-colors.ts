/** Canonical category → Tailwind text-color class.
 *  Neutral single-tone approach matching Yahoo Finance article tag style. */
const COLORS: Record<string, string> = {
  // News / Economy
  policy:           'text-gray-400',
  'monetary policy':'text-gray-400',
  infrastructure:   'text-gray-400',
  imf:              'text-gray-400',
  forex:            'text-gray-400',
  markets:          'text-gray-400',
  economy:          'text-gray-400',
  commodities:      'text-gray-400',
  commodity:        'text-gray-400',
  mining:           'text-gray-400',
  banking:          'text-gray-400',
  agriculture:      'text-gray-400',
  agri:             'text-gray-400',
  energy:           'text-gray-400',
  trade:            'text-gray-400',
  tech:             'text-gray-400',
  analysis:         'text-gray-400',
  development:      'text-gray-400',
  // Entertainment
  movies:           'text-gray-400',
  tv:               'text-gray-400',
  music:            'text-gray-400',
  'film finance':   'text-gray-400',
  deals:            'text-gray-400',
  // Sports
  football:         'text-gray-400',
  basketball:       'text-gray-400',
  athletics:        'text-gray-400',
  cricket:          'text-gray-400',
  tennis:           'text-gray-400',
  golf:             'text-gray-400',
  // Research
  sector:           'text-gray-400',
  equity:           'text-gray-400',
  macro:            'text-gray-400',
  'fixed income':   'text-gray-400',
};

export function getCatColor(cat: string): string {
  return COLORS[cat.toLowerCase()] ?? 'text-gray-400';
}

/** Yahoo Finance-style per-category accent colors — news page only. */
const NEWS_COLORS: Record<string, string> = {
  policy:           'text-slate-400',
  'monetary policy':'text-slate-400',
  infrastructure:   'text-slate-400',
  imf:              'text-slate-400',
  forex:            'text-sky-400',
  markets:          'text-sky-400',
  economy:          'text-blue-400',
  commodities:      'text-orange-400',
  commodity:        'text-orange-400',
  mining:           'text-orange-400',
  banking:          'text-emerald-400',
  agriculture:      'text-green-400',
  agri:             'text-green-400',
  energy:           'text-yellow-400',
  trade:            'text-violet-400',
  tech:             'text-sky-400',
  analysis:         'text-purple-400',
  development:      'text-teal-400',
};

export function getNewsCatColor(cat: string): string {
  return NEWS_COLORS[cat.toLowerCase()] ?? 'text-gray-400';
}

/** Category thumbnail treatment — dark gradient + accent color + display label.
 *  Used by NewsThumbnail, HeroVisual, and VideoThumbnail to replace stock photos. */
export type CatStyle = { bg: string; accent: string; label: string };

const STYLES = {
  policy:       { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300' },
  forex:        { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400' },
  economy:      { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300' },
  commodities:  { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300' },
  banking:      { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400' },
  agriculture:  { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',     accent: 'text-lime-400' },
  energy:       { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',   accent: 'text-yellow-300' },
  trade:        { bg: 'bg-gradient-to-br from-purple-950 to-[#07000f]',   accent: 'text-purple-300' },
  tech:         { bg: 'bg-gradient-to-br from-sky-950 to-[#030a12]',      accent: 'text-sky-300' },
  analysis:     { bg: 'bg-gradient-to-br from-indigo-950 to-[#04000f]',   accent: 'text-indigo-300' },
  development:  { bg: 'bg-gradient-to-br from-teal-950 to-[#030f0b]',     accent: 'text-teal-300' },
  sports:       { bg: 'bg-gradient-to-br from-green-950 to-[#020f02]',    accent: 'text-green-400' },
  music:        { bg: 'bg-gradient-to-br from-violet-950 to-[#07000f]',   accent: 'text-violet-300' },
  movies:       { bg: 'bg-gradient-to-br from-rose-950 to-[#0f0205]',     accent: 'text-rose-300' },
  celebrity:    { bg: 'bg-gradient-to-br from-pink-950 to-[#0f0006]',     accent: 'text-pink-300' },
  tv:           { bg: 'bg-gradient-to-br from-cyan-950 to-[#020c0f]',     accent: 'text-cyan-300' },
  startups:     { bg: 'bg-gradient-to-br from-fuchsia-950 to-[#0d000f]',  accent: 'text-fuchsia-300' },
  ai:           { bg: 'bg-gradient-to-br from-indigo-950 to-[#04000f]',   accent: 'text-indigo-300' },
  markets:      { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400' },
  logistics:    { bg: 'bg-gradient-to-br from-amber-950 to-[#0f0900]',    accent: 'text-amber-300' },
  leadership:   { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300' },
  investigation:{ bg: 'bg-gradient-to-br from-red-950 to-[#100202]',      accent: 'text-red-300' },
  investing:    { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400' },
  fintech:      { bg: 'bg-gradient-to-br from-sky-950 to-[#030a12]',      accent: 'text-sky-300' },
  women:        { bg: 'bg-gradient-to-br from-pink-950 to-[#0f0006]',     accent: 'text-pink-300' },
} as const;

/** cat key (lowercased) → [styleKey, displayLabel] */
const CAT_MAP: Record<string, [keyof typeof STYLES, string]> = {
  // Policy / macro
  'policy':            ['policy',        'Policy'],
  'monetary policy':   ['policy',        'Monetary Policy'],
  'fiscal':            ['policy',        'Fiscal'],
  'us fed':            ['policy',        'US Fed'],
  'imf':               ['policy',        'IMF'],
  'infrastructure':    ['policy',        'Infrastructure'],
  'ports':             ['policy',        'Ports'],
  'roads':             ['policy',        'Roads'],
  'federation':        ['policy',        'Federation'],
  // Forex / markets / finance
  'forex':             ['forex',         'Forex'],
  'markets':           ['markets',       'Markets'],
  'capital markets':   ['markets',       'Capital Markets'],
  'finance':           ['markets',       'Finance'],
  'investing':         ['investing',     'Investing'],
  // Economy
  'economy':           ['economy',       'Economy'],
  'business':          ['economy',       'Business'],
  'eu trade':          ['trade',         'EU Trade'],
  'trade':             ['trade',         'Trade'],
  'china':             ['trade',         'China'],
  // Commodities / mining / agri / energy
  'commodities':       ['commodities',   'Commodities'],
  'mining':            ['commodities',   'Mining'],
  'agriculture':       ['agriculture',   'Agriculture'],
  'agri':              ['agriculture',   'Agri'],
  'agritech':          ['agriculture',   'AgriTech'],
  'energy':            ['energy',        'Energy'],
  // Banking
  'banking':           ['banking',       'Banking'],
  // Tech / AI / Fintech / Telecom
  'tech':              ['tech',          'Tech'],
  'technology':        ['tech',          'Technology'],
  'ai':                ['ai',            'AI'],
  'fintech':           ['fintech',       'Fintech'],
  'telecom':           ['tech',          'Telecom'],
  'e-commerce':        ['fintech',       'E-Commerce'],
  // Startups / entrepreneurship / funding
  'startups':          ['startups',      'Startups'],
  'entrepreneurship':  ['startups',      'Entrepreneurship'],
  'founders':          ['startups',      'Founders'],
  'funding':           ['startups',      'Funding'],
  'growth':            ['startups',      'Growth'],
  'smes':              ['startups',      'SMEs'],
  // Leadership / logistics / women
  'leadership':        ['leadership',    'Leadership'],
  'logistics':         ['logistics',     'Logistics'],
  'women':             ['women',         'Women'],
  // Analysis / deep dive / explainer / investigation
  'analysis':          ['analysis',      'Analysis'],
  'deep dive':         ['analysis',      'Deep Dive'],
  'explainer':         ['analysis',      'Explainer'],
  'investigation':     ['investigation', 'Investigation'],
  'development':       ['development',   'Development'],
  // Sports
  'football':          ['sports',        'Football'],
  'basketball':        ['commodities',   'Basketball'],
  'athletics':         ['investigation', 'Athletics'],
  'cricket':           ['agriculture',   'Cricket'],
  'tennis':            ['energy',        'Tennis'],
  'golf':              ['sports',        'Golf'],
  'kit':               ['sports',        'Kit'],
  'shirt':             ['sports',        'Shirt'],
  'title':             ['sports',        'Title'],
  // Entertainment
  'celebrity':         ['celebrity',     'Celebrity'],
  'music':             ['music',         'Music'],
  'tv':                ['tv',            'TV'],
  'movies':            ['movies',        'Movies'],
};

export function getCatStyle(cat: string): CatStyle {
  const raw = (cat ?? '').trim();
  const hit = CAT_MAP[raw.toLowerCase()];
  if (hit) {
    const [key, label] = hit;
    return { ...STYLES[key], label };
  }
  // Unknown category — keep the raw label so it's visible, use economy palette
  return { ...STYLES.economy, label: raw || 'Story' };
}
