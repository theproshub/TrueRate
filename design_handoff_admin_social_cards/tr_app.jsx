const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "terminal",
  "templateType": "breaking",
  "category": "Economy",
  "headline": "The Man Who Holds Liberia's Interest Rates — And Why He's Not Moving Them",
  "subtext": "The Central Bank of Liberia signaled patience on rate cuts as inflation eased to 10.2% — down from a 14.7% peak — but cautioned that food price pressures and FX volatility warrant continued vigilance.",
  "articleTitle": "The Man Who Holds Liberia's Interest Rates — And Why He's Not Moving Them",
  "articleExcerpt": "With smartphone penetration above 60%, mobile-first financial services are pulling millions of unbanked Liberians into the formal economy — and rewriting the rules of retail banking across West Africa.",
  "articleReadTime": "6 min",
  "stat": "$2.4B",
  "statLabel": "Foreign Direct Investment, Q1 2026",
  "statContext": "A record quarter driven by iron ore expansion at Nimba and renewed rubber export demand from Asian markets. The previous peak was $1.7B in Q2 2024.",
  "date": "Apr 20, 2026",
  "marketDate": "Apr 20, 2026 · 16:00 GMT · Close",
  "market1Label": "LRD / USD",
  "market1Value": "183.93",
  "market1Change": "0.65%",
  "market1Up": true,
  "market2Label": "Iron Ore (USD/t)",
  "market2Value": "108.50",
  "market2Change": "2.08%",
  "market2Up": false,
  "market3Label": "Rubber (USD/kg)",
  "market3Value": "1.72",
  "market3Change": "2.38%",
  "market3Up": true,
  "market4Label": "Gold (USD/oz)",
  "market4Value": "2,285",
  "market4Change": "0.82%",
  "market4Up": true,
  "quote": "Liberia's next decade will be written by entrepreneurs who refuse to wait for perfect conditions — who build despite friction, not because of its absence.",
  "quoteAuthor": "Joseph K. Tuah",
  "quoteRole": "CEO, PayLink Liberia",
  "quoteContext": "At the West Africa FinTech Summit, Monrovia",
  "quoteAccent": "#BFEA36",
  "breakingImage": "",
  "breakingImagePosY": 50,
  "articleImage": "",
  "articleImagePosY": 30,
  "quoteImage": "",
  "quoteImagePosY": 20,
  "statImage": "",
  "statImagePosY": 50,
  "marketsImage": "",
  "marketsImagePosY": 50,
  "rateDate": "Jul 13, 2026",
  "rateValue": "183.93",
  "rateChange": "0.65%",
  "rateUp": true,
  "rateBuy": "182.50",
  "rateSell": "185.40",
  "rateImage": "",
  "rateImagePosY": 50,
  "eventKind": "Event",
  "eventTitle": "West Africa FinTech Summit 2026",
  "eventDate": "Aug 14, 2026",
  "eventTime": "9:00 AM GMT",
  "eventVenue": "EJS Ministerial Complex, Monrovia",
  "eventCTA": "Register · truerateliberia.com",
  "eventImage": "",
  "eventImagePosY": 50,
  "explainerSlide": 0,
  "explainerTitle": "The CBL Just Held Interest Rates. Here's What That Means for Your Money.",
  "explainerImage": "",
  "explainerImagePosY": 50,
  "ex1Title": "Loan payments stay put",
  "ex1Body": "If you hold a variable-rate loan, your monthly payment won't rise this quarter — but it won't fall either. Budget on current numbers.",
  "ex2Title": "Savings still beat cash",
  "ex2Body": "Deposit rates hold near 4.5%. With inflation easing to 10.2%, the gap is narrowing — money in an account loses less value than money under the mattress.",
  "ex3Title": "The LRD gets breathing room",
  "ex3Body": "Steady rates support the exchange rate. If you're paid in USD or send remittances, expect less volatility through Q3.",
  "explainerCTA": "Follow for plain-language money news, every day.",
  "storyImage": "",
  "storyImagePosY": 40,
  "coverTitle": "Why Liberia's Central Bank Won't Cut Rates",
  "coverImage": "",
  "coverImagePosY": 30,
  "bwPhoto": false
} /*EDITMODE-END*/;

