import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Collection } from "mongodb";
import { getDb } from "./db";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

export type UserDocument = {
  _id: string;
  username: string;
  passwordHash: string;
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

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [scheme, saltHex, keyHex] = stored.split(":");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Hashed against when the username is unknown, so a miss costs the same time as a wrong password.
const DUMMY_HASH = `scrypt:${"00".repeat(16)}:${"00".repeat(KEY_LENGTH)}`;

export async function findUserByCredentials(username: string, password: string): Promise<UserDocument | null> {
  const user = await (await usersCollection()).findOne({ _id: normalizeUsername(username) });
  const ok = await passwordMatches(password, user?.passwordHash ?? DUMMY_HASH);
  return user && ok ? user : null;
}

export async function findUser(username: string): Promise<UserDocument | null> {
  return (await usersCollection()).findOne({ _id: normalizeUsername(username) });
}

type AccountFailure = { ok: false; status: 403 | 404 | 409; error: string; fieldErrors?: Record<string, string[]> };
export type AccountResult = { ok: true; user: UserDocument } | AccountFailure;

/** Changes the signed-in user's username and/or password after re-checking their current password. */
export async function updateAccount(
  currentUsername: string,
  update: { currentPassword: string; username?: string; newPassword?: string },
): Promise<AccountResult> {
  const users = await usersCollection();
  const user = await users.findOne({ _id: normalizeUsername(currentUsername) });
  if (!user) return { ok: false, status: 404, error: "Your account no longer exists" };
  if (!(await passwordMatches(update.currentPassword, user.passwordHash))) {
    return {
      ok: false,
      status: 403,
      error: "Your current password is incorrect",
      fieldErrors: { currentPassword: ["Your current password is incorrect"] },
    };
  }

  const nextId = update.username ? normalizeUsername(update.username) : user._id;
  const next: UserDocument = {
    ...user,
    _id: nextId,
    username: nextId,
    passwordHash: update.newPassword ? await hashPassword(update.newPassword) : user.passwordHash,
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
      $set: { username: id, passwordHash: await hashPassword(password), role: "admin", updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  return { username: id, created: result.upsertedCount === 1 };
}
