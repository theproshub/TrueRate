const windows = new Map<string, number[]>();

/**
 * In-memory sliding-window rate limiter. Suitable for Vercel Fluid Compute
 * where function instances are reused across requests. Not distributed — each
 * instance tracks its own window, so effective limits are per-instance * N.
 * For stricter enforcement, swap in Upstash Ratelimit.
 */
export function rateLimit(
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

  // Evict expired entries
  while (timestamps.length > 0 && timestamps[0] < cutoff) {
    timestamps.shift();
  }

  if (timestamps.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  return { allowed: true, remaining: limit - timestamps.length };
}

export function rateLimitHeaders(remaining: number, limit: number, windowMs: number) {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(Math.ceil((Date.now() + windowMs) / 1000)),
  };
}
