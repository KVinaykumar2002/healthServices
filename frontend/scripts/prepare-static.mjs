/**
 * Post-build step for static hosting (e.g. Render static site, publish directory "frontend/dist").
 *
 * Writes a copy of index.html for every client route (e.g. dist/services/index.html)
 * so direct visits and refreshes on deep links load the app without a host rewrite rule.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const indexHtml = readFileSync(path.join(dist, "index.html"), "utf8");

const siteSource = readFileSync(path.join(root, "src/lib/site.ts"), "utf8");
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
  "admin",
  ...serviceSlugs,
]);

for (const route of routes) {
  const dir = path.join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), indexHtml);
}

console.log(`prepare-static: ${routes.size} route pages written to dist/`);
