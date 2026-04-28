import type { NewsItem } from '@/lib/types';

export interface EconomyTopic {
  slug: string;
  label: string;
  blurb: string;
  /** Predicate: does this news item belong on the topic page? */
  matches: (item: NewsItem) => boolean;
}

const hasAny = (haystack: string, needles: RegExp): boolean => needles.test(haystack);

function searchText(item: NewsItem): string {
  const body = Array.isArray(item.body) ? item.body.join(' ') : '';
  return `${item.title} ${item.summary ?? ''} ${body} ${item.category ?? ''}`.toLowerCase();
}

export const ECONOMY_TOPICS: EconomyTopic[] = [
  {
    slug: 'monetary-policy',
    label: 'Monetary Policy',
    blurb: 'CBL rate decisions, reserve management, and central-bank actions shaping credit and the LRD.',
    matches: i => hasAny(searchText(i), /\b(cbl|central bank|monetary policy|benchmark rate|policy rate|mpc|reserve requirement|interest rate)\b/),
  },
  {
    slug: 'growth',
    label: 'Growth',
    blurb: 'GDP, sector output, IMF / World Bank forecasts, and the drivers of Liberia’s expansion.',
    matches: i => hasAny(searchText(i), /\b(gdp|growth forecast|growth upgrade|economic growth|expansion|recovery|projected growth|imf forecast|world bank forecast)\b/),
  },
  {
    slug: 'inflation',
    label: 'Inflation',
    blurb: 'Headline and core CPI, food and fuel prices, and how cost-of-living pressure is moving.',
    matches: i => hasAny(searchText(i), /\b(inflation|cpi|consumer price|food price|price pressure|deflation|disinflation)\b/),
  },
  {
    slug: 'trade',
    label: 'Trade',
    blurb: 'Exports, imports, the Freeport, commodity flows, and Liberia’s position in regional trade.',
    matches: i => hasAny(searchText(i), /\b(export|import|trade balance|tariff|freeport|port of monrovia|customs|iron ore|rubber|palm oil|cocoa|commodit)\b/),
  },
  {
    slug: 'fiscal',
    label: 'Fiscal',
    blurb: 'The national budget, debt, revenue, IMF Article IV reviews, and public spending.',
    matches: i => hasAny(searchText(i), /\b(budget|fiscal|deficit|public debt|government debt|revenue|tax|treasury|imf article|imf programme|imf program)\b/),
  },
  {
    slug: 'west-africa',
    label: 'West Africa',
    blurb: 'Regional currencies, ECOWAS policy, and the macro stories from neighbouring economies.',
    matches: i => hasAny(searchText(i), /\b(ecowas|west africa|ghana|nigeria|sierra leone|c[oô]te d['']ivoire|ivory coast|brvm|naira|cedi|guinea)\b/),
  },
];

export const ECONOMY_TOPIC_BY_SLUG: Record<string, EconomyTopic> = Object.fromEntries(
  ECONOMY_TOPICS.map(t => [t.slug, t])
);
