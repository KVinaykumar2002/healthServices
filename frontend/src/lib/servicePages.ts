import { servicePath, type Service } from "@shared/services";
import { REQUEST_NURSE_PATH, REQUEST_STAFF_PATH, SITE_ORIGIN, absoluteUrl } from "@/lib/site";

export function relatedServicesFor(page: Service, services: Service[]): Service[] {
  return page.relatedSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is Service => Boolean(service));
}

/** Home-care pages go to Request a Nurse; facility pages go to Request Staff. */
export function requestHrefFor(page: Service) {
  const params = new URLSearchParams({ service: page.name });
  return `${page.category === "facility" ? REQUEST_STAFF_PATH : REQUEST_NURSE_PATH}?${params.toString()}`;
}

export function serviceJsonLd(page: Service) {
  const pageUrl = absoluteUrl(servicePath(page.slug));
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
