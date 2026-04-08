import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TrueRate — Liberia Business & Economy',
  description: 'At TrueRate, discover business news, economic data, and analysis focused on Liberia and West Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0e11]">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
