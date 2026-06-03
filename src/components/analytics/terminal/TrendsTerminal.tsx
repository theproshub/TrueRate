'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import StatSection from './StatSection';
import FocusPanel from './FocusPanel';
import { toStatView, type Timeframe } from './view-model';
import type { AnalyticsItem } from '@/lib/analytics/types';

export interface TerminalSection {
  id: string;
  title: string;
  items: AnalyticsItem[];
}

/**
 * Client orchestrator: holds the focused item + timeframe, derives every
 * display value from the REAL series via toStatView (recomputed per timeframe).
 *   desktop: sections (left) | sticky focus panel (right) — chart always in view
 *   mobile:  focus panel on top, then stacked sections below (auto-scrolls up)
 */
export default function TrendsTerminal({ sections }: { sections: TerminalSection[] }) {
  const itemById = useMemo(() => {
    const m = new Map<string, AnalyticsItem>();
    for (const s of sections) for (const i of s.items) m.set(i.id, i);
    return m;
  }, [sections]);

  const firstId = sections[0]?.items[0]?.id ?? '';
  const [activeId, setActiveId] = useState<string>(firstId);
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const focusRef = useRef<HTMLDivElement>(null);

  const activeItem = itemById.get(activeId) ?? sections[0]?.items[0];

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(min-width: 1024px)').matches) return; // sticky panel already visible
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    focusRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, []);

  if (!activeItem) return null;
  const focusView = toStatView(activeItem, timeframe);

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-[1fr_minmax(440px,1.05fr)]">
      {/* Sections */}
      <div className="order-2 space-y-10 lg:order-1">
        {sections.map((section) => (
          <StatSection
            key={section.id}
            title={section.title}
            views={section.items.map((i) => toStatView(i, timeframe))}
            activeId={activeId}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Focus panel — scroll-margin keeps it clear of the sticky site header. */}
      <div ref={focusRef} className="order-1 scroll-mt-24 lg:order-2">
        <div className="lg:sticky lg:top-[88px]">
          <FocusPanel view={focusView} timeframe={timeframe} onTimeframe={setTimeframe} />
        </div>
      </div>
    </div>
  );
}
