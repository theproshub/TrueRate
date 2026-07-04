'use client';

import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { useRouter } from 'next/navigation';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import type { TickerItem } from '@/data/ticker-seed';
import { getCatColor } from '@/lib/category-colors';
import { NewsThumbnail } from '@/components/NewsThumbnail';

/**
 * Site search with live typeahead: as you type it shows matching stories
 * (with thumbnail + real category color) and matching markets/tickers.
 * - Arrow keys move the story highlight, Enter opens it (or runs a full
 *   search), Escape closes, click-outside closes.
 */
export default function SearchBox({
  isLight,
  inputId,
  className = '',
  variant = 'desktop',
}: {
  isLight: boolean;
  inputId: string;
  className?: string;
  /** 'mobile' renders the dropdown as a fixed panel so it escapes the
   *  header's overflow-hidden collapse container; 'desktop' anchors it
   *  absolutely under the input. */
  variant?: 'desktop' | 'mobile';
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);
  const listId = useId();

  // Live published articles for typeahead, fetched once from the slim index.
  // Falls back to the in-repo seed until the request resolves (or if it fails),
  // so search always works offline/empty-DB.
  const [index, setIndex] = useState<(Pick<NewsItem, 'id' | 'title' | 'summary' | 'category' | 'source'> & { image?: string })[]>(newsItems);
  const [tickers, setTickers] = useState<TickerItem[]>([]);

  useEffect(() => {
    let alive = true;

    fetch('/api/news')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.items?.length) setIndex(d.items); })
      .catch(() => {});

    Promise.all([
      fetch('/api/rates').then(r => r.json()).catch(() => null),
      fetch('/api/indicators').then(r => r.json()).catch(() => null),
      fetch('/api/commodities').then(r => r.json()).catch(() => null),
    ]).then(([ratesData, indicatorsData, commoditiesData]) => {
      if (!alive) return;
      const items: TickerItem[] = [];

      if (ratesData?.rates?.length) {
        const fxLabels: Record<string, string> = { USD: 'LRD/USD', EUR: 'LRD/EUR', GBP: 'LRD/GBP' };
        for (const r of ratesData.rates) {
          const label = fxLabels[r.from as string];
          if (!label) continue;
          items.push({
            label,
            value: (r.rate as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            pct: '',
            up: true,
          });
        }
      }

      if (indicatorsData?.indicators?.length) {
        const macroMap: Record<string, { label: string; fmt: (v: number) => string; pctLabel: string }> = {
          GDP_GROWTH: { label: 'GDP Growth', fmt: v => `${v.toFixed(1)}%`, pctLabel: 'YoY' },
          INFLATION:  { label: 'Inflation',  fmt: v => `${v.toFixed(1)}%`, pctLabel: 'YoY' },
          CBL_RATE:   { label: 'CBL Rate',   fmt: v => `${v}%`,            pctLabel: 'Steady' },
        };
        for (const ind of indicatorsData.indicators) {
          const meta = macroMap[ind.key as string];
          if (!meta) continue;
          const cp = ind.changePercent as number | null;
          items.push({
            label: meta.label,
            value: meta.fmt(ind.value as number),
            pct: meta.pctLabel,
            up: cp !== null ? cp >= 0 : true,
          });
        }
      }

      if (commoditiesData?.commodities?.length) {
        const gold = commoditiesData.commodities.find(
          (c: { name: string; price: number | null; changePercent: number | null }) => c.name === 'Gold',
        );
        if (gold?.price !== null && gold?.price !== undefined) {
          const cp: number | null = gold.changePercent;
          items.push({
            label: 'Gold',
            value: gold.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            pct: cp !== null ? `${cp >= 0 ? '+' : ''}${cp.toFixed(2)}%` : '',
            up: cp !== null ? cp >= 0 : true,
          });
        }
      }

      setTickers(items);
    });

    return () => { alive = false; };
  }, []);

  const stories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [query, index]);

  const markets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tickers.filter((m) => m.label.toLowerCase().includes(q)).slice(0, 4);
  }, [query, tickers]);

  const showList = open && query.trim().length > 0;

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    setQuery('');
    router.push(href);
  }

  function submit() {
    if (active >= 0 && stories[active]) {
      go(`/news/${stories[active].id}`);
      return;
    }
    const q = query.trim();
    if (q) go(`/news?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!showList || stories.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, stories.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    }
  }

  const groupLabel = `text-2xs font-bold uppercase tracking-widest px-3 pt-2.5 pb-1 ${
    isLight ? 'text-gray-500' : 'text-gray-500'
  }`;

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={`relative items-center rounded-xl border transition bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400 ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        Search stories, companies, or topics
      </label>
      <input
        id={inputId}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={variant === 'mobile' ? 'Search stories or topics' : 'Search stories, companies, or topics'}
        className="flex-1 bg-transparent px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-md outline-none min-w-0 text-gray-900 placeholder:text-gray-500"
        autoComplete="off"
      />
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <svg aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-accent-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {showList && (
        <div
          id={listId}
          role="listbox"
          aria-label="Search suggestions"
          // Mobile: fixed panel anchored under the header so it escapes the
          // header's overflow-hidden collapse container. Desktop: absolute.
          style={variant === 'mobile' ? { top: 'calc(var(--header-h, 56px) - 4px)' } : undefined}
          className={`z-50 max-h-[60vh] sm:max-h-[70vh] overflow-auto rounded-xl border py-1 shadow-2xl bg-white border-gray-200 shadow-gray-300/60 ${
            variant === 'mobile' ? 'fixed left-2 right-2 sm:left-4 sm:right-4' : 'absolute left-0 right-0 top-full mt-1.5'
          }`}
        >
          {stories.length === 0 && markets.length === 0 && (
            <p className={`px-4 py-3 text-sm ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
              No matches. Press Enter to search anyway.
            </p>
          )}

          {/* Stories */}
          {stories.length > 0 && (
            <>
              <p className={groupLabel}>Stories</p>
              {stories.map((s, i) => (
                <div key={s.id} id={`${listId}-opt-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/news/${s.id}`)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left no-underline transition-colors ${
                      i === active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <NewsThumbnail category={s.category} src={s.image} id={s.id} className="h-10 w-16 shrink-0 rounded-md" />
                    <span className="min-w-0 flex flex-col items-start gap-0.5">
                      <span className={`text-2xs font-bold uppercase tracking-wide ${getCatColor(s.category)}`}>{s.category}</span>
                      <span className={`text-sm leading-snug line-clamp-1 ${isLight ? 'text-gray-900' : 'text-gray-900'}`}>{s.title}</span>
                    </span>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Markets / tickers */}
          {markets.length > 0 && (
            <>
              <p className={`${groupLabel} ${stories.length > 0 ? 'border-t mt-1 ' : ''}${isLight ? 'border-gray-100' : 'border-gray-200'}`}>Markets</p>
              {markets.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => go('/markets')}
                  className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors ${
                    isLight ? 'hover:bg-gray-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-gray-900'}`}>{m.label}</span>
                  <span className="flex items-center gap-2 tabular-nums">
                    <span className={`text-sm ${isLight ? 'text-gray-700' : 'text-gray-600'}`}>{m.value}</span>
                    <span className={`text-2xs font-semibold ${m.up ? 'text-pos' : 'text-neg'}`}>{m.pct}</span>
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Full search */}
          <button
            type="button"
            onClick={submit}
            className={`flex w-full items-center gap-2 border-t mt-1 px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              isLight ? 'border-gray-100 text-brand-accent-ink hover:bg-gray-100' : 'border-gray-100 text-brand-accent-ink hover:bg-gray-100'
            }`}
          >
            Search for &ldquo;{query.trim()}&rdquo; →
          </button>
        </div>
      )}
    </form>
  );
}
