import { NextRequest, NextResponse } from 'next/server';

// Local/dev-safe pass-through middleware.
// Re-enable `clerkMiddleware()` once protected route rules are defined.
export default (_req: NextRequest) => NextResponse.next(); // eslint-disable-line @typescript-eslint/no-unused-vars

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
