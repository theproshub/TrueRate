'use client';

import { getCatStyle } from '@/lib/category-colors';

export { getCatStyle };

/** Small/medium news thumbnail — replaces picsum stock photos */
export function NewsThumbnail({ category, className }: { category: string; className: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${s.bg} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
      />
      <span className={`relative z-10 select-none text-center text-[10px] font-black uppercase tracking-[0.15em] px-1.5 ${s.accent}`}>
        {s.label}
      </span>
    </div>
  );
}

/** Large hero visual (replaces big top-of-page stock photo) */
export function HeroVisual({ category, className = '' }: { category: string; className?: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`w-full relative overflow-hidden flex items-center justify-center ${s.bg} ${className}`}>
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      {/* Diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 32px)' }}
      />
      {/* Category watermark */}
      <span className={`relative z-10 select-none text-[clamp(48px,10vw,96px)] font-black uppercase tracking-widest opacity-[0.22] ${s.accent}`}>
        {s.label}
      </span>
      {/* Edge vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
}

/** Video thumbnail — category gradient with centred play button */
export function VideoThumbnail({ category, duration, className = 'w-full h-[220px]' }: { category: string; duration?: string; className?: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${s.bg} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-2xl">
        <svg className="h-4 w-4 translate-x-0.5 text-[#0a0a0d]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      {duration && (
        <span className="absolute bottom-3 left-3 tabular-nums text-[12px] font-bold text-white/80">{duration}</span>
      )}
    </div>
  );
}

/** Avatar placeholder — replaces author headshots */
export function AuthorAvatar({ name, className = 'h-10 w-10' }: { name: string; className?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['from-emerald-800', 'from-blue-800', 'from-purple-800', 'from-orange-800', 'from-teal-800'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`shrink-0 rounded-full bg-gradient-to-br ${color} to-[#111116] flex items-center justify-center ${className}`}>
      <span className="text-[11px] font-bold text-white/80">{initials}</span>
    </div>
  );
}
