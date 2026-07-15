import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 2. ARTICLE — Forbes style
// ═══════════════════════════════════════════════════════════
export function ArticleTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* Full bleed photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="portrait" label="Subject portrait" imageUrl={data.articleImage} objectPosition={`center ${data.articleImagePosY ?? 30}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0, background: "linear-gradient(rgba(6, 14, 20, 0.3) 0%, rgba(6, 14, 20, 0) 30%, rgba(6, 14, 20, 0.7) 60%, rgba(6, 14, 20, 0.95) 100%) center center / auto"

        }} />
      </div>

      {/* Bottom block — newsroom style Inter headline */}
      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 28, zIndex: 10
      }}>
        <AutoFitHeadline text={data.articleTitle} />

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
    </div>
  );
}

export function ArticleBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#fff', fontFamily: FONT_SANS
    }}>
      {/* Top — full photo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 870 }}>
        <PhotoPlaceholder variant="tech" label="Feature photo" imageUrl={data.articleImage} objectPosition={`center ${data.articleImagePosY ?? 30}%`} bw={data.bwPhoto} />
        {/* Gradient bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 20%, transparent 60%, rgba(0,0,0,0.7) 100%)'
        }} />

        {/* Forbes-style headline + excerpt OVER bottom of image */}
        <div style={{
          position: 'absolute', bottom: 36, left: 44, right: 44, zIndex: 10, color: '#fff'
        }}>
          <h1 style={{
            fontFamily: FONT_SANS,
            fontSize: 50, fontWeight: 800,
            lineHeight: 1.12, letterSpacing: -1,
            textWrap: 'balance',
            marginBottom: 14,
            textShadow: '0 2px 20px rgba(0,0,0,0.4)'
          }}>{data.articleTitle}</h1>
        </div>
      </div>

      {/* Bottom white — excerpt + category meta */}
      <div style={{
        position: 'absolute', top: 870, left: 0, right: 0, bottom: 0,
        background: C.paper,
        padding: '40px 44px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <p style={{
          fontSize: 26, lineHeight: 1.5,
          color: '#000000E0',
          textWrap: 'pretty'
        }}>{data.articleExcerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            fontFamily: FONT_MONO,
            fontSize: 22, letterSpacing: 3, textTransform: 'uppercase',
            color: C.navy, fontWeight: 700,
            background: C.lime, padding: '12px 22px'
          }}>{data.category}</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(5,13,17,0.15)' }} />
          <div style={{
            fontFamily: FONT_MONO, fontSize: 20,
            color: 'rgba(5,13,17,0.5)', letterSpacing: 2, textTransform: 'uppercase'
          }}>{data.articleReadTime} read</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 20,
            color: 'rgba(5,13,17,0.55)', letterSpacing: 2, textTransform: 'uppercase'
          }}>{data.date} · truerateliberia.com</span>
          <span style={{
            fontFamily: FONT_SANS, fontSize: 24, fontWeight: 700,
            fontStyle: 'italic', color: C.navy
          }}>Liberia&apos;s Financial Intelligence Platform</span>
        </div>
      </div>
    </div>
  );
}
