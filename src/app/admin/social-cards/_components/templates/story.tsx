import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 9. STORY — 1080×1920 vertical (IG/FB story, WhatsApp status, TikTok)
// ═══════════════════════════════════════════════════════════
function StoryCore({ data, dark }: { data: CardTweaks; dark: boolean }) {
  const hook = (data.storyHook || '').trim();
  const headline = (data.headline || '').trim();
  return (
    <div style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="finance" label="Story image" imageUrl={data.storyImage} objectPosition={`center ${data.storyImagePosY ?? 40}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: dark ?
            'linear-gradient(180deg, rgba(6,14,20,0.6) 0%, rgba(6,14,20,0.15) 30%, rgba(6,14,20,0.4) 55%, rgba(6,14,20,0.95) 85%)' :
            'linear-gradient(180deg, rgba(6,14,20,0.65) 0%, rgba(6,14,20,0.2) 35%, rgba(6,14,20,0.85) 72%, rgba(6,14,20,0.97) 100%)'
        }} />
      </div>

      {/* Top: logo + chip */}
      <div style={{
        position: 'absolute', top: 120, left: 56, right: 56, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <MonoChip>{`Breaking · ${data.category}`}</MonoChip>
        <TrueRateMark color={C.lime} size={54} />
      </div>

      {/* Hook + headline lower third — hook is the scroll-stopper hero (mirrors
          the explainer cover); when set, the headline drops to a subhead. */}
      <div style={{ position: 'absolute', left: 56, right: 70, bottom: 330, zIndex: 10 }}>
        {hook
          ? <>
              <AutoFitHeadline text={hook} maxSize={92} minSize={56} maxLines={5}
                styleOverrides={{ margin: headline ? '0 0 22px' : 0 }} />
              {headline &&
                <div style={{
                  fontFamily: FONT_SANS, fontSize: 34, lineHeight: 1.35,
                  color: 'rgba(255,255,255,0.82)', textWrap: 'pretty', margin: 0
                }}>{headline}</div>
              }
            </>
          : <AutoFitHeadline text={headline} maxSize={92} minSize={60} maxLines={5} styleOverrides={{ margin: 0 }} />
        }
      </div>

      {/* Bottom CTA — no source line on photo-led cards */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 140, zIndex: 10,
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 24,
          letterSpacing: 2, textTransform: 'uppercase',
          color: C.navy, background: C.lime, padding: '12px 24px', fontWeight: 700
        }}>Full story · truerateliberia.com</span>
      </div>
    </div>
  );
}
export function StoryTerminal({ data }: { data: CardTweaks }) { return <StoryCore data={data} dark={true} />; }
export function StoryBroadsheet({ data }: { data: CardTweaks }) { return <StoryCore data={data} dark={false} />; }
