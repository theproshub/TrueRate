'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Responsive desk nav for the sports section (Yahoo-Sports style): a curated row
 * of primary desks plus a "More" overflow menu — so the section never dumps all
 * 14 desks at once. It measures the available width (via a hidden sizing row) and
 * shows as many desks as fit, moving the rest into the dropdown. The active desk
 * is always reflected — either as the highlighted tab or, when it lives in the
 * overflow, by highlighting the More button. Client component for measurement,
 * active marking, and the disclosure menu. Touch targets stay ≥44px and focus is
 * always visible.
 *
 * Desks are ordered by priority: the most-used desks stay inline longest, niche
 * desks fall into More first. "Women's Sports" is pinned as a trailing tab so it
 * always stays visible (notably the last tab on mobile), never folding into More.
 */
type Desk = { label: string; href: string };

// Primary desks — the only ones eligible to show inline (as many as fit).
const PRIMARY: Desk[] = [
  { label: 'Football',   href: '/sports/football' },
  { label: 'Basketball', href: '/sports/basketball' },
  { label: 'Athletics',  href: '/sports/athletics' },
];

// Secondary desks — always live in the "More" menu, even on wide desktop.
const SECONDARY: Desk[] = [
  { label: 'Transfers',       href: '/sports/transfers-deals' },
  { label: 'Sports Business', href: '/sports/sponsorship' },
  { label: 'Sports Finance',  href: '/sports/club-finance' },
  { label: 'Youth Sports',    href: '/sports/youth-sports' },
  { label: 'Governance',      href: '/sports/governance' },
  { label: 'Technology',      href: '/sports/technology' },
  { label: 'Data & Research', href: '/sports/data-research' },
  { label: 'Interviews',      href: '/sports/interviews' },
  { label: 'Opinion',         href: '/sports/opinion' },
];

// Pinned trailing tab — always visible (the last tab on mobile), never in More.
const PINNED: Desk = { label: "Women's Sports", href: '/sports/womens-sports' };

// Sizing list = primaries + pinned, so we can reserve their widths when measuring.
const SIZING: Desk[] = [...PRIMARY, PINNED];

// Layout effect on the client, plain effect on the server (avoids the SSR warning).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Width reserved for the "More" control when the row overflows (px).
const MORE_RESERVE = 76;

const TAB =
  'inline-flex items-center min-h-[44px] whitespace-nowrap px-2.5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink focus-visible:ring-offset-1';

export default function DeskNav() {
  const pathname = usePathname();
  const rowRef = useRef<HTMLDivElement>(null);
  const sizerEls = useRef<(HTMLSpanElement | null)[]>([]);
  const moreRef = useRef<HTMLDivElement>(null);
  // Start mid-range so the first server paint is sensible; corrected before paint on the client.
  const [visible, setVisible] = useState(5);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = useCallback(
    (href: string) => (href === '/sports' ? pathname === '/sports' : pathname.startsWith(href)),
    [pathname],
  );

  // Decide how many pool desks fit, from the hidden sizing row's measured widths.
  // The pinned tab is always rendered, so its width is reserved up front.
  const recompute = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const widths = sizerEls.current.map((el) => (el ? el.getBoundingClientRect().width : 0));
    if (widths.length !== SIZING.length || widths.some((w) => w === 0)) return;
    const pinnedW = widths[widths.length - 1];
    const poolWidths = widths.slice(0, PRIMARY.length);
    const avail = row.clientWidth - pinnedW;
    let used = 0;
    let count = 0;
    for (const w of poolWidths) {
      if (used + w + MORE_RESERVE <= avail) {
        used += w;
        count += 1;
      } else break;
    }
    setVisible(Math.max(1, count));
  }, []);

  useIsoLayoutEffect(() => {
    recompute();
  });

  useEffect(() => {
    const onResize = () => recompute();
    window.addEventListener('resize', onResize);
    // Re-measure once web fonts settle (label widths can shift).
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(recompute).catch(() => {});
    }
    return () => window.removeEventListener('resize', onResize);
  }, [recompute]);

  // Close the menu on outside click / Escape, and whenever the route changes.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [moreOpen]);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Secondary desks always live in More; any primary that didn't fit joins them.
  const moreItems = [...PRIMARY.slice(visible), ...SECONDARY];
  const moreActive = moreItems.some((d) => isActive(d.href));

  return (
    <div className="-mx-4 px-4">
      <div ref={rowRef} className="flex items-stretch">
        {PRIMARY.slice(0, visible).map((d) => {
          const active = isActive(d.href);
          return (
            <Link
              key={d.href}
              href={d.href}
              aria-current={active ? 'page' : undefined}
              className={`${TAB} ${
                active
                  ? 'text-brand-accent-ink border-brand-accent-ink'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {d.label}
            </Link>
          );
        })}

        {/* Pinned trailing tab — always visible (last tab on mobile). */}
        {(() => {
          const active = isActive(PINNED.href);
          return (
            <Link
              href={PINNED.href}
              aria-current={active ? 'page' : undefined}
              className={`${TAB} ${
                active
                  ? 'text-brand-accent-ink border-brand-accent-ink'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {PINNED.label}
            </Link>
          );
        })()}

        {moreItems.length > 0 && (
          <div ref={moreRef} className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-controls="desk-more-menu"
              className={`${TAB} gap-1 ${
                moreActive || moreOpen
                  ? 'text-brand-accent-ink border-brand-accent-ink'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              More
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreOpen && (
              <div
                id="desk-more-menu"
                role="menu"
                aria-label="More sports desks"
                className="absolute right-0 top-full z-30 mt-1 w-56 max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl shadow-gray-400/30"
              >
                {moreItems.map((d) => {
                  const active = isActive(d.href);
                  return (
                    <Link
                      key={d.href}
                      href={d.href}
                      role="menuitem"
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setMoreOpen(false)}
                      className={`flex min-h-[44px] items-center px-4 py-2 text-sm no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent-ink ${
                        active
                          ? 'font-bold text-brand-accent-ink bg-brand-accent/10'
                          : 'font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {d.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden sizing row — full desk list, used only to measure tab widths for the overflow split. */}
      <div
        aria-hidden="true"
        className="invisible pointer-events-none absolute left-0 top-0 -z-50 flex h-0 overflow-hidden"
      >
        {SIZING.map((d, i) => (
          <span
            key={d.href}
            ref={(el) => {
              sizerEls.current[i] = el;
            }}
            className={TAB}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
