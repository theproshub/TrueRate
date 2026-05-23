import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Open Graph / Twitter card for the whole site.
// Single static image — social scrapers have no color scheme, so this is the
// dark-brand variant (white logo on brand-dark) regardless of viewer theme.
export const alt = 'TrueRate — Liberia’s Financial Intelligence Platform';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Logo 3 = white mark, reads cleanly on the dark brand background.
  const logo = await readFile(join(process.cwd(), 'public', 'Logo 3.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#050d11',
        }}
      >
        {/* Logo 3 is 3750×2409 (~1.557:1); 720×462 keeps the aspect ratio. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={720} height={462} alt="" />
      </div>
    ),
    { ...size },
  );
}
