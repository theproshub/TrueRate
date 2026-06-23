'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

export default function MobileSidebar({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Floating toggle — mobile/tablet only, hidden at lg where sidebar is inline */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setOpen(true)}
        className={`lg:hidden fixed bottom-20 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E1E1E] text-white shadow-lg hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent motion-safe:transition-[transform,opacity] motion-safe:duration-200 ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h12M3 18h18" />
        </svg>
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Sidebar"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-[88vw] max-w-[380px] h-full bg-gray-50 shadow-2xl animate-[slideInRight_0.22s_cubic-bezier(0.32,0.72,0,1)] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shrink-0">
              <span className="text-sm font-bold text-gray-900 uppercase tracking-[0.1em]">Markets &amp; More</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close sidebar"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
