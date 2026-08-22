import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Server-only. Lives under lib/server/ rather than lib/utils/ so it can never
// be pulled into a client bundle by a stray import.

export const SESSION_COOKIE = 'db_session';
export const SESSION_COOKIE_PATH = '/database';
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours, in seconds

export interface SessionConfig {
    password: string;
    secret: string;
}

// Both are required. Missing either means no session can be issued or accepted,
// which is what makes the page fail closed.
export function sessionConfig(): SessionConfig | null {
    const password = process.env.DATABASE_PASSWORD;
    const secret = process.env.DATABASE_SESSION_SECRET;
    if (!password || !secret) return null;
    return { password, secret };
}

// timingSafeEqual throws on length mismatch, which would itself leak length.
// Hashing first makes both sides a fixed 32 bytes.
export function safeEqual(a: string, b: string) {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
}

const sign = (payload: string, secret: string) =>
    createHmac('sha256', secret).update(payload).digest('hex');

// Ties a session to the password that created it, so rotating
// DATABASE_PASSWORD invalidates outstanding sessions. Keyed on the secret, so
// the cookie is never a crackable function of the password itself — an
// attacker holding a stolen cookie cannot brute-force the password from it.
const fingerprint = (password: string, secret: string) =>
    createHmac('sha256', secret).update(`pw:${password}`).digest('hex');

export function createSessionToken(
    { password, secret }: SessionConfig,
    now = Date.now()
) {
    const expiresAt = now + SESSION_MAX_AGE * 1000;
    const payload = `${expiresAt}.${fingerprint(password, secret)}`;
    return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(
    token: string | undefined,
    { password, secret }: SessionConfig,
    now = Date.now()
) {
    if (!token) return false;

    // expiry.fingerprint.signature — neither of the first two contains a dot.
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [expiresAt, tokenFingerprint, signature] = parts;

    // Check the signature before trusting anything the payload claims.
    const payload = `${expiresAt}.${tokenFingerprint}`;
    if (!safeEqual(signature, sign(payload, secret))) return false;

    if (!safeEqual(tokenFingerprint, fingerprint(password, secret)))
        return false;

    const expiry = Number(expiresAt);
    return Number.isFinite(expiry) && expiry > now;
}
