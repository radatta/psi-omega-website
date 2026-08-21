import { createHash, createHmac, timingSafeEqual } from 'crypto';

export const SESSION_COOKIE = 'db_session';
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours, in seconds

// The signing key is derived from the password rather than being its own env
// var, so rotating DATABASE_PASSWORD invalidates every outstanding session and
// there is only one secret to keep in sync between .env and Vercel.
const signingKey = (password: string) =>
    createHmac('sha256', password).update('db-session-v1').digest();

const sign = (payload: string, password: string) =>
    createHmac('sha256', signingKey(password)).update(payload).digest('hex');

// timingSafeEqual throws on length mismatch, which would itself leak length.
// Hashing first makes both sides a fixed 32 bytes.
export function safeEqual(a: string, b: string) {
    const ha = createHash('sha256').update(a).digest();
    const hb = createHash('sha256').update(b).digest();
    return timingSafeEqual(ha, hb);
}

export function createSessionToken(password: string, now = Date.now()) {
    const expiresAt = now + SESSION_MAX_AGE * 1000;
    return `${expiresAt}.${sign(String(expiresAt), password)}`;
}

export function verifySessionToken(
    token: string | undefined,
    password: string,
    now = Date.now()
) {
    if (!token) return false;

    const separator = token.indexOf('.');
    if (separator < 1) return false;

    const expiresAt = token.slice(0, separator);
    const signature = token.slice(separator + 1);

    // Reject the signature before trusting the expiry it covers.
    if (!safeEqual(signature, sign(expiresAt, password))) return false;

    const expiry = Number(expiresAt);
    return Number.isFinite(expiry) && expiry > now;
}
