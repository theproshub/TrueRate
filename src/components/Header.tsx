'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import HeaderAuthButtons from './HeaderAuthButtons';

const NEWS_TICKER = [
  { category: 'Forex',           headline: 'LRD/USD holds at 192.50 — CBL intervenes to anchor exchange rate ahead of budget review' },
  { category: 'Markets',         headline: 'Iron ore drops 2.1% on weak Chinese demand data — ArcelorMittal Liberia watching closely' },
  { category: 'Policy',          headline: 'Finance Ministry sets Apr 14 for mid-year budget review as revenue shortfall widens' },
  { category: 'Trade',           headline: 'Freeport of Monrovia posts strongest weekly throughput since 2021 following Phase II completion' },
  { category: 'Mining',          headline: 'Bea Mountain confirms 1.4M oz high-grade deposit — Grand Cape Mount gold rush accelerates' },
  { category: 'Economy',         headline: 'CBL gross reserves reach $642M, covering 4.3 months of imports — highest since 2013' },
  { category: 'Energy',          headline: 'Private mini-grids add 48MW of solar capacity, powering 190,000 homes outside the national grid' },
  { category: 'Capital Markets', headline: 'LiberAgro raises $12M in West Africa first cross-border IPO on Ghana Stock Exchange' },
];

/**
 * Cross-section tickers — figures sourced from live page content
 * (sports / technology / entertainment), each linking back to the page that owns the number.
 */
const CROSS_SECTION_TICKERS: { label: string; value: string; delta: string; up: boolean; href: string }[] = [
  { label: 'Top Transfer', value: '$840K', delta: 'Pewee → Rivers', up: true,  href: '/sports/transfers-deals' },
  { label: 'Mobile Money', value: '$2.1B', delta: '+28% YoY',       up: true,  href: '/technology' },
  { label: 'Streaming',    value: '$2.3M', delta: '+64% YoY',       up: true,  href: '/entertainment' },
  { label: '4G Coverage',  value: '74%',   delta: '+8pp YoY',       up: true,  href: '/technology' },
];

