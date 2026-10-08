// Usage: npm --prefix backend run create-admin -- <username> <password>
// Creates the admin user in the "users" collection, or resets its password if it already exists.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabase } from "../src/db";
import { upsertUser } from "../src/users";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.resolve(__dirname, "..", ".env"));
} catch {
  // No backend/.env — rely on the shell's environment variables.
}

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.error("Usage: npm --prefix backend run create-admin -- <username> <password>");
  process.exit(1);
}

try {
  const { username: saved, created } = await upsertUser(username, password);
  console.log(`${created ? "Created" : "Updated password for"} admin user "${saved}"`);
} catch (error) {
  console.error("Could not save the admin user:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await closeDatabase();
}
