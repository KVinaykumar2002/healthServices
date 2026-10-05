/**
 * Post-build step for static hosting (Render static site, publish directory "dist").
 *
 * 1. Writes a copy of index.html for every client route (e.g. dist/public/services/index.html)
 *    so direct visits and refreshes on deep links load the app without a host rewrite rule.
 * 2. Mirrors dist/public into dist, so hosts publishing "dist" serve the site at "/".
 *    dist/public is kept as-is for the Node server (`npm start`) and Vercel.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const publicDir = path.join(dist, "public");
const indexHtml = readFileSync(path.join(publicDir, "index.html"), "utf8");

const siteSource = readFileSync(path.join(root, "client/src/lib/site.ts"), "utf8");
const serviceSlugs = [...siteSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);

const routes = new Set([
  "about-us",
  "contact-us",
  "services",
  "services/home-nursing",
  "healthcare-staffing",
  "request-a-nurse",
  "request-healthcare-staff",
  "book-consultation",
  ...serviceSlugs,
]);

for (const route of routes) {
  const dir = path.join(publicDir, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), indexHtml);
}

for (const entry of readdirSync(publicDir)) {
  cpSync(path.join(publicDir, entry), path.join(dist, entry), { recursive: true });
}

console.log(`prepare-static: ${routes.size} route pages written; site mirrored to dist/`);
