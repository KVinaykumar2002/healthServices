import { Link } from "wouter";
import { Building2, Home as HomeIcon } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { Reveal, RevealText, GsapStagger } from "@/lib/motion";
import { Seo, servicesPageJsonLd } from "@/components/Seo";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import {
  HOME_CARE_BLURB,
  HEALTHCARE_STAFFING_BLURB,
  REQUEST_NURSE_PATH,
  REQUEST_STAFF_PATH,
  facilityServices,
  homeCareServices,
  servicePath,
  type ServiceItem,
} from "@/lib/site";

function ServiceTiles({ items }: { items: ServiceItem[] }) {
  return (
    <GsapStagger className="service-image-grid" direction="left" distance={48} stagger={0.08}>
      {items.map((service) => (
        <div key={service.slug}>
          <Link href={servicePath(service.slug)} className="service-tile service-tile--detailed">
            <div className="service-tile-media">
              <img src={service.imageUrl} alt={service.name} loading="lazy" />
              <div className="service-tile-wash" />
            </div>
            <span className="service-tile__title">{service.name}</span>
            <p className="service-tile__text">{service.text}</p>
          </Link>
        </div>
      ))}
    </GsapStagger>
  );
}

const SERVICES_PAGE_JSON_LD = servicesPageJsonLd();

export function ServicesPage() {
  return (
    <main className="services-hub">
      <Seo
        title="Healthcare Services in Qatar | BHSK"
        description="Explore BHSK’s home care and healthcare staffing services in Qatar. Whether you need nursing support for a family member or staff for a hospital, medical centre, school or workplace, contact our team."
        path="/services"
        jsonLd={SERVICES_PAGE_JSON_LD}
      />

      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <Reveal direction="left" distance={32}>
            <SiteBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
          </Reveal>
          <Reveal className="eyebrow" direction="left" distance={40} delay={0.04}>
            BHSK FOR HEALTH SERVICES
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.08}>
            Healthcare Services in Qatar
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.12} className="services-hub__intro">
            Explore BHSK’s home care and healthcare staffing services in Qatar. Whether you need nursing support
            for a family member or staff for a hospital, medical centre, school or workplace, our team can discuss
            your requirements and help you find suitable support.
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.16} className="services-hub__intro muted">
            Choose a service below to learn more, or contact us to check availability.
          </Reveal>
        </div>
      </section>

      <section className="service-grid-section" id="home-care" aria-labelledby="home-care-heading">
        <div className="container">
          <Reveal className="section-heading services-hub__group-heading" direction="left" distance={64}>
            <div className="services-hub__group-kicker">
              <HomeIcon size={18} aria-hidden="true" strokeWidth={1.7} />
              <span className="eyebrow">FOR FAMILIES</span>
            </div>
            <h2 id="home-care-heading">
              <RevealText scroll>Home Care Services</RevealText>
            </h2>
            <p>{HOME_CARE_BLURB}</p>
            <AntiMetalButton
              href={REQUEST_NURSE_PATH}
              label="Request a Nurse"
              className="services-hub__cta"
            />
          </Reveal>
          <ServiceTiles items={homeCareServices} />
        </div>
      </section>

      <section
        className="service-grid-section services-hub__staffing"
        id="healthcare-staffing"
        aria-labelledby="staffing-heading"
      >
        <div className="container">
          <Reveal className="section-heading services-hub__group-heading" direction="left" distance={64}>
            <div className="services-hub__group-kicker">
              <Building2 size={18} aria-hidden="true" strokeWidth={1.7} />
              <span className="eyebrow">FOR EMPLOYERS &amp; FACILITIES</span>
            </div>
            <h2 id="staffing-heading">
              <RevealText scroll>Healthcare Staffing Services</RevealText>
            </h2>
            <p>{HEALTHCARE_STAFFING_BLURB}</p>
            <AntiMetalButton
              href={REQUEST_STAFF_PATH}
              label="Request Staff"
              className="services-hub__cta"
            />
          </Reveal>
          <ServiceTiles items={facilityServices} />
          <Reveal className="services-hub__staffing-note" direction="left" distance={40} delay={0.08}>
            <p>
              Licensed nurse staffing for hospitals, medical centres, schools and worksites in Qatar is arranged
              after BHSK assesses your role, shift and licensing requirements. Use{" "}
              <Link href={REQUEST_STAFF_PATH}>Request Staff</Link> so employers reach the staffing form, not a
              patient form.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
