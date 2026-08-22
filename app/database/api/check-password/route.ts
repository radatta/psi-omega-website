import { NextRequest, NextResponse } from 'next/server';
import {
    checkRateLimit,
    clearFailures,
    recordFailure,
} from '@/lib/server/rate-limit';
import {
    SESSION_COOKIE,
    SESSION_COOKIE_PATH,
    SESSION_MAX_AGE,
    createSessionToken,
    safeEqual,
    sessionConfig,
} from '@/lib/server/session';

// x-real-ip is set by the proxy and not forwarded from the client, so prefer it
// over x-forwarded-for, whose leftmost value is client-supplied.
const clientKey = (request: NextRequest) =>
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';

export async function POST(request: NextRequest) {
    const config = sessionConfig();

    // Fail closed. Without both env vars there is no correct password, so no
    // request can be granted a session.
    if (!config) {
        console.error(
            'DATABASE_PASSWORD or DATABASE_SESSION_SECRET is not set — refusing all logins'
        );
        return NextResponse.json(
            { success: false, error: 'not_configured' },
            { status: 503 }
        );
    }

    const key = clientKey(request);
    const limit = checkRateLimit(key);
    if (!limit.allowed) {
        return NextResponse.json(
            { success: false, error: 'rate_limited' },
            {
                status: 429,
                headers: { 'Retry-After': String(limit.retryAfterSeconds) },
            }
        );
    }

    const body = await request.json().catch(() => null);
    const submitted =
        body && typeof body.password === 'string' ? body.password : '';

    if (!safeEqual(submitted, config.password)) {
        recordFailure(key);
        return NextResponse.json({ success: false }, { status: 401 });
    }

    clearFailures(key);

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(config), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: SESSION_COOKIE_PATH,
        maxAge: SESSION_MAX_AGE,
    });
    return response;
}
