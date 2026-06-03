/** Direction of a change — drives semantic color + arrow glyph. */
export type Direction = 'up' | 'down' | 'neutral';

/**
 * Restrained semantic palette. Up = green, down = red, steady = neutral grey.
 * The single brand accent (#BFEA36) is reserved for the active timeframe + the
 * focused chart line — never for up/down (color is for direction only).
 */
export const ACCENT = '#BFEA36';

/** Hex for charts (recharts needs raw colors). */
export const DIRECTION_HEX: Record<Direction, string> = {
  up: '#00a757',     // pos token
  down: '#e11b22',   // neg token
  neutral: '#8a9099', // muted grey
};

/** Tailwind text class for direction. */
export function directionClass(d: Direction): string {
  if (d === 'up') return 'text-pos';
  if (d === 'down') return 'text-neg';
  return 'text-gray-500';
}

export function arrow(d: Direction): string {
  if (d === 'up') return '▲';
  if (d === 'down') return '▼';
  return '';
}
