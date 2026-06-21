'use client';

import { useState } from 'react';
import { CHANNEL_URL } from '@/lib/youtube';

type Props = {
  /** YouTube video ID. If empty, the facade opens the channel instead of embedding. */
  id?: string;
  /** Accessible label (the video title). */
  label: string;
  className?: string;
  style?: React.CSSProperties;
  /** Start playing immediately on mount (muted per browser autoplay policy). */
  autoPlay?: boolean;
  /** The existing thumbnail + overlay markup shown before playback. */
  children: React.ReactNode;
};

/**
 * Lightweight YouTube embed "facade": renders the existing thumbnail/overlay
 * design, and on click swaps it in place for the real player iframe (no heavy
 * YouTube script loads until the user actually plays). Keeps the page fast.
 */
export default function PlayableVideo({ id, label, className = '', style, autoPlay, children }: Props) {
  const [playing, setPlaying] = useState(autoPlay && !!id);

  // No video linked yet → keep the facade but open the channel on click.
  if (!id) {
    return (
      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block ${className}`}
        style={style}
      >
        {children}
      </a>
    );
  }

  if (playing) {
    return (
      <div className={`relative ${className}`} style={style}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0${autoPlay ? '&mute=1' : ''}`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${label}`}
      className={`group relative block w-full text-left ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
