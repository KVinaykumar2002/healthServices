import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_HOME_HERO, MEDIA_PATH_PREFIX, normalizeHomeHero, type HomeHero } from "@shared/homeHero";
import {
  DEFAULT_SITE_SETTINGS,
  mapUrls,
  normalizeSiteSettings,
  telHref,
  whatsappHref,
  type SiteSettings,
} from "@shared/siteSettings";
import { API_BASE_URL } from "@/lib/api";

const SETTINGS_CACHE_KEY = "bhsk-site-settings";
const HERO_CACHE_KEY = "bhsk-home-hero";

export type ContactLink = { display: string; href: string };

export type SiteContact = {
  email: string;
  emailHref: string;
  phones: ContactLink[];
  primaryPhone: ContactLink;
  landline: ContactLink | null;
  whatsapp: { number: string; href: string };
  addressLines: string[];
  map: ReturnType<typeof mapUrls>;
  social: { instagram: string; facebook: string; linkedin: string };
};

export function buildSiteContact(settings: SiteSettings): SiteContact {
  const phones = settings.phones.map((display) => ({ display, href: telHref(display) }));
  return {
    email: settings.email,
    emailHref: `mailto:${settings.email}`,
    phones,
    primaryPhone: phones[0],
    landline: settings.landline ? { display: settings.landline, href: telHref(settings.landline) } : null,
    whatsapp: { number: settings.whatsapp, href: whatsappHref(settings.whatsapp) },
    addressLines: settings.addressLines,
    map: mapUrls(settings.mapQuery),
    social: { instagram: settings.instagramUrl, facebook: settings.facebookUrl, linkedin: settings.linkedinUrl },
  };
}

/** Uploaded photos live on the API, which is a different origin from the site in production. */
export function resolveImageSrc(src: string) {
  return src.startsWith(MEDIA_PATH_PREFIX) ? `${API_BASE_URL}${src}` : src;
}

function readCache<T>(key: string, normalize: (raw: unknown) => T, fallback: T): T {
  try {
    const cached = localStorage.getItem(key);
    return cached ? normalize(JSON.parse(cached)) : fallback;
  } catch {
    return fallback;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled; the fetched values still apply for this visit.
  }
}

const SiteContactContext = createContext<SiteContact>(buildSiteContact(DEFAULT_SITE_SETTINGS));
const HomeHeroContext = createContext<HomeHero>(DEFAULT_HOME_HERO);

/** Loads the admin-managed site content; the last copy is cached so repeat visits render it immediately. */
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(() =>
    readCache(SETTINGS_CACHE_KEY, normalizeSiteSettings, DEFAULT_SITE_SETTINGS),
  );
  const [hero, setHero] = useState(() => readCache(HERO_CACHE_KEY, normalizeHomeHero, DEFAULT_HOME_HERO));

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/site-settings`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((payload: { settings?: unknown; hero?: unknown }) => {
        const nextSettings = normalizeSiteSettings(payload.settings);
        setSettings(nextSettings);
        writeCache(SETTINGS_CACHE_KEY, nextSettings);

        const nextHero = normalizeHomeHero(payload.hero);
        setHero(nextHero);
        writeCache(HERO_CACHE_KEY, nextHero);
      })
      .catch((error) => {
        if (!controller.signal.aborted) console.warn("[settings] using cached site content", error);
      });
    return () => controller.abort();
  }, []);

  const contact = useMemo(() => buildSiteContact(settings), [settings]);
  return (
    <SiteContactContext.Provider value={contact}>
      <HomeHeroContext.Provider value={hero}>{children}</HomeHeroContext.Provider>
    </SiteContactContext.Provider>
  );
}

export function useSiteContact() {
  return useContext(SiteContactContext);
}

export function useHomeHero() {
  return useContext(HomeHeroContext);
}
