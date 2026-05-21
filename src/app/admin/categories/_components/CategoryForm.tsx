import Link from 'next/link';

export interface CategoryDefaults {
  id?: string;
  slug?: string;
  label?: string;
  description?: string | null;
  display_order?: number | null;
}

interface CategoryFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: CategoryDefaults;
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

export default function CategoryForm({
  action,
  defaults = {},
  error,
  notice,
  submitLabel = 'Save',
  enableDelete = false,
  deleteAction,
}: CategoryFormProps) {
  const d = defaults;
  const orderValue =
    d.display_order === null || d.display_order === undefined ? '' : String(d.display_order);

  return (
    <form action={action} className="space-y-6" noValidate>
      {error && (
        <div role="alert" aria-live="assertive" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" aria-live="polite" className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-3 text-sm text-emerald-300">
          {notice}
        </div>
      )}

      <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6 space-y-5">
        <div>
          <label htmlFor="label" className={LABEL}>Display label</label>
          <input
            id="label"
            name="label"
            type="text"
            required
            defaultValue={d.label ?? ''}
            maxLength={120}
            placeholder="Economy"
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
            placeholder="economy (auto from label if blank)"
            pattern="[a-z0-9-]*"
            className={INPUT_BASE}
          />
          <p className={HINT}>
            This is the URL fragment used in section links (e.g. <code className="text-gray-400">/economy</code>).
            Changing it on an existing category may break inbound links.
          </p>
        </div>

        <div>
          <label htmlFor="description" className={LABEL}>Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={d.description ?? ''}
            rows={3}
            placeholder="Short blurb shown on section landing pages."
            className={INPUT_BASE}
          />
        </div>

        <div>
          <label htmlFor="display_order" className={LABEL}>Display order</label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            step={10}
            defaultValue={orderValue}
            placeholder="0"
            className={INPUT_BASE}
          />
          <p className={HINT}>Lower numbers appear first in category dropdowns and nav lists.</p>
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
          href="/admin/categories"
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
