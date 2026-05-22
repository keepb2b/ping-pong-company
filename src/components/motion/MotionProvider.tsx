'use client';

import { useEffect } from 'react';
import { ScrollTrigger, ensureGsapPlugins } from '@/lib/gsap-client';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureGsapPlugins();
    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
