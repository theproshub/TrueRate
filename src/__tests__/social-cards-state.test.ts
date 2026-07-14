import { describe, it, expect } from 'vitest';
import {
  TWEAK_DEFAULTS,
  IMAGE_KEYS,
} from '@/app/admin/social-cards/_components/templates/types';
import {
  slimForStorage,
  loadSavedTweaks,
  STORAGE_KEY,
} from '@/app/admin/social-cards/_components/state';

describe('social-cards state', () => {
  it('defaults have no baked-in image URLs and start on breaking/terminal slide 0', () => {
    for (const key of IMAGE_KEYS) expect(TWEAK_DEFAULTS[key]).toBe('');
    expect(TWEAK_DEFAULTS.templateType).toBe('breaking');
    expect(TWEAK_DEFAULTS.variant).toBe('terminal');
    expect(TWEAK_DEFAULTS.explainerSlide).toBe(0);
  });

  it('slimForStorage blanks data URLs over 100KB and keeps small values', () => {
    const big = 'data:image/png;base64,' + 'a'.repeat(200_000);
    const slim = slimForStorage({ ...TWEAK_DEFAULTS, breakingImage: big, articleImage: 'https://x/y.webp' });
    expect(slim.breakingImage).toBe('');
    expect(slim.articleImage).toBe('https://x/y.webp');
  });

  it('loadSavedTweaks tolerates garbage and null', () => {
    expect(loadSavedTweaks(null)).toEqual({});
    expect(loadSavedTweaks('{not json')).toEqual({});
    expect(loadSavedTweaks('{"headline":"X"}')).toEqual({ headline: 'X' });
  });

  it('uses the fresh storage key, not the prototype key', () => {
    expect(STORAGE_KEY).toBe('tr_admin_cards_v1');
  });
});
