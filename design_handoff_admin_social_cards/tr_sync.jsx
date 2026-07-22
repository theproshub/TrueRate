// TrueRate Live Sync — pulls stories + live rates from truerateliberia.com's JSON APIs
// (/api/news, /api/rates, /api/commodities — confirmed in the site codebase).
// Direct fetch first; falls back to CORS proxies. Exposes <SyncPanel/> to window.
const TR_SITE = 'https://truerateliberia.com';
const TR_PROXIES = [
(u) => u,
(u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
(u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u)];

async function trFetch(url, asJson) {
  let lastErr;
  for (const wrap of TR_PROXIES) {
    try {
      const res = await fetch(wrap(url), { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (asJson) return await res.json();
      const text = await res.text();
      if (text.length > 500) return text;
      throw new Error('empty response');
    } catch (e) {lastErr = e;}
  }
  throw lastErr || new Error('fetch failed');
}

const TR_CAT_MAP = { economy: 'Economy', markets: 'Markets', business: 'Business', technology: 'Technology', analytics: 'Analytics', news: 'News', videos: 'Videos', finance: 'Markets', policy: 'Economy', banking: 'Markets', investing: 'Markets', commodities: 'Markets', forex: 'Markets' };

function SyncPanel({ onApply, onClose }) {
  const { useState, useEffect } = React;
  const [stories, setStories] = useState(null);
  const [status, setStatus] = useState('Connecting to truerateliberia.com…');
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    let alive = true;
    trFetch(TR_SITE + '/api/news', true).then((data) => {
      if (!alive) return;
      const items = (data.items || []).slice(0, 12);
      if (items.length) {setStories(items);setStatus('');} else
      setStatus('Connected — no published stories returned.');
    }).catch(() => alive && setStatus('Could not reach the site APIs from the browser (CORS + proxies failed). Ask your dev to add "Access-Control-Allow-Origin: *" to /api/news and /api/rates — then this panel works everywhere.'));
    return () => {alive = false;};
  }, []);

  function applyStory(s) {
    const cat = TR_CAT_MAP[(s.category || '').toLowerCase()] || 'News';
    const edits = {
      headline: s.title, articleTitle: s.title, coverTitle: s.title, category: cat,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) };
    if (s.summary) {edits.subtext = s.summary;edits.articleExcerpt = s.summary;}
    if (s.image) {edits.breakingImage = s.image;edits.articleImage = s.image;edits.coverImage = s.image;}
    onApply(edits);
    onClose();
  }

  async function pullRates() {
    setBusy('rates');
    try {
      const data = await trFetch(TR_SITE + '/api/rates', true);
      const usd = (data.rates || []).find((r) => r.from === 'USD');
      if (!usd) throw new Error('no USD rate in response');
      const mid = usd.rate;
      const edits = {
        rateValue: mid.toFixed(2),
        rateBuy: (mid * 0.9925).toFixed(2),
        rateSell: (mid * 1.0075).toFixed(2),
        rateDate: data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        market1Label: 'USD / LRD', market1Value: mid.toFixed(2) };
      const eur = (data.rates || []).find((r) => r.from === 'EUR');
      if (eur) {edits.market2Label = 'EUR / LRD';edits.market2Value = eur.rate.toFixed(2);}
      if (usd.changePercent) {
        edits.rateChange = (usd.changePercent > 0 ? '+' : '') + usd.changePercent.toFixed(2) + '%';
        edits.rateUp = usd.changePercent > 0;
      }
      onApply(edits);
      setBusy(null);
      onClose();
    } catch (e) {
      setBusy(null);
      setStatus('Rates pull failed (' + (e.message || 'error') + '). The buy/sell spread shown is estimated ±0.75% around mid when it succeeds.');
    }
  }

  const S = {
    wrap: { position: 'fixed', top: 64, right: 16, width: 380, maxHeight: 'calc(100vh - 96px)', overflowY: 'auto', background: '#040f18', border: '1px solid rgba(255,255,255,0.15)', zIndex: 300, padding: 18, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', fontFamily: 'Inter, sans-serif' },
    h: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontFamily: 'Roboto Mono, monospace', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#BFEA36', fontWeight: 700 },
    x: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 18, cursor: 'pointer', lineHeight: 1 },
    item: { display: 'flex', gap: 10, alignItems: 'center', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#F3F4F4', padding: '8px 10px', marginBottom: 6, cursor: 'pointer', fontSize: 13, lineHeight: 1.35, fontFamily: 'Inter, sans-serif' },
    thumb: { width: 52, height: 40, objectFit: 'cover', flexShrink: 0, background: '#050d11' },
    note: { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 10 },
    go: { width: '100%', background: '#BFEA36', color: '#050d11', border: 'none', padding: '10px', fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Roboto Mono, monospace', marginBottom: 12 } };


  return (
    <div style={S.wrap}>
      <div style={S.h}>
        <span style={S.title}>Pull from Site</span>
        <button style={S.x} onClick={onClose}>×</button>
      </div>
      <button style={S.go} disabled={!!busy} onClick={pullRates}>
        {busy === 'rates' ? 'Pulling…' : '↓ Live Rates → Daily Rate Card'}
      </button>
      {status && <div style={S.note}>{status}</div>}
      {stories &&
      <div>
          <div style={S.note}>Latest stories — click to fill Breaking, Article &amp; Video Cover:</div>
          {stories.map((s) =>
        <button key={s.id} style={S.item} onClick={() => applyStory(s)}>
              {s.image ? <img style={S.thumb} src={s.image} alt="" /> : <div style={S.thumb} />}
              <span>{s.title}</span>
            </button>
        )}
        </div>
      }
    </div>);

}
Object.assign(window, { SyncPanel });
