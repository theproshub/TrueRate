'use client';

import { useMemo, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { renderMarkdown } from '@/lib/markdown';
import type { ParsedTemplate } from '@/lib/article-template';
import { inferCategory } from '@/lib/category-infer';
import { authorNameForCategory } from '@/domain/editorial/byline-registry';
import { uploadArticleImage } from '../_upload';
import TemplateImporter from './TemplateImporter';

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
  source_name?: string | null;
  source_url?: string | null;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string | null;
}

interface ArticleFormProps {
  action: (formData: FormData) => Promise<void>;
  defaults?: ArticleDefaults;
  authors: AuthorOption[];
  categories: CategoryOption[];
  error?: string | null;
  notice?: string | null;
  submitLabel?: string;
  enableDelete?: boolean;
  deleteAction?: () => Promise<void>;
}

function suggestHeroImage(title: string, body: string): string | null {
  const text = `${title} ${body}`.toLowerCase();
  const suggestions: [RegExp, string][] = [
    [/policy rate|mpc|monetary policy committee/, 'Central Bank of Liberia (CBL) headquarters or MPC briefing room'],
    [/inflation|cpi|consumer price|price.*ris/, 'Monrovia market stalls showing price tags on everyday goods'],
    [/exchange rate|currency|lrd.*usd|dollar.*slip/, 'Foreign exchange bureau or money changers on Broad Street, Monrovia'],
    [/lending rate|borrowing|cost of credit|interest rate/, 'Commercial bank branch entrance (LBDI, Ecobank, UBA) in Monrovia'],
    [/money supply|broad money|reserve money|monetary/, 'Central Bank of Liberia building exterior with signage'],
    [/private.*credit|bank.*lend.*business|credit.*stall/, 'Small business owner at their shop counter in Monrovia'],
    [/deposit|bank.*hold|banking sector/, 'Row of commercial bank facades on Broad Street, Monrovia'],
    [/personal loan|informal entrepreneur/, 'Market trader or street vendor at Waterside or Red Light market'],
    [/startup|entrepreneur|first year|small business/, 'Young entrepreneur in a small office or co-working space in Monrovia'],
    [/gold|artisanal min/, 'Artisanal gold mining operation in rural Liberia'],
    [/iron.?ore|arcelormittal/, 'ArcelorMittal iron ore loading facility in Buchanan'],
    [/mining|mineral.*output/, 'Open-pit mining operation with heavy equipment in Liberia'],
    [/rubber|latex|tapping|plantation/, 'Rubber tapper collecting latex from scored tree trunks on a plantation'],
    [/palm.?oil/, 'Palm oil fruit harvest at a Liberian plantation'],
    [/cocoa/, 'Cocoa beans drying on raised beds at a Liberian farm'],
    [/diamond/, 'Alluvial diamond sifting operation in rural Liberia'],
    [/cement|cemenco|construction.*boom/, 'Cement bags or Cemenco manufacturing plant in Monrovia'],
    [/beverage|bottl|brewery/, 'Monrovia Breweries or beverage manufacturing plant'],
    [/manufactur/, 'Manufacturing facility or factory floor in Monrovia'],
    [/forestry|timber|sawn/, 'Dense tropical forest canopy or timber logging site in rural Liberia'],
    [/agriculture|farm|crop|harvest/, 'Farmer tending crops in a rural Liberian field'],
    [/export|trade.*surge|freeport/, 'Cargo ships or containers at the Freeport of Monrovia'],
    [/import|depend.*import/, 'Imported goods being unloaded at the Freeport of Monrovia'],
    [/current.?account|balance of payment/, 'Container port operations at the Freeport of Monrovia'],
    [/remittance/, 'Money transfer service office in Monrovia'],
    [/gdp|economy grew|economic growth|sectoral/, 'Aerial or panoramic view of Monrovia showing the commercial district'],
    [/two.?speed|inequality|uneven/, 'Aerial view of mining operations alongside a rural Liberian village'],
    [/budget|fiscal|government spend|revenue|tax/, 'Ministry of Finance building or Capitol Building in Monrovia'],
    [/debt|borrow.*government|external.*lend/, 'Ministry of Finance or international development partner offices in Monrovia'],
    [/payroll|public.*sector.*employ/, 'Government office workers outside a ministry building in Monrovia'],
    [/vat|gst|tax.*reform|revenue authority/, 'Liberia Revenue Authority (LRA) office building in Monrovia'],
    [/electricity|power|lights|energy/, 'Power lines and transmission tower or LEC substation in Monrovia'],
    [/health.*care|clinic|medical/, 'Entrance to a health clinic or hospital in Monrovia'],
    [/education|school|fees/, 'Students in uniform outside a school in Monrovia'],
    [/phone|telecom|data.*cheap|communication/, 'Mobile phone tower rising above a Monrovia neighborhood'],
    [/transport|moving people/, 'Commercial vehicles and mobile towers along a Monrovia road'],
    [/food|eating|restaurant|hospitality/, 'Restaurant or food service establishment in Monrovia'],
    [/hotel|tourism|services.*boom/, 'Hotel lobby or hospitality venue in Monrovia (Royal Grand, Cape Hotel)'],
    [/fintech|digital payment|mobile money|ekan/, 'Mobile phone displaying a payment or fintech interface'],
    [/financial.*sector|financial.*institution/, 'Banking district on Broad/Ashmun Street in Monrovia'],
    [/cash outside|currency.*circulation/, 'Liberian dollar banknotes being exchanged at a market stall'],
    [/commodity|commodit/, 'Assorted commodity goods at a Monrovia market'],
    [/china.*export|trade.*partner/, 'Shipping containers with Chinese shipping line branding at Freeport'],
    [/steel|iron.*bar|reinforc/, 'Steel reinforcing bars at a Liberian construction or manufacturing site'],
    [/services.*engine|services.*sector|services.*quiet/, 'Busy commercial street with shops and services in Monrovia'],
  ];

  for (const [pattern, suggestion] of suggestions) {
    if (pattern.test(text)) return suggestion;
  }
  return null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const INPUT_BASE =
  'mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus-visible:border-brand-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink-ink';

const LABEL = 'block text-sm font-semibold text-gray-700';
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
  const publishedAtValue =
    d.published_at ? new Date(d.published_at).toISOString().slice(0, 16) : '';

  const [title, setTitle] = useState(d.title ?? '');
  const [slug, setSlug] = useState(d.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(
    Boolean(d.slug) && d.slug !== slugify(d.title ?? ''),
  );
  const [dek, setDek] = useState(d.dek ?? '');
  const [body, setBody] = useState(d.body ?? '');
  const [categoryId, setCategoryId] = useState(d.category_id ?? '');
  const [authorId, setAuthorId] = useState(d.author_id ?? '');
  const [heroAlt, setHeroAlt] = useState(d.hero_alt ?? '');
  const [sourceName, setSourceName] = useState(d.source_name ?? '');
  const [sourceUrl, setSourceUrl] = useState(d.source_url ?? '');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    d.status ?? 'draft',
  );
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  /** Match a template's free-text name to a dropdown option id (case-insensitive). */
  function matchOptionId(
    name: string,
    options: { id: string; label: string }[],
  ): string | undefined {
    const n = name.trim().toLowerCase();
    return (
      options.find((o) => o.label.trim().toLowerCase() === n)?.id ??
      options.find((o) => o.label.trim().toLowerCase().startsWith(n))?.id
    );
  }

  /** The author option id mapped to a category's desk (e.g. Economy → TrueRate Economics). */
  function deskAuthorIdForCategory(categoryId: string): string | undefined {
    const label = categories.find((c) => c.id === categoryId)?.label;
    const name = authorNameForCategory(label);
    return name
      ? matchOptionId(name, authors.map((a) => ({ id: a.id, label: a.name })))
      : undefined;
  }

  /** Pick a category and auto-fill its desk byline. */
  function selectCategory(categoryId: string) {
    setCategoryId(categoryId);
    const deskId = deskAuthorIdForCategory(categoryId);
    if (deskId) setAuthorId(deskId);
  }

  function applyTemplate(parsed: ParsedTemplate) {
    if (parsed.title !== undefined) setTitle(parsed.title);
    if (parsed.dek !== undefined) setDek(parsed.dek);
    if (parsed.slug !== undefined) {
      setSlugTouched(true);
      setSlug(slugify(parsed.slug));
    }
    if (parsed.heroImage !== undefined) setHeroImage(parsed.heroImage);
    if (parsed.heroAlt !== undefined) setHeroAlt(parsed.heroAlt);
    // Category: an explicit label that matches a real option wins; otherwise
    // infer the best-fit category from the draft's topics.
    const explicitCat = parsed.category
      ? matchOptionId(parsed.category, categories)
      : undefined;
    const categoryId =
      explicitCat ??
      inferCategory(
        { title: parsed.title, dek: parsed.dek, body: parsed.body },
        categories,
      );
    if (categoryId) setCategoryId(categoryId);

    // Author: a draft byline that matches a real author wins; otherwise fall
    // back to the desk for the chosen category (Economy → TrueRate Economics…).
    const draftAuthorId = parsed.author
      ? matchOptionId(parsed.author, authors.map((a) => ({ id: a.id, label: a.name })))
      : undefined;
    const authorId =
      draftAuthorId ?? (categoryId ? deskAuthorIdForCategory(categoryId) : undefined);
    if (authorId) setAuthorId(authorId);
    if (parsed.sourceName !== undefined) setSourceName(parsed.sourceName);
    if (parsed.sourceUrl !== undefined) setSourceUrl(parsed.sourceUrl);
    if (parsed.status !== undefined) setStatus(parsed.status);
    setBody(parsed.body);
    setTab('write');
  }

  const [heroImage, setHeroImage] = useState(d.hero_image ?? '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageSuggestion = useMemo(() => suggestHeroImage(title, body), [title, body]);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const fd = new FormData();
    fd.set('file', file);
    startUpload(async () => {
      const result = await uploadArticleImage(fd);
      if (result.error) {
        setUploadError(result.error);
      } else if (result.url) {
        setHeroImage(result.url);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  }

  const effectiveSlug = slugTouched ? slug : slugify(title);

  const wordCount = useMemo(
    () => (body.trim() ? body.trim().split(/\s+/).length : 0),
    [body],
  );
  const readMinutes = Math.max(1, Math.round(wordCount / 200));

  const previewHtml = useMemo(
    () =>
      tab === 'preview'
        ? renderMarkdown(body.trim() ? body : '_Nothing to preview yet._')
        : '',
    [tab, body],
  );

  return (
    <form action={action} className="space-y-6" noValidate>
      {error && (
        <div role="alert" aria-live="assertive" className="rounded-lg border border-red-500/30 bg-red-500/[0.06] p-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" aria-live="polite" className="rounded-lg border border-pos/30 bg-pos/[0.06] p-3 text-sm text-pos">
          {notice}
        </div>
      )}

      <TemplateImporter
        onApply={applyTemplate}
        hasExistingContent={Boolean(title.trim() || body.trim())}
      />

      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 space-y-5">
        <div>
          <label htmlFor="title" className={LABEL}>Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            maxLength={80}
            placeholder="auto-generated from title"
            pattern="[a-z0-9-]*"
            className={INPUT_BASE}
          />
          <p className={HINT}>
            {slugTouched
              ? 'Manually set. '
              : 'Auto-following the title. '}
            Lowercase letters, numbers, hyphens.
            {slugTouched && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => { setSlugTouched(false); setSlug(''); }}
                  className="text-brand-accent underline hover:text-brand-accent-hover"
                >
                  Re-sync to title
                </button>
              </>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="dek" className={LABEL}>Standfirst / subtitle</label>
          <input
            id="dek"
            name="dek"
            type="text"
            value={dek}
            onChange={(e) => setDek(e.target.value)}
            maxLength={300}
            placeholder="One-sentence summary shown under the headline"
            className={INPUT_BASE}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category_id" className={LABEL}>Category</label>
            <select id="category_id" name="category_id" value={categoryId} onChange={(e) => selectCategory(e.target.value)} className={INPUT_BASE}>
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="author_id" className={LABEL}>Author</label>
            <select id="author_id" name="author_id" value={authorId} onChange={(e) => setAuthorId(e.target.value)} aria-describedby="author-hint" className={INPUT_BASE}>
              <option value="">— None —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <p id="author-hint" className={HINT}>Auto-set from the category — change it here to override.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="source_name" className={LABEL}>Source outlet (optional)</label>
            <input
              id="source_name"
              name="source_name"
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              maxLength={120}
              placeholder="Bloomberg, Reuters, New Dawn…"
              aria-describedby="source-hint"
              className={INPUT_BASE}
            />
          </div>
          <div>
            <label htmlFor="source_url" className={LABEL}>Source link (optional)</label>
            <input
              id="source_url"
              name="source_url"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              maxLength={500}
              placeholder="https://…"
              className={INPUT_BASE}
            />
          </div>
        </div>
        <p id="source-hint" className={HINT}>
          Credits the originating outlet on the story (Yahoo/Bloomberg-style). Leave blank for original TrueRate reporting.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 space-y-5">
        <div>
          <label htmlFor="hero_image" className={LABEL}>Hero image</label>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <input
              id="hero_image"
              name="hero_image"
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://… , /governor.jpg, or upload →"
              className={`${INPUT_BASE} mt-0 flex-1`}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="shrink-0 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink"
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              onChange={onPickFile}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          {uploadError && (
            <p role="alert" className="mt-1 text-xs text-red-400">{uploadError}</p>
          )}
          <p className={HINT}>
            Paste an external URL / <code className="text-gray-500">/public</code> path, or upload to
            Supabase Storage (max 10&nbsp;MB; JPEG, PNG, WebP, AVIF, GIF).
          </p>
          {heroImage ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="max-h-48 w-full object-cover" />
            </div>
          ) : imageSuggestion && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800">Suggested image</p>
              <p className="mt-1 text-sm text-amber-700">{imageSuggestion}</p>
              <p className="mt-2 text-xs text-amber-600">Min 1200px wide · 16:9 or 3:2 · WebP preferred · Real photographs only</p>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="hero_alt" className={LABEL}>Hero alt text</label>
          <input id="hero_alt" name="hero_alt" type="text" value={heroAlt} onChange={(e) => setHeroAlt(e.target.value)} maxLength={200} placeholder="CBL Governor Henry F. Saamoi at MPC briefing" aria-describedby="hero-alt-hint" className={INPUT_BASE} />
          <p id="hero-alt-hint" className={HINT}>Required for accessibility if a hero image is set. Describe the image, don&apos;t restate the headline.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="body" className={LABEL}>Body (Markdown)</label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 tabular-nums">
              {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'} · {readMinutes} min read
            </span>
            <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 text-xs">
              <button
                type="button"
                onClick={() => setTab('write')}
                aria-pressed={tab === 'write'}
                className={`px-3 py-1 font-medium transition-colors ${tab === 'write' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setTab('preview')}
                aria-pressed={tab === 'preview'}
                className={`px-3 py-1 font-medium transition-colors ${tab === 'preview' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>

        {/* Body always present in the DOM so it submits even while previewing */}
        <textarea
          id="body"
          name="body"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={20}
          placeholder="Write the article in Markdown…"
          className={`${INPUT_BASE} font-mono text-sm leading-relaxed ${tab === 'preview' ? 'hidden' : ''}`}
        />

        {tab === 'preview' && (
          <div className="mt-1 min-h-[480px] rounded-lg border border-gray-200 bg-white px-6 py-5">
            <div className="article-body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        )}

        <p className={HINT}>
          Use Markdown — headings <code className="text-gray-500">##</code>, links <code className="text-gray-500">[text](url)</code>, lists, blockquotes.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-brand-card p-6 space-y-5">
        <fieldset>
          <legend className={LABEL}>Status</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {(['draft', 'published', 'archived'] as const).map((s) => (
              <label key={s} className="inline-flex items-center gap-2 text-sm text-gray-900">
                <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="h-4 w-4 accent-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink" />
                <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="published_at" className={LABEL}>Published at (optional override)</label>
          <input id="published_at" name="published_at" type="datetime-local" defaultValue={publishedAtValue} className={INPUT_BASE} />
          <p className={HINT}>Leave blank to use the time you click Publish. Ignored when status is Draft or Archived.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
          {submitLabel}
        </button>
        <Link href="/admin/articles" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 no-underline transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent-ink">
          Cancel
        </Link>
        {enableDelete && deleteAction && (
          <button
            type="submit"
            formAction={deleteAction}
            formNoValidate
            className="ml-auto rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
