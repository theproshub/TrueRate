import { PhotoPlaceholder, CardFooter, MonoChip, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

// ═══════════════════════════════════════════════════════════
// 6. DAILY RATE — recurring exchange-rate card
// ═══════════════════════════════════════════════════════════
function RateCore({ data, dark }: { data: CardTweaks; dark: boolean }) {
  const fg = dark ? '#fff' : C.navy;
  const sub = dark ? 'rgba(255,255,255,0.6)' : 'rgba(5,13,17,0.6)';
  const boxBorder = dark ? 'rgba(255,255,255,0.16)' : 'rgba(5,13,17,0.2)';
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: dark ? C.navy : C.paper, fontFamily: FONT_SANS, color: fg
    }}>
      {dark &&
        <div style={{ position: 'absolute', inset: 0 }}>
          <PhotoPlaceholder variant="abstract" label="Backdrop" imageUrl={data.rateImage} objectPosition={`center ${data.rateImagePosY ?? 50}%`} bw={data.bwPhoto} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,13,17,0.93) 0%, rgba(5,13,17,0.98) 100%)' }} />
        </div>
      }

      <div style={{ position: 'absolute', inset: 0, zIndex: 10, padding: 48, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 22, borderBottom: dark ? '1px solid rgba(255,255,255,0.14)' : `3px double ${C.navy}`
        }}>
          <MonoChip>Daily Rate</MonoChip>
          <span style={{
            fontFamily: FONT_MONO, fontSize: 24,
            letterSpacing: 2, textTransform: 'uppercase', color: sub
          }}>{data.rateDate}</span>
        </div>

        {/* Big rate */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 26,
            letterSpacing: 5, textTransform: 'uppercase',
            color: dark ? C.lime : C.navy, fontWeight: 700, marginBottom: 20
          }}>USD → LRD</div>

          <div style={{
            fontSize: 250, fontWeight: 800, lineHeight: 0.9,
            letterSpacing: -10, color: dark ? C.lime : C.navy, marginBottom: 26
          }}>{data.rateValue}</div>

          <div style={{
            fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700,
            color: data.rateUp ? (dark ? C.lime : '#2c7a3f') : C.red, marginBottom: 52
          }}>{data.rateUp ? '▲' : '▼'} {data.rateChange} vs yesterday</div>

          {/* Buy / Sell */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { l: 'Bank Buying', v: data.rateBuy },
              { l: 'Bank Selling', v: data.rateSell }
            ].map((b) =>
              <div key={b.l} style={{ border: `1px solid ${boxBorder}`, padding: '26px 30px' }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 22,
                  letterSpacing: 2.5, textTransform: 'uppercase', color: sub, marginBottom: 12
                }}>{b.l}</div>
                <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1, letterSpacing: -1 }}>{b.v}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ height: 60 }} />
      </div>
      <CardFooter credit="Source · Central Bank of Liberia" dark={dark} />
    </div>
  );
}
export function RateTerminal({ data }: { data: CardTweaks }) { return <RateCore data={data} dark={true} />; }
export function RateBroadsheet({ data }: { data: CardTweaks }) { return <RateCore data={data} dark={false} />; }
