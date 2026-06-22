import type { Metadata } from 'next';
import { Inter, Montserrat, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SiteJsonLd } from '@/components/JsonLd';

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

// Tabular figures for financial data (markets, analytics terminal).
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

const siteUrl = 'https://truerateliberia.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrueRate — Liberia’s Financial Intelligence Platform",
    template: '%s | TrueRate',
  },
  description:
    "TrueRate is Liberia’s financial intelligence platform — news, live market data, economic analytics, business, technology, and videos covering the economy, markets, and policy that shape the country.",
  applicationName: 'TrueRate',
  keywords: [
    'Liberia',
    'Liberia news',
    'Liberia financial news',
    'Liberia economy',
    'Liberia exchange rate',
    'LRD USD',
    'Liberian dollar',
    'West Africa markets',
    'West Africa finance',
    'Liberia business',
    'Liberia analytics',
    'Liberia market data',
    'TrueRate',
    'CBL',
    'Central Bank of Liberia',
  ],
  authors: [{ name: 'TrueRate' }],
  creator: 'TrueRate',
  publisher: 'TrueRate',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TrueRate',
    title: "TrueRate — Liberia’s Financial Intelligence Platform",
    description:
      "Liberia’s financial intelligence platform: news, live markets, economic analytics, business, technology, and videos.",
    // og:image is provided by app/opengraph-image.tsx (1200x630 branded card).
  },
  twitter: {
    card: 'summary_large_image',
    title: "TrueRate — Liberia’s Financial Intelligence Platform",
    description:
      "Liberia’s financial intelligence platform: news, live markets, economic analytics, business, technology, and videos.",
    // twitter:image falls back to the Open Graph image (app/opengraph-image.tsx).
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
    // favicon.ico (app/ convention) is the universal fallback.
    // These swap with the user's browser / system appearance.
    icon: [
      { url: '/icon-light.png', type: 'image/png', sizes: '512x512', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png', type: 'image/png', sizes: '512x512', media: '(prefers-color-scheme: dark)' },
    ],
  },
  category: 'news',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>
        <SiteJsonLd />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
