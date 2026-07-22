// TrueRate Social Templates — Photo-forward redesign
// Inspired by Yahoo Finance / Bloomberg / Forbes full-bleed style

const LOGO_URL = "uploads/Logo 1.png";

// Auto-fit headline: shrinks font-size so the text fits within container width
// across up to `maxLines` lines, between min/max font sizes.
function AutoFitHeadline({ text, children, maxSize = 78, minSize = 54, maxLines = 4, styleOverrides }) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(maxSize);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let s = maxSize;
    el.style.fontSize = s + 'px';
    // shrink until the rendered block fits within maxLines * lineHeight
    const lineHeight = 1.12;
    const fits = () => {
      const lines = el.scrollHeight / (s * lineHeight);
      return lines <= maxLines + 0.1 && el.scrollWidth <= el.clientWidth + 1;
    };
    while (!fits() && s > minSize) {
      s -= 2;
      el.style.fontSize = s + 'px';
    }
    setSize(s);
  }, [text, maxSize, minSize, maxLines]);

  return (
    <h1 ref={ref} style={{
      fontFamily: 'Inter, sans-serif',
      lineHeight: 1.12, letterSpacing: -1,
      color: '#fff', textWrap: 'balance',
      margin: '0 0 40px', fontWeight: 800,
      ...styleOverrides, fontSize: size + 'px'
    }}>{children || text}</h1>);

}

const TR_COLORS = {
  navy: '#050d11', navy2: '#040f18',
  lime: '#BFEA36', cream: '#F3F0E8', paper: '#f8f9fa',
  ink: '#111111', mid: '#8a9aaa',
  red: '#e11b22', green: '#00a757'
};

function Logo({ mode = 'white', size = 28 }) {
  const color = mode === 'white' ? '#fff' : mode === 'navy' ? '#050d11' : '#BFEA36';
  return <span style={{
    fontFamily: 'Inter, sans-serif',
    fontWeight: 900, fontStyle: 'italic',
    fontSize: size * 0.95, color: color,
    letterSpacing: -0.5, lineHeight: 1,
    display: 'inline-block'
  }}>TrueRate</span>;
}

// Wordmark in lime for corner usage
function TrueRateMark({ color = '#BFEA36', size = 22 }) {
  const filter = color === '#050d11' || color === 'navy' ?
  'brightness(0)' :
  color === '#fff' || color === 'white' ?
  'brightness(0) invert(1)' :
  'none'; // lime/default keeps natural lime logo color
  return <img src="uploads/logo-trimmed.png" alt="TrueRate" style={{
    height: 48,
    filter, display: 'block',
    width: "auto", objectFit: "contain"
  }} />;
}

// Rich, dark photo placeholder — falls back to gradient when no image URL
function PhotoPlaceholder({ variant = 'portrait', label = 'Photo', imageUrl, objectPosition = 'center', bw = false }) {
  // Multiple "moody" backgrounds based on variant
  const bgs = {
    portrait: 'radial-gradient(ellipse 60% 80% at 50% 40%, #2a3a4a 0%, #0f1a22 60%, #060d14 100%)',
    tech: 'radial-gradient(ellipse at 30% 40%, #3a1a4a 0%, #1a0a2a 45%, #0a0512 100%)',
    finance: 'radial-gradient(ellipse at 60% 30%, #1a3a4a 0%, #0a1a28 50%, #050a12 100%)',
    industrial: 'radial-gradient(ellipse at 40% 60%, #3a2a1a 0%, #1a1008 50%, #0a0604 100%)',
    abstract: 'linear-gradient(135deg, #0f1e2a 0%, #1a2a3a 40%, #0a1520 100%)'
  };
  const bg = bgs[variant] || bgs.portrait;

  // If a real image URL is provided, render it as a full-bleed background image
  if (imageUrl) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0a0a0a' }}>
        <img src={imageUrl} alt={label} style={{
          width: '100%', height: '100%', objectFit: 'cover',
          objectPosition, display: 'block',
          imageRendering: 'high-quality',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          filter: bw ? 'grayscale(100%) contrast(1.18) brightness(0.96)' : 'none'
        }} />
      </div>);

  }
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      position: 'relative', overflow: 'hidden'
    }}>
      {/* subtle noise-like grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(191,234,54,0.05) 0%, transparent 50%)'
      }} />
      <div style={{
        position: 'absolute', bottom: 12, left: 16,
        fontFamily: 'Roboto Mono, monospace', fontSize: 10,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 2, textTransform: 'uppercase'
      }}>[ {label} ]</div>
    </div>);

}

// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// 1. BREAKING NEWS — Bloomberg IG card style
// ═══════════════════════════════════════════════════════════
function BreakingBroadsheet({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#fff', fontFamily: 'Inter, sans-serif', color: TR_COLORS.navy
    }}>
      {/* Top image half */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 760 }}>
        <PhotoPlaceholder variant="finance" label="News photo" imageUrl={data.breakingImage} objectPosition={`center ${data.breakingImagePosY ?? 50}%`} bw={data.bwPhoto} />
        {/* Category chip */}
        <div style={{
          position: 'absolute', bottom: 28, left: 44, zIndex: 10,
          background: TR_COLORS.lime, color: TR_COLORS.navy,
          padding: '12px 22px',
          fontFamily: 'Roboto Mono, monospace',
          fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700
        }}>BREAKING · {data.category}</div>
      </div>

      {/* Bottom text half */}
      <div style={{
        position: 'absolute', top: 760, left: 0, right: 0, bottom: 0,
        padding: '48px 48px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <AutoFitHeadline
          text={data.headline}
          maxSize={62} minSize={40} maxLines={5}
          styleOverrides={{ color: TR_COLORS.navy, margin: 0 }}>
          {data.headline.split(' ').map((word, i, arr) => {
            const isKey = i > 0 && i < arr.length - 1 && word.length > 5 && i * 7 % 10 > 6;
            return <span key={i} style={{ fontWeight: isKey ? 900 : 400 }}>{word}{i < arr.length - 1 ? ' ' : ''}</span>;
          })}
        </AutoFitHeadline>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 24, paddingTop: 20, borderTop: `2px solid ${TR_COLORS.navy}`
        }}>
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 20,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(5,13,17,0.55)'
          }}>{data.date} · truerateliberia.com</div>
          <TrueRateMark color="#050d11" size={55} />
        </div>
      </div>
    </div>);
}

