# BHSK for Health Services

Website for BHSK home nursing and healthcare staffing in Qatar.

```
frontend/   React + Vite site (pages, components, images)
backend/    Express API — receives lead-form enquiries, stores them, sends notifications
shared/     urls.ts — deployed frontend and backend URLs, used by both packages
```

The root `package.json` is a workspace that runs both.

## URLs

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | https://bhskforhealthservices.com/ (also www and https://healthservices-hybm.onrender.com/) |
| Backend  | https://healthservicesbackend.onrender.com/    |

They live in [`shared/urls.ts`](shared/urls.ts) — change them there only. The frontend uses `BACKEND_URL` for
API calls in production builds and `FRONTEND_URL` for canonical / structured-data links; the backend always
allows `FRONTEND_URL` and `FRONTEND_ALIASES` in CORS. Add any new domain the site is served from to
`FRONTEND_ALIASES`, otherwise the browser blocks its form submissions and admin logins.

## Getting started

```bash
pnpm install          # or: npm install
npm run dev           # frontend on http://localhost:3000, backend on http://localhost:4000
```

In development the Vite server forwards `/api/*` to the backend, so the site and API share one origin.

| Command                 | What it does                                                         |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run dev`           | Start frontend and backend together                                  |
| `npm run build`         | Build `frontend/dist` (static site) and `backend/dist` (Node server) |
| `npm start`             | Run the built backend; it also serves `frontend/dist`                |
| `npm run check`         | Type-check both packages                                             |

## Backend

| Endpoint               | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `GET /api/health`      | Health check (503 if the database is unreachable)                       |
| `POST /api/enquiries`  | Lead form submission (validated, rate-limited to 10 per IP / 15 min)    |

Each enquiry is saved to MongoDB (database `bhsk`, collection `enquiries`) and optionally emailed via Resend
and/or forwarded to a webhook. Configure these in `backend/.env` (see `backend/.env.example`); `MONGODB_URI`
is required.

The lead form saves the enquiry to the backend and also opens WhatsApp with the details pre-filled, so the
WhatsApp route keeps working even if the backend is unreachable.

## Admin dashboard

Open `/admin` (e.g. http://localhost:3000/admin) and sign in with a user from the MongoDB `users` collection
(passwords are stored as scrypt hashes). Add a user or reset a password with
`npm --prefix backend run create-admin -- <username> <password>`. The dashboard shows enquiry stats and a 30-day chart, and lets the team search and filter
leads, call or WhatsApp them, track status (New → Contacted → In progress → Closed / Spam), keep internal
notes, delete leads and export CSV. It is hidden from search engines and loaded only on `/admin`.

Admin API (all except login require `Authorization: Bearer <token>` from the login response; sessions last
12 hours):

| Endpoint                                | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `POST /api/admin/login`                 | Exchange username/password for a session token       |
| `GET /api/admin/stats`                  | Totals, status/type/form breakdowns, daily counts    |
| `GET /api/admin/enquiries`              | List with `search`, `status`, `enquiryType`, `page`, `pageSize` |
| `GET /api/admin/enquiries/export.csv`   | CSV export (same filters)                            |
| `GET /api/admin/enquiries/:id`          | Single enquiry                                       |
| `PATCH /api/admin/enquiries/:id`        | Update `status` and/or `notes`                       |
| `DELETE /api/admin/enquiries/:id`       | Delete an enquiry                                    |

## Deployment

**Single Node service (recommended, e.g. Render Web Service)** — the backend serves the site and the API:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Set backend env vars on the host (see `backend/.env.example`) — at minimum `MONGODB_URI` and `ADMIN_SESSION_SECRET`. `backend/.env` is not committed, so the host needs its own copy
  of these values.
- In MongoDB Atlas → Network Access, allow the host's outbound IP addresses (or `0.0.0.0/0`).

**Separate static frontend + backend:**

- Frontend (static site): build `npm install && npm run build:frontend`, publish directory `frontend/dist`.
  It calls `BACKEND_URL` from `shared/urls.ts`; set `VITE_API_BASE_URL` only to override it.
- Backend: any Node host running `npm start`. `FRONTEND_URL` is allowed by CORS automatically; use
  `CORS_ORIGINS` for any extra origins.
  `backend/api/` also contains a Vercel serverless handler if the backend is deployed to Vercel with root
  directory `backend`.
