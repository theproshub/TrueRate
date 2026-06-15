'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import HeaderAuthButtons from './HeaderAuthButtons';
import SearchBox from './SearchBox';
import SportsSearchBox from './sports/SportsSearchBox';
import { Text } from '@/components/ui';
import { ACTIVE_SOCIAL_LINKS } from '@/lib/social';


/** Compact pills shown next to the search bar — top super-nav */
const TOP_NAV: { label: string; href: string }[] = [
  { label: 'News',    href: '/news' },
  { label: 'Finance', href: '/' },
  { label: 'Sports',  href: '/sports' },
];

/** Bloomberg-style section tabs on the secondary row */
const SECTIONS_NAV: { label: string; href: string }[] = [
  { label: 'News',             href: '/news' },
  { label: 'Markets',          href: '/markets' },
  { label: 'Analytics',        href: '/analytics' },
  { label: 'Economy',          href: '/economy' },
  { label: 'Technology',       href: '/technology' },
  { label: 'Entrepreneurship', href: '/small-business' },
  { label: 'Videos',           href: '/videos' },
];

type NavChild = { label: string; href?: string; heading?: boolean };
type PrimaryNavItem = { label: string; href: string; children?: NavChild[] };

/** Full nav used by mobile menu — everything in one flat list, no hidden items */
const PRIMARY_NAV: PrimaryNavItem[] = [
  {
    label: 'News', href: '/news',
    children: [
      { label: 'All News',        href: '/news' },
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
    label: 'Entertainment', href: '/entertainment',
    children: [
      { label: 'All Entertainment', href: '/entertainment' },
      { label: 'Movies',            href: '/entertainment/movies' },
      { label: 'TV',                href: '/entertainment/tv' },
      { label: 'Music',             href: '/entertainment/music' },
      { label: 'Celebrity',         href: '/entertainment/celebrity' },
      { label: 'How To Watch',      href: '/entertainment/how-to-watch' },
    ],
  },
  {
    label: 'Sports', href: '/sports',
    children: [
      { label: 'All Sports',      href: '/sports' },
      { label: 'Football',        href: '/sports/football' },
      { label: 'Basketball',      href: '/sports/basketball' },
      { label: 'Athletics',       href: '/sports/athletics' },
      { label: 'Youth Sports',    href: '/sports/youth-sports' },
      { label: "Women's Sports",  href: '/sports/womens-sports' },
      { label: 'Transfers',       href: '/sports/transfers-deals' },
      { label: 'Sports Business', href: '/sports/sponsorship' },
      { label: 'Sports Finance',  href: '/sports/club-finance' },
      { label: 'Governance',      href: '/sports/governance' },
      { label: 'Technology',      href: '/sports/technology' },
      { label: 'Interviews',      href: '/sports/interviews' },
      { label: 'Data & Research', href: '/sports/data-research' },
      { label: 'Opinion',         href: '/sports/opinion' },
    ],
  },
  {
    label: 'Finance', href: '/',
    children: [
      { label: 'News',             href: '/news' },
      { label: 'Markets',          href: '/markets' },
      { label: 'Analytics',        href: '/analytics' },
      { label: 'Economy',          href: '/economy' },
      { label: 'Technology',       href: '/technology' },
      { label: 'Entrepreneurship', href: '/small-business' },
      { label: 'Videos',           href: '/videos' },
    ],
  },
  {
    label: 'Videos', href: '/videos',
    children: [
      { label: 'All Videos',       href: '/videos' },
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
  { label: 'Entrepreneurship', href: '/small-business',   desc: 'Liberian small business & founders' },
  { label: 'Watchlist',        href: '/watchlist',        desc: 'Track your tickers and stories' },
  { label: 'Saved Articles',   href: '/saved',            desc: 'Articles you saved to read later' },
  { label: 'About TrueRate',   href: '/about',            desc: 'Our mission and editorial standards' },
];

/** Yahoo-style mega-menu — the "More" dropdown's contents on desktop, grouped by section. */
type MoreColumn = { title: string; items: { label: string; href: string }[] };

const MORE_MENU: MoreColumn[] = [
  {
    title: 'News',
    items: [
      { label: 'All News',        href: '/news' },
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
    title: 'Sports',
    items: [
      { label: 'LPL',           href: '/sports' },
      { label: 'LWPL',          href: '/sports' },
      { label: 'LBA',           href: '/sports' },
      { label: 'National Team', href: '/sports' },
      { label: 'Athletics',     href: '/sports' },
      { label: 'Diaspora',      href: '/sports' },
      { label: 'Transfers',     href: '/sports/transfers-deals' },
      { label: 'Youth',         href: '/sports' },
      { label: 'Watch',         href: '/videos' },
    ],
  },
  {
    title: 'Entertainment',
    items: [
      { label: 'All Entertainment', href: '/entertainment' },
      { label: 'Movies',            href: '/entertainment/movies' },
      { label: 'TV',                href: '/entertainment/tv' },
      { label: 'Music',             href: '/entertainment/music' },
      { label: 'Celebrity',         href: '/entertainment/celebrity' },
      { label: 'How To Watch',      href: '/entertainment/how-to-watch' },
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
      { label: 'Entrepreneurship', href: '/small-business' },
      { label: 'Watchlist',        href: '/watchlist' },
      { label: 'Saved Articles',   href: '/saved' },
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
  const MOBILE_ORDER = ['News', 'Analytics', 'Entertainment', 'Finance', 'Sports', 'Watchlist'];
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

        {/* Close button — floated top-right, no dedicated row */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-2 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent z-10"
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
                      <span className="text-md font-bold text-white">{label}</span>
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
                      className="flex items-center justify-between min-h-[44px] px-5 py-2.5 no-underline transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-md font-bold text-white">{label}</span>
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
                      {children!.map((c, ci) => {
                        if (c.heading) {
                          return (
                            <p
                              key={`h-${ci}`}
                              className="px-9 pt-3 pb-1 text-2xs font-bold uppercase tracking-[0.14em] text-gray-500"
                            >
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
                className="flex items-center min-h-[44px] py-1.5 text-sm text-white/60 hover:text-white no-underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer: socials */}
        <div className="border-t border-white/[0.06] px-5 pt-2.5 pb-3 shrink-0 bg-brand-muted">
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
          <Text variant="caption" className="mt-1.5 text-center">© 2026 <span className="font-bold text-white/70">TrueRate</span></Text>
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

  const isSports = pathname.startsWith('/sports');
  const isLight = isSports || pathname.startsWith('/news') || pathname.startsWith('/about') || pathname.startsWith('/help') || pathname.startsWith('/entertainment');

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

        {/* Logo — the "truerate sports" lockup on /sports, the default mark elsewhere */}
        <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center">
          {isSports ? (
            <Link href="/sports" aria-label="TrueRate Sports — section home" className="flex shrink-0 items-center no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/trsports1.png"
                alt="TrueRate Sports"
                className="h-8 sm:h-9 md:h-10 w-auto shrink-0"
                fetchPriority="high"
                decoding="async"
              />
            </Link>
          ) : (
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
          )}
        </div>

        {/* Search. On /sports the section's "clubs, athletes, deals" search
            lives here in the header (moved out of the section masthead). */}
        {isSports ? (
          <SportsSearchBox inputId="sports-header-search" className="hidden sm:flex flex-1 ml-4 mr-2" />
        ) : (
          <SearchBox isLight={isLight} inputId="site-search" className="hidden sm:flex flex-1 ml-4 mr-2" />
        )}

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
              aria-haspopup="menu"
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
            {moreOpen && (
              <div
                id="more-menu"
                role="menu"
                className={`absolute right-0 top-full z-50 mt-1 w-[min(960px,calc(100vw-2rem))] border rounded-b-lg overflow-hidden shadow-2xl ${
                  isLight
                    ? 'bg-white border-gray-200 shadow-gray-300/60'
                    : 'bg-brand-dark border-white/[0.08] shadow-black/60'
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-6 p-6">
                  {MORE_MENU.map(column => (
                    <div key={column.title} role="none">
                      <h3
                        className={`text-md font-bold mb-3 ${
                          isLight ? 'text-gray-900' : 'text-white'
                        }`}
                      >
                        {column.title}
                      </h3>
                      <ul className="space-y-2" role="none">
                        {column.items.map(item => {
                          const active = isActive(pathname, item.href);
                          return (
                            <li key={`${column.title}:${item.label}`} role="none">
                              <Link
                                href={item.href}
                                role="menuitem"
                                onClick={() => setMoreOpen(false)}
                                className={`block text-base no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded ${
                                  active
                                    ? (isLight ? 'text-brand-accent-ink font-semibold' : 'text-brand-accent font-semibold')
                                    : isLight
                                      ? 'text-gray-700 hover:text-brand-accent-ink'
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
              </div>
            )}
          </div>
        </div>

        {/* Right: watchlist + auth */}
        <div className="flex items-center gap-2 z-10 shrink-0 ml-auto sm:ml-0">
          <HeaderAuthButtons />
        </div>
      </div>

      {/* Mobile search — collapses on scroll. On /sports it's the section's
          "clubs, athletes, deals" search (moved out of the section masthead). */}
      <div className={`sm:hidden overflow-hidden transition-all motion-safe:duration-300 ${scrolledDown ? 'max-h-0 opacity-0 py-0' : 'max-h-20 opacity-100 pb-3'}`} aria-hidden={scrolledDown}>
        <div className="px-4">
          {isSports ? (
            <SportsSearchBox inputId="sports-header-search-mobile" variant="mobile" className="flex w-full" />
          ) : (
            <SearchBox isLight={isLight} inputId="site-search-mobile" variant="mobile" className="flex" />
          )}
        </div>
      </div>

      {/* Bloomberg-style secondary nav — hidden on /sports/* (SportsChrome owns it there) */}
      {!pathname.startsWith('/sports') && (
      <nav aria-label="Sections" className={`hidden sm:block border-t ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-brand-nav border-white/[0.06]'}`}>
        <div className="mx-auto flex max-w-container items-center px-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-0">

          {pathname.startsWith('/about') ? (
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
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-base font-semibold border-b-2 transition-colors no-underline ${
                      isActive
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </>
          ) : pathname.startsWith('/videos') ? (
            /* Videos-specific tabs */
            <>
              {[
                { label: 'Markets',    href: '/markets' },
                { label: 'Economy',    href: '/economy' },
                { label: 'Technology', href: '/technology' },
                { label: 'Entrepreneurship',   href: '/small-business' },
                { label: 'Videos',     href: '/videos' },
              ].map(({ label, href }) => {
                const isActive = href === '/videos' ? pathname.startsWith('/videos') : pathname === href;
                return (
                  <Link key={label} href={href}
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-base font-semibold border-b-2 transition-colors no-underline ${
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
                    className={`flex items-center whitespace-nowrap px-4 py-3 text-base font-semibold border-b-2 transition-colors no-underline ${
                      active
                        ? (isLight ? 'border-brand-accent-ink text-brand-accent-ink' : 'border-brand-accent text-brand-accent')
                        : isLight ? 'border-transparent text-gray-500 hover:text-brand-accent-ink' : 'border-transparent text-white/70 hover:text-brand-accent'
                    }`}>
                    {label}
                  </Link>
                );
              })}

            </>
          )}

        </div>
      </nav>
      )}

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />}
    </header>
  );
}
