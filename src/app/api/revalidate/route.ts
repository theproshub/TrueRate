import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const VALID_PATHS: Record<string, string[]> = {
  rates: ['/api/rates', '/markets'],
  indicators: ['/api/indicators', '/economy', '/'],
  commodities: ['/api/commodities', '/markets'],
  articles: ['/news', '/'],
  feed: ['/api/feed', '/'],
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let tags: string[];
  try {
    const body = await request.json();
    tags = Array.isArray(body.tags) ? body.tags : [body.tags];
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const revalidated: string[] = [];
  for (const tag of tags) {
    const paths = VALID_PATHS[tag];
    if (paths) {
      for (const p of paths) revalidatePath(p);
      revalidated.push(tag);
    }
  }

  if (revalidated.length === 0) {
    return NextResponse.json(
      { error: 'No valid tags', valid: Object.keys(VALID_PATHS) },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, revalidated });
}
