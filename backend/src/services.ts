import { randomBytes } from "node:crypto";
import type { Collection } from "mongodb";
import {
  DEFAULT_SERVICES,
  DEFAULT_SERVICE_ID_PREFIX,
  DEFAULT_SERVICE_LIST,
  SERVICE_LIMITS,
  normalizeService,
  type Service,
  type ServiceContent,
} from "../../shared/services";
import { getDb, isDatabaseConfigured } from "./db";

type ServiceDocument = ServiceContent & { _id: string; position: number; updatedAt: Date };

export type ServiceRecord = Service & { updatedAt: string | null };

type Failure = { ok: false; status: 404 | 409; error: string; fieldErrors?: Record<string, string[]> };
export type ServiceResult<T> = { ok: true; value: T } | Failure;

const notFound: Failure = { ok: false, status: 404, error: "Service not found" };

async function servicesCollection() {
  return (await getDb()).collection<ServiceDocument>("services");
}

function defaultRecords(): ServiceRecord[] {
  return DEFAULT_SERVICE_LIST.map((service) => ({ ...service, updatedAt: null }));
}

function toRecord({ _id, position: _position, updatedAt, ...fields }: ServiceDocument): ServiceRecord | null {
  const service = normalizeService(fields);
  return service ? { ...service, id: _id, updatedAt: updatedAt ? updatedAt.toISOString() : null } : null;
}

/** All services in display order; the original services until an admin first changes one. */
export async function listServices({ includeHidden = false } = {}): Promise<ServiceRecord[]> {
  let records = defaultRecords();
  if (isDatabaseConfigured()) {
    const documents = await (await servicesCollection()).find().sort({ position: 1, _id: 1 }).toArray();
    if (documents.length) records = documents.map(toRecord).filter((record) => record !== null);
  }
  return includeHidden ? records : records.filter((service) => service.visible);
}

export async function getService(id: string): Promise<ServiceRecord | null> {
  return (await listServices({ includeHidden: true })).find((service) => service.id === id) ?? null;
}

/** Writes the original services to the database before the first change, keeping their ids. */
async function seededCollection(): Promise<Collection<ServiceDocument>> {
  const collection = await servicesCollection();
  if (!(await collection.findOne({}, { projection: { _id: 1 } }))) {
    const updatedAt = new Date();
    await collection.bulkWrite(
      DEFAULT_SERVICES.map((service, position) => ({
        updateOne: {
          filter: { _id: `${DEFAULT_SERVICE_ID_PREFIX}${service.slug}` },
          update: { $setOnInsert: { ...service, position, updatedAt } },
          upsert: true,
        },
      })),
    );
  }
  return collection;
}

async function checkUnique(collection: Collection<ServiceDocument>, content: ServiceContent, excludeId?: string) {
  const others = await collection
    .find(excludeId ? { _id: { $ne: excludeId } } : {}, { projection: { slug: 1, name: 1 } })
    .toArray();
  const fieldErrors: Record<string, string[]> = {};
  if (others.some((other) => other.slug === content.slug)) {
    fieldErrors.slug = ["Another service already uses this web address"];
  }
  if (others.some((other) => other.name.toLowerCase() === content.name.toLowerCase())) {
    fieldErrors.name = ["Another service already has this name"];
  }
  // Related links may only point at other services that exist.
  const slugs = new Set(others.map((other) => other.slug));
  const relatedSlugs = [...new Set(content.relatedSlugs)].filter((slug) => slug !== content.slug && slugs.has(slug));

  const failure: Failure | null = Object.keys(fieldErrors).length
    ? { ok: false, status: 409, error: "Please fix the highlighted fields", fieldErrors }
    : null;
  return { failure, relatedSlugs };
}

export async function createService(content: ServiceContent): Promise<ServiceResult<ServiceRecord>> {
  const collection = await seededCollection();
  if ((await collection.countDocuments()) >= SERVICE_LIMITS.services) {
    return { ok: false, status: 409, error: `The website can list up to ${SERVICE_LIMITS.services} services` };
  }
  const { failure, relatedSlugs } = await checkUnique(collection, content);
  if (failure) return failure;

  const last = await collection.find({}, { projection: { position: 1 } }).sort({ position: -1 }).limit(1).next();
  const document: ServiceDocument = {
    ...content,
    relatedSlugs,
    _id: randomBytes(12).toString("hex"),
    position: (last?.position ?? -1) + 1,
    updatedAt: new Date(),
  };
  await collection.insertOne(document);
  return { ok: true, value: toRecord(document)! };
}

export async function updateService(id: string, content: ServiceContent): Promise<ServiceResult<ServiceRecord>> {
  const collection = await seededCollection();
  const existing = await collection.findOne({ _id: id });
  if (!existing) return notFound;
  const { failure, relatedSlugs } = await checkUnique(collection, content, id);
  if (failure) return failure;

  const fields = { ...content, relatedSlugs, updatedAt: new Date() };
  await collection.updateOne({ _id: id }, { $set: fields });
  if (existing.slug !== content.slug) {
    await collection.updateMany({ relatedSlugs: existing.slug }, { $set: { "relatedSlugs.$": content.slug } });
  }
  return { ok: true, value: toRecord({ ...existing, ...fields })! };
}

export async function deleteService(id: string): Promise<ServiceResult<null>> {
  const collection = await seededCollection();
  const existing = await collection.findOne({ _id: id }, { projection: { slug: 1 } });
  if (!existing) return notFound;
  if ((await collection.countDocuments()) <= 1) {
    return { ok: false, status: 409, error: "The website needs at least one service" };
  }
  await collection.deleteOne({ _id: id });
  await collection.updateMany({ relatedSlugs: existing.slug }, { $pull: { relatedSlugs: existing.slug } });
  return { ok: true, value: null };
}

/** Sets the display order; `ids` must list every service exactly once. */
export async function reorderServices(ids: string[]): Promise<ServiceResult<ServiceRecord[]>> {
  const collection = await seededCollection();
  const existing = new Set((await collection.find({}, { projection: { _id: 1 } }).toArray()).map((doc) => doc._id));
  if (ids.length !== existing.size || new Set(ids).size !== ids.length || !ids.every((id) => existing.has(id))) {
    return { ok: false, status: 409, error: "The list of services changed. Reload the page and try again." };
  }
  await collection.bulkWrite(
    ids.map((id, position) => ({ updateOne: { filter: { _id: id }, update: { $set: { position } } } })),
  );
  return { ok: true, value: await listServices({ includeHidden: true }) };
}
