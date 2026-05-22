'use client';

import { useEffect, useRef } from 'react';

const SYMBOLS = '0123456789+-×÷=<>[]{}();λ∑∫√π';
const STACK_TASKS = ['React', 'Next.js', 'WordPress', 'Shopify', 'AI', 'API', 'HTML', 'GSAP', 'SQL', 'Node'];
const RESULTS = ['Launch ✓', 'Live', 'Shipped', '100%', 'Done', 'Scale', 'Build', 'Deploy'];

interface NumParticle {
  angle: number;
  z: number;
  char: string;
  speed: number;
}

interface FlowItem {
  z: number;
  label: string;
  kind: 'task' | 'result';
  speed: number;
}

export function HeroCylinderTunnel({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let depth = 0;
    const numParticles: NumParticle[] = [];
    const flowItems: FlowItem[] = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      numParticles.length = 0;
      flowItems.length = 0;
      const count = window.innerWidth < 768 ? 48 : 100;
      for (let i = 0; i < count; i++) {
        numParticles.push({
          angle: Math.random() * Math.PI * 2,
          z: Math.random() * 1400,
          char: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          speed: 1.5 + Math.random() * 3,
        });
      }
      STACK_TASKS.forEach((label, i) => {
        flowItems.push({
          z: 200 + i * 140,
          label,
          kind: 'task',
          speed: 3.2 + (i % 3) * 0.4,
        });
      });
      RESULTS.forEach((label, i) => {
        flowItems.push({
          z: 800 + i * 120,
          label,
          kind: 'result',
          speed: 3.5 + (i % 2) * 0.3,
        });
      });
    };

    const drawCylinderFrame = () => {
      const cx = w / 2;
      const cy = h / 2;
      const rx = w * 0.38;
      const ry = h * 0.22;
      const pulse = 0.04 + Math.sin(depth * 0.04) * 0.02;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      bg.addColorStop(0, 'rgba(232, 244, 252, 0.95)');
      bg.addColorStop(0.55, 'rgba(255, 255, 255, 0.6)');
      bg.addColorStop(1, 'rgba(232, 244, 252, 0.2)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      for (let ring = 0; ring < 6; ring++) {
        const t = ring / 6;
        const rz = 0.55 + t * 0.4 + pulse * t;
        ctx.strokeStyle = `rgba(11, 92, 171, ${0.06 + t * 0.06})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * rz, ry * rz, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(11, 92, 171, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(11, 92, 171, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.55, ry * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      const vanishX = cx - rx * 0.72;
      const exitX = cx + rx * 0.72;
      ctx.strokeStyle = 'rgba(242, 140, 40, 0.5)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(vanishX, cy - ry * 0.35);
      ctx.lineTo(vanishX, cy + ry * 0.35);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(11, 92, 171, 0.55)';
      ctx.beginPath();
      ctx.moveTo(exitX, cy - ry * 0.35);
      ctx.lineTo(exitX, cy + ry * 0.35);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(11, 92, 171, 0.08)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 10px "Nanum Gothic Coding", monospace';
      ctx.fillStyle = 'rgba(11, 92, 171, 0.45)';
      ctx.fillText('IN', vanishX - 14, cy - ry - 10);
      ctx.fillStyle = 'rgba(242, 140, 40, 0.7)';
      ctx.fillText('OUT', exitX - 16, cy - ry - 10);

      return { cx, cy, rx, ry, vanishX, exitX };
    };

    const projectCylinder = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      angle: number,
      z: number
    ) => {
      const t = 1 - z / 1400;
      const scale = 0.15 + t * 0.85;
      const px = cx + Math.cos(angle) * rx * scale * 0.92;
      const py = cy + Math.sin(angle) * ry * scale * 0.92;
      return { px, py, scale, alpha: Math.min(1, t * 1.2) };
    };

    const draw = () => {
      const { cx, cy, rx, ry, vanishX, exitX } = drawCylinderFrame();

      numParticles.forEach((p) => {
        if (!reduced) {
          p.z -= p.speed;
          if (p.z < 20) {
            p.z = 1300 + Math.random() * 200;
            p.char = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            p.angle = Math.random() * Math.PI * 2;
          }
        }
        const { px, py, scale, alpha } = projectCylinder(cx, cy, rx, ry, p.angle, p.z);
        ctx.fillStyle = `rgba(80, 150, 220, ${alpha * 0.55})`;
        ctx.font = `${9 + scale * 10}px "Nanum Gothic Coding", monospace`;
        ctx.fillText(p.char, px, py);
      });

      flowItems.forEach((item) => {
        if (!reduced) {
          item.z -= item.speed;
          if (item.z < 40) {
            item.z = item.kind === 'task' ? 1100 + Math.random() * 300 : 1250 + Math.random() * 200;
            if (item.kind === 'task') {
              item.label = STACK_TASKS[Math.floor(Math.random() * STACK_TASKS.length)];
            } else {
              item.label = RESULTS[Math.floor(Math.random() * RESULTS.length)];
            }
          }
        }

        const t = 1 - item.z / 1400;
        const laneY = item.kind === 'task' ? cy - ry * 0.15 : cy + ry * 0.15;
        const startX = vanishX - 20;
        const endX = exitX + 20;
        const px = startX + (endX - startX) * t;
        const py = laneY + Math.sin(t * Math.PI) * (item.kind === 'task' ? -18 : 18);
        const scale = 0.5 + t * 0.9;
        const alpha = Math.sin(t * Math.PI) * 0.95;

        if (item.kind === 'task') {
          ctx.fillStyle = `rgba(11, 92, 171, ${alpha})`;
          ctx.strokeStyle = `rgba(11, 92, 171, ${alpha * 0.4})`;
        } else {
          ctx.fillStyle = `rgba(242, 140, 40, ${alpha})`;
          ctx.strokeStyle = `rgba(242, 140, 40, ${alpha * 0.4})`;
        }

        const padX = 10;
        const padY = 5;
        ctx.font = `bold ${11 + scale * 5}px var(--font-sans), sans-serif`;
        const tw = ctx.measureText(item.label).width;
        const bw = tw + padX * 2;
        const bh = 18 + scale * 4;
        ctx.beginPath();
        ctx.roundRect(px - bw / 2, py - bh / 2, bw, bh, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = item.kind === 'task' ? '#fff' : '#1a1a2e';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, px, py);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      });

      if (!reduced) depth += 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square w-full max-w-md ${className}`}
      role="img"
      aria-label="技術スタックがシリンダーの入口から入り、出口から成果物として出ていくアニメーション"
    >
      <div className="absolute inset-0 rounded-full bg-brand-blue/5 blur-3xl" aria-hidden />
      <canvas
        ref={canvasRef}
        className="relative z-10 h-full w-full drop-shadow-xl"
      />
    </div>
  );
}
