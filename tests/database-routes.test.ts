import { beforeEach, describe, expect, test } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from '@/app/database/api/check-password/route';
import { GET } from '@/app/database/api/sheet/route';
import { resetRateLimit } from '@/lib/server/rate-limit';
import { SESSION_COOKIE, createSessionToken } from '@/lib/server/session';

// These exercise the real handlers. All but one assertion sit on a path that
// short-circuits before the Google call. The exception is the last test, which
// deliberately gets past the gate; it still makes no network request, because
// google-auth-library rejects the placeholder credentials locally. That is why
// it expects 502 — the handler's own error path — and why bun test prints a
// google-auth stack for that case.
const PASSWORD = 'test-password';
const SECRET = 'test-secret';

const configure = () => {
    process.env.DATABASE_PASSWORD = PASSWORD;
    process.env.DATABASE_SESSION_SECRET = SECRET;
    process.env.GOOGLE_SHEET_ID = 'test-sheet-id';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = '{"type":"service_account"}';
};

const unconfigure = () => {
    delete process.env.DATABASE_PASSWORD;
    delete process.env.DATABASE_SESSION_SECRET;
};

const sheetRequest = (cookie?: string) =>
    new NextRequest('http://localhost:5174/database/api/sheet', {
        headers: cookie ? { cookie } : {},
    });

const loginRequest = (
    password: unknown,
    ip = '203.0.113.9',
    headerName = 'x-forwarded-for'
) =>
    new NextRequest('http://localhost:5174/database/api/check-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json', [headerName]: ip },
        body: JSON.stringify({ password }),
    });

// x-forwarded-for's leftmost value is client-supplied, so an attacker could
// rotate it to get a fresh rate-limit bucket per attempt. x-real-ip is set by
// the proxy and must win.
const spoofedRequest = (attempt: number) =>
    new NextRequest('http://localhost:5174/database/api/check-password', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-real-ip': '198.51.100.77',
            'x-forwarded-for': `10.0.0.${attempt}`,
        },
        body: JSON.stringify({ password: 'wrong' }),
    });

beforeEach(() => {
    resetRateLimit();
    configure();
});

describe('GET /database/api/sheet', () => {
    test('401s with no session cookie', async () => {
        const res = await GET(sheetRequest());
        expect(res.status).toBe(401);
    });

    test('401s on a garbage cookie', async () => {
        const res = await GET(sheetRequest(`${SESSION_COOKIE}=not-a-token`));
        expect(res.status).toBe(401);
    });

    test('401s on a cookie signed with a different secret', async () => {
        const token = createSessionToken({
            password: PASSWORD,
            secret: 'some-other-secret',
        });
        const res = await GET(sheetRequest(`${SESSION_COOKIE}=${token}`));
        expect(res.status).toBe(401);
    });

    test('401s on a cookie issued before a password rotation', async () => {
        const token = createSessionToken({
            password: 'the-old-password',
            secret: SECRET,
        });
        const res = await GET(sheetRequest(`${SESSION_COOKIE}=${token}`));
        expect(res.status).toBe(401);
    });

    test('503s when the server is not configured', async () => {
        unconfigure();
        const res = await GET(sheetRequest());
        expect(res.status).toBe(503);
    });

    test('never caches its responses', async () => {
        const res = await GET(sheetRequest());
        expect(res.headers.get('cache-control')).toBe('no-store');
    });
});

describe('POST /database/api/check-password', () => {
    test('401s on the wrong password and sets no cookie', async () => {
        const res = await POST(loginRequest('wrong'));
        expect(res.status).toBe(401);
        expect(res.headers.get('set-cookie')).toBeNull();
    });

    test('401s on a non-string password', async () => {
        expect((await POST(loginRequest(null))).status).toBe(401);
        expect((await POST(loginRequest({ evil: true }))).status).toBe(401);
    });

    test('503s when the server is not configured', async () => {
        unconfigure();
        const res = await POST(loginRequest(PASSWORD));
        expect(res.status).toBe(503);
    });

    test('issues an HttpOnly session cookie on success', async () => {
        const res = await POST(loginRequest(PASSWORD));
        expect(res.status).toBe(200);
        const cookie = res.headers.get('set-cookie') ?? '';
        expect(cookie).toContain(`${SESSION_COOKIE}=`);
        expect(cookie.toLowerCase()).toContain('httponly');
        expect(cookie.toLowerCase()).toContain('path=/database');
        expect(cookie).not.toContain(PASSWORD);
    });

    test('the issued cookie is accepted by the sheet route', async () => {
        const login = await POST(loginRequest(PASSWORD));
        const token = (login.headers.get('set-cookie') ?? '')
            .split(';')[0]
            .split('=')
            .slice(1)
            .join('=');

        // A valid session gets past the gate and fails at the Google call,
        // which is exactly what proves the gate opened. 502 is the handler's
        // upstream-failure path — asserting it rather than `not 401` keeps the
        // test from passing on an unrelated 500 or 503.
        const res = await GET(sheetRequest(`${SESSION_COOKIE}=${token}`));
        expect(res.status).toBe(502);
    });

    test('rate limits by x-real-ip even when x-forwarded-for rotates', async () => {
        let blockedAt = -1;
        for (let i = 0; i < 20; i++) {
            const res = await POST(spoofedRequest(i));
            if (res.status === 429) {
                blockedAt = i;
                break;
            }
        }
        expect(blockedAt).toBeGreaterThan(-1);
    });

    test('prefers x-real-ip over x-forwarded-for for the bucket', async () => {
        for (let i = 0; i < 12; i++) {
            await POST(loginRequest('wrong', '192.0.2.50', 'x-real-ip'));
        }
        expect(
            (await POST(loginRequest('wrong', '192.0.2.50', 'x-real-ip')))
                .status
        ).toBe(429);
        // A different real IP is unaffected.
        expect(
            (await POST(loginRequest('wrong', '192.0.2.51', 'x-real-ip')))
                .status
        ).toBe(401);
    });

    test('rate limits repeated failures from one client', async () => {
        let sawRateLimit = false;
        for (let i = 0; i < 15; i++) {
            const res = await POST(loginRequest('wrong', '198.51.100.22'));
            if (res.status === 429) {
                sawRateLimit = true;
                break;
            }
        }
        expect(sawRateLimit).toBe(true);
    });
});
