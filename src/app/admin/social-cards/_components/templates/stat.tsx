import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 4. BIG STAT — Full bleed with stat overlay
// ═══════════════════════════════════════════════════════════
export function StatTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* Moody backdrop */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="abstract" label="Thematic image" imageUrl={data.statImage} objectPosition={`center ${data.statImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(5,13,17,0.5) 0%, rgba(5,13,17,0.3) 38%, rgba(5,13,17,0.95) 100%)'
        }} />
      </div>

      <div style={{ position: 'absolute', top: 44, left: 48, right: 48, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TrueRateMark color={C.lime} size={64} />
        <div style={{
          fontFamily: FONT_MONO, fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)'
        }}>{data.date} · {data.category}</div>
      </div>

      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 110, zIndex: 10
      }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 20,
          letterSpacing: 3, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)', marginBottom: 20, fontWeight: 600
        }}><span style={{ color: C.green }}>▲</span> FIGURE OF THE DAY</div>

        <AutoFitHeadline text={data.stat} maxSize={180} minSize={80} maxLines={1}
          styleOverrides={{
            fontWeight: 900, letterSpacing: -6, lineHeight: 0.9, color: C.lime,
            margin: '0 0 18px', textAlign: 'left', textWrap: 'normal',
            fontVariantNumeric: 'tabular-nums'
          }} />

        <AutoFitHeadline text={data.statLabel} maxSize={42} minSize={28} maxLines={3}
          styleOverrides={{
            fontWeight: 700, letterSpacing: -1, lineHeight: 1.12,
            color: '#fff', margin: 0, textAlign: 'left', textWrap: 'pretty'
          }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: FONT_SANS,
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: '#fff',
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · LISGIS · TrueRate Research</span>
      </div>
    </div>
  );
}

export function StatBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy
    }}>
      <div style={{
        padding: '40px 48px 22px',
        borderBottom: `3px double ${C.navy}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <TrueRateMark color={C.navy} size={64} />
        <div style={{
          fontFamily: FONT_MONO, fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(5,13,17,0.55)'
        }}>Figure of the Day · {data.date}</div>
      </div>

      <div style={{ padding: '24px 48px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 22,
          letterSpacing: 3, textTransform: 'uppercase',
          color: C.navy, fontWeight: 700,
          background: C.lime, padding: '12px 22px'
        }}>{data.category}</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(5,13,17,0.15)' }} />
      </div>

      <div style={{ padding: '30px 48px 10px' }}>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 280, fontWeight: 900,
          lineHeight: 0.82, letterSpacing: -12,
          color: C.navy, fontStyle: 'italic'
        }}>{data.stat}</div>
        <div style={{ width: 140, height: 5, background: C.lime, marginTop: 14 }} />
      </div>

      <div style={{ padding: '28px 48px 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 36 }}>
        <h2 style={{
          fontFamily: FONT_SANS, fontSize: 34, fontWeight: 800,
          lineHeight: 1.12, letterSpacing: -1,
          color: C.navy, textWrap: 'balance'
        }}>{data.statLabel}</h2>
        <div style={{ borderLeft: `2px solid ${C.navy}`, paddingLeft: 20 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 18,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(5,13,17,0.5)', marginBottom: 10
          }}>Context</div>
          <p style={{ fontSize: 24, lineHeight: 1.55, color: 'rgba(5,13,17,0.78)' }}>
            {data.statContext}
          </p>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: FONT_SANS,
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: C.navy,
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · LISGIS · TrueRate Research</span>
      </div>
    </div>
  );
}