// LEGACY full-bleed Breaking restored as the primary "Terminal" variant
function BreakingTerminal({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
    }}>
      {/* Full bleed photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="industrial" label="Lead image" imageUrl={data.breakingImage} objectPosition={`center ${data.breakingImagePosY ?? 50}%`} bw={data.bwPhoto} />
        {/* Dark left-to-right gradient for text legibility */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(6,14,20,0.55) 0%, rgba(6,14,20,0.25) 40%, rgba(6,14,20,0.85) 100%)'
        }} />
      </div>


      {/* Eyebrow */}
      <div style={{
        position: 'absolute', top: 230, left: 48, zIndex: 10,
        fontFamily: 'Roboto Mono, monospace',
        letterSpacing: 4, textTransform: 'uppercase',
        color: '#fff', fontWeight: 700, fontSize: "24px"
      }}>
        BREAKING · {data.category}
      </div>

      {/* Headline — Yahoo Finance style: huge, bottom-left */}
      <div style={{ position: 'absolute', left: 48, right: 60, bottom: 150, zIndex: 10 }}>
        <AutoFitHeadline text={data.headline} styleOverrides={{ margin: 0 }} />
      </div>

      {/* Bottom — subtle subtext + brand */}
      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 28,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: '#fff',
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>PHOTO: {(data.photoCredit || 'GOOGLE').toUpperCase()}</span>
        <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
          <TrueRateMark color={TR_COLORS.lime} size={64} />
        </span>
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════
// 2. ARTICLE — Forbes style
// ═══════════════════════════════════════════════════════════
function ArticleTerminal({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
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
            fontFamily: 'Inter, sans-serif',
            letterSpacing: 0.5, textTransform: 'uppercase',
            color: '#fff',
            display: 'block', lineHeight: 1,
            whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
          }}>PHOTO: {(data.photoCredit || 'GOOGLE').toUpperCase()}</span>
          <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
            <TrueRateMark color={TR_COLORS.lime} size={64} />
          </span>
        </div>
      </div>
    </div>);

}

