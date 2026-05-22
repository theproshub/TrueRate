'use server';

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

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Upload a hero/inline image to the article-images bucket and return its
 * public URL. Called imperatively from the (client) ArticleForm — returns a
 * value rather than redirecting. Admin-gated; uses the service role so the
 * write succeeds regardless of the request's cookie session.
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

  const ext = EXT_BY_TYPE[file.type] ?? 'bin';
  const path = `heroes/${crypto.randomUUID()}.${ext}`;

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000', // 1 year — content-addressed by random name
    upsert: false,
  });
  if (error) {
    return { error: error.message };
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
