'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const MOBILE_NAV: { label: string; sub?: string[] }[] = [
  { label: 'Entertainment', sub: ['Movies', 'TV', 'Music', 'Celebrity', 'Gaming'] },
  { label: 'Sports',        sub: ['NFL', 'NBA', 'Soccer', 'Cricket', 'Tennis', 'Golf'] },
  { label: 'Business',      sub: ['Top Stories', 'Companies', 'Startups', 'Banking & Finance'] },
  { label: 'Finance',       sub: ['News', 'Markets', 'Research', 'Community', 'Videos', 'Watch Now'] },
  { label: 'Economy',       sub: ['GDP & Growth', 'Inflation', 'Trade & Exports', 'Development'] },
  { label: 'New on TrueRate' },
];

const SUB_HAS_ARROW = new Set(['News', 'Markets', 'Research', 'Videos']);

const MORE_SECTIONS: Record<string, string[]> = {
  'News':            ["Today's News", 'Politics', 'Economy', 'World', 'Climate', 'Health', 'Science', 'Originals', 'Newsletters'],
  'Entertainment':   ['Celebrity', 'TV', 'Movies', 'Music', 'How to Watch', 'Interviews', 'Videos'],
  'Finance':         ['News', 'Research', 'Community', 'Videos'],
  'Sports':          ['Liberia Football', 'African Cup', 'NBA Africa', 'Athletics', 'Cricket', 'Tennis', 'Golf', 'Show all'],
  'New on TrueRate': ['TrueRate Scout', 'Creators', 'Tech', 'Local'],
};


const MORE_LINK_MAP: Record<string, Record<string, string>> = {
  'News':            { "Today's News": '/news', 'Politics': '/news', 'Economy': '/economy', 'World': '/news', 'Climate': '/news', 'Health': '/news', 'Science': '/news', 'Originals': '/news', 'Newsletters': '/news' },
  'Entertainment':   { 'Celebrity': '/entertainment', 'TV': '/entertainment', 'Movies': '/entertainment', 'Music': '/entertainment', 'How to Watch': '/entertainment', 'Interviews': '/entertainment', 'Videos': '/videos' },
  'Finance':         { 'News': '/news', 'Research': '/research', 'Community': '/community', 'Videos': '/videos' },
  'Sports':          { 'Liberia Football': '/sports', 'African Cup': '/sports', 'NBA Africa': '/sports', 'Athletics': '/sports', 'Cricket': '/sports', 'Tennis': '/sports', 'Golf': '/sports', 'Show all': '/sports' },
  'New on TrueRate': { 'TrueRate Scout': '/', 'Creators': '/', 'Tech': '/news', 'Local': '/news' },
};

