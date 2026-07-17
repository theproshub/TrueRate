import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { isPublishCommand, DENY_REASON } from './publish-guard.mjs';

const RUNNER = join(dirname(fileURLToPath(import.meta.url)), '..', 'publish-guard.mjs');
function runHook(payload) {
  return execFileSync('node', [RUNNER], { input: JSON.stringify(payload), encoding: 'utf8' });
}

describe('isPublishCommand', () => {
  it('flags running the bulk importer with node', () => {
    expect(isPublishCommand('Bash', { command: 'node scripts/import-news-articles.mjs' })).toBe(true);
  });
  it('flags running the importer with env-file flags', () => {
    expect(isPublishCommand('Bash', { command: 'node --env-file=.env.local scripts/import-news-articles.mjs' })).toBe(true);
  });
  it('flags running a *publish*.mjs script with node', () => {
    expect(isPublishCommand('Bash', { command: 'node scripts/publish-feed.mjs' })).toBe(true);
  });
  it('does NOT flag inspecting the importer with cat', () => {
    expect(isPublishCommand('Bash', { command: 'cat scripts/import-news-articles.mjs' })).toBe(false);
  });
  it('does NOT flag grep of the importer', () => {
    expect(isPublishCommand('Bash', { command: 'grep -n published scripts/import-news-articles.mjs' })).toBe(false);
  });
  it('does NOT flag a commit message mentioning the importer', () => {
    expect(isPublishCommand('Bash', { command: 'git commit -m "refactor import-news-articles"' })).toBe(false);
  });
  it('does NOT flag Edit/Write tools (only Bash is gated)', () => {
    expect(isPublishCommand('Edit', { file_path: 'src/data/news.ts', new_string: "status: 'published'" })).toBe(false);
  });
  it('does NOT flag an unrelated command', () => {
    expect(isPublishCommand('Bash', { command: 'ls -la' })).toBe(false);
  });
});

describe('publish-guard runner (integration)', () => {
  it('denies when the bulk importer is run', () => {
    const out = runHook({ tool_name: 'Bash', tool_input: { command: 'node scripts/import-news-articles.mjs' } });
    const parsed = JSON.parse(out);
    expect(parsed.hookSpecificOutput.permissionDecision).toBe('deny');
    expect(parsed.hookSpecificOutput.permissionDecisionReason).toBe(DENY_REASON);
  });
  it('emits nothing (allow) for an unrelated command', () => {
    const out = runHook({ tool_name: 'Bash', tool_input: { command: 'ls -la' } });
    expect(out.trim()).toBe('');
  });
});
