import express, { Router } from "express";
import { MEDIA_PATH_PREFIX } from "../../../shared/homeHero";
import { createSessionToken, isAdminConfigured, requireAdmin, verifyCredentials } from "../auth";
import {
  deleteEnquiry,
  enquiryStats,
  exportEnquiries,
  getEnquiry,
  listEnquiries,
  updateEnquiry,
} from "../enquiries";
import { getHomeHero, saveHomeHero } from "../homeHero";
import { MAX_UPLOAD_BYTES, detectImageType, saveMedia } from "../media";
import { rateLimit } from "../rateLimit";
import {
  enquiryListQuerySchema,
  enquiryUpdateSchema,
  homeHeroSchema,
  loginSchema,
  siteSettingsSchema,
  type EnquiryRecord,
} from "../schema";
import { getSiteSettings, saveSiteSettings } from "../siteSettings";
import { asyncHandler } from "./asyncHandler";

export const adminRouter = Router();

adminRouter.post("/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), (req, res) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ ok: false, error: "Admin login is not configured on the server" });
    return;
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success || !verifyCredentials(parsed.data.username, parsed.data.password)) {
    res.status(401).json({ ok: false, error: "Incorrect username or password" });
    return;
  }

  res.json({ ok: true, username: parsed.data.username, ...createSessionToken(parsed.data.username) });
});

adminRouter.use(requireAdmin);

adminRouter.get("/me", (_req, res) => {
  res.json({ ok: true, username: res.locals.admin });
});

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    res.json({ ok: true, ...(await enquiryStats()) });
  }),
);

adminRouter.get(
  "/enquiries",
  asyncHandler(async (req, res) => {
    const parsed = enquiryListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid filters", details: parsed.error.flatten() });
      return;
    }
    res.json({ ok: true, ...(await listEnquiries(parsed.data)) });
  }),
);

const CSV_COLUMNS: { header: string; value: (record: EnquiryRecord) => string }[] = [
  { header: "Received", value: (r) => r.createdAt },
  { header: "Status", value: (r) => r.status },
  { header: "Name", value: (r) => r.name },
  { header: "Phone", value: (r) => r.phone },
  { header: "Organisation / city", value: (r) => r.org },
  { header: "Enquiry type", value: (r) => r.enquiryType },
  { header: "Service", value: (r) => r.service },
  { header: "Source", value: (r) => r.source },
  { header: "Message", value: (r) => r.message },
  { header: "Notes", value: (r) => r.notes },
  { header: "ID", value: (r) => r.id },
];

function csvCell(value: string) {
  // Leading = + - @ would be evaluated as a formula by spreadsheet apps.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

adminRouter.get(
  "/enquiries/export.csv",
  asyncHandler(async (req, res) => {
    const parsed = enquiryListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid filters" });
      return;
    }

    const records = await exportEnquiries(parsed.data);
    const rows = [
      CSV_COLUMNS.map((column) => column.header).join(","),
      ...records.map((record) => CSV_COLUMNS.map((column) => csvCell(column.value(record) ?? "")).join(",")),
    ];
    const filename = `bhsk-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    // BOM so Excel opens the file as UTF-8.
    res.send(`\uFEFF${rows.join("\r\n")}\r\n`);
  }),
);

adminRouter.get(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    const record = await getEnquiry(req.params.id);
    if (!record) {
      res.status(404).json({ ok: false, error: "Enquiry not found" });
      return;
    }
    res.json({ ok: true, enquiry: record });
  }),
);

adminRouter.patch(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    const parsed = enquiryUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid update", details: parsed.error.flatten() });
      return;
    }
    const record = await updateEnquiry(req.params.id, parsed.data);
    if (!record) {
      res.status(404).json({ ok: false, error: "Enquiry not found" });
      return;
    }
    res.json({ ok: true, enquiry: record });
  }),
);

adminRouter.get(
  "/site-settings",
  asyncHandler(async (_req, res) => {
    res.json({ ok: true, settings: await getSiteSettings() });
  }),
);

adminRouter.patch(
  "/site-settings",
  asyncHandler(async (req, res) => {
    const parsed = siteSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Please fix the highlighted fields", details: parsed.error.flatten() });
      return;
    }
    res.json({ ok: true, settings: await saveSiteSettings(parsed.data) });
  }),
);

adminRouter.get(
  "/home-hero",
  asyncHandler(async (_req, res) => {
    res.json({ ok: true, hero: await getHomeHero() });
  }),
);

adminRouter.patch(
  "/home-hero",
  asyncHandler(async (req, res) => {
    const parsed = homeHeroSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Please fix the highlighted fields", details: parsed.error.flatten() });
      return;
    }
    res.json({ ok: true, hero: await saveHomeHero(parsed.data) });
  }),
);

adminRouter.post(
  "/media",
  express.raw({ type: ["image/jpeg", "image/png", "image/webp"], limit: MAX_UPLOAD_BYTES }),
  asyncHandler(async (req, res) => {
    const contentType = Buffer.isBuffer(req.body) ? detectImageType(req.body) : null;
    if (!contentType) {
      res.status(415).json({ ok: false, error: "Upload a JPEG, PNG or WebP photo" });
      return;
    }
    const id = await saveMedia(req.body, contentType);
    res.status(201).json({ ok: true, id, src: `${MEDIA_PATH_PREFIX}${id}` });
  }),
);

adminRouter.delete(
  "/enquiries/:id",
  asyncHandler(async (req, res) => {
    if (!(await deleteEnquiry(req.params.id))) {
      res.status(404).json({ ok: false, error: "Enquiry not found" });
      return;
    }
    res.json({ ok: true });
  }),
);
