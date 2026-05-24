// Shared YouTube helpers for the TrueRate channel.
// Each video card across the site carries a `youtubeId` (the part after
// `watch?v=`). Large cards embed the player inline via <PlayableVideo>; small
// list cards link out with videoHref(). A blank id falls back to the channel.

export const CHANNEL_ID = 'UCe88NPQk1H-R413r2SqcbXg';
export const CHANNEL_URL = `https://www.youtube.com/channel/${CHANNEL_ID}`;

export function videoHref(youtubeId?: string): string {
  return youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : CHANNEL_URL;
}
