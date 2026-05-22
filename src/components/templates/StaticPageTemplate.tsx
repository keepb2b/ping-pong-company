import { PageHero } from '@/components/layout/PageHero';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ScrollSection } from '@/components/motion/ScrollSection';
import type { PageData } from '@/lib/types';

const STATIC_HERO: Record<string, { en: string; ja: string }> = {
  'our-strength': { en: 'Our Strength', ja: '選ばれる理由' },
  services: { en: 'SERVICES', ja: 'サービス' },
  fee: { en: 'BASIC CHARGE', ja: '基本料金' },
  faq: { en: 'FAQ', ja: 'よくあるご質問' },
  company: { en: 'Company', ja: '会社概要' },
  contact: { en: 'Contact', ja: 'ご相談' },
  privacy: { en: 'Privacy Policy', ja: 'プライバシーポリシー' },
};

export function StaticPageTemplate({
  page,
  children,
}: {
  page: PageData;
  children: React.ReactNode;
}) {
  const slug = page.route.replace(/^\//, '');
  const hero = STATIC_HERO[slug] || { en: 'Page', ja: page.title };

  return (
    <>
      <PageHero en={hero.en} ja={hero.ja} />
      <Breadcrumb items={[{ label: 'HOME', href: '/' }, { label: hero.ja }]} />
      {['our-strength', 'services'].includes(slug) ? (
        <div className="container-site py-12">{children}</div>
      ) : (
        <ScrollSection sectionIndex={0} className="py-12">
          <div className="container-site">{children}</div>
        </ScrollSection>
      )}
    </>
  );
}
