/**
 * Services offered on the website, managed from the admin dashboard (stored in MongoDB).
 * DEFAULT_SERVICES apply until an admin first changes a service, and whenever the API can't be reached.
 */
import { MEDIA_PATH_PREFIX, isAllowedImageSrc } from "./homeHero";
import { DEFAULT_SERVICES } from "./serviceDefaults";

export { DEFAULT_SERVICES };

export const SERVICE_CATEGORIES = ["home", "facility"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  home: "Home care",
  facility: "Healthcare staffing",
};

/** Menu icons (lucide names). Everyday life and people rather than clinical equipment — BHSK brand rule. */
export const SERVICE_ICONS = [
  "heart-handshake",
  "hand-heart",
  "hand-helping",
  "heart",
  "armchair",
  "baby",
  "smile",
  "message-circle-heart",
  "calendar-heart",
  "sunrise",
  "footprints",
  "accessibility",
  "bed",
  "house",
  "users",
  "building-2",
  "building",
  "hotel",
  "school",
  "graduation-cap",
  "briefcase",
  "factory",
  "hard-hat",
  "sparkles",
] as const;
export type ServiceIcon = (typeof SERVICE_ICONS)[number];

export type ServiceStep = { title: string; text: string };
export type ServiceFaq = { question: string; answer: string };

export type ServiceContent = {
  slug: string;
  category: ServiceCategory;
  /** Hidden services stay in the dashboard but aren't shown anywhere on the website. */
  visible: boolean;
  /** Full name: service cards, page breadcrumb and the enquiry form's service list. */
  name: string;
  /** Short name for the "Our services" menu. */
  menuLabel: string;
  icon: ServiceIcon;
  /** Short description on the service cards. */
  text: string;
  cardImageUrl: string;
  /** Landscape photo on the service page. */
  imageUrl: string;
  imageAlt: string;
  eyebrow: string;
  h1: string;
  intro: string[];
  heroCtaLabel: string;
  seoTitle: string;
  seoDescription: string;
  audience: { heading: string; items: string[] };
  scopeHeading: string;
  scope: { included: string[]; notIncluded: string[]; scopeNote: string };
  coverage: { heading: string; paragraphs: string[] };
  process: {
    heading: string;
    intro: string;
    whoContacts: string;
    steps: ServiceStep[];
  };
  trust: { heading: string; paragraphs: string[]; facts: string[] };
  faqHeading: string;
  faqs: ServiceFaq[];
  relatedSlugs: string[];
};

export type Service = ServiceContent & { id: string };

export const SERVICE_LIMITS = {
  services: 40,
  intro: 4,
  audience: 12,
  scopeItems: 15,
  coverage: 5,
  steps: 8,
  trustParagraphs: 5,
  trustFacts: 10,
  faqs: 15,
  related: 8,
} as const;

/** Maximum characters per field. */
export const SERVICE_TEXT_LIMITS = {
  slug: 60,
  name: 80,
  menuLabel: 40,
  text: 300,
  imageAlt: 200,
  eyebrow: 80,
  h1: 120,
  heroCtaLabel: 40,
  seoTitle: 120,
  seoDescription: 320,
  heading: 160,
  paragraph: 1200,
  listItem: 300,
  stepTitle: 80,
  stepText: 600,
  question: 200,
  answer: 1500,
} as const;

/** Top-level paths the website already uses, so a service can't hide one of them. */
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "about-us",
  "assets",
  "book-consultation",
  "brand",
  "contact-us",
  "healthcare-staffing",
  "images",
  "request-a-nurse",
  "request-healthcare-staff",
  "services",
]);

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidServiceSlug(slug: string) {
  return (
    slug.length <= SERVICE_TEXT_LIMITS.slug &&
    SLUG_PATTERN.test(slug) &&
    !RESERVED_SLUGS.has(slug)
  );
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SERVICE_TEXT_LIMITS.slug)
    .replace(/-+$/, "");
}