function ArticleBroadsheet({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#fff', fontFamily: 'Inter, sans-serif'
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
            fontFamily: 'Inter, sans-serif',
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
        background: TR_COLORS.paper,
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
            fontFamily: 'Roboto Mono, monospace',
            fontSize: 22, letterSpacing: 3, textTransform: 'uppercase',
            color: TR_COLORS.navy, fontWeight: 700,
            background: TR_COLORS.lime, padding: '12px 22px'
          }}>{data.category}</div>
          <div style={{ flex: 1, height: 1, background: 'rgba(5,13,17,0.15)' }} />
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 20,
            color: 'rgba(5,13,17,0.5)', letterSpacing: 2, textTransform: 'uppercase'
          }}>{data.articleReadTime} read</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 20,
            color: 'rgba(5,13,17,0.55)', letterSpacing: 2, textTransform: 'uppercase'
          }}>{data.date} · truerateliberia.com</span>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 700,
            fontStyle: 'italic', color: TR_COLORS.navy
          }}>Liberia's Financial Intelligence Platform</span>
        </div>
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════
// 3. QUOTE — Yahoo Finance portrait style
// ═══════════════════════════════════════════════════════════
function QuoteTerminal({ data }) {
  const accent = data.quoteAccent || TR_COLORS.lime;
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: '#000', fontFamily: 'Inter, sans-serif', color: '#fff'
    }}>
      {/* Full-bleed portrait photo */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="portrait" label="Subject portrait" imageUrl={data.quoteImage} objectPosition={`center ${data.quoteImagePosY ?? 20}%`} bw={data.bwPhoto} />
        {/* Bottom gradient — strong solid black behind text, soft fade up */}
        <div style={{
          position: 'absolute', inset: 0, background: "linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.95) 70%, rgb(0, 0, 0) 78%, rgb(0, 0, 0) 100%) center center / cover"

        }} />
      </div>

      {/* Quote content — bottom-left, Yahoo Finance style */}
      <div style={{
        position: 'absolute', left: 56, right: 56, bottom: 180,
        zIndex: 10
      }}>
        {/* Quote mark — chunky sans double-quote in accent */}
        <div style={{
          fontFamily: 'Inter, sans-serif', fontWeight: 900,
          lineHeight: 0.6, color: accent,
          marginBottom: 26, letterSpacing: -8, height: "64px", fontSize: "180px"
        }}>“</div>

        {/* Quote text — huge bold sans, Yahoo scale (auto-fits 46–68px) */}
        <AutoFitHeadline
          text={data.quote}
          maxSize={68} minSize={46} maxLines={6}
          styleOverrides={{ margin: '0 0 22px', letterSpacing: -1 }} />

        {/* Attribution — accent author, accent role separated by | (Yahoo style) */}
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 34, fontWeight: 700,
          lineHeight: 1.25, marginBottom: data.quoteContext ? 8 : 0
        }}>
          <span style={{ color: accent }}>{data.quoteAuthor}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, margin: '0 10px' }}>|</span>
          <span style={{ fontWeight: 400, color: accent }}>{data.quoteRole}</span>
        </div>

        {/* Optional context line — white, slightly smaller */}
        {data.quoteContext &&
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 400,
          color: 'rgba(255,255,255,0.75)', lineHeight: 1.3
        }}>{data.quoteContext}</div>
        }
      </div>

      {/* Footer — photo credit bottom-left, logo bottom-right */}
      <div style={{
        position: 'absolute', left: 48, right: 48, bottom: 28, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: '#fff',
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>PHOTO: {(data.photoCredit || 'GOOGLE').toUpperCase()}</span>
        <span style={{ display: 'block', lineHeight: 0, marginBottom: 0 }}>
          <TrueRateMark color={TR_COLORS.lime} size={64} />
        </span>
      </div>
    </div>);

}

