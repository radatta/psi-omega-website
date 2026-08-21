import { beforeEach, describe, expect, test } from 'bun:test';
import {
    RATE_LIMIT_MAX_FAILURES,
    RATE_LIMIT_WINDOW_MS,
    checkRateLimit,
    clearFailures,
    recordFailure,
    resetRateLimit,
} from '@/lib/server/rate-limit';

const NOW = 1_700_000_000_000;
const IP = '203.0.113.7';

beforeEach(() => resetRateLimit());

describe('login rate limiting', () => {
    test('allows a fresh client', () => {
        expect(checkRateLimit(IP, NOW).allowed).toBe(true);
    });

    test('blocks only after the failure limit is reached', () => {
        for (let i = 0; i < RATE_LIMIT_MAX_FAILURES; i++) {
            expect(checkRateLimit(IP, NOW).allowed).toBe(true);
            recordFailure(IP, NOW);
        }
        const blocked = checkRateLimit(IP, NOW);
        expect(blocked.allowed).toBe(false);
        expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    });

    test('the window expires', () => {
        for (let i = 0; i < RATE_LIMIT_MAX_FAILURES; i++) {
            recordFailure(IP, NOW);
        }
        expect(checkRateLimit(IP, NOW).allowed).toBe(false);
        expect(checkRateLimit(IP, NOW + RATE_LIMIT_WINDOW_MS + 1).allowed).toBe(
            true
        );
    });

    test('a successful login clears the count', () => {
        for (let i = 0; i < RATE_LIMIT_MAX_FAILURES; i++) {
            recordFailure(IP, NOW);
        }
        expect(checkRateLimit(IP, NOW).allowed).toBe(false);
        clearFailures(IP);
        expect(checkRateLimit(IP, NOW).allowed).toBe(true);
    });

    test('clients are counted independently', () => {
        for (let i = 0; i < RATE_LIMIT_MAX_FAILURES; i++) {
            recordFailure(IP, NOW);
        }
        expect(checkRateLimit(IP, NOW).allowed).toBe(false);
        expect(checkRateLimit('198.51.100.4', NOW).allowed).toBe(true);
    });
});
