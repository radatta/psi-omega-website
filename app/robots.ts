import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils/site-url';

export default function robots(): MetadataRoute.Robots {
    const base = siteUrl();
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // Nothing to index behind the password gate, and no reason to
            // advertise the API routes.
            disallow: ['/database'],
        },
        sitemap: `${base}/sitemap.xml`,
    };
}
