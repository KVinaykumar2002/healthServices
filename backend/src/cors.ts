import type { RequestHandler } from "express";
import { FRONTEND_ALIASES, FRONTEND_URL, LOCAL_FRONTEND_URL } from "../../shared/urls";

/**
 * CORS for the separately hosted frontend. FRONTEND_URL, FRONTEND_ALIASES (shared/urls.ts) and the local dev
 * server are always allowed; CORS_ORIGINS adds a comma-separated list of extra origins, or "*" to allow any.
 */
function corsHeaders(origin: string | undefined): Record<string, string> {
  const allowed = [
    FRONTEND_URL,
    ...FRONTEND_ALIASES,
    LOCAL_FRONTEND_URL,
    ...(process.env.CORS_ORIGINS ?? "").split(","),
  ]
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter(Boolean);
  if (!origin) return {};

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
