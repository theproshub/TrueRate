import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 3. QUOTE — Yahoo Finance portrait style
// ═══════════════════════════════════════════════════════════
export function QuoteTerminal({ data }: { data: CardTweaks }) {
  const accent = data.quoteAccent || C.lime;
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#000', fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* Full-bleed portrait photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="portrait" label="Subject portrait" imageUrl={data.quoteImage} objectPosition={`center ${data.quoteImagePosY ?? 20}%`} bw={data.bwPhoto} />
        {/* Bottom gradient — strong solid black behind text, soft fade up */}
        <div style={{
          position: 'absolute', inset: 0, background: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.95) 70%, rgb(0, 0, 0) 78%, rgb(0, 0, 0) 100%) center center / cover"

        }} />
      </div>

      {/* Quote content — bottom-left, Yahoo Finance style */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 180,
        zIndex: 10
      }}>
        {/* Quote mark — chunky sans double-quote in accent */}
        <div style={{
          fontFamily: FONT_SANS, fontWeight: 900,
          lineHeight: 0.6, color: accent,
          marginBottom: 26, letterSpacing: -8, height: "64px", fontSize: "180px"
        }}>“</div>

        {/* Quote text — huge bold sans, Yahoo scale (auto-fits 46–68px) */}
        <AutoFitHeadline
          text={data.quote}
          maxSize={68} minSize={46} maxLines={6}
          styleOverrides={{ margin: '0 0 22px', letterSpacing: -1 }} />

        {/* Attribution — accent author, accent role separated by | (Yahoo style) */}
        <div style={{
          fontFamily: FONT_SANS, fontSize: 34, fontWeight: 700,
          lineHeight: 1.25, marginBottom: data.quoteContext ? 8 : 0
        }}>
          <span style={{ color: accent }}>{data.quoteAuthor}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, margin: '0 10px' }}>|</span>
          <span style={{ fontWeight: 400, color: accent }}>{data.quoteRole}</span>
        </div>

        {/* Optional context line — white, slightly smaller */}
        {data.quoteContext &&
          <div style={{
            fontFamily: FONT_SANS, fontSize: 26, fontWeight: 400,
            color: 'rgba(255,255,255,0.75)', lineHeight: 1.3
          }}>{data.quoteContext}</div>
        }
      </div>

      {/* Footer — logo bottom-right (no source line on photo-led cards) */}
      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 28, zIndex: 10,
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center'
      }}>
        <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
          <TrueRateMark color={C.lime} size={64} />
        </span>
      </div>
    </div>
  );
}

export function QuoteBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy
    }}>
      {/* Top photo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 840 }}>
        <PhotoPlaceholder variant="portrait" label="Subject portrait" imageUrl={data.quoteImage} objectPosition={`center ${data.quoteImagePosY ?? 20}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(243,240,232,0.15) 100%)'
        }} />

      </div>

      {/* Quote below */}
      <div style={{
        position: 'absolute', top: 840, left: 0, right: 0, bottom: 0,
        padding: '40px 48px 44px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 22,
            letterSpacing: 3, textTransform: 'uppercase',
            color: C.navy, fontWeight: 700,
            background: C.lime, padding: '12px 22px',
            display: 'inline-block', marginBottom: 22
          }}>ON {data.category.toUpperCase()}</div>

          <p style={{
            fontFamily: FONT_SANS,
            fontSize: 46, fontWeight: 800,
            lineHeight: 1.12, letterSpacing: -1,
            color: C.navy,
            fontStyle: 'italic',
            textWrap: 'balance',
            position: 'relative',
            paddingLeft: 30,
            borderLeft: `6px solid ${C.lime}`
          }}>{data.quote}</p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 20, borderTop: `3px double ${C.navy}`
        }}>
          <div>
            <div style={{
              fontFamily: FONT_SANS, fontSize: 30, fontWeight: 800,
              color: C.navy, letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 4
            }}>{data.quoteAuthor}</div>
            <div style={{
              fontFamily: FONT_SANS, fontSize: 20, fontWeight: 600,
              color: 'rgba(5,13,17,0.7)', letterSpacing: 1.5, textTransform: 'uppercase'
            }}>{data.quoteRole}</div>
          </div>
          <span style={{
            fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700,
            fontStyle: 'italic', color: C.navy
          }}>truerateliberia.com</span>
        </div>
      </div>
    </div>
  );
}
