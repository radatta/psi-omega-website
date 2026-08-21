import { NextResponse } from 'next/server';
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE,
    createSessionToken,
    safeEqual,
} from '@/lib/utils/session';

export async function POST(request: Request) {
    const password = process.env.DATABASE_PASSWORD;

    // Fail closed. Without the env var there is no correct password, so no
    // request can be granted a session.
    if (!password) {
        console.error('DATABASE_PASSWORD is not set — refusing all logins');
        return NextResponse.json(
            { success: false, error: 'not_configured' },
            { status: 503 }
        );
    }

    const body = await request.json().catch(() => null);
    const submitted =
        body && typeof body.password === 'string' ? body.password : '';

    if (!safeEqual(submitted, password)) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(password), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });
    return response;
}
