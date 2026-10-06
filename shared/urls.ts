/**
 * Public URLs for the deployed site and API — the single place to change them.
 * Imported by frontend/ (API calls, canonical/SEO links) and backend/ (CORS allow-list).
 * No trailing slashes.
 */

/** Primary public address of the React site (custom domain on the Render static site). */
export const FRONTEND_URL = "https://bhskforhealthservices.com";

/** Other addresses the same site is reachable at; the API accepts requests from these too. */
export const FRONTEND_ALIASES = ["https://www.bhskforhealthservices.com", "https://healthservices-hybm.onrender.com"];

/** Deployed Express API (Render web service). API routes live under `${BACKEND_URL}/api`. */
export const BACKEND_URL = "https://healthservicesbackend.onrender.com";

/** Local development servers (`npm run dev`). */
export const LOCAL_FRONTEND_URL = "http://localhost:3000";
export const LOCAL_BACKEND_URL = "http://localhost:4000";
