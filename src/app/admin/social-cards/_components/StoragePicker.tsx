'use client';

import { useState, useTransition } from 'react';
import { listStorageImages } from '../_actions';
import { FONT_MONO } from './templates/shared';

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

export default function StoragePicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [images, setImages] = useState<{ name: string; url: string }[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const load = () => startTransition(async () => {
    try {
      setError('');
      setImages(await listStorageImages());
    } catch {
      setError('Could not list site images — try again.');
    }
  });

  return (
    <div style={{ marginBottom: 10 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="tr-storage-grid"
        className={FOCUS_RING}
        onClick={() => { setOpen(!open); if (!open && images === null) load(); }}
        style={{
          width: '100%', minHeight: 44, padding: '8px 10px',
          background: 'transparent', color: 'rgba(243,244,244,0.7)',
          border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 11,
          fontFamily: FONT_MONO, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
          marginBottom: open ? 8 : 0,
        }}
      >
        {open ? 'Hide site images' : 'Browse site images'}
      </button>
      {open &&
      <div id="tr-storage-grid">
        {pending && <p style={{ fontSize: 11, color: 'rgba(243,244,244,0.55)', margin: '6px 0' }}>Loading…</p>}
        {error &&
        <p role="alert" style={{ fontSize: 11, color: '#e11b22', margin: '6px 0', lineHeight: 1.5 }}>
          {error}{' '}
          <button
            type="button"
            onClick={load}
            className={FOCUS_RING}
            style={{
              minHeight: 44, padding: '0 8px', background: 'transparent', color: '#BFEA36',
              border: 'none', cursor: 'pointer', fontFamily: FONT_MONO, fontSize: 11,
              textDecoration: 'underline',
            }}
          >
            Retry
          </button>
        </p>
        }
        {images?.length === 0 &&
        <p style={{ fontSize: 11, color: 'rgba(243,244,244,0.55)', margin: '6px 0' }}>
          No images in the bucket.
        </p>
        }
        {!!images?.length &&
        <ul
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
            listStyle: 'none', margin: 0, padding: 0,
          }}
        >
          {images.map((img) => (
            <li key={img.name}>
              <button
                type="button"
                aria-label={`Use image ${img.name}`}
                onClick={() => onSelect(img.url)}
                className={FOCUS_RING}
                style={{
                  width: '100%', minHeight: 44, padding: 0, cursor: 'pointer',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Storage bucket origin, decorative thumbnail */}
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  style={{ height: 64, width: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            </li>
          ))}
        </ul>
        }
      </div>
      }
    </div>
  );
}
