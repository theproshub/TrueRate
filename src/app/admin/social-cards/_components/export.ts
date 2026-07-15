import type { TemplateFormat } from './templates/types';

export function makeFilename(format: TemplateFormat, date: Date = new Date(), slide?: number): string {
  const ymd = date.toISOString().slice(0, 10);
  const slidePart = slide === undefined ? '' : `-${slide + 1}`;
  return `truerate-${format}${slidePart}-${ymd}.png`;
}

/**
 * Export the unscaled card node at exact platform dimensions (pixelRatio 1 —
 * spec decision; 1080×1350 is already the native feed size).
 */
export async function exportNodeAsPng(
  node: HTMLElement,
  size: { w: number; h: number },
  filename: string,
): Promise<void> {
  const { toPng } = await import('html-to-image');

  const originalTransform = node.style.transform;
  node.style.transform = 'none';
  try {
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 100)); // let layout settle post-transform

    const dataUrl = await toPng(node, {
      width: size.w,
      height: size.h,
      pixelRatio: 1,
      backgroundColor: '#050d11',
      cacheBust: true,
    });

    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    node.style.transform = originalTransform;
  }
}
