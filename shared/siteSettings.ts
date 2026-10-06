/**
 * Contact details, office address and social links shown across the public site.
 * Admins edit them from the dashboard (stored in MongoDB); these defaults apply until then
 * and whenever the API can't be reached. Imported by frontend/ and backend/.
 */

export type SiteSettings = {
  email: string;
  /** Mobile numbers as displayed, e.g. "31331146". The first one is the main number. */
  phones: string[];
  /** Landline as displayed, e.g. "+974-41497775". Empty hides it. */
  landline: string;
  /** WhatsApp number; an 8-digit number is treated as Qatari (+974). */
  whatsapp: string;
  addressLines: string[];
  /** Text searched on Google Maps for the office map and directions links. */
  mapQuery: string;
  /** Full profile URLs. Empty hides the icon. */
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "Info@bhskforhealthservices.com",
  phones: ["31331146", "31599965"],
  landline: "+974-41497775",
  whatsapp: "97431331146",
  addressLines: ["Building No. 212, Street 310, Zone 45", "Office No. 551, Floor 01", "Old Airport, Doha, Qatar"],
  mapQuery: "BHSK Health Services, Old Airport, Doha, Qatar",
  instagramUrl: "https://www.instagram.com/bhsknursingservices/",
  facebookUrl: "https://www.facebook.com/share/19QAPPA3Hd/",
  linkedinUrl: "https://www.linkedin.com/in/bhsk-health-services-3aba2b222/",
};

export const SITE_SETTINGS_LIMITS = { phones: 4, addressLines: 5 } as const;

const QATAR_LOCAL_DIGITS = 8;
const QATAR_COUNTRY_CODE = "974";

/** International digits for a phone number, adding Qatar's +974 to local 8-digit numbers. */
export function internationalDigits(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^00/, "");
  return digits.length === QATAR_LOCAL_DIGITS ? `${QATAR_COUNTRY_CODE}${digits}` : digits;
}

export function telHref(value: string) {
  return `tel:+${internationalDigits(value)}`;
}

export function whatsappHref(value: string) {
  return `https://wa.me/${internationalDigits(value)}`;
}

/** Only http(s) links are rendered, so a bad value can never become a javascript: URL. */
export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function mapUrls(query: string) {
  const q = encodeURIComponent(query);
  return {
    embedUrl: `https://www.google.com/maps?q=${q}&z=16&output=embed`,
    viewUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
  };
}

const isString = (value: unknown): value is string => typeof value === "string";

function stringList(value: unknown, fallback: string[], max: number) {
  if (!Array.isArray(value)) return fallback;
  const list = value.filter(isString).map((item) => item.trim()).filter(Boolean).slice(0, max);
  return list.length ? list : fallback;
}

/** Fills missing or malformed fields from the defaults, e.g. for data read from storage or an API response. */
export function normalizeSiteSettings(raw: unknown): SiteSettings {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const text = (key: keyof SiteSettings, allowEmpty = false) => {
    const value = input[key];
    if (!isString(value)) return DEFAULT_SITE_SETTINGS[key] as string;
    const trimmed = value.trim();
    return trimmed || allowEmpty ? trimmed : (DEFAULT_SITE_SETTINGS[key] as string);
  };
  const url = (key: "instagramUrl" | "facebookUrl" | "linkedinUrl") => {
    const value = text(key, true);
    return value === "" || isSafeHttpUrl(value) ? value : "";
  };

  return {
    email: text("email"),
    phones: stringList(input.phones, DEFAULT_SITE_SETTINGS.phones, SITE_SETTINGS_LIMITS.phones),
    landline: text("landline", true),
    whatsapp: text("whatsapp"),
    addressLines: stringList(input.addressLines, DEFAULT_SITE_SETTINGS.addressLines, SITE_SETTINGS_LIMITS.addressLines),
    mapQuery: text("mapQuery"),
    instagramUrl: url("instagramUrl"),
    facebookUrl: url("facebookUrl"),
    linkedinUrl: url("linkedinUrl"),
  };
}
