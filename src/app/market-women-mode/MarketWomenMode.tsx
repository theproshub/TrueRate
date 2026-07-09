'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PlayableVideo from '@/components/PlayableVideo';
import { VideoThumbnail } from '@/components/NewsThumbnail';

/**
 * Short financial-literacy videos, rendered with the same building blocks as the
 * /videos page: a branded category thumbnail (VideoThumbnail) wrapped in the
 * PlayableVideo facade. A real `youtubeId` plays inline; a blank id shows the
 * branded thumbnail as a placeholder until a real clip is published — the same
 * convention used across the rest of the /videos catalog.
 */
interface LiteracyVideo {
  title: string;
  category: string;
  duration: string;
  youtubeId?: string;
}

const FINANCIAL_LITERACY_VIDEOS: LiteracyVideo[] = [
  { title: 'How the US dollar rate changes your restock cost', category: 'Economy', duration: '3:12', youtubeId: '' },
  { title: 'Why prices go up — inflation explained simply',     category: 'Economy', duration: '2:45', youtubeId: '' },
  { title: 'Saving with a susu club — how it works',            category: 'Economy', duration: '4:02', youtubeId: '' },
  { title: 'Borrowing money: what the bank rate means for you', category: 'Economy', duration: '3:30', youtubeId: '' },
];

/**
 * Market Women Mode — a low-literacy accessibility surface.
 *
 * Design goals for a reader who cannot read fluently:
 *  - Meaning is carried by a big icon + a big number + color, not by prose.
 *  - Every card can be TAPPED to hear it read aloud (Web Speech API), and a
 *    single "Hear everything" button reads the whole page in plain English.
 *  - Only cards backed by a live feed appear. Nothing is fabricated — if a
 *    number is unavailable we say so and do not invent one (house rule).
 *
 * Live sources (mirrors IndicatorsStrip):
 *  - /api/rates       → USD→LRD (how many Liberian dollars buy one US dollar)
 *  - /api/indicators  → INFLATION (%), CBL_RATE (%)
 *  - /api/commodities → Brent crude (world oil price; honest proxy for the
 *                       fuel/transport cost pressure, NOT a local pump price)
 */

type Direction = 'up' | 'down' | null;

interface Card {
  id: string;
  icon: string;
  /** Plain, colloquial question a market trader would actually ask. */
  question: string;
  /** The big number, formatted for the screen (exact — never rounded). */
  display: string | null;
  /** Small plain-language unit line under the number. */
  unit: string;
  /** Extra plain explanation ("what this means for you"). */
  meaning: string;
  /** Direction chip — only shown when we have real change data. */
  direction: Direction;
  directionWord: string | null;
  /** Whether "up" is bad for the trader (raises her costs). Drives chip color. */
  upIsBad: boolean;
  /** Full sentence read aloud when the card is tapped. */
  spoken: string;
}

