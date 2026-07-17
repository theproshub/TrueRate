#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readStdinJson, denyTool } from './lib/hook-io.mjs';
import { detectPublish, decide } from './lib/publish-guard.mjs';

async function main() {
  const input = await readStdinJson();
  const det = detectPublish(input.tool_name, input.tool_input || {});
  if (!det.isPublish) return;

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const lookup = (slug) => {
    try {
      const raw = readFileSync(join(root, '.claude/state/number-lock', slug + '.json'), 'utf8');
      const j = JSON.parse(raw);
      const issuedAt = Date.parse(j.issued_at);
      if (!j.issued_at || Number.isNaN(issuedAt)) return { valid: false };
      return { valid: true, issuedAt };
    } catch {
      return { valid: false };
    }
  };

  const verdict = decide(det, lookup);
  if (verdict.deny) {
    process.stdout.write(JSON.stringify(denyTool(verdict.reason)));
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
