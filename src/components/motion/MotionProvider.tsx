'use client';

import { useEffect } from 'react';
import { ScrollTrigger, ensureGsapPlugins } from '@/lib/gsap-client';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureGsapPlugins();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
