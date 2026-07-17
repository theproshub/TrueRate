#!/usr/bin/env node
import { readStdinJson, denyTool } from './lib/hook-io.mjs';
import { isPublishCommand, DENY_REASON } from './lib/publish-guard.mjs';

async function main() {
  const input = await readStdinJson();
  if (isPublishCommand(input.tool_name, input.tool_input || {})) {
    process.stdout.write(JSON.stringify(denyTool(DENY_REASON)));
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