/** Public path of a service page. Home nursing keeps its original /services/ address. */
export function servicePath(slug: string) {
  return slug === "home-nursing" ? "/services/home-nursing" : `/${slug}`;
}

export function serviceMediaIds(services: ServiceContent[]) {
  return services
    .flatMap(service => [service.cardImageUrl, service.imageUrl])
    .filter(src => src.startsWith(MEDIA_PATH_PREFIX))
    .map(src => src.slice(MEDIA_PATH_PREFIX.length));
}

/** Starting content for a new service; it begins hidden so it can be filled in before going live. */
export function newServiceTemplate({
  name,
  slug,
  category,
  text,
}: {
  name: string;
  slug: string;
  category: ServiceCategory;
  text: string;
}): ServiceContent {
  const isHome = category === "home";
  return {
    slug,
    category,
    visible: false,
    name,
    menuLabel: name.slice(0, SERVICE_TEXT_LIMITS.menuLabel),
    icon: isHome ? "heart-handshake" : "building-2",
    text,
    cardImageUrl: isHome
      ? "/images/bhsk/home-nursing.jpg"
      : "/images/bhsk/hospitals.jpg",
    imageUrl: isHome
      ? "/images/bhsk/services/home-nursing.jpg"
      : "/images/bhsk/services/hospitals.jpg",
    imageAlt: `BHSK ${isHome ? "nurse" : "nursing staff"} — ${name}`.slice(
      0,
      SERVICE_TEXT_LIMITS.imageAlt
    ),
    eyebrow: `${name} · Qatar`.slice(0, SERVICE_TEXT_LIMITS.eyebrow),
    h1: `${name} in Qatar`.slice(0, SERVICE_TEXT_LIMITS.h1),
    intro: [],
    heroCtaLabel: isHome ? "Request a Nurse" : "Request Staff",
    seoTitle: `${name} in Qatar | BHSK for Health Services`.slice(
      0,
      SERVICE_TEXT_LIMITS.seoTitle
    ),
    seoDescription: text.slice(0, SERVICE_TEXT_LIMITS.seoDescription),
    audience: {
      heading: isHome ? `Who ${name.toLowerCase()} is for` : "Who we support",
      items: [],
    },
    scopeHeading: `Scope of ${name.toLowerCase()}`.slice(
      0,
      SERVICE_TEXT_LIMITS.heading
    ),
    scope: { included: [], notIncluded: [], scopeNote: "" },
    coverage: { heading: "Coverage and availability in Qatar", paragraphs: [] },
    process: {
      heading: isHome
        ? `How to request ${name.toLowerCase()}`
        : "How to request staff",
      intro: "",
      whoContacts: "",
      steps: isHome
        ? [
            {
              title: "Enquiry",
              text: "Send a request or call / WhatsApp us with who needs care and where.",
            },
            {
              title: "Assessment",
              text: "Our team reviews care needs, location and availability.",
            },
            {
              title: "Matching",
              text: "We match suitable available staff to the agreed plan.",
            },
            {
              title: "Confirmation",
              text: "Service starts only after BHSK confirms the arrangement with you.",
            },
          ]
        : [
            {
              title: "Request",
              text: "Send the roles, shifts and start date you need.",
            },
            {
              title: "Review",
              text: "Our team reviews requirements, licensing and availability.",
            },
            {
              title: "Proposal",
              text: "We propose suitable available staff for the roles.",
            },
            {
              title: "Placement",
              text: "Placement starts only after BHSK confirms it with you.",
            },
          ],
    },
    trust: {
      heading: "Staffing standards and questions",
      paragraphs: [],
      facts: [],
    },
    faqHeading: `Questions about ${name.toLowerCase()}`.slice(
      0,
      SERVICE_TEXT_LIMITS.heading
    ),
    faqs: [],
    relatedSlugs: [],
  };
}

const isString = (value: unknown): value is string => typeof value === "string";
const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
const text = (value: unknown) => (isString(value) ? value.trim() : "");
const textList = (value: unknown, max: number) =>
  Array.isArray(value)
    ? value
        .filter(isString)
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, max)
    : [];

