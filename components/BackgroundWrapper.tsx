'use client';

import dynamic from 'next/dynamic';

const ThreeDParticleBackground = dynamic(
  () => import('@/components/ThreeDParticleBackground'),
  { ssr: false }
);

export default function BackgroundWrapper() {
  return <ThreeDParticleBackground />;
}
