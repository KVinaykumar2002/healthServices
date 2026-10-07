/** Shared BHSK site constants — Qatar-only, no unverified claims. */

import { FRONTEND_URL } from "@shared/urls";

export const SITE_ORIGIN = FRONTEND_URL;

// Contact details, address and social links are managed in the admin dashboard — see useSiteContact().

export { servicePath, type ServiceCategory } from "@shared/services";

export const HOME_CARE_BLURB =
  "For individuals and families who need trained nurses at home in Qatar — home nursing, maternity and newborn, elderly, baby, palliative, chronic, post-operative care, and physiotherapy.";

export const HEALTHCARE_STAFFING_BLURB =
  "For hospitals, medical centres, schools, nurseries, camps and construction sites that need professional nursing staff cover in Qatar.";

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
