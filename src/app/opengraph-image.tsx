import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Open Graph / Twitter card for the whole site (the imageless-page fallback).
// Uses the same brand lockup as the favicon and the /analytics card: the
// lime icon-light mark + "TrueRate" wordmark, on the dark brand background.
export const alt = 'TrueRate — Liberia’s Financial Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // icon-light = the lime square mark; reads on dark and light alike, and
  // matches the favicon Google shows next to the URL.
  const mark = await readFile(join(process.cwd(), 'public', 'icon-light.png'));
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          backgroundColor: '#1d1f23',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Shared lockup: mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={markSrc} width={132} height={132} style={{ borderRadius: 28 }} alt="" />
          <div style={{ display: 'flex', fontSize: 112, fontWeight: 800, color: '#ffffff', letterSpacing: -2 }}>
            TrueRate
          </div>
        </div>
        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: 30, color: '#9ca3af', letterSpacing: 1 }}>
          Liberia’s Financial Intelligence Platform
        </div>
      </div>
    ),
    { ...size },
  );
}
