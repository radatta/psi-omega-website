import { beforeEach, describe, expect, test } from 'bun:test';
import { NextRequest } from 'next/server';
import { POST } from '@/app/database/api/check-password/route';
import { GET } from '@/app/database/api/sheet/route';
import { resetRateLimit } from '@/lib/server/rate-limit';
import { SESSION_COOKIE, createSessionToken } from '@/lib/server/session';

// These exercise the real handlers. Every assertion below is on a path that
// short-circuits before the Google call, so the suite makes no network request.
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

const loginRequest = (password: unknown, ip = '203.0.113.9') =>
    new NextRequest('http://localhost:5174/database/api/check-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify({ password }),
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

        // A valid session gets past the gate; it then fails at the Google call,
        // which is exactly what proves the gate opened.
        const res = await GET(sheetRequest(`${SESSION_COOKIE}=${token}`));
        expect(res.status).not.toBe(401);
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
