export function parseJsonOrEmpty(raw) {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function readStdinJson() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return parseJsonOrEmpty(Buffer.concat(chunks).toString('utf8'));
}

export function denyTool(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}

export function stopAdvisory({ systemMessage, additionalContext } = {}) {
  const out = {};
  if (additionalContext) {
    out.hookSpecificOutput = { hookEventName: 'Stop', additionalContext };
  }
  if (systemMessage) out.systemMessage = systemMessage;
  return out;
}

export function postContext(context) {
  return {
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: context },
  };
}
