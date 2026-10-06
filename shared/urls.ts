/**
 * Public URLs for the deployed site and API — the single place to change them.
 * Imported by frontend/ (API calls, canonical/SEO links) and backend/ (CORS allow-list).
 * No trailing slashes.
 */

/** Deployed React site (Render static site). */
export const FRONTEND_URL = "https://healthservices-hybm.onrender.com";

/** Deployed Express API (Render web service). API routes live under `${BACKEND_URL}/api`. */
export const BACKEND_URL = "https://healthservicesbackend.onrender.com";

/** Local development servers (`npm run dev`). */
export const LOCAL_FRONTEND_URL = "http://localhost:3000";
export const LOCAL_BACKEND_URL = "http://localhost:4000";
