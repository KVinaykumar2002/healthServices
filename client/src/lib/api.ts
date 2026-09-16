import type { EnquiryInput, EnquiryResponse } from "@shared/enquiry";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResponse> {
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
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
