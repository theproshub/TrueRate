'use client';

// ── Category visual system ─────────────────────────────────────────────────────
// Replaces random stock photos (picsum) with intentional category treatments.
// Each category gets a unique dark gradient + dot-grid texture.

const CAT_STYLE: Record<string, { bg: string; accent: string; label: string }> = {
  policy:            { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Policy' },
  'Monetary Policy': { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Monetary Policy' },
  Policy:            { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Policy' },
  forex:             { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-brand-accent',  label: 'Forex' },
  economy:           { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300',     label: 'Economy' },
  Economy:           { bg: 'bg-gradient-to-br from-blue-950 to-[#04060f]',     accent: 'text-blue-300',     label: 'Economy' },
  commodities:       { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300',   label: 'Commodities' },
  Mining:            { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-300',   label: 'Mining' },
  Banking:           { bg: 'bg-gradient-to-br from-emerald-950 to-[#050f08]',  accent: 'text-brand-accent',  label: 'Banking' },
  Agriculture:       { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',     accent: 'text-lime-400',     label: 'Agriculture' },
  Energy:            { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',   accent: 'text-yellow-300',   label: 'Energy' },
  Trade:             { bg: 'bg-gradient-to-br from-purple-950 to-[#07000f]',   accent: 'text-purple-300',   label: 'Trade' },
  Tech:              { bg: 'bg-gradient-to-br from-sky-950 to-[#030a12]',      accent: 'text-sky-300',      label: 'Tech' },
  Analysis:          { bg: 'bg-gradient-to-br from-indigo-950 to-[#04000f]',   accent: 'text-indigo-300',   label: 'Analysis' },
  Development:       { bg: 'bg-gradient-to-br from-teal-950 to-[#030f0b]',     accent: 'text-teal-300',     label: 'Development' },
  Infrastructure:    { bg: 'bg-gradient-to-br from-slate-800 to-[#0d0d12]',    accent: 'text-slate-300',    label: 'Infrastructure' },
  Football:          { bg: 'bg-gradient-to-br from-green-950 to-[#020f02]',    accent: 'text-green-400',    label: 'Football' },
  Basketball:        { bg: 'bg-gradient-to-br from-orange-950 to-[#100700]',   accent: 'text-orange-400',   label: 'Basketball' },
  Athletics:         { bg: 'bg-gradient-to-br from-red-950 to-[#100202]',      accent: 'text-red-400',      label: 'Athletics' },
  Cricket:           { bg: 'bg-gradient-to-br from-lime-950 to-[#060e00]',     accent: 'text-lime-400',     label: 'Cricket' },
  Tennis:            { bg: 'bg-gradient-to-br from-yellow-950 to-[#0f0b00]',   accent: 'text-yellow-300',   label: 'Tennis' },
  Golf:              { bg: 'bg-gradient-to-br from-green-950 to-[#020f02]',    accent: 'text-green-300',    label: 'Golf' },
  Celebrity:         { bg: 'bg-gradient-to-br from-pink-950 to-[#0f0006]',     accent: 'text-pink-300',     label: 'Celebrity' },
  Music:             { bg: 'bg-gradient-to-br from-violet-950 to-[#07000f]',   accent: 'text-violet-300',   label: 'Music' },
  TV:                { bg: 'bg-gradient-to-br from-cyan-950 to-[#020c0f]',     accent: 'text-cyan-300',     label: 'TV' },
  Movies:            { bg: 'bg-gradient-to-br from-rose-950 to-[#0f0205]',     accent: 'text-rose-300',     label: 'Movies' },
};

export function getCatStyle(cat: string) {
  return CAT_STYLE[cat] ?? CAT_STYLE['economy'];
}

/** Small/medium news thumbnail — replaces picsum stock photos */
export function NewsThumbnail({ category, className }: { category: string; className: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative overflow-hidden ${s.bg} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
      />
    </div>
  );
}

/** Large hero visual (replaces big top-of-page stock photo) */
export function HeroVisual({ category, className = '' }: { category: string; className?: string }) {
  const s = getCatStyle(category);
  return (
    <div className={`w-full relative overflow-hidden flex items-end ${s.bg} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
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
