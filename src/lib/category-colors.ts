/** Unified per-category accent palette.
 *  Every category gets its own Tailwind text-color class. Used everywhere a
 *  category badge / tag is rendered — homepage, news, economy, technology,
 *  entertainment, sports, markets, etc.
 *
 *  Color choice principle: stay in the -400 / -500 saturation band so the
 *  same class reads well on both the dark site shell (bg-brand-dark) and
 *  the light article shell (bg-brand-surface). Deeper -700 tones are reserved
 *  for warm-tinted categories where -400 looks washed out on light bg.
 */
const ACCENT_COLORS: Record<string, string> = {
  // ── Policy / macro ──────────────────────────────────────────────
  policy:            'text-slate-400',
  'monetary policy': 'text-slate-400',
  fiscal:            'text-slate-400',
  'us fed':          'text-slate-400',
  imf:               'text-slate-400',
  infrastructure:    'text-slate-400',
  ports:             'text-slate-400',
  roads:             'text-slate-400',
  federation:        'text-slate-400',

  // ── Forex / markets / finance ───────────────────────────────────
  forex:             'text-sky-400',
  markets:           'text-sky-400',
  'capital markets': 'text-sky-400',
  finance:           'text-sky-400',
  investing:         'text-emerald-500',
  banking:           'text-emerald-600',

  // ── Economy / trade ─────────────────────────────────────────────
  economy:           'text-blue-400',
  business:          'text-blue-400',
  trade:             'text-violet-400',
  'eu trade':        'text-violet-400',
  china:             'text-violet-400',

  // ── Commodities / mining / agri / energy ────────────────────────
  commodities:       'text-orange-400',
  commodity:         'text-orange-400',
  mining:            'text-orange-400',
  agriculture:       'text-green-500',
  agri:              'text-green-500',
  agritech:          'text-green-500',
  energy:            'text-yellow-500',

  // ── Tech / AI / fintech / telecom ───────────────────────────────
  tech:              'text-sky-400',
  technology:        'text-sky-400',
  ai:                'text-indigo-400',
  fintech:           'text-sky-400',
  telecom:           'text-sky-400',
  'e-commerce':      'text-sky-400',

  // ── Startups / entrepreneurship ─────────────────────────────────
  startups:          'text-fuchsia-400',
  entrepreneurship:  'text-fuchsia-400',
  founders:          'text-fuchsia-400',
  funding:           'text-fuchsia-400',
  growth:            'text-fuchsia-400',
  smes:              'text-fuchsia-400',

  // ── Leadership / logistics / women ──────────────────────────────
  leadership:        'text-slate-400',
  logistics:         'text-amber-500',
  women:             'text-pink-400',

  // ── Analysis / explainer / investigation ────────────────────────
  analysis:          'text-purple-400',
  'deep dive':       'text-purple-400',
  explainer:         'text-purple-400',
  investigation:     'text-red-500',
  development:       'text-teal-400',

  // ── Entertainment ───────────────────────────────────────────────
  movies:            'text-rose-400',
  tv:                'text-cyan-400',
  music:             'text-violet-400',
  celebrity:         'text-pink-400',
  'film finance':    'text-rose-400',
  deals:             'text-orange-400',

  // ── Sports ──────────────────────────────────────────────────────
  sports:            'text-green-500',
  football:          'text-green-500',
  basketball:        'text-orange-500',
  athletics:         'text-red-400',
  cricket:           'text-lime-500',
  tennis:            'text-amber-500',
  golf:              'text-emerald-500',
  kit:               'text-green-500',
  shirt:             'text-green-500',
  title:             'text-green-500',

  // ── Sports-finance verticals ────────────────────────────────────
  sponsorship:       'text-sky-400',
  broadcast:         'text-sky-400',
  'broadcast rights':'text-sky-400',
  transfers:         'text-violet-400',
  'transfers & deals':'text-violet-400',
  'club finance':    'text-emerald-600',
  'sports finance':  'text-emerald-600',
  stadium:           'text-teal-400',

  // ── Research ────────────────────────────────────────────────────
  sector:            'text-blue-400',
  equity:            'text-emerald-500',
  macro:             'text-purple-400',
  'fixed income':    'text-slate-400',
  general:           'text-gray-400',
};

