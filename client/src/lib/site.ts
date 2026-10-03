/** Shared BHSK site constants — Qatar-only, no unverified claims. */

export const SITE_ORIGIN = "https://www.bhskforhealthservices.com";

export const CONTACT_EMAIL = "Info@bhskforhealthservices.com";

export const CONTACT_PHONES = [
  { display: "31331146", href: "tel:+97431331146" },
  { display: "31599965", href: "tel:+97431599965" },
] as const;

export const WHATSAPP = {
  number: "97431599965",
  href: "https://wa.me/97431599965",
} as const;

export const OFFICE_ADDRESS = {
  lines: [
    "Building No. 212, Street 310, Zone 45",
    "Office No. 551, Floor 01",
    "Old Airport, Doha, Qatar",
  ],
} as const;

/** Matches the "BHSK Health Services" Google Maps listing (plus code 7H55+RP, Old Airport). */
const MAP_QUERY = encodeURIComponent("BHSK Health Services, Old Airport, Doha, Qatar");

export const OFFICE_MAP = {
  embedUrl: `https://www.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`,
  viewUrl: `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`,
} as const;

export type ServiceCategory = "facility" | "home";

export type ServiceItem = {
  slug: string;
  name: string;
  text: string;
  category: ServiceCategory;
  imageUrl: string;
};

/** Approved nursing / care services currently listed for BHSK Qatar. */
export const services: ServiceItem[] = [
  {
    slug: "home-nursing",
    name: "Home Nursing",
    text: "Professional home nursing in Qatar for elderly support, recovery after surgery and ongoing care needs.",
    category: "home",
    imageUrl: "/images/bhsk/home-nursing.jpg",
  },
  {
    slug: "hospitals",
    name: "Nursing Services for Hospitals",
    text: "Skilled nursing support that integrates with hospital wards and clinical teams in Qatar.",
    category: "facility",
    imageUrl: "/images/bhsk/hospitals.jpg",
  },
  {
    slug: "medical-centres",
    name: "Nursing Services for Medical Centres",
    text: "Reliable clinic and outpatient nursing for busy medical centres.",
    category: "facility",
    imageUrl: "/images/bhsk/medical-centres.jpg",
  },
  {
    slug: "schools-nurseries",
    name: "Nursing Services for Schools / Nurseries",
    text: "On-site school and nursery nurses for first aid, wellness and parent peace of mind.",
    category: "facility",
    imageUrl: "/images/bhsk/schools-nurseries.jpg",
  },
  {
    slug: "camp-construction",
    name: "Nursing Services for Camp or Construction Site",
    text: "Occupational health nursing for remote camps and active construction sites.",
    category: "facility",
    imageUrl: "/images/bhsk/camp-construction.jpg",
  },
  {
    slug: "maternity-newborn",
    name: "Maternity and Newborn Care",
    text: "Gentle, expert nursing support for mothers and newborns through the early weeks at home.",
    category: "home",
    imageUrl: "/images/bhsk/maternity-newborn.jpg",
  },
  {
    slug: "elderly-care",
    name: "Elderly Care",
    text: "Respectful companionship and clinical nursing support that helps seniors stay comfortable at home.",
    category: "home",
    imageUrl: "/images/bhsk/elderly-care.jpg",
  },
  {
    slug: "baby-care",
    name: "Baby Care",
    text: "Attentive infant care from trained nurses who understand every stage of early life.",
    category: "home",
    imageUrl: "/images/bhsk/baby-care.jpg",
  },
  {
    slug: "palliative-care",
    name: "Palliative Care",
    text: "Compassionate symptom relief and dignity-focused nursing support for serious illness.",
    category: "home",
    imageUrl: "/images/bhsk/palliative-care.jpg",
  },
  {
    slug: "chronic-care",
    name: "Chronic Patient Care",
    text: "Ongoing nursing plans for long-term conditions, monitoring and daily management at home.",
    category: "home",
    imageUrl: "/images/bhsk/chronic-care.jpg",
  },
  {
    slug: "post-operative",
    name: "Post-operative Care",
    text: "Safe recovery support after surgery — wound care, medication and mobility at home.",
    category: "home",
    imageUrl: "/images/bhsk/post-operative.jpg",
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    text: "Personalised rehabilitation to restore strength, movement and independence.",
    category: "home",
    imageUrl: "/images/bhsk/physiotherapy.jpg",
  },
];

