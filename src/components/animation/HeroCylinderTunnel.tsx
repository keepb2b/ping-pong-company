'use client';

import { useEffect, useRef } from 'react';

const STACK_TASKS = [
  { label: 'WordPress', color: '#21759b' },
  { label: 'Shopify', color: '#96bf48' },
  { label: 'Next.js', color: '#1a1a2e' },
  { label: 'React', color: '#149eca' },
  { label: 'GSAP', color: '#88ce02' },
  { label: 'Node.js', color: '#339933' },
];

const PRODUCTS = [
  { label: 'Live Site', color: '#f28c28' },
  { label: 'Shipped', color: '#0b5cab' },
  { label: 'Deployed', color: '#e07d1f' },
  { label: 'Delivered', color: '#2d6a4f' },
];

/** Optional looped GIF inside the tunnel — place at public/images/stack-pipeline.gif */
const TUNNEL_GIF = '/images/stack-pipeline.gif';

interface TunnelItem {
  t: number;
  kind: 'task' | 'product';
  label: string;
  color: string;
  speed: number;
}

function drawMetalCylinder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  phase: number
) {
  const cx = w / 2;
  const cy = h / 2;
  const len = w * 0.78;
  const radY = h * 0.2;
  const radX = len * 0.11;
  const leftX = cx - len / 2;
  const rightX = cx + len / 2;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.55);
  bg.addColorStop(0, 'rgba(248, 251, 255, 0.98)');
  bg.addColorStop(1, 'rgba(232, 244, 252, 0.35)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const bodyGrad = ctx.createLinearGradient(0, cy - radY, 0, cy + radY);
  bodyGrad.addColorStop(0, '#e8edf2');
  bodyGrad.addColorStop(0.35, '#b8c4d0');
  bodyGrad.addColorStop(0.5, '#9aa8b8');
  bodyGrad.addColorStop(0.65, '#b8c4d0');
  bodyGrad.addColorStop(1, '#7a8796');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(leftX + radX, cy - radY);
  ctx.lineTo(rightX - radX, cy - radY);
  ctx.ellipse(rightX, cy, radX, radY, 0, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(leftX + radX, cy + radY);
  ctx.ellipse(leftX, cy, radX, radY, 0, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  const shine = ctx.createLinearGradient(leftX, cy - radY, rightX, cy - radY);
  shine.addColorStop(0, 'rgba(255,255,255,0)');
  shine.addColorStop(0.15 + Math.sin(phase * 0.03) * 0.05, 'rgba(255,255,255,0.45)');
  shine.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shine;
  ctx.fill();

  const tunnelGrad = ctx.createLinearGradient(leftX + radX * 0.6, 0, rightX - radX * 0.6, 0);
  tunnelGrad.addColorStop(0, '#0f1724');
  tunnelGrad.addColorStop(0.12, '#1e2a3a');
  tunnelGrad.addColorStop(0.5, '#0a1018');
  tunnelGrad.addColorStop(0.88, '#1e2a3a');
  tunnelGrad.addColorStop(1, '#0f1724');
  ctx.fillStyle = tunnelGrad;
  ctx.beginPath();
  ctx.ellipse(leftX, cy, radX * 0.92, radY * 0.88, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(leftX + radX * 0.55, cy - radY * 0.82);
  ctx.lineTo(rightX - radX * 0.55, cy - radY * 0.82);
  ctx.lineTo(rightX - radX * 0.55, cy + radY * 0.82);
  ctx.lineTo(leftX + radX * 0.55, cy + radY * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(rightX, cy, radX * 0.92, radY * 0.88, 0, 0, Math.PI * 2);
  ctx.fill();

  const rim = (x: number, alpha: number) => {
    ctx.strokeStyle = `rgba(60, 75, 95, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, cy, radX, radY, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.35})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(x, cy, radX * 0.88, radY * 0.86, 0, 0, Math.PI * 2);
    ctx.stroke();
  };
  rim(leftX, 0.9);
  rim(rightX, 0.9);

  ctx.strokeStyle = 'rgba(45, 58, 75, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftX + radX, cy - radY);
  ctx.lineTo(rightX - radX, cy - radY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(leftX + radX, cy + radY);
  ctx.lineTo(rightX - radX, cy + radY);
  ctx.stroke();

  ctx.shadowColor = 'rgba(11, 92, 171, 0.25)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = 'rgba(11, 92, 171, 0.85)';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('IN', leftX - 22, cy - radY - 14);
  ctx.fillStyle = 'rgba(242, 140, 40, 0.9)';
  ctx.fillText('OUT', rightX - 26, cy - radY - 14);
  ctx.shadowBlur = 0;

  return { cx, cy, leftX, rightX, radX, radY };
}

function drawBox3D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  label: string,
  isProduct: boolean
) {
  const d = size * 0.35;
  const w = size;
  const h = size * 0.72;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  ctx.ellipse(0, h * 0.55, w * 0.55, h * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  const side = shade(color, -28);
  const top = shade(color, 22);
  const front = color;

  ctx.fillStyle = side;
  ctx.beginPath();
  ctx.moveTo(w / 2, -h / 2);
  ctx.lineTo(w / 2 + d, -h / 2 + d * 0.5);
  ctx.lineTo(w / 2 + d, h / 2 + d * 0.5);
  ctx.lineTo(w / 2, h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(-w / 2, -h / 2);
  ctx.lineTo(0, -h / 2 - d * 0.55);
  ctx.lineTo(w / 2, -h / 2);
  ctx.lineTo(w / 2 + d, -h / 2 + d * 0.5);
  ctx.lineTo(0, -h / 2 + d * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = front;
  ctx.fillRect(-w / 2, -h / 2, w, h);

  if (isProduct) {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(8, size * 0.2)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓', 0, -h * 0.12);
  }

  ctx.fillStyle = isProduct ? '#fff' : 'rgba(255,255,255,0.95)';
  ctx.font = `600 ${Math.max(7, size * 0.16)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, isProduct ? h * 0.22 : 0);

  ctx.restore();
}

function shade(hex: string, amount: number): string {
  const n = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(n.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(n.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(n.slice(4, 6), 16) + amount));
  return `rgb(${r},${g},${b})`;
}

export function HeroCylinderTunnel({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gifRef = useRef<HTMLImageElement>(null);
  const gifOkRef = useRef(false);

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
    let phase = 0;
    const items: TunnelItem[] = [];

    const initItems = () => {
      items.length = 0;
      STACK_TASKS.forEach((s, i) => {
        items.push({
          t: i * 0.14,
          kind: 'task',
          label: s.label,
          color: s.color,
          speed: 0.0022 + (i % 3) * 0.0003,
        });
      });
      PRODUCTS.forEach((p, i) => {
        items.push({
          t: 0.45 + i * 0.12,
          kind: 'product',
          label: p.label,
          color: p.color,
          speed: 0.0024 + (i % 2) * 0.0002,
        });
      });
    };

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

    const clipTunnel = (geom: ReturnType<typeof drawMetalCylinder>) => {
      const { cy, leftX, rightX, radX, radY } = geom;
      ctx.beginPath();
      ctx.ellipse(leftX, cy, radX * 0.88, radY * 0.86, 0, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(rightX - radX * 0.55, cy + radY * 0.86);
      ctx.ellipse(rightX, cy, radX * 0.88, radY * 0.86, 0, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.clip();
    };

    const drawGifInTunnel = (geom: ReturnType<typeof drawMetalCylinder>) => {
      const img = gifRef.current;
      if (!gifOkRef.current || !img?.complete || !img.naturalWidth) return;

      const { cy, leftX, rightX, radX, radY } = geom;
      const x0 = leftX + radX * 0.5;
      const x1 = rightX - radX * 0.5;
      const tw = x1 - x0;
      const th = radY * 1.55;

      ctx.save();
      clipTunnel(geom);

      const aspect = img.naturalWidth / img.naturalHeight;
      let dw = tw * 1.05;
      let dh = dw / aspect;
      if (dh < th) {
        dh = th;
        dw = th * aspect;
      }
      const ox = x0 + (tw - dw) / 2;
      const oy = cy - dh / 2;
      ctx.globalAlpha = 0.55;
      ctx.drawImage(img, ox, oy, dw, dh);
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawAnimatedItems = (geom: ReturnType<typeof drawMetalCylinder>) => {
      const { cy, leftX, rightX, radX, radY } = geom;
      const tunnelStart = leftX + radX * 0.7;
      const tunnelEnd = rightX - radX * 0.7;
      const tunnelLen = tunnelEnd - tunnelStart;

      items.forEach((item) => {
        if (!reduced) {
          item.t += item.speed;
          if (item.t > 1.08) {
            item.t = -0.12;
            if (item.kind === 'task') {
              const s = STACK_TASKS[Math.floor(Math.random() * STACK_TASKS.length)];
              item.label = s.label;
              item.color = s.color;
            } else {
              const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
              item.label = p.label;
              item.color = p.color;
            }
          }
        }

        const t = item.t;
        if (t < 0 || t > 1) return;

        const x = tunnelStart + tunnelLen * t;
        const lane = item.kind === 'task' ? -radY * 0.12 : radY * 0.12;
        const y = cy + lane;
        const enter = Math.min(1, t / 0.12);
        const exit = Math.min(1, (1 - t) / 0.12);
        const fade = Math.sin(t * Math.PI) * enter * exit;
        const scale = (0.55 + Math.sin(t * Math.PI) * 0.55) * fade;

        if (scale < 0.05) return;

        ctx.globalAlpha = fade;
        drawBox3D(
          ctx,
          x,
          y,
          36 * scale + 12,
          item.color,
          item.label,
          item.kind === 'product'
        );
        ctx.globalAlpha = 1;
      });
    };

    const draw = () => {
      const geom = drawMetalCylinder(ctx, w, h, phase);

      ctx.save();
      clipTunnel(geom);
      drawGifInTunnel(geom);
      ctx.restore();

      ctx.save();
      clipTunnel(geom);
      drawAnimatedItems(geom);
      ctx.restore();

      if (!reduced) phase += 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    initItems();
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
      aria-label="金属シリンダーの入口から技術スタックが入り、反対側の出口から完成品が出ていくアニメーション"
    >
      <div className="absolute inset-0 rounded-full bg-brand-blue/5 blur-3xl" aria-hidden />

      <img
        ref={gifRef}
        src={TUNNEL_GIF}
        alt=""
        className="hidden"
        onLoad={() => {
          gifOkRef.current = true;
        }}
        onError={() => {
          gifOkRef.current = false;
        }}
      />

      <canvas ref={canvasRef} className="relative z-10 h-full w-full drop-shadow-xl" />
    </div>
  );
}
