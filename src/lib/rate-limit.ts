type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  prune(now);
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }

  if (current.count >= options.limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { ok: true };
}

export function tooManyRequests(retryAfter: number) {
  return {
    body: {
      error: "Trop de tentatives. Réessayez dans quelques minutes.",
    },
    init: {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    },
  };
}
