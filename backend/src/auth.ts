import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

type SessionPayload = { sub: string; exp: number };

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

// Compare fixed-length digests so neither content nor length leaks through timing.
function safeEqual(a: string, b: string) {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

export function verifyCredentials(username: string, password: string) {
  if (!isAdminConfigured()) return false;
  const userOk = safeEqual(username, process.env.ADMIN_USERNAME!);
  const passOk = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return userOk && passOk;
}

// Without an explicit secret, derive one from the credentials so changing the password signs everyone out.
function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    createHash("sha256").update(`bhsk-admin:${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).digest("hex")
  );
}

function sign(data: string) {
  return createHmac("sha256", sessionSecret()).update(data).digest("base64url");
}

export function createSessionToken(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ sub: username, exp: expiresAt } satisfies SessionPayload)).toString(
    "base64url",
  );
  return { token: `${payload}.${sign(payload)}`, expiresAt: new Date(expiresAt).toISOString() };
}

export function verifySessionToken(token: string): SessionPayload | null {
  if (!isAdminConfigured()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    if (session.sub !== process.env.ADMIN_USERNAME) return null;
    return session;
  } catch {
    return null;
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization ?? "";
  const session = header.startsWith("Bearer ") ? verifySessionToken(header.slice("Bearer ".length)) : null;
  if (!session) {
    res.status(401).json({ ok: false, error: "Please sign in again" });
    return;
  }
  res.locals.admin = session.sub;
  next();
};
