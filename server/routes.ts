import type { Express, Request, Response } from "express";
import { createEnquiry, parseEnquiryBody } from "./enquiries";

export function registerApiRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "bhsk-nursing", time: new Date().toISOString() });
  });

  app.post("/api/enquiries", async (req: Request, res: Response) => {
    const parsed = parseEnquiryBody(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid enquiry",
        details: parsed.error.flatten(),
      });
      return;
    }

    try {
      const record = await createEnquiry(parsed.data);
      res.status(201).json({ ok: true, id: record.id });
    } catch (error) {
      console.error("[enquiry] create failed", error);
      res.status(500).json({ ok: false, error: "Unable to save enquiry" });
    }
  });
}
