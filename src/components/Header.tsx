'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import HeaderAuthButtons from './HeaderAuthButtons';
import SearchBox from './SearchBox';
import { Text } from '@/components/ui';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';


/** Compact pills shown next to the search bar — top super-nav */
const TOP_NAV: { label: string; href: string }[] = [
  { label: 'News',     href: '/news' },
  { label: 'Finance',  href: '/' },
  { label: 'Business', href: '/small-business' },
];

/** Bloomberg-style section tabs on the secondary row */
const SECTIONS_NAV: { label: string; href: string }[] = [
  { label: 'My Watchlist',     href: '/watchlist' },
  { label: 'News',             href: '/news/finance' },
  { label: 'Markets',          href: '/markets' },
  { label: 'Analytics',        href: '/analytics' },
  { label: 'Economy',          href: '/economy' },
  { label: 'Technology',       href: '/technology' },
  { label: 'Videos',           href: '/videos' },
  { label: 'Market Women Mode', href: '/market-women-mode' },
];

type NavChild = { label: string; href?: string; heading?: boolean };
type PrimaryNavItem = { label: string; href: string; children?: NavChild[] };

/** Full nav used by mobile menu — everything in one flat list, no hidden items */
const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    label: 'News', href: '/news',
    children: [
      { label: 'Finance News',    href: '/news/finance' },
      { label: 'Markets',         href: '/markets' },
      { label: 'Analytics',       href: '/analytics' },
      { label: 'Economy',         href: '/economy' },
      { label: 'Technology',      href: '/technology' },
      { label: 'Monetary Policy', href: '/economy/monetary-policy' },
      { label: 'Trade',           href: '/economy/trade' },
      { label: 'Fiscal',          href: '/economy/fiscal' },
    ],
  },
  {
    label: 'Finance', href: '/',
    children: [
      { label: 'Markets',          href: '/markets' },
      { label: 'Analytics',        href: '/analytics' },
      { label: 'Economy',          href: '/economy' },
      { label: 'Technology',       href: '/technology' },
      { label: 'Videos',           href: '/videos' },
    ],
  },
  {
    label: 'Business', href: '/small-business',
  },
  {
    label: 'Videos', href: '/videos',
    children: [
      { label: 'Interviews',       href: '/videos/interviews' },
      { label: 'Business',         href: '/videos/entrepreneurship' },
      { label: 'Investing',        href: '/videos/investing' },
      { label: 'Technology',       href: '/videos/technology' },
      { label: 'Leadership',       href: '/videos/leadership' },
    ],
  },
];

const MORE_NAV: { label: string; href: string; desc: string }[] = [
  { label: 'Market Women Mode', href: '/market-women-mode', desc: 'Today’s money numbers, made simple — tap to hear' },
  { label: 'My Watchlist',     href: '/watchlist',        desc: 'Track your tickers and stories' },
  { label: 'About TrueRate',   href: '/about',            desc: 'Our mission and editorial standards' },
];

/** Yahoo-style mega-menu — the "More" dropdown's contents on desktop, grouped by section. */
type MoreColumn = { title: string; items: { label: string; href: string }[] };

const MORE_MENU: MoreColumn[] = [
  {
    title: 'News',
    items: [
      { label: 'All News',        href: '/news' },
      { label: 'Finance News',    href: '/news/finance' },
      { label: 'Markets',         href: '/markets' },
      { label: 'Analytics',       href: '/analytics' },
      { label: 'Economy',         href: '/economy' },
      { label: 'Technology',      href: '/technology' },
      { label: 'Monetary Policy', href: '/economy/monetary-policy' },
      { label: 'Trade',           href: '/economy/trade' },
      { label: 'Fiscal',          href: '/economy/fiscal' },
    ],
  },
  {
    title: 'Videos',
    items: [
      { label: 'All Videos',       href: '/videos' },
      { label: 'Interviews',       href: '/videos/interviews' },
      { label: 'Entrepreneurship', href: '/videos/entrepreneurship' },
      { label: 'Investing',        href: '/videos/investing' },
      { label: 'Technology',       href: '/videos/technology' },
      { label: 'Leadership',       href: '/videos/leadership' },
    ],
  },
  {
    title: 'More on TrueRate',
    items: [
      { label: 'Market Women Mode', href: '/market-women-mode' },
      { label: 'Business',          href: '/small-business' },
      { label: 'My Watchlist',     href: '/watchlist' },
      { label: 'About TrueRate',   href: '/about' },
      { label: 'Help',             href: '/help' },
      { label: 'Feedback',         href: '/feedback' },
      { label: 'Privacy',          href: '/about/privacy' },
      { label: 'Terms',            href: '/about/terms' },
    ],
  },
];

