import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getMcpAnalyticsPayload } from '@/lib/analytics/mcp-data';
import { sliceByTimeframe } from '@/lib/analytics/stats';
import type { AnalyticsItem } from '@/lib/analytics/types';

// Open Graph / Twitter card for /analytics.
// Rule: chart pages show the chart that's actually on the page. This mirrors the
// terminal's default focus view — the first focused series (USD/LRD), 1Y window,
// normalized to % change from the start of the window, direction-coloured — on
// the page's light card. If the live series is unavailable we fall back to the
// plain branded card (site-wide opengraph-image) so imageless states still show
// the TrueRate mark.
export const alt = 'TrueRate — Liberia macro trends & analytics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 900; // match the page ISR window

// Mirrors src/components/analytics/terminal/colors.ts (DIRECTION_HEX).
const DIRECTION_HEX = { up: '#00a757', down: '#e11b22', neutral: '#8a9099' } as const;

// Default focus = first item of the first terminal section (Currency → USD/LRD),
// then Prices, then National Accounts as fallbacks. Mirrors SECTION_CONFIG order.
const PREFERRED_IDS = ['LBR_EXR_EPR_1', 'LBR_CPI_0', 'LBR_NAT_0'];

function formatValue(item: AnalyticsItem, v: number): string {
  switch (item.format) {
    case 'rate':
      return v.toFixed(2);
    case 'pct':
      return `${v.toFixed(1)}%`;
    case 'usd':
      return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
    default:
      return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
  }
}

function formatPct(v: number): string {
  return `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}%`;
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
}

function pickFeatured(items: AnalyticsItem[]): AnalyticsItem | null {
  for (const id of PREFERRED_IDS) {
    const hit = items.find((i) => i.id === id && i.series.length >= 2);
    if (hit) return hit;
  }
  const withHistory = items.filter((i) => i.series.length >= 2);
  if (withHistory.length === 0) return null;
  return withHistory.sort((a, b) => b.series.length - a.series.length)[0];
}

export default async function Image() {
  let item: AnalyticsItem | null = null;
  try {
    const payload = await getMcpAnalyticsPayload();
    item = pickFeatured(payload.items);
  } catch {
    item = null;
  }

  // No live series → degrade to the branded card (rule: imageless → mark).
  // Uses the same official brand-delivery artwork as the site-wide OG card.
  if (!item) {
    const brand = await readFile(join(process.cwd(), 'public', 'TRUERATE BRAND DELIVERY - 2.png'));
    const brandSrc = `data:image/png;base64,${brand.toString('base64')}`;
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
          <img src={brandSrc} width={size.width} height={size.height} style={{ objectFit: 'cover' }} alt="" />
        </div>
      ),
      { ...size },
    );
  }

  // ── Same transform as TrendChart: 1Y window, % change from window start ──
  const windowed = sliceByTimeframe(item.series, '1Y');
  const base = windowed[0].value;
  const pts = windowed.map((p) => ({
    date: p.date,
    y: base !== 0 ? ((p.value - base) / Math.abs(base)) * 100 : 0,
  }));
  const lastY = pts[pts.length - 1].y;
  const dir = lastY > 0.0001 ? 'up' : lastY < -0.0001 ? 'down' : 'neutral';
  const color = DIRECTION_HEX[dir];

  const current = item.current ?? windowed[windowed.length - 1].value;
  const value = formatValue(item, current);

  // ── Chart geometry (SVG local coords = viewBox) ──
  const W = 1040;
  const H = 230;
  const plot = { left: 0, right: 952, top: 12, bottom: 196 }; // right gutter holds the pill
  const ys = pts.map((p) => p.y);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 0);
  const padY = (maxY - minY) * 0.12 || 1;
  const domTop = maxY + padY;
  const domBot = minY - padY;
  const n = pts.length;

  const px = (i: number) => plot.left + (n === 1 ? 0 : (i / (n - 1)) * (plot.right - plot.left));
  const py = (v: number) =>
    plot.top + ((domTop - v) / (domTop - domBot)) * (plot.bottom - plot.top);

  const xy = pts.map((p, i) => [px(i), py(p.y)] as const);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area =
    `M ${xy[0][0].toFixed(1)},${plot.bottom} ` +
    xy.map(([x, y]) => `L ${x.toFixed(1)},${y.toFixed(1)}`).join(' ') +
    ` L ${xy[n - 1][0].toFixed(1)},${plot.bottom} Z`;

  const yBaseline = py(0);
  const yLast = py(lastY);
  const xLast = xy[n - 1][0];
  const pillText = formatPct(lastY);
  const pillW = pillText.length * 11 + 16;

  // icon-light = the dark-on-lime mark intended for light surfaces (the header's
  // white wordmark relies on a CSS brightness filter that Satori can't apply).
  const mark = await readFile(join(process.cwd(), 'public', 'icon-light.png'));
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#F5F5F5',
          padding: 44,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row — mark + wordmark on light */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={markSrc} width={50} height={50} style={{ borderRadius: 11 }} alt="" />
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 800, color: '#111827', letterSpacing: -0.5 }}>TrueRate</div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              letterSpacing: 2,
              fontWeight: 700,
              color: '#6b7280',
              textTransform: 'uppercase',
            }}
          >
            Trends &amp; Analytics
          </div>
        </div>

        {/* White focus card — mirrors FocusPanel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 16,
            padding: 32,
          }}
        >
          {/* Header: label + value + change */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 18, letterSpacing: 2, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 6 }}>
                <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', fontSize: 28, fontWeight: 700, color, paddingBottom: 6 }}>
                  {pillText}
                  <span style={{ display: 'flex', fontSize: 16, color: '#6b7280', marginLeft: 8, paddingBottom: 3 }}>1Y</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 16, color: '#9ca3af' }}>{item.unit}</div>
          </div>

          {/* Area chart — same shape as TrendChart. SVG is geometry only
              (Satori can't lay out <text> or percentage widths); the pill and
              axis labels are positioned HTML over the chart. */}
          <div style={{ display: 'flex', position: 'relative', width: W, height: H, marginTop: 14 }}>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                  <stop offset="92%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Break-even 0% baseline */}
              <line x1={plot.left} y1={yBaseline} x2={plot.right} y2={yBaseline} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

              <path d={area} fill="url(#fill)" />
              <polyline points={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

              {/* Current-level dashed guide + endpoint dot */}
              <line x1={plot.left} y1={yLast} x2={plot.right} y2={yLast} stroke={color} strokeDasharray="6 5" strokeWidth="1.5" />
              <circle cx={xLast} cy={yLast} r="5" fill={color} stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Endpoint pill — net % move, in the right gutter at the line's end */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                left: plot.right + 6,
                top: yLast - 16,
                width: pillW,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color,
                borderRadius: 6,
                fontSize: 17,
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              {pillText}
            </div>

            {/* First / last date ticks */}
            <div style={{ display: 'flex', position: 'absolute', left: plot.left, bottom: 0, fontSize: 15, color: '#9ca3af' }}>
              {formatDate(pts[0].date)}
            </div>
            <div style={{ display: 'flex', position: 'absolute', left: plot.right - 70, bottom: 0, width: 70, justifyContent: 'flex-end', fontSize: 15, color: '#9ca3af' }}>
              {formatDate(pts[n - 1].date)}
            </div>
          </div>

          {/* Source */}
          <div style={{ display: 'flex', fontSize: 15, color: '#9ca3af', marginTop: 'auto', paddingTop: 8 }}>
            Source: {item.source}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
