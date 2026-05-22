import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PageHero } from '@/components/layout/PageHero';
import { ScrollSection } from '@/components/motion/ScrollSection';
import type { PageData } from '@/lib/types';

export function DetailTemplate({
  page,
  kind,
  listHref,
  listLabel,
}: {
  page: PageData;
  kind: 'work' | 'blog' | 'animation' | 'staff';
  listHref: string;
  listLabel: string;
}) {
  const d = page.detail;
  const title = d?.title || page.title.split('｜')[0];
  const heroEn = kind === 'work' ? 'works' : kind === 'blog' ? 'blog' : kind === 'animation' ? 'Animation' : 'Staff';

  return (
    <>
      <PageHero en={heroEn} ja={listLabel} />
      <Breadcrumb
        items={[
          { label: 'HOME', href: '/' },
          { label: listLabel, href: listHref },
          { label: title },
        ]}
      />
      <ScrollSection sectionIndex={0} effect="diagonal-cross-reverse" className="py-12">
        <div className="container-site max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
              {d?.date && <time className="font-bold text-brand-blue">{d.date}</time>}
              {d?.categories?.map((cat) => (
                <span key={cat} className="rounded bg-surface px-2 py-1 text-xs font-medium text-brand-blue">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-ink md:text-3xl">{title}</h1>
            {(kind === 'blog' || kind === 'work') && (
              <div
                className="relative mt-8 aspect-[750/435] overflow-hidden rounded-lg bg-surface"
                aria-hidden
              />
            )}
            {kind !== 'blog' &&
              kind !== 'work' &&
              (d?.bodyHtml ? (
                <div className="prose-site mt-10" dangerouslySetInnerHTML={{ __html: d.bodyHtml }} />
              ) : (
                <p className="mt-8 text-muted">{d?.excerpt || page.title}</p>
              ))}
          <nav className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8 text-sm">
            {d?.prev?.href ? (
              <Link href={d.prev.href} className="font-bold text-brand-blue hover:underline">
                ← {d.prev.label || '前の記事'}
              </Link>
            ) : (
              <span />
            )}
            <Link href={listHref} className="font-bold text-brand-orange hover:underline">
              Back to list
            </Link>
            {d?.next?.href ? (
              <Link href={d.next.href} className="font-bold text-brand-blue hover:underline">
                {d.next.label || '次の記事'} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </ScrollSection>
    </>
  );
}
