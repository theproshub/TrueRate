'use client';

import { useState, useRef, useEffect, useMemo, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  DASHBOARD_HERO,
  DASHBOARD_TOP_STORIES,
  DASHBOARD_MOST_READ,
  CLUB_VALUATIONS,
  ATHLETE_INTELLIGENCE,
  DASHBOARD_DEAL_FEED,
} from '@/lib/sports-finance-data';

/**
 * Sports section search with live typeahead — same interaction model as the
 * site-wide SearchBox (typeahead, arrow/Enter/Escape, click-outside, "search
 * anyway" footer), but scoped to SPORTS content only: headlines first, then
 * matching clubs, athletes, and deals. Light (editorial) styling to match the
 * /sports shell. Full search submits to /sports/search?q=…
 *
 * Suggestions are drawn from the section's mock data (behind the Sample-data
 * banner); the full-search results page already upgrades to live Supabase rows
 * when an editor publishes them.
 */

type Headline = { title: string; category: string; href: string };

// De-duped pool of sports headlines (hero + top stories + most-read).
const HEADLINES: Headline[] = (() => {
  const raw: Headline[] = [
    { title: DASHBOARD_HERO.title, category: 'Sponsorship', href: DASHBOARD_HERO.href },
    ...DASHBOARD_TOP_STORIES.map((s) => ({ title: s.title, category: s.category, href: s.href })),
    ...DASHBOARD_MOST_READ.map((s) => ({ title: s.title, category: s.category, href: s.href })),
  ];
  const seen = new Set<string>();
  return raw.filter((h) => (seen.has(h.title) ? false : (seen.add(h.title), true)));
})();

export default function SportsSearchBox({
  inputId,
  className = '',
  variant = 'desktop',
}: {
  inputId: string;
  className?: string;
  variant?: 'desktop' | 'mobile';
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);
  const listId = useId();

  const q = query.trim().toLowerCase();

  const headlines = useMemo(() => {
    if (!q) return [];
    return HEADLINES.filter((h) => h.title.toLowerCase().includes(q)).slice(0, 5);
  }, [q]);

  const clubs = useMemo(() => {
    if (!q) return [];
    return CLUB_VALUATIONS.filter((c) => c.club.toLowerCase().includes(q)).slice(0, 4);
  }, [q]);

  const athletes = useMemo(() => {
    if (!q) return [];
    return ATHLETE_INTELLIGENCE.filter(
      (a) => `${a.name} ${a.pos} ${a.club}`.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [q]);

  const deals = useMemo(() => {
    if (!q) return [];
    return DASHBOARD_DEAL_FEED.filter(
      (d) => `${d.party} ${d.detail} ${d.type}`.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [q]);

  const showList = open && q.length > 0;
  const hasResults = headlines.length + clubs.length + athletes.length + deals.length > 0;

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
    if (active >= 0 && headlines[active]) {
      go(headlines[active].href);
      return;
    }
    const term = query.trim();
    if (term) go(`/sports/search?q=${encodeURIComponent(term)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!showList || headlines.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, headlines.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    }
  }

  const groupLabel = 'text-2xs font-bold uppercase tracking-widest px-3 pt-2.5 pb-1 text-gray-400';

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={`relative flex items-center rounded-xl border border-gray-200 bg-gray-100 transition focus-within:bg-white focus-within:border-gray-400 ${className}`}
    >
      <label htmlFor={inputId} className="sr-only">
        Search clubs, athletes, deals
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
        placeholder="Search clubs, athletes, deals"
        className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-md text-gray-900 placeholder:text-gray-500 outline-none"
        autoComplete="off"
      />
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 flex items-center justify-center h-11 w-11 m-0.5 rounded-lg bg-brand-accent hover:brightness-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-2"
      >
        <svg aria-hidden="true" className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {showList && (
        <div
          id={listId}
          role="listbox"
          aria-label="Sports search suggestions"
          style={variant === 'mobile' ? { top: 'calc(var(--header-h, 56px) - 4px)' } : undefined}
          className={`z-50 max-h-[70vh] overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-2xl shadow-gray-300/60 ${
            variant === 'mobile' ? 'fixed left-4 right-4' : 'absolute left-0 right-0 top-full mt-1.5'
          }`}
        >
          {!hasResults && (
            <p className="px-4 py-3 text-sm text-gray-500">No sports matches. Press Enter to search anyway.</p>
          )}

          {/* Headlines (keyboard-navigable) */}
          {headlines.length > 0 && (
            <>
              <p className={groupLabel}>Headlines</p>
              {headlines.map((h, i) => (
                <div key={`${h.title}-${i}`} id={`${listId}-opt-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(h.href)}
                    className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors ${
                      i === active ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="text-2xs font-bold uppercase tracking-wide text-brand-accent-ink">{h.category}</span>
                    <span className="text-sm leading-snug text-gray-900 line-clamp-2">{h.title}</span>
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Clubs */}
          {clubs.length > 0 && (
            <>
              <p className={`${groupLabel} ${headlines.length > 0 ? 'mt-1 border-t border-gray-100' : ''}`}>Clubs</p>
              {clubs.map((c) => (
                <button
                  key={c.club}
                  type="button"
                  onClick={() => go('/sports/club-finance')}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-100"
                >
                  <span className="text-sm font-medium text-gray-900">{c.club}</span>
                  <span className="text-sm font-mono tabular-nums text-gray-500">{c.estValue}</span>
                </button>
              ))}
            </>
          )}

          {/* Athletes */}
          {athletes.length > 0 && (
            <>
              <p className={`${groupLabel} ${headlines.length + clubs.length > 0 ? 'mt-1 border-t border-gray-100' : ''}`}>Athletes</p>
              {athletes.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => go('/sports/transfers-deals')}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-100"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-900">{a.name}</span>
                    <span className="block text-2xs uppercase tracking-wide text-gray-400">{a.pos} · {a.club}</span>
                  </span>
                  <span className="shrink-0 text-sm font-mono tabular-nums text-gray-500">{a.marketValue}</span>
                </button>
              ))}
            </>
          )}

          {/* Deals */}
          {deals.length > 0 && (
            <>
              <p className={`${groupLabel} ${headlines.length + clubs.length + athletes.length > 0 ? 'mt-1 border-t border-gray-100' : ''}`}>Deals</p>
              {deals.map((d) => (
                <button
                  key={`${d.type}-${d.party}`}
                  type="button"
                  onClick={() => go(d.href)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-gray-100"
                >
                  <span className="min-w-0">
                    <span className="block text-2xs font-bold uppercase tracking-wide text-brand-accent-ink">{d.type}</span>
                    <span className="block text-sm text-gray-900 line-clamp-1">{d.party}</span>
                  </span>
                  <span className="shrink-0 text-sm font-mono tabular-nums text-gray-500">{d.fee}</span>
                </button>
              ))}
            </>
          )}

          {/* Full search */}
          <button
            type="button"
            onClick={submit}
            className="flex w-full items-center gap-2 border-t border-gray-100 mt-1 px-4 py-2.5 text-left text-sm font-medium text-brand-accent-ink transition-colors hover:bg-gray-100"
          >
            Search for &ldquo;{query.trim()}&rdquo; →
          </button>
        </div>
      )}
    </form>
  );
}
