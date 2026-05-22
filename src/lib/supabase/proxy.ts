import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from './types';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return supabaseResponse;

  const supabase = createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Admin gate ──────────────────────────────────────────────────────
  // Enforced here (before render) rather than in the /admin layout, because
  // layout-level redirect() is unreliable behind the root error boundary.
  const path = request.nextUrl.pathname;
  if (path.startsWith('/admin')) {
    if (!user) {
      return redirectTo(request, supabaseResponse, '/sign-in', {
        next: path,
      });
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if (!profile?.is_admin) {
      return redirectTo(request, supabaseResponse, '/', { error: 'admin_only' });
    }
  }

  return supabaseResponse;
}

/**
 * Build a redirect response while preserving any auth cookies that were
 * refreshed on `base` during this request. Without copying them over, a
 * token rotation that coincides with a redirect would be lost.
 */
function redirectTo(
  request: NextRequest,
  base: NextResponse,
  pathname: string,
  params: Record<string, string> = {},
): NextResponse {
  const target = request.nextUrl.clone();
  target.pathname = pathname;
  target.search = '';
  for (const [k, v] of Object.entries(params)) {
    target.searchParams.set(k, v);
  }
  const res = NextResponse.redirect(target);
  base.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}
