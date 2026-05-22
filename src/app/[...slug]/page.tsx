import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/PageRenderer';
import {
  getAllStaticRoutes,
  getManifestEntry,
  getPage,
  routeToSlug,
  slugToRoute,
} from '@/lib/routes';

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  return getAllStaticRoutes().map((route) => ({
    slug: routeToSlug(route),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = slugToRoute(slug);
  const entry = getManifestEntry(route);
  const page = getPage(route);
  const title = page?.detail?.title || entry?.page_title || 'コーディングアライブ';
  return {
    title: title.replace(/\s*\|.*$/, '').replace(/｜.*$/, ''),
    description: page?.detail?.excerpt || undefined,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const route = slugToRoute(slug);
  const entry = getManifestEntry(route);
  if (!entry) notFound();
  return <PageRenderer route={route} />;
}
