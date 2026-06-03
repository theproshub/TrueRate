import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { updateAuthor, deleteAuthor } from '../../_actions';
import AuthorForm, { type AuthorDefaults } from '../../_components/AuthorForm';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string }>;
}

const NOTICE_FOR_OK: Record<string, string> = {
  created: 'Author created.',
  saved:   'Saved.',
};

export default async function EditAuthorPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: author, error } = await supabase
    .from('authors')
    .select('id, slug, name, bio, avatar_url')
    .eq('id', id)
    .single();

  if (error || !author) notFound();

  const sp = await searchParams;

  const boundUpdate = updateAuthor.bind(null, id);
  const boundDelete = deleteAuthor.bind(null, id);

  return (
    <section aria-labelledby="edit-author-heading">
      <header className="mb-6">
        <h1 id="edit-author-heading" className="text-2xl font-bold tracking-tight text-white">
          Edit author
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Public slug: <code className="text-gray-300">{author.slug}</code>
        </p>
      </header>
      <AuthorForm
        action={boundUpdate}
        defaults={author as AuthorDefaults}
        error={sp.error ?? null}
        notice={sp.ok ? (NOTICE_FOR_OK[sp.ok] ?? null) : null}
        submitLabel="Save changes"
        enableDelete
        deleteAction={boundDelete}
      />
    </section>
  );
}
