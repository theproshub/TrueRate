'use client';

import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { useRouter } from 'next/navigation';
import { newsItems } from '@/data/news';
import type { NewsItem } from '@/lib/types';
import { SEED_INDICATORS } from '@/data/ticker-seed';
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
  const [index, setIndex] = useState<Pick<NewsItem, 'id' | 'title' | 'summary' | 'category' | 'source'>[]>(newsItems);
  useEffect(() => {
    let alive = true;
    fetch('/api/news')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.items?.length) setIndex(d.items); })
      .catch(() => {});
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
    return SEED_INDICATORS.filter((m) => m.label.toLowerCase().includes(q)).slice(0, 4);
  }, [query]);

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
      className={`relative items-center rounded-xl border transition ${
        isLight
          ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400'
          : 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400'
      } ${className}`}
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
        placeholder="Search stories, companies, or topics"
        className={`flex-1 bg-transparent px-4 py-2.5 text-md outline-none min-w-0 ${
          isLight ? 'text-gray-900 placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-500'
        }`}
        autoComplete="off"
      />
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 flex items-center justify-center h-11 w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <svg aria-hidden="true" className="h-4 w-4 text-brand-accent-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
          className={`z-50 max-h-[60vh] sm:max-h-[70vh] overflow-auto rounded-xl border py-1 shadow-2xl ${
            variant === 'mobile' ? 'fixed left-3 right-3 sm:left-4 sm:right-4' : 'absolute left-0 right-0 top-full mt-1.5'
          } ${
            isLight ? 'bg-white border-gray-200 shadow-gray-300/60' : 'bg-white border-gray-200 shadow-gray-300/60'
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
                    <NewsThumbnail category={s.category} id={s.id} className="h-10 w-16 shrink-0 rounded-md" />
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
