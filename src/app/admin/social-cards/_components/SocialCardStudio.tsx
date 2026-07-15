'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import type { CommodityQuote } from '@/domain/markets/commodities';
import type { StoryItem } from './prefill';
import type { RatesPayload } from '../_actions';
import { TR_TEMPLATES, templateSize } from './templates/registry';
import type { TemplateFormat, TemplateVariant } from './templates/types';
import { usePersistedTweaks } from './usePersistedTweaks';

export interface StudioProps {
  initialStories: StoryItem[];
  initialRates: RatesPayload;
  initialCommodities: CommodityQuote[];
}

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

const TOOLBAR_BTN_BASE: CSSProperties = {
  padding: '7px 14px',
  minHeight: 44,
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const SLIDE_NAV_BTN: CSSProperties = {
  minHeight: 44,
  minWidth: 44,
  padding: '0 8px',
  background: 'transparent',
  color: 'rgba(243,244,244,0.65)',
  border: '1px solid rgba(255,255,255,0.15)',
  cursor: 'pointer',
  fontSize: 13,
  fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
  letterSpacing: 1,
};

const SLIDE_LABELS = ['Cover slide', 'Point 1', 'Point 2', 'Point 3', 'Outro slide'];

export default function SocialCardStudio(
  // initialStories/initialRates/initialCommodities are consumed by the Pull-from-Site
  // panel wired up in Task 10 — kept in the interface per the brief, unused here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { initialStories, initialRates, initialCommodities }: StudioProps,
) {
  // applyMany is consumed by the Sync panel in Task 10.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tweaks, setTweak, applyMany } = usePersistedTweaks();
  const [showTweaks, setShowTweaks] = useState(false);
  const [showSync, setShowSync] = useState(false);

  // Escape closes whichever panel is open (HCI).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowTweaks(false); setShowSync(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const format = tweaks.templateType as TemplateFormat;
  const variant = (tweaks.variant === 'broadsheet' ? 'broadsheet' : 'terminal') as TemplateVariant;
  const Template = TR_TEMPLATES[format]?.[variant] ?? TR_TEMPLATES.breaking.terminal;
  const DIM = templateSize(format);
  const SCALE = Math.min(560 / DIM.w, 700 / DIM.h);
  const explainerSlide = Number(tweaks.explainerSlide) || 0;
  const label = TR_TEMPLATES[format]?.label ?? format;
  const formatCaption =
    format === 'story' ? '9:16 Story · IG · WhatsApp · TikTok'
      : format === 'cover' ? '16:9 · Video Thumbnail'
        : '4:5 Portrait · IG · FB · LinkedIn · X';

  return (
    <div className="-mx-4" style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div
        style={{
          background: '#061520', borderBottom: '1px solid rgba(191,234,54,0.2)',
          padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20,
          flexWrap: 'wrap', fontFamily: 'var(--font-inter), Inter, sans-serif',
        }}
      >
        <Image
          src="/logo-tight.png"
          alt="TrueRate"
          width={88}
          height={22}
          style={{ height: 22, width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />
        <span
          style={{
            color: 'rgba(243,244,244,0.45)', fontSize: 12,
            fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace',
            letterSpacing: 2, textTransform: 'uppercase',
          }}
        >
          Social Media Templates · v2
        </span>

        <button
          type="button"
          onClick={() => setShowSync((v) => !v)}
          aria-expanded={showSync}
          aria-controls="tr-sync-panel"
          className={FOCUS_RING}
          style={{
            ...TOOLBAR_BTN_BASE,
            background: showSync ? '#BFEA36' : 'transparent',
            color: showSync ? '#050d11' : '#BFEA36',
            border: '1px solid rgba(191,234,54,0.4)',
            fontWeight: 700,
          }}
        >
          ⟳ Pull from Site
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Object.entries(TR_TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTweak('templateType', key as TemplateFormat)}
              aria-pressed={format === key}
              className={FOCUS_RING}
              style={{
                ...TOOLBAR_BTN_BASE,
                background: format === key ? '#BFEA36' : 'transparent',
                color: format === key ? '#050d11' : 'rgba(243,244,244,0.65)',
                border: `1px solid ${format === key ? '#BFEA36' : 'rgba(255,255,255,0.15)'}`,
                fontWeight: format === key ? 700 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />

        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              { key: 'terminal', label: 'Terminal' },
              { key: 'broadsheet', label: 'Broadsheet' },
            ] as const
          ).map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setTweak('variant', v.key)}
              aria-pressed={variant === v.key}
              className={FOCUS_RING}
              style={{
                ...TOOLBAR_BTN_BASE,
                background: variant === v.key ? '#F3F4F4' : 'transparent',
                color: variant === v.key ? '#050d11' : 'rgba(243,244,244,0.65)',
                border: `1px solid ${variant === v.key ? '#F3F4F4' : 'rgba(255,255,255,0.15)'}`,
                fontWeight: variant === v.key ? 700 : 400,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowTweaks((v) => !v)}
          aria-expanded={showTweaks}
          aria-controls="tr-tweaks-panel"
          className={FOCUS_RING}
          style={{
            ...TOOLBAR_BTN_BASE,
            background: showTweaks ? '#BFEA36' : 'transparent',
            color: showTweaks ? '#050d11' : '#BFEA36',
            border: '1px solid rgba(191,234,54,0.4)',
            fontWeight: 700,
          }}
        >
          Tweaks
        </button>

        <button
          type="button"
          aria-disabled="true"
          className={FOCUS_RING}
          style={{
            ...TOOLBAR_BTN_BASE,
            background: '#BFEA36', color: '#050d11',
            border: '1px solid #BFEA36', fontWeight: 700,
            gap: 6, opacity: 0.5, cursor: 'not-allowed',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download HD PNG
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', gap: 18 }}>
        <p className="sr-only">
          {`Preview of the ${label} card, ${DIM.w} by ${DIM.h} pixels.`}
        </p>
        <div
          style={{
            width: DIM.w * SCALE,
            height: DIM.h * SCALE,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            id="tr-export-target"
            style={{
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
              width: DIM.w, height: DIM.h,
              position: 'absolute', top: 0, left: 0,
              boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(191,234,54,0.1)',
            }}
          >
            <Template data={tweaks} />
          </div>
        </div>

        {format === 'explainer' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setTweak('explainerSlide', Math.max(0, explainerSlide - 1))}
              aria-label="Previous slide"
              className={FOCUS_RING}
              style={SLIDE_NAV_BTN}
            >
              ←
            </button>
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTweak('explainerSlide', i)}
                aria-label={SLIDE_LABELS[i]}
                aria-pressed={explainerSlide === i}
                className={FOCUS_RING}
                style={{
                  ...SLIDE_NAV_BTN,
                  width: 34,
                  background: explainerSlide === i ? '#BFEA36' : 'transparent',
                  color: explainerSlide === i ? '#050d11' : 'rgba(243,244,244,0.65)',
                }}
              >
                {i === 0 ? 'C' : i === 4 ? 'E' : i}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTweak('explainerSlide', Math.min(4, explainerSlide + 1))}
              aria-label="Next slide"
              className={FOCUS_RING}
              style={SLIDE_NAV_BTN}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: 'center', paddingBottom: 14,
          color: 'rgba(243,244,244,0.3)', fontSize: 11,
          fontFamily: 'var(--font-roboto-mono), "Roboto Mono", monospace', letterSpacing: 2, textTransform: 'uppercase',
        }}
      >
        {DIM.w} × {DIM.h} · {formatCaption}
      </div>

      {/* Tweaks / Sync panels mount in Tasks 9–10. */}
    </div>
  );
}
