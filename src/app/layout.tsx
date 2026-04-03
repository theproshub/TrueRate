import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrueRate — Liberia Business & Economy',
  description: 'At TrueRate, discover business news, economic data, and analysis focused on Liberia and West Africa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
