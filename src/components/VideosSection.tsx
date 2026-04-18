'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Video } from '@/data/todays-videos';

const CAT_BG: Record<string, string> = {
  policy:         'bg-gradient-to-br from-slate-800 to-[#0d0d12]',
  Mining:         'bg-gradient-to-br from-orange-950 to-[#100700]',
  commodities:    'bg-gradient-to-br from-orange-950 to-[#100700]',
  economy:        'bg-gradient-to-br from-blue-950 to-[#04060f]',
};

function VideoThumbnail({ category }: { category: string }) {
  const bg = CAT_BG[category] ?? CAT_BG.economy;
  return (
    <div className={`relative w-full h-[220px] overflow-hidden flex items-center justify-center ${bg}`}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-2xl">
        <svg className="h-5 w-5 translate-x-0.5 text-[#0a0a0d]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
}

export default function VideosSection({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState(0);
  const v = videos[active];
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 mb-4">
        <h2 className="text-[13px] font-bold text-white uppercase tracking-[0.12em]">Today&apos;s Videos</h2>
        <Link href="/videos" className="rounded-lg border border-white/20 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-white/[0.06] transition-colors no-underline">Explore More</Link>
      </div>
      <div className="border-t border-white/[0.06] pt-4">
        <div className="relative cursor-pointer group">
          <VideoThumbnail category={v.category} />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <span className="tabular-nums text-[14px] font-bold text-white/80 drop-shadow">{v.duration}</span>
          </div>
        </div>
        <div className="px-5 py-4">
          <h3 className="text-[15px] font-bold leading-snug text-white">{v.title}</h3>
        </div>
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show video ${i + 1} of ${videos.length}`}
                aria-current={i === active}
                className={`h-2 w-2 rounded-full transition-colors ${i === active ? 'bg-white' : 'bg-white/25'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActive(i => (i - 1 + videos.length) % videos.length)}
              aria-label="Previous video"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setActive(i => (i + 1) % videos.length)}
              aria-label="Next video"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