const MOBILE_LINK_MAP: Record<string, Record<string, string>> = {
  'Entertainment':   { 'Movies': '/entertainment', 'TV': '/entertainment', 'Music': '/entertainment', 'Celebrity': '/entertainment', 'Gaming': '/entertainment' },
  'Sports':          { 'NFL': '/sports', 'NBA': '/sports', 'Soccer': '/sports', 'Cricket': '/sports', 'Tennis': '/sports', 'Golf': '/sports' },
  'Business':        { 'Top Stories': '/news', 'Companies': '/news', 'Startups': '/research', 'Banking & Finance': '/economy' },
  'Finance':         { 'News': '/news', 'Research': '/research', 'Community': '/community', 'Videos': '/videos', 'Watch Now': '/videos' },
  'Economy':         { 'GDP & Growth': '/economy', 'Inflation': '/economy', 'Trade & Exports': '/economy', 'Development': '/economy' },
  'New on TrueRate': { 'TrueRate Scout': '/', 'Creators': '/', 'Tech': '/news', 'Local': '/news' },
};

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="sm:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex flex-col w-[82vw] max-w-[340px] bg-[#111113] h-full shadow-2xl">
        <div className="flex-1 overflow-y-auto">
          <nav className="pt-3">
            {MOBILE_NAV.map(item => (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(e => e === item.label ? null : item.label)}
                  className={`flex w-full items-center justify-between px-5 py-2.5 border-l-[3px] transition-colors ${expanded === item.label ? 'border-white' : 'border-transparent'}`}
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
                          <svg className="h-4 w-4 shrink-0 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <p className="text-[13px] text-gray-600">© 2026 <span className="font-bold text-gray-500">TrueRate</span> All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap mt-2">
              {['About our ads', 'Advertising', 'Careers'].map(link => (
                <Link key={link} href="/about" className="text-[13px] text-gray-600 hover:text-white transition-colors no-underline">{link}</Link>
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
        <Link href="/signin" className="rounded-lg border border-white/20 px-3 py-1.5 text-[12px] font-semibold text-white whitespace-nowrap no-underline">
          Sign in
        </Link>
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
    <header className="sticky top-0 z-50 bg-[#131316] border-b border-white/[0.06]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1320px] items-center px-4 py-2 relative gap-3">
        {/* Hamburger — mobile only */}
        <button className="sm:hidden flex shrink-0 flex-col justify-center gap-[5px] p-1 z-10" onClick={() => setMenuOpen(o => !o)} aria-label="Open menu">
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>

        {/* Logo */}
        <a href="/" className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 flex shrink-0 items-center gap-2 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TrueRate" className="shrink-0" style={{ height: '36px', width: 'auto' }} />
        </a>

        {/* Search */}
        <div className="hidden sm:flex flex-1 items-center rounded-xl bg-white/[0.06] border border-white/[0.06] transition focus-within:bg-white/[0.08] focus-within:border-white/20 overflow-hidden ml-4 mr-2">
          <input type="text" placeholder="Search for news, tickers or companies" className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-white outline-none placeholder:text-gray-500 min-w-0" />
          <button className="shrink-0 flex items-center justify-center h-9 w-11 bg-emerald-500 hover:bg-emerald-400 transition-colors m-0.5 rounded-lg">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Super nav + More dropdown */}
        <div className="hidden sm:flex items-center gap-0.5">
          {([
            { label: 'Finance',       href: '/',              active: !pathname.startsWith('/entertainment') && !pathname.startsWith('/sports') },
            { label: 'Entertainment', href: '/entertainment', active: pathname.startsWith('/entertainment') },
            { label: 'Sports',        href: '/sports',        active: pathname.startsWith('/sports') },
          ] as { label: string; href: string; active: boolean }[]).map(item => (
            <Link key={item.label} href={item.href} className={`px-3 py-1.5 rounded text-[13px] font-medium no-underline transition-colors whitespace-nowrap ${item.active ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}>
              {item.label}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded text-[13px] font-medium text-gray-400 hover:text-white transition-colors whitespace-nowrap">
              More
              <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="fixed left-0 right-0 top-[var(--header-h,56px)] z-50 bg-[#131316] border-t border-b border-white/[0.06] shadow-2xl shadow-black/60" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
                <div className="mx-auto max-w-[1320px] px-6 py-8">
                  <div className="grid grid-cols-5 gap-x-8">
                    {Object.entries(MORE_SECTIONS).map(([section, links]) => (
                      <div key={section}>
                        <h4 className="mb-4 text-[14px] font-bold text-white">{section}</h4>
                        <ul className="space-y-3">
                          {links.map(link => (
                            <li key={link}>
                              <Link href={MORE_LINK_MAP[section]?.[link] ?? '/'} onClick={() => setMoreOpen(false)} className="text-[14px] text-gray-400 hover:text-white transition-colors no-underline">
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

        {/* Right: bell + sign in + subscribe */}
        <div className="flex items-center gap-2 z-10 shrink-0 ml-auto sm:ml-0">
          <button className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <Link href="/signin" className="rounded-lg border border-white/20 px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-white/[0.06] no-underline">
            Sign in
          </Link>
          <Link href="/signin" className="hidden sm:block rounded-lg bg-white px-5 py-2 text-[13px] font-semibold text-[#0a0a0d] shadow-lg shadow-white/10 transition hover:shadow-white/15 hover:brightness-110 no-underline">
            Subscribe
          </Link>
        </div>
      </div>

      {/* Mobile search — collapses on scroll */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${scrolledDown ? 'max-h-0 opacity-0 py-0' : 'max-h-20 opacity-100 pb-3'}`}>
        <div className="px-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] px-4 py-2.5 border border-white/[0.06]">
            <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search for news or tickers" className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-600" />
          </div>
        </div>
      </div>

      {/* Bloomberg-style secondary nav */}
      <div className="hidden sm:block border-t border-white/[0.06] bg-[#0c0c0f]">
        <div className="mx-auto flex max-w-[1320px] items-center px-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Nav items */}
          {[
            { label: 'Economics',  href: '/economy' },
            { label: 'Industries', href: '/news' },
            { label: 'Tech',       href: '/news' },
            { label: 'Politics',   href: '/news' },
            { label: 'Opinion',    href: '/news' },
            { label: 'What to Watch', href: '/videos' },
          ].map(({ label, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-1 whitespace-nowrap px-4 py-3 text-[13px] font-semibold text-white/70 hover:text-white transition-colors no-underline">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
