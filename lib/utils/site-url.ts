const LOCAL = 'http://localhost:5174';

// Absolute origin, needed by sitemap.ts and robots.ts — both must emit fully
// qualified URLs — and by metadataBase in the root layout. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL to the canonical production domain, so this is
// correct on a deploy with no configuration. Set NEXT_PUBLIC_SITE_URL to
// override (e.g. to use a custom domain in preview builds too).
export function siteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (explicit) {
        // Tolerate a bare host. `metadataBase` does `new URL()` on this at
        // module scope in the root layout, so an unparseable value would throw
        // on every route — and a root-layout throw is not catchable by
        // app/error.tsx.
        const withScheme = /^https?:\/\//i.test(explicit)
            ? explicit
            : `https://${explicit}`;
        const normalised = withScheme.replace(/\/+$/, '');

        try {
            return new URL(normalised).origin;
        } catch {
            console.warn(
                `siteUrl: NEXT_PUBLIC_SITE_URL is not a valid URL (${explicit}) — falling back`
            );
        }
    }

    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercel) return `https://${vercel}`;

    // Falling back to localhost in a production build would bake it into
    // sitemap.xml, robots.txt and metadataBase, which is worse than nothing.
    if (process.env.NODE_ENV === 'production') {
        console.warn(
            'siteUrl: neither NEXT_PUBLIC_SITE_URL nor VERCEL_PROJECT_PRODUCTION_URL is set — sitemap.xml, robots.txt and metadataBase will point at localhost'
        );
    }

    return LOCAL;
}
