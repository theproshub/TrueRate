import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrueRate — Business, Investing & Technology',
  description: 'TrueRate is a national media company covering business, investing, technology, entrepreneurship, leadership, and lifestyle.',
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const isClerkConfigured =
  publishableKey.startsWith('pk_') && !publishableKey.includes('replace_me');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <body className={inter.className} style={{ background: '#050d11' }}>
      <Header />
      {children}
      <Footer />
    </body>
  );

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      {isClerkConfigured ? <ClerkProvider>{content}</ClerkProvider> : content}
    </html>
  );
}
