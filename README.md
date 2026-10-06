# BHSK for Health Services

Website for BHSK home nursing and healthcare staffing in Qatar.

```
frontend/   React + Vite site (pages, components, images)
backend/    Express API — receives lead-form enquiries, stores them, sends notifications
```

The root `package.json` is a workspace that runs both.

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

Open `/admin` (e.g. http://localhost:3000/admin) and sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from
`backend/.env`. The dashboard shows enquiry stats and a 30-day chart, and lets the team search and filter
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
- Set backend env vars on the host (see `backend/.env.example`) — at minimum `MONGODB_URI`, `ADMIN_USERNAME`,
  `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. `backend/.env` is not committed, so the host needs its own copy
  of these values.
- In MongoDB Atlas → Network Access, allow the host's outbound IP addresses (or `0.0.0.0/0`).

**Separate static frontend + backend:**

- Frontend (static site): build `npm install && npm run build:frontend`, publish directory `frontend/dist`.
  Set `VITE_API_BASE_URL` to the backend URL at build time.
- Backend: any Node host running `npm start`, with `CORS_ORIGINS` set to the frontend's URL.
  `backend/api/` also contains a Vercel serverless handler if the backend is deployed to Vercel with root
  directory `backend`.