const CATEGORIES = ["News", "Markets", "Economy", "Analytics", "Business", "Technology", "Videos"];

function App() {
  const saved = (() => {try {return JSON.parse(localStorage.getItem('tr_state_v7') || '{}');} catch (e) {return {};}})();
  // Migrate: clear old blue accent so lime default takes over
  if (saved.quoteAccent === '#5BA4FF') delete saved.quoteAccent;
  // Migrate: clear old article title so new default takes over
  if (saved.articleTitle === "Mobile Money Is Reshaping How Liberians Save, Borrow, and Invest") delete saved.articleTitle;
  // Migrate: force bwPhoto off — was previously defaulted to true
  if (saved.bwPhoto === true) delete saved.bwPhoto;
  // Migrate: clear stale pre-official-platform values so new defaults flow through
  if (saved.rateValue === "192.50") delete saved.rateValue;
  if (saved.market1Value === "192.50") delete saved.market1Value;
  if (saved.rateBuy === "191.25") delete saved.rateBuy;
  if (saved.rateSell === "193.75") delete saved.rateSell;
  if (saved.eventCTA === "Register · truerate.lr/events") delete saved.eventCTA;
  const [tweaks, setTweaks] = useState({ ...TWEAK_DEFAULTS, ...saved });
  const [showTweaks, setShowTweaks] = useState(false);
  const [showSync, setShowSync] = useState(false);

  useEffect(() => {
    // Strip large image data URLs from localStorage to avoid quota errors
    try {
      const slim = { ...tweaks };
      for (const k of Object.keys(slim)) {
        if (typeof slim[k] === 'string' && slim[k].startsWith('data:') && slim[k].length > 100_000) {
          slim[k] = ''; // don't persist huge inline images
        }
      }
      localStorage.setItem('tr_state_v7', JSON.stringify(slim));
    } catch (e) {
      try {localStorage.removeItem('tr_state_v7');} catch (_) {}
    }
  }, [tweaks]);

  useEffect(() => {
    const listener = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    const comboListener = (e) => {
      setTweaks((prev) => ({ ...prev, ...e.detail }));
    };
    window.addEventListener('message', listener);
    window.addEventListener('tr-set-combo', comboListener);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => {
      window.removeEventListener('message', listener);
      window.removeEventListener('tr-set-combo', comboListener);
    };
  }, []);

  function setTweak(key, value) {
    const next = { ...tweaks, [key]: value };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
  }

  function applyMany(edits) {
    setTweaks((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  }

  // Migrate legacy variant values
  const variantMap = { dark: 'terminal', light: 'broadsheet' };
  const variant = variantMap[tweaks.variant] || tweaks.variant || 'terminal';
  const { templateType } = tweaks;
  const Template = TR_TEMPLATES[templateType]?.[variant] || TR_TEMPLATES.breaking.terminal;
  const DIM = window.TR_TEMPLATE_SIZES ? window.TR_TEMPLATE_SIZES(templateType) : { w: 1080, h: 1350 };
  const SCALE = Math.min(560 / DIM.w, 700 / DIM.h);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        background: '#061520', borderBottom: '1px solid rgba(191,234,54,0.2)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20,
        flexWrap: 'wrap', fontFamily: 'Inter, sans-serif'
      }}>
        <img src={LOGO_URL} alt="TrueRate" style={{ height: 22, filter: 'brightness(0) invert(1)' }} />
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />
        <span style={{
          color: 'rgba(243,244,244,0.45)', fontSize: 12,
          fontFamily: 'Roboto Mono, monospace',
          letterSpacing: 2, textTransform: 'uppercase'
        }}>Social Media Templates · v2</span>

        <button onClick={() => setShowSync(!showSync)} style={{
          padding: '7px 14px', background: showSync ? '#BFEA36' : 'transparent',
          color: showSync ? '#050d11' : '#BFEA36',
          border: '1px solid rgba(191,234,54,0.4)', cursor: 'pointer',
          fontFamily: 'Roboto Mono, monospace', fontSize: 11,
          letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700
        }}>⟳ Pull from Site</button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {Object.entries(TR_TEMPLATES).map(([key, t]) =>
          <button key={key} onClick={() => setTweak('templateType', key)} style={{
            padding: '7px 14px',
            background: templateType === key ? '#BFEA36' : 'transparent',
            color: templateType === key ? '#050d11' : 'rgba(243,244,244,0.65)',
            border: `1px solid ${templateType === key ? '#BFEA36' : 'rgba(255,255,255,0.15)'}`,
            cursor: 'pointer', fontSize: 12,
            fontFamily: 'Roboto Mono, monospace',
            letterSpacing: 1.5, textTransform: 'uppercase',
            fontWeight: templateType === key ? 700 : 400
          }}>{t.label}</button>
          )}
        </div>

        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />

        <div style={{ display: 'flex', gap: 4 }}>
          {[
          { key: 'terminal', label: 'Terminal' },
          { key: 'broadsheet', label: 'Terminal' }].
          map((v) =>
          <button key={v.key} onClick={() => setTweak('variant', v.key)} style={{
            padding: '7px 14px',
            background: variant === v.key ? '#F3F4F4' : 'transparent',
            color: variant === v.key ? '#050d11' : 'rgba(243,244,244,0.65)',
            border: `1px solid ${variant === v.key ? '#F3F4F4' : 'rgba(255,255,255,0.15)'}`,
            cursor: 'pointer', fontSize: 12,
            fontFamily: 'Roboto Mono, monospace',
            letterSpacing: 1.5, textTransform: 'uppercase',
            fontWeight: variant === v.key ? 700 : 400
          }}>{v.label}</button>
          )}
        </div>

        <button onClick={() => downloadCurrentAsPNG(templateType, variant)} style={{
          padding: '8px 16px', background: '#BFEA36', color: '#050d11',
          border: '1px solid #BFEA36', cursor: 'pointer', fontSize: 12,
          fontFamily: 'Roboto Mono, monospace',
          letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download HD PNG
        </button>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', gap: 18 }}>
        <div style={{
          width: DIM.w * SCALE,
          height: DIM.h * SCALE,
          position: 'relative',
          flexShrink: 0
        }}>
          <div id="tr-export-target" style={{
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            width: DIM.w, height: DIM.h,
            position: 'absolute', top: 0, left: 0,
            boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(191,234,54,0.1)'
          }}>
            <Template data={tweaks} />
          </div>
        </div>
        {templateType === 'explainer' &&
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setTweak('explainerSlide', Math.max(0, (Number(tweaks.explainerSlide) || 0) - 1))} style={slideNavBtn}>←</button>
            {[0, 1, 2, 3, 4].map((i) =>
          <button key={i} onClick={() => setTweak('explainerSlide', i)} style={{
            ...slideNavBtn, width: 34,
            background: (Number(tweaks.explainerSlide) || 0) === i ? '#BFEA36' : 'transparent',
            color: (Number(tweaks.explainerSlide) || 0) === i ? '#050d11' : 'rgba(243,244,244,0.65)'
          }}>{i === 0 ? 'C' : i === 4 ? 'E' : i}</button>
          )}
            <button onClick={() => setTweak('explainerSlide', Math.min(4, (Number(tweaks.explainerSlide) || 0) + 1))} style={slideNavBtn}>→</button>
          </div>
        }
      </div>

      <div style={{
        textAlign: 'center', paddingBottom: 14,
        color: 'rgba(243,244,244,0.3)', fontSize: 11,
        fontFamily: 'Roboto Mono, monospace', letterSpacing: 2, textTransform: 'uppercase'
      }}>
        {DIM.w} × {DIM.h} · {templateType === 'story' ? '9:16 Story · IG · WhatsApp · TikTok' : templateType === 'cover' ? '16:9 · Video Thumbnail' : '4:5 Portrait · IG · FB · LinkedIn · X'}
      </div>

      {/* Tweaks panel */}
      {showTweaks && <TweaksPanel tweaks={tweaks} setTweak={setTweak} />}
      {showSync && <SyncPanel onApply={applyMany} onClose={() => setShowSync(false)} />}
    </div>);

}

