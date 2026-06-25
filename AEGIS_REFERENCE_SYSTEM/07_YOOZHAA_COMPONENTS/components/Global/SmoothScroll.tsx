'use client';

// Updated import for the modern Lenis package
import { ReactLenis } from 'lenis/react'; 
import { ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05, // Lower = smoother, heavier feel
        duration: 1.5,
        smoothWheel: true,
        orientation: 'vertical',
      }}
    >
      {children}
    </ReactLenis>
  );
}