import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// Check if real Clerk keys have been configured
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const isClerkConfigured =
  publishableKey.startsWith('pk_') && !publishableKey.includes('replace_me');

// When Clerk keys are present → full auth middleware
// When keys are missing/placeholder → pass-through so the app still runs
export default isClerkConfigured
  ? clerkMiddleware()
  : (_req: NextRequest) => NextResponse.next(); // eslint-disable-line @typescript-eslint/no-unused-vars

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
