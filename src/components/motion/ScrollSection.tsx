'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, ensureGsapPlugins } from '@/lib/gsap-client';
import {
  getOverlayTone,
  getScrollEffect,
  type OverlayTone,
  type ScrollEffectId,
} from '@/components/motion/scroll-effects';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Section order on the page — picks a unique scroll effect. */
  sectionIndex?: number;
  effect?: ScrollEffectId;
  tone?: OverlayTone;
  /** Skip overlay (e.g. hero or sections with their own animation). */
  disableOverlay?: boolean;
}

function OverlayPanels({ effect, tone }: { effect: ScrollEffectId; tone: OverlayTone }) {
  const toneClass = `scroll-overlay-tone--${tone}`;

  switch (effect) {
    case 'diagonal-cross':
      return (
        <>
          <span className={`scroll-panel scroll-panel--diag-a ${toneClass}`} data-panel />
          <span className={`scroll-panel scroll-panel--diag-b ${toneClass}`} data-panel />
        </>
      );
    case 'diagonal-cross-reverse':
      return (
        <>
          <span className={`scroll-panel scroll-panel--diag-b ${toneClass}`} data-panel />
          <span className={`scroll-panel scroll-panel--diag-a ${toneClass}`} data-panel />
        </>
      );
    case 'paper-scrap':
      return (
        <>
          <span className={`scroll-panel scroll-panel--paper ${toneClass}`} data-panel />
          <span className={`scroll-panel scroll-panel--paper-edge ${toneClass}`} data-panel />
        </>
      );
    case 'wipe-left':
      return <span className={`scroll-panel scroll-panel--wipe-h ${toneClass}`} data-panel />;
    case 'wipe-right':
      return (
        <span
          className={`scroll-panel scroll-panel--wipe-h scroll-panel--wipe-from-right ${toneClass}`}
          data-panel
        />
      );
    case 'curtain-split':
      return (
        <>
          <span className={`scroll-panel scroll-panel--curtain-t ${toneClass}`} data-panel />
          <span className={`scroll-panel scroll-panel--curtain-b ${toneClass}`} data-panel />
        </>
      );
    case 'zoom-reveal':
    case 'fade-rise':
      return null;
    default:
      return null;
  }
}

function runEffect(
  effect: ScrollEffectId,
  section: HTMLElement,
  content: HTMLElement,
  panels: HTMLElement[]
): gsap.core.Timeline | null {
  const stBase = {
    trigger: section,
    start: 'top 82%',
    toggleActions: 'play none none reverse' as const,
  };

  switch (effect) {
    case 'diagonal-cross': {
      if (panels.length < 2) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(
            content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
          );
      }
      gsap.set(panels[0], { xPercent: -8, yPercent: -8, rotation: -24 });
      gsap.set(panels[1], { xPercent: 8, yPercent: 8, rotation: -24 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { xPercent: -115, yPercent: -115, duration: 0.95, ease: 'power3.inOut' }, 0)
        .to(panels[1], { xPercent: 115, yPercent: 115, duration: 0.95, ease: 'power3.inOut' }, 0)
        .to(content, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.2);
    }
    case 'diagonal-cross-reverse': {
      if (panels.length < 2) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(
            content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
          );
      }
      gsap.set(panels[0], { xPercent: 10, yPercent: 10, rotation: -24 });
      gsap.set(panels[1], { xPercent: -10, yPercent: -10, rotation: -24 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { xPercent: 115, yPercent: 115, duration: 0.95, ease: 'power3.inOut' }, 0)
        .to(panels[1], { xPercent: -115, yPercent: -115, duration: 0.95, ease: 'power3.inOut' }, 0)
        .to(content, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.2);
    }
    case 'paper-scrap': {
      if (panels.length < 2) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(
            content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
          );
      }
      gsap.set(panels[0], { xPercent: -12, yPercent: 0, rotation: -18, skewX: -4 });
      gsap.set(panels[1], { xPercent: 12, opacity: 0.85 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { xPercent: 120, yPercent: -18, duration: 1.05, ease: 'power2.inOut' }, 0)
        .to(panels[1], { xPercent: -80, opacity: 0, duration: 0.85, ease: 'power2.in' }, 0.12)
        .to(content, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.28);
    }
    case 'wipe-left': {
      if (!panels[0]) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(content, { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' });
      }
      gsap.set(panels[0], { xPercent: 0 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { xPercent: 105, duration: 0.85, ease: 'power3.inOut' })
        .to(content, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.18);
    }
    case 'wipe-right': {
      if (!panels[0]) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(content, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' });
      }
      gsap.set(panels[0], { xPercent: 0 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { xPercent: -105, duration: 0.85, ease: 'power3.inOut' })
        .to(content, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.18);
    }
    case 'curtain-split': {
      if (panels.length < 2) {
        return gsap
          .timeline({ scrollTrigger: stBase })
          .fromTo(
            content,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }
          );
      }
      gsap.set(panels[0], { yPercent: 0 });
      gsap.set(panels[1], { yPercent: 0 });
      return gsap
        .timeline({ scrollTrigger: stBase })
        .to(panels[0], { yPercent: -105, duration: 0.8, ease: 'power3.inOut' }, 0)
        .to(panels[1], { yPercent: 105, duration: 0.8, ease: 'power3.inOut' }, 0)
        .to(content, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, 0.15);
    }
    case 'zoom-reveal':
      return gsap
        .timeline({ scrollTrigger: stBase })
        .fromTo(content, { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out' });
    case 'fade-rise':
    default:
      return gsap
        .timeline({ scrollTrigger: stBase })
        .fromTo(content, { opacity: 0, y: 48, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' });
  }
}

export function ScrollSection({
  children,
  className = '',
  sectionIndex = 0,
  effect: effectProp,
  tone: toneProp,
  disableOverlay = false,
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const effect = disableOverlay
    ? (effectProp ?? 'fade-rise')
    : (effectProp ?? getScrollEffect(sectionIndex));
  const tone = toneProp ?? getOverlayTone(className);
  const hasPanels = !disableOverlay && effect !== 'zoom-reveal' && effect !== 'fade-rise';

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    ensureGsapPlugins();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || disableOverlay) {
      gsap.set(content, { opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' });
      return;
    }

    gsap.set(content, { opacity: 0, y: 40 });

    const panels = hasPanels
      ? Array.from(overlayRef.current?.querySelectorAll<HTMLElement>('[data-panel]') ?? [])
      : [];

    if (hasPanels && panels.length) {
      gsap.set(panels, { willChange: 'transform' });
    }

    let timeline = runEffect(effect, section, content, panels);
    if (!timeline) {
      timeline = runEffect('fade-rise', section, content, panels);
    }

    if (timeline && timeline.scrollTrigger && ScrollTrigger.isInViewport(section, 0.2)) {
      timeline.progress(1);
    }

    return () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf([content, ...panels]);
    };
  }, [effect, hasPanels, disableOverlay]);

  return (
    <section
      ref={sectionRef}
      className={`scroll-section relative isolate overflow-hidden ${className}`}
      data-scroll-effect={effect}
    >
      {hasPanels && (
        <div
          ref={overlayRef}
          className="scroll-section__overlay pointer-events-none absolute inset-0 z-20 overflow-hidden"
          aria-hidden
        >
          <OverlayPanels effect={effect} tone={tone} />
        </div>
      )}
      <div ref={contentRef} className="scroll-section__content relative z-10">
        {children}
      </div>
    </section>
  );
}
