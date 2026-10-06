import { BACKEND_URL } from "@shared/urls";

/** Dev uses "" so requests go through the Vite /api proxy; VITE_API_BASE_URL overrides both ("" = same origin). */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : BACKEND_URL)).replace(
  /\/+$/,
  "",
);

/** Mirrors the backend enquiry schema (backend/src/schema.ts). */
export type EnquiryPayload = {
  name: string;
  phone: string;
  org?: string;
  enquiryType?: "patient" | "employer" | "";
  service?: string;
  message?: string;
  source?: string;
};

export type EnquiryResponse = {
  ok: true;
  id: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function submitEnquiry(input: EnquiryPayload): Promise<EnquiryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(15_000),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : "Unable to submit enquiry";
    throw new ApiError(message, response.status);
  }

  return payload as EnquiryResponse;
}
