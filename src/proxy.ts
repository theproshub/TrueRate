import { NextRequest, NextResponse } from 'next/server';

// Local/dev-safe pass-through proxy (Next.js 16 rename of middleware.ts).
// Re-enable `clerkMiddleware()` once protected route rules are defined.
export default function proxy(_req: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
