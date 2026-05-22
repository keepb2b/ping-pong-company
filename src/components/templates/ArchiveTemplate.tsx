import Link from 'next/link';
import { ArchiveCard } from '@/components/cards/ArchiveCard';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageHero } from '@/components/layout/PageHero';
import { ScrollSection } from '@/components/motion/ScrollSection';
import type { PageData } from '@/lib/types';

const HERO_MAP = {
  work: { en: 'works', ja: '開発事例' },
  blog: { en: 'blog', ja: 'ブログ' },
  animation: { en: 'Animation', ja: 'アニメーション' },
  staff: { en: 'Staff', ja: 'スタッフ紹介' },
} as const;

export function ArchiveTemplate({
  page,
  kind,
}: {
  page: PageData;
  kind: keyof typeof HERO_MAP;
}) {
  const hero = HERO_MAP[kind];
  const filters = page.filters.length
    ? page.filters
    : [
        { href: `/${kind}`, label: 'ALL' },
        ...(kind === 'work'
          ? [
              { href: '/work/wordpress', label: 'WordPress' },
              { href: '/work/web-anime', label: 'Webアニメ' },
            ]
          : []),
      ];

  return (
    <>
      <PageHero en={hero.en} ja={hero.ja} />
      <Breadcrumb
        items={[
          { label: 'HOME', href: '/' },
          { label: hero.ja, href: page.route.includes('/page/') ? `/${kind}` : undefined },
          ...(page.route.includes('/page/') ? [{ label: `ページ ${page.route.split('/').pop()}` }] : []),
        ]}
      />
      <ScrollSection sectionIndex={0} className="py-12">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {filters.slice(0, 12).map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  page.route === f.href || page.route.startsWith(f.href)
                    ? 'bg-brand-blue text-white'
                    : 'bg-surface text-muted hover:bg-brand-blue/10'
                }`}
              >
                {f.label || 'ALL'}
              </Link>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.cards.map((card) => (
              <ArchiveCard key={card.href} item={card} type={kind} />
            ))}
          </div>
          {page.cards.length === 0 && (
            <p className="text-center text-muted">コンテンツを読み込んでいます…</p>
          )}
        </div>
      </ScrollSection>
    </>
  );
}
