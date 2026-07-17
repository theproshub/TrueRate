'use client';

import { useState, useTransition, type ReactNode } from 'react';
import type { CommodityQuote } from '@/domain/markets/commodities';
import type { NormalizedIndicator } from '@/types/indicators';
import { getUpcomingEvents } from '@/data/economic-events';
import { refreshStories, refreshRates, refreshCommodities, refreshIndicators, type RatesPayload } from '../_actions';
import { storyEdits, rateEdits, marketEdits, marketsPrefillReady, statEdits, calendarEventEdits, type StoryItem } from './prefill';
import { FONT_SANS, FONT_MONO } from './templates/shared';
import type { CardTweaks } from './templates/types';

export interface SyncPanelProps {
  stories: StoryItem[];
  rates: RatesPayload;
  commodities: CommodityQuote[];
  indicators: NormalizedIndicator[];
  onApply: (edits: Partial<CardTweaks>) => void;
  onClose: () => void;
}

const FOCUS_RING = 'focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:outline-none';

const twSyncLabel = {
  fontFamily: FONT_MONO, fontSize: 10,
  color: 'rgba(191,234,54,0.75)', marginBottom: 10,
  letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: 600,
};

const SECONDARY_BTN = {
  width: '100%', minHeight: 44, padding: '8px 12px',
  background: 'transparent', color: '#BFEA36',
  border: '1px solid rgba(191,234,54,0.4)', cursor: 'pointer',
  fontSize: 11, fontFamily: FONT_MONO, letterSpacing: 1.5,
  textTransform: 'uppercase' as const, fontWeight: 700,
};

function SyncSection({ title, children, last }: { title: string; children: ReactNode; last?: boolean }) {
  return (
    <div style={{
      marginBottom: last ? 0 : 18, paddingBottom: last ? 0 : 14,
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.08)',
    }}
    >
      <div style={twSyncLabel}>{'──'} {title}</div>
      {children}
    </div>
  );
}

const STALE_MESSAGE = 'Live rates unavailable — refusing to prefill from stale data.';
const COMMODITIES_INCOMPLETE_MESSAGE = 'Live commodity data incomplete — refusing to prefill.';