/**
 * Mobile drawer accordion items — flat, Yahoo-style top level. Computed once at module load.
 * The explicit order below is mobile-only; desktop nav uses PRIMARY_NAV / MORE_NAV directly.
 */
const ACCORDION_ITEMS: PrimaryNavItem[] = (() => {
  const lookup = new Map<string, PrimaryNavItem>();
  for (const item of PRIMARY_NAV) lookup.set(item.label, item);
  for (const { label, href } of MORE_NAV) {
    if (!lookup.has(label)) lookup.set(label, { label, href });
  }
  // Surface Analytics with its terminal sections + instruments as a collapsible group.
  lookup.set('Analytics', {
    label: 'Analytics',
    href: '/analytics',
    children: [
      { label: 'Macro', heading: true },
      { label: 'GDP Growth',                href: '/analytics#sec-macro' },
      { label: 'Inflation (CPI)',           href: '/analytics#sec-macro' },
      { label: 'Unemployment',              href: '/analytics#sec-macro' },
      { label: 'Currency', heading: true },
      { label: 'USD/LRD',                   href: '/analytics#sec-currency' },
      { label: 'EUR/LRD',                   href: '/analytics#sec-currency' },
      { label: 'GBP/LRD',                   href: '/analytics#sec-currency' },
      { label: 'Commodities', heading: true },
      { label: 'Gold',                      href: '/analytics#sec-commodities' },
      { label: 'Brent crude',               href: '/analytics#sec-commodities' },
      { label: 'Iron ore (BHP ADR proxy)',  href: '/analytics#sec-commodities' },
    ],
  });
  const MOBILE_ORDER = ['Market Women Mode', 'News', 'Analytics', 'Business', 'Finance', 'Videos', 'My Watchlist'];
  return MOBILE_ORDER
    .map(label => lookup.get(label))
    .filter((item): item is PrimaryNavItem => Boolean(item));
})();

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/' || pathname.startsWith('/news/finance');
  if (href === '/news') return pathname === '/news' || (pathname.startsWith('/news/') && !pathname.startsWith('/news/finance'));
  return pathname === href || pathname.startsWith(href + '/');
}

