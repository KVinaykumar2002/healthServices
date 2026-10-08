import type { HomeHero } from "@shared/homeHero";
import type { Service, ServiceContent } from "@shared/services";
import type { SiteSettings } from "@shared/siteSettings";
import { API_BASE_URL } from "@/lib/api";

export const ENQUIRY_STATUSES = ["new", "contacted", "in_progress", "closed", "spam"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type EnquiryTypeFilter = "" | "patient" | "employer" | "unspecified";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  org: string;
  enquiryType: "patient" | "employer" | "";
  service: string;
  message: string;
  source: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type EnquiryStats = {
  total: number;
  today: number;
  last7Days: number;
  byStatus: Record<EnquiryStatus, number>;
  byType: { patient: number; employer: number; unspecified: number };
  bySource: { source: string; count: number }[];
  daily: { date: string; count: number }[];
};

export type EnquiryFilters = {
  search: string;
  status: EnquiryStatus | "";
  enquiryType: EnquiryTypeFilter;
};

export type EnquiryPage = {
  items: Enquiry[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type AdminSession = { token: string; username: string; expiresAt: string };

const SESSION_KEY = "bhsk-admin-session";

export function loadSession(): AdminSession | null {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as AdminSession | null;
    if (!session?.token || new Date(session.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: AdminSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export class AdminApiError extends Error {
  status: number;
  /** Per-field validation messages from the server, keyed by field name. */
  fieldErrors: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

let unauthorizedHandler: (() => void) | null = null;

/** Called whenever the server rejects the session (expired, password changed, …). */
export function onUnauthorized(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const session = loadSession();
  const headers = new Headers(init.headers);
  if (session) headers.set("Authorization", `Bearer ${session.token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/admin${path}`, { ...init, headers });
  } catch {
    throw new AdminApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    let fieldErrors: Record<string, string[]> = {};
    try {
      const payload = (await response.json()) as {
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };
      if (payload.error) message = payload.error;
      fieldErrors = payload.details?.fieldErrors ?? {};
    } catch {
      // Non-JSON error page: a 5xx here means a proxy or host couldn't reach the API.
      if (response.status >= 500) message = "The server isn't responding right now. Please try again in a moment.";
    }
    if (response.status === 401 && path !== "/login") unauthorizedHandler?.();
    throw new AdminApiError(message, response.status, fieldErrors);
  }
  return response;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  return (await (await request(path, init)).json()) as T;
}

function filterParams(filters: EnquiryFilters, extra: Record<string, string> = {}) {
  const params = new URLSearchParams(extra);
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.status) params.set("status", filters.status);
  if (filters.enquiryType) params.set("enquiryType", filters.enquiryType);
  return params;
}

export async function login(username: string, password: string): Promise<AdminSession> {
  const result = await requestJson<AdminSession>("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const session = { token: result.token, username: result.username, expiresAt: result.expiresAt };
  saveSession(session);
  return session;
}

export function fetchMe() {
  return requestJson<{ username: string }>("/me");
}

/** Changes the signed-in admin's username and/or password; the server returns a fresh session for the new details. */
export async function updateAccount(update: { currentPassword: string; username?: string; newPassword?: string }) {
  const result = await requestJson<AdminSession>("/account", {
    method: "PATCH",
    body: JSON.stringify(update),
  });
  const session = { token: result.token, username: result.username, expiresAt: result.expiresAt };
  saveSession(session);
  return session;
}

export function fetchStats() {
  return requestJson<EnquiryStats>("/stats");
}

export function fetchEnquiries(filters: EnquiryFilters, page: number, pageSize = 20) {
  const params = filterParams(filters, { page: String(page), pageSize: String(pageSize) });
  return requestJson<EnquiryPage>(`/enquiries?${params}`);
}

export async function updateEnquiry(id: string, update: { status?: EnquiryStatus; notes?: string }) {
  const result = await requestJson<{ enquiry: Enquiry }>(`/enquiries/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(update),
  });
  return result.enquiry;
}

export type SiteSettingsRecord = SiteSettings & { updatedAt: string | null };

export async function fetchSiteSettings() {
  return (await requestJson<{ settings: SiteSettingsRecord }>("/site-settings")).settings;
}

export async function saveSiteSettings(settings: SiteSettings) {
  const result = await requestJson<{ settings: SiteSettingsRecord }>("/site-settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
  return result.settings;
}

export type HomeHeroRecord = HomeHero & { updatedAt: string | null };

export async function fetchHomeHero() {
  return (await requestJson<{ hero: HomeHeroRecord }>("/home-hero")).hero;
}

export async function saveHomeHero(hero: HomeHero) {
  const result = await requestJson<{ hero: HomeHeroRecord }>("/home-hero", {
    method: "PATCH",
    body: JSON.stringify(hero),
  });
  return result.hero;
}

export type ServiceRecord = Service & { updatedAt: string | null };

export async function fetchServices() {
  return (await requestJson<{ services: ServiceRecord[] }>("/services")).services;
}

export async function fetchService(id: string) {
  return (await requestJson<{ service: ServiceRecord }>(`/services/${encodeURIComponent(id)}`)).service;
}

export async function createService(service: ServiceContent) {
  const result = await requestJson<{ service: ServiceRecord }>("/services", {
    method: "POST",
    body: JSON.stringify(service),
  });
  return result.service;
}

export async function saveService(id: string, service: ServiceContent) {
  const result = await requestJson<{ service: ServiceRecord }>(`/services/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(service),
  });
  return result.service;
}

export async function deleteService(id: string) {
  await request(`/services/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function reorderServices(ids: string[]) {
  const result = await requestJson<{ services: ServiceRecord[] }>("/services/order", {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  });
  return result.services;
}

/** Uploads an image and returns its site path (/api/media/<id>). */
export async function uploadImage(image: Blob) {
  try {
    const result = await requestJson<{ src: string }>("/media", {
      method: "POST",
      headers: { "Content-Type": image.type },
      body: image,
    });
    return result.src;
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 413) {
      throw new AdminApiError("That photo is too large. Try a smaller image.", 413);
    }
    throw error;
  }
}

export async function deleteEnquiry(id: string) {
  await request(`/enquiries/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function downloadEnquiriesCsv(filters: EnquiryFilters) {
  const response = await request(`/enquiries/export.csv?${filterParams(filters)}`);
  const blob = await response.blob();
  const filename =
    /filename="([^"]+)"/.exec(response.headers.get("Content-Disposition") ?? "")?.[1] ?? "bhsk-enquiries.csv";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
