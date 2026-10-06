import type { Enquiry, EnquiryStatus } from "./api";

export const STATUS_META: Record<EnquiryStatus, { label: string; badge: string; dot: string }> = {
  new: { label: "New", badge: "bg-[#ffe6ec] text-[#b3123a] ring-[#ffc2d0]", dot: "bg-[#ff355d]" },
  contacted: { label: "Contacted", badge: "bg-sky-50 text-sky-800 ring-sky-200", dot: "bg-sky-500" },
  in_progress: { label: "In progress", badge: "bg-amber-50 text-amber-800 ring-amber-200", dot: "bg-amber-500" },
  closed: { label: "Closed", badge: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500" },
  spam: { label: "Spam", badge: "bg-slate-100 text-slate-600 ring-slate-200", dot: "bg-slate-400" },
};

export const TYPE_LABELS: Record<string, string> = {
  patient: "Home care",
  employer: "Staffing",
  "": "Not specified",
};

const TIME_ZONE = "Asia/Qatar";

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const shortDateFormat = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" });

export function formatDateTime(iso: string) {
  return dateTimeFormat.format(new Date(iso));
}

/** "2026-10-06" (a Qatar calendar day) → "6 Oct". */
export function formatDay(day: string) {
  return shortDateFormat.format(new Date(`${day}T12:00:00+03:00`));
}

export function formatRelative(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d ago`;
  return shortDateFormat.format(new Date(iso));
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** wa.me needs the full international number; local 8-digit Qatar numbers get +974. */
export function whatsappHref(enquiry: Pick<Enquiry, "phone" | "name">) {
  let digits = enquiry.phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 8) digits = `974${digits}`;
  const text = `Hello ${enquiry.name}, this is BHSK for Health Services following up on your enquiry.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
