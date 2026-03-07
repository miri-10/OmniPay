'use client';

import dynamic from 'next/dynamic';

const FloatingObjects3D = dynamic(
  () => import('@/components/FloatingObjects3D'),
  { ssr: false }
);

export default function BackgroundWrapper() {
  return <FloatingObjects3D />;
}
