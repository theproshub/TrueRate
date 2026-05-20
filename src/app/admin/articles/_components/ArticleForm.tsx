import Link from 'next/link';

export interface AuthorOption {
  id: string;
  name: string;
}

export interface CategoryOption {
  id: string;
  label: string;
}

export interface ArticleDefaults {
  id?: string;
  title?: string;
  slug?: string;
  dek?: string | null;
  body?: string;
  hero_image?: string | null;
  hero_alt?: string | null;
  author_id?: string | null;
  category_id?: string | null;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string | null;
}

interface ArticleFormProps {
  /** Server action bound to either create or update */
  action: (formData: FormData) => Promise<void>;
  defaults?: ArticleDefaults;
  authors: AuthorOption[];
  categories: CategoryOption[];
  /** Error message from a previous submit (?error=…) */
  error?: string | null;
  /** Success message from a previous submit (?ok=…) */
  notice?: string | null;
  /** Submit button label */
  submitLabel?: string;
  /** When true, shows a delete button next to submit */
  enableDelete?: boolean;
  /** Triggered by the delete button when present (server action) */
  deleteAction?: () => Promise<void>;
}

const INPUT_BASE =
  'mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-base text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

const LABEL = 'block text-sm font-semibold text-gray-300';
const HINT  = 'mt-1 text-xs text-gray-500';

export default function ArticleForm({
  action,
  defaults = {},
  authors,
  categories,
  error,
  notice,
  submitLabel = 'Save',
  enableDelete = false,
  deleteAction,
}: ArticleFormProps) {
  const d = defaults;
  const status = d.status ?? 'draft';
  const publishedAtValue =
    d.published_at ? new Date(d.published_at).toISOString().slice(0, 16) : '';

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
          <label htmlFor="title" className={LABEL}>Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={d.title ?? ''}
            maxLength={200}
            placeholder="CBL Holds Rate at 16.25% with Cautious Tightening Bias"
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
            placeholder="cbl-holds-rate-april-2026 (auto from title if blank)"
            pattern="[a-z0-9-]*"
            className={INPUT_BASE}
          />
          <p className={HINT}>Lowercase letters, numbers, hyphens. Leave blank to auto-generate from the title.</p>
        </div>

        <div>
          <label htmlFor="dek" className={LABEL}>Standfirst / subtitle</label>
          <input
            id="dek"
            name="dek"
            type="text"
            defaultValue={d.dek ?? ''}
            maxLength={300}
            placeholder="One-sentence summary shown under the headline"
            className={INPUT_BASE}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category_id" className={LABEL}>Category</label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={d.category_id ?? ''}
              className={INPUT_BASE}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="author_id" className={LABEL}>Author</label>
            <select
              id="author_id"
              name="author_id"
              defaultValue={d.author_id ?? ''}
              className={INPUT_BASE}
            >
              <option value="">— None —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6 space-y-5">
        <div>
          <label htmlFor="hero_image" className={LABEL}>Hero image URL</label>
          <input
            id="hero_image"
            name="hero_image"
            type="url"
            defaultValue={d.hero_image ?? ''}
            placeholder="https://… or /governor.jpg"
            className={INPUT_BASE}
          />
          <p className={HINT}>External URL or a path under <code className="text-gray-400">/public</code>. Leave blank for none.</p>
        </div>
        <div>
          <label htmlFor="hero_alt" className={LABEL}>Hero alt text</label>
          <input
            id="hero_alt"
            name="hero_alt"
            type="text"
            defaultValue={d.hero_alt ?? ''}
            maxLength={200}
            placeholder="CBL Governor Henry F. Saamoi at MPC briefing"
            aria-describedby="hero-alt-hint"
            className={INPUT_BASE}
          />
          <p id="hero-alt-hint" className={HINT}>
            Required for accessibility if a hero image is set. Describe the image, don&apos;t restate the headline.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6">
        <label htmlFor="body" className={LABEL}>Body (Markdown)</label>
        <textarea
          id="body"
          name="body"
          required
          defaultValue={d.body ?? ''}
          rows={20}
          placeholder="Write the article in Markdown…"
          className={`${INPUT_BASE} font-mono text-sm leading-relaxed`}
        />
        <p className={HINT}>
          Use Markdown — headings <code className="text-gray-400">##</code>, links <code className="text-gray-400">[text](url)</code>, lists, etc.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6 space-y-5">
        <fieldset>
          <legend className={LABEL}>Status</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {(['draft', 'published', 'archived'] as const).map((s) => (
              <label key={s} className="inline-flex items-center gap-2 text-sm text-white">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  defaultChecked={status === s}
                  className="h-4 w-4 accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                />
                <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="published_at" className={LABEL}>Published at (optional override)</label>
          <input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={publishedAtValue}
            className={INPUT_BASE}
          />
          <p className={HINT}>
            Leave blank to use the time you click Publish. Ignored when status is Draft or Archived.
          </p>
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
          href="/admin/articles"
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
