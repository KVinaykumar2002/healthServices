import {
  REQUEST_NURSE_PATH,
  REQUEST_STAFF_PATH,
  SITE_ORIGIN,
  absoluteUrl,
  servicePath,
  type ServiceCategory,
  type ServiceItem,
  services,
} from "@/lib/site";
import { homeCarePages } from "@/lib/servicePagesHome";
import { staffingPages } from "@/lib/servicePagesStaffing";

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
  category: ServiceCategory;
  name: string;
  eyebrow: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  heroCtaLabel: string;
  requestServiceName: string;
  imageUrl: string;
  imageAlt: string;
  audience: {
    heading: string;
    items: string[];
  };
  scopeHeading: string;
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
  faqHeading: string;
  faqs: ServiceFaq[];
  relatedSlugs: string[];
};

/** Every approved BHSK service has its own page. Scope lists are provisional pending BHSK service-lead sign-off. */
export const servicePages: ServicePageContent[] = [...homeCarePages, ...staffingPages];

export const homeNursingPage = servicePages.find((p) => p.slug === "home-nursing")!;

export function servicePageBySlug(slug: string): ServicePageContent | undefined {
  return servicePages.find((p) => p.slug === slug);
}

export function relatedServicesFor(page: ServicePageContent): ServiceItem[] {
  return page.relatedSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is ServiceItem => Boolean(s));
}

export function serviceHref(slug: string) {
  return servicePath(slug);
}

export function requestNurseHref(serviceName: string) {
  const params = new URLSearchParams({ service: serviceName });
  return `${REQUEST_NURSE_PATH}?${params.toString()}`;
}

export function requestStaffHref(serviceName: string) {
  const params = new URLSearchParams({ service: serviceName });
  return `${REQUEST_STAFF_PATH}?${params.toString()}`;
}

/** Home-care pages go to Request a Nurse; facility pages go to Request Staff. */
export function requestHrefFor(page: ServicePageContent) {
  return page.category === "facility"
    ? requestStaffHref(page.requestServiceName)
    : requestNurseHref(page.requestServiceName);
}

export function serviceJsonLd(page: ServicePageContent) {
  const pageUrl = absoluteUrl(page.path);
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
        name: page.h1,
        serviceType: page.name,
        url: pageUrl,
        description: page.seoDescription,
        provider: { "@id": `${SITE_ORIGIN}/#organization` },
        areaServed: { "@type": "Country", name: "Qatar" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
          { "@type": "ListItem", position: 3, name: page.name, item: pageUrl },
        ],
      },
    ],
  };
}

export function homeNursingJsonLd() {
  return serviceJsonLd(homeNursingPage);
}
