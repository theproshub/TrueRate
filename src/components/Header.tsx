'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import HeaderAuthButtons from './HeaderAuthButtons';

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

const MOBILE_NAV: { label: string; sub?: string[] }[] = [
  { label: 'Culture',       sub: ['Box Office', 'Streaming Revenue', 'Music Industry', 'Film Finance', 'Deals & Acquisitions'] },
  { label: 'Sports',        sub: ['Liberia Football', 'Transfer Deals', 'Broadcast Rights', 'Club Finance', 'African Cup'] },
  { label: 'Business',      sub: ['Top Stories', 'Companies', 'Research', 'Banking & Finance'] },
  { label: 'Finance',       sub: ['Markets', 'Forex & Rates', 'Economy', 'Research', 'Watch Now'] },
  { label: 'Economy',       sub: ['GDP & Growth', 'Inflation', 'Trade & Exports', 'Development'] },
  { label: 'New on TrueRate' },
];

const SUB_HAS_ARROW = new Set(['News', 'Markets', 'Research', 'Videos']);

const MORE_SECTIONS: Record<string, string[]> = {
  'News':            ["Today's News", 'Liberia', 'West Africa', 'Economy', 'Politics', 'Development', 'Health', 'World'],
  'Culture':         ['Box Office', 'Streaming Revenue', 'Music Industry', 'Film Finance', 'Deals & Acquisitions'],
  'Finance':         ['Markets', 'Forex & Rates', 'Business Directory', 'Research', 'Economy', 'Watch Now'],
  'Sports':          ['Liberia Football', 'Transfer Deals', 'Broadcast Rights', 'Club Finance', 'Sponsorship', 'African Cup'],
  'New on TrueRate': ['Watchlist', 'Data & Research', 'Local Business', 'TrueRate Scout'],
};


const MORE_LINK_MAP: Record<string, Record<string, string>> = {
  'News':            { "Today's News": '/news', 'Liberia': '/news', 'West Africa': '/news', 'Economy': '/economy', 'Politics': '/news', 'Development': '/news', 'Health': '/news', 'World': '/news' },
  'Culture':         { 'Box Office': '/entertainment', 'Streaming Revenue': '/entertainment', 'Music Industry': '/entertainment', 'Film Finance': '/entertainment', 'Deals & Acquisitions': '/entertainment' },
  'Finance':         { 'Markets': '/forex', 'Forex & Rates': '/forex', 'Business Directory': '/directory', 'Research': '/research', 'Economy': '/economy', 'Watch Now': '/videos' },
  'Sports':          { 'Liberia Football': '/sports', 'Transfer Deals': '/sports', 'Broadcast Rights': '/sports', 'Club Finance': '/sports', 'Sponsorship': '/sports', 'African Cup': '/sports' },
  'New on TrueRate': { 'Watchlist': '/watchlist', 'Data & Research': '/research', 'Local Business': '/directory', 'TrueRate Scout': '/' },
};

