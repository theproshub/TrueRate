import type { NewsItem } from '@/lib/types';

export interface EntertainmentTopic {
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

export const ENTERTAINMENT_TOPICS: EntertainmentTopic[] = [
  {
    slug: 'movies',
    label: 'Movies',
    blurb: 'Nollywood, Lollywood, and the films shaping Liberia’s big-screen moment — from local productions to regional co-pros.',
    matches: i => test(searchText(i), /\b(movie|film|cinema|nollywood|lollywood|hollywood|premiere|director|screening|box office|feature film|short film)\b/),
  },
  {
    slug: 'tv',
    label: 'TV',
    blurb: 'Liberian TV, regional drama, talk shows, and the streaming series Liberians are binge-watching this week.',
    matches: i => test(searchText(i), /\b(tv|television|series|show|episode|season|sitcom|drama|reality|docu-?series|talk show)\b/),
  },
  {
    slug: 'music',
    label: 'Music',
    blurb: 'Hipco, Afrobeats, gospel, and the artists, labels, and venues building Liberia’s music economy.',
    matches: i => test(searchText(i), /\b(music|song|album|artist|musician|concert|tour|hipco|afrobeats|gospel|single|ep release|record label|spotify|apple music)\b/),
  },
  {
    slug: 'celebrity',
    label: 'Celebrity',
    blurb: 'Liberian and diaspora stars, public figures in culture, and the personalities driving the conversation.',
    matches: i => test(searchText(i), /\b(celebrity|star|actor|actress|red carpet|fashion week|brand ambassador|interview|profile|spotted|public figure)\b/),
  },
  {
    slug: 'how-to-watch',
    label: 'How To Watch',
    blurb: 'Streaming, satellite, and access — where to watch the films, shows, and live events that matter from Liberia.',
    matches: i => test(searchText(i), /\b(streaming|netflix|showmax|dstv|gotv|youtube|amazon prime|where to watch|live stream|broadcast|airing)\b/),
  },
];

export const ENTERTAINMENT_TOPIC_BY_SLUG: Record<string, EntertainmentTopic> = Object.fromEntries(
  ENTERTAINMENT_TOPICS.map(t => [t.slug, t])
);