export default function SyncPanel({ stories, rates, commodities, indicators, onApply, onClose }: SyncPanelProps) {
  const [storyList, setStoryList] = useState(stories);
  const [rateData, setRateData] = useState(rates);
  const [commodityList, setCommodityList] = useState(commodities);
  const [indicatorList, setIndicatorList] = useState(indicators);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const handleRefresh = () => {
    setError('');
    startTransition(async () => {
      try {
        const [s, r, c, i] = await Promise.all([
          refreshStories(),
          refreshRates(),
          refreshCommodities(),
          refreshIndicators(),
        ]);
        setStoryList(s);
        setRateData(r);
        setCommodityList(c);
        setIndicatorList(i);
      } catch {
        setError('Could not refresh from the site — try again.');
      }
    });
  };

  // Static curated calendar module — date-dependent, not network-dependent.
  const upcomingEvents = getUpcomingEvents(new Date(), 5);

  const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());
  const marketDateLabel = `${shortDate} · Latest`;
  const ratesUsable = !rateData.stale && typeof rateData.lookup.USD === 'number' && Number.isFinite(rateData.lookup.USD);
  const marketsReady = ratesUsable && marketsPrefillReady(rateData.lookup, commodityList);

  return (
    <div
      id="tr-sync-panel"
      role="region"
      aria-label="Pull from site"
      style={{
        position: 'fixed', top: 64, right: 16,
        width: 380, maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
        background: '#050d11', border: '1px solid rgba(191,234,54,0.3)',
        padding: 18, fontFamily: FONT_SANS,
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{
          fontFamily: FONT_MONO, fontWeight: 700, fontSize: 12, color: '#BFEA36',
          letterSpacing: 3, textTransform: 'uppercase',
        }}
        >
          {'// Pull from Site'}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pull-from-site panel"
          className={FOCUS_RING}
          style={{
            minWidth: 44, minHeight: 44, background: 'transparent', border: 'none',
            color: 'rgba(243,244,244,0.65)', fontSize: 18, cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={pending}
        aria-label="Refresh stories and rates"
        className={FOCUS_RING}
        style={{
          width: '100%', minHeight: 44, marginBottom: 14,
          background: pending ? 'rgba(191,234,54,0.4)' : '#BFEA36', color: '#050d11',
          border: 'none', fontWeight: 700, fontSize: 12, letterSpacing: 1.5,
          textTransform: 'uppercase', cursor: pending ? 'default' : 'pointer',
          fontFamily: FONT_MONO,
        }}
      >
        {pending ? 'Refreshing…' : '⟳ Refresh'}
      </button>

      {error &&
      <p role="alert" style={{ fontSize: 12, color: '#e11b22', marginBottom: 14, lineHeight: 1.5 }}>
        {error}
      </p>
      }

      <SyncSection title="Live Rate">
        {ratesUsable ?
          <>
            <p style={{ fontSize: 12, color: 'rgba(243,244,244,0.8)', marginBottom: 8, fontFamily: FONT_SANS }}>
              USD → LRD {rateData.lookup.USD}
            </p>
            <button
              type="button"
              onClick={() => onApply({ ...rateEdits(rateData.lookup, shortDate), templateType: 'rate' })}
              className={FOCUS_RING}
              style={SECONDARY_BTN}
            >
              Apply to Daily Rate card
            </button>
          </> :
          <p role="alert" style={{ fontSize: 12, color: '#e11b22', lineHeight: 1.5 }}>
            {STALE_MESSAGE}
          </p>
        }
      </SyncSection>

      <SyncSection title="Markets">
        {marketsReady ?
          <button
            type="button"
            onClick={() => onApply({ ...marketEdits(rateData.lookup, commodityList, marketDateLabel), templateType: 'markets' })}
            className={FOCUS_RING}
            style={SECONDARY_BTN}
          >
            Apply to Markets card
          </button> :
          <p role="alert" style={{ fontSize: 12, color: '#e11b22', lineHeight: 1.5 }}>
            {ratesUsable ? COMMODITIES_INCOMPLETE_MESSAGE : STALE_MESSAGE}
          </p>
        }
      </SyncSection>

      <SyncSection title="Key Indicators">
        {indicatorList.length === 0 &&
        <p style={{ fontSize: 12, color: 'rgba(243,244,244,0.55)', lineHeight: 1.5 }}>
          No indicator data returned.
        </p>
        }
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {indicatorList.map((ind) => (
            <li key={ind.key} style={{ marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => onApply({ ...statEdits(ind), templateType: 'stat' })}
                aria-label={`Use ${ind.name} as Big Stat`}
                className={FOCUS_RING}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10,
                  width: '100%', minHeight: 44, textAlign: 'left',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F3F4F4', padding: '8px 10px', cursor: 'pointer', fontSize: 13,
                  lineHeight: 1.35, fontFamily: FONT_SANS,
                }}
              >
                <span>{ind.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, whiteSpace: 'nowrap', color: 'rgba(243,244,244,0.75)' }}>
                  {ind.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}{ind.unit === '%' ? '%' : ` ${ind.unit}`} · {ind.period}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SyncSection>

      <SyncSection title="Economic Calendar">
        {upcomingEvents.length === 0 &&
        <p style={{ fontSize: 12, color: 'rgba(243,244,244,0.55)', lineHeight: 1.5 }}>
          No upcoming events on the calendar.
        </p>
        }
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {upcomingEvents.map((ev) => (
            <li key={ev.id} style={{ marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => onApply({ ...calendarEventEdits(ev), templateType: 'event' })}
                aria-label={`Use event: ${ev.title}`}
                className={FOCUS_RING}
                style={{
                  display: 'block', width: '100%', minHeight: 44, textAlign: 'left',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F3F4F4', padding: '8px 10px', cursor: 'pointer', fontSize: 13,
                  lineHeight: 1.35, fontFamily: FONT_SANS,
                }}
              >
                <span style={{
                  fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: ev.impact === 'high' ? '#e11b22' : 'rgba(243,244,244,0.55)',
                  display: 'block', marginBottom: 2,
                }}>
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(ev.date + 'T00:00:00'))} · {ev.impact}
                </span>
                {ev.title}
              </button>
            </li>
          ))}
        </ul>
      </SyncSection>

      <SyncSection title={`Articles (${storyList.length})`} last>
        {storyList.length === 0 &&
        <p style={{ fontSize: 12, color: 'rgba(243,244,244,0.55)', lineHeight: 1.5 }}>
          No published stories returned.
        </p>
        }
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {storyList.map((s) => (
            <li key={s.slug} style={{ marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => { onApply(storyEdits(s)); onClose(); }}
                aria-label={`Use this story: ${s.title}`}
                className={FOCUS_RING}
                style={{
                  display: 'flex', gap: 10, alignItems: 'center', width: '100%',
                  minHeight: 44, textAlign: 'left',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F3F4F4', padding: '8px 10px', cursor: 'pointer', fontSize: 13,
                  lineHeight: 1.35, fontFamily: FONT_SANS,
                }}
              >
                {s.image ?
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote origin, decorative thumbnail
                  <img
                    src={s.image}
                    alt=""
                    loading="lazy"
                    style={{ width: 52, height: 40, objectFit: 'cover', flexShrink: 0, background: '#050d11' }}
                  /> :
                  <div aria-hidden="true" style={{ width: 52, height: 40, flexShrink: 0, background: '#050d11' }} />
                }
                <span>{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </SyncSection>
    </div>
  );
}
