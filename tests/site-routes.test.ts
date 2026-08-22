import { describe, expect, test } from 'bun:test';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';

const APP_DIR = join(import.meta.dir, '..', 'app');

// Every directory under app/ that renders a page, as a URL path.
const pageRoutes = readdirSync(APP_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(APP_DIR, entry.name, 'page.tsx')))
    .map((entry) => `/${entry.name}`);

describe('sitemap', () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    test('found the real routes to compare against', () => {
        expect(pageRoutes.length).toBeGreaterThanOrEqual(7);
    });

    test('lists the home page', () => {
        expect(paths).toContain('/');
    });

    test('lists every page except the gated database', () => {
        for (const route of pageRoutes) {
            if (route === '/database') continue;
            expect(paths).toContain(route);
        }
    });

    test('does not list the password-gated database', () => {
        expect(paths).not.toContain('/database');
    });

    test('has no duplicates and uses absolute URLs', () => {
        expect(new Set(paths).size).toBe(paths.length);
        for (const entry of sitemap()) {
            expect(entry.url.startsWith('http')).toBe(true);
        }
    });
});

describe('robots', () => {
    test('disallows the database and points at the sitemap', () => {
        const result = robots();
        const rules = Array.isArray(result.rules)
            ? result.rules[0]
            : result.rules;
        expect(rules.disallow).toContain('/database');
        expect(String(result.sitemap)).toContain('/sitemap.xml');
    });
});
