// One-off: download hero images for the 3 HUIX-2099 technology articles,
// process through the editorial image pipeline (sharp → WebP), upload to
// Supabase Storage, and update the article rows with the public URLs.
//
// Usage:
//   node --env-file=.env.local scripts/seed-tech-images.mjs

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'article-images';

const ARTICLES = [
  {
    slug: 'monrovia-hustle-liberia-open-world-game',
    imageUrl: 'https://huix2099.com/products/Monrovia_hustle_Demo_Campane/herosection.png',
    alt: 'Monrovia Hustle 3D hero artwork showing a downtown Monrovia street scene',
  },
  {
    slug: 'huix-2099-monrovia-studio-profile',
    imageUrl: 'https://huix2099.com/products/Monrovia_hustle_Demo_Campane/developer/Victor%20Edet%20Coleman.png',
    alt: 'Victor Edet Coleman, founder and CTO of HUIX-2099',
  },
  {
    slug: 'african-game-development-digital-economy',
    imageUrl: 'https://img.youtube.com/vi/tSBJfEjlklk/maxresdefault.jpg',
    alt: 'Monrovia Hustle 3D mobile field test showing gameplay on a smartphone',
  },
];

async function processImage(buffer) {
  return sharp(buffer)
    .rotate()
    .flatten({ background: '#ffffff' })
    .resize(3840, 2160, { fit: 'inside', withoutEnlargement: true })
    .sharpen({ sigma: 0.5 })
    .webp({ quality: 92, effort: 5, smartSubsample: true })
    .withMetadata({})
    .toBuffer();
}

async function main() {
  for (const { slug, imageUrl, alt } of ARTICLES) {
    process.stdout.write(`${slug}: downloading… `);

    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.log(`FAILED (HTTP ${res.status})`);
      continue;
    }
    const raw = Buffer.from(await res.arrayBuffer());
    process.stdout.write(`${(raw.length / 1024).toFixed(0)} KB → processing… `);

    const processed = await processImage(raw);
    process.stdout.write(`${(processed.length / 1024).toFixed(0)} KB WebP → uploading… `);

    const path = `heroes/${randomUUID()}.webp`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, processed, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });
    if (upErr) {
      console.log(`UPLOAD FAILED: ${upErr.message}`);
      continue;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    const { error: dbErr } = await supabase
      .from('articles')
      .update({ hero_image: publicUrl, hero_alt: alt })
      .eq('slug', slug);
    if (dbErr) {
      console.log(`DB UPDATE FAILED: ${dbErr.message}`);
      continue;
    }

    console.log(`✓ ${publicUrl}`);
  }

  console.log('\nDone.');
}

main().catch((e) => {
  console.error('\n✗ ' + e.message);
  process.exit(1);
});
