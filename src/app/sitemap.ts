import type { MetadataRoute } from 'next';
import { routeManifest } from '@/lib/routes';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://coding-alive.jp';

export default function sitemap(): MetadataRoute.Sitemap {
  return routeManifest.map((entry) => ({
    url: `${BASE}${entry.local_route === '/' ? '' : entry.local_route}`,
    lastModified: new Date(),
    changeFrequency: entry.page_type === 'detail' ? 'monthly' : 'weekly',
    priority: entry.page_type === 'home' ? 1 : entry.page_type === 'detail' ? 0.6 : 0.8,
  }));
}
