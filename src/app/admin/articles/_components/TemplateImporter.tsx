'use client';

import { useId, useRef, useState } from 'react';
import { parseTemplate, type ParsedTemplate } from '@/lib/article-template';
import { extractDraftFile, ACCEPTED_DRAFT_TYPES } from '@/lib/draft-file';

interface TemplateImporterProps {
  /** Called with the parsed draft when the editor applies a template. */
  onApply: (parsed: ParsedTemplate) => void;
  /** True when the form already has title/body content worth protecting. */
  hasExistingContent: boolean;
}

interface Preset {
  name: string;
  description: string;
  template: string;
}

const PRESETS: Preset[] = [
  {
    name: 'News report',
    description: 'Inverted-pyramid hard-news structure.',
    template: `Title:
Standfirst:
Body:
## Lead

## Context

## What officials said

## What it means

## What's next
`,
  },
  {
    name: 'Analysis',
    description: 'Explainer / analysis with takeaways.',
    template: `Title:
Standfirst:
Body:
## The headline number

## Why it matters

## The detail

## The counter-view

## Bottom line
`,
  },
  {
    name: 'Sports story',
    description: 'Match / club-finance report.',
    template: `Title:
Standfirst:
Body:
## What happened

## The numbers

## Reaction

## The wider picture
`,
  },
];

const PANEL_BTN =
  'rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent';

export default function TemplateImporter({
  onApply,
  hasExistingContent,
}: TemplateImporterProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [dragging, setDragging] = useState(false);
  const [reading, setReading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const textareaId = useId();

  /** Confirm (when needed), parse the Markdown, and push it into the form. */
  function applyMarkdown(markdown: string): boolean {
    if (!markdown.trim()) return false;
    if (
      hasExistingContent &&
      !window.confirm(
        'This will replace the current title, standfirst and body. Continue?',
      )
    ) {
      return false;
    }
    onApply(parseTemplate(markdown));
    return true;
  }

  function handleApply() {
    applyMarkdown(value);
  }

  async function handleFile(file: File) {
    setFileError(null);
    setFileName(file.name);
    setReading(true);
    try {
      const markdown = await extractDraftFile(file);
      if (!markdown.trim()) {
        setFileError('That file looks empty — nothing to import.');
        return;
      }
      setValue(markdown);
      // Auto-fill the form so there's no extra step. If the user declines the
      // overwrite confirm, the text still sits in the box below for review.
      applyMarkdown(markdown);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : 'Could not read that file.');
    } finally {
      setReading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-brand-card p-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        <span>
          <span className="block text-sm font-semibold text-white">
            Start from a draft or template
          </span>
          <span className="mt-1 block text-xs text-gray-400">
            Drop a Word doc (.docx), Markdown or text file to auto-fill the
            fields below — or paste a structure. Check the Preview tab to see how
            it renders.
          </span>
        </span>
        <span aria-hidden="true" className="text-lg leading-none text-gray-400">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div id={panelId} className="mt-4 space-y-4">
          {/* ── Drop / upload zone ─────────────────────────────────────── */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              dragging
                ? 'border-brand-accent bg-brand-accent/[0.06]'
                : 'border-white/[0.12] bg-white/[0.02]'
            }`}
          >
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Drop your draft here</span>{' '}
              to auto-fill the form
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Word (.docx), Markdown (.md) or text (.txt)
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={reading}
                className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                {reading ? 'Reading…' : 'Choose file'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_DRAFT_TYPES}
              onChange={onInputChange}
              className="sr-only"
              aria-label="Upload a draft file to auto-fill the article"
            />
            <div className="mt-2 min-h-[1rem]" aria-live="polite">
              {fileError ? (
                <p role="alert" className="text-xs text-red-400">
                  {fileError}
                </p>
              ) : fileName && !reading ? (
                <p className="text-xs text-pos">
                  Filled from <span className="font-semibold">{fileName}</span>.
                  Review and edit below.
                </p>
              ) : null}
            </div>
          </div>

          {/* ── Or paste a structure ───────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">
              Or start from a preset:
            </span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setValue(p.template)}
                title={p.description}
                className={PANEL_BTN}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor={textareaId}
              className="block text-sm font-semibold text-gray-300"
            >
              Template / pasted text
            </label>
            <textarea
              id={textareaId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={10}
              placeholder={'Title: …\nStandfirst: …\nBody:\n## Lead\n…'}
              aria-describedby={`${textareaId}-hint`}
              className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2 font-mono text-sm leading-relaxed text-white placeholder:text-gray-500 focus-visible:border-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            />
            <p id={`${textareaId}-hint`} className="mt-1 text-xs text-gray-500">
              Reads field-sheet labels —{' '}
              <code className="text-gray-400">TITLE:</code>,{' '}
              <code className="text-gray-400">STANDFIRST:</code>,{' '}
              <code className="text-gray-400">CATEGORY:</code>,{' '}
              <code className="text-gray-400">AUTHOR:</code>,{' '}
              <code className="text-gray-400">HERO ALT TEXT:</code>,{' '}
              <code className="text-gray-400">BODY:</code>,{' '}
              <code className="text-gray-400">STATUS:</code> — with the value on
              the next line, and stops at a <code className="text-gray-400">---</code>{' '}
              divider. Also accepts inline{' '}
              <code className="text-gray-400">Label: value</code> or a leading{' '}
              <code className="text-gray-400"># Heading</code>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleApply}
              disabled={!value.trim()}
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-accent-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Apply to draft
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue('');
                  setFileName(null);
                  setFileError(null);
                }}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
