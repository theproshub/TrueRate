import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// 1. BREAKING NEWS — Bloomberg IG card style
// ═══════════════════════════════════════════════════════════
export function BreakingBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#fff', fontFamily: FONT_SANS, color: C.navy
    }}>
      {/* Top image half */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 760 }}>
        <PhotoPlaceholder variant="finance" label="News photo" imageUrl={data.breakingImage} objectPosition={`center ${data.breakingImagePosY ?? 50}%`} bw={data.bwPhoto} />
        {/* Category chip */}
        <div style={{
          position: 'absolute', bottom: 28, left: 44, zIndex: 10,
          background: C.lime, color: C.navy,
          padding: '12px 22px',
          fontFamily: FONT_MONO,
          fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700
        }}>BREAKING · {data.category}</div>
      </div>

      {/* Bottom text half */}
      <div style={{
        position: 'absolute', top: 760, left: 0, right: 0, bottom: 0,
        padding: '48px 48px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <AutoFitHeadline
          text={data.headline}
          maxSize={62} minSize={40} maxLines={5}
          styleOverrides={{ color: C.navy, margin: 0 }}>
          {data.headline.split(' ').map((word, i, arr) => {
            const isKey = i > 0 && i < arr.length - 1 && word.length > 5 && i * 7 % 10 > 6;
            return <span key={i} style={{ fontWeight: isKey ? 900 : 400 }}>{word}{i < arr.length - 1 ? ' ' : ''}</span>;
          })}
        </AutoFitHeadline>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 24, paddingTop: 20, borderTop: `2px solid ${C.navy}`
        }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 20,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(5,13,17,0.55)'
          }}>{data.date} · truerateliberia.com</div>
          <TrueRateMark color="#050d11" size={55} />
        </div>
      </div>
    </div>
  );
}

// LEGACY full-bleed Breaking restored as the primary "Terminal" variant
export function BreakingTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* Full bleed photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="industrial" label="Lead image" imageUrl={data.breakingImage} objectPosition={`center ${data.breakingImagePosY ?? 50}%`} bw={data.bwPhoto} />
        {/* Dark left-to-right gradient for text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(6,14,20,0.55) 0%, rgba(6,14,20,0.25) 40%, rgba(6,14,20,0.85) 100%)'
        }} />
      </div>


      {/* Eyebrow */}
      <div style={{
        position: 'absolute', top: 230, left: 48, zIndex: 10,
        fontFamily: FONT_MONO,
        letterSpacing: 4, textTransform: 'uppercase',
        color: '#fff', fontWeight: 700, fontSize: "24px"
      }}>
        BREAKING · {data.category}
      </div>

      {/* Headline — Yahoo Finance style: huge, bottom-left */}
      <div style={{ position: 'absolute', left: 48, right: 60, bottom: 150, zIndex: 10 }}>
        <AutoFitHeadline text={data.headline} styleOverrides={{ margin: 0 }} />
      </div>

      {/* Bottom — subtle subtext + brand */}
      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10
      }}>
        <span style={{
          fontFamily: FONT_SANS,
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: '#fff',
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>{data.creditLine ? data.creditLine.toUpperCase() : ''}</span>
        <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
          <TrueRateMark color={C.lime} size={64} />
        </span>
      </div>
    </div>
  );
}
