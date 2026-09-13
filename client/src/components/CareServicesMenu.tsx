import {
  Accessibility,
  Baby,
  ClipboardPlus,
  HardHat,
  HeartPulse,
  MessageCircleHeart,
  Pill,
  School,
  Siren,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";

export interface CareServiceItem {
  slug: string;
  label: string;
  icon: LucideIcon;
}

/** Short labels + icons for the navbar services menu. */
export const careMenuServices: CareServiceItem[] = [
  { slug: "physiotherapy", label: "Physiotherapy", icon: Accessibility },
  { slug: "hospitals", label: "Hospital Nursing", icon: Stethoscope },
  { slug: "medical-centres", label: "Medical Centres", icon: ClipboardPlus },
  { slug: "elderly-care", label: "Elder Care", icon: HeartPulse },
  { slug: "maternity-newborn", label: "Mother & Baby Care", icon: Baby },
  { slug: "baby-care", label: "Baby Care", icon: Baby },
  { slug: "schools-nurseries", label: "Schools / Nurseries", icon: School },
  { slug: "camp-construction", label: "Camp / Construction", icon: HardHat },
  { slug: "palliative-care", label: "Palliative Care", icon: MessageCircleHeart },
  { slug: "chronic-care", label: "Chronic Care", icon: Pill },
  { slug: "post-operative", label: "Post-operative Care", icon: Siren },
];

interface CareServicesMenuProps {
  onNavigate?: () => void;
  /** Compact panel for desktop nav dropdown; full list for mobile drawer. */
  variant?: "dropdown" | "drawer";
}

export function CareServicesMenu({ onNavigate, variant = "dropdown" }: CareServicesMenuProps) {
  return (
    <div className={`care-menu care-menu--${variant}`} aria-label="Home healthcare services">
      <header className="care-menu-heading">
        <span className="care-menu-kicker">Our services</span>
        <p className="care-menu-title">Care, at home.</p>
      </header>
      <nav className="care-menu-grid" aria-label="Healthcare services">
        {careMenuServices.map(({ slug, label, icon: Icon }) => (
          <Link
            key={slug}
            href={`/${slug}`}
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
      </nav>
      <Link href="/services" className="care-menu-all" onClick={onNavigate}>
        View all services
      </Link>
    </div>
  );
}
