import { Link } from "wouter";
import type { Service } from "@shared/services";
import { SERVICE_ICON_COMPONENTS } from "@/lib/serviceIcons";
import { useServices } from "@/lib/services";
import { servicePath } from "@/lib/site";

interface CareServicesMenuProps {
  onNavigate?: () => void;
  /** Compact panel for desktop nav dropdown; full list for mobile drawer. */
  variant?: "dropdown" | "drawer";
}

function MenuLinks({
  items,
  onNavigate,
}: {
  items: Service[];
  onNavigate?: () => void;
}) {
  return (
    <div className="care-menu-grid">
      {items.map(({ slug, menuLabel, icon }) => {
        const Icon = SERVICE_ICON_COMPONENTS[icon];
        return (
          <Link
            key={slug}
            href={servicePath(slug)}
            className="care-service-link"
            onClick={onNavigate}
            aria-label={menuLabel}
          >
            <span className="care-service-icon" aria-hidden="true">
              <Icon strokeWidth={1.65} />
            </span>
            <span>{menuLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}

/** Icons describe everyday life and people, not clinical equipment (BHSK brand rule). */
export function CareServicesMenu({ onNavigate, variant = "dropdown" }: CareServicesMenuProps) {
  const services = useServices();
  const home = services.filter((s) => s.category === "home");
  const facility = services.filter((s) => s.category === "facility");

  return (
    <div className={`care-menu care-menu--${variant}`} aria-label="BHSK for Health Services">
      <header className="care-menu-heading">
        <span className="care-menu-kicker">Our services</span>
        <p className="care-menu-title">Home care &amp; healthcare staffing.</p>
      </header>

      <div className="care-menu-groups">
        {home.length ? (
          <section className="care-menu-group" aria-label="Home care services">
            <p className="care-menu-group__label">Home care</p>
            <MenuLinks items={home} onNavigate={onNavigate} />
          </section>
        ) : null}
        {facility.length ? (
          <section className="care-menu-group" aria-label="Healthcare staffing">
            <p className="care-menu-group__label">Healthcare staffing</p>
            <MenuLinks items={facility} onNavigate={onNavigate} />
          </section>
        ) : null}
      </div>

      <Link href="/services" className="care-menu-all" onClick={onNavigate}>
        View all services
      </Link>
    </div>
  );
}
