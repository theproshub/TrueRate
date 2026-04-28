import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Context above the Clerk widget */}
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-black text-white tracking-tight">
            Welcome back to TrueRate
          </h1>
          <p className="mt-2 text-[14px] text-gray-500">
            Liberia&apos;s financial data platform
          </p>
        </div>

        {/* Clerk drop-in sign-in widget */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-brand-card border border-white/[0.07] shadow-2xl rounded-2xl',
                headerTitle: 'text-white',
                headerSubtitle: 'text-gray-400',
                socialButtonsBlockButton:
                  'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.10] transition-colors',
                socialButtonsBlockButtonText: 'text-white font-medium',
                dividerLine: 'bg-white/[0.08]',
                dividerText: 'text-gray-400',
                formFieldLabel: 'text-gray-400 text-[13px]',
                formFieldInput:
                  'bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-gray-400 rounded-lg focus:border-emerald-400/50 focus:ring-1 focus:ring-[#6001d2]/30',
                formButtonPrimary:
                  'bg-[#6001d2] hover:bg-[#490099] text-white font-semibold rounded-lg transition-colors',
                footerActionLink: 'text-emerald-400 hover:text-[#c4b5fd]',
                identityPreviewText: 'text-white',
                identityPreviewEditButton: 'text-emerald-400',
                formFieldErrorText: 'text-red-400',
                alertText: 'text-red-400',
                alertIcon: 'text-red-400',
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