function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Finance']));
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(true);

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
    <div ref={trapRef} id="mobile-menu" className="sm:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm motion-safe:animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />
      <div className="relative flex flex-col w-[86vw] max-w-[360px] bg-white h-full shadow-2xl motion-safe:animate-[slideInLeft_0.22s_cubic-bezier(0.32,0.72,0,1)]">

        {/* Close button — floated top-right, no dedicated row */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-2 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent z-10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Yahoo-style accordion nav */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="pt-12 pb-1">
            {ACCORDION_ITEMS.map(({ label, href, children }) => {
              const active = isActive(pathname, href);
              const hasChildren = Boolean(children && children.length > 0);
              const isOpen = expanded.has(label);

              // Market Women Mode is a low-literacy surface — carry its meaning
              // with the speaker icon + color, not the words, so a non-reading
              // user recognizes it at a glance. Rendered as a distinct card.
              if (href === '/market-women-mode') {
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={onClose}
                    className={`mx-3 mb-2 mt-1 flex items-center gap-3 rounded-2xl border-2 px-4 py-3 no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                      active
                        ? 'border-brand-accent-ink bg-brand-accent/20'
                        : 'border-brand-accent bg-brand-accent/10 hover:bg-brand-accent/20'
                    }`}
                  >
                    <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-accent-ink text-2xl">
                      🔊
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black leading-tight text-brand-accent-ink">{label}</span>
                      <span className="block text-sm font-medium text-gray-600">Tap to hear — money news made simple</span>
                    </span>
                    <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-accent-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              }

              return (
                <div key={label} className="relative">
                  {/* Active section indicator — left bar */}
                  {active ? (
                    <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-sm bg-brand-accent" />
                  ) : null}

                  <div className="flex items-center">
                    {/* Label — always navigates to the section page */}
                    <Link
                      href={href}
                      onClick={onClose}
                      className="flex-1 flex items-center min-h-[44px] px-5 py-2.5 no-underline transition-colors hover:bg-gray-50"
                    >
                      <span className={`text-md font-bold ${active ? 'text-brand-accent-ink' : 'text-gray-900'}`}>{label}</span>
                    </Link>

                    {/* Expand arrow — toggles submenu (only if children exist) */}
                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(label)}
                        aria-expanded={isOpen}
                        aria-controls={`mobile-section-${label.replace(/\s+/g, '-').toLowerCase()}`}
                        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${label} submenu`}
                        className="flex h-11 w-11 items-center justify-center shrink-0 mr-2 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        <svg
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Simple chevron for items without children */}
                    {!hasChildren && (
                      <Link href={href} onClick={onClose} aria-hidden="true" tabIndex={-1} className="flex h-11 w-11 items-center justify-center shrink-0 mr-2 no-underline">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  {/* Submenu */}
                  {hasChildren && isOpen && (
                    <div id={`mobile-section-${label.replace(/\s+/g, '-').toLowerCase()}`} className="pb-1.5">
                      {children!.map((c, ci) => {
                        if (c.heading) {
                          return (
                            <p key={`h-${ci}`} className="px-9 pt-3 pb-1 text-2xs font-bold uppercase tracking-[0.14em] text-gray-500">
                              {c.label}
                            </p>
                          );
                        }
                        const indented = children!.some(x => x.heading);
                        const subActive = pathname === c.href;
                        return (
                          <Link
                            key={`i-${ci}`}
                            href={c.href!}
                            onClick={onClose}
                            className={`flex items-center justify-between min-h-[44px] ${indented ? 'px-12' : 'px-9'} py-2 text-base no-underline transition-colors ${
                              subActive ? 'text-brand-accent' : 'text-gray-700 hover:text-gray-900'
                            }`}
                          >
                            <span>{c.label}</span>
                            <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Quiet legal/support footer block */}
          <div className="border-t border-gray-200 mt-2 pt-3 pb-5 px-5">
            {supportLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="flex items-center min-h-[44px] py-1.5 text-sm text-gray-500 hover:text-gray-900 no-underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer: socials */}
        <div className="border-t border-gray-200 px-5 pt-2.5 pb-3 shrink-0 bg-gray-50">
          <div className="flex items-center justify-center gap-2">
            {ACTIVE_SOCIAL_LINKS.map((s) => (
              <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-gray-900 hover:bg-white transition no-underline">
                <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <Text variant="caption" className="mt-1.5 text-center">© 2026 <span className="font-bold text-gray-700">TrueRate</span></Text>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  const isLight = true;

  // Set --header-h CSS variable so pages can size themselves accurately.
  // ResizeObserver fires only when the header's actual size changes (collapse,
  // resize) — unlike the old scroll listener it can't feedback-loop.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight);
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Collapse mobile search on scroll with hysteresis so it doesn't toggle
  // rapidly near the threshold (hide > 60px, show < 20px).
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolledDown(prev => (!prev && y > 60 ? true : prev && y < 20 ? false : prev));
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The /admin area has its own chrome (see app/admin/layout.tsx) — the public
  // marketing header doesn't belong there. Hooks above run unconditionally.
  if (pathname.startsWith('/admin')) return null;

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 border-b transition-colors ${isLight ? 'bg-white border-gray-200' : 'bg-brand-dark border-white/[0.06]'}`}>
      {/* Top bar */}
      <div className="mx-auto flex max-w-container items-center px-4 py-2 relative gap-3">
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
        <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center">
          <Link href="/" aria-label="TrueRate home" className="flex shrink-0 items-center no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-tight.png"
              alt=""
              aria-hidden="true"
              className="h-[27px] sm:h-[31px] md:h-[35px] w-auto shrink-0"
              fetchPriority="high"
              decoding="async"
              style={{ filter: isLight ? 'brightness(0)' : 'none' }}
            />
          </Link>
        </div>

        {/* Search — always visible on desktop */}
        <SearchBox isLight={isLight} inputId="site-search" className="hidden sm:flex flex-1 ml-4 mr-2" />

        {/* Top super-nav — compact pills next to the search bar */}
        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          {TOP_NAV.map(({ label, href }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                className={`px-3 py-1.5 rounded text-base font-medium no-underline transition-colors whitespace-nowrap ${
                  active
                    ? (isLight ? 'text-brand-accent-ink' : 'text-brand-accent')
                    : isLight ? 'text-gray-500 hover:text-brand-accent-ink' : 'text-gray-400 hover:text-brand-accent'
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
              aria-controls="more-menu"
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-base font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                moreOpen
                  ? (isLight ? 'text-brand-accent-ink' : 'text-brand-accent')
                  : isLight ? 'text-gray-600 hover:text-brand-accent-ink' : 'text-gray-300 hover:text-brand-accent'
              }`}
            >
              More
              <svg aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Plain nav of links, not role="menu" — menu semantics promise
                arrow-key navigation this dropdown doesn't implement. */}
            {moreOpen && (
              <nav
                id="more-menu"
                aria-label="More sections"
                className="absolute right-0 top-full z-50 mt-1 w-[min(960px,calc(100vw-2rem))] border rounded-b-lg overflow-hidden shadow-2xl bg-[#1E1E1E] border-white/[0.08] shadow-black/60"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 p-6">
                  {MORE_MENU.map(column => (
                    <div key={column.title}>
                      <p className="text-md font-bold mb-3 text-white">
                        {column.title}
                      </p>
                      <ul className="space-y-2">
                        {column.items.map(item => {
                          const active = isActive(pathname, item.href);
                          return (
                            <li key={`${column.title}:${item.label}`}>
                              <Link
                                href={item.href}
                                onClick={() => setMoreOpen(false)}
                                className={`block text-base no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded ${
                                  active
                                    ? 'text-brand-accent font-semibold'
                                    : 'text-gray-300 hover:text-brand-accent'
                                }`}
                              >
                                {item.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </nav>
            )}
          </div>
        </div>

        {/* Right: watchlist + auth */}
        <div className="flex items-center gap-2 z-10 shrink-0 ml-auto sm:ml-0">
          <HeaderAuthButtons />
        </div>
      </div>

      {/* Mobile search — collapses on scroll. `inert` (not aria-hidden) so the
          input inside also leaves the tab order while collapsed. */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-200 ease-in-out ${scrolledDown ? 'max-h-0 pb-0 opacity-0' : 'max-h-16 pb-3 opacity-100'}`}
        inert={scrolledDown}
      >
        <div className="px-3">
          <SearchBox isLight={isLight} inputId="site-search-mobile" variant="mobile" className="flex" />
        </div>
      </div>

      {/* Secondary nav */}
      <nav aria-label="Sections" className={`hidden sm:block border-t ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-brand-nav border-white/[0.08]'}`}>
        <div className="mx-auto flex max-w-container items-center px-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-1">

          {pathname.startsWith('/about') ? (
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
                    className={`flex items-center whitespace-nowrap px-3 py-2 my-1 rounded-md text-base font-semibold transition-colors no-underline ${
                      isActive
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              {(pathname.startsWith('/videos')
                ? [
                    { label: 'My Watchlist', href: '/watchlist' },
                    { label: 'News',       href: '/news/finance' },
                    { label: 'Markets',    href: '/markets' },
                    { label: 'Analytics',  href: '/analytics' },
                    { label: 'Economy',    href: '/economy' },
                    { label: 'Technology', href: '/technology' },
                    { label: 'Videos',     href: '/videos' },
                  ]
                : SECTIONS_NAV
              ).map(({ label, href }) => {
                const active = isActive(pathname, href);

                // Market Women Mode — icon-led, accent pill so it's recognizable
                // without reading, matching its low-literacy purpose.
                if (href === '/market-women-mode') {
                  return (
                    <Link key={label} href={href}
                      className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 my-1 rounded-full border-2 text-base font-bold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                        active
                          ? 'border-brand-accent-ink bg-brand-accent/20 text-brand-accent-ink'
                          : 'border-brand-accent bg-brand-accent/10 text-brand-accent-ink hover:bg-brand-accent/20'
                      }`}>
                      <span aria-hidden="true" className="text-lg leading-none">🔊</span>
                      {label}
                    </Link>
                  );
                }

                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-3 py-2 my-1 rounded-md text-base font-semibold transition-colors no-underline ${
                      active
                        ? (isLight ? 'bg-gray-200 text-brand-accent-ink' : 'bg-white/[0.1] text-brand-accent')
                        : isLight ? 'text-gray-500 hover:bg-gray-100 hover:text-brand-accent-ink' : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </>
          )}

        </div>
      </nav>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />}
    </header>
  );
}
