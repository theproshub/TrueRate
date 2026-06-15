'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NewsThumbnail, HeroVisual } from '@/components/NewsThumbnail';
import { Heading, Text } from '@/components/ui';
import type { SportsCard, SportsTab } from '@/lib/sports-news-data';

/** Interactive hero carousel (client island) — sports-business slides. */
export function SportsHeroCarousel({ slides }: { slides: SportsCard[] }) {
  const [idx, setIdx] = useState(0);
  if (slides.length === 0) return null;
  const item = slides[idx];

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <HeroVisual category={item.imageCategory} src={item.image ?? undefined} className="w-full h-[380px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-2xs font-bold uppercase tracking-wide text-brand-accent">{item.category}</span>
      </div>
      <div className="absolute top-4 right-4 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
        {idx + 1} / {slides.length}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Link href={item.href} className="no-underline">
          <Heading level={2} className="leading-snug text-white hover:text-brand-accent transition-colors drop-shadow-lg line-clamp-3">{item.title}</Heading>
        </Link>
        <Text className="mt-1.5 text-base text-white/70 line-clamp-1">{item.source} · {item.time}</Text>
      </div>
      <button onClick={() => setIdx(i => (i - 1 + slides.length) % slides.length)}
        aria-label="Previous story"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
        <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={() => setIdx(i => (i + 1) % slides.length)}
        aria-label="Next story"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
        <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            aria-label={`Go to story ${i + 1}`}
            className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}

function FeedList({ items }: { items: SportsCard[] }) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {items.map((item, i) => (
        <Link key={`${item.href}-${i}`} href={item.href} className="group flex gap-4 py-4 first:pt-0 no-underline">
          <NewsThumbnail category={item.imageCategory} src={item.image ?? undefined} className="shrink-0 h-[90px] w-[140px] rounded-xl" />
          <div className="min-w-0 flex-1">
            <span className="text-2xs font-bold uppercase tracking-wide text-brand-accent-ink">{item.category}</span>
            <Heading level={6} as="h3" className="mt-0.5 text-sm font-bold leading-snug text-gray-900 group-hover:text-brand-accent-ink transition-colors line-clamp-2">{item.title}</Heading>
            {item.summary && <Text className="mt-1 text-base leading-relaxed text-gray-500 line-clamp-2">{item.summary}</Text>}
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <span className="font-medium text-gray-500">{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Tabbed feed with client-side category filtering (client island). */
export function SportsFeedTabs({ tabs, items }: { tabs: SportsTab[]; items: SportsCard[] }) {
  const [activeTab, setActiveTab] = useState<SportsTab>('For You');
  const filtered = activeTab === 'For You' ? items : items.filter(n => n.category === activeTab);
  const shown = filtered.length ? filtered : items;

  return (
    <>
      <div className="mt-8 mb-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-brand-accent rounded-full shrink-0" />
            <Heading level={6} as="h2" className="text-gray-900 uppercase tracking-[0.12em]">The Brief</Heading>
          </div>
        </div>
        <div className="flex gap-0 overflow-x-auto border-b border-gray-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2.5 text-base font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
      <FeedList items={shown} />
    </>
  );
}
