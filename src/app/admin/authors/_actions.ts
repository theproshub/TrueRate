'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function nonEmpty(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

interface AuthorInput {
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
}

function parseForm(form: FormData): AuthorInput | { error: string } {
  const name = nonEmpty(form.get('name'));
  if (!name) return { error: 'Name is required.' };

  const explicitSlug = nonEmpty(form.get('slug'));
  const slug = explicitSlug ? slugify(explicitSlug) : slugify(name);
  if (!slug) return { error: 'Could not derive a URL slug from the name.' };

  return {
    name,
    slug,
    bio:        nonEmpty(form.get('bio')),
    avatar_url: nonEmpty(form.get('avatar_url')),
  };
}

export async function createAuthor(form: FormData) {
  await requireAdmin('/admin/authors/new');
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(`/admin/authors/new?error=${encodeURIComponent(parsed.error)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('authors')
    .insert(parsed)
    .select('id')
    .single();

  if (error) {
    return redirect(`/admin/authors/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/authors');
  revalidatePath('/admin/articles');
  redirect(`/admin/authors/${data.id}/edit?ok=created`);
}

export async function updateAuthor(id: string, form: FormData) {
  await requireAdmin(`/admin/authors/${id}/edit`);
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(`/admin/authors/${id}/edit?error=${encodeURIComponent(parsed.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from('authors').update(parsed).eq('id', id);
  if (error) {
    return redirect(`/admin/authors/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/authors');
  revalidatePath(`/admin/authors/${id}/edit`);
  redirect(`/admin/authors/${id}/edit?ok=saved`);
}

export async function deleteAuthor(id: string) {
  await requireAdmin('/admin/authors');
  const supabase = await createClient();

  // Block deletion if any articles still reference this author.
  const { count, error: countErr } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', id);
  if (countErr) {
    return redirect(`/admin/authors/${id}/edit?error=${encodeURIComponent(countErr.message)}`);
  }
  if ((count ?? 0) > 0) {
    return redirect(
      `/admin/authors/${id}/edit?error=${encodeURIComponent(
        `Can't delete — ${count} article${count === 1 ? '' : 's'} still credit this author. Reassign them first.`,
      )}`,
    );
  }

  const { error } = await supabase.from('authors').delete().eq('id', id);
  if (error) {
    return redirect(`/admin/authors?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/authors');
  redirect('/admin/authors?ok=deleted');
}
