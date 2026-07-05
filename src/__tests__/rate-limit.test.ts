import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Upstash so the in-memory fallback is used
vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

// Dynamic import after env is stubbed
const { rateLimit } = await import('@/lib/rate-limit');

describe('rateLimit (in-memory fallback)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('allows requests within limit', async () => {
    const key = `test-${Date.now()}-allow`;
    const result = await rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('blocks after limit is exhausted', async () => {
    const key = `test-${Date.now()}-block`;
    await rateLimit(key, 2, 60_000);
    await rateLimit(key, 2, 60_000);
    const third = await rateLimit(key, 2, 60_000);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it('resets after window expires', async () => {
    const key = `test-${Date.now()}-reset`;
    await rateLimit(key, 1, 1_000);
    const blocked = await rateLimit(key, 1, 1_000);
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(1_001);

    const allowed = await rateLimit(key, 1, 1_000);
    expect(allowed.allowed).toBe(true);
  });
});
