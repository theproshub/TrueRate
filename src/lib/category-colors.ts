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

const CAT_STYLE: Record<string, CatStyle> = {
  policy:            { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Policy' },
  'Monetary Policy': { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Monetary Policy' },
  Policy:            { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Policy' },
  forex:             { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400',  label: 'Forex' },
  economy:           { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300',     label: 'Economy' },
  Economy:           { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300',     label: 'Economy' },
  commodities:       { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300',   label: 'Commodities' },
  Mining:            { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300',   label: 'Mining' },
  Banking:           { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-emerald-400',  label: 'Banking' },
  Agriculture:       { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',     accent: 'text-lime-400',     label: 'Agriculture' },
  Energy:            { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',   accent: 'text-yellow-300',   label: 'Energy' },
  Trade:             { bg: 'bg-gradient-to-br from-purple-950 to-[#07000f]',   accent: 'text-purple-300',   label: 'Trade' },
  Tech:              { bg: 'bg-gradient-to-br from-sky-950 to-[#030a12]',      accent: 'text-sky-300',      label: 'Tech' },
  Analysis:          { bg: 'bg-gradient-to-br from-indigo-950 to-[#04000f]',   accent: 'text-indigo-300',   label: 'Analysis' },
  Development:       { bg: 'bg-gradient-to-br from-teal-950 to-[#030f0b]',     accent: 'text-teal-300',     label: 'Development' },
  Infrastructure:    { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Infrastructure' },
  Football:          { bg: 'bg-gradient-to-br from-green-950 to-[#020f02]',    accent: 'text-green-400',    label: 'Football' },
  Basketball:        { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-400',   label: 'Basketball' },
  Athletics:         { bg: 'bg-gradient-to-br from-red-950 to-[#100202]',      accent: 'text-red-400',      label: 'Athletics' },
  Cricket:           { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',     accent: 'text-lime-400',     label: 'Cricket' },
  Tennis:            { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',   accent: 'text-yellow-300',   label: 'Tennis' },
  Golf:              { bg: 'bg-gradient-to-br from-green-950 to-[#020f02]',    accent: 'text-green-300',    label: 'Golf' },
  Celebrity:         { bg: 'bg-gradient-to-br from-pink-950 to-[#0f0006]',     accent: 'text-pink-300',     label: 'Celebrity' },
  Music:             { bg: 'bg-gradient-to-br from-violet-950 to-[#07000f]',   accent: 'text-violet-300',   label: 'Music' },
  TV:                { bg: 'bg-gradient-to-br from-cyan-950 to-[#020c0f]',     accent: 'text-cyan-300',     label: 'TV' },
  Movies:            { bg: 'bg-gradient-to-br from-rose-950 to-[#0f0205]',     accent: 'text-rose-300',     label: 'Movies' },
};

export function getCatStyle(cat: string): CatStyle {
  return CAT_STYLE[cat] ?? CAT_STYLE['economy'];
}
