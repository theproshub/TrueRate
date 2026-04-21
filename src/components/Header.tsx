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

const SEED_TICKER = [
  { pair: 'USD/LRD', rate: 192.50, change: 0.35 },
  { pair: 'EUR/LRD', rate: 209.85, change: -0.21 },
  { pair: 'GBP/LRD', rate: 245.30, change: 0.18 },
  { pair: 'GHS/LRD', rate: 13.20,  change: -0.08 },
];

function RateTicker({ isLight }: { isLight: boolean }) {
  const [tickers, setTickers] = useState(SEED_TICKER);

  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.json())
      .then(data => {
        if (!data.rates?.length) return;
        const mapped = data.rates.slice(0, 4).map((r: { pair: string; rate: number; change: number }) => ({
          pair: r.pair,
          rate: r.rate,
          change: r.change,
        }));
        if (mapped.length) setTickers(mapped);
      })
      .catch(() => {/* keep seed */});
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
      {tickers.map(t => (
        <Link key={t.pair} href="/forex" className="flex items-center gap-1.5 no-underline group shrink-0">
          <span className={`text-[11px] font-semibold transition-colors ${isLight ? 'text-gray-500 group-hover:text-gray-700' : 'text-gray-400 group-hover:text-gray-200'}`}>{t.pair}</span>
          <span className={`text-[11px] font-bold tabular-nums transition-colors ${isLight ? 'text-gray-900 group-hover:text-gray-700' : 'text-white group-hover:text-gray-100'}`}>
            {t.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-[10px] font-semibold tabular-nums ${t.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Compact pills shown next to the search bar — top super-nav */
const TOP_NAV: { label: string; href: string }[] = [
  { label: 'Home',   href: '/' },
  { label: 'News',   href: '/news' },
  { label: 'Sports', href: '/sports' },
];

/** Bloomberg-style section tabs on the secondary row */
const SECTIONS_NAV: { label: string; href: string }[] = [
  { label: 'Markets',    href: '/forex' },
  { label: 'Economy',    href: '/economy' },
  { label: 'Companies',  href: '/directory' },
  { label: 'Technology', href: '/technology' },
  { label: 'Videos',     href: '/videos' },
];

type PrimaryNavItem = { label: string; href: string; children?: { label: string; href: string }[] };

/** Full nav used by mobile menu — everything in one flat list, no hidden items */
const PRIMARY_NAV: PrimaryNavItem[] = [
  { label: 'Home',        href: '/' },
  { label: 'News',        href: '/news' },
  { label: 'Markets',     href: '/forex' },
  { label: 'Deals',       href: '/deals' },
  { label: 'Economy',     href: '/economy' },
  { label: 'Companies',   href: '/directory' },
  { label: 'Technology',  href: '/technology' },
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
  { label: 'Culture',          href: '/entertainment',    desc: 'Film, music, TV and lifestyle' },
  { label: 'Entrepreneurship', href: '/entrepreneurship', desc: 'Founders, funding and SMEs' },
  { label: 'Watchlist',        href: '/watchlist',        desc: 'Track your tickers and stories' },
  { label: 'About TrueRate',   href: '/about',            desc: 'Our mission and editorial standards' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function handleSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/news?q=${encodeURIComponent(q)}`);
    setQuery('');
    onClose();
  }

  const supportLinks = [
    { label: 'Help',             href: '/help' },
    { label: 'Feedback',         href: '/feedback' },
    { label: 'Data Disclaimer',  href: '/about/data-disclaimer' },
    { label: 'Terms of Service', href: '/about/terms' },
    { label: 'Privacy Policy',   href: '/about/privacy' },
    { label: 'About Our Ads',    href: '/about/ads' },
  ];

  return (
    <div className="sm:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]" onClick={onClose} />
      <div className="relative flex flex-col w-[86vw] max-w-[360px] bg-brand-dark h-full shadow-2xl animate-[slideInLeft_0.22s_cubic-bezier(0.32,0.72,0,1)]">

        {/* Header: logo + close */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0">
          <Link href="/" onClick={onClose} className="inline-block no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TrueRate" style={{ height: '44px', width: 'auto' }} />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center rounded-xl bg-white/[0.06] border border-white/[0.08] focus-within:bg-white/[0.1] focus-within:border-white/25 transition overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search stories, topics…"
              className="flex-1 bg-transparent px-3.5 py-2.5 text-[14px] text-white placeholder:text-gray-500 outline-none min-w-0"
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="shrink-0 flex items-center justify-center h-9 w-10 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg"
            >
              <svg className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          <nav className="pt-3 pb-1">
            <p className="px-5 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Browse</p>
            <div className="px-2">
              {PRIMARY_NAV.map(({ label, href, children }) => {
                const active = isActive(pathname, href);
                return (
                  <div key={label}>
                    <Link
                      href={href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors no-underline ${
                        active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className={`text-[15px] font-semibold ${active ? 'text-brand-accent' : 'text-white'}`}>{label}</span>
                      <svg className={`h-4 w-4 transition-colors ${active ? 'text-brand-accent' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {children && (
                      <div className="ml-4 mb-1 border-l border-white/[0.08] pl-3">
                        {children.map(c => {
                          const subActive = pathname === c.href;
                          return (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={onClose}
                              className={`block px-3 py-2 rounded-lg transition-colors no-underline text-[13px] ${
                                subActive ? 'text-brand-accent' : 'text-gray-400 hover:text-white'
                              }`}
                            >
                              {c.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/[0.06] mt-3 pt-1 pb-1">
            <p className="px-5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">More</p>
            <div className="px-2">
              {MORE_NAV.map(({ label, href, desc }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={onClose}
                    className={`block px-3 py-2.5 rounded-lg transition-colors no-underline ${
                      active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className={`text-[14px] font-semibold ${active ? 'text-brand-accent' : 'text-white'}`}>{label}</div>
                    <div className="text-[12px] text-gray-500 mt-0.5 leading-snug">{desc}</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/[0.06] mt-3 pt-1 pb-4">
            <p className="px-5 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Support</p>
            <div className="px-2">
              {supportLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  className="block px-3 py-2 rounded-lg hover:bg-white/[0.03] text-[13px] text-gray-300 hover:text-white transition-colors no-underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Sign-in CTA + socials */}
        <div className="border-t border-white/[0.06] px-5 pt-4 pb-5 shrink-0 bg-[#030a0e]">
          <Link
            href="/sign-in"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-lg bg-brand-accent px-4 py-3 text-[14px] font-bold text-brand-dark hover:brightness-90 transition no-underline"
          >
            Sign in
          </Link>
          <div className="mt-4 flex items-center justify-center gap-3">
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

  const isLight = pathname.startsWith('/news') || pathname.startsWith('/sports') || pathname.startsWith('/about') || pathname.startsWith('/help');

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
        <button className="sm:hidden flex shrink-0 flex-col justify-center gap-[4px] p-0.5 z-10" onClick={() => setMenuOpen(o => !o)} aria-label="Open menu">
          <span className={`block h-[2px] w-4 transition-transform origin-center ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-4 transition-opacity ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-4 transition-transform origin-center ${isLight ? 'bg-gray-900' : 'bg-white'} ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
        </button>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center gap-2 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="TrueRate"
            className="shrink-0"
            style={{ height: '64px', width: 'auto', filter: isLight ? 'brightness(0)' : 'none' }}
          />
        </a>

        {/* Search */}
        <div className={`hidden sm:flex flex-1 items-center rounded-xl border transition overflow-hidden ml-4 mr-2 ${isLight ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400' : 'bg-white/[0.06] border-white/[0.06] focus-within:bg-white/[0.08] focus-within:border-white/20'}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search stories, companies, or topics"
            className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-gray-500'}`}
          />
          <button
            onClick={handleSearch}
            aria-label="Search"
            className="shrink-0 flex items-center justify-center h-9 w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg"
          >
            <svg className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

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
          >
            <button
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] font-medium transition-colors whitespace-nowrap ${
                moreOpen
                  ? 'text-brand-accent'
                  : isLight ? 'text-gray-500 hover:text-brand-accent' : 'text-gray-400 hover:text-brand-accent'
              }`}
            >
              More
              <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div
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
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${scrolledDown ? 'max-h-0 opacity-0 py-0' : 'max-h-20 opacity-100 pb-3'}`}>
        <div className="px-4">
            <div className={`flex items-center rounded-xl border overflow-hidden transition ${isLight ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400' : 'bg-white/[0.06] border-white/[0.06] focus-within:bg-white/[0.08] focus-within:border-white/20'}`}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search stories, companies, or topics"
              className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-gray-500'}`}
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="shrink-0 flex items-center justify-center h-9 w-11 bg-brand-accent hover:brightness-90 transition-colors m-0.5 rounded-lg"
            >
              <svg className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bloomberg-style secondary nav */}
      <div className={`hidden sm:block border-t ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-brand-nav border-white/[0.06]'}`}>
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
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} pathname={pathname} />}
    </header>
  );
}
