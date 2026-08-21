import { describe, expect, test } from 'bun:test';
import {
    SESSION_MAX_AGE,
    createSessionToken,
    safeEqual,
    verifySessionToken,
} from '@/lib/utils/session';

const PASSWORD = 'correct-horse-battery-staple';
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

describe('session tokens', () => {
    test('a freshly issued token verifies', () => {
        const token = createSessionToken(PASSWORD, NOW);
        expect(verifySessionToken(token, PASSWORD, NOW)).toBe(true);
    });

    test('a token issued for one password fails under another', () => {
        const token = createSessionToken(PASSWORD, NOW);
        expect(verifySessionToken(token, 'some-other-password', NOW)).toBe(
            false
        );
    });

    test('a token expires', () => {
        const token = createSessionToken(PASSWORD, NOW);
        const justBefore = NOW + SESSION_MAX_AGE * 1000 - 1;
        const justAfter = NOW + SESSION_MAX_AGE * 1000 + 1;
        expect(verifySessionToken(token, PASSWORD, justBefore)).toBe(true);
        expect(verifySessionToken(token, PASSWORD, justAfter)).toBe(false);
    });

    test('the expiry cannot be extended without resigning', () => {
        const token = createSessionToken(PASSWORD, NOW);
        const signature = token.slice(token.indexOf('.') + 1);
        const forged = `${NOW + 10 ** 12}.${signature}`;
        expect(verifySessionToken(forged, PASSWORD, NOW)).toBe(false);
    });

    test('a tampered signature is rejected', () => {
        const token = createSessionToken(PASSWORD, NOW);
        const [expiry, signature] = token.split('.');
        const flipped =
            signature.slice(0, -1) + (signature.endsWith('a') ? 'b' : 'a');
        expect(verifySessionToken(`${expiry}.${flipped}`, PASSWORD, NOW)).toBe(
            false
        );
    });

    test('malformed tokens are rejected rather than throwing', () => {
        for (const bad of [
            undefined,
            '',
            '.',
            'nodot',
            '.onlysignature',
            'onlyexpiry.',
            'not-a-number.deadbeef',
        ]) {
            expect(verifySessionToken(bad, PASSWORD, NOW)).toBe(false);
        }
    });
});
