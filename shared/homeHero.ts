/**
 * Content of the home page hero, managed from the admin dashboard (stored in MongoDB).
 * These defaults apply until an admin saves changes, and whenever the API can't be reached.
 */

export type HeroLink = { label: string; href: string };

export type HeroSlide = {
  /** A site photo (/images/...), an uploaded photo (/api/media/<id>) or a full https URL. */
  src: string;
  alt: string;
};

export type HomeHero = {
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: HeroLink;
  secondaryButton: HeroLink;
  showCallButton: boolean;
  highlights: string[];
  slides: HeroSlide[];
};

export const DEFAULT_HOME_HERO: HomeHero = {
  tagline: "BHSK for Health Services · Doha, Qatar",
  title: "Professional Nursing and Healthcare Staffing in Qatar",
  subtitle: "Home Care Services in Qatar",
  description:
    "Trained nurses for facilities and families across Doha — request home care or healthcare staffing and our team will confirm fit and availability.",
  primaryButton: { label: "Request a Nurse", href: "/request-a-nurse" },
  secondaryButton: { label: "Request Staff", href: "/request-healthcare-staff" },
  showCallButton: true,
  highlights: ["Assessment before every placement", "Local coordination from Doha", "Home care & facility staffing"],
  slides: [
    {
      src: "/images/bhsk/hero-elderly-care.jpg",
      alt: "BHSK nurse supporting an elderly man in a wheelchair at home",
    },
    {
      src: "/images/bhsk/hero-mobility-family.jpg",
      alt: "BHSK nurse helping an elderly man walk with a frame while his family watches",
    },
    {
      src: "/images/bhsk/hero-family-bedside.jpg",
      alt: "BHSK nurse caring for an elderly patient in bed with his grandchildren beside him",
    },
  ],
};

export const HOME_HERO_LIMITS = { highlights: 5, slides: 6 } as const;

export const MEDIA_PATH_PREFIX = "/api/media/";

/** Site paths (e.g. /request-a-nurse) or full http(s) / tel: / mailto: links. Never javascript: and friends. */
export function isAllowedHeroLink(value: string) {
  if (/^\/(?!\/)\S*$/.test(value)) return true;
  if (/^(tel|mailto):\S+$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isAllowedImageSrc(value: string) {
  if (/^\/images\/[\w./-]+\.(jpe?g|png|webp|avif)$/i.test(value) && !value.includes("..")) return true;
  if (new RegExp(`^${MEDIA_PATH_PREFIX}[\\w-]+$`).test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/** Uploaded media ids referenced by the hero, so unused uploads can be cleaned up. */
export function referencedMediaIds(hero: HomeHero) {
  return hero.slides
    .map((slide) => slide.src)
    .filter((src) => src.startsWith(MEDIA_PATH_PREFIX))
    .map((src) => src.slice(MEDIA_PATH_PREFIX.length));
}

const isString = (value: unknown): value is string => typeof value === "string";
const asRecord = (value: unknown) => (value && typeof value === "object" ? (value as Record<string, unknown>) : {});

function normalizeLink(raw: unknown, fallback: HeroLink): HeroLink {
  const input = asRecord(raw);
  const label = isString(input.label) ? input.label.trim() : "";
  const href = isString(input.href) ? input.href.trim() : "";
  return label && href && isAllowedHeroLink(href) ? { label, href } : fallback;
}

/** Fills missing or malformed fields from the defaults, e.g. for data read from storage or an API response. */
export function normalizeHomeHero(raw: unknown): HomeHero {
  const input = asRecord(raw);
  const text = (key: "tagline" | "title" | "subtitle" | "description", allowEmpty = true) => {
    const value = input[key];
    if (!isString(value)) return DEFAULT_HOME_HERO[key];
    const trimmed = value.trim();
    return trimmed || allowEmpty ? trimmed : DEFAULT_HOME_HERO[key];
  };

  const highlights = Array.isArray(input.highlights)
    ? input.highlights
        .filter(isString)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, HOME_HERO_LIMITS.highlights)
    : DEFAULT_HOME_HERO.highlights;

  const slides = Array.isArray(input.slides)
    ? input.slides
        .map(asRecord)
        .map((slide) => ({
          src: isString(slide.src) ? slide.src.trim() : "",
          alt: isString(slide.alt) ? slide.alt.trim() : "",
        }))
        .filter((slide) => isAllowedImageSrc(slide.src))
        .slice(0, HOME_HERO_LIMITS.slides)
    : [];

  return {
    tagline: text("tagline"),
    title: text("title", false),
    subtitle: text("subtitle"),
    description: text("description"),
    primaryButton: normalizeLink(input.primaryButton, DEFAULT_HOME_HERO.primaryButton),
    secondaryButton: normalizeLink(input.secondaryButton, DEFAULT_HOME_HERO.secondaryButton),
    showCallButton: typeof input.showCallButton === "boolean" ? input.showCallButton : DEFAULT_HOME_HERO.showCallButton,
    highlights,
    slides: slides.length ? slides : DEFAULT_HOME_HERO.slides,
  };
}
