import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SERVICE_LIST, normalizeServices, type Service } from "@shared/services";
import { API_BASE_URL } from "@/lib/api";

const CACHE_KEY = "bhsk-services";

const DEFAULT_VISIBLE = DEFAULT_SERVICE_LIST.filter((service) => service.visible);

type ServicesState = {
  services: Service[];
  /** False until the API has answered (or failed), so unknown addresses can wait for new services. */
  loaded: boolean;
};

const ServicesContext = createContext<ServicesState>({ services: DEFAULT_VISIBLE, loaded: true });

function readCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? normalizeServices(JSON.parse(cached)) : null;
  } catch {
    return null;
  }
}

/** Loads the admin-managed services; the last copy is cached so repeat visits render it immediately. */
export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState(() => readCache() ?? DEFAULT_VISIBLE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/services`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((payload: { services?: unknown }) => {
        const next = normalizeServices(payload.services);
        if (!next) throw new Error("Unexpected services response");
        setServices(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // Storage can be full or disabled; the fetched services still apply for this visit.
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) console.warn("[services] using cached services", error);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoaded(true);
      });
    return () => controller.abort();
  }, []);

  const value = useMemo(() => ({ services, loaded }), [services, loaded]);
  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  return useContext(ServicesContext).services;
}

export function useServicesLoaded() {
  return useContext(ServicesContext).loaded;
}
