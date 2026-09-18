import {
  REQUEST_NURSE_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  type ServiceItem,
  services,
} from "@/lib/site";

export type ServiceScopeLists = {
  included: string[];
  notIncluded: string[];
  scopeNote: string;
};

export type ServiceProcessStep = {
  n: string;
  title: string;
  text: string;
};

export type ServiceFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ServicePageContent = {
  slug: string;
  path: string;
  name: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  heroCtaLabel: string;
  requestPath: string;
  requestServiceName: string;
  imageUrl: string;
  imageAlt: string;
  scope: ServiceScopeLists;
  coverage: {
    heading: string;
    paragraphs: string[];
  };
  process: {
    heading: string;
    intro: string;
    whoContacts: string;
    steps: ServiceProcessStep[];
  };
  trust: {
    heading: string;
    paragraphs: string[];
    facts: string[];
  };
  faqs: ServiceFaq[];
  relatedSlugs: string[];
};

/** Home Nursing — Qatar service page. Scope lists are provisional pending final BHSK clinical sign-off. */
export const homeNursingPage: ServicePageContent = {
  slug: "home-nursing",
  path: "/services/home-nursing",
  name: "Home Nursing",
  h1: "Home Nursing Services in Qatar",
  seoTitle: "Home Nursing Services in Qatar | BHSK for Health Services",
  seoDescription:
    "Explore home nursing services in Qatar with BHSK. Get support for elderly care, recovery after surgery and ongoing care needs. Contact us to check availability.",
  intro: [
    "BHSK for Health Services provides home nursing in Qatar for people who need professional care in the comfort of their own home. Whether you are supporting an elderly family member, recovering after surgery, or managing an ongoing health condition, our team can discuss your needs and help arrange suitable nursing support.",
    "Contact us to discuss your care requirements and check availability in your area.",
  ],
  heroCtaLabel: "Request a Nurse",
  requestPath: REQUEST_NURSE_PATH,
  requestServiceName: "Home Nursing",
  imageUrl:
    "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=85",
  imageAlt: "Home nursing support for a patient in Qatar",
  scope: {
    scopeNote:
      "BHSK does not promise care or staffing outside the approved scope for each assignment. Exact duties, hours and clinical limits are confirmed only after assessment. The lists below describe typical home nursing discussions and must be verified by the BHSK service lead before any placement.",
    included: [
      "Professional nursing support at home after needs and location are assessed",
      "Monitoring and observation agreed for the assignment (for example vital signs, recovery checks)",
      "Medication support within the nurse’s approved role and the care plan confirmed with you",
      "Assistance with activities of daily living when nursing support is clinically appropriate",
      "Post-surgery or ongoing-condition support when a home setting is suitable",
      "Clear updates to the family or nominated contact on what was observed during visits",
      "Matching to available nurses whose skills fit the confirmed care plan",
    ],
    notIncluded: [
      "Emergency, ambulance or intensive hospital-level care at home",
      "Guaranteed same-day or fixed response times before assessment",
      "Diagnosis, prescribing or procedures outside the nurse’s approved scope",
      "Staffing or care in areas BHSK has not confirmed as available",
      "Tasks, hours or clinical duties that were not agreed in the confirmed plan",
      "A confirmed booking based on an enquiry alone",
    ],
  },
  coverage: {
    heading: "Coverage and availability in Qatar",
    paragraphs: [
      "BHSK for Health Services is based in Doha (Old Airport) and arranges home nursing in Qatar where care needs, location and staff availability allow.",
      "We do not publish a fixed list of guaranteed neighbourhoods or response times on this page. When you enquire, share your area and care requirements. The BHSK team checks whether suitable nursing support can be arranged and confirms what is available before any placement.",
      "Availability can change with demand, clinical fit and licensing. An enquiry is a request for review — not a promise of coverage.",
    ],
  },
  process: {
    heading: "How to request home nursing staff",
    intro:
      "These steps show how a home nursing request moves from first contact to a confirmed arrangement.",
    whoContacts:
      "A BHSK team member contacts the family or nominated enquiry contact after the request is reviewed. Placement begins only after confirmation.",
    steps: [
      {
        n: "01",
        title: "Enquiry",
        text: "Submit Request a Nurse with the service selected as Home Nursing, or call / WhatsApp us. Tell us who needs care, the type of support and your location.",
      },
      {
        n: "02",
        title: "Assessment",
        text: "Our team reviews clinical fit, home setting, schedule preferences and whether suitable staff are available in your area.",
      },
      {
        n: "03",
        title: "Matching",
        text: "Where a fit exists, we match available nursing professionals to the agreed plan and discuss practical details with you.",
      },
      {
        n: "04",
        title: "Confirmation",
        text: "Service starts only after BHSK confirms the arrangement with you. An enquiry is not a confirmed booking.",
      },
    ],
  },
  trust: {
    heading: "Staffing standards and questions",
    paragraphs: [
      "We do not publish copied reviews, unverified ratings or generic claims on this page. Facts about qualifications and screening are limited to what BHSK can stand behind for Qatar assignments.",
      "Nurse matching for home nursing follows BHSK’s internal screening and assignment checks. Specific licence, training and identity details relevant to your case are confirmed by the team during assessment — not assumed from a website form.",
    ],
    facts: [
      "Home nursing staff are arranged only after BHSK assesses the request",
      "Screening and role fit are checked before a nurse is proposed for an assignment",
      "Qualification and identity details for a proposed nurse are shared when relevant to confirmation",
      "Unsupported marketing claims and third-party reviews are not used on this page",
    ],
  },
  faqs: [
    {
      id: "hn-what",
      question: "What is home nursing with BHSK in Qatar?",
      answer:
        "Home nursing is professional nursing support arranged for someone who needs care at home — for example elderly support, recovery after surgery, or ongoing health needs. BHSK discusses your requirements, checks suitability and availability, then confirms a plan before service starts.",
    },
    {
      id: "hn-areas",
      question: "Which areas in Qatar do you cover?",
      answer:
        "Coverage depends on the assignment, care needs and current staff availability. Share your location when you enquire. The team will confirm whether we can support your area — we do not guarantee every location in advance.",
    },
    {
      id: "hn-booking",
      question: "Is sending an enquiry the same as booking a nurse?",
      answer:
        "No. An enquiry starts a conversation. Care and staffing are confirmed only after assessment and matching. Until BHSK confirms, there is no booking.",
    },
    {
      id: "hn-speed",
      question: "How quickly can a home nurse start?",
      answer:
        "Timing depends on clinical fit and availability. We do not promise same-day or fixed response times on this page. After you enquire, the team reviews your request and explains realistic next steps.",
    },
    {
      id: "hn-scope",
      question: "What can and cannot a home nurse do?",
      answer:
        "Duties stay within the approved scope confirmed for that assignment. Typical nursing support may include monitoring, agreed medication support and daily care assistance when clinically appropriate. Emergency care, out-of-scope procedures and unconfirmed tasks are not included. Ask the service lead to clarify limits for your case.",
    },
    {
      id: "hn-contact",
      question: "Who will contact us after we request a nurse?",
      answer:
        "A BHSK team member follows up with the family or the person named on the enquiry to discuss assessment findings, availability and confirmation steps.",
    },
  ],
  relatedSlugs: [
    "elderly-care",
    "post-operative",
    "chronic-care",
    "palliative-care",
    "maternity-newborn",
    "physiotherapy",
  ],
};

export function relatedServicesFor(page: ServicePageContent): ServiceItem[] {
  return page.relatedSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is ServiceItem => Boolean(s));
}

export function serviceHref(slug: string) {
  if (slug === "home-nursing") return "/services/home-nursing";
  return `/${slug}`;
}

export function requestNurseHref(serviceName: string) {
  const params = new URLSearchParams({ service: serviceName });
  return `${REQUEST_NURSE_PATH}?${params.toString()}`;
}

export function homeNursingJsonLd() {
  const pageUrl = absoluteUrl(homeNursingPage.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "BHSK for Health Services",
        url: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Home Nursing Services in Qatar",
        serviceType: "Home nursing",
        url: pageUrl,
        description:
          "Home nursing services in Qatar. Contact BHSK for Health Services to discuss care needs and check availability in your area.",
        provider: {
          "@id": `${SITE_ORIGIN}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Qatar",
        },
      },
    ],
  };
}
