import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils/site-url';

// /database is deliberately absent — it's a password gate with nothing to index.
const routes = [
    '',
    '/about-akpsi',
    '/meet-the-brothers',
    '/rush-akpsi',
    '/events',
    '/memories',
    '/legacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
    const base = siteUrl();
    return routes.map((route) => ({
        url: `${base}${route}`,
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));
}
