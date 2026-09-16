import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { enquirySchema, type EnquiryInput, type EnquiryRecord } from "../shared/enquiry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "enquiries.json");

async function readStore(): Promise<EnquiryRecord[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as EnquiryRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(records: EnquiryRecord[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

async function notifyWebhook(record: EnquiryRecord) {
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch (error) {
    console.error("[enquiry] webhook failed", error);
  }
}

async function notifyEmail(record: EnquiryRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL || "Info@bhsknursingservices.com";
  const from = process.env.ENQUIRY_FROM_EMAIL || "onboarding@resend.dev";
  if (!apiKey) return;

  const lines = [
    `New enquiry (${record.source})`,
    `ID: ${record.id}`,
    `Time: ${record.createdAt}`,
    `Name: ${record.name}`,
    `Phone: ${record.phone || "—"}`,
    `Organisation / city: ${record.org || "—"}`,
    `Service: ${record.service || "—"}`,
    `Message: ${record.message || "—"}`,
  ];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `BHSK enquiry: ${record.service || record.name}`,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("[enquiry] resend failed", await response.text());
    }
  } catch (error) {
    console.error("[enquiry] email failed", error);
  }
}

export function parseEnquiryBody(body: unknown) {
  return enquirySchema.safeParse(body);
}

export async function createEnquiry(input: EnquiryInput): Promise<EnquiryRecord> {
  const record: EnquiryRecord = {
    ...input,
    phone: input.phone || "",
    org: input.org || "",
    service: input.service || "",
    message: input.message || "",
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    const existing = await readStore();
    existing.unshift(record);
    await writeStore(existing.slice(0, 500));
  } catch (error) {
    // Vercel / read-only FS: still accept the enquiry and notify externally
    console.warn("[enquiry] could not persist to disk", error);
  }

  console.info("[enquiry] received", {
    id: record.id,
    source: record.source,
    service: record.service,
    name: record.name,
  });

  await Promise.all([notifyWebhook(record), notifyEmail(record)]);
  return record;
}
