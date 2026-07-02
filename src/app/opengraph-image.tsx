import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Open Graph / Twitter card for the whole site (the imageless-page fallback).
// Uses the official brand delivery artwork as the card background.
export const alt = 'TrueRate — Liberia’s Financial Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const brand = await readFile(join(process.cwd(), 'public', 'TRUERATE BRAND DELIVERY - 2.png'));
  const brandSrc = `data:image/png;base64,${brand.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <img src={brandSrc} width={size.width} height={size.height} style={{ objectFit: 'cover' }} alt="" />
      </div>
    ),
    { ...size },
  );
}
