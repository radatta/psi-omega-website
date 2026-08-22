const LOCAL = 'http://localhost:5174';

// Every candidate goes through here. app/layout.tsx does `new URL(siteUrl())`
// at module scope, so returning something unparseable would fail the build and
// take down every route — and a root-layout throw is not catchable by
// app/error.tsx. Returns null rather than throwing so the caller can fall back.
function normalise(candidate: string | undefined): string | null {
    const trimmed = candidate?.trim();
    if (!trimmed) return null;

    // Tolerate a bare host, which is how both Vercel and a hand-set env var
    // usually supply it.
    const withScheme = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;

    try {
        // .origin drops any path — this is an origin, not a base path.
        return new URL(withScheme).origin;
    } catch {
        return null;
    }
}

// Absolute origin, needed by sitemap.ts and robots.ts — both must emit fully
// qualified URLs — and by metadataBase in the root layout. Vercel sets
// VERCEL_PROJECT_PRODUCTION_URL to the canonical production domain, so this is
// correct on a deploy with no configuration. Set NEXT_PUBLIC_SITE_URL to
// override (e.g. to use a custom domain in preview builds too).
export function siteUrl() {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit?.trim()) {
        const normalised = normalise(explicit);
        if (normalised) return normalised;
        console.warn(
            `siteUrl: NEXT_PUBLIC_SITE_URL is not a usable URL (${explicit.trim()}) — falling back`
        );
    }

    const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (vercel?.trim()) {
        const normalised = normalise(vercel);
        if (normalised) return normalised;
        console.warn(
            `siteUrl: VERCEL_PROJECT_PRODUCTION_URL is not a usable URL (${vercel.trim()}) — falling back`
        );
    }

    // Falling back to localhost in a production build would bake it into
    // sitemap.xml, robots.txt and metadataBase, which is worse than nothing.
    if (process.env.NODE_ENV === 'production') {
        console.warn(
            'siteUrl: neither NEXT_PUBLIC_SITE_URL nor VERCEL_PROJECT_PRODUCTION_URL is usable — sitemap.xml, robots.txt and metadataBase will point at localhost'
        );
    }

    return LOCAL;
}
