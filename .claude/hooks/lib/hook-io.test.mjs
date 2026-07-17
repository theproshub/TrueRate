import { parseJsonOrEmpty, denyTool, stopAdvisory, postContext } from './hook-io.mjs';

describe('hook-io', () => {
  it('parseJsonOrEmpty returns {} for empty or bad input', () => {
    expect(parseJsonOrEmpty('')).toEqual({});
    expect(parseJsonOrEmpty('not json')).toEqual({});
    expect(parseJsonOrEmpty('{"a":1}')).toEqual({ a: 1 });
  });

  it('denyTool builds the PreToolUse deny contract', () => {
    expect(denyTool('nope')).toEqual({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: 'nope',
      },
    });
  });

  it('stopAdvisory includes only provided fields', () => {
    expect(stopAdvisory({ systemMessage: 'warn' })).toEqual({ systemMessage: 'warn' });
    expect(stopAdvisory({ additionalContext: 'ctx' })).toEqual({
      hookSpecificOutput: { hookEventName: 'Stop', additionalContext: 'ctx' },
    });
  });

  it('postContext builds the PostToolUse context contract', () => {
    expect(postContext('hi')).toEqual({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: 'hi' },
    });
  });
});
