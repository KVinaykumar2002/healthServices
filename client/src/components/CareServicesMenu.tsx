import {
  Accessibility,
  Baby,
  ClipboardPlus,
  HardHat,
  HeartHandshake,
  HeartPulse,
  MessageCircleHeart,
  Pill,
  School,
  Siren,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { servicePath } from "@/lib/site";

export interface CareServiceItem {
  slug: string;
  label: string;
  icon: LucideIcon;
  group: "home" | "facility";
}

/** Approved services only — short labels + icons for the navbar menu. */
export const careMenuServices: CareServiceItem[] = [
  { slug: "home-nursing", label: "Home Nursing", icon: HeartHandshake, group: "home" },
  { slug: "maternity-newborn", label: "Mother & Baby Care", icon: Baby, group: "home" },
  { slug: "elderly-care", label: "Elder Care", icon: HeartPulse, group: "home" },
  { slug: "baby-care", label: "Baby Care", icon: Baby, group: "home" },
  { slug: "palliative-care", label: "Palliative Care", icon: MessageCircleHeart, group: "home" },
  { slug: "chronic-care", label: "Chronic Care", icon: Pill, group: "home" },
  { slug: "post-operative", label: "Post-operative Care", icon: Siren, group: "home" },
  { slug: "physiotherapy", label: "Physiotherapy", icon: Accessibility, group: "home" },
  { slug: "hospitals", label: "Hospital Nursing", icon: Stethoscope, group: "facility" },
  { slug: "medical-centres", label: "Medical Centres", icon: ClipboardPlus, group: "facility" },
  { slug: "schools-nurseries", label: "Schools / Nurseries", icon: School, group: "facility" },
  { slug: "camp-construction", label: "Camp / Construction", icon: HardHat, group: "facility" },
];

interface CareServicesMenuProps {
  onNavigate?: () => void;
  /** Compact panel for desktop nav dropdown; full list for mobile drawer. */
  variant?: "dropdown" | "drawer";
}

function MenuLinks({
  items,
  onNavigate,
}: {
  items: CareServiceItem[];
  onNavigate?: () => void;
}) {
  return (
    <div className="care-menu-grid">
      {items.map(({ slug, label, icon: Icon }) => (
        <Link
          key={slug}
          href={servicePath(slug)}
          className="care-service-link"
          onClick={onNavigate}
          aria-label={label}
        >
          <span className="care-service-icon" aria-hidden="true">
            <Icon strokeWidth={1.65} />
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}

export function CareServicesMenu({ onNavigate, variant = "dropdown" }: CareServicesMenuProps) {
  const home = careMenuServices.filter((s) => s.group === "home");
  const facility = careMenuServices.filter((s) => s.group === "facility");

  return (
    <div className={`care-menu care-menu--${variant}`} aria-label="BHSK nursing services">
      <header className="care-menu-heading">
        <span className="care-menu-kicker">Our services</span>
        <p className="care-menu-title">Home care &amp; healthcare staffing.</p>
      </header>

      <div className="care-menu-groups">
        <section className="care-menu-group" aria-label="Home care services">
          <p className="care-menu-group__label">Home care</p>
          <MenuLinks items={home} onNavigate={onNavigate} />
        </section>
        <section className="care-menu-group" aria-label="Healthcare staffing">
          <p className="care-menu-group__label">Healthcare staffing</p>
          <MenuLinks items={facility} onNavigate={onNavigate} />
        </section>
      </div>

      <Link href="/services" className="care-menu-all" onClick={onNavigate}>
        View all services
      </Link>
    </div>
  );
}
