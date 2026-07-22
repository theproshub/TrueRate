// Turn a 1080×1920 social card PNG into a Reel-ready MP4.
//
// The social-cards studio (/admin/social-cards) exports stills. Facebook Reels
// and Instagram Reels only accept video, and Reels is the one format Meta
// distributes to non-followers — so a still is a hard ceiling on reach, paid
// and organic alike. This bridges that gap: one PNG in, one MP4 out, usable on
// FB Reels, IG Reels and both Stories.
//
// Deliberately NOT included:
//   - Music. Bundling a track invites copyright strikes. The FB/IG Reels
//     composers have a licensed library — add it there at upload time.
//   - Burned-in captions. The card's own type is the caption, which is what
//     makes it readable muted (and muted is the norm on mobile data).
//
// Usage:
//   npm run reel -- <card.png> [--seconds 6] [--static] [--out path.mp4]
//
//   --seconds N   clip length (default 6)
//   --static      no motion; a dead still frame. Off by default because a
//                 frozen frame reads as a broken video and underperforms.
//   --out PATH    output path (default: alongside the input, .mp4)

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import ffmpegPath from 'ffmpeg-static';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}
function flag(name) {
  return process.argv.includes(`--${name}`);
}

const FPS = 30;
const W = 1080;
const H = 1920;
const MAX_ZOOM = 1.04;

const input = process.argv[2];

if (!input || input.startsWith('--')) {
  console.error('Usage: npm run reel -- <card.png> [--seconds 6] [--static] [--out path.mp4]');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`No such file: ${input}`);
  process.exit(1);
}
if (!ffmpegPath) {
  console.error('ffmpeg-static did not resolve a binary. Try: npm install --save-dev ffmpeg-static');
  process.exit(1);
}

const seconds = Number(arg('seconds') ?? 6);
if (!Number.isFinite(seconds) || seconds <= 0) {
  console.error(`--seconds must be a positive number (got: ${arg('seconds')})`);
  process.exit(1);
}

const output = arg('out') ?? path.join(
  path.dirname(input),
  `${path.basename(input, path.extname(input))}.mp4`,
);

const frames = Math.round(seconds * FPS);

// Upscale before zoompan: zooming a 1080-wide source directly samples up from
// too few pixels and shimmers. 2× headroom keeps the pan clean.
//
// The motion path reads the image once (no -loop) and lets zoompan expand it
// into `d` frames, so clip length is governed by d alone. The static path has
// nothing to expand, so it loops the still and lets -t bound it.
const motion = [
  `scale=${W * 2}:${H * 2}`,
  `zoompan=z='min(zoom+${(MAX_ZOOM - 1) / frames},${MAX_ZOOM})'`
    + `:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`
    + `:d=${frames}:s=${W}x${H}:fps=${FPS}`,
].join(',');

const still = `scale=${W}:${H},fps=${FPS}`;

const args = [
  ...(flag('static') ? ['-loop', '1'] : []), '-i', input,
  // Silent stereo track: some Meta surfaces expect an audio stream to exist.
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
  '-t', String(seconds),
  '-vf', flag('static') ? still : motion,
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '18',
  '-pix_fmt', 'yuv420p', // required for playback on Meta/Apple surfaces
  '-c:a', 'aac',
  '-b:a', '128k',
  '-movflags', '+faststart',
  '-shortest',
  '-y', output,
];

console.log(`→ ${path.basename(input)} → ${path.basename(output)}  (${seconds}s, ${flag('static') ? 'static' : 'slow zoom'})`);

const ff = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });

let stderr = '';
ff.stderr.on('data', (d) => { stderr += d.toString(); });

ff.on('error', (err) => {
  console.error(`Failed to run ffmpeg: ${err.message}`);
  process.exit(1);
});

ff.on('close', (code) => {
  if (code !== 0) {
    console.error(`ffmpeg exited ${code}:\n${stderr.split('\n').slice(-20).join('\n')}`);
    process.exit(1);
  }
  console.log(`✓ ${output}`);
  console.log('  Add licensed music in the FB/IG Reels composer at upload.');
});
