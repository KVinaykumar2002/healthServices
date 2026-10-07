import { z } from "zod";
import { HOME_HERO_LIMITS, isAllowedHeroLink, isAllowedImageSrc } from "../../shared/homeHero";
import {
  SERVICE_CATEGORIES,
  SERVICE_ICONS,
  SERVICE_LIMITS,
  SERVICE_TEXT_LIMITS as MAX,
  SLUG_PATTERN,
  isValidServiceSlug,
} from "../../shared/services";
import { SITE_SETTINGS_LIMITS, isSafeHttpUrl } from "../../shared/siteSettings";

export const enquiryTypes = ["patient", "employer"] as const;
export const enquiryStatuses = ["new", "contacted", "in_progress", "closed", "spam"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(5, "Phone number is required").max(40),
  org: z.string().trim().max(120).optional().default(""),
  enquiryType: z.union([z.enum(enquiryTypes), z.literal("")]).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  /** Which form the lead came from, e.g. "Request a Nurse". */
  source: z.string().trim().max(80).optional().default("Contact us"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryRecord = EnquiryInput & {
  id: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const enquiryUpdateSchema = z
  .object({
    status: z.enum(enquiryStatuses).optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((value) => value.status !== undefined || value.notes !== undefined, {
    message: "Nothing to update",
  });

export type EnquiryUpdate = z.infer<typeof enquiryUpdateSchema>;

const optionalFilter = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === "" || value === "all" ? undefined : value), schema.optional());

export const enquiryListQuerySchema = z.object({
  search: z.string().trim().max(100).optional().default(""),
  status: optionalFilter(z.enum(enquiryStatuses)),
  enquiryType: optionalFilter(z.enum([...enquiryTypes, "unspecified"])),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type EnquiryListQuery = z.infer<typeof enquiryListQuerySchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
});

const phoneNumber = z
  .string()
  .trim()
  .max(30)
  .regex(/^\+?[\d\s()-]{7,}$/, "Use digits, spaces, +, - or brackets only");

const socialUrl = z
  .string()
  .trim()
  .max(300)
  .refine((value) => value === "" || isSafeHttpUrl(value), "Enter a full link starting with https://");

export const siteSettingsSchema = z.object({
  email: z.string().trim().max(120).pipe(z.email("Enter a valid email address")),
  phones: z
    .array(phoneNumber)
    .min(1, "Add at least one phone number")
    .max(SITE_SETTINGS_LIMITS.phones, `Up to ${SITE_SETTINGS_LIMITS.phones} phone numbers`),
  landline: z.union([z.literal(""), phoneNumber]),
  whatsapp: phoneNumber,
  addressLines: z
    .array(z.string().trim().min(1, "Address lines can't be empty").max(120))
    .min(1, "Add at least one address line")
    .max(SITE_SETTINGS_LIMITS.addressLines, `Up to ${SITE_SETTINGS_LIMITS.addressLines} address lines`),
  mapQuery: z.string().trim().min(3, "Enter the place to show on Google Maps").max(200),
  instagramUrl: socialUrl,
  facebookUrl: socialUrl,
  linkedinUrl: socialUrl,
});

const heroButton = z.object({
  label: z.string().trim().min(1, "Every button needs a label").max(40, "Button labels can be up to 40 characters"),
  href: z
    .string()
    .trim()
    .max(300)
    .refine(isAllowedHeroLink, "Use a site page like /request-a-nurse or a full https:// link"),
});

export const homeHeroSchema = z.object({
  tagline: z.string().trim().max(80, "The tagline can be up to 80 characters"),
  title: z.string().trim().min(1, "Enter a headline").max(120, "The headline can be up to 120 characters"),
  subtitle: z.string().trim().max(120, "The subheading can be up to 120 characters"),
  description: z.string().trim().max(400, "The description can be up to 400 characters"),
  primaryButton: heroButton,
  secondaryButton: heroButton,
  showCallButton: z.boolean(),
  highlights: z
    .array(z.string().trim().min(1, "Highlights can't be empty").max(60, "Highlights can be up to 60 characters"))
    .max(HOME_HERO_LIMITS.highlights, `Up to ${HOME_HERO_LIMITS.highlights} highlights`),
  slides: z
    .array(
      z.object({
        src: z.string().trim().max(500).refine(isAllowedImageSrc, "Choose a photo from the library or upload one"),
        alt: z
          .string()
          .trim()
          .min(1, "Describe every photo for screen readers and search engines")
          .max(200, "Photo descriptions can be up to 200 characters"),
      }),
    )
    .min(1, "Add at least one photo")
    .max(HOME_HERO_LIMITS.slides, `Up to ${HOME_HERO_LIMITS.slides} photos`),
});

const required = (label: string, max: number) =>
  z.string().trim().min(1, `Enter ${label}`).max(max, `Keep ${label} under ${max} characters`);
const optional = (label: string, max: number) =>
  z.string().trim().max(max, `Keep ${label} under ${max} characters`);
const textList = (label: string, maxItems: number, maxLength: number = MAX.listItem) =>
  z
    .array(z.string().trim().min(1, `${label} can't be empty`).max(maxLength, `Keep each item under ${maxLength} characters`))
    .max(maxItems, `Up to ${maxItems} ${label.toLowerCase()}`);
const servicePhoto = z
  .string()
  .trim()
  .max(500)
  .refine(isAllowedImageSrc, "Choose a photo from the library or upload one");

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Enter a web address")
    .max(MAX.slug, `Keep the web address under ${MAX.slug} characters`)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single dashes, e.g. elderly-care")
    .refine(isValidServiceSlug, "This address is already used by another page of the website"),
  category: z.enum(SERVICE_CATEGORIES),
  visible: z.boolean(),
  name: required("a name", MAX.name),
  menuLabel: required("a menu name", MAX.menuLabel),
  icon: z.enum(SERVICE_ICONS),
  text: required("a short description", MAX.text),
  cardImageUrl: servicePhoto,
  imageUrl: servicePhoto,
  imageAlt: required("a photo description", MAX.imageAlt),
  eyebrow: optional("the small heading", MAX.eyebrow),
  h1: required("a page title", MAX.h1),
  intro: textList("Paragraphs", SERVICE_LIMITS.intro, MAX.paragraph),
  heroCtaLabel: required("the button text", MAX.heroCtaLabel),
  seoTitle: required("a Google title", MAX.seoTitle),
  seoDescription: required("a Google description", MAX.seoDescription),
  audience: z.object({
    heading: optional("the heading", MAX.heading),
    items: textList("Points", SERVICE_LIMITS.audience),
  }),
  scopeHeading: optional("the heading", MAX.heading),
  scope: z.object({
    included: textList("Included items", SERVICE_LIMITS.scopeItems),
    notIncluded: textList("Not-included items", SERVICE_LIMITS.scopeItems),
    scopeNote: optional("the note", MAX.paragraph),
  }),
  coverage: z.object({
    heading: optional("the heading", MAX.heading),
    paragraphs: textList("Paragraphs", SERVICE_LIMITS.coverage, MAX.paragraph),
  }),
  process: z.object({
    heading: optional("the heading", MAX.heading),
    intro: optional("the introduction", MAX.paragraph),
    whoContacts: optional("the closing note", MAX.paragraph),
    steps: z
      .array(z.object({ title: required("a step title", MAX.stepTitle), text: required("the step text", MAX.stepText) }))
      .max(SERVICE_LIMITS.steps, `Up to ${SERVICE_LIMITS.steps} steps`),
  }),
  trust: z.object({
    heading: optional("the heading", MAX.heading),
    paragraphs: textList("Paragraphs", SERVICE_LIMITS.trustParagraphs, MAX.paragraph),
    facts: textList("Points", SERVICE_LIMITS.trustFacts),
  }),
  faqHeading: optional("the heading", MAX.heading),
  faqs: z
    .array(z.object({ question: required("a question", MAX.question), answer: required("an answer", MAX.answer) }))
    .max(SERVICE_LIMITS.faqs, `Up to ${SERVICE_LIMITS.faqs} questions`),
  relatedSlugs: z.array(z.string().trim().max(MAX.slug)).max(SERVICE_LIMITS.related, `Up to ${SERVICE_LIMITS.related} related services`),
});

export const serviceOrderSchema = z.object({
  ids: z.array(z.string().trim().min(1).max(80)).min(1).max(SERVICE_LIMITS.services),
});
