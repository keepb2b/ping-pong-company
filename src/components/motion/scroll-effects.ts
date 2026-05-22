export type ScrollEffectId =
  | 'diagonal-cross'
  | 'diagonal-cross-reverse'
  | 'paper-scrap'
  | 'wipe-left'
  | 'wipe-right'
  | 'curtain-split'
  | 'zoom-reveal'
  | 'fade-rise';

export type OverlayTone = 'light' | 'surface' | 'dark' | 'blue';

/** Rotating effects so each section on a page feels distinct. */
export const SCROLL_EFFECT_CYCLE: ScrollEffectId[] = [
  'fade-rise',
  'diagonal-cross',
  'paper-scrap',
  'wipe-left',
  'diagonal-cross-reverse',
  'curtain-split',
  'paper-scrap',
  'wipe-right',
  'zoom-reveal',
  'diagonal-cross',
];

export function getScrollEffect(sectionIndex: number): ScrollEffectId {
  return SCROLL_EFFECT_CYCLE[sectionIndex % SCROLL_EFFECT_CYCLE.length];
}

export function getOverlayTone(className: string): OverlayTone {
  if (className.includes('bg-brand-blue') || className.includes('text-white')) return 'blue';
  if (className.includes('bg-ink') || className.includes('bg-slate-9')) return 'dark';
  if (className.includes('bg-surface')) return 'surface';
  return 'light';
}
