import { AutoFitHeadline, PhotoPlaceholder, TrueRateMark, CardFooter, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 7. EVENT / ANNOUNCEMENT
// ═══════════════════════════════════════════════════════════
export function EventTerminal({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="finance" label="Event image" imageUrl={data.eventImage} objectPosition={`center ${data.eventImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(6,14,20,0.5) 0%, rgba(6,14,20,0.25) 35%, rgba(6,14,20,0.9) 70%, rgba(6,14,20,0.97) 100%)'
        }} />
      </div>

      <div style={{ position: 'absolute', top: 48, left: 48, right: 48, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MonoChip>{data.eventKind}</MonoChip>
        <TrueRateMark color={C.lime} size={64} />
      </div>

      <div style={{ position: 'absolute', left: 48, right: 60, bottom: 150, zIndex: 10 }}>
        <AutoFitHeadline text={data.eventTitle} maxSize={78} minSize={50} maxLines={3} styleOverrides={{ margin: '0 0 34px' }} />

        {/* Details rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 8 }}>
          {[
            data.eventDate && (data.eventTime ? `${data.eventDate}  ·  ${data.eventTime}` : data.eventDate),
            data.eventVenue
          ].filter(Boolean).map((row, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 10, height: 10, background: '#FFFFFF', display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{
                fontFamily: FONT_MONO, fontSize: 26,
                letterSpacing: 1, color: '#fff'
              }}>{row}</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter credit={data.eventCTA} dark={true} hideMark={true} />
    </div>
  );
}

export function EventBroadsheet({ data }: { data: CardTweaks }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 840 }}>
        <PhotoPlaceholder variant="finance" label="Event image" imageUrl={data.eventImage} objectPosition={`center ${data.eventImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{ position: 'absolute', top: 44, right: 48, zIndex: 10 }}>
          <TrueRateMark color={C.lime} size={64} />
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: 44 }}>
          <MonoChip>{data.eventKind}</MonoChip>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 840, left: 0, right: 0, bottom: 0,
        padding: '44px 48px 40px', display: 'flex', flexDirection: 'column'
      }}>
        <AutoFitHeadline text={data.eventTitle} maxSize={64} minSize={42} maxLines={3}
          styleOverrides={{ color: C.navy, margin: '0 0 30px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            data.eventDate && (data.eventTime ? `${data.eventDate}  ·  ${data.eventTime}` : data.eventDate),
            data.eventVenue
          ].filter(Boolean).map((row, i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 10, height: 10, background: '#000000', outline: `1px solid ${C.navy}`, display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 1 }}>{row}</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter credit={data.eventCTA} dark={false} hideMark={true} />
    </div>
  );
}
