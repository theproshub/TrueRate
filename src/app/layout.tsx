import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TrueRate — Liberia Business & Economy',
  description: 'At TrueRate, discover business news, economic data, and analysis focused on Liberia and West Africa.',
};

// Only activate ClerkProvider when real keys are configured.
// The app runs fully without auth until keys are added to .env.local.
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const isClerkConfigured =
  publishableKey.startsWith('pk_') && !publishableKey.includes('replace_me');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <body className="bg-[#0e0e11]">
      <Header />
      {children}
      <Footer />
    </body>
  );

  return (
    <html lang="en">
      {isClerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}
    </html>
  );
}
