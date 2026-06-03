import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateCategory, deleteCategory } from '../../_actions';
import CategoryForm, { type CategoryDefaults } from '../../_components/CategoryForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}

const NOTICE_FOR_OK: Record<string, string> = {
  created: 'Category created.',
  saved:   'Saved.',
};

export default async function EditCategoryPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category, error } = await supabase
    .from('categories')
    .select('id, slug, label, description, display_order')
    .eq('id', id)
    .single();

  if (error || !category) notFound();

  const sp = await searchParams;

  const boundUpdate = updateCategory.bind(null, id);
  const boundDelete = deleteCategory.bind(null, id);

  return (
    <section aria-labelledby="edit-category-heading">
      <header className="mb-6">
        <h1 id="edit-category-heading" className="text-2xl font-bold tracking-tight text-white">
          Edit category
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Slug: <code className="text-gray-300">{category.slug}</code>
        </p>
      </header>
      <CategoryForm
        action={boundUpdate}
        defaults={category as CategoryDefaults}
        error={sp.error ?? null}
        notice={sp.ok ? (NOTICE_FOR_OK[sp.ok] ?? null) : null}
        submitLabel="Save changes"
        enableDelete
        deleteAction={boundDelete}
      />
    </section>
  );
}
