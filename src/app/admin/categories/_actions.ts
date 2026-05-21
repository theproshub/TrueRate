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

interface CategoryInput {
  slug: string;
  label: string;
  description: string | null;
  display_order: number;
}

function parseForm(form: FormData): CategoryInput | { error: string } {
  const label = nonEmpty(form.get('label'));
  if (!label) return { error: 'Label is required.' };

  const explicitSlug = nonEmpty(form.get('slug'));
  const slug = explicitSlug ? slugify(explicitSlug) : slugify(label);
  if (!slug) return { error: 'Could not derive a URL slug from the label.' };

  const orderRaw = nonEmpty(form.get('display_order'));
  const display_order = orderRaw === null ? 0 : Number.parseInt(orderRaw, 10);
  if (Number.isNaN(display_order)) {
    return { error: 'Display order must be a whole number.' };
  }

  return {
    slug,
    label,
    description: nonEmpty(form.get('description')),
    display_order,
  };
}

export async function createCategory(form: FormData) {
  await requireAdmin('/admin/categories/new');
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(`/admin/categories/new?error=${encodeURIComponent(parsed.error)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(parsed)
    .select('id')
    .single();

  if (error) {
    return redirect(`/admin/categories/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/articles');
  redirect(`/admin/categories/${data.id}/edit?ok=created`);
}

export async function updateCategory(id: string, form: FormData) {
  await requireAdmin(`/admin/categories/${id}/edit`);
  const parsed = parseForm(form);
  if ('error' in parsed) {
    return redirect(`/admin/categories/${id}/edit?error=${encodeURIComponent(parsed.error)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from('categories').update(parsed).eq('id', id);
  if (error) {
    return redirect(`/admin/categories/${id}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/categories');
  revalidatePath(`/admin/categories/${id}/edit`);
  redirect(`/admin/categories/${id}/edit?ok=saved`);
}

export async function deleteCategory(id: string) {
  await requireAdmin('/admin/categories');
  const supabase = await createClient();

  // Block deletion if any articles still reference this category.
  const { count, error: countErr } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);
  if (countErr) {
    return redirect(`/admin/categories/${id}/edit?error=${encodeURIComponent(countErr.message)}`);
  }
  if ((count ?? 0) > 0) {
    return redirect(
      `/admin/categories/${id}/edit?error=${encodeURIComponent(
        `Can't delete — ${count} article${count === 1 ? '' : 's'} still use this category. Move them to another category first.`,
      )}`,
    );
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    return redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/categories');
  redirect('/admin/categories?ok=deleted');
}
