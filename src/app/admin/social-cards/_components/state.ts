import type { CardTweaks } from './templates/types';

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

export function loadSavedTweaks(raw: string | null): Partial<CardTweaks> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}
