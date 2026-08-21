import { describe, expect, test } from 'bun:test';
import {
    SESSION_MAX_AGE,
    createSessionToken,
    safeEqual,
    sessionConfig,
    verifySessionToken,
} from '@/lib/server/session';

const CONFIG = { password: 'correct-horse-battery-staple', secret: 'secret-a' };
const NOW = 1_700_000_000_000;

describe('safeEqual', () => {
    test('matches identical strings', () => {
        expect(safeEqual('abc', 'abc')).toBe(true);
    });

    test('rejects different strings of the same length', () => {
        expect(safeEqual('abc', 'abd')).toBe(false);
    });

    test('rejects different lengths without throwing', () => {
        expect(safeEqual('a', 'aaaaaaaaaaaa')).toBe(false);
        expect(safeEqual('', 'a')).toBe(false);
    });
});

describe('sessionConfig', () => {
    const withEnv = (
        vars: Record<string, string | undefined>,
        run: () => void
    ) => {
        const saved = { ...process.env };
        Object.assign(process.env, vars);
        for (const [k, v] of Object.entries(vars)) {
            if (v === undefined) delete process.env[k];
        }
        try {
            run();
        } finally {
            process.env = saved;
        }
    };

    test('is null unless both variables are set', () => {
        withEnv(
            {
                DATABASE_PASSWORD: undefined,
                DATABASE_SESSION_SECRET: undefined,
            },
            () => expect(sessionConfig()).toBeNull()
        );
        withEnv(
            { DATABASE_PASSWORD: 'p', DATABASE_SESSION_SECRET: undefined },
            () => expect(sessionConfig()).toBeNull()
        );
        withEnv(
            { DATABASE_PASSWORD: undefined, DATABASE_SESSION_SECRET: 's' },
            () => expect(sessionConfig()).toBeNull()
        );
    });

    test('treats an empty string as unset', () => {
        withEnv({ DATABASE_PASSWORD: '', DATABASE_SESSION_SECRET: 's' }, () =>
            expect(sessionConfig()).toBeNull()
        );
    });

    test('returns both values when set', () => {
        withEnv({ DATABASE_PASSWORD: 'p', DATABASE_SESSION_SECRET: 's' }, () =>
            expect(sessionConfig()).toEqual({ password: 'p', secret: 's' })
        );
    });
});

describe('session tokens', () => {
    test('a freshly issued token verifies', () => {
        const token = createSessionToken(CONFIG, NOW);
        expect(verifySessionToken(token, CONFIG, NOW)).toBe(true);
    });

    test('a token does not survive a password change', () => {
        const token = createSessionToken(CONFIG, NOW);
        const rotated = { ...CONFIG, password: 'a-new-password' };
        expect(verifySessionToken(token, rotated, NOW)).toBe(false);
    });

    test('a token issued under one secret fails under another', () => {
        const token = createSessionToken(CONFIG, NOW);
        const other = { ...CONFIG, secret: 'secret-b' };
        expect(verifySessionToken(token, other, NOW)).toBe(false);
    });

    test('a token expires', () => {
        const token = createSessionToken(CONFIG, NOW);
        expect(
            verifySessionToken(token, CONFIG, NOW + SESSION_MAX_AGE * 1000 - 1)
        ).toBe(true);
        expect(
            verifySessionToken(token, CONFIG, NOW + SESSION_MAX_AGE * 1000 + 1)
        ).toBe(false);
    });

    test('the expiry cannot be extended without resigning', () => {
        const [, fingerprint, signature] = createSessionToken(
            CONFIG,
            NOW
        ).split('.');
        const forged = `${NOW + 10 ** 12}.${fingerprint}.${signature}`;
        expect(verifySessionToken(forged, CONFIG, NOW)).toBe(false);
    });

    test('a tampered signature is rejected', () => {
        const [expiry, fingerprint, signature] = createSessionToken(
            CONFIG,
            NOW
        ).split('.');
        const flipped =
            signature.slice(0, -1) + (signature.endsWith('a') ? 'b' : 'a');
        expect(
            verifySessionToken(
                `${expiry}.${fingerprint}.${flipped}`,
                CONFIG,
                NOW
            )
        ).toBe(false);
    });

    test('a tampered fingerprint is rejected', () => {
        const [expiry, fingerprint, signature] = createSessionToken(
            CONFIG,
            NOW
        ).split('.');
        const flipped =
            fingerprint.slice(0, -1) + (fingerprint.endsWith('a') ? 'b' : 'a');
        expect(
            verifySessionToken(`${expiry}.${flipped}.${signature}`, CONFIG, NOW)
        ).toBe(false);
    });

    test('the cookie does not contain the password', () => {
        const token = createSessionToken(CONFIG, NOW);
        expect(token).not.toContain(CONFIG.password);
        expect(token).not.toContain(CONFIG.secret);
    });

    test('malformed tokens are rejected rather than throwing', () => {
        for (const bad of [
            undefined,
            '',
            '.',
            '..',
            'nodot',
            'one.two',
            'a.b.c.d',
            '.onlysignature',
            'not-a-number.deadbeef.deadbeef',
        ]) {
            expect(verifySessionToken(bad, CONFIG, NOW)).toBe(false);
        }
    });
});
