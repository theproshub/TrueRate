import Link from 'next/link';

export default function SignInPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 no-underline mb-6">
            <span className="text-[22px] font-black text-white">TrueRate</span>
            <span className="rounded bg-[#6001d2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Liberia</span>
          </Link>
          <h1 className="mt-4 text-[24px] font-black text-white">Sign in</h1>
          <p className="mt-1 text-[13px] text-[#666]">Access your portfolio and personalized news</p>
        </div>

        <div className="rounded-xl border border-[#2a2a2a] bg-[#161618] p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#888]">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-[#444]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#888]">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#1c1c1e] border border-[#2a2a2a] px-4 py-3 text-[14px] text-white outline-none focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2]/20 placeholder:text-[#444]"
              />
            </div>
            <button className="w-full rounded-lg bg-[#6001d2] py-3 text-[14px] font-semibold text-white transition hover:bg-[#490099]">
              Sign in
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#222]" />
            <span className="text-[12px] text-[#444]">or</span>
            <div className="h-px flex-1 bg-[#222]" />
          </div>

          <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#2a2a2a] bg-[#1c1c1e] py-3 text-[14px] font-medium text-white transition hover:bg-[#222]">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-5 text-center text-[13px] text-[#555]">
          Don&apos;t have an account?{' '}
          <Link href="/premium" className="text-[#a78bfa] no-underline hover:underline">Get Premium</Link>
        </p>
      </div>
    </main>
  );
}
