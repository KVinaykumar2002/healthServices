import { useEffect } from "react";
import { SITE_ORIGIN, absoluteUrl } from "@/lib/site";

export type SeoProps = {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** Sets document title, description, canonical URL and optional JSON-LD for the active route. */
export function Seo({ title, description, path, jsonLd }: SeoProps) {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "BHSK for Health Services");
    upsertLink("canonical", canonical);

    if (jsonLd) {
      upsertJsonLd("bhsk-jsonld", jsonLd);
    } else {
      document.getElementById("bhsk-jsonld")?.remove();
    }

    return () => {
      // Leave tags in place for the next route; Seo on the next page will overwrite.
    };
  }, [title, description, path, jsonLd]);

  return null;
}

export function servicesPageJsonLd() {
  const pageUrl = absoluteUrl("/services");
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
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Healthcare Services in Qatar",
        description: "Explore BHSK’s home care and healthcare staffing services in Qatar.",
        inLanguage: "en",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_ORIGIN}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
