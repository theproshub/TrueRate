// TrueRate Social Templates — Expansion pack
// Daily Rate · Event · Explainer carousel · Story (1080×1920) · Video Cover (1920×1080)
// Uses window globals from tr_templates.jsx: TR_COLORS, AutoFitHeadline, PhotoPlaceholder, TrueRateMark

const C = window.TR_COLORS;

// Shared footer: credit left, mark right
function CardFooter({ credit, dark = true, left = 48, right = 48, bottom = 28, hideMark = false }) {
  return (
    <div style={{
      position: 'absolute', left: left, right: right, bottom: bottom, zIndex: 10,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <span style={{
        fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
        color: dark ? '#fff' : C.navy, lineHeight: 1,
        whiteSpace: 'nowrap', fontSize: '30px', fontWeight: '400', display: 'block'
      }}>{credit}</span>
      {!hideMark && <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
        <TrueRateMark color={dark ? C.lime : C.navy} size={64} />
      </span>}
    </div>);

}

function MonoChip({ children, style }) {
  return (
    <div style={{
      background: C.lime, color: C.navy,
      padding: '12px 22px', display: 'inline-block',
      fontFamily: 'Roboto Mono, monospace',
      fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700,
      ...style
    }}>{children}</div>);

}

// ═══════════════════════════════════════════════════════════
// 6. DAILY RATE — recurring exchange-rate card
// ═══════════════════════════════════════════════════════════
function RateCore({ data, dark }) {
  const fg = dark ? '#fff' : C.navy;
  const sub = dark ? 'rgba(255,255,255,0.6)' : 'rgba(5,13,17,0.6)';
  const boxBorder = dark ? 'rgba(255,255,255,0.16)' : 'rgba(5,13,17,0.2)';
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: dark ? C.navy : C.paper, fontFamily: 'Inter, sans-serif', color: fg
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
            fontFamily: 'Roboto Mono, monospace', fontSize: 24,
            letterSpacing: 2, textTransform: 'uppercase', color: sub
          }}>{data.rateDate}</span>
        </div>

        {/* Big rate */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 26,
            letterSpacing: 5, textTransform: 'uppercase',
            color: dark ? C.lime : C.navy, fontWeight: 700, marginBottom: 20
          }}>USD → LRD</div>

          <div style={{
            fontSize: 250, fontWeight: 800, lineHeight: 0.9,
            letterSpacing: -10, color: dark ? C.lime : C.navy, marginBottom: 26
          }}>{data.rateValue}</div>

          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 26, fontWeight: 700,
            color: data.rateUp ? (dark ? C.lime : '#2c7a3f') : C.red, marginBottom: 52
          }}>{data.rateUp ? '▲' : '▼'} {data.rateChange} vs yesterday</div>

          {/* Buy / Sell */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
            { l: 'Bank Buying', v: data.rateBuy },
            { l: 'Bank Selling', v: data.rateSell }].
            map((b) =>
            <div key={b.l} style={{ border: `1px solid ${boxBorder}`, padding: '26px 30px' }}>
                <div style={{
                fontFamily: 'Roboto Mono, monospace', fontSize: 22,
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
    </div>);

}
function RateTerminal({ data }) {return <RateCore data={data} dark={true} />;}
function RateBroadsheet({ data }) {return <RateCore data={data} dark={false} />;}

// ═══════════════════════════════════════════════════════════
// 7. EVENT / ANNOUNCEMENT
// ═══════════════════════════════════════════════════════════
function EventTerminal({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
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
          data.eventDate && `${data.eventDate}  ·  ${data.eventTime}`,
          data.eventVenue].
          filter(Boolean).map((row, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 10, height: 10, background: '#FFFFFF', display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{
              fontFamily: 'Roboto Mono, monospace', fontSize: 26,
              letterSpacing: 1, color: '#fff'
            }}>{row}</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter credit={data.eventCTA} dark={true} hideMark={true} />
    </div>);

}

function EventBroadsheet({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: 'Inter, sans-serif', color: C.navy
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 700 }}>
        <PhotoPlaceholder variant="finance" label="Event image" imageUrl={data.eventImage} objectPosition={`center ${data.eventImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{ position: 'absolute', top: 44, right: 48, zIndex: 10 }}>
          <TrueRateMark color={C.lime} size={64} />
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: 44 }}>
          <MonoChip>{data.eventKind}</MonoChip>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 700, left: 0, right: 0, bottom: 0,
        padding: '44px 48px 40px', display: 'flex', flexDirection: 'column'
      }}>
        <AutoFitHeadline text={data.eventTitle} maxSize={64} minSize={42} maxLines={3}
        styleOverrides={{ color: C.navy, margin: '0 0 30px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
          data.eventDate && `${data.eventDate}  ·  ${data.eventTime}`,
          data.eventVenue].
          filter(Boolean).map((row, i) =>
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ width: 10, height: 10, background: '#000000', outline: `1px solid ${C.navy}`, display: 'inline-block', flexShrink: 0 }}></span>
              <span style={{ fontFamily: 'Roboto Mono, monospace', fontSize: 24, letterSpacing: 1 }}>{row}</span>
            </div>
          )}
        </div>
      </div>
      <CardFooter credit={data.eventCTA} dark={false} hideMark={true} />
    </div>);

}

// ═══════════════════════════════════════════════════════════
// 8. EXPLAINER — swipe carousel (cover + 3 points + outro)
// ═══════════════════════════════════════════════════════════
function ExplainerCore({ data, dark }) {
  const fg = dark ? '#fff' : C.navy;
  const sub = dark ? 'rgba(255,255,255,0.7)' : 'rgba(5,13,17,0.75)';
  const slide = Math.max(0, Math.min(4, Number(data.explainerSlide) || 0));
  const points = [
  { t: data.ex1Title, b: data.ex1Body },
  { t: data.ex2Title, b: data.ex2Body },
  { t: data.ex3Title, b: data.ex3Body }];


  const frame = (children) =>
  <div style={{
    width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
    background: dark ? C.navy : C.paper, fontFamily: 'Inter, sans-serif', color: fg
  }}>
      {/* header */}
      <div style={{
      position: 'absolute', top: 48, left: 48, right: 48, zIndex: 10,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
        <MonoChip>Explainer</MonoChip>
        <span style={{
        fontFamily: 'Roboto Mono, monospace', fontSize: 24,
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
            fontFamily: 'Roboto Mono, monospace', fontSize: 24,
            letterSpacing: 4, textTransform: 'uppercase', color: C.lime,
            fontWeight: 700, marginBottom: 20
          }}>What it means for you</div>
          <AutoFitHeadline text={data.explainerTitle} maxSize={78} minSize={50} maxLines={4}
          styleOverrides={{ margin: '0 0 30px', color: dark ? '#fff' : C.navy }} />
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 24,
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
          fontFamily: 'Roboto Mono, monospace', fontSize: 26,
          letterSpacing: 3, textTransform: 'uppercase', color: C.lime,
          background: dark ? 'transparent' : C.navy, padding: dark ? 0 : '10px 22px',
          fontWeight: 700
        }}>@truerateliberia</div>
      </div>
    </>
  );
}
function ExplainerTerminal({ data }) {return <ExplainerCore data={data} dark={true} />;}
function ExplainerBroadsheet({ data }) {return <ExplainerCore data={data} dark={false} />;}

// ═══════════════════════════════════════════════════════════
// 9. STORY — 1080×1920 vertical (IG/FB story, WhatsApp status, TikTok)
// ═══════════════════════════════════════════════════════════
function StoryCore({ data, dark }) {
  return (
    <div style={{
      width: 1080, height: 1920, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
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

      {/* Headline lower third */}
      <div style={{ position: 'absolute', left: 56, right: 70, bottom: 330, zIndex: 10 }}>
        <AutoFitHeadline text={data.headline} maxSize={92} minSize={60} maxLines={5} styleOverrides={{ margin: 0 }} />
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 140, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
          color: '#fff', lineHeight: 1, whiteSpace: 'nowrap',
          fontSize: '30px', fontWeight: '400'
        }}>PHOTO: {(data.photoCredit || 'GOOGLE').toUpperCase()}</span>
        <span style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 24,
          letterSpacing: 2, textTransform: 'uppercase',
          color: C.navy, background: C.lime, padding: '12px 24px', fontWeight: 700
        }}>Full story · truerateliberia.com</span>
      </div>
    </div>);

}
function StoryTerminal({ data }) {return <StoryCore data={data} dark={true} />;}
function StoryBroadsheet({ data }) {return <StoryCore data={data} dark={false} />;}

// ═══════════════════════════════════════════════════════════
// 10. VIDEO COVER — 1920×1080 thumbnail (YouTube / video posts)
// ═══════════════════════════════════════════════════════════
function CoverTerminal({ data }) {
  return (
    <div style={{
      width: 1920, height: 1080, position: 'relative', overflow: 'hidden',
      background: C.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
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
            fontFamily: 'Roboto Mono, monospace', fontSize: 24,
            letterSpacing: 2, textTransform: 'uppercase', color: '#fff'
          }}>Watch · truerateliberia.com</span>
        </div>
      </div>

      <div style={{ position: 'absolute', right: 80, bottom: 26, zIndex: 10 }}>
        <TrueRateMark color={C.lime} size={64} />
      </div>
    </div>);

}

function CoverBroadsheet({ data }) {
  return (
    <div style={{
      width: 1920, height: 1080, position: 'relative', overflow: 'hidden',
      background: C.paper, fontFamily: 'Inter, sans-serif', color: C.navy,
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
              fontFamily: 'Roboto Mono, monospace', fontSize: 22,
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
    </div>);

}

// ─── Register ──────────────────────────────────────────────
Object.assign(window.TR_TEMPLATES, {
  rate: { terminal: RateTerminal, broadsheet: RateBroadsheet, label: 'Daily Rate' },
  event: { terminal: EventTerminal, broadsheet: EventBroadsheet, label: 'Event' },
  explainer: { terminal: ExplainerTerminal, broadsheet: ExplainerBroadsheet, label: 'Explainer' },
  story: { terminal: StoryTerminal, broadsheet: StoryBroadsheet, label: 'Story', size: { w: 1080, h: 1920 } },
  cover: { terminal: CoverTerminal, broadsheet: CoverBroadsheet, label: 'Video Cover', size: { w: 1920, h: 1080 } }
});

window.TR_TEMPLATE_SIZES = (type) => window.TR_TEMPLATES[type]?.size || { w: 1080, h: 1350 };
