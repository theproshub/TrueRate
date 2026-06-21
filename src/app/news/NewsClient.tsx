'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import { NewsThumbnail } from '@/components/NewsThumbnail';
import { getNewsCatColor as getCatColor } from '@/lib/category-colors';
import { Heading, Text } from '@/components/ui';

const TABS = ['For You', 'Economy', 'Markets', 'Policy', 'Trade', 'Mining', 'Agriculture'];
const GENERAL_TABS = ['For You', 'Finance', 'Technology', 'Economy', 'World'];

function timeAgo(d: string) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Single hero card used in the mobile swipe view. */
function HeroCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="block w-full shrink-0 no-underline relative overflow-hidden rounded-xl">
      <NewsThumbnail category={item.category} id={item.id} src={item.image} className="w-full h-[340px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      {/* Category badge */}
      <div className="absolute top-3 left-4">
        <span className={`inline-block rounded bg-black/50 backdrop-blur-sm px-2.5 py-1 text-2xs font-bold uppercase tracking-widest ${getCatColor(item.category)}`}>{item.category}</span>
      </div>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h2 className="text-xl font-extrabold leading-[1.15] text-white drop-shadow-lg line-clamp-3 tracking-tight text-balance">
          {item.title}
        </h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-white/75 line-clamp-2 drop-shadow">
          {item.summary}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
          <span className="font-semibold text-white/80">{item.source}</span>
          <span aria-hidden="true">&middot;</span>
          <time>{timeAgo(item.date)}</time>
        </div>
      </div>
    </Link>
  );
}

/** Interactive hero carousel (client island). */
export function HeroCarousel({ items = newsItems }: { items?: NewsItem[] }) {
  const [idx, setIdx] = useState(0);
  const slides = items.slice(0, 5);
  const item = slides[idx];

  const goNext = useCallback(() => setIdx(i => (i + 1) % slides.length), [slides.length]);
  const goPrev = useCallback(() => setIdx(i => (i - 1 + slides.length) % slides.length), [slides.length]);

  return (
    <>
      {/* ── Mobile: native horizontal scroll, one card at a time ── */}
      <div
        className="sm:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Top stories"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="snap-center shrink-0 w-[85vw]">
            <HeroCard item={slide} />
          </div>
        ))}
      </div>

      {/* ── Desktop: overlay carousel ── */}
      <div className="hidden sm:block relative overflow-hidden rounded-xl group" role="region" aria-label="Top stories carousel">
        <NewsThumbnail category={item.category} id={item.id} src={item.image} className="w-full aspect-[16/9]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

        {/* Category badge */}
        <div className="absolute top-4 left-5">
          <span className={`inline-block rounded bg-black/50 backdrop-blur-sm px-2.5 py-1 text-2xs font-bold uppercase tracking-widest ${getCatColor(item.category)}`}>{item.category}</span>
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 right-5 rounded bg-black/50 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white/80 tabular-nums">
          {idx + 1} / {slides.length}
        </div>

        {/* Headline + summary overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Link href={`/news/${item.id}`} className="no-underline block">
            <h2 className="text-4xl font-extrabold leading-[1.15] text-white drop-shadow-lg line-clamp-3 tracking-tight text-balance hover:text-brand-accent transition-colors">
              {item.title}
            </h2>
            <p className="mt-3 text-lg font-medium leading-relaxed text-white/75 line-clamp-2 max-w-[640px] drop-shadow">
              {item.summary}
            </p>
          </Link>
          <div className="mt-3 flex items-center gap-3 text-sm text-white/60">
            <span className="font-semibold text-white/80">{item.source}</span>
            <span aria-hidden="true">&middot;</span>
            <time>{timeAgo(item.date)}</time>
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                aria-label={`Go to story ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${i === idx ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>

        {/* Nav arrows */}
        <button onClick={goPrev}
          aria-label="Previous story"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={goNext}
          aria-label="Next story"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </>
  );
}

function FeedList({ tab, items }: { tab: string; items: NewsItem[] }) {
  const all = items.slice(8);
  const filtered = tab === 'For You' ? all : all.filter(n => n.category === tab.toLowerCase());
  const list = filtered.length ? filtered : all;

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {list.map((item) => (
        <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <NewsThumbnail category={item.category} id={item.id} src={item.image} className="shrink-0 h-[70px] w-[100px] sm:h-[90px] sm:w-[140px] rounded-xl" />
          <div className="min-w-0 flex-1">
            <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
            <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</Heading>
            <Text className="mt-1 text-base leading-relaxed text-gray-500 line-clamp-2 hidden sm:block">{item.summary}</Text>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <span className="font-medium text-gray-500">{item.source}</span>
              <span>·</span>
              <span>{timeAgo(item.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Tabbed "For You" feed with client-side category filtering (client island). */
export function NewsFeedTabs({ items = newsItems }: { items?: NewsItem[] }) {
  const [activeTab, setActiveTab] = useState('For You');

  return (
    <>
      <div className="mt-8 mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">For You</Heading>
          </div>
        </div>
        <div className="flex gap-0 overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 text-base font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <FeedList tab={activeTab} items={items} />
    </>
  );
}

/** General news tabs — broader topic mix for the /news hub page. */
export function GeneralNewsTabs({ items = newsItems }: { items?: NewsItem[] }) {
  const [activeTab, setActiveTab] = useState('For You');

  // Map general tab labels to the underlying category slugs used in newsItems
  const categoryMap: Record<string, string[]> = {
    'Finance': ['forex', 'economy', 'policy', 'Mining', 'commodities'],
    'Technology': ['technology'],
    'Economy': ['economy'],
    'World': ['world', 'trade'],
  };

  function GeneralFeedList({ tab }: { tab: string }) {
    const all = items;
    const slugs = categoryMap[tab];
    const filtered = slugs
      ? all.filter(n => slugs.includes(n.category.toLowerCase()))
      : all;
    const list = (filtered.length ? filtered : all).slice(0, 8);

    return (
      <div className="flex flex-col divide-y divide-gray-100">
        {list.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group flex gap-4 py-4 first:pt-0 no-underline">
            <NewsThumbnail category={item.category} id={item.id} src={item.image} className="shrink-0 h-[70px] w-[100px] sm:h-[90px] sm:w-[140px] rounded-xl" />
            <div className="min-w-0 flex-1">
              <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(item.category)}`}>{item.category}</span>
              <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</Heading>
              <Text className="mt-1 text-base leading-relaxed text-gray-500 line-clamp-2 hidden sm:block">{item.summary}</Text>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                <span className="font-medium text-gray-500">{item.source}</span>
                <span>&middot;</span>
                <span>{timeAgo(item.date)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">Top Stories</Heading>
          </div>
        </div>
        <div className="flex gap-0 overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GENERAL_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 text-base font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <GeneralFeedList tab={activeTab} />
    </>
  );
}
