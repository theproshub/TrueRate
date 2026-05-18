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

const siteUrl = 'https://truerateliberia.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TrueRate — Liberia Business, Markets & Economy',
    template: '%s | TrueRate',
  },
  description:
    'TrueRate is Liberia’s financial news source, covering markets, the economy, small business, technology, and policy that shapes the country.',
  applicationName: 'TrueRate',
  keywords: [
    'Liberia',
    'Liberia news',
    'Liberia economy',
    'West Africa markets',
    'Liberia business',
    'TrueRate',
    'Liberian dollar',
    'CBL',
  ],
  authors: [{ name: 'TrueRate' }],
  creator: 'TrueRate',
  publisher: 'TrueRate',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TrueRate',
    title: 'TrueRate — Liberia Business, Markets & Economy',
    description:
      'Liberia’s financial news source: markets, the economy, small business, technology, and policy.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TrueRate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueRate — Liberia Business, Markets & Economy',
    description:
      'Liberia’s financial news source: markets, the economy, small business, technology, and policy.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  category: 'news',
};

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
const isClerkConfigured =
  publishableKey.startsWith('pk_') && !publishableKey.includes('replace_me');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = (
    <body className={inter.className}>
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
