// A deliberately small in-process failure counter for the /database login.
//
// Caveat worth knowing: on Vercel each serverless instance has its own copy of
// this map, so the real ceiling is (limit x number of warm instances) and the
// counter resets whenever an instance is recycled. That is still a large
// improvement over unlimited online guessing against a single shared password,
// and it needs no external store. If the chapter ever needs a hard guarantee,
// that is the point to reach for a shared store — not before.

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

interface Bucket {
    failures: number;
    resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Keeps the map from growing without bound on a long-lived instance.
function prune(now: number) {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}

export function checkRateLimit(key: string, now = Date.now()) {
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        return { allowed: true, retryAfterSeconds: 0 };
    }
    if (bucket.failures < MAX_FAILURES) {
        return { allowed: true, retryAfterSeconds: 0 };
    }
    return {
        allowed: false,
        retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
}

export function recordFailure(key: string, now = Date.now()) {
    prune(now);
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { failures: 1, resetAt: now + WINDOW_MS });
        return;
    }
    bucket.failures += 1;
}

export function clearFailures(key: string) {
    buckets.delete(key);
}

// Test seam — the map is module state that would otherwise leak between tests.
export function resetRateLimit() {
    buckets.clear();
}

export const RATE_LIMIT_MAX_FAILURES = MAX_FAILURES;
export const RATE_LIMIT_WINDOW_MS = WINDOW_MS;
