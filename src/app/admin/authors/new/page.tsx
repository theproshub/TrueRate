import { createAuthor } from '../_actions';
import AuthorForm from '../_components/AuthorForm';

interface PageProps {
  searchParams: Promise<{ error?: string; ok?: string }>;
}

export default async function NewAuthorPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <section aria-labelledby="new-author-heading">
      <header className="mb-6">
        <h1 id="new-author-heading" className="text-2xl font-bold tracking-tight text-gray-900">
          New author
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a contributor or editorial alias. Authors can be assigned to articles from the article form.
        </p>
      </header>
      <AuthorForm
        action={createAuthor}
        error={sp.error ?? null}
        notice={sp.ok ? 'Saved.' : null}
        submitLabel="Create author"
      />
    </section>
  );
}
