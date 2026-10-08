import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { isDatabaseConfigured } from "./db";
import { findUser, findUserByCredentials } from "./users";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

// `pwd` ties the session to the password it was issued for, so changing a password signs that user out.
type SessionPayload = { sub: string; pwd: string; exp: number };

// Admin users live in the "users" collection, so login only needs the database.
export function isAdminConfigured() {
  return isDatabaseConfigured();
}

// Compare fixed-length digests so neither content nor length leaks through timing.
function safeEqual(a: string, b: string) {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function passwordFingerprint(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}

export async function verifyCredentials(username: string, password: string) {
  if (!isAdminConfigured()) return null;
  return findUserByCredentials(username, password);
}

// Without an explicit secret, derive one from the connection string so every instance of the service agrees.
function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    createHash("sha256").update(`bhsk-admin:${process.env.MONGODB_URI}`).digest("hex")
  );
}

function sign(data: string) {
  return createHmac("sha256", sessionSecret()).update(data).digest("base64url");
}

export function createSessionToken(user: { _id: string; passwordHash: string }) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(
    JSON.stringify({
      sub: user._id,
      pwd: passwordFingerprint(user.passwordHash),
      exp: expiresAt,
    } satisfies SessionPayload),
  ).toString("base64url");
  return { token: `${payload}.${sign(payload)}`, expiresAt: new Date(expiresAt).toISOString() };
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!isAdminConfigured()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  let session: SessionPayload;
  try {
    session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
  if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
  if (typeof session.sub !== "string" || typeof session.pwd !== "string") return null;

  const user = await findUser(session.sub);
  if (!user || !safeEqual(session.pwd, passwordFingerprint(user.passwordHash))) return null;
  return session;
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, error: "Please sign in again" });
    return;
  }
  verifySessionToken(header.slice("Bearer ".length))
    .then((session) => {
      if (!session) {
        res.status(401).json({ ok: false, error: "Please sign in again" });
        return;
      }
      res.locals.admin = session.sub;
      next();
    })
    .catch(next);
};
