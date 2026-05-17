'use client';

import { useRef, useEffect } from 'react';

/**
 * Sidebar that scrolls with the page and freezes the moment its last
 * item reaches the viewport bottom — identical to Yahoo Sports' rail behavior.
 *
 * How it works:
 *   The inner div uses `position: sticky; top: <offset>` where offset =
 *   max(header-height,  viewport-height - sidebar-height).
 *   When the sidebar is taller than (viewport - header): offset = header-height,
 *   the sidebar is pinned top-aligned and scrolls through its content as
 *   the user scrolls.
 *   When the sidebar fits inside the viewport: offset = viewport - sidebar-height,
 *   the sidebar slides in from the bottom and freezes as soon as its last
 *   item is fully visible.
 *   A ResizeObserver keeps the offset correct on resize.
 */
export default function StickySidebar({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const headerH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '64'
      );
      const viewportH = window.innerHeight;
      const sidebarH  = el.scrollHeight;
      // Negative offset lets a tall sidebar scroll until its bottom hits the viewport.
      // Clamped at headerH so it never sticks above the sticky header.
      const offset = Math.min(headerH, viewportH - sidebarH);
      el.style.top = `${offset}px`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    // Outer aside stretches to the grid row height (align-self: stretch default)
    // so the inner sticky element has a tall containing block to work within.
    <div className="h-full">
      <div
        ref={innerRef}
        style={{ top: '64px' }} // initial fallback, overwritten by effect
        className={`sticky flex flex-col gap-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
