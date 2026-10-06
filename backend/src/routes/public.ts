import { Router } from "express";
import { isDatabaseConfigured, pingDatabase } from "../db";
import { createEnquiry, parseEnquiryBody } from "../enquiries";
import { rateLimit } from "../rateLimit";
import { asyncHandler } from "./asyncHandler";

export const publicRouter = Router();

publicRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const database = isDatabaseConfigured() ? ((await pingDatabase()) ? "connected" : "unreachable") : "not configured";
    res.status(database === "connected" ? 200 : 503).json({
      ok: database === "connected",
      service: "bhsk-nursing",
      database,
      time: new Date().toISOString(),
    });
  }),
);

publicRouter.post(
  "/enquiries",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }),
  asyncHandler(async (req, res) => {
    const parsed = parseEnquiryBody(req.body);
    if (!parsed.success) {
      res.status(400).json({ ok: false, error: "Invalid enquiry", details: parsed.error.flatten() });
      return;
    }

    try {
      const record = await createEnquiry(parsed.data);
      res.status(201).json({ ok: true, id: record.id });
    } catch {
      res.status(500).json({ ok: false, error: "Unable to save enquiry" });
    }
  }),
);
