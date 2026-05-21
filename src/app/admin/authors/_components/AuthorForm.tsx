import Link from 'next/link';

export interface AuthorDefaults {
  id?: string;
  name?: string;
  slug?: string;
  bio?: string | null;
  avatar_url?: string | null;
}

interface AuthorFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: AuthorDefaults;
  error?: string | null;
  notice?: string | null;
  submitLabel?: string;
  enableDelete?: boolean;
  deleteAction?: () => Promise<void>;
}

const INPUT_BASE =
  'mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-base text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

const LABEL = 'block text-sm font-semibold text-gray-300';
const HINT  = 'mt-1 text-xs text-gray-500';

export default function AuthorForm({
  action,
  defaults = {},
  error,
  notice,
  submitLabel = 'Save',
  enableDelete = false,
  deleteAction,
}: AuthorFormProps) {
  const d = defaults;

  return (
    <form action={action} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3 text-sm text-emerald-300"
        >
          {notice}
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6 space-y-5">
        <div>
          <label htmlFor="name" className={LABEL}>Display name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={d.name ?? ''}
            maxLength={120}
            placeholder="Sarah Pewee"
            className={INPUT_BASE}
          />
        </div>

        <div>
          <label htmlFor="slug" className={LABEL}>URL slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={d.slug ?? ''}
            maxLength={80}
            placeholder="sarah-pewee (auto from name if blank)"
            pattern="[a-z0-9-]*"
            className={INPUT_BASE}
          />
          <p className={HINT}>Lowercase letters, numbers, hyphens. Leave blank to auto-generate.</p>
        </div>

        <div>
          <label htmlFor="avatar_url" className={LABEL}>Avatar URL</label>
          <input
            id="avatar_url"
            name="avatar_url"
            type="url"
            defaultValue={d.avatar_url ?? ''}
            placeholder="https://… or /authors/sarah.jpg"
            className={INPUT_BASE}
          />
          <p className={HINT}>External URL or a path under <code className="text-gray-400">/public</code>.</p>
        </div>

        <div>
          <label htmlFor="bio" className={LABEL}>Bio</label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={d.bio ?? ''}
            rows={4}
            placeholder="One- or two-sentence description shown on bylines and author pages."
            className={INPUT_BASE}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-[#6001d2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#490099] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/authors"
          className="rounded-lg border border-white/[0.08] px-5 py-2.5 text-sm font-semibold text-gray-300 no-underline transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Cancel
        </Link>
        {enableDelete && deleteAction && (
          <form action={deleteAction} className="ml-auto">
            <button
              type="submit"
              className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Delete
            </button>
          </form>
        )}
      </div>
    </form>
  );
}
