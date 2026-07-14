import type { ReactNode } from 'react';
import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, CardFooter, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 8. EXPLAINER — swipe carousel (cover + 3 points + outro)
// ═══════════════════════════════════════════════════════════
function ExplainerCore({ data, dark }: { data: CardTweaks; dark: boolean }) {
  const fg = dark ? '#fff' : C.navy;
  const sub = dark ? 'rgba(255,255,255,0.7)' : 'rgba(5,13,17,0.75)';
  const slide = Math.max(0, Math.min(4, Number(data.explainerSlide) || 0));
  const points = [
    { t: data.ex1Title, b: data.ex1Body },
    { t: data.ex2Title, b: data.ex2Body },
    { t: data.ex3Title, b: data.ex3Body }
  ];

  const frame = (children: ReactNode) =>
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: dark ? C.navy : C.paper, fontFamily: FONT_SANS, color: fg
    }}>
      {/* header */}
      <div style={{
        position: 'absolute', top: 48, left: 48, right: 48, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <MonoChip>Explainer</MonoChip>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 24,
          letterSpacing: 2, color: dark ? 'rgba(255,255,255,0.55)' : 'rgba(5,13,17,0.55)'
        }}>{slide === 0 ? '' : `${slide} / 4`}</span>
      </div>
      {children}
    </div>;

  if (slide === 0) {
    // COVER
    return frame(
      <>
        {dark &&
          <div style={{ position: 'absolute', inset: 0 }}>
            <PhotoPlaceholder variant="tech" label="Cover image" imageUrl={data.explainerImage} objectPosition={`center ${data.explainerImagePosY ?? 50}%`} bw={data.bwPhoto} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,14,20,0.55) 0%, rgba(6,14,20,0.35) 40%, rgba(6,14,20,0.92) 100%)' }} />
          </div>
        }
        <div style={{ position: 'absolute', left: 48, right: 60, bottom: 150, zIndex: 10 }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 24,
            letterSpacing: 4, textTransform: 'uppercase', color: C.lime,
            fontWeight: 700, marginBottom: 20
          }}>What it means for you</div>
          <AutoFitHeadline text={data.explainerTitle} maxSize={78} minSize={50} maxLines={4}
            styleOverrides={{ margin: '0 0 30px', color: dark ? '#fff' : C.navy }} />
          <div style={{
            fontFamily: FONT_MONO, fontSize: 24,
            letterSpacing: 2, textTransform: 'uppercase', color: dark ? '#fff' : C.navy
          }}>Swipe →</div>
        </div>
        <CardFooter credit="truerateliberia.com" dark={dark} />
      </>
    );
  }

  if (slide <= 3) {
    // POINT slides
    const p = points[slide - 1] || { t: '', b: '' };
    return frame(
      <>
        <div style={{ position: 'absolute', left: 48, right: 60, top: 210, bottom: 150, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 220, fontWeight: 800, lineHeight: 0.9, letterSpacing: -8,
            color: C.lime, marginBottom: 40,
            WebkitTextStroke: dark ? 'none' : `2px ${C.navy}`
          }}>{String(slide).padStart(2, '0')}</div>
          <h2 style={{
            fontSize: 58, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1,
            textWrap: 'balance', margin: '0 0 28px', color: fg
          }}>{p.t}</h2>
          <p style={{
            fontSize: 32, lineHeight: 1.5, color: sub, textWrap: 'pretty', margin: 0
          }}>{p.b}</p>
        </div>
        <CardFooter credit="truerateliberia.com" dark={dark} />
      </>
    );
  }

  // OUTRO
  return frame(
    <>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 100px'
      }}>
        <TrueRateMark color={dark ? C.lime : C.navy} size={64} />
        <h2 style={{
          fontSize: 54, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1,
          textWrap: 'balance', margin: '40px 0 24px', color: fg
        }}>{data.explainerCTA}</h2>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 26,
          letterSpacing: 3, textTransform: 'uppercase', color: C.lime,
          background: dark ? 'transparent' : C.navy, padding: dark ? 0 : '10px 22px',
          fontWeight: 700
        }}>@truerateliberia</div>
      </div>
    </>
  );
}
export function ExplainerTerminal({ data }: { data: CardTweaks }) { return <ExplainerCore data={data} dark={true} />; }
export function ExplainerBroadsheet({ data }: { data: CardTweaks }) { return <ExplainerCore data={data} dark={false} />; }