/** Reads a service from storage or an API response; null if it can't be shown. */
export function normalizeService(raw: unknown): ServiceContent | null {
  const input = asRecord(raw);
  const slug = text(input.slug);
  const name = text(input.name);
  if (!SLUG_PATTERN.test(slug) || !name) return null;

  const audience = asRecord(input.audience);
  const scope = asRecord(input.scope);
  const coverage = asRecord(input.coverage);
  const process = asRecord(input.process);
  const trust = asRecord(input.trust);
  const image = (value: unknown) => {
    const src = text(value);
    return isAllowedImageSrc(src) ? src : "";
  };

  return {
    slug,
    category: input.category === "facility" ? "facility" : "home",
    visible: input.visible !== false,
    name,
    menuLabel: text(input.menuLabel) || name,
    icon: (SERVICE_ICONS as readonly string[]).includes(input.icon as string)
      ? (input.icon as ServiceIcon)
      : "heart-handshake",
    text: text(input.text),
    cardImageUrl: image(input.cardImageUrl),
    imageUrl: image(input.imageUrl),
    imageAlt: text(input.imageAlt),
    eyebrow: text(input.eyebrow),
    h1: text(input.h1) || name,
    intro: textList(input.intro, SERVICE_LIMITS.intro),
    heroCtaLabel:
      text(input.heroCtaLabel) ||
      (input.category === "facility" ? "Request Staff" : "Request a Nurse"),
    seoTitle: text(input.seoTitle) || name,
    seoDescription: text(input.seoDescription),
    audience: {
      heading: text(audience.heading),
      items: textList(audience.items, SERVICE_LIMITS.audience),
    },
    scopeHeading: text(input.scopeHeading),
    scope: {
      included: textList(scope.included, SERVICE_LIMITS.scopeItems),
      notIncluded: textList(scope.notIncluded, SERVICE_LIMITS.scopeItems),
      scopeNote: text(scope.scopeNote),
    },
    coverage: {
      heading: text(coverage.heading),
      paragraphs: textList(coverage.paragraphs, SERVICE_LIMITS.coverage),
    },
    process: {
      heading: text(process.heading),
      intro: text(process.intro),
      whoContacts: text(process.whoContacts),
      steps: (Array.isArray(process.steps) ? process.steps : [])
        .map(asRecord)
        .map(step => ({ title: text(step.title), text: text(step.text) }))
        .filter(step => step.title || step.text)
        .slice(0, SERVICE_LIMITS.steps),
    },
    trust: {
      heading: text(trust.heading),
      paragraphs: textList(trust.paragraphs, SERVICE_LIMITS.trustParagraphs),
      facts: textList(trust.facts, SERVICE_LIMITS.trustFacts),
    },
    faqHeading: text(input.faqHeading),
    faqs: (Array.isArray(input.faqs) ? input.faqs : [])
      .map(asRecord)
      .map(faq => ({ question: text(faq.question), answer: text(faq.answer) }))
      .filter(faq => faq.question && faq.answer)
      .slice(0, SERVICE_LIMITS.faqs),
    relatedSlugs: textList(input.relatedSlugs, SERVICE_LIMITS.related),
  };
}

export const DEFAULT_SERVICE_ID_PREFIX = "default-";

export const DEFAULT_SERVICE_LIST: Service[] = DEFAULT_SERVICES.map(
  service => ({
    ...service,
    id: `${DEFAULT_SERVICE_ID_PREFIX}${service.slug}`,
  })
);

/** A list of services from storage or an API response; null if it isn't one. */
export function normalizeServices(raw: unknown): Service[] | null {
  if (!Array.isArray(raw)) return null;
  const seen = new Set<string>();
  const services: Service[] = [];
  for (const item of raw) {
    const service = normalizeService(item);
    const id = text(asRecord(item).id);
    if (!service || !id || seen.has(service.slug)) continue;
    seen.add(service.slug);
    services.push({ ...service, id });
  }
  return services;
}