function TweaksPanel({ tweaks, setTweak }) {
  const { templateType } = tweaks;
  const showField = {
    headline: templateType === 'breaking' || templateType === 'story',
    subtext: templateType === 'breaking',
    article: templateType === 'article',
    stat: templateType === 'stat' || templateType === 'article',
    markets: templateType === 'markets' || templateType === 'article' || templateType === 'breaking',
    quote: templateType === 'quote',
    rate: templateType === 'rate',
    event: templateType === 'event',
    explainer: templateType === 'explainer',
    cover: templateType === 'cover'
  };

  // Image slot for the current template
  const imageSlot = {
    breaking: { key: 'breakingImage', posKey: 'breakingImagePosY', label: 'Breaking News' },
    article: { key: 'articleImage', posKey: 'articleImagePosY', label: 'Article' },
    quote: { key: 'quoteImage', posKey: 'quoteImagePosY', label: 'Quote / Portrait' },
    stat: { key: 'statImage', posKey: 'statImagePosY', label: 'Big Stat' },
    markets: { key: 'marketsImage', posKey: 'marketsImagePosY', label: 'Markets' },
    rate: { key: 'rateImage', posKey: 'rateImagePosY', label: 'Daily Rate' },
    event: { key: 'eventImage', posKey: 'eventImagePosY', label: 'Event' },
    explainer: { key: 'explainerImage', posKey: 'explainerImagePosY', label: 'Explainer Cover' },
    story: { key: 'storyImage', posKey: 'storyImagePosY', label: 'Story' },
    cover: { key: 'coverImage', posKey: 'coverImagePosY', label: 'Video Cover' }
  }[templateType];

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16,
      background: '#050d11', border: '1px solid rgba(191,234,54,0.3)',
      width: 340, maxHeight: '82vh', overflowY: 'auto',
      padding: 18, fontFamily: 'Inter, sans-serif',
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      zIndex: 1000
    }}>
      <div style={{
        fontFamily: 'Roboto Mono, monospace',
        fontWeight: 700, fontSize: 12, color: '#BFEA36',
        marginBottom: 14, letterSpacing: 3, textTransform: 'uppercase'
      }}>// Tweaks</div>

      {imageSlot &&
      <TwSection title={`${imageSlot.label} · Image`}>
          <TwImageUpload
          value={tweaks[imageSlot.key]}
          onChange={(v) => setTweak(imageSlot.key, v)} />
          {tweaks[imageSlot.key] &&
          <TwSlider
            label="Vertical Crop"
            min={0}
            max={100}
            value={tweaks[imageSlot.posKey] ?? 50}
            onChange={(v) => setTweak(imageSlot.posKey, v)} />
          }
        </TwSection>
      }

      <TwSection title="Meta">
        <TwSelect label="Category" value={tweaks.category} options={CATEGORIES} onChange={(v) => setTweak('category', v)} />
        <TwInput label="Date" value={tweaks.date} onChange={(v) => setTweak('date', v)} />
      </TwSection>

      {showField.headline &&
      <TwSection title="Breaking News">
          <TwTextarea label="Headline" value={tweaks.headline} onChange={(v) => setTweak('headline', v)} rows={3} />
          <TwTextarea label="Lede" value={tweaks.subtext} onChange={(v) => setTweak('subtext', v)} rows={4} />
        </TwSection>
      }

      {showField.article &&
      <TwSection title="Article">
          <TwTextarea label="Title" value={tweaks.articleTitle} onChange={(v) => setTweak('articleTitle', v)} rows={3} />
          <TwTextarea label="Excerpt" value={tweaks.articleExcerpt} onChange={(v) => setTweak('articleExcerpt', v)} rows={4} />
          <TwInput label="Read Time" value={tweaks.articleReadTime} onChange={(v) => setTweak('articleReadTime', v)} />
        </TwSection>
      }

      {showField.stat &&
      <TwSection title="Big Stat">
          <TwInput label="Number" value={tweaks.stat} onChange={(v) => setTweak('stat', v)} />
          <TwInput label="Stat Label" value={tweaks.statLabel} onChange={(v) => setTweak('statLabel', v)} />
          <TwTextarea label="Context" value={tweaks.statContext} onChange={(v) => setTweak('statContext', v)} rows={3} />
        </TwSection>
      }

      {showField.markets &&
      <TwSection title="Markets">
          <TwInput label="Header" value={tweaks.marketDate} onChange={(v) => setTweak('marketDate', v)} />
          {[1, 2, 3, 4].map((n) =>
        <div key={n} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>
              <TwInputTiny placeholder="Label" value={tweaks[`market${n}Label`]} onChange={(v) => setTweak(`market${n}Label`, v)} />
              <TwInputTiny placeholder="Value" value={tweaks[`market${n}Value`]} onChange={(v) => setTweak(`market${n}Value`, v)} />
              <div style={{ display: 'flex', gap: 4 }}>
                <TwInputTiny placeholder="%" value={tweaks[`market${n}Change`]} onChange={(v) => setTweak(`market${n}Change`, v)} />
                <button onClick={() => setTweak(`market${n}Up`, !tweaks[`market${n}Up`])} style={{
              width: 32, height: 30, background: tweaks[`market${n}Up`] ? '#BFEA36' : '#e11b22',
              color: '#050d11', border: 'none', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Roboto Mono, monospace'
            }}>{tweaks[`market${n}Up`] ? '▲' : '▼'}</button>
              </div>
            </div>
        )}
        </TwSection>
      }

      {showField.rate &&
      <TwSection title="Daily Rate">
          <TwInput label="Date" value={tweaks.rateDate} onChange={(v) => setTweak('rateDate', v)} />
          <TwInput label="Mid Rate (USD→LRD)" value={tweaks.rateValue} onChange={(v) => setTweak('rateValue', v)} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}><TwInput label="Change" value={tweaks.rateChange} onChange={(v) => setTweak('rateChange', v)} /></div>
            <button onClick={() => setTweak('rateUp', !tweaks.rateUp)} style={{
            width: 36, height: 32, marginBottom: 10, background: tweaks.rateUp ? '#BFEA36' : '#e11b22',
            color: '#050d11', border: 'none', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Roboto Mono, monospace'
          }}>{tweaks.rateUp ? '▲' : '▼'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div><TwInput label="Bank Buying" value={tweaks.rateBuy} onChange={(v) => setTweak('rateBuy', v)} /></div>
            <div><TwInput label="Bank Selling" value={tweaks.rateSell} onChange={(v) => setTweak('rateSell', v)} /></div>
          </div>
        </TwSection>
      }

      {showField.event &&
      <TwSection title="Event">
          <TwInput label="Kind (chip)" value={tweaks.eventKind} onChange={(v) => setTweak('eventKind', v)} />
          <TwTextarea label="Title" value={tweaks.eventTitle} onChange={(v) => setTweak('eventTitle', v)} rows={2} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div><TwInput label="Date" value={tweaks.eventDate} onChange={(v) => setTweak('eventDate', v)} /></div>
            <div><TwInput label="Time" value={tweaks.eventTime} onChange={(v) => setTweak('eventTime', v)} /></div>
          </div>
          <TwInput label="Venue" value={tweaks.eventVenue} onChange={(v) => setTweak('eventVenue', v)} />
          <TwInput label="CTA (bottom-left)" value={tweaks.eventCTA} onChange={(v) => setTweak('eventCTA', v)} />
        </TwSection>
      }

      {showField.explainer &&
      <TwSection title="Explainer Carousel">
          <TwTextarea label="Cover Title" value={tweaks.explainerTitle} onChange={(v) => setTweak('explainerTitle', v)} rows={3} />
          {[1, 2, 3].map((n) =>
        <div key={n}>
              <TwInput label={`Point ${n} · Title`} value={tweaks[`ex${n}Title`]} onChange={(v) => setTweak(`ex${n}Title`, v)} />
              <TwTextarea label={`Point ${n} · Body`} value={tweaks[`ex${n}Body`]} onChange={(v) => setTweak(`ex${n}Body`, v)} rows={3} />
            </div>
        )}
          <TwTextarea label="Outro CTA" value={tweaks.explainerCTA} onChange={(v) => setTweak('explainerCTA', v)} rows={2} />
        </TwSection>
      }

      {showField.cover &&
      <TwSection title="Video Cover">
          <TwTextarea label="Title" value={tweaks.coverTitle} onChange={(v) => setTweak('coverTitle', v)} rows={3} />
        </TwSection>
      }

      {showField.quote &&
      <TwSection title="Quote">
          <TwTextarea label="Quote" value={tweaks.quote} onChange={(v) => setTweak('quote', v)} rows={5} />
          <TwInput label="Author" value={tweaks.quoteAuthor} onChange={(v) => setTweak('quoteAuthor', v)} />
          <TwInput label="Role" value={tweaks.quoteRole} onChange={(v) => setTweak('quoteRole', v)} />
          <TwInput label="Context (optional)" value={tweaks.quoteContext} onChange={(v) => setTweak('quoteContext', v)} />
          <TwColor label="Accent" value={tweaks.quoteAccent} onChange={(v) => setTweak('quoteAccent', v)} />
        </TwSection>
      }
    </div>);

}

