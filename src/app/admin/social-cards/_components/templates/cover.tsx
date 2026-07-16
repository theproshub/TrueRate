import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 10. VIDEO COVER — 1080×1920 vertical (Reels / TikTok / Shorts)
// ═══════════════════════════════════════════════════════════
export function CoverTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* Full-bleed vertical photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="portrait" label="Cover image" imageUrl={data.coverImage} objectPosition={`center ${data.coverImagePosY ?? 30}%`} bw={data.bwPhoto} />
        {/* Vertical scrim — legible header top, strong base for headline */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(6,14,20,0.6) 0%, rgba(6,14,20,0.15) 24%, rgba(6,14,20,0.1) 46%, rgba(6,14,20,0.92) 100%)'
        }} />
      </div>

      {/* Header — category + mark */}
      <div style={{
        position: 'absolute', top: 64, left: 64, right: 64, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <MonoChip>{data.category}</MonoChip>
        <TrueRateMark color={C.lime} size={64} />
      </div>

      {/* Headline + play CTA pinned to the base */}
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 180, zIndex: 10 }}>
        <AutoFitHeadline text={data.coverTitle} maxSize={100} minSize={60} maxLines={5} styleOverrides={{ margin: '0 0 44px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <span style={{
            width: 84, height: 84, background: C.lime, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="#050d11"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 26,
            letterSpacing: 2, textTransform: 'uppercase', color: '#fff'
          }}>Watch · truerateliberia.com</span>
        </div>
      </div>
    </div>
  );
}

export function CoverBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy
    }}>
      {/* Top — tall vertical photo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1180, overflow: 'hidden' }}>
        <PhotoPlaceholder variant="portrait" label="Cover image" imageUrl={data.coverImage} objectPosition={`center ${data.coverImagePosY ?? 30}%`} bw={data.bwPhoto} />
        <div style={{ position: 'absolute', bottom: 32, left: 48 }}>
          <MonoChip>{data.category}</MonoChip>
        </div>
      </div>

      {/* Bottom paper panel — headline + watch CTA + mark */}
      <div style={{
        position: 'absolute', top: 1180, left: 0, right: 0, bottom: 0,
        padding: '60px 64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <AutoFitHeadline text={data.coverTitle} maxSize={80} minSize={52} maxLines={5}
          styleOverrides={{ color: C.navy, margin: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{
              width: 64, height: 64, background: C.navy, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#BFEA36"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span style={{
              fontFamily: FONT_MONO, fontSize: 22,
              letterSpacing: 2, textTransform: 'uppercase'
            }}>Watch · truerateliberia.com</span>
          </div>
          <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
            <TrueRateMark color={C.navy} size={54} />
          </span>
        </div>
      </div>
    </div>
  );
}
