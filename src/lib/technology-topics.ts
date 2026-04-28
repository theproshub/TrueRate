import type { NewsItem } from '@/lib/types';

export interface TechnologyTopic {
  slug: string;
  label: string;
  blurb: string;
  /** Predicate: does this news item belong on the topic page? */
  matches: (item: NewsItem) => boolean;
}

const test = (haystack: string, re: RegExp): boolean => re.test(haystack);

function searchText(item: NewsItem): string {
  const body = Array.isArray(item.body) ? item.body.join(' ') : '';
  return `${item.title} ${item.summary ?? ''} ${body} ${item.category ?? ''}`.toLowerCase();
}

export const TECHNOLOGY_TOPICS: TechnologyTopic[] = [
  {
    slug: 'startups',
    label: 'Startups',
    blurb: 'Founders, fundraising, accelerators, and the early-stage companies building Liberia’s tech economy.',
    matches: i => test(searchText(i), /\b(startup|founder|seed round|series [abc]|pre-seed|accelerator|incubator|venture capital|vc fund|icampus|mest|demo day|raised \$|funding round)\b/),
  },
  {
    slug: 'fintech',
    label: 'Fintech',
    blurb: 'Mobile money, payments, digital wallets, and the rails moving money across Liberia.',
    matches: i => test(searchText(i), /\b(fintech|mobile money|orange money|lonestar (?:cell mtn )?mobile money|wallet|ussd|payment system|payment rails|payment corridor|interoperab|remittance|lemfi|worldremit|moneygram|western union)\b/),
  },
  {
    slug: 'ai-innovation',
    label: 'AI & Innovation',
    blurb: 'Artificial intelligence, machine learning, and emerging-tech experiments with a Liberian footprint.',
    matches: i => test(searchText(i), /\b(artificial intelligence|\bai\b|machine learning|adaptive learning|neural|algorithm|automation|llm|chatbot|au ai task force|generative)\b/),
  },
  {
    slug: 'digital-economy',
    label: 'Digital Economy',
    blurb: 'E-commerce, digital services, and the businesses operating Liberia online.',
    matches: i => test(searchText(i), /\b(digital economy|e-?commerce|jumia|gmv|online marketplace|digital services|digital finance|digitali[sz]ation|civil service payroll|payroll digital)\b/),
  },
  {
    slug: 'infrastructure',
    label: 'Infrastructure',
    blurb: 'Telecom networks, broadband, data centers, ports, energy — the physical layer of Liberia’s tech economy.',
    matches: i => test(searchText(i), /\b(telecom|broadband|4g|5g|fiber|fibre|cell tower|data center|cybersecurity|freeport|port of monrovia|port expansion|grid|electrification|liberia telecommunications)\b/),
  },
];

export const TECHNOLOGY_TOPIC_BY_SLUG: Record<string, TechnologyTopic> = Object.fromEntries(
  TECHNOLOGY_TOPICS.map(t => [t.slug, t])
);
