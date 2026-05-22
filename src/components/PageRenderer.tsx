import { notFound } from 'next/navigation';
import { getPage } from '@/lib/routes';
import { ArchiveTemplate } from '@/components/templates/ArchiveTemplate';
import { DetailTemplate } from '@/components/templates/DetailTemplate';
import { StaticPageTemplate } from '@/components/templates/StaticPageTemplate';
import { StaticPages } from '@/components/pages/StaticPages';

export function PageRenderer({ route }: { route: string }) {
  const page = getPage(route);
  if (!page) notFound();

  const t = page.template;

  if (
    t === 'work-archive' ||
    t === 'work-category' ||
    page.route.startsWith('/workcat/')
  ) {
    return <ArchiveTemplate page={page} kind="work" />;
  }
  if (page.route.startsWith('/animationcat/')) {
    return <ArchiveTemplate page={page} kind="animation" />;
  }
  if (t === 'work-detail') {
    return <DetailTemplate page={page} kind="work" listHref="/work" listLabel="開発事例" />;
  }
  if (t === 'blog-archive' || t === 'blog-category') {
    return <ArchiveTemplate page={page} kind="blog" />;
  }
  if (t === 'blog-detail') {
    return <DetailTemplate page={page} kind="blog" listHref="/blog" listLabel="ブログ" />;
  }
  if (t === 'animation-archive' || t === 'animation-category') {
    return <ArchiveTemplate page={page} kind="animation" />;
  }
  if (t === 'animation-detail') {
    return <DetailTemplate page={page} kind="animation" listHref="/animation" listLabel="アニメーション" />;
  }
  if (page.route.startsWith('/staff')) {
    if (page.pageType === 'detail') {
      return <DetailTemplate page={page} kind="staff" listHref="/staff" listLabel="スタッフ紹介" />;
    }
    return <ArchiveTemplate page={page} kind="staff" />;
  }
  if (page.route.startsWith('/tag/')) {
    return <ArchiveTemplate page={page} kind="blog" />;
  }

  return (
    <StaticPageTemplate page={page}>
      <StaticPages page={page} />
    </StaticPageTemplate>
  );
}