const currency = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "190.50" → "190 Liberian dollars and 50 cents" so TTS sounds natural and exact. */
function spokenMoney(n: number, unitWord: string): string {
  const whole = Math.trunc(n);
  const cents = Math.round((n - whole) * 100);
  const base = `${whole} ${unitWord}`;
  return cents > 0 ? `${base} and ${cents} cents` : base;
}

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function MarketWomenMode() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(true);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // --- Speech setup -------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTtsSupported(false);
      return;
    }
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer an English voice; fall back to whatever the device offers.
      voiceRef.current =
        voices.find((v) => /^en[-_]/i.test(v.lang)) ?? voices[0] ?? null;
    };
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.lang = voiceRef.current?.lang ?? 'en-US';
      u.rate = 0.92; // a touch slower for clarity
      u.onend = () => setSpeakingId((cur) => (cur === id ? null : cur));
      u.onerror = () => setSpeakingId((cur) => (cur === id ? null : cur));
      setSpeakingId(id);
      window.speechSynthesis.speak(u);
    },
    [],
  );

  // --- Live data ----------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/rates').then((r) => r.json()).catch(() => null),
      fetch('/api/indicators').then((r) => r.json()).catch(() => null),
      fetch('/api/commodities').then((r) => r.json()).catch(() => null),
    ]).then(([ratesData, indicatorsData, commoditiesData]) => {
      if (cancelled) return;

      const next: Card[] = [];

      // 1. US dollar — the star number.
      const usd = ratesData?.rates?.find(
        (r: { from: string; rate: number }) => r.from === 'USD',
      );
      if (usd && Number.isFinite(usd.rate)) {
        next.push({
          id: 'usd',
          icon: '💵',
          question: 'How much for one US dollar?',
          display: currency(usd.rate),
          unit: 'Liberian dollars',
          meaning: 'This is what you pay to buy one US dollar today.',
          direction: null,
          directionWord: null,
          upIsBad: true,
          spoken: `Today, one US dollar costs ${spokenMoney(usd.rate, 'Liberian dollars')}.`,
        });
      }

      const indicators: Array<{ key: string; value: number; changePercent: number | null }> =
        indicatorsData?.indicators ?? [];

      // 2. Prices this year — inflation. A positive rate means prices are rising.
      const infl = indicators.find((i) => i.key === 'INFLATION');
      if (infl && Number.isFinite(infl.value)) {
        const rising = infl.value >= 0;
        next.push({
          id: 'inflation',
          icon: '🛒',
          question: 'Are things costing more?',
          display: `${infl.value.toFixed(1)}%`,
          unit: rising ? 'higher than one year ago' : 'lower than one year ago',
          meaning: rising
            ? 'Prices in the market are going up. Your money buys a little less.'
            : 'Prices are easing compared with last year.',
          direction: rising ? 'up' : 'down',
          directionWord: rising ? 'Prices went up' : 'Prices went down',
          upIsBad: true,
          spoken: `Compared with one year ago, prices are about ${infl.value.toFixed(1)} percent ${
            rising ? 'higher. Things cost more in the market.' : 'lower.'
          }`,
        });
      }

      // 3. World oil price — Brent. Honest proxy for fuel/transport pressure.
      const oil = commoditiesData?.commodities?.find(
        (c: { name: string; price: number | null; changePercent: number | null }) =>
          c.name === 'Brent crude',
      );
      if (oil && oil.price !== null && Number.isFinite(oil.price)) {
        const cp: number | null = oil.changePercent;
        const dir: Direction = cp === null ? null : cp >= 0 ? 'up' : 'down';
        next.push({
          id: 'oil',
          icon: '⛽',
          question: 'What is happening to fuel?',
          display: `US$${currency(oil.price)}`,
          unit: 'for one barrel of oil in the world',
          meaning:
            'When world oil goes up, fuel and transport in Liberia usually cost more too.',
          direction: dir,
          directionWord:
            dir === 'up' ? 'Oil went up today' : dir === 'down' ? 'Oil went down today' : null,
          upIsBad: true,
          spoken: `The world oil price is ${spokenMoney(oil.price, 'US dollars')} for one barrel${
            dir === 'up'
              ? '. It went up today, so fuel and transport may cost more.'
              : dir === 'down'
                ? '. It went down today.'
                : '.'
          }`,
        });
      }

      // 4. Cost to borrow — CBL policy rate.
      const rate = indicators.find((i) => i.key === 'CBL_RATE');
      if (rate && Number.isFinite(rate.value)) {
        next.push({
          id: 'cbl',
          icon: '🏦',
          question: 'What does it cost to borrow money?',
          display: `${rate.value}%`,
          unit: "the Central Bank's rate",
          meaning:
            'When this rate is high, loans from the bank cost more to pay back.',
          direction: null,
          directionWord: null,
          upIsBad: true,
          spoken: `The Central Bank of Liberia's rate is ${rate.value} percent. When it is high, borrowing money costs more.`,
        });
      }

      if (next.length === 0) setFailed(true);
      setCards(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const speakEverything = useCallback(() => {
    if (!cards || cards.length === 0) return;
    const intro = `Here is today's money news for ${todayLabel}. `;
    speak('all', intro + cards.map((c) => c.spoken).join(' '));
  }, [cards, speak]);

  const isSpeaking = speakingId !== null;

  return (
    <main className="min-h-screen bg-brand-surface text-brand-ink">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Header row: back home + title */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="Back to TrueRate home"
            className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-brand-azure bg-white px-4 text-lg font-bold text-brand-ink no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              ←
            </span>
            Back
          </Link>
          <p className="text-right text-base font-semibold text-brand-light">
            <span aria-hidden="true" className="mr-1">
              📅
            </span>
            {todayLabel}
          </p>
        </div>

        <h1 className="mb-1 text-3xl font-black leading-tight sm:text-4xl">
          Market Women Mode
        </h1>
        <p className="mb-5 text-lg text-brand-light">
          Tap any box to hear it. Today&rsquo;s money news, made simple.
        </p>

        {/* Hear everything / Stop */}
        {ttsSupported ? (
          <div className="mb-6" aria-live="polite">
            {isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 text-xl font-black text-white shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
              >
                <span aria-hidden="true" className="text-2xl">
                  ⏹
                </span>
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={speakEverything}
                disabled={!cards || cards.length === 0}
                className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-brand-accent-ink text-xl font-black text-white shadow-lg transition-colors hover:bg-brand-accent-ink/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent disabled:opacity-50"
              >
                <span aria-hidden="true" className="text-2xl">
                  🔊
                </span>
                Hear everything
              </button>
            )}
          </div>
        ) : (
          <p className="mb-6 rounded-xl bg-brand-muted px-4 py-3 text-base text-brand-light">
            Your phone cannot read out loud, but you can still see today&rsquo;s numbers below.
          </p>
        )}

        {/* Two-column on desktop: live numbers (left) + short lessons (right);
            stacks to one column on phones. */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

        {/* Left column — today's live numbers */}
        <section aria-labelledby="todays-numbers">
        <h2 id="todays-numbers" className="mb-4 text-2xl font-black">
          <span aria-hidden="true" className="mr-2">📊</span>
          Today&rsquo;s Numbers
        </h2>
        {cards === null && !failed ? (
          <p className="py-10 text-center text-xl font-semibold text-brand-light" aria-live="polite">
            Please wait&hellip;
          </p>
        ) : failed ? (
          <p className="rounded-2xl bg-white p-6 text-center text-xl font-semibold text-brand-light">
            Today&rsquo;s numbers are not ready. Please check again soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4">
            {cards!.map((card) => {
              const speakingThis = speakingId === card.id;
              const chipBad = card.direction === 'up' ? card.upIsBad : !card.upIsBad;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() =>
                      speakingThis ? stopSpeaking() : speak(card.id, card.spoken)
                    }
                    aria-label={`${card.question} ${card.display ?? ''} ${card.unit}. Tap to listen.`}
                    aria-pressed={speakingThis}
                    className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-5 text-left shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent ${
                      speakingThis ? 'border-brand-accent-ink' : 'border-brand-azure'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-5xl leading-none sm:text-6xl"
                    >
                      {card.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-brand-light">
                        {card.question}
                      </span>
                      <span className="block text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        {card.display}
                      </span>
                      <span className="block text-base font-medium text-brand-light">
                        {card.unit}
                      </span>

                      {card.direction && card.directionWord && (
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-base font-bold ${
                            chipBad
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          <span aria-hidden="true">
                            {card.direction === 'up' ? '▲' : '▼'}
                          </span>
                          {card.directionWord}
                        </span>
                      )}

                      <span className="mt-2 block text-base leading-snug text-brand-ink">
                        {card.meaning}
                      </span>
                    </span>

                    {/* Speaker affordance — reinforces "tap to hear". */}
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-3xl leading-none ${
                        speakingThis ? 'motion-safe:animate-pulse' : ''
                      }`}
                    >
                      {speakingThis ? '⏹' : '🔊'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        </section>

        {/* Right column — Watch & Learn: short financial-literacy videos as big
            tap-to-play thumbnails (same building blocks as the /videos page). */}
        {FINANCIAL_LITERACY_VIDEOS.length > 0 && (
          <section aria-labelledby="watch-learn">
            <h2 id="watch-learn" className="mb-1 text-2xl font-black">
              <span aria-hidden="true" className="mr-2">
                📺
              </span>
              Watch &amp; Learn
            </h2>
            <p className="mb-4 text-lg text-brand-light">
              Short money lessons. Tap a picture to watch and listen.
            </p>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {FINANCIAL_LITERACY_VIDEOS.map((v, i) => (
                <li key={i}>
                  <PlayableVideo
                    id={v.youtubeId}
                    label={v.title}
                    className="group relative block aspect-video w-full overflow-hidden rounded-2xl border-2 border-brand-azure focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-accent"
                  >
                    <VideoThumbnail
                      category={v.category}
                      duration={v.duration}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    />
                    {/* Big, obvious play affordance for non-readers. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                        <svg
                          className="h-7 w-7 translate-x-0.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </PlayableVideo>
                  <p className="mt-2 text-lg font-bold leading-snug">{v.title}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        </div>

        {/* Honest footnote — plain language, still truthful about the oil proxy. */}
        <p className="mt-8 text-center text-sm text-brand-light">
          Numbers come from the Central Bank of Liberia and world markets. The oil price
          is the world price, not the price at the pump. Data updates through the day.
        </p>
      </div>
    </main>
  );
}
