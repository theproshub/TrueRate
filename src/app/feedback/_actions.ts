'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

const TYPES = ['general', 'data_error', 'feature_request', 'bug_report', 'content_issue'] as const;
type FeedbackType = (typeof TYPES)[number];

export type FeedbackResult = { ok: true } | { ok: false; error: string };

export async function submitFeedback(input: {
  type: string;
  email: string;
  message: string;
}): Promise<FeedbackResult> {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = rateLimit(`feedback:${ip}`, 5, 60_000 * 15);
  if (!allowed) {
    return { ok: false, error: 'Too many submissions. Please try again in a few minutes.' };
  }

  const message = (input.message ?? '').trim();
  if (message.length < 5) {
    return { ok: false, error: 'Please enter a message (at least 5 characters).' };
  }
  if (message.length > 5000) {
    return { ok: false, error: 'Message is too long (maximum 5,000 characters).' };
  }

  const email = (input.email ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address, or leave it blank.' };
  }

  const type: FeedbackType = (TYPES as readonly string[]).includes(input.type)
    ? (input.type as FeedbackType)
    : 'general';

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const userAgent = (await headers()).get('user-agent');

  const { error } = await sb.from('feedback').insert({
    type,
    email: email || null,
    message,
    user_id: user?.id ?? null,
    user_agent: userAgent,
  });

  if (error) {
    console.error('[submitFeedback] insert failed:', error.message);
    return { ok: false, error: 'Something went wrong submitting your feedback. Please try again.' };
  }

  return { ok: true };
}