function QuoteBroadsheet({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.paper, fontFamily: 'Inter, sans-serif', color: TR_COLORS.navy
    }}>
      {/* Top photo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 760 }}>
        <PhotoPlaceholder variant="portrait" label="Subject portrait" imageUrl={data.quoteImage} objectPosition={`center ${data.quoteImagePosY ?? 20}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(243,240,232,0.15) 100%)'
        }} />
        
      </div>

      {/* Quote below */}
      <div style={{
        position: 'absolute', top: 760, left: 0, right: 0, bottom: 0,
        padding: '40px 48px 44px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 22,
            letterSpacing: 3, textTransform: 'uppercase',
            color: TR_COLORS.navy, fontWeight: 700,
            background: TR_COLORS.lime, padding: '12px 22px',
            display: 'inline-block', marginBottom: 22
          }}>ON {data.category.toUpperCase()}</div>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 46, fontWeight: 800,
            lineHeight: 1.12, letterSpacing: -1,
            color: TR_COLORS.navy,
            fontStyle: 'italic',
            textWrap: 'balance',
            position: 'relative',
            paddingLeft: 30,
            borderLeft: `6px solid ${TR_COLORS.lime}`
          }}>{data.quote}</p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 20, borderTop: `3px double ${TR_COLORS.navy}`
        }}>
          <div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 800,
              color: TR_COLORS.navy, letterSpacing: 1, textTransform: 'uppercase',
              marginBottom: 4
            }}>{data.quoteAuthor}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 600,
              color: 'rgba(5,13,17,0.7)', letterSpacing: 1.5, textTransform: 'uppercase'
            }}>{data.quoteRole}</div>
          </div>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 700,
            fontStyle: 'italic', color: TR_COLORS.navy
          }}>truerateliberia.com</span>
        </div>
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════
// 4. BIG STAT — Full bleed with stat overlay
// ═══════════════════════════════════════════════════════════
function StatTerminal({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
    }}>
      {/* Moody backdrop */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PhotoPlaceholder variant="abstract" label="Thematic image" imageUrl={data.statImage} objectPosition={`center ${data.statImagePosY ?? 50}%`} bw={data.bwPhoto} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(5,13,17,0.85) 0%, rgba(5,13,17,0.65) 50%, rgba(5,13,17,0.95) 100%)'
        }} />
      </div>

      <div style={{ position: 'absolute', top: 44, left: 48, right: 48, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TrueRateMark color={TR_COLORS.lime} size={64} />
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)'
        }}>{data.date} · {data.category}</div>
      </div>

      <div style={{
        position: 'absolute', top: 150, left: 48, right: 48, bottom: 130, zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 22,
          letterSpacing: 4, textTransform: 'uppercase',
          color: TR_COLORS.lime, marginBottom: 28, fontWeight: 600
        }}>▲ FIGURE OF THE DAY</div>

        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 260, fontWeight: 900,
          lineHeight: 0.85, letterSpacing: -10,
          color: TR_COLORS.lime, marginBottom: 20
        }}>{data.stat}</div>

        <div style={{ width: 100, height: 4, background: '#fff', marginBottom: 28 }} />

        <h2 style={{
          fontFamily: 'Inter, sans-serif', fontSize: 36, fontWeight: 800,
          lineHeight: 1.12, letterSpacing: -1,
          color: '#fff', marginBottom: 16, textWrap: 'balance'
        }}>{data.statLabel}</h2>

        <p style={{
          fontSize: 26, lineHeight: 1.55,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: 860, textWrap: 'pretty'
        }}>{data.statContext}</p>
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: '#fff',
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · LISGIS · TrueRate Research</span>
      </div>
    </div>);

}