const MOBILE_LINK_MAP: Record<string, Record<string, string>> = {
  'Culture':         { 'Box Office': '/entertainment', 'Streaming Revenue': '/entertainment', 'Music Industry': '/entertainment', 'Film Finance': '/entertainment', 'Deals & Acquisitions': '/entertainment' },
  'Sports':          { 'Liberia Football': '/sports', 'Transfer Deals': '/sports', 'Broadcast Rights': '/sports', 'Club Finance': '/sports', 'African Cup': '/sports' },
  'Business':        { 'Top Stories': '/news', 'Companies': '/directory', 'Research': '/research', 'Banking & Finance': '/economy' },
  'Finance':         { 'Markets': '/forex', 'Forex & Rates': '/forex', 'Economy': '/economy', 'Research': '/research', 'Watch Now': '/videos' },
  'Economy':         { 'GDP & Growth': '/economy', 'Inflation': '/economy', 'Trade & Exports': '/economy', 'Development': '/economy' },
  'New on TrueRate': { 'Watchlist': '/watchlist', 'Data & Research': '/research', 'Local Business': '/directory', 'TrueRate Scout': '/' },
};

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="sm:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex flex-col w-[82vw] max-w-[340px] bg-brand-header h-full shadow-2xl">
        <div className="flex-1 overflow-y-auto">
          <nav className="pt-3">
            {MOBILE_NAV.map(item => (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(e => e === item.label ? null : item.label)}
                  className={`flex w-full items-center justify-between px-5 py-2.5 border-l-[3px] transition-colors ${expanded === item.label ? 'border-emerald-400' : 'border-transparent'}`}
                >
                  <span className="text-[17px] font-bold text-white">{item.label}</span>
                  {item.sub && (
                    <svg className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${expanded === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {item.sub && expanded === item.label && (
                  <div className="pb-1">
                    {item.sub.map(sub => (
                      <Link key={sub} href={MOBILE_LINK_MAP[item.label]?.[sub] ?? '/'} onClick={onClose}
                        className="flex items-center justify-between px-6 py-3 text-[15px] text-gray-400 hover:text-white transition-colors no-underline">
                        <span>{sub}</span>
                        {SUB_HAS_ARROW.has(sub) && (
                          <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="px-5 pt-5 border-t border-white/[0.06] mt-3">
            {[{ label: 'Terms', href: '/about' }, { label: 'Privacy', href: '/about' }, { label: 'Feedback', href: '/feedback' }].map(({ label, href }) => (
              <Link key={label} href={href} className="block py-3 text-[15px] text-gray-400 hover:text-white transition-colors no-underline">{label}</Link>
            ))}
          </div>
          <div className="px-5 pt-4 pb-8">
            <p className="text-[13px] text-gray-400">© 2026 <span className="font-bold text-gray-500">TrueRate</span> All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap mt-2">
              {['About our ads', 'Advertising', 'Careers'].map(link => (
                <Link key={link} href="/about" className="text-[13px] text-gray-400 hover:text-white transition-colors no-underline">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center pt-3 pl-3 gap-2.5">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.12] text-white shrink-0">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <Link href="/sign-in" onClick={onClose} className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap no-underline">
          Sign in
        </Link>
        <Link href="/watchlist" onClick={onClose} className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap no-underline hidden">
            Watchlist
          </Link>
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

  const isLight = pathname.startsWith('/news') || pathname.startsWith('/sports');

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
    <header className={`sticky top-0 z-50 border-b transition-colors ${isLight ? 'bg-white border-gray-200' : 'bg-brand-header border-white/[0.06]'}`}>
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" fill="none" style={{ height: '44px', width: 'auto' }} aria-label="TrueRate">
            <rect x="0" y="8" width="6" height="24" rx="2" fill="#10b981"/>
            <rect x="10" y="0" width="6" height="32" rx="2" fill="#10b981"/>
            <rect x="20" y="14" width="6" height="18" rx="2" fill="#10b981"/>
            <text x="36" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill={isLight ? '#111827' : '#ffffff'} letterSpacing="-0.5">TrueRate</text>
          </svg>
        </a>

        {/* Search */}
        <div className={`hidden sm:flex flex-1 items-center rounded-xl border transition overflow-hidden ml-4 mr-2 ${isLight ? 'bg-gray-100 border-gray-200 focus-within:bg-white focus-within:border-gray-400' : 'bg-white/[0.06] border-white/[0.06] focus-within:bg-white/[0.08] focus-within:border-white/20'}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for news, tickers or companies"
            className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-gray-500'}`}
          />
          <button
            onClick={handleSearch}
            aria-label="Search"
            className="shrink-0 flex items-center justify-center h-9 w-11 bg-emerald-500 hover:bg-emerald-400 transition-colors m-0.5 rounded-lg"
          >
            <svg className="h-4 w-4 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Super nav + More dropdown */}
        <div className="hidden sm:flex items-center gap-0.5">
          {([
            { label: 'Finance',       href: '/',              active: !pathname.startsWith('/entertainment') && !pathname.startsWith('/sports') && !pathname.startsWith('/news') },
            { label: 'News',          href: '/news',          active: pathname.startsWith('/news') },
            { label: 'Sports',        href: '/sports',        active: pathname.startsWith('/sports') },
          ] as { label: string; href: string; active: boolean }[]).map(item => (
            <Link key={item.label} href={item.href} className={`px-3 py-1.5 rounded text-[13px] font-medium no-underline transition-colors whitespace-nowrap ${item.active ? 'text-emerald-500' : isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
              {item.label}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className={`flex items-center gap-1 px-3 py-1.5 rounded text-[13px] font-medium transition-colors whitespace-nowrap ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
              More
              <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className={`fixed left-0 right-0 top-[var(--header-h,56px)] z-50 border-t border-b shadow-2xl ${isLight ? 'bg-white border-gray-200 shadow-gray-200/80' : 'bg-brand-header border-white/[0.06] shadow-black/60'}`} onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                <div className="mx-auto max-w-[1320px] px-6 py-8">
                  <div className="grid grid-cols-5 gap-x-8">
                    {Object.entries(MORE_SECTIONS).map(([section, links]) => (
                      <div key={section}>
                        <h4 className={`mb-4 text-[14px] font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>{section}</h4>
                        <ul className="space-y-3">
                          {links.map(link => (
                            <li key={link}>
                              <Link href={MORE_LINK_MAP[section]?.[link] ?? '/'} onClick={() => setMoreOpen(false)} className={`text-[14px] transition-colors no-underline ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'}`}>
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
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
              placeholder="Search for news, tickers or companies"
              className={`flex-1 bg-transparent px-4 py-2.5 text-[14px] outline-none min-w-0 ${isLight ? 'text-gray-900 placeholder:text-gray-400' : 'text-white placeholder:text-gray-500'}`}
            />
            <button
              onClick={handleSearch}
              aria-label="Search"
              className="shrink-0 flex items-center justify-center h-9 w-11 bg-emerald-500 hover:bg-emerald-400 transition-colors m-0.5 rounded-lg"
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
          {/* Nav items */}
          {[
            { label: 'Economy',    href: '/economy' },
            { label: 'Companies',  href: '/directory' },
            { label: 'Forex',      href: '/forex' },
            { label: 'Culture',    href: '/entertainment' },
            { label: 'Watch Now',  href: '/videos' },
          ].map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link key={label} href={href}
                className={`flex items-center gap-1 whitespace-nowrap px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors no-underline ${
                  isActive
                    ? 'border-emerald-400 text-emerald-400'
                    : isLight ? 'border-transparent text-gray-500 hover:text-gray-900' : 'border-transparent text-white/70 hover:text-white'
                }`}>
                {label}
              </Link>
            );
          })}

          {/* Rate ticker — right-aligned */}
          <div className={`ml-auto pl-4 border-l py-2 ${isLight ? 'border-gray-200' : 'border-white/[0.06]'}`}>
            <RateTicker isLight={isLight} />
          </div>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
