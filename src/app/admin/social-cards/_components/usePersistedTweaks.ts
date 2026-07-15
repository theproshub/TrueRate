'use client';

import { useEffect, useState } from 'react';
import { TWEAK_DEFAULTS, type CardTweaks } from './templates/types';
import { STORAGE_KEY, slimForStorage, loadSavedTweaks } from './state';

export function usePersistedTweaks() {
  const [tweaks, setTweaks] = useState<CardTweaks>(TWEAK_DEFAULTS);

  // Hydrate from localStorage after mount (server render uses defaults).
  useEffect(() => {
    const saved = loadSavedTweaks(localStorage.getItem(STORAGE_KEY));
    if (Object.keys(saved).length) setTweaks((prev) => ({ ...prev, ...saved }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slimForStorage(tweaks)));
    } catch {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* quota — give up */ }
    }
  }, [tweaks]);

  const setTweak = <K extends keyof CardTweaks>(key: K, value: CardTweaks[K]) =>
    setTweaks((prev) => ({ ...prev, [key]: value }));
  const applyMany = (edits: Partial<CardTweaks>) =>
    setTweaks((prev) => ({ ...prev, ...edits }));

  return { tweaks, setTweak, applyMany };
}
