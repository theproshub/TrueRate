import { createCategory } from '../_actions';
import CategoryForm from '../_components/CategoryForm';

interface PageProps {
  searchParams: Promise<{ error?: string; ok?: string }>;
}

export default async function NewCategoryPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <section aria-labelledby="new-category-heading">
      <header className="mb-6">
        <h1 id="new-category-heading" className="text-2xl font-bold tracking-tight text-gray-900">
          New category
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Categories group articles under a section (Economy, Markets, Business, etc.).
        </p>
      </header>
      <CategoryForm
        action={createCategory}
        defaults={{ display_order: 0 }}
        error={sp.error ?? null}
        notice={sp.ok ? 'Saved.' : null}
        submitLabel="Create category"
      />
    </section>
  );
}
