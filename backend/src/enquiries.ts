import { randomUUID } from "node:crypto";
import type { Filter } from "mongodb";
import { enquiriesCollection, type EnquiryDocument } from "./db";
import { notifyNewEnquiry } from "./notify";
import {
  enquirySchema,
  enquiryStatuses,
  type EnquiryInput,
  type EnquiryListQuery,
  type EnquiryRecord,
  type EnquiryUpdate,
} from "./schema";

const TIME_ZONE = "Asia/Qatar";
const QATAR_UTC_OFFSET = "+03:00";
const EXPORT_LIMIT = 5000;

function toRecord({ _id, createdAt, updatedAt, ...fields }: EnquiryDocument): EnquiryRecord {
  return {
    ...fields,
    status: fields.status ?? "new",
    notes: fields.notes ?? "",
    id: _id,
    createdAt: createdAt.toISOString(),
    updatedAt: (updatedAt ?? createdAt).toISOString(),
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFilter(query: Pick<EnquiryListQuery, "search" | "status" | "enquiryType">): Filter<EnquiryDocument> {
  const filter: Filter<EnquiryDocument> = {};
  if (query.status) filter.status = query.status;
  if (query.enquiryType) filter.enquiryType = query.enquiryType === "unspecified" ? "" : query.enquiryType;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: pattern },
      { phone: pattern },
      { org: pattern },
      { service: pattern },
      { message: pattern },
      { source: pattern },
    ];
  }
  return filter;
}

export function parseEnquiryBody(body: unknown) {
  return enquirySchema.safeParse(body);
}

export async function createEnquiry(input: EnquiryInput): Promise<EnquiryRecord> {
  const now = new Date();
  const document: EnquiryDocument = {
    ...input,
    _id: randomUUID(),
    status: "new",
    notes: "",
    createdAt: now,
    updatedAt: now,
  };
  const record = toRecord(document);

  let saveError: unknown = null;
  try {
    await (await enquiriesCollection()).insertOne(document);
  } catch (error) {
    saveError = error;
    console.error("[enquiry] database insert failed", error);
  }

  console.info("[enquiry] received", {
    id: record.id,
    source: record.source,
    service: record.service,
    name: record.name,
  });

  // Notify even when the database write failed, so the lead still reaches the team.
  await notifyNewEnquiry(record);
  if (saveError) throw saveError;
  return record;
}

export async function listEnquiries(query: EnquiryListQuery) {
  const collection = await enquiriesCollection();
  const filter = buildFilter(query);
  const [documents, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.pageSize)
      .limit(query.pageSize)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    items: documents.map(toRecord),
    total,
    page: query.page,
    pageSize: query.pageSize,
    pageCount: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function exportEnquiries(query: Pick<EnquiryListQuery, "search" | "status" | "enquiryType">) {
  const collection = await enquiriesCollection();
  const documents = await collection.find(buildFilter(query)).sort({ createdAt: -1 }).limit(EXPORT_LIMIT).toArray();
  return documents.map(toRecord);
}

export async function getEnquiry(id: string): Promise<EnquiryRecord | null> {
  const document = await (await enquiriesCollection()).findOne({ _id: id });
  return document ? toRecord(document) : null;
}

export async function updateEnquiry(id: string, update: EnquiryUpdate): Promise<EnquiryRecord | null> {
  const set: Partial<EnquiryDocument> = { updatedAt: new Date() };
  if (update.status !== undefined) set.status = update.status;
  if (update.notes !== undefined) set.notes = update.notes;

  const document = await (await enquiriesCollection()).findOneAndUpdate(
    { _id: id },
    { $set: set },
    { returnDocument: "after" },
  );
  return document ? toRecord(document) : null;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const result = await (await enquiriesCollection()).deleteOne({ _id: id });
  return result.deletedCount === 1;
}

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** YYYY-MM-DD in Qatar time. */
function qatarDay(date: Date) {
  return dayFormatter.format(date);
}

function startOfQatarDay(day: string) {
  return new Date(`${day}T00:00:00${QATAR_UTC_OFFSET}`);
}

type CountRow = { _id: string | null; count: number };

export async function enquiryStats(days = 30) {
  const collection = await enquiriesCollection();
  const today = qatarDay(new Date());
  const todayStart = startOfQatarDay(today);
  const rangeStart = new Date(todayStart.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);

  const [result] = await collection
    .aggregate<{
      total: { count: number }[];
      today: { count: number }[];
      last7Days: { count: number }[];
      byStatus: CountRow[];
      byType: CountRow[];
      bySource: CountRow[];
      daily: CountRow[];
    }>([
      {
        $facet: {
          total: [{ $count: "count" }],
          today: [{ $match: { createdAt: { $gte: todayStart } } }, { $count: "count" }],
          last7Days: [{ $match: { createdAt: { $gte: weekStart } } }, { $count: "count" }],
          byStatus: [{ $group: { _id: { $ifNull: ["$status", "new"] }, count: { $sum: 1 } } }],
          byType: [{ $group: { _id: "$enquiryType", count: { $sum: 1 } } }],
          bySource: [{ $group: { _id: "$source", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }],
          daily: [
            { $match: { createdAt: { $gte: rangeStart } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TIME_ZONE } },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ])
    .toArray();

  const byStatus = Object.fromEntries(enquiryStatuses.map((status) => [status, 0])) as Record<string, number>;
  for (const row of result.byStatus) byStatus[row._id ?? "new"] = row.count;

  const byType = { patient: 0, employer: 0, unspecified: 0 };
  for (const row of result.byType) {
    if (row._id === "patient" || row._id === "employer") byType[row._id] += row.count;
    else byType.unspecified += row.count;
  }

  const dailyCounts = new Map(result.daily.map((row) => [row._id, row.count]));
  const daily = Array.from({ length: days }, (_, index) => {
    const day = qatarDay(new Date(rangeStart.getTime() + index * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000));
    return { date: day, count: dailyCounts.get(day) ?? 0 };
  });

  return {
    total: result.total[0]?.count ?? 0,
    today: result.today[0]?.count ?? 0,
    last7Days: result.last7Days[0]?.count ?? 0,
    byStatus,
    byType,
    bySource: result.bySource.map((row) => ({ source: row._id || "Unknown", count: row.count })),
    daily,
  };
}
