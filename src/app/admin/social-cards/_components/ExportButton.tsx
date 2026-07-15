'use client';

import { useState, type CSSProperties } from 'react';
import { templateSize } from './templates/registry';
import type { TemplateFormat } from './templates/types';
import { exportNodeAsPng, makeFilename } from './export';

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

const EXPORT_BTN_STYLE: CSSProperties = {
  padding: '7px 14px',
  minHeight: 44,
  background: '#BFEA36',
  color: '#050d11',
  border: '1px solid #BFEA36',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export default function ExportButton({
  format, onSetSlide, currentSlide,
}: {
  format: TemplateFormat;
  onSetSlide: (n: number) => void;
  currentSlide: number;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleExport() {
    const node = document.getElementById('tr-export-target');
    if (!node) { setError('Export target not found.'); return; }
    setBusy(true);
    setError('');
    const size = templateSize(format);
    const startSlide = currentSlide;
    try {
      if (format === 'explainer') {
        for (let slide = 0; slide <= 4; slide++) {
          onSetSlide(slide);
          await nextFrame();
          await nextFrame(); // slide re-render + AutoFitHeadline pass
          await exportNodeAsPng(node, size, makeFilename(format, new Date(), slide));
        }
      } else {
        await exportNodeAsPng(node, size, makeFilename(format));
      }
    } catch (err) {
      setError(err instanceof Error ? `Export failed: ${err.message}` : 'Export failed.');
    } finally {
      if (format === 'explainer') {
        onSetSlide(startSlide);
      }
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        type="button"
        onClick={handleExport}
        disabled={busy}
        className={FOCUS_RING}
        style={{ ...EXPORT_BTN_STYLE, opacity: busy ? 0.6 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {busy ? 'Exporting…' : format === 'explainer' ? 'Download 5 PNGs' : 'Download PNG'}
      </button>
      {error && <p role="alert" style={{ color: '#e11b22', fontSize: 12, margin: 0 }}>{error}</p>}
    </div>
  );
}
