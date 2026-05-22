import manifest from '@/data/route-manifest.json';
import pagesIndex from '@/data/pages-index.json';
import type { PageData, RouteManifestEntry } from './types';

function dedupeManifest(entries: RouteManifestEntry[]): RouteManifestEntry[] {
  const map = new Map<string, RouteManifestEntry>();
  for (const e of entries) {
    const key = normalizePath(e.local_route);
    if (!map.has(key)) map.set(key, { ...e, local_route: key });
  }
  return [...map.values()];
}

function dedupePages(pages: PageData[]): PageData[] {
  const map = new Map<string, PageData>();
  for (const p of pages) {
    const key = normalizePath(p.route);
    if (!map.has(key) || (p.cards?.length ?? 0) > (map.get(key)?.cards?.length ?? 0)) {
      map.set(key, { ...p, route: key });
    }
  }
  return [...map.values()];
}

export const routeManifest = dedupeManifest(manifest as RouteManifestEntry[]);
export const pagesByRoute = new Map(dedupePages(pagesIndex as PageData[]).map((p) => [p.route, p]));

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const decoded = decodeURIComponent(pathname);
  return decoded.endsWith('/') && decoded.length > 1 ? decoded.slice(0, -1) : decoded;
}

export function getPage(pathname: string): PageData | undefined {
  return pagesByRoute.get(normalizePath(pathname));
}

export function getManifestEntry(pathname: string): RouteManifestEntry | undefined {
  const route = normalizePath(pathname);
  return routeManifest.find((r) => r.local_route === route);
}

export function routeToSlug(route: string): string[] {
  if (route === '/') return [];
  return route.replace(/^\//, '').split('/').filter(Boolean);
}

export function slugToRoute(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/';
  return `/${slug.map((s) => decodeURIComponent(s)).join('/')}`;
}

export function getAllStaticRoutes(): string[] {
  return routeManifest.map((r) => r.local_route).filter((r) => r !== '/');
}

export const navLinks = [
  { href: '/our-strength', label: '選ばれる理由', en: 'Our Strength' },
  { href: '/services', label: 'サービス', en: 'Services' },
  { href: '/fee', label: '料金', en: 'Fee' },
  { href: '/faq', label: 'FAQ', en: 'FAQ' },
  { href: '/work', label: '開発事例', en: 'works' },
  { href: '/animation', label: 'アニメーション', en: 'Animation' },
  { href: '/blog', label: 'ブログ', en: 'blog' },
  { href: '/staff', label: 'スタッフ紹介', en: 'Staff' },
  { href: '/company', label: '会社概要', en: 'Company' },
] as const;
