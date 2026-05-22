import { Reveal } from '@/components/motion/Reveal';

interface PageHeroProps {
  en: string;
  ja: string;
  description?: string;
}

export function PageHero({ en, ja, description }: PageHeroProps) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-surface to-white py-14 md:py-20">
      <div className="container-site">
        <Reveal>
          <h1 className="section-en-title">{en}</h1>
          <p className="section-ja-title">{ja}</p>
          {description && <p className="mt-6 max-w-2xl text-sm text-muted">{description}</p>}
        </Reveal>
      </div>
    </section>
  );
}
