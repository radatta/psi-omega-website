// Absolute origin, needed by sitemap.ts and robots.ts — both must emit fully
// qualified URLs. Vercel sets VERCEL_PROJECT_PRODUCTION_URL to the canonical
// production domain, so this is correct on a deploy without any configuration.
// Set NEXT_PUBLIC_SITE_URL to override (e.g. once a custom domain is attached
// and you want it used in preview builds too).
export function siteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return explicit.replace(/\/+$/, '');

    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercel) return `https://${vercel}`;

    return 'http://localhost:5174';
}
