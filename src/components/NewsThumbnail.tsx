import Image from 'next/image';
import { getCatStyle } from '@/lib/category-colors';
import { storyPhoto } from '@/lib/story-photos';

export { getCatStyle };

/** Whether a src can be optimised by next/image (remote http(s) or local /public). */
function isOptimisable(src: string): boolean {
  return src.startsWith('http') || src.startsWith('/');
}

function StoryImage({ src }: { src: string }) {
  if (isOptimisable(src)) {
    return (
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={85}
        className="object-cover object-top"
      />
    );
  }
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top" />;
}

/** Small/medium news thumbnail — real photo when the story has one, else a category gradient */
export function NewsThumbnail({ category, className, id, src }: { category: string; className: string; id?: string; src?: string | null }) {
  const s = getCatStyle(category);
  const photo = src ?? storyPhoto(id);
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${s.bg} ${className}`}>
      {photo ? (
        <StoryImage src={photo} />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
          />
          <span className={`relative z-10 select-none text-center text-2xs font-black uppercase tracking-[0.15em] px-1.5 ${s.accent}`}>
            {s.label}
          </span>
        </>
      )}
    </div>
  );
}

/** Large hero visual — real photo when the story has one, else a category gradient */
export function HeroVisual({ category, className = '', id, src }: { category: string; className?: string; id?: string; src?: string | null }) {
  const s = getCatStyle(category);
  const photo = src ?? storyPhoto(id);
  if (photo) {
    return (
      <div className={`w-full relative overflow-hidden ${s.bg} ${className}`}>
        <StoryImage src={photo} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      </div>
    );
  }
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

/** Video thumbnail — category gradient with optional centred play button */
export function VideoThumbnail({ category, duration, className = 'w-full h-[220px]', showPlay = false }: { category: string; duration?: string; className?: string; showPlay?: boolean }) {
  const s = getCatStyle(category);
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${s.bg} ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      {showPlay && (
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-2xl">
          <svg className="h-4 w-4 translate-x-0.5 text-brand-ink" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {!showPlay && (
        <span className={`relative z-10 select-none text-center text-2xs font-black uppercase tracking-[0.15em] px-1.5 ${s.accent}`}>
          {s.label}
        </span>
      )}
      {duration && (
        <span className="absolute bottom-2 right-2 tabular-nums text-2xs font-semibold text-white rounded bg-black/80 px-1.5 py-px backdrop-blur-sm">{duration}</span>
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
      <span className="text-xs font-bold text-white/80">{initials}</span>
    </div>
  );
}
