#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { readStdinJson, stopAdvisory } from './lib/hook-io.mjs';
import { evaluate } from './lib/claim-guard.mjs';

async function main() {
  const input = await readStdinJson();
  let entries = [];
  try {
    entries = readFileSync(input.transcript_path, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  } catch {
    return; // no transcript → stay silent
  }
  const warnings = evaluate(entries);
  if (warnings.length) {
    const joined = warnings.join(' | ');
    process.stdout.write(
      JSON.stringify(
        stopAdvisory({
          systemMessage: '⚠︎ anti-hallucination: ' + joined,
          additionalContext:
            'Unverified claims flagged by claim-guard: ' + joined + ' See /anti-hallucination.',
        }),
      ),
    );
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
