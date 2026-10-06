import { randomBytes } from "node:crypto";
import { Binary } from "mongodb";
import { getDb } from "./db";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Uploads younger than this survive cleanup, so a photo added but not yet saved isn't removed by another save. */
const CLEANUP_GRACE_MS = 24 * 60 * 60 * 1000;

type MediaDocument = { _id: string; contentType: string; data: Binary; size: number; createdAt: Date };

async function mediaCollection() {
  return (await getDb()).collection<MediaDocument>("media");
}

/** Identifies the image from its bytes rather than trusting the declared Content-Type. */
export function detectImageType(data: Buffer): string | null {
  if (data.length < 12) return null;
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return "image/jpeg";
  if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") {
    return "image/webp";
  }
  return null;
}

export async function saveMedia(data: Buffer, contentType: string) {
  const id = randomBytes(12).toString("hex");
  await (await mediaCollection()).insertOne({
    _id: id,
    contentType,
    data: new Binary(data),
    size: data.length,
    createdAt: new Date(),
  });
  return id;
}

export async function getMedia(id: string) {
  const document = await (await mediaCollection()).findOne({ _id: id });
  if (!document) return null;
  return { contentType: document.contentType, data: Buffer.from(document.data.buffer) };
}

export async function deleteMediaExcept(keepIds: string[]) {
  await (await mediaCollection()).deleteMany({
    _id: { $nin: keepIds },
    createdAt: { $lt: new Date(Date.now() - CLEANUP_GRACE_MS) },
  });
}
