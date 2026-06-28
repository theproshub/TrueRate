import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

const KNOWN_PREFIXES = [
  '/news',
  '/markets',
  '/economy',
  '/analytics',
  '/small-business',
  '/technology',
  '/videos',
  '/watchlist',
  '/saved',
  '/about',
  '/help',
  '/feedback',
  '/feed',
  '/sign-in',
  '/sign-up',
  '/signin',
  '/admin',
  '/api',
];

const KNOWN_FILES = [
  '/sitemap.xml',
  '/news-sitemap.xml',
  '/robots.txt',
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
];

function isKnownPath(pathname: string): boolean {
  if (pathname === '/') return true;
  if (KNOWN_FILES.includes(pathname)) return true;
  for (const prefix of KNOWN_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return true;
  }
  return false;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isKnownPath(pathname)) {
    return new NextResponse('Gone', {
      status: 410,
      headers: {
        'X-Robots-Tag': 'noindex',
        'Content-Type': 'text/plain',
      },
    });
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
