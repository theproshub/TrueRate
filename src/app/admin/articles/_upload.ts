'use server';

import sharp from 'sharp';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin';

const BUCKET = 'article-images';
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

/** Cap at 4K — never upscale; preserve the source resolution when smaller. */
const MAX_WIDTH = 3840;
const MAX_HEIGHT = 2160;

export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Editorial image pipeline — modelled on the CEMENCO reference (1536×1024 PNG):
 * 1. Auto-orient from EXIF
 * 2. Flatten alpha for PNGs/GIFs
 * 3. Downscale only if larger than 4K (never upscale — preserves native sharpness)
 * 4. Light sharpen to recover any resize softness
 * 5. High-quality WebP (q92) — visually lossless, ~50% smaller than PNG
 * 6. Strip EXIF/ICC for privacy
 */
async function processHeroImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .flatten({ background: '#ffffff' })
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .sharpen({ sigma: 0.5 })
    .webp({ quality: 92, effort: 5, smartSubsample: true })
    .withMetadata({})
    .toBuffer();
}

/**
 * Upload a hero image to Supabase Storage. Preserves source resolution
 * (capped at 4K), converts to high-quality WebP. Admin-gated.
 */
export async function uploadArticleImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { error: 'No file selected.' };
  }
  if (file.size > MAX_BYTES) {
    return { error: 'File is larger than 10 MB.' };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: `Unsupported type: ${file.type || 'unknown'}. Use JPEG, PNG, WebP, AVIF, or GIF.` };
  }

  let processed: Buffer;
  try {
    const raw = Buffer.from(await file.arrayBuffer());
    processed = await processHeroImage(raw);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[upload] image processing failed:', msg);
    return { error: `Image processing failed: ${msg}` };
  }

  const path = `heroes/${crypto.randomUUID()}.webp`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, processed, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    return { error: error.message };
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