export const facilityServices = services.filter((s) => s.category === "facility");
export const homeCareServices = services.filter((s) => s.category === "home");

export const HOME_CARE_BLURB =
  "For individuals and families who need trained nurses at home in Qatar — home nursing, maternity and newborn, elderly, baby, palliative, chronic, post-operative care, and physiotherapy.";

export const HEALTHCARE_STAFFING_BLURB =
  "For hospitals, medical centres, schools, nurseries, camps and construction sites that need professional nursing staff cover in Qatar.";

/** Hero booking labels → canonical service names */
export const heroServiceMap: Record<string, string> = {
  "Hospital Nursing": "Nursing Services for Hospitals",
  "Medical Centre Nursing": "Nursing Services for Medical Centres",
  "School / Nursery Nursing": "Nursing Services for Schools / Nurseries",
  "Camp / Construction Nursing": "Nursing Services for Camp or Construction Site",
  "Maternity & Newborn Care": "Maternity and Newborn Care",
  "Elderly Care": "Elderly Care",
  "Baby Care": "Baby Care",
  "Palliative Care": "Palliative Care",
  "Chronic Patient Care": "Chronic Patient Care",
  "Post-operative Care": "Post-operative Care",
  Physiotherapy: "Physiotherapy",
  "Home Nursing": "Home Nursing",
};

export const REQUEST_NURSE_PATH = "/request-a-nurse";
export const REQUEST_STAFF_PATH = "/request-healthcare-staff";

export const faqItems = [
  {
    id: "areas",
    question: "Where does BHSK provide services in Qatar?",
    answer:
      "BHSK for Health Services is based in Doha (Old Airport). Coverage for home care and facility staffing depends on the assignment, clinical needs and staff availability. Share your location when you enquire and our team will confirm what we can support.",
  },
  {
    id: "home-vs-staffing",
    question: "What is the difference between home care and healthcare staffing?",
    answer:
      "Home care is for individuals and families who need a nurse at home. Healthcare staffing is for employers and facilities — hospitals, clinics, schools, camps and worksites — that need nursing staff as part of their operations.",
  },
  {
    id: "availability",
    question: "How quickly can a nurse or staff member be arranged?",
    answer:
      "Timing depends on the type of care, clinical fit and current availability. After you submit an enquiry, our team assesses your needs and confirms a plan. We do not promise same-day or fixed response times until that assessment is complete.",
  },
  {
    id: "request-nurse",
    question: "How do I request a nurse for home care?",
    answer:
      "Use Request a Nurse, call us, or message on WhatsApp. Tell us who needs care, the type of support required and your preferred schedule. We will review the enquiry, discuss suitability and confirm next steps before any placement.",
  },
  {
    id: "request-staff",
    question: "How do employers request healthcare staff?",
    answer:
      "Use Request Staff or contact our team with the facility type, roles needed, shift pattern and start date. We match available nursing professionals to your requirements and confirm placement details with you before service begins.",
  },
  {
    id: "assessment",
    question: "What happens after I send an enquiry?",
    answer:
      "We review your request, assess clinical and operational fit, match suitable nursing staff where available, and confirm the arrangement with you. Service starts only after that confirmation — an enquiry alone is not a booking.",
  },
] as const;

/** Build absolute URLs with a trailing slash (Technical SEO convention), except the origin root. */
export function absoluteUrl(path: string) {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  if (normalised === "/") return `${SITE_ORIGIN}/`;
  const trimmed = normalised.replace(/\/$/, "");
  return `${SITE_ORIGIN}${trimmed}/`;
}

/** Public path for a service detail page. */
export function servicePath(slug: string) {
  if (slug === "home-nursing") return "/services/home-nursing";
  return `/${slug}`;
}
