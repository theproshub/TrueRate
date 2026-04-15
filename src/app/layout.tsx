import type { Metadata } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrueRate — Liberia Business & Economy',
  description: 'At TrueRate, discover business news, economic data, and analysis focused on Liberia and West Africa.',
};

// Only activate ClerkProvider when real keys are configured.
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const isClerkConfigured =
  publishableKey.startsWith('pk_') && !publishableKey.includes('replace_me');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <body className={`${poppins.className} ${poppins.variable} ${montserrat.variable} font-poppins bg-brand-dark`} style={{ background: '#050d11' }}>
      <Header />
      {children}
      <Footer />
    </body>
  );

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      {isClerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}
    </html>
  );
}
