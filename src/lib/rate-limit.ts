import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const HAS_REDIS = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const redis = HAS_REDIS
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const limiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit {
  const key = `${limit}:${windowMs}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      analytics: true,
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

// ── In-memory fallback (dev / no Redis credentials) ──────────────────────────
const windows = new Map<string, number[]>();

function inMemoryLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = now - windowMs;

  let timestamps = windows.get(key);
  if (!timestamps) {
    timestamps = [];
    windows.set(key, timestamps);
  }

  while (timestamps.length > 0 && timestamps[0] < cutoff) {
    timestamps.shift();
  }

  if (timestamps.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  return { allowed: true, remaining: limit - timestamps.length };
}

// ─��� Public API ───────────────────────────────────────────────────────────────

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!HAS_REDIS) {
    return inMemoryLimit(key, limit, windowMs);
  }

  const limiter = getUpstashLimiter(limit, windowMs);
  const { success, remaining } = await limiter.limit(key);
  return { allowed: success, remaining };
}

export function rateLimitHeaders(remaining: number, limit: number, windowMs: number) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil((Date.now() + windowMs) / 1000)),
  };
}
