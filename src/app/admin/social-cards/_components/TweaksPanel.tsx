'use client';

import { useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { FONT_SANS, FONT_MONO } from './templates/shared';
import type { CardTweaks } from './templates/types';

// Ported from design_handoff_admin_social_cards/tr_app.jsx:83 — no other consumer, so it
// lives here rather than in templates/types.ts.
const CATEGORIES = ['News', 'Markets', 'Economy', 'Analytics', 'Business', 'Technology', 'Videos'] as const;

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

export interface TweaksPanelProps {
  tweaks: CardTweaks;
  setTweak: <K extends keyof CardTweaks>(k: K, v: CardTweaks[K]) => void;
  storagePicker?: ReactNode;
}

// --- Typed dynamic-key accessors -------------------------------------------------
// tr_app.jsx accesses tweaks[`market${n}Label`] etc. with plain string interpolation.
// These helpers rebuild that access pattern as template-literal types so setTweak's
// generic `<K extends keyof CardTweaks>(k: K, v: CardTweaks[K])` still narrows K per
// call site instead of widening to `keyof CardTweaks` (which would erase type safety).
type MarketIndex = 1 | 2 | 3 | 4;
type MarketStrField = 'Label' | 'Value' | 'Change';
type ExIndex = 1 | 2 | 3;

function marketStrKey<N extends MarketIndex, F extends MarketStrField>(n: N, field: F): `market${N}${F}` {
  return `market${n}${field}` as `market${N}${F}`;
}
function marketUpKey<N extends MarketIndex>(n: N): `market${N}Up` {
  return `market${n}Up` as `market${N}Up`;
}
function exTitleKey<N extends ExIndex>(n: N): `ex${N}Title` {
  return `ex${n}Title` as `ex${N}Title`;
}
function exBodyKey<N extends ExIndex>(n: N): `ex${N}Body` {
  return `ex${n}Body` as `ex${N}Body`;
}

// --- Shared field styling (verbatim from tr_app.jsx:468-475) ----------------------
const twLabel: CSSProperties = {
  display: 'block', color: 'rgba(243,244,244,0.5)', fontSize: 10, letterSpacing: 1.5,
  textTransform: 'uppercase', marginBottom: 5, fontFamily: FONT_MONO,
};
const twField: CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)', color: '#F3F4F4',
  padding: '8px 10px', fontSize: 12, fontFamily: FONT_SANS,
  resize: 'vertical', marginBottom: 10, lineHeight: 1.5, outline: 'none',
  borderRadius: 0,
};

function TwSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 10,
        color: 'rgba(191,234,54,0.75)', marginBottom: 10,
        letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600,
      }}>{'──'} {title}</div>
      {children}
    </div>
  );
}

function TwInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} style={twLabel}>{label}</label>
      <input
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={FOCUS_RING}
        style={{ ...twField, height: 32 }}
      />
    </>
  );
}

function TwTextarea({
  label, value, onChange, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} style={twLabel}>{label}</label>
      <textarea
        id={id}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={FOCUS_RING}
        style={twField}
        rows={rows}
      />
    </>
  );
}

function TwSelect({
  label, value, options, onChange,
}: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} style={twLabel}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FOCUS_RING}
        style={{ ...twField, height: 32, appearance: 'none' }}
      >
        {options.map((o) => <option key={o} value={o} style={{ background: '#050d11' }}>{o}</option>)}
      </select>
    </>
  );
}

function TwColor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} style={twLabel}>{label}</label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
        <input
          type="color"
          aria-label={`${label} color swatch`}
          value={value || '#5BA4FF'}
          onChange={(e) => onChange(e.target.value)}
          className={FOCUS_RING}
          style={{ width: 36, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, background: 'transparent', padding: 2, cursor: 'pointer' }}
        />
        <input
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={FOCUS_RING}
          style={{ ...twField, height: 32, marginBottom: 0, flex: 1 }}
        />
      </div>
    </>
  );
}

function TwInputTiny({
  label, placeholder, value, onChange,
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={FOCUS_RING}
        style={{ ...twField, height: 30, marginBottom: 0, fontSize: 11, padding: '4px 7px' }}
      />
    </>
  );
}

