import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { GsapStagger, Reveal, RevealText } from "@/lib/motion";

export interface ServiceItem {
  name: string;
  slug: string;
  imageUrl: string;
  text: string;
}

export interface ServiceGridProps {
  title: string;
  subtitle?: string;
  services: ServiceItem[];
  className?: string;
}

/** Image + title grid with GSAP scroll stagger (left → right). */
export function ServiceGrid({ title, subtitle, services, className }: ServiceGridProps) {
  return (
    <section className={cn("service-grid-section", className)}>
      <div className="container">
        <Reveal className="section-heading" direction="left" distance={64}>
          <div className="eyebrow">OUR SERVICES</div>
          <h2>
            <RevealText scroll>{title}</RevealText>
          </h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </Reveal>

        <GsapStagger className="service-image-grid" direction="left" distance={48} stagger={0.08}>
          {services.map((service) => (
            <div key={service.slug}>
              <Link href={`/${service.slug}`} className="service-tile">
                <div className="service-tile-media">
                  <img src={service.imageUrl} alt={service.name} loading="lazy" />
                  <div className="service-tile-wash" />
                </div>
                <span>{service.name}</span>
              </Link>
            </div>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
}
