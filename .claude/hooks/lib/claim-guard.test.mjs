import { evaluate } from './claim-guard.mjs';

const user = (text) => ({ type: 'user', message: { content: [{ type: 'text', text }] } });
const asst = (blocks) => ({ type: 'assistant', message: { content: blocks } });
const say = (text) => ({ type: 'text', text });
const bash = (command) => ({ type: 'tool_use', name: 'Bash', input: { command } });
const fetchTool = () => ({ type: 'tool_use', name: 'WebFetch', input: {} });

describe('claim-guard evaluate', () => {
  it('warns on a success claim with no command run this turn', () => {
    const w = evaluate([user('fix it'), asst([say('Done — all tests pass now.')])]);
    expect(w.some((s) => /type 7/.test(s))).toBe(true);
  });

  it('is silent when a command was run this turn', () => {
    const w = evaluate([user('fix it'), asst([bash('npx vitest run'), say('All tests pass.')])]);
    expect(w).toEqual([]);
  });

  it('warns on an external URL introduced without a fetch this turn', () => {
    const w = evaluate([user('cite it'), asst([say('See https://data.imf.org/x for the figure.')])]);
    expect(w.some((s) => /type 3/.test(s))).toBe(true);
  });

  it('is silent when a fetch happened this turn', () => {
    const w = evaluate([user('cite it'), asst([fetchTool(), say('See https://data.imf.org/x.')])]);
    expect(w).toEqual([]);
  });

  it('ignores claims from before the last user message', () => {
    const w = evaluate([
      user('older'), asst([say('tests pass')]),
      user('newer'), asst([say('here is a plan')]),
    ]);
    expect(w).toEqual([]);
  });

  it('ignores localhost URLs', () => {
    const w = evaluate([user('go'), asst([say('open http://localhost:3000 to check')])]);
    expect(w).toEqual([]);
  });
});