function TwSlider({
  label, value, onChange, min = 0, max = 100, step = 1,
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  const id = useId();
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <label htmlFor={id} style={{ ...twLabel, marginBottom: 0 }}>{label}</label>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 11,
          color: 'rgba(191,234,54,0.85)', fontWeight: 600,
        }}>{value}%</span>
      </div>
      <input
        id={id}
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={FOCUS_RING}
        style={{ width: '100%', accentColor: '#BFEA36', cursor: 'pointer' }}
      />
    </div>
  );
}

// The ▲/▼ direction toggles: the visible square stays at the prototype's compact size,
// but it sits inside a 44×44 hit area via invisible padding rather than growing on-screen.
function TwDirectionToggle({
  up, onToggle, width = 32, height = 30,
}: { up: boolean; onToggle: () => void; width?: number; height?: number }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Direction: ${up ? 'up' : 'down'}`}
      aria-pressed={up}
      className={FOCUS_RING}
      style={{
        width: 44, height: 44, minWidth: 44, minHeight: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
      }}
    >
      <span aria-hidden="true" style={{
        width, height, background: up ? '#BFEA36' : '#e11b22',
        color: '#050d11', fontWeight: 700, fontFamily: FONT_MONO,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{up ? '▲' : '▼'}</span>
    </button>
  );
}

function TwImageUpload({
  value, onChange, storagePicker,
}: { value: string; onChange: (v: string) => void; storagePicker?: ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const urlInputId = useId();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Store original at full resolution, lossless. localStorage persistence will
    // skip these (size > 100KB) — they live in component state for the session.
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={fileInputId} style={twLabel}>Upload / Paste Image</label>
      <input
        id={fileInputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={FOCUS_RING}
          style={{
            flex: 1, padding: '8px 10px', minHeight: 44, background: '#BFEA36', color: '#050d11',
            border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            fontFamily: FONT_MONO, letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}
        >
          Upload
        </button>
        {value &&
        <button
          type="button"
          onClick={() => onChange('')}
          className={FOCUS_RING}
          style={{
            padding: '8px 12px', minHeight: 44, background: 'transparent', color: 'rgba(243,244,244,0.7)',
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 11,
            fontFamily: FONT_MONO, letterSpacing: 1.5,
            textTransform: 'uppercase', fontWeight: 500,
          }}
        >
          Clear
        </button>
        }
      </div>

      {storagePicker}

      <label htmlFor={urlInputId} className="sr-only">Or paste image URL</label>
      <input
        id={urlInputId}
        placeholder="Or paste image URL…"
        value={value && !value.startsWith('data:') ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className={FOCUS_RING}
        style={{ ...twField, height: 30, marginBottom: 8, fontSize: 11 }}
      />

      {value &&
      <div
        role="img"
        aria-label="Selected image preview"
        style={{
          height: 90, marginBottom: 4,
          backgroundImage: `url(${value})`,
          border: '1px solid rgba(191,234,54,0.2)', width: '302px', backgroundPosition: 'center top', backgroundSize: 'cover',
        }}
      />
      }
    </div>
  );
}

export default function TweaksPanel({ tweaks, setTweak, storagePicker }: TweaksPanelProps) {
  const { templateType } = tweaks;
  const showField = {
    headline: templateType === 'breaking' || templateType === 'story',
    subtext: templateType === 'breaking',
    article: templateType === 'article',
    stat: templateType === 'stat' || templateType === 'article',
    markets: templateType === 'markets' || templateType === 'article' || templateType === 'breaking',
    quote: templateType === 'quote',
    rate: templateType === 'rate',
    event: templateType === 'event',
    explainer: templateType === 'explainer',
    cover: templateType === 'cover',
  };

  // Image slot for the current template
  const imageSlot = ({
    breaking: { key: 'breakingImage', posKey: 'breakingImagePosY', label: 'Breaking News' },
    article: { key: 'articleImage', posKey: 'articleImagePosY', label: 'Article' },
    quote: { key: 'quoteImage', posKey: 'quoteImagePosY', label: 'Quote / Portrait' },
    stat: { key: 'statImage', posKey: 'statImagePosY', label: 'Big Stat' },
    markets: { key: 'marketsImage', posKey: 'marketsImagePosY', label: 'Markets' },
    rate: { key: 'rateImage', posKey: 'rateImagePosY', label: 'Daily Rate' },
    event: { key: 'eventImage', posKey: 'eventImagePosY', label: 'Event' },
    explainer: { key: 'explainerImage', posKey: 'explainerImagePosY', label: 'Explainer Cover' },
    story: { key: 'storyImage', posKey: 'storyImagePosY', label: 'Story' },
    cover: { key: 'coverImage', posKey: 'coverImagePosY', label: 'Video Cover' },
  } as const)[templateType];

  return (
    <div
      id="tr-tweaks-panel"
      role="region"
      aria-label="Card tweaks"
      style={{
        position: 'fixed', bottom: 16, right: 16,
        background: '#050d11', border: '1px solid rgba(191,234,54,0.3)',
        width: 340, maxHeight: '82vh', overflowY: 'auto',
        padding: 18, fontFamily: FONT_SANS,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        zIndex: 1000,
      }}
    >
      <div style={{
        fontFamily: FONT_MONO,
        fontWeight: 700, fontSize: 12, color: '#BFEA36',
        marginBottom: 14, letterSpacing: 3, textTransform: 'uppercase',
      }}
      >
        {'// Tweaks'}
      </div>

      {imageSlot &&
      <TwSection title={`${imageSlot.label} · Image`}>
        <TwImageUpload
          value={tweaks[imageSlot.key]}
          onChange={(v) => setTweak(imageSlot.key, v)}
          storagePicker={storagePicker}
        />
        {tweaks[imageSlot.key] &&
        <TwSlider
          label="Vertical Crop"
          min={0}
          max={100}
          value={tweaks[imageSlot.posKey] ?? 50}
          onChange={(v) => setTweak(imageSlot.posKey, v)}
        />
        }
      </TwSection>
      }

      <TwSection title="Meta">
        <TwSelect label="Category" value={tweaks.category} options={CATEGORIES} onChange={(v) => setTweak('category', v)} />
        <TwInput label="Date" value={tweaks.date} onChange={(v) => setTweak('date', v)} />
      </TwSection>

      {showField.headline &&
      <TwSection title="Breaking News">
        <TwTextarea label="Headline" value={tweaks.headline} onChange={(v) => setTweak('headline', v)} rows={3} />
        <TwTextarea label="Lede" value={tweaks.subtext} onChange={(v) => setTweak('subtext', v)} rows={4} />
      </TwSection>
      }

      {showField.article &&
      <TwSection title="Article">
        <TwTextarea label="Title" value={tweaks.articleTitle} onChange={(v) => setTweak('articleTitle', v)} rows={3} />
        <TwTextarea label="Excerpt" value={tweaks.articleExcerpt} onChange={(v) => setTweak('articleExcerpt', v)} rows={4} />
        <TwInput label="Read Time" value={tweaks.articleReadTime} onChange={(v) => setTweak('articleReadTime', v)} />
      </TwSection>
      }

      {showField.stat &&
      <TwSection title="Big Stat">
        <TwInput label="Number" value={tweaks.stat} onChange={(v) => setTweak('stat', v)} />
        <TwInput label="Stat Label" value={tweaks.statLabel} onChange={(v) => setTweak('statLabel', v)} />
        <TwTextarea label="Context" value={tweaks.statContext} onChange={(v) => setTweak('statContext', v)} rows={3} />
      </TwSection>
      }

      {showField.markets &&
      <TwSection title="Markets">
        <TwInput label="Header" value={tweaks.marketDate} onChange={(v) => setTweak('marketDate', v)} />
        {([1, 2, 3, 4] as const).map((n) => (
          <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>
            <TwInputTiny
              label={`Market ${n} label`}
              placeholder="Label"
              value={tweaks[marketStrKey(n, 'Label')]}
              onChange={(v) => setTweak(marketStrKey(n, 'Label'), v)}
            />
            <TwInputTiny
              label={`Market ${n} value`}
              placeholder="Value"
              value={tweaks[marketStrKey(n, 'Value')]}
              onChange={(v) => setTweak(marketStrKey(n, 'Value'), v)}
            />
            <div style={{ display: 'flex', gap: 4 }}>
              <TwInputTiny
                label={`Market ${n} percent change`}
                placeholder="%"
                value={tweaks[marketStrKey(n, 'Change')]}
                onChange={(v) => setTweak(marketStrKey(n, 'Change'), v)}
              />
              <TwDirectionToggle
                up={tweaks[marketUpKey(n)]}
                onToggle={() => setTweak(marketUpKey(n), !tweaks[marketUpKey(n)])}
              />
            </div>
          </div>
        ))}
      </TwSection>
      }

      {showField.rate &&
      <TwSection title="Daily Rate">
        <TwInput label="Date" value={tweaks.rateDate} onChange={(v) => setTweak('rateDate', v)} />
        <TwInput label="Mid Rate (USD→LRD)" value={tweaks.rateValue} onChange={(v) => setTweak('rateValue', v)} />
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><TwInput label="Change" value={tweaks.rateChange} onChange={(v) => setTweak('rateChange', v)} /></div>
          <TwDirectionToggle
            up={tweaks.rateUp}
            onToggle={() => setTweak('rateUp', !tweaks.rateUp)}
            width={36}
            height={32}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div><TwInput label="Bank Buying" value={tweaks.rateBuy} onChange={(v) => setTweak('rateBuy', v)} /></div>
          <div><TwInput label="Bank Selling" value={tweaks.rateSell} onChange={(v) => setTweak('rateSell', v)} /></div>
        </div>
      </TwSection>
      }

      {showField.event &&
      <TwSection title="Event">
        <TwInput label="Kind (chip)" value={tweaks.eventKind} onChange={(v) => setTweak('eventKind', v)} />
        <TwTextarea label="Title" value={tweaks.eventTitle} onChange={(v) => setTweak('eventTitle', v)} rows={2} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div><TwInput label="Date" value={tweaks.eventDate} onChange={(v) => setTweak('eventDate', v)} /></div>
          <div><TwInput label="Time" value={tweaks.eventTime} onChange={(v) => setTweak('eventTime', v)} /></div>
        </div>
        <TwInput label="Venue" value={tweaks.eventVenue} onChange={(v) => setTweak('eventVenue', v)} />
        <TwInput label="CTA (bottom-left)" value={tweaks.eventCTA} onChange={(v) => setTweak('eventCTA', v)} />
      </TwSection>
      }

      {showField.explainer &&
      <TwSection title="Explainer Carousel">
        <TwTextarea label="Cover Title" value={tweaks.explainerTitle} onChange={(v) => setTweak('explainerTitle', v)} rows={3} />
        {([1, 2, 3] as const).map((n) => (
          <div key={n}>
            <TwInput label={`Point ${n} · Title`} value={tweaks[exTitleKey(n)]} onChange={(v) => setTweak(exTitleKey(n), v)} />
            <TwTextarea label={`Point ${n} · Body`} value={tweaks[exBodyKey(n)]} onChange={(v) => setTweak(exBodyKey(n), v)} rows={3} />
          </div>
        ))}
        <TwTextarea label="Outro CTA" value={tweaks.explainerCTA} onChange={(v) => setTweak('explainerCTA', v)} rows={2} />
      </TwSection>
      }

      {showField.cover &&
      <TwSection title="Video Cover">
        <TwTextarea label="Title" value={tweaks.coverTitle} onChange={(v) => setTweak('coverTitle', v)} rows={3} />
      </TwSection>
      }

      {showField.quote &&
      <TwSection title="Quote">
        <TwTextarea label="Quote" value={tweaks.quote} onChange={(v) => setTweak('quote', v)} rows={5} />
        <TwInput label="Author" value={tweaks.quoteAuthor} onChange={(v) => setTweak('quoteAuthor', v)} />
        <TwInput label="Role" value={tweaks.quoteRole} onChange={(v) => setTweak('quoteRole', v)} />
        <TwInput label="Context (optional)" value={tweaks.quoteContext} onChange={(v) => setTweak('quoteContext', v)} />
        <TwColor label="Accent" value={tweaks.quoteAccent} onChange={(v) => setTweak('quoteAccent', v)} />
      </TwSection>
      }
    </div>
  );
}
