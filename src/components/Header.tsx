'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV = [
  { label: 'My Portfolio', href: '/portfolio' },
  { label: 'News', href: '/news' },
  { label: 'Markets', href: '/markets' },
  { label: 'Research', href: '/research' },
  { label: 'Community', href: '/community' },
  { label: 'Personal Finance', href: '/personal-finance' },
  { label: 'Videos', href: '/videos' },
  { label: 'Watch Now', href: '/videos' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1b1b1b]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5">
        <button
          className="sm:hidden flex shrink-0 flex-col justify-center gap-[5px] p-1"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Open menu"
        >
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-5 bg-white transition-transform origin-center ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
        <Link href="/" className="flex shrink-0 items-center gap-2 no-underline">
          <span className="text-[22px] font-black tracking-tight text-white">TrueRate</span>
          <span className="rounded bg-[#6001d2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Liberia</span>
        </Link>
        <div className="hidden sm:flex flex-1 max-w-[500px] items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-transparent transition focus-within:bg-white/15 focus-within:ring-[#6001d2]/50">
          <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search for news, symbols or companies"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-1.5 text-[12px] text-gray-300 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_5px_#4ade80]" />
            WAT Markets open
          </div>
          <Link href="/signin" className="rounded-full border border-white/25 px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/10 no-underline">
            Sign in
          </Link>
          <Link href="/premium" className="hidden rounded-full bg-[#6001d2] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#490099] sm:block no-underline">
            Get Premium
          </Link>
        </div>
      </div>
      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-2.5">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-transparent transition focus-within:bg-white/15 focus-within:ring-[#6001d2]/50">
          <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search for news, symbols or companies"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500" />
        </div>
      </div>
      {/* Nav tabs */}
      <div className="hidden sm:block border-t border-white/10 bg-[#111]">
        <div className="mx-auto flex max-w-[1280px] overflow-x-auto px-4">
          {NAV.map(({ label, href }) => (
            <Link key={label} href={href}
              className={`whitespace-nowrap px-3.5 py-2.5 text-[13px] font-medium transition-colors no-underline ${
                isActive(href)
                  ? 'border-b-2 border-[#6001d2] text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}>
              {label}
            </Link>
          ))}
          <div className="ml-auto flex items-center py-1">
            <Link href="/portfolio" className="whitespace-nowrap rounded px-3 py-1.5 text-[12px] font-medium text-gray-400 hover:text-white no-underline">
              My Portfolio +
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sm:hidden absolute inset-x-0 top-full z-50 bg-[#111] border-t border-white/10 shadow-xl">
          {NAV.map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setMenuOpen(false)}
              className={`flex w-full items-center px-5 py-3.5 text-[14px] font-medium border-b border-white/5 transition-colors no-underline ${
                isActive(href)
                  ? 'text-white border-l-2 border-l-[#6001d2] bg-white/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              {label}
            </Link>
          ))}
          <div className="px-5 py-4">
            <Link href="/premium" className="block w-full rounded-full bg-[#6001d2] py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-[#490099] no-underline">
              Get Premium
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
