import type { Metadata } from 'next';
import VideosMobileTabs from '@/components/VideosMobileTabs';

export const metadata: Metadata = {
  title: 'Videos — TrueRate',
  description: "TrueRate video coverage — interviews, market explainers, and on-the-ground reporting from Liberia.",
};

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VideosMobileTabs />
      {children}
    </>
  );
}
