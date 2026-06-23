'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ArticleReadingBarProps {
  title: string;
  backHref: string;
  backLabel: string;
}

export default function ArticleReadingBar({ title, backHref, backLabel }: ArticleReadingBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = 340;
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed left-0 right-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm motion-safe:transition-[transform,opacity] motion-safe:duration-200 ${
        visible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ top: 'var(--header-h, 64px)' }}
    >
      <div className="mx-auto flex max-w-container items-center gap-3 px-4 py-2">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 shrink-0 min-h-[44px] min-w-[44px] px-2 -ml-2 rounded-md text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>

        <span className="flex-1 min-w-0 truncate text-sm font-medium text-gray-900">
          {title}
        </span>

        <Link
          href="/"
          className="flex items-center gap-1.5 shrink-0 min-h-[44px] min-w-[44px] px-2 -mr-2 rounded-md text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>
    </div>
  );
}
