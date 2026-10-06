import { MongoClient, type Collection, type Db } from "mongodb";
import type { EnquiryInput, EnquiryStatus } from "./schema";

export type EnquiryDocument = EnquiryInput & {
  _id: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

let clientPromise: Promise<MongoClient> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

function databaseName() {
  return process.env.MONGODB_DB || "bhsk";
}

async function ensureIndexes(db: Db) {
  const enquiries = db.collection<EnquiryDocument>("enquiries");
  await Promise.all([
    enquiries.createIndex({ createdAt: -1 }),
    enquiries.createIndex({ status: 1, createdAt: -1 }),
  ]);
}

// One client per process, reused across requests (and warm serverless invocations).
async function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (!clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
    clientPromise = client
      .connect()
      .then(async (connected) => {
        await ensureIndexes(connected.db(databaseName()));
        return connected;
      })
      .catch((error) => {
        clientPromise = null;
        throw error;
      });
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  return (await getClient()).db(databaseName());
}

export async function enquiriesCollection(): Promise<Collection<EnquiryDocument>> {
  return (await getDb()).collection<EnquiryDocument>("enquiries");
}

export async function pingDatabase(): Promise<boolean> {
  try {
    await (await getDb()).command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabase() {
  if (!clientPromise) return;
  const client = await clientPromise.catch(() => null);
  clientPromise = null;
  await client?.close();
}
