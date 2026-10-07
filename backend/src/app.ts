import express, { type ErrorRequestHandler } from "express";
import { cors } from "./cors";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

/** The API as an Express app, shared by the Node server (index.ts) and the Vercel function (api/). */
export function createApp() {
  const app = express();

  // Behind Render / Vercel / other proxies, so req.ip is the visitor's address for rate limiting.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  // Service pages are larger; the admin router parses those after checking the session.
  const json = express.json({ limit: "32kb" });
  app.use((req, res, next) => (req.path.startsWith("/api/admin/services") ? next() : json(req, res, next)));

  app.use("/api", cors);
  app.use("/api/admin", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.use("/api/admin", adminRouter);
  app.use("/api", publicRouter);
  app.use("/api", (_req, res) => {
    res.status(404).json({ ok: false, error: "Not found" });
  });

  const jsonErrors: ErrorRequestHandler = (error, req, res, next) => {
    if (!req.path.startsWith("/api") || res.headersSent) {
      next(error);
      return;
    }
    const status = typeof error?.status === "number" ? error.status : 500;
    if (status >= 500) {
      console.error("[api] unhandled error", error);
      res.status(500).json({ ok: false, error: "Internal server error" });
      return;
    }
    res.status(status).json({ ok: false, error: status === 413 ? "Request too large" : "Bad request" });
  };
  app.use(jsonErrors);

  return app;
}
