import { afterEach, describe, expect, test } from 'bun:test';
import { siteUrl } from '@/lib/utils/site-url';

const saved = { ...process.env };

afterEach(() => {
    process.env = { ...saved };
});

const withEnv = (vars: Record<string, string | undefined>) => {
    for (const key of [
        'NEXT_PUBLIC_SITE_URL',
        'VERCEL_PROJECT_PRODUCTION_URL',
        'NODE_ENV',
    ]) {
        delete process.env[key];
    }
    for (const [key, value] of Object.entries(vars)) {
        if (value !== undefined) process.env[key] = value;
    }
};

describe('siteUrl', () => {
    test('prefers an explicit NEXT_PUBLIC_SITE_URL', () => {
        withEnv({ NEXT_PUBLIC_SITE_URL: 'https://psiomega.example' });
        expect(siteUrl()).toBe('https://psiomega.example');
    });

    test('adds a scheme to a bare host', () => {
        // The obvious way to get this wrong. metadataBase does new URL() on it
        // at module scope, so an unparseable value breaks every route.
        withEnv({ NEXT_PUBLIC_SITE_URL: 'psiomega.example' });
        expect(siteUrl()).toBe('https://psiomega.example');
    });

    test('strips trailing slashes', () => {
        withEnv({ NEXT_PUBLIC_SITE_URL: 'https://psiomega.example///' });
        expect(siteUrl()).toBe('https://psiomega.example');
    });

    test('falls back to the Vercel production domain', () => {
        withEnv({ VERCEL_PROJECT_PRODUCTION_URL: 'psi-omega.vercel.app' });
        expect(siteUrl()).toBe('https://psi-omega.vercel.app');
    });

    test('falls back to localhost when nothing is set', () => {
        withEnv({});
        expect(siteUrl()).toBe('http://localhost:5174');
    });

    test('never throws on a malformed value', () => {
        for (const bad of ['http://', ' ', ':::', 'https://:99999']) {
            withEnv({ NEXT_PUBLIC_SITE_URL: bad });
            expect(() => siteUrl()).not.toThrow();
            expect(() => new URL(siteUrl())).not.toThrow();
        }
    });

    test('always returns something new URL() accepts', () => {
        for (const vars of [
            { NEXT_PUBLIC_SITE_URL: 'psiomega.example' },
            { VERCEL_PROJECT_PRODUCTION_URL: 'psi-omega.vercel.app' },
            {},
        ]) {
            withEnv(vars);
            expect(() => new URL(siteUrl())).not.toThrow();
        }
    });
});
