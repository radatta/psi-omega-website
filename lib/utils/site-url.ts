const LOCAL = 'http://localhost:5174';

// Absolute origin, needed by sitemap.ts and robots.ts — both must emit fully
// qualified URLs — and by metadataBase in the root layout. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL to the canonical production domain, so this is
// correct on a deploy with no configuration. Set NEXT_PUBLIC_SITE_URL to
// override (e.g. to use a custom domain in preview builds too).
export function siteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return explicit.replace(/\/+$/, '');

    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercel) return `https://${vercel}`;

    // Falling back to localhost in a production build would bake it into
    // sitemap.xml and robots.txt, which is worse than having neither.
    if (process.env.NODE_ENV === 'production') {
        console.warn(
            'siteUrl: neither NEXT_PUBLIC_SITE_URL nor VERCEL_PROJECT_PRODUCTION_URL is set — sitemap.xml and robots.txt will point at localhost'
        );
    }

    return LOCAL;
}
