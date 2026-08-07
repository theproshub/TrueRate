import type { ReactNode } from 'react';
import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, CardFooter, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
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
    { t: data.ex1Title, b: data.ex1Body, img: data.ex1Image, posY: data.ex1ImagePosY },
    { t: data.ex2Title, b: data.ex2Body, img: data.ex2Image, posY: data.ex2ImagePosY },
    { t: data.ex3Title, b: data.ex3Body, img: data.ex3Image, posY: data.ex3ImagePosY }
  ];

  const frame = (children: ReactNode) =>
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: (data.explainerBg || '').trim() || (dark ? C.navy : C.paper),
      fontFamily: FONT_SANS, color: fg
    }}>
      {children}
    </div>;

  if (slide === 0) {
    // COVER — kept as-is (hook hero + optional subhead).
    const hook = (data.explainerHook || '').trim();
    const coverTitle = (data.explainerTitle || '').trim();
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
            fontWeight: 700, marginBottom: 22
          }}>What it means for you</div>
          {hook
            ? <>
                {/* Hook is the scroll-stopper hero; cover title drops to a subhead. */}
                <AutoFitHeadline text={hook} maxSize={82} minSize={46} maxLines={4}
                  styleOverrides={{ margin: '0 0 20px', color: dark ? '#fff' : C.navy }} />
                {coverTitle &&
                  <div style={{
                    fontSize: 30, lineHeight: 1.35, color: sub, textWrap: 'pretty',
                    margin: '0 0 32px', maxWidth: 900
                  }}>{coverTitle}</div>
                }
              </>
            : <AutoFitHeadline text={coverTitle} maxSize={78} minSize={50} maxLines={4}
                styleOverrides={{ margin: '0 0 32px', color: dark ? '#fff' : C.navy }} />
          }
        </div>
        <CardFooter credit="truerateliberia.com" dark={dark} />
      </>
    );
  }

  if (slide <= 3) {
    // POINT slides — Instagram/Yahoo style: title + body joined into one
    // same-size bold block, bottom-anchored, no divider. When an image is set
    // it goes full-bleed behind a bottom-weighted gradient (like breaking /
    // article) and the text switches to white for legibility.
    const p = points[slide - 1] || { t: '', b: '', img: '', posY: 50 };
    const hasImg = !!(p.img || '').trim();
    const customBg = (data.explainerBg || '').trim();
    // Terminal points take the article/breaking photo+gradient background by
    // default (placeholder when no image); a set image always shows. A chosen
    // solid color overrides the photo. Broadsheet stays on the paper bg.
    const showPhoto = !customBg && (dark || hasImg);
    const overDark = showPhoto || (dark && !!customBg);
    const titleColor = overDark ? '#fff' : fg;
    const bodyColor = overDark ? 'rgba(255,255,255,0.88)' : 'rgba(5,13,17,0.86)';
    const t = (p.t || '').trim();
    const b = (p.b || '').trim();
    // Only join title→body with a separator when both exist; a title-only point
    // (the common case once points are seeded from the hook bank) shows clean.
    const sep = /[.!?]$/.test(t) ? ' ' : '. ';
    return frame(
      <>
        {showPhoto &&
          <div style={{ position: 'absolute', inset: 0 }}>
            <PhotoPlaceholder variant="finance" label="Explainer image" imageUrl={p.img} objectPosition={`center ${p.posY ?? 50}%`} bw={data.bwPhoto} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,14,20,0.55) 0%, rgba(6,14,20,0.25) 40%, rgba(6,14,20,0.85) 100%)' }} />
          </div>
        }
        <div style={{ position: 'absolute', left: 56, right: 64, bottom: 150, zIndex: 10 }}>
          <p style={{
            fontSize: 44, lineHeight: 1.4, letterSpacing: -0.5,
            textWrap: 'pretty', margin: 0, color: titleColor
          }}>
            <span style={{ fontWeight: 800 }}>{t ? (b ? t + sep : t) : ''}</span>
            <span style={{ fontWeight: 800, color: bodyColor }}>{b}</span>
          </p>
        </div>
        <CardFooter credit="truerateliberia.com" dark={overDark ? true : dark} />
      </>
    );
  }

  // OUTRO — text-only on the solid/variant bg by default; a set image goes
  // full-bleed behind a centered darkening overlay and the text turns white.
  const outroImg = (data.explainerOutroImage || '').trim();
  const outroOverDark = !!outroImg || dark;
  const outroFg = outroOverDark ? '#fff' : C.navy;
  return frame(
    <>
      {outroImg &&
        <div style={{ position: 'absolute', inset: 0 }}>
          <PhotoPlaceholder variant="finance" label="Outro image" imageUrl={outroImg} objectPosition={`center ${data.explainerOutroImagePosY ?? 50}%`} bw={data.bwPhoto} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,14,20,0.78) 0%, rgba(6,14,20,0.6) 50%, rgba(6,14,20,0.85) 100%)' }} />
        </div>
      }
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 100px'
      }}>
        <TrueRateMark color={outroOverDark ? C.lime : C.navy} size={64} />
        <h2 style={{
          fontSize: 54, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1,
          textWrap: 'balance', margin: '40px 0 24px', color: outroFg
        }}>{data.explainerCTA}</h2>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 26,
          letterSpacing: 3, textTransform: 'uppercase', color: C.lime,
          background: outroOverDark ? 'transparent' : C.navy, padding: outroOverDark ? 0 : '10px 22px',
          fontWeight: 700
        }}>@truerateliberia</div>
      </div>
    </>
  );
}
export function ExplainerTerminal({ data }: { data: CardTweaks }) { return <ExplainerCore data={data} dark={true} />; }
export function ExplainerBroadsheet({ data }: { data: CardTweaks }) { return <ExplainerCore data={data} dark={false} />; }
