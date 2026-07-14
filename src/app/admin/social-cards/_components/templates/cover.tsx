import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 10. VIDEO COVER — 1920×1080 thumbnail (YouTube / video posts)
// ═══════════════════════════════════════════════════════════
export function CoverTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1920, height: 1080, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="portrait" label="Cover image" imageUrl={data.coverImage} objectPosition={`center ${data.coverImagePosY ?? 30}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(6,14,20,0.95) 0%, rgba(6,14,20,0.75) 38%, rgba(6,14,20,0.1) 70%, rgba(6,14,20,0) 100%)'
        }} />
      </div>

      <div style={{
        position: 'absolute', left: 80, top: 0, bottom: 0, width: 880, zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <MonoChip style={{ alignSelf: 'flex-start', marginBottom: 34 }}>{data.category}</MonoChip>
        <AutoFitHeadline text={data.coverTitle} maxSize={92} minSize={60} maxLines={4} styleOverrides={{ margin: '0 0 40px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* play affordance */}
          <span style={{
            width: 74, height: 74, background: C.lime, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#050d11"><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 24,
            letterSpacing: 2, textTransform: 'uppercase', color: '#fff'
          }}>Watch · truerateliberia.com</span>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 80, bottom: 26, zIndex: 10 }}>
        <TrueRateMark color={C.lime} size={64} />
      </div>
    </div>
  );
}

export function CoverBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1920, height: 1080, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy,
      display: 'grid', gridTemplateColumns: '820px 1fr'
    }}>
      {/* Left panel */}
      <div style={{ padding: '70px 70px 60px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <MonoChip style={{ alignSelf: 'flex-start' }}>{data.category}</MonoChip>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AutoFitHeadline text={data.coverTitle} maxSize={80} minSize={52} maxLines={5}
            styleOverrides={{ color: C.navy, margin: 0 }} />
        </div>
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
      {/* Right image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <PhotoPlaceholder variant="portrait" label="Cover image" imageUrl={data.coverImage} objectPosition={`center ${data.coverImagePosY ?? 30}%`} bw={data.bwPhoto} />
      </div>
    </div>
  );
}
