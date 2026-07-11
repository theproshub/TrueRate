'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

const SOURCES = ['daily_brief', 'business_brief'] as const;
type NewsletterSource = (typeof SOURCES)[number];

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribeNewsletter(input: {
  email: string;
  source: string;
}): Promise<SubscribeResult> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = await rateLimit(`newsletter:${ip}`, 5, 60_000 * 15);
  if (!allowed) {
    return { ok: false, error: 'Too many attempts. Please try again in a few minutes.' };
  }

  const email = (input.email ?? '').trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }

  const source: NewsletterSource = (SOURCES as readonly string[]).includes(input.source)
    ? (input.source as NewsletterSource)
    : 'daily_brief';

  const sb = await createClient();
  const userAgent = (await headers()).get('user-agent');

  const { error } = await sb.from('newsletter_subscribers').insert({
    email,
    source,
    user_agent: userAgent,
  });

  // 23505 = unique violation: already subscribed. Idempotent success — the
  // subscriber is on the list, which is all they asked for.
  if (error && error.code !== '23505') {
    console.error('[subscribeNewsletter] insert failed:', error.message);
    return { ok: false, error: 'Subscriptions aren’t available right now. Please try again later.' };
  }

  return { ok: true };
}
