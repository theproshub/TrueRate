#!/usr/bin/env node
import { readStdinJson, postContext } from './lib/hook-io.mjs';
import { scan } from './lib/article-number-scan.mjs';

async function main() {
  const input = await readStdinJson();
  const fp = input.tool_input?.file_path || '';
  if (!/src\/data\/news\.ts$/.test(fp)) return;

  const text = input.tool_input?.new_string ?? input.tool_input?.content ?? '';
  const flags = scan(text);
  if (flags.length) {
    process.stdout.write(
      JSON.stringify(
        postContext(
          'anti-hallucination (type 1): these figures added to news.ts lack a period label — confirm each came from an article_data_sheet and add its period (e.g. "in March 2026" / "(Mar-26)"): ' +
            flags.join(', '),
        ),
      ),
    );
  }
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