const slideNavBtn = {
  padding: '6px 12px', background: 'transparent',
  color: 'rgba(243,244,244,0.65)', border: '1px solid rgba(255,255,255,0.15)',
  cursor: 'pointer', fontSize: 13, fontFamily: 'Roboto Mono, monospace', fontWeight: 700
};

function TwSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        fontFamily: 'Roboto Mono, monospace', fontSize: 10,
        color: 'rgba(191,234,54,0.75)', marginBottom: 10,
        letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600
      }}>── {title}</div>
      {children}
    </div>);

}

const twLabel = { display: 'block', color: 'rgba(243,244,244,0.5)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5, fontFamily: 'Roboto Mono, monospace' };
const twField = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)', color: '#F3F4F4',
  padding: '8px 10px', fontSize: 12, fontFamily: 'Inter, sans-serif',
  resize: 'vertical', marginBottom: 10, lineHeight: 1.5, outline: 'none',
  borderRadius: 0
};

function TwInput({ label, value, onChange }) {
  return <><label style={twLabel}>{label}</label><input value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...twField, height: 32 }} /></>;
}
function TwTextarea({ label, value, onChange, rows = 3 }) {
  return <><label style={twLabel}>{label}</label><textarea value={value || ''} onChange={(e) => onChange(e.target.value)} style={twField} rows={rows} /></>;
}
function TwSelect({ label, value, options, onChange }) {
  return <><label style={twLabel}>{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...twField, height: 32, appearance: 'none' }}>
    {options.map((o) => <option key={o} value={o} style={{ background: '#050d11' }}>{o}</option>)}
  </select></>;
}
function TwColor({ label, value, onChange }) {
  return <><label style={twLabel}>{label}</label>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
      <input type="color" value={value || '#5BA4FF'} onChange={(e) => onChange(e.target.value)} style={{ width: 36, height: 32, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, background: 'transparent', padding: 2, cursor: 'pointer' }} />
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...twField, height: 32, marginBottom: 0, flex: 1 }} />
    </div></>;
}
function TwInputTiny({ placeholder, value, onChange }) {
  return <input placeholder={placeholder} value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...twField, height: 30, marginBottom: 0, fontSize: 11, padding: '4px 7px' }} />;
}