function StatBroadsheet({ data }) {
  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.paper, fontFamily: 'Inter, sans-serif', color: TR_COLORS.navy
    }}>
      <div style={{
        padding: '40px 48px 22px',
        borderBottom: `3px double ${TR_COLORS.navy}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <TrueRateMark color={TR_COLORS.navy} size={64} />
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(5,13,17,0.55)'
        }}>Figure of the Day · {data.date}</div>
      </div>

      <div style={{ padding: '24px 48px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 22,
          letterSpacing: 3, textTransform: 'uppercase',
          color: TR_COLORS.navy, fontWeight: 700,
          background: TR_COLORS.lime, padding: '12px 22px'
        }}>{data.category}</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(5,13,17,0.15)' }} />
      </div>

      <div style={{ padding: '30px 48px 10px' }}>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 280, fontWeight: 900,
          lineHeight: 0.82, letterSpacing: -12,
          color: TR_COLORS.navy, fontStyle: 'italic'
        }}>{data.stat}</div>
        <div style={{ width: 140, height: 5, background: TR_COLORS.lime, marginTop: 14 }} />
      </div>

      <div style={{ padding: '28px 48px 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 36 }}>
        <h2 style={{
          fontFamily: 'Inter, sans-serif', fontSize: 34, fontWeight: 800,
          lineHeight: 1.12, letterSpacing: -1,
          color: TR_COLORS.navy, textWrap: 'balance'
        }}>{data.statLabel}</h2>
        <div style={{ borderLeft: `2px solid ${TR_COLORS.navy}`, paddingLeft: 20 }}>
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 18,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(5,13,17,0.5)', marginBottom: 10
          }}>Context</div>
          <p style={{ fontSize: 24, lineHeight: 1.55, color: 'rgba(5,13,17,0.78)' }}>
            {data.statContext}
          </p>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 48, right: 48,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: TR_COLORS.navy,
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · LISGIS · TrueRate Research</span>
      </div>
    </div>);

}

// ═══════════════════════════════════════════════════════════
// 5. MARKETS SNAPSHOT — Bloomberg ticker style over image
// ═══════════════════════════════════════════════════════════
function MarketRow({ label, value, change, up, dark, last }) {
  const color = up ? TR_COLORS.green : TR_COLORS.red;
  const borderC = dark ? 'rgba(255,255,255,0.1)' : 'rgba(5,13,17,0.1)';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto',
      alignItems: 'baseline', gap: 18,
      padding: '18px 0',
      borderBottom: last ? 'none' : `1px solid ${borderC}`
    }}>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 700,
        color: dark ? '#fff' : TR_COLORS.navy
      }}>{label}</div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 48, fontWeight: 700,
        color: dark ? '#fff' : TR_COLORS.navy, lineHeight: 1
      }}>{value}</div>
      <div style={{
        fontFamily: 'Roboto Mono, monospace', fontSize: 26, fontWeight: 700,
        color: color, minWidth: 130, textAlign: 'right'
      }}>{up ? '▲' : '▼'} {change}</div>
    </div>);

}

function MarketsTerminal({ data }) {
  const markets = [
  { label: data.market1Label, value: data.market1Value, change: data.market1Change, up: data.market1Up },
  { label: data.market2Label, value: data.market2Value, change: data.market2Change, up: data.market2Up },
  { label: data.market3Label, value: data.market3Value, change: data.market3Change, up: data.market3Up },
  { label: data.market4Label, value: data.market4Value, change: data.market4Change, up: data.market4Up }];

  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.navy, fontFamily: 'Inter, sans-serif', color: '#fff'
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
          <TrueRateMark color={TR_COLORS.lime} size={64} />
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 20,
            letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)'
          }}>{data.marketDate}</div>
        </div>

        <div style={{ padding: '44px 48px 28px' }}>
          <div style={{
            fontFamily: 'Roboto Mono, monospace', fontSize: 22,
            letterSpacing: 4, textTransform: 'uppercase',
            color: TR_COLORS.lime, marginBottom: 18, fontWeight: 600
          }}>▲ MARKETS · LIVE CLOSE</div>
          <h1 style={{
            fontFamily: 'Inter, sans-serif', fontSize: 54, fontWeight: 800,
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
            fontFamily: 'Inter, sans-serif',
            letterSpacing: 0.5, textTransform: 'uppercase',
            color: '#fff',
            display: 'block', lineHeight: 1,
            whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
          }}>Source · CBL · Yahoo Finance · TrueRate</span>
        </div>
      </div>
    </div>);

}

function MarketsBroadsheet({ data }) {
  const markets = [
  { label: data.market1Label, value: data.market1Value, change: data.market1Change, up: data.market1Up },
  { label: data.market2Label, value: data.market2Value, change: data.market2Change, up: data.market2Up },
  { label: data.market3Label, value: data.market3Value, change: data.market3Change, up: data.market3Up },
  { label: data.market4Label, value: data.market4Value, change: data.market4Change, up: data.market4Up }];

  return (
    <div style={{
      width: 1080, height: 1350, position: 'relative', overflow: 'hidden',
      background: TR_COLORS.paper, fontFamily: 'Inter, sans-serif', color: TR_COLORS.navy
    }}>
      <div style={{
        padding: '40px 48px 22px',
        borderBottom: `3px double ${TR_COLORS.navy}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <TrueRateMark color={TR_COLORS.navy} size={64} />
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 20,
          letterSpacing: 2, textTransform: 'uppercase',
          color: 'rgba(5,13,17,0.55)'
        }}>Markets · {data.marketDate}</div>
      </div>

      <div style={{ padding: '30px 48px 10px' }}>
        <div style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 22,
          letterSpacing: 3, textTransform: 'uppercase',
          color: TR_COLORS.navy, fontWeight: 700,
          background: TR_COLORS.lime, padding: '12px 22px',
          display: 'inline-block', marginBottom: 18
        }}>Market Snapshot</div>
        <h1 style={{
          fontFamily: 'Inter, sans-serif', fontSize: 60, fontWeight: 800,
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
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 0.5, textTransform: 'uppercase',
          color: TR_COLORS.navy,
          display: 'block', lineHeight: 1,
          whiteSpace: 'nowrap', fontSize: "30px", fontWeight: "400"
        }}>Source · CBL · Yahoo Finance · TrueRate</span>
      </div>
    </div>);

}

const TR_TEMPLATES = {
  breaking: { terminal: BreakingTerminal, broadsheet: BreakingBroadsheet, label: 'Breaking' },
  article: { terminal: ArticleTerminal, broadsheet: ArticleBroadsheet, label: 'Article' },
  quote: { terminal: QuoteTerminal, broadsheet: QuoteBroadsheet, label: 'Quote' },
  stat: { terminal: StatTerminal, broadsheet: StatBroadsheet, label: 'Big Stat' },
  markets: { terminal: MarketsTerminal, broadsheet: MarketsBroadsheet, label: 'Markets' }
};

Object.assign(window, { TR_TEMPLATES, TR_COLORS, Logo, LOGO_URL, AutoFitHeadline, PhotoPlaceholder, TrueRateMark });