import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TrueRate — Liberia Finance, Markets & News',
  description: 'At TrueRate, discover financial news, market data, and analysis focused on Liberia and West Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0e10]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