function TwSlider({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <label style={{ ...twLabel, marginBottom: 0 }}>{label}</label>
        <span style={{
          fontFamily: 'Roboto Mono, monospace', fontSize: 11,
          color: 'rgba(191,234,54,0.85)', fontWeight: 600
        }}>{value}%</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#BFEA36', cursor: 'pointer' }} />
    </div>);

}

function TwImageUpload({ value, onChange }) {
  const inputRef = React.useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Store original at full resolution, lossless. localStorage persistence will
    // skip these (size > 100KB) — they live in component state for the session.
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={twLabel}>Upload / Paste Image</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }} />
      
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button onClick={() => inputRef.current?.click()} style={{
          flex: 1, padding: '8px 10px', background: '#BFEA36', color: '#050d11',
          border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
          fontFamily: 'Roboto Mono, monospace', letterSpacing: 1.5,
          textTransform: 'uppercase'
        }}>Upload</button>
        {value &&
        <button onClick={() => onChange('')} style={{
          padding: '8px 12px', background: 'transparent', color: 'rgba(243,244,244,0.7)',
          border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 11,
          fontFamily: 'Roboto Mono, monospace', letterSpacing: 1.5,
          textTransform: 'uppercase', fontWeight: 500
        }}>Clear</button>
        }
      </div>
      <input
        placeholder="Or paste image URL…"
        value={value && !value.startsWith('data:') ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...twField, height: 30, marginBottom: 8, fontSize: 11 }} />
      
      {value &&
      <div style={{
        height: 90, marginBottom: 4,
        backgroundImage: `url(${value})`,

        border: '1px solid rgba(191,234,54,0.2)', width: "302px", backgroundPosition: "center top", backgroundSize: "cover"
      }} />
      }
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// ─── PNG export ────────────────────────────────────────────────────────────
async function downloadCurrentAsPNG(templateType, variant) {
  const target = document.getElementById('tr-export-target');
  if (!target) return alert('Could not find export target');
  const DIM = window.TR_TEMPLATE_SIZES ? window.TR_TEMPLATE_SIZES(templateType) : { w: 1080, h: 1350 };

  // Snapshot original transform; clear it so we capture full-size 1080×1350
  const originalTransform = target.style.transform;
  target.style.transform = 'none';

  try {
    if (!window.htmlToImage) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://unpkg.com/html-to-image@1.11.13/dist/html-to-image.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    // Wait a tick for fonts + layout to settle after transform reset
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 100));

    const dataUrl = await window.htmlToImage.toPng(target, {
      width: DIM.w, height: DIM.h, pixelRatio: 3,
      backgroundColor: '#050d11',
      cacheBust: true,
      quality: 1
    });

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `truerate-${templateType}-${variant}-hd.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
    alert('Export failed: ' + err.message);
  } finally {
    target.style.transform = originalTransform;
  }
}

// ─── Export helpers (used by gen_pptx) ────────────────────────────────────
window.__TR_EXPORT_COMBOS = [
{ templateType: 'breaking', variant: 'terminal' },
{ templateType: 'breaking', variant: 'broadsheet' },
{ templateType: 'article', variant: 'terminal' },
{ templateType: 'article', variant: 'broadsheet' },
{ templateType: 'quote', variant: 'terminal' },
{ templateType: 'quote', variant: 'broadsheet' },
{ templateType: 'stat', variant: 'terminal' },
{ templateType: 'stat', variant: 'broadsheet' },
{ templateType: 'markets', variant: 'terminal' },
{ templateType: 'markets', variant: 'broadsheet' },
{ templateType: 'rate', variant: 'terminal' },
{ templateType: 'rate', variant: 'broadsheet' },
{ templateType: 'event', variant: 'terminal' },
{ templateType: 'event', variant: 'broadsheet' },
{ templateType: 'explainer', variant: 'terminal' },
{ templateType: 'explainer', variant: 'broadsheet' },
{ templateType: 'story', variant: 'terminal' },
{ templateType: 'cover', variant: 'terminal' },
{ templateType: 'cover', variant: 'broadsheet' }];


window.trSetExport = function (idx) {
  const combo = window.__TR_EXPORT_COMBOS[idx];
  if (!combo) return;
  // Write directly to localStorage so component picks up on re-render
  const cur = JSON.parse(localStorage.getItem('tr_state_v7') || '{}');
  const next = { ...cur, ...combo };
  localStorage.setItem('tr_state_v7', JSON.stringify(next));
  // Trigger a full re-render by firing a storage event isn't reliable — dispatch a custom event
  window.dispatchEvent(new CustomEvent('tr-set-combo', { detail: combo }));
};