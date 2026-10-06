import { Router } from "express";
import { DEFAULT_HOME_HERO, type HomeHero } from "../../../shared/homeHero";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "../../../shared/siteSettings";
import { isDatabaseConfigured, pingDatabase } from "../db";
import { createEnquiry, parseEnquiryBody } from "../enquiries";
import { getHomeHero } from "../homeHero";
import { getMedia } from "../media";
import { rateLimit } from "../rateLimit";
import { getSiteSettings } from "../siteSettings";
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

publicRouter.get(
  "/site-settings",
  asyncHandler(async (_req, res) => {
    // The site must keep showing its content even if the database is down.
    let settings: SiteSettings;
    try {
      const { updatedAt: _updatedAt, ...fields } = await getSiteSettings();
      settings = fields;
    } catch (error) {
      console.error("[settings] falling back to defaults", error);
      settings = DEFAULT_SITE_SETTINGS;
    }

    let hero: HomeHero;
    try {
      const { updatedAt: _updatedAt, ...fields } = await getHomeHero();
      hero = fields;
    } catch (error) {
      console.error("[hero] falling back to defaults", error);
      hero = DEFAULT_HOME_HERO;
    }

    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ ok: true, settings, hero });
  }),
);

publicRouter.get(
  "/media/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const media = /^[a-f0-9]{24}$/.test(id) ? await getMedia(id) : null;
    if (!media) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.setHeader("Content-Type", media.contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    // Ids are random and never reused, so the bytes behind a URL never change.
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(media.data);
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
