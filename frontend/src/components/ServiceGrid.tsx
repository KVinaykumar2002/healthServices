import { Link } from "wouter";
import type { Service } from "@shared/services";
import { cn } from "@/lib/utils";
import { FitImage } from "@/components/FitImage";
import { GsapStagger, Reveal } from "@/lib/motion";
import { servicePath } from "@/lib/site";
import { resolveImageSrc } from "@/lib/siteSettings";

export interface ServiceGridProps {
  title: string;
  subtitle?: string;
  services: Service[];
  className?: string;
}

/** Image + title + short description grid with GSAP scroll stagger. */
export function ServiceGrid({ title, subtitle, services, className }: ServiceGridProps) {
  if (!services.length) return null;
  return (
    <section className={cn("service-grid-section", className)}>
      <div className="container">
        <Reveal className="section-heading" direction="left" distance={64}>
          <div className="eyebrow">OUR SERVICES</div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </Reveal>

        <ServiceCards services={services} />
      </div>
    </section>
  );
}

export function ServiceCards({ services }: { services: Service[] }) {
  return (
    // Remounts when the list changes so newly loaded cards get the same entrance animation.
    <GsapStagger
      key={services.map((service) => service.id).join()}
      className="service-image-grid"
      direction="left"
      distance={48}
      stagger={0.08}
    >
      {services.map((service) => (
        <div key={service.slug}>
          <Link href={servicePath(service.slug)} className="service-tile service-tile--detailed">
            <FitImage
              src={resolveImageSrc(service.cardImageUrl)}
              alt={service.name}
              loading="lazy"
              className="service-tile-media"
            >
              <div className="service-tile-wash" />
            </FitImage>
            <span className="service-tile__title">{service.name}</span>
            <p className="service-tile__text">{service.text}</p>
          </Link>
        </div>
      ))}
    </GsapStagger>
  );
}
