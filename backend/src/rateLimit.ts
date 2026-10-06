import type { RequestHandler } from "express";

type Bucket = { count: number; resetAt: number };

/** Fixed-window, in-memory limiter keyed by client IP. Suitable for a single server instance. */
export function rateLimit({ windowMs, max }: { windowMs: number; max: number }): RequestHandler {
  const buckets = new Map<string, Bucket>();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? "unknown";

    if (buckets.size > 10_000) {
      for (const [ip, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(ip);
      }
    }

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    if (bucket.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      res.status(429).json({ ok: false, error: "Too many enquiries. Please try again later." });
      return;
    }

    next();
  };
}
