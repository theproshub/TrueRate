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