export function getCatColor(cat: string): string {
  return ACCENT_COLORS[cat.toLowerCase()] ?? 'text-gray-400';
}

/** Back-compat alias — homepage and news page imported a separately-named
 *  helper. Both now resolve to the same unified palette. */
export const getNewsCatColor = getCatColor;

/** Category thumbnail treatment — dark gradient + accent color + display label.
 *  Used by NewsThumbnail, HeroVisual, and VideoThumbnail to replace stock photos. */
export type CatStyle = { bg: string; accent: string; label: string };

const STYLES = {
  policy:       { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300' },
  forex:        { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-700' },
  economy:      { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300' },
  commodities:  { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300' },
  banking:      { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-700' },
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
  markets:      { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-700' },
  logistics:    { bg: 'bg-gradient-to-br from-amber-950 to-[#0f0900]',    accent: 'text-amber-300' },
  leadership:   { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300' },
  investigation:{ bg: 'bg-gradient-to-br from-red-950 to-[#100202]',      accent: 'text-red-300' },
  investing:    { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-700' },
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
  // Sports finance verticals
  'sponsorship':       ['markets',       'Sponsorship'],
  'broadcast':         ['tech',          'Broadcast'],
  'broadcast rights':  ['tech',          'Broadcast Rights'],
  'transfers':         ['trade',         'Transfers'],
  'transfers & deals': ['trade',         'Transfers'],
  'club finance':      ['banking',       'Club Finance'],
  'sports finance':    ['banking',       'Sports Finance'],
  'stadium':           ['development',   'Stadium'],
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

/**
 * Canonical fine-grained topic-tag vocabulary — the SINGLE SOURCE OF TRUTH for
 * the badges shown on cards. Every value is a display label from CAT_MAP above
 * and therefore has a color via getCatColor/getCatStyle. `General` is the
 * required fallback so a card never ships with a missing or hallucinated tag.
 *
 * Auto-generated feed cards (lib/feed/schemas.ts) and the model prompts are
 * both constrained to this list. If you add a tag here, add its color/CAT_MAP
 * entry above too.
 */
export const TOPIC_TAGS = [
  // Policy / macro
  'Policy', 'Monetary Policy', 'Fiscal', 'US Fed', 'IMF', 'Infrastructure', 'Ports', 'Roads', 'Federation',
  // Forex / markets / finance
  'Forex', 'Markets', 'Capital Markets', 'Finance', 'Investing', 'Banking',
  // Economy / trade
  'Economy', 'Business', 'EU Trade', 'Trade', 'China',
  // Commodities / mining / agri / energy
  'Commodities', 'Mining', 'Agriculture', 'Agri', 'AgriTech', 'Energy',
  // Tech / AI / fintech / telecom
  'Tech', 'Technology', 'AI', 'Fintech', 'Telecom', 'E-Commerce',
  // Startups / entrepreneurship
  'Startups', 'Entrepreneurship', 'Founders', 'Funding', 'Growth', 'SMEs',
  // Leadership / logistics / women
  'Leadership', 'Logistics', 'Women',
  // Analysis / explainer / investigation
  'Analysis', 'Deep Dive', 'Explainer', 'Investigation', 'Development',
  // Sports-finance verticals
  'Sponsorship', 'Broadcast', 'Broadcast Rights', 'Transfers', 'Club Finance', 'Sports Finance', 'Stadium',
  // Sports
  'Football', 'Basketball', 'Athletics', 'Cricket', 'Tennis', 'Golf', 'Kit', 'Shirt', 'Title',
  // Entertainment
  'Celebrity', 'Music', 'TV', 'Movies',
  // Required fallback
  'General',
] as const;

export type TopicTag = (typeof TOPIC_TAGS)[number];
