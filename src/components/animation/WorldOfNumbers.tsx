'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, ensureGsapPlugins } from '@/lib/gsap-client';

const SYMBOLS = '0123456789+-×÷=<>[]{}();const let if return λ ∑ ∫ ∂ √ π';
const FORMULAS = ['E=mc²', 'f(n)=O(log n)', '∇·F', 'matrix[i][j]', 'async/await', '01101001'];

interface Particle {
  x: number;
  y: number;
  z: number;
  char: string;
  size: number;
  speed: number;
}

export function WorldOfNumbers({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'active' | 'done'>('idle');
  const playedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!section || !canvas || !overlay) return;

    ensureGsapPlugins();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const particleCap = isMobile ? 80 : 220;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let tunnelDepth = 0;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const initParticles = () => {
      particles = Array.from({ length: particleCap }, () => ({
        x: (Math.random() - 0.5) * canvas.width,
        y: (Math.random() - 0.5) * canvas.height,
        z: Math.random() * 1200,
        char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        size: 10 + Math.random() * 18,
        speed: 2 + Math.random() * 6,
      }));
    };

    const drawFrame = () => {
      if (!running || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.fillStyle = 'rgba(3, 12, 32, 0.22)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(100, 180, 255, 0.08)';
      ctx.lineWidth = 1;
      const grid = 48;
      for (let x = 0; x < w; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.z -= p.speed + tunnelDepth * 0.02;
        if (p.z < 1) {
          p.z = 1200;
          p.char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
        const scale = 320 / p.z;
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;
        const alpha = Math.min(1, scale * 1.4);
        ctx.fillStyle = `rgba(120, 200, 255, ${alpha})`;
        ctx.font = `${p.size * scale}px "Nanum Gothic Coding", monospace`;
        ctx.fillText(p.char, px, py);
      });

      FORMULAS.forEach((f, i) => {
        const a = 0.15 + Math.sin(tunnelDepth * 0.02 + i) * 0.08;
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.font = '14px monospace';
        ctx.fillText(f, 24, h - 40 - i * 22);
      });

      tunnelDepth += 1;
      raf = requestAnimationFrame(drawFrame);
    };

    const playImmersive = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      setPhase('loading');
      resize();
      initParticles();

      if (reduced) {
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            onComplete: () => {
              setPhase('done');
              gsap.to(overlay, { opacity: 0.35, duration: 1 });
            },
          }
        );
        return;
      }

      setPhase('active');
      running = true;
      drawFrame();

      const panels = overlay.querySelectorAll('[data-panel]');
      gsap.set(panels, { scale: 0.2, opacity: 0 });
      gsap.set(overlay, { opacity: 1, pointerEvents: 'auto' });

      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('done');
          running = false;
          cancelAnimationFrame(raf);
          gsap.to(overlay, { opacity: 0, duration: 1.2, delay: 0.3, pointerEvents: 'none' });
          gsap.to(canvas, { opacity: 0.25, duration: 1.5 });
        },
      });

      tl.to(panels, { scale: 1, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'power3.inOut' })
        .to(
          overlay,
          {
            background: 'radial-gradient(ellipse at center, #061428 0%, #020810 70%)',
            duration: 1.2,
          },
          0
        )
        .to(panels, { scale: 3.5, opacity: 0, duration: 1.4, ease: 'power2.in' }, '+=0.4');
    };

    resize();
    window.addEventListener('resize', resize);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      once: true,
      onEnter: playImmersive,
    });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      trigger.kill();
      running = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      aria-label="実績パフォーマンス"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-1000"
        aria-hidden
      />
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0"
        aria-hidden={phase === 'done'}
      >
        <div data-panel className="absolute left-0 top-0 h-1/2 w-1/2 origin-top-left bg-white/90" />
        <div data-panel className="absolute right-0 top-0 h-1/2 w-1/2 origin-top-right bg-white/90" />
        <div data-panel className="absolute bottom-0 left-0 h-1/2 w-1/2 origin-bottom-left bg-white/90" />
        <div data-panel className="absolute bottom-0 right-0 h-1/2 w-1/2 origin-bottom-right bg-white/90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-4xl font-bold tracking-widest text-brand-blue md:text-6xl">
            {phase === 'loading' ? '...' : 'PERFORMANCE'}
          </p>
        </div>
      </div>
      <div className="relative z-20">{children}</div>
    </section>
  );
}
