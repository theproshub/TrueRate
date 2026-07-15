import { PhotoPlaceholder, TrueRateMark, TR_COLORS, FONT_SANS, FONT_MONO } from './shared';
import type { CardTweaks } from './types';

const C = TR_COLORS;

function MarketRow({ label, value, change, up, dark, last }: {
  label: string; value: string; change: string; up: boolean; dark: boolean; last: boolean;
}) {
  const color = up ? C.green : C.red;
  const borderC = dark ? 'rgba(255,255,255,0.1)' : 'rgba(5,13,17,0.1)';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto',
      alignItems: 'baseline', gap: 18,
      padding: '18px 0',
      borderBottom: last ? 'none' : `1px solid ${borderC}`
    }}>
      <div style={{
        fontFamily: FONT_SANS, fontSize: 30, fontWeight: 700,
        color: dark ? '#fff' : C.navy
      }}>{label}</div>
      <div style={{
        fontFamily: FONT_SANS, fontSize: 48, fontWeight: 700,
        color: dark ? '#fff' : C.navy, lineHeight: 1
      }}>{value}</div>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700,
        color: color, minWidth: 130, textAlign: 'right'
      }}>{up ? '▲' : '▼'} {change}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 5. MARKETS SNAPSHOT — Bloomberg ticker style over image
// ═══════════════════════════════════════════════════════════
export function MarketsTerminal({ data }: { data: CardTweaks }) {
  const markets = [
    { label: data.market1Label, value: data.market1Value, change: data.market1Change, up: data.market1Up },
    { label: data.market2Label, value: data.market2Value, change: data.market2Change, up: data.market2Up },
    { label: data.market3Label, value: data.market3Value, change: data.market3Change, up: data.market3Up },
    { label: data.market4Label, value: data.market4Value, change: data.market4Change, up: data.market4Up }];

  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: FONT_SANS, color: '#fff'
    }}>
      {/* subtle photo backdrop */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="abstract" label="Markets backdrop" imageUrl={data.marketsImage} objectPosition={`center ${data.marketsImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(5,13,17,0.92) 0%, rgba(5,13,17,0.98) 100%)'
        }} />
      </div>

      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'grid', gridTemplateRows: '80px auto 1fr 80px'
      }}>
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px'
        }}>
          <TrueRateMark color={C.lime} size={64} />
          <div style={{
            fontFamily: FONT_MONO, fontSize: 20,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)'
          }}>{data.marketDate}</div>
        </div>

        <div style={{ padding: '44px 48px 28px' }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 22,
            letterSpacing: 4, textTransform: 'uppercase',
            color: '#F3F4F4', marginBottom: 18, fontWeight: 600
          }}><span style={{ color: C.green }}>▲</span> MARKETS · LIVE CLOSE</div>
          <h1 style={{
            fontFamily: FONT_SANS, fontSize: 54, fontWeight: 800,
            lineHeight: 1.05, letterSpacing: -1, textWrap: 'balance'
          }}>Liberia &amp; West Africa</h1>
        </div>

        <div style={{ padding: '0 48px', display: 'flex', flexDirection: 'column' }}>
          {markets.map((m, i) =>
            <MarketRow key={i} {...m} dark={true} last={i === markets.length - 1} />
          )}
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 48px'
        }}>
          <span style={{
            fontFamily: FONT_SANS,
            letterSpacing: 0.5, textTransform: 'uppercase',
            color: '#fff',
            display: 'block', lineHeight: 1,
            whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
          }}>Source · CBL · Yahoo Finance · TrueRate</span>
        </div>
      </div>
    </div>
  );
}

export function MarketsBroadsheet({ data }: { data: CardTweaks }) {
  const markets = [
    { label: data.market1Label, value: data.market1Value, change: data.market1Change, up: data.market1Up },
    { label: data.market2Label, value: data.market2Value, change: data.market2Change, up: data.market2Up },
    { label: data.market3Label, value: data.market3Value, change: data.market3Change, up: data.market3Up },
    { label: data.market4Label, value: data.market4Value, change: data.market4Change, up: data.market4Up }];

  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: FONT_SANS, color: C.navy
    }}>
      <div style={{
        padding: '40px 48px 22px',
        borderBottom: `3px double ${C.navy}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <TrueRateMark color={C.navy} size={64} />
        <div style={{
          fontFamily: FONT_MONO, fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(5,13,17,0.55)'
        }}>Markets · {data.marketDate}</div>
      </div>

      <div style={{ padding: '30px 48px 10px' }}>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 22,
          letterSpacing: 3, textTransform: 'uppercase',
          color: C.navy, fontWeight: 700,
          background: C.lime, padding: '12px 22px',
          display: 'inline-block', marginBottom: 18
        }}>Market Snapshot</div>
        <h1 style={{
          fontFamily: FONT_SANS, fontSize: 60, fontWeight: 800,
          lineHeight: 1.05, letterSpacing: -1, fontStyle: 'italic',
          textWrap: 'balance'
        }}>Liberia &amp; West Africa</h1>
      </div>

      <div style={{ padding: '24px 48px 0' }}>
        {markets.map((m, i) =>
          <MarketRow key={i} {...m} dark={false} last={i === markets.length - 1} />
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: FONT_SANS,
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: C.navy,
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · Yahoo Finance · TrueRate</span>
      </div>
    </div>
  );
}
