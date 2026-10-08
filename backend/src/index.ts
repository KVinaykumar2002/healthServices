import express from "express";
import { existsSync } from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "./app";
import { closeDatabase, isDatabaseConfigured, pingDatabase } from "./db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  process.loadEnvFile(path.resolve(__dirname, "..", ".env"));
} catch {
  // No backend/.env — rely on the host's environment variables.
}

async function startServer() {
  const app = createApp();
  const server = createServer(app);

  // The built frontend (frontend/dist) is served when present, so one Node service can host the whole site.
  // Same relative depth from backend/src (dev) and backend/dist (prod).
  const staticPath = process.env.FRONTEND_DIST
    ? path.resolve(process.env.FRONTEND_DIST)
    : path.resolve(__dirname, "..", "..", "frontend", "dist");

  if (existsSync(path.join(staticPath, "index.html"))) {
    // redirect: false — route folders (e.g. dist/services/) would otherwise add a trailing-slash redirect.
    app.use(express.static(staticPath, { redirect: false }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    console.warn(`[server] no frontend build at ${staticPath}; serving the API only`);
  }

  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  if (isDatabaseConfigured()) {
    // Don't block startup: the site keeps serving, and requests retry the connection on demand.
    pingDatabase().then((ok) =>
      ok
        ? console.log("[db] connected to MongoDB")
        : console.error("[db] MongoDB unreachable — check MONGODB_URI and the Atlas network access list"),
    );
  } else {
    console.error("[db] MONGODB_URI is not set — enquiries cannot be saved and admin login is disabled");
  }

  const shutdown = () => {
    setTimeout(() => process.exit(0), 5000).unref();
    server.close(() => {
      closeDatabase().finally(() => process.exit(0));
    });
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

startServer().catch(console.error);
