import { TWEAK_DEFAULTS, type CardTweaks } from './templates/types';

export const STORAGE_KEY = 'tr_admin_cards_v1';

/** Don't persist huge inline images — they live in component state for the session. */
export function slimForStorage(tweaks: CardTweaks): CardTweaks {
  const slim = { ...tweaks };
  for (const k of Object.keys(slim) as (keyof CardTweaks)[]) {
    const v = slim[k];
    if (typeof v === 'string' && v.startsWith('data:') && v.length > 100_000) {
      (slim[k] as string) = '';
    }
  }
  return slim;
}

/** Keep only keys that exist in TWEAK_DEFAULTS and whose value type matches the default's type. */
function sanitizeSavedTweaks(parsed: Record<string, unknown>): Partial<CardTweaks> {
  const clean: Partial<CardTweaks> = {};
  for (const key of Object.keys(parsed) as (keyof CardTweaks)[]) {
    if (!(key in TWEAK_DEFAULTS)) continue;
    const value = parsed[key];
    if (typeof value === typeof TWEAK_DEFAULTS[key]) {
      (clean[key] as unknown) = value;
    }
  }
  return clean;
}

export function loadSavedTweaks(raw: string | null): Partial<CardTweaks> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? sanitizeSavedTweaks(parsed) : {};
  } catch {
    return {};
  }
}