function RateTicker({ isLight }: { isLight: boolean }) {
  return (
    <div className="hidden sm:flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
      {CROSS_SECTION_TICKERS.map(t => (
        <Link key={t.label} href={t.href} className="flex items-center gap-1.5 no-underline group shrink-0">
          <span className={`text-[11px] font-semibold transition-colors ${isLight ? 'text-gray-500 group-hover:text-gray-700' : 'text-gray-400 group-hover:text-gray-200'}`}>{t.label}</span>
          <span className={`text-[11px] font-bold tabular-nums transition-colors ${isLight ? 'text-gray-900 group-hover:text-gray-700' : 'text-white group-hover:text-gray-100'}`}>
            {t.value}
          </span>
          <span className={`text-[10px] font-semibold ${t.up ? 'text-emerald-400' : 'text-red-400'}`}>
            {t.delta}
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Compact pills shown next to the search bar — top super-nav */
const TOP_NAV: { label: string; href: string }[] = [
  { label: 'News',    href: '/news' },
  { label: 'Finance', href: '/' },
  { label: 'Sports',  href: '/sports' },
];

/** Bloomberg-style section tabs on the secondary row */
const SECTIONS_NAV: { label: string; href: string }[] = [
  { label: 'Markets',    href: '/markets' },
  { label: 'Economy',    href: '/economy' },
  { label: 'Technology', href: '/technology' },
  { label: 'Videos',     href: '/videos' },
];

type PrimaryNavItem = { label: string; href: string; children?: { label: string; href: string }[] };

/** Full nav used by mobile menu — everything in one flat list, no hidden items */
const PRIMARY_NAV: PrimaryNavItem[] = [
  { label: 'News',  href: '/news' },
  {
    label: 'Sports', href: '/sports',
    children: [
      { label: 'Transfers & Deals', href: '/sports/transfers-deals' },
      { label: 'Broadcast Rights',  href: '/sports/broadcast-rights' },
      { label: 'Club Finance',      href: '/sports/club-finance' },
      { label: 'Sponsorship',       href: '/sports/sponsorship' },
    ],
  },
  {
    label: 'Finance', href: '/',
    children: [
      { label: 'Markets',    href: '/markets' },
      { label: 'Economy',    href: '/economy' },
      { label: 'Technology', href: '/technology' },
    ],
  },
  {
    label: 'Videos', href: '/videos',
    children: [
      { label: 'Interviews',       href: '/videos/interviews' },
      { label: 'Entrepreneurship', href: '/videos/entrepreneurship' },
      { label: 'Investing',        href: '/videos/investing' },
      { label: 'Technology',       href: '/videos/technology' },
      { label: 'Leadership',       href: '/videos/leadership' },
    ],
  },
];

const MORE_NAV: { label: string; href: string; desc: string }[] = [
  { label: 'Entertainment',    href: '/entertainment',    desc: 'Film, music, TV and lifestyle' },
  { label: 'Entrepreneurship', href: '/entrepreneurship', desc: 'Founders, funding and SMEs' },
  { label: 'Watchlist',        href: '/watchlist',        desc: 'Track your tickers and stories' },
  { label: 'About TrueRate',   href: '/about',            desc: 'Our mission and editorial standards' },
];

/**
 * Mobile drawer accordion items — flat, Yahoo-style top level. Computed once at module load.
 * The explicit order below is mobile-only; desktop nav uses PRIMARY_NAV / MORE_NAV directly.
 * Entrepreneurship is intentionally hidden from the mobile drawer.
 */
const ACCORDION_ITEMS: PrimaryNavItem[] = (() => {
  const lookup = new Map<string, PrimaryNavItem>();
  for (const item of PRIMARY_NAV) lookup.set(item.label, item);
  for (const { label, href } of MORE_NAV) {
    if (!lookup.has(label)) lookup.set(label, { label, href });
  }
  const MOBILE_ORDER = ['News', 'Entertainment', 'Sports', 'Finance', 'Videos'];
  return MOBILE_ORDER
    .map(label => lookup.get(label))
    .filter((item): item is PrimaryNavItem => Boolean(item));
})();

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  // Only Finance auto-expands on the homepage ('/'). Every other accordion
  // (News, Sports, Videos, Entertainment, Watchlist, About TrueRate)
  // stays collapsed until the user taps to open it.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (pathname === '/') {
      const finance = ACCORDION_ITEMS.find(it => it.href === '/' && it.children && it.children.length > 0);
      if (finance) initial.add(finance.label);
    }
    return initial;
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function toggleExpanded(label: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const supportLinks = [
    { label: 'About TrueRate',   href: '/about' },
    { label: 'Help',             href: '/help' },
    { label: 'Feedback',         href: '/feedback' },
    { label: 'Data Disclaimer',  href: '/about/data-disclaimer' },
    { label: 'Terms of Service', href: '/about/terms' },
    { label: 'Privacy Policy',   href: '/about/privacy' },
    { label: 'About Our Ads',    href: '/about/ads' },
  ];

  return (
    <div id="mobile-menu" className="sm:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />
      <div className="relative flex flex-col w-[86vw] max-w-[360px] bg-brand-dark h-full shadow-2xl animate-[slideInLeft_0.22s_cubic-bezier(0.32,0.72,0,1)]">

        {/* Header: logo + close */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0">
          <Link href="/" onClick={onClose} className="inline-block no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TrueRate" style={{ height: '44px', width: 'auto' }} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Yahoo-style accordion nav */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="py-1">
            {ACCORDION_ITEMS.map(({ label, href, children }) => {
              const active = isActive(pathname, href);
              const hasChildren = Boolean(children && children.length > 0);
              const isOpen = expanded.has(label);

              return (
                <div key={label} className="relative">
                  {/* Active section indicator — green left bar (Yahoo-style) */}
                  {active ? (
                    <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-sm bg-brand-accent" />
                  ) : null}

                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(label)}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-section-${label.replace(/\s+/g, '-').toLowerCase()}`}
                      className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:bg-white/[0.06]"
                    >
                      <span className="text-[14px] font-bold text-white">{label}</span>
                      <svg
                        className={`h-4 w-4 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex items-center justify-between px-5 py-2.5 no-underline transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-[14px] font-bold text-white">{label}</span>
                      <svg
                        className="h-4 w-4 text-white/60"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}

                  {hasChildren && isOpen ? (
                    <div id={`mobile-section-${label.replace(/\s+/g, '-').toLowerCase()}`} className="pb-1.5">
                      <Link
                        href={href}
                        onClick={onClose}
                        className={`flex items-center px-9 py-2 text-[13px] no-underline transition-colors ${
                          active ? 'text-white' : 'text-white/85 hover:text-white'
                        }`}
                      >
                        {label}
                      </Link>
                      {children!.map(c => {
                        const subActive = pathname === c.href;
                        return (
                          <Link
                            key={c.href}
                            href={c.href}
                            onClick={onClose}
                            className={`flex items-center justify-between px-9 py-2 text-[13px] no-underline transition-colors ${
                              subActive ? 'text-brand-accent' : 'text-white/85 hover:text-white'
                            }`}
                          >
                            <span>{c.label}</span>
                            <svg className="h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          {/* Quiet legal/support footer block */}
          <div className="border-t border-white/[0.06] mt-2 pt-3 pb-5 px-5">
            {supportLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="block py-1.5 text-[12px] text-white/60 hover:text-white no-underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer: socials */}
        <div className="border-t border-white/[0.06] px-5 pt-4 pb-5 shrink-0 bg-[#030a0e]">
          <div className="flex items-center justify-center gap-3">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition no-underline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.857L1.479 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition no-underline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition no-underline">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <p className="mt-3 text-center text-[11px] text-gray-500">© 2026 <span className="font-bold text-white/70">TrueRate</span></p>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  const isLight = pathname.startsWith('/news') || pathname.startsWith('/sports') || pathname.startsWith('/about') || pathname.startsWith('/help') || pathname.startsWith('/entertainment');

  // Set --header-h CSS variable so pages can size themselves accurately
  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty('--header-h', `${headerRef.current.offsetHeight}px`);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  function handleSearch() {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/news?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 60) setScrolledDown(true);
      else if (y < lastScrollY.current) setScrolledDown(false);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 border-b transition-colors ${isLight ? 'bg-white border-gray-200' : 'bg-brand-dark border-white/[0.06]'}`}>
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1320px] items-center px-4 py-2 relative gap-3">
        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="sm:hidden flex shrink-0 flex-col justify-center items-center gap-[4px] h-11 w-11 -ml-2 z-10 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span aria-hidden className={`block h-[2px] w-4 transition-transform origin-center ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span aria-hidden className={`block h-[2px] w-4 transition-opacity ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
          <span aria-hidden className={`block h-[2px] w-4 transition-transform origin-center ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>

        {/* Logo */}
        <Link href="/" aria-label="TrueRate home" className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center gap-2 no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            aria-hidden="true"
            className="shrink-0"
            style={{ height: '64px', width: 'auto', filter: isLight ? 'brightness(0)' : 'none' }}
          />
        </Link>

        {/* Search */}
        <form
          role="search"
          onSubmit={e => { e.preventDefault(); handleSearch(); }}
          className={`hidden sm:flex flex-1 items-center rounded-xl border transition overflow-hidden ml-4 mr-2 ${isLight ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400' : 'bg-white/[0.06] border-white/[0.06] focus-within:bg-white/[0.08] focus-within:border-white/20'}`}
        >
          <label htmlFor="site-search" className="sr-only">Search stories, companies, or topics</label>
          <input
            id="site-search"
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search stories, companies, or topics"
            className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-500' : 'text-white placeholder:text-gray-400'}`}
          />
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 flex items-center justify-center h-9 w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg aria-hidden="true" className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Top super-nav — compact pills next to the search bar */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          {TOP_NAV.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className={`px-3 py-1.5 rounded text-[13px] font-medium no-underline transition-colors whitespace-nowrap ${
                  active
                    ? 'text-brand-accent'
                    : isLight ? 'text-gray-500 hover:text-brand-accent' : 'text-gray-400 hover:text-brand-accent'
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setMoreOpen(false); }}
            onKeyDown={e => { if (e.key === 'Escape') setMoreOpen(false); }}
          >
            <button
              type="button"
              onClick={() => setMoreOpen(o => !o)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              aria-controls="more-menu"
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                moreOpen
                  ? 'text-brand-accent'
                  : isLight ? 'text-gray-600 hover:text-brand-accent' : 'text-gray-300 hover:text-brand-accent'
              }`}
            >
              More
              <svg aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div
                id="more-menu"
                role="menu"
                className={`absolute right-0 top-full z-50 min-w-[280px] border shadow-2xl rounded-b-lg overflow-hidden ${
                  isLight ? 'bg-white border-gray-200 shadow-gray-200/80' : 'bg-brand-dark border-white/[0.08] shadow-black/60'
                }`}
              >
                <div className="py-2">
                  {MORE_NAV.map(({ label, href, desc }) => {
                    const active = isActive(pathname, href);
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2.5 no-underline transition-colors ${
                          active
                            ? isLight ? 'bg-gray-50' : 'bg-white/[0.04]'
                            : isLight ? 'hover:bg-gray-50' : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`text-[14px] font-semibold ${active ? 'text-brand-accent' : isLight ? 'text-gray-900' : 'text-white'}`}>{label}</div>
                        <div className={`text-[12px] mt-0.5 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: watchlist + auth */}
        <div className="flex items-center gap-2 z-10 shrink-0 ml-auto sm:ml-0">
          <HeaderAuthButtons />
        </div>
      </div>

      {/* Mobile search — collapses on scroll */}
      <div className={`sm:hidden overflow-hidden transition-all motion-safe:duration-300 ${scrolledDown ? 'max-h-0 opacity-0 py-0' : 'max-h-20 opacity-100 pb-3'}`} aria-hidden={scrolledDown}>
        <div className="px-4">
          <form
            role="search"
            onSubmit={e => { e.preventDefault(); handleSearch(); }}
            className={`flex items-center rounded-xl border overflow-hidden transition ${isLight ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400' : 'bg-white/[0.06] border-white/[0.06] focus-within:bg-white/[0.08] focus-within:border-white/20'}`}
          >
            <label htmlFor="site-search-mobile" className="sr-only">Search stories, companies, or topics</label>
            <input
              id="site-search-mobile"
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stories, companies, or topics"
              className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-500' : 'text-white placeholder:text-gray-400'}`}
            />
            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 flex items-center justify-center h-9 w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <svg aria-hidden="true" className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Bloomberg-style secondary nav */}
      <nav aria-label="Sections" className={`hidden sm:block border-t ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-brand-nav border-white/[0.06]'}`}>
        <div className="mx-auto flex max-w-[1320px] items-center px-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-0">

          {pathname.startsWith('/sports') ? (
            /* Sports-specific tabs */
            <>
              {[
                { label: 'All',               href: '/sports' },
                { label: 'Transfers & Deals', href: '/sports/transfers-deals' },
                { label: 'Broadcast Rights',  href: '/sports/broadcast-rights' },
                { label: 'Club Finance',      href: '/sports/club-finance' },
                { label: 'Sponsorship',       href: '/sports/sponsorship' },
              ].map(({ label, href }) => {
                const isActive = href === '/sports' ? pathname === '/sports' : pathname === href;
                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors no-underline ${
                      isActive
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </>
          ) : pathname.startsWith('/about') ? (
            /* About-specific links */
            <>
              {[
                { label: 'About',                 href: '/about' },
                { label: 'Data Disclaimer',       href: '/about/data-disclaimer' },
                { label: 'Terms',                 href: '/about/terms' },
                { label: 'Privacy',               href: '/about/privacy' },
                { label: 'About Our Ads',         href: '/about/ads' },
                { label: 'Help',                  href: '/help' },
                { label: 'Feedback',              href: '/feedback' },
              ].map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors no-underline ${
                      isActive
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}>
                    {label}
                  </Link>
                );
              })}
              <div className="ml-auto pl-4 border-l border-gray-200 py-2">
                <RateTicker isLight={true} />
              </div>
            </>
          ) : pathname.startsWith('/videos') ? (
            /* Videos-specific tabs */
            <>
              {[
                { label: 'Latest',           href: '/videos' },
                { label: 'Interviews',       href: '/videos/interviews' },
                { label: 'Entrepreneurship', href: '/videos/entrepreneurship' },
                { label: 'Investing',        href: '/videos/investing' },
                { label: 'Technology',       href: '/videos/technology' },
                { label: 'Leadership',       href: '/videos/leadership' },
              ].map(({ label, href }) => {
                const isActive = href === '/videos' ? pathname === '/videos' : pathname === href;
                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors no-underline ${
                      isActive
                        ? 'border-brand-accent text-brand-accent'
                        : 'border-transparent text-white/70 hover:text-brand-accent'
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </>
          ) : (
            /* Section tabs — Bloomberg-style secondary row */
            <>
              {SECTIONS_NAV.map(({ label, href }) => {
                const active = isActive(pathname, href);
                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors no-underline ${
                      active
                        ? 'border-brand-accent text-brand-accent'
                        : isLight ? 'border-transparent text-gray-500 hover:text-brand-accent' : 'border-transparent text-white/70 hover:text-brand-accent'
                    }`}>
                    {label}
                  </Link>
                );
              })}

              {/* Rate ticker — right-aligned */}
              <div className={`ml-auto pl-4 border-l py-2 ${isLight ? 'border-gray-200' : 'border-white/[0.06]'}`}>
                <RateTicker isLight={isLight} />
              </div>
            </>
          )}

        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />}
    </header>
  );
}
