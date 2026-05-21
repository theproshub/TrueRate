'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')         // strip diacritics
    .replace(/[^a-z0-9]+/g, '-')             // non-alphanum → hyphen
    .replace(/^-+|-+$/g, '')                 // trim hyphens
    .slice(0, 80);
}

function nonEmpty(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

type Status = 'draft' | 'published' | 'archived';

interface ArticleInput {
  title: string;
  slug: string;
  dek: string | null;
  body: string;
  hero_image: string | null;
  hero_alt: string | null;
  author_id: string | null;
  category_id: string | null;
  status: Status;
  published_at: string | null;
}

function parseForm(form: FormData): ArticleInput | { error: string } {
  const title = nonEmpty(form.get('title'));
  const body  = nonEmpty(form.get('body'));
  if (!title) return { error: 'Title is required.' };
  if (!body)  return { error: 'Body is required.' };

  const status = (nonEmpty(form.get('status')) ?? 'draft') as Status;
  if (!['draft', 'published', 'archived'].includes(status)) {
    return { error: `Invalid status: ${status}` };
  }

  const explicitSlug = nonEmpty(form.get('slug'));
  const slug = explicitSlug ? slugify(explicitSlug) : slugify(title);
  if (!slug) return { error: 'Could not derive a URL slug from the title.' };

  return {
    title,
    slug,
    dek:        nonEmpty(form.get('dek')),
    body,
    hero_image: nonEmpty(form.get('hero_image')),
    hero_alt:   nonEmpty(form.get('hero_alt')),
    author_id:  nonEmpty(form.get('author_id')),
    category_id:nonEmpty(form.get('category_id')),
    status,
    published_at:
      status === 'published'
        ? (nonEmpty(form.get('published_at')) ?? new Date().toISOString())
        : null,
  };
}

export async function createArticle(form: FormData) {
  await requireAdmin('/admin/articles/new');
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(
      `/admin/articles/new?error=${encodeURIComponent(parsed.error)}`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .insert(parsed)
    .select('id')
    .single();

  if (error) {
    return redirect(
      `/admin/articles/new?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath('/admin/articles');
  redirect(`/admin/articles/${data.id}/edit?ok=created`);
}

export async function updateArticle(id: string, form: FormData) {
  await requireAdmin(`/admin/articles/${id}/edit`);
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(
      `/admin/articles/${id}/edit?error=${encodeURIComponent(parsed.error)}`,
    );
  }

  const supabase = await createClient();

  // For an update, keep the existing published_at unless we're newly publishing.
  let publishedAt = parsed.published_at;
  if (parsed.status === 'published' && !publishedAt) {
    const { data: existing } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', id)
      .single();
    publishedAt = existing?.published_at ?? new Date().toISOString();
  }

  const { error } = await supabase
    .from('articles')
    .update({ ...parsed, published_at: publishedAt })
    .eq('id', id);

  if (error) {
    return redirect(
      `/admin/articles/${id}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath('/admin/articles');
  revalidatePath(`/admin/articles/${id}/edit`);
  redirect(`/admin/articles/${id}/edit?ok=saved`);
}

export async function deleteArticle(id: string) {
  await requireAdmin('/admin/articles');
  const supabase = await createClient();
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) {
    return redirect(
      `/admin/articles?error=${encodeURIComponent(error.message)}`,
    );
  }
  revalidatePath('/admin/articles');
  redirect('/admin/articles?ok=deleted');
}

// ─────────────────────────────────────────────────────────────────────
// Tag editors — replace-all semantics. The forms submit the full set of
// currently-checked IDs each time; we delete all old rows and insert the
// new set. Simpler than diffing and behaviorally identical for an admin UI.
// ─────────────────────────────────────────────────────────────────────

function uniqueIds(form: FormData, name: string): string[] {
  const seen = new Set<string>();
  for (const value of form.getAll(name)) {
    const id = String(value).trim();
    if (id.length > 0) seen.add(id);
  }
  return Array.from(seen);
}

export async function setArticleMacroTags(id: string, form: FormData) {
  await requireAdmin(`/admin/articles/${id}/edit`);
  const macroIds = uniqueIds(form, 'macro_id');

  const supabase = await createClient();

  const { error: deleteErr } = await supabase
    .from('article_macros')
    .delete()
    .eq('article_id', id);
  if (deleteErr) {
    return redirect(
      `/admin/articles/${id}/edit?error=${encodeURIComponent(deleteErr.message)}#tags`,
    );
  }

  if (macroIds.length > 0) {
    const rows = macroIds.map(series_id => ({ article_id: id, series_id }));
    const { error: insertErr } = await supabase
      .from('article_macros')
      .insert(rows);
    if (insertErr) {
      return redirect(
        `/admin/articles/${id}/edit?error=${encodeURIComponent(insertErr.message)}#tags`,
      );
    }
  }

  revalidatePath(`/admin/articles/${id}/edit`);
  redirect(`/admin/articles/${id}/edit?ok=tags_saved#tags`);
}

export async function setArticleSymbolTags(id: string, form: FormData) {
  await requireAdmin(`/admin/articles/${id}/edit`);
  const symbolIds = uniqueIds(form, 'symbol_id');

  const supabase = await createClient();

  const { error: deleteErr } = await supabase
    .from('article_symbols')
    .delete()
    .eq('article_id', id);
  if (deleteErr) {
    return redirect(
      `/admin/articles/${id}/edit?error=${encodeURIComponent(deleteErr.message)}#tags`,
    );
  }

  if (symbolIds.length > 0) {
    const rows = symbolIds.map(symbol_id => ({ article_id: id, symbol_id }));
    const { error: insertErr } = await supabase
      .from('article_symbols')
      .insert(rows);
    if (insertErr) {
      return redirect(
        `/admin/articles/${id}/edit?error=${encodeURIComponent(insertErr.message)}#tags`,
      );
    }
  }

  revalidatePath(`/admin/articles/${id}/edit`);
  redirect(`/admin/articles/${id}/edit?ok=tags_saved#tags`);
}
