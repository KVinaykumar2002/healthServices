import type { RequestHandler } from "express";

/**
 * CORS for a cross-origin frontend (e.g. a static site on another domain).
 * CORS_ORIGINS is a comma-separated allow-list, or "*" to allow any origin.
 */
function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  if (!origin || allowed.length === 0) return {};

  const allowAny = allowed.includes("*");
  if (!allowAny && !allowed.includes(origin)) return {};

  return {
    "Access-Control-Allow-Origin": allowAny ? "*" : origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Expose-Headers": "Content-Disposition",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export const cors: RequestHandler = (req, res, next) => {
  for (const [name, value] of Object.entries(corsHeaders(req.headers.origin))) {
    res.setHeader(name, value);
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
};
