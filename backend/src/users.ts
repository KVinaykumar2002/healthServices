import { createHash, timingSafeEqual } from "node:crypto";
import type { Collection } from "mongodb";
import { getDb } from "./db";

// Passwords are kept as plain text on purpose so admins can look theirs up on the Account page.
export type UserDocument = {
  _id: string;
  username: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
};

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export async function usersCollection(): Promise<Collection<UserDocument>> {
  return (await getDb()).collection<UserDocument>("users");
}

// Compare fixed-length digests so neither content nor length leaks through timing.
function passwordMatches(password: string, stored: string) {
  const a = createHash("sha256").update(password).digest();
  const b = createHash("sha256").update(stored).digest();
  return timingSafeEqual(a, b);
}

export async function findUserByCredentials(username: string, password: string): Promise<UserDocument | null> {
  const user = await (await usersCollection()).findOne({ _id: normalizeUsername(username) });
  const ok = passwordMatches(password, user?.password ?? "");
  return user && ok ? user : null;
}

export async function findUser(username: string): Promise<UserDocument | null> {
  return (await usersCollection()).findOne({ _id: normalizeUsername(username) });
}

type AccountFailure = { ok: false; status: 404 | 409; error: string; fieldErrors?: Record<string, string[]> };
export type AccountResult = { ok: true; user: UserDocument } | AccountFailure;

/** Changes the signed-in user's username and/or password. */
export async function updateAccount(
  currentUsername: string,
  update: { username?: string; password?: string },
): Promise<AccountResult> {
  const users = await usersCollection();
  const user = await users.findOne({ _id: normalizeUsername(currentUsername) });
  if (!user) return { ok: false, status: 404, error: "Your account no longer exists" };

  const nextId = update.username ? normalizeUsername(update.username) : user._id;
  const next: UserDocument = {
    ...user,
    _id: nextId,
    username: nextId,
    password: update.password ?? user.password,
    updatedAt: new Date(),
  };

  if (nextId === user._id) {
    await users.replaceOne({ _id: user._id }, next);
    return { ok: true, user: next };
  }

  // The username is the document id, so a rename inserts the new document before removing the old one.
  try {
    await users.insertOne(next);
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return {
        ok: false,
        status: 409,
        error: "That username is already taken",
        fieldErrors: { username: ["That username is already taken"] },
      };
    }
    throw error;
  }
  await users.deleteOne({ _id: user._id });
  return { ok: true, user: next };
}

export async function upsertUser(username: string, password: string) {
  const id = normalizeUsername(username);
  const now = new Date();
  const result = await (await usersCollection()).updateOne(
    { _id: id },
    {
      $set: { username: id, password, role: "admin", updatedAt: now },
      $unset: { passwordHash: "" },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  return { username: id, created: result.upsertedCount === 1 };
}
