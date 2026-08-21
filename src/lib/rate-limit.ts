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

function memoryLimit(
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

function upstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

async function upstashCommand(args: string[]): Promise<unknown> {
  const base = process.env.UPSTASH_REDIS_REST_URL!.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const res = await fetch(`${base}/${args.map(encodeURIComponent).join("/")}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash ${res.status}`);
  }
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

async function upstashLimit(
  key: string,
  options: { limit: number; windowMs: number }
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  const redisKey = `rl:${key}`;
  const windowSec = Math.max(1, Math.ceil(options.windowMs / 1000));

  const count = Number(await upstashCommand(["INCR", redisKey]));
  if (count === 1) {
    await upstashCommand(["EXPIRE", redisKey, String(windowSec)]);
  }

  if (count > options.limit) {
    const ttl = Number(await upstashCommand(["TTL", redisKey]));
    return {
      ok: false,
      retryAfter: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSec,
    };
  }

  return { ok: true };
}

/**
 * Rate-limit : Upstash Redis REST si configuré, sinon Map mémoire (local / fallback).
 */
export async function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): Promise<{ ok: true } | { ok: false; retryAfter: number }> {
  if (!upstashConfigured()) {
    return memoryLimit(key, options);
  }

  try {
    return await upstashLimit(key, options);
  } catch {
    return memoryLimit(key, options);
  }
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
