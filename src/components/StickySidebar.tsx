'use client';

import { useRef, useEffect } from 'react';

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
    <div className="h-full">
      <div
        ref={innerRef}
        style={{ top: '64px' }}
        className={`sticky flex flex-col gap-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
