import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, Home as HomeIcon, ArrowRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Link, Route, Switch, useLocation } from "wouter";
import { Reveal, easeOut, pageTransition } from "@/lib/motion";
import { CareServicesMenu } from "@/components/CareServicesMenu";
import { HeroBand } from "@/components/HeroBand";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ServicesPage } from "@/components/ServicesPage";
import { HomeNursingPage } from "@/components/ServiceDetailPage";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/FaqSection";
import { ContactActions } from "@/components/ContactActions";
import { Seo } from "@/components/Seo";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { requestNurseHref } from "@/lib/servicePages";
import {
  CONTACT_EMAIL,
  CONTACT_PHONES,
  OFFICE_ADDRESS,
  HOME_CARE_BLURB,
  HEALTHCARE_STAFFING_BLURB,
  REQUEST_NURSE_PATH,
  REQUEST_STAFF_PATH,
  facilityServices,
  homeCareServices,
  services,
} from "@/lib/site";

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand ${className}`}>
      <img src="/image.png" alt="BHSK Nursing Services" className="brand-logo" />
      <span>
        <b>BHSK</b>
        <small>NURSING SERVICES</small>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [servicesOpen]);

  const closeServices = () => setServicesOpen(false);

  const marqueeItems = (
    <>
      <span>Professional nursing care · Hospitals, clinics &amp; home · Qatar</span>
      <span className="topbar-sep" aria-hidden="true">
        ·
      </span>
      <a href={CONTACT_PHONES[0].href}>
        <Phone size={13} /> {CONTACT_PHONES[0].display}
      </a>
      <span className="topbar-sep" aria-hidden="true">
        ·
      </span>
      <a href={`mailto:${CONTACT_EMAIL}`}>
        <Mail size={13} /> {CONTACT_EMAIL}
      </a>
    </>
  );

  return (
    <header className="site-header">
      <div className="topbar" aria-label="Site announcements">
        <div className={`topbar-marquee${reduce ? " is-static" : ""}`}>
          <div className="topbar-marquee-track">
            <div className="topbar-marquee-group">{marqueeItems}</div>
            {!reduce && (
              <div className="topbar-marquee-group" aria-hidden="true">
                {marqueeItems}
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="nav container">
        <BrandMark />
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className="nav-links">
          <div
            className={`nav-dropdown${servicesOpen ? " is-open" : ""}`}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={closeServices}
          >
            <button
              type="button"
              className="nav-dropdown-trigger"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
            >
              Our Services <ChevronDown size={14} />
            </button>
            <div className="dropdown-menu dropdown-menu--care" role="menu">
              <CareServicesMenu variant="dropdown" onNavigate={closeServices} />
            </div>
          </div>
          <Link className={location === "/healthcare-staffing" ? "active" : ""} href="/healthcare-staffing">
            Staffing
          </Link>
          <Link className={location === "/about-us" ? "active" : ""} href="/about-us">
            About Us
          </Link>
          <Link className={location === "/contact-us" ? "active" : ""} href="/contact-us">
            Contact
          </Link>
          <a href={CONTACT_PHONES[0].href} className="phone">
            <Phone size={15} /> {CONTACT_PHONES[0].display}
          </a>
          <Link href="/request-a-nurse" className="btn btn-primary small">
            Request a Nurse
          </Link>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: easeOut }}
          >
            <div className="mobile-drawer-inner">
              <CareServicesMenu variant="drawer" onNavigate={() => setOpen(false)} />
              <Link href="/healthcare-staffing" onClick={() => setOpen(false)}>
                Healthcare Staffing
              </Link>
              <Link href="/about-us" onClick={() => setOpen(false)}>
                About Us
              </Link>
              <Link href="/contact-us" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <a href={CONTACT_PHONES[0].href} className="phone">
                <Phone size={15} /> {CONTACT_PHONES[0].display} / {CONTACT_PHONES[1].display}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="phone">
                <Mail size={15} /> {CONTACT_EMAIL}
              </a>
              <Link href="/request-a-nurse" className="btn btn-primary small" onClick={() => setOpen(false)}>
                Request a Nurse
              </Link>
              <Link
                href="/request-healthcare-staff"
                className="btn btn-outline small"
                onClick={() => setOpen(false)}
              >
                Request Staff
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <BrandMark className="footer-brand" />
          <p className="muted">
            Professional nursing for hospitals, medical centres, schools, worksites and home care in Qatar.
          </p>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about-us">About us</Link>
          <Link href="/services">Services</Link>
          <Link href="/services#healthcare-staffing">Healthcare staffing</Link>
          <Link href="/contact-us">Contact us</Link>
        </div>
        <div>
          <h4>Request care</h4>
          <Link href={REQUEST_NURSE_PATH}>Request a Nurse</Link>
          <Link href={REQUEST_STAFF_PATH}>Request Staff</Link>
          <Link href="/book-consultation">Book a Consultation</Link>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href={CONTACT_PHONES[0].href}>
            <Phone size={15} /> {CONTACT_PHONES[0].display}
          </a>
          <a href={CONTACT_PHONES[1].href}>
            <Phone size={15} /> {CONTACT_PHONES[1].display}
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={15} /> {CONTACT_EMAIL}
          </a>
          <p className="muted small-text">
            {OFFICE_ADDRESS.lines[0]}
            <br />
            {OFFICE_ADDRESS.lines[1]}
            <br />
            {OFFICE_ADDRESS.lines[2]}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BHSK Nursing Services. All rights reserved.</span>
        <span>Doha, Qatar</span>
      </div>
    </footer>
  );
}

function TwoJourneyBand() {
  return (
    <section className="journey-band section" aria-labelledby="journey-heading">
      <div className="container">
        <Reveal className="journey-intro" direction="left" distance={48}>
          <div className="eyebrow">WHO IS THIS FOR?</div>
          <h2 id="journey-heading">Choose home care or healthcare staffing</h2>
          <p>
            Individuals and families request home nursing. Businesses and facilities request healthcare staffing. Each
            path has its own short description and lead form.
          </p>
        </Reveal>
        <div className="journey-paths">
          <Reveal className="journey-path" direction="left" distance={40} delay={0.06}>
            <HomeIcon className="journey-path__icon" aria-hidden="true" strokeWidth={1.6} />
            <h3>Home care for individuals</h3>
            <p>{HOME_CARE_BLURB}</p>
            <div className="journey-path__actions">
              <Link href={REQUEST_NURSE_PATH} className="btn btn-primary">
                Request a Nurse <ArrowRight size={16} />
              </Link>
              <Link href="/services#home-care" className="btn btn-outline">
                View home care services
              </Link>
            </div>
          </Reveal>
          <Reveal className="journey-path" direction="left" distance={40} delay={0.12}>
            <Building2 className="journey-path__icon" aria-hidden="true" strokeWidth={1.6} />
            <h3>Healthcare staffing for business</h3>
            <p>{HEALTHCARE_STAFFING_BLURB}</p>
            <div className="journey-path__actions">
              <Link href={REQUEST_STAFF_PATH} className="btn btn-primary">
                Request Staff <ArrowRight size={16} />
              </Link>
              <Link href="/services#healthcare-staffing" className="btn btn-outline">
                View staffing services
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WhyBhsk() {
  return (
    <section className="proof section" aria-labelledby="why-heading">
      <div className="container proof-grid">
        <Reveal direction="left" distance={80}>
          <div className="proof-photo">
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85"
              alt="Nursing care in a clinical environment"
            />
          </div>
        </Reveal>
        <Reveal delay={0.12} className="proof-copy" direction="left" distance={56}>
          <div className="eyebrow">WHY BHSK</div>
          <h2 id="why-heading">Nursing support based in Qatar</h2>
          <p>
            BHSK Nursing Services operates from Doha and focuses on professional nursing for facilities and home care.
            We match enquiries to available staff after assessment — we do not publish unverified licence numbers,
            partner counts or response-time promises on this site.
          </p>
          <div className="check-list">
            <div>
              <Check /> Home care and facility staffing paths
            </div>
            <div>
              <Check /> Enquiry, assessment, matching, then confirmation
            </div>
            <div>
              <Check /> Local coordination from our Old Airport office
            </div>
          </div>
          <p className="proof-note">
            Licence and screening details are shared by the BHSK team when relevant to an assignment. Approved wording
            will be published here once confirmed.
          </p>
          <Link href="/about-us" className="btn btn-outline">
            About BHSK <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function TrustNote() {
  return (
    <section className="trust-note section" aria-labelledby="trust-heading">
      <div className="container trust-note__inner">
        <Reveal direction="left" distance={40}>
          <div className="eyebrow">TEAM &amp; REVIEWS</div>
          <h2 id="trust-heading">Only approved photos and feedback</h2>
          <p>
            We do not display stock testimonials, unapproved reviewer quotes, or partner logos without prior written
            consent. Genuine BHSK team photos and client reviews will be added here once permission is confirmed for
            use in Qatar.
          </p>
          <Link href="/contact-us" className="btn btn-outline">
            Contact the team <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Home() {
  return (
    <main>
      <HeroBand />
      <TwoJourneyBand />
      <ServiceGrid
        title="Nursing services from BHSK"
        subtitle="Real services we coordinate in Qatar — each card links to a full page with a short description."
        services={[...services]}
      />
      <WhyBhsk />
      <HowItWorks />
      <TrustNote />
      <FaqSection />
      <ContactActions />
    </main>
  );
}

function StaffingHubPage() {
  return (
    <main>
      <Seo
        title="Healthcare Staffing Services in Qatar | BHSK"
        description="Find healthcare staffing support for hospitals, medical centres, schools and workplaces in Qatar. Contact BHSK to discuss roles, shifts and availability."
        path="/healthcare-staffing"
      />
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <Reveal direction="left" distance={32}>
            <SiteBreadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Healthcare Staffing" },
              ]}
            />
          </Reveal>
          <Reveal className="eyebrow" direction="left" distance={40} delay={0.04}>
            FOR EMPLOYERS &amp; FACILITIES
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.08}>
            Healthcare Staffing Services
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.12}>
            {HEALTHCARE_STAFFING_BLURB}
          </Reveal>
          <Reveal direction="left" distance={36} delay={0.18}>
            <Link href={REQUEST_STAFF_PATH} className="btn btn-primary">
              Request Staff <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
      <ServiceGrid
        title="Facility nursing staffing in Qatar"
        subtitle="Hospitals, medical centres, schools and worksites we support."
        services={[...facilityServices]}
      />
      <section className="section">
        <div className="container services-hub__staffing-note">
          <p>
            Licensed nurse staffing details are confirmed with BHSK after we review your roles, shifts and licensing
            requirements. Employers should use{" "}
            <Link href={REQUEST_STAFF_PATH}>Request Staff</Link> — not the patient home-care form.
          </p>
        </div>
      </section>
    </main>
  );
}

function InnerPage({
  type,
  slug,
  leadDefault,
}: {
  type: string;
  slug?: string;
  leadDefault?: "employer" | "patient" | "";
}) {
  const service = services.find((s) => s.slug === slug);
  const title =
    service?.name ||
    ({
      "about-us": "About BHSK Nursing Services",
      "contact-us": "We’re here to help",
      "request-a-nurse": "Request a Nurse",
      "request-healthcare-staff": "Request Staff",
      "book-consultation": "Book a consultation",
    }[type] ||
      "BHSK Nursing Services");
  const description =
    service?.text ||
    (type === "about-us"
      ? "BHSK delivers professional nursing across hospitals, clinics, schools, worksites and homes in Qatar."
      : type === "request-a-nurse"
        ? "Tell us about the home care you need. Our team will assess fit and availability before confirming service."
        : type === "request-healthcare-staff"
          ? "Tell us about your facility staffing need. Placement depends on assessment and current availability."
          : type === "book-consultation"
            ? "Share your questions and preferred contact details. We will follow up to discuss next steps."
            : "Share what you need and our team will get back to you shortly.");

  const isLead =
    type === "contact-us" ||
    type === "request-a-nurse" ||
    type === "request-healthcare-staff" ||
    type === "book-consultation";

  const crumbs = service
    ? [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services" },
        { label: service.name },
      ]
    : type === "request-a-nurse" || type === "request-healthcare-staff"
      ? [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: title },
        ]
      : [{ label: "Home", href: "/" }, { label: title }];

  return (
    <main>
      {service ? (
        <Seo
          title={`${service.name} | BHSK`}
          description={service.text}
          path={`/${service.slug}`}
        />
      ) : type === "request-a-nurse" ? (
        <Seo
          title="Request a Nurse | BHSK"
          description="Request home nursing support in Qatar. BHSK assesses fit and availability before confirming service."
          path={REQUEST_NURSE_PATH}
        />
      ) : type === "request-healthcare-staff" ? (
        <Seo
          title="Request Staff | BHSK"
          description="Request healthcare staffing for hospitals, medical centres, schools and workplaces in Qatar."
          path={REQUEST_STAFF_PATH}
        />
      ) : null}
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <Reveal direction="left" distance={32}>
            <SiteBreadcrumb items={crumbs} />
          </Reveal>
          <Reveal className="eyebrow" direction="left" distance={40} delay={0.04}>
            BHSK NURSING SERVICES
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.08}>
            {title}
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.12}>
            {description}
          </Reveal>
          {!isLead && (
            <Reveal direction="left" distance={36} delay={0.2}>
              {service ? (
                <Link
                  href={service.category === "facility" ? REQUEST_STAFF_PATH : REQUEST_NURSE_PATH}
                  className="btn btn-primary"
                >
                  {service.category === "facility" ? "Request Staff" : "Request a Nurse"}{" "}
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link href="/contact-us" className="btn btn-primary">
                  Talk to our team <ArrowRight size={16} />
                </Link>
              )}
            </Reveal>
          )}
        </div>
      </section>
      {isLead ? (
        <ContactContent
          defaultType={
            leadDefault ??
            (type === "request-a-nurse"
              ? "patient"
              : type === "request-healthcare-staff"
                ? "employer"
                : "")
          }
          lockType={type === "request-a-nurse" || type === "request-healthcare-staff"}
        />
      ) : (
        <GeneralContent service={service} type={type} />
      )}
    </main>
  );
}

function GeneralContent({
  service,
  type,
}: {
  service?: (typeof services)[number];
  type?: string;
}) {
  return (
    <section className="section">
      <div className="container content-grid">
        <Reveal direction="left" distance={56}>
          <div className="eyebrow">CARE IN QATAR</div>
          <h2>
            {service
              ? service.name
              : type === "about-us"
                ? "About BHSK Nursing Services"
                : "Healthcare that starts with listening"}
          </h2>
          <p>
            {service
              ? service.text
              : "BHSK Nursing Services is based in Doha. We coordinate nursing for facilities and specialised home care for families. Claims about licences, partners or volumes appear on this site only when approved by BHSK."}
          </p>
          {service ? (
            <div className="content-service-image">
              <img src={service.imageUrl} alt={service.name} />
            </div>
          ) : null}
          <div className="check-list">
            <div>
              <Check /> Clear home care and staffing paths
            </div>
            <div>
              <Check /> Assessment before confirmation
            </div>
            <div>
              <Check /> Local team coordination in Qatar
            </div>
          </div>
          <Link
            href={
              service?.category === "facility"
                ? REQUEST_STAFF_PATH
                : service
                  ? requestNurseHref(service.name)
                  : REQUEST_NURSE_PATH
            }
            className="btn btn-primary"
            style={{ marginTop: 24 }}
          >
            {service?.category === "facility" ? "Request Staff" : "Request a Nurse"} <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal delay={0.12} className="content-panel" direction="right" distance={48}>
          <h3>How it works</h3>
          <div className="step">
            <b>01</b>
            <span>
              <strong>Enquiry</strong>
              <small>Send a request for home care or staffing.</small>
            </span>
          </div>
          <div className="step">
            <b>02</b>
            <span>
              <strong>Assessment</strong>
              <small>We review clinical fit and availability.</small>
            </span>
          </div>
          <div className="step">
            <b>03</b>
            <span>
              <strong>Matching</strong>
              <small>We align the right nursing skill set.</small>
            </span>
          </div>
          <div className="step">
            <b>04</b>
            <span>
              <strong>Confirmation</strong>
              <small>Service starts after we confirm with you.</small>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function useContactQuery() {
  const [location] = useLocation();
  return useMemo(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(search);
    const typeParam = params.get("type");
    const type = typeParam === "employer" || typeParam === "patient" ? typeParam : "";
    return {
      service: params.get("service") ?? "",
      type,
      location,
    };
  }, [location]);
}

function ContactContent({
  defaultType = "",
  lockType = false,
}: {
  defaultType?: "employer" | "patient" | "";
  lockType?: boolean;
}) {
  const query = useContactQuery();
  const [enquiryType, setEnquiryType] = useState(query.type || defaultType);
  const [selectedService, setSelectedService] = useState(() => {
    if (!query.service) return "";
    const byName = services.find((s) => s.name === query.service);
    if (byName) return byName.name;
    const byPartial = services.find(
      (s) =>
        s.name.toLowerCase().includes(query.service.toLowerCase()) ||
        query.service.toLowerCase().includes(s.name.toLowerCase().split(" ")[0] ?? ""),
    );
    return byPartial?.name ?? "";
  });

  useEffect(() => {
    if (query.type) setEnquiryType(query.type);
    else if (defaultType) setEnquiryType(defaultType);
  }, [query.type, defaultType]);

  useEffect(() => {
    if (!query.service) return;
    const byName = services.find((s) => s.name === query.service);
    if (byName) {
      setSelectedService(byName.name);
      return;
    }
    const byPartial = services.find(
      (s) =>
        s.name.toLowerCase().includes(query.service.toLowerCase()) ||
        query.service.toLowerCase().includes(s.name.toLowerCase().split(" ")[0] ?? ""),
    );
    if (byPartial) setSelectedService(byPartial.name);
  }, [query.service]);

  const serviceOptions =
    enquiryType === "employer"
      ? facilityServices
      : enquiryType === "patient"
        ? homeCareServices
        : services;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const org = String(data.get("org") ?? "").trim();
    const type = String(data.get("enquiryType") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const typeLabel =
      type === "employer"
        ? "Employer / facility staffing"
        : type === "patient"
          ? "Patient / family home care"
          : type || "Not specified";

    const subject = encodeURIComponent(
      `BHSK enquiry — ${typeLabel}${service ? ` — ${service}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name || "—"}`,
        `Phone: ${phone || "—"}`,
        `Organisation / city: ${org || "—"}`,
        `Enquiry type: ${typeLabel}`,
        `Service: ${service || "—"}`,
        "",
        "Message:",
        message || "—",
        "",
        "Note: This enquiry requires assessment and availability confirmation by the BHSK team. It is not a confirmed booking.",
      ].join("\n"),
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="section">
      <div className="container contact-grid">
        <Reveal direction="left" distance={56}>
          <div className="eyebrow">CONTACT BHSK</div>
          <h2>Send a lead to our Qatar team</h2>
          <p>
            Complete the form for home care or facility staffing. We reply to assess fit — placement is confirmed only
            after review.
          </p>
          <div className="contact-detail">
            <MapPin />
            <div>
              <b>Office address</b>
              {OFFICE_ADDRESS.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
          <div className="contact-detail">
            <Phone />
            <div>
              <b>Contact</b>
              <span>
                <a href={CONTACT_PHONES[0].href}>{CONTACT_PHONES[0].display}</a>
                {" / "}
                <a href={CONTACT_PHONES[1].href}>{CONTACT_PHONES[1].display}</a>
              </span>
            </div>
          </div>
          <div className="contact-detail">
            <Mail />
            <div>
              <b>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </b>
              <span>We aim to reply within one business day</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} direction="right" distance={48}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Lead form</h3>
            <input placeholder="Your name" name="name" required autoComplete="name" />
            <input placeholder="Phone number" name="phone" required autoComplete="tel" />
            <input placeholder="Organisation / city" name="org" autoComplete="organization" />
            {lockType ? <input type="hidden" name="enquiryType" value={enquiryType} /> : null}
            <select
              name={lockType ? undefined : "enquiryType"}
              required
              value={enquiryType}
              disabled={lockType && Boolean(enquiryType)}
              aria-readonly={lockType || undefined}
              onChange={(e) => {
                setEnquiryType(e.target.value as "employer" | "patient" | "");
                setSelectedService("");
              }}
            >
              <option value="" disabled>
                Enquiry type
              </option>
              <option value="patient">Patient / family home care (Request a Nurse)</option>
              <option value="employer">Employer / facility staffing (Request Staff)</option>
            </select>
            <select
              name="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Select a service (optional)</option>
              {serviceOptions.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            <textarea placeholder="Tell us how we can help" rows={4} name="message" />
            <p className="contact-form__note">
              Submitting starts a conversation with BHSK. Placement depends on clinical fit and availability — our team
              confirms after review.
            </p>
            <button className="btn btn-primary" type="submit">
              Submit enquiry <ArrowRight size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function SlugPage({ slug }: { slug: string }) {
  return <InnerPage type={slug} slug={services.some((s) => s.slug === slug) ? slug : undefined} />;
}

function App() {
  const [location] = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location}
          className="page-transition"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={{ duration: 1, ease: easeOut }}
        >
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/about-us">
              <InnerPage type="about-us" />
            </Route>
            <Route path="/contact-us">
              <InnerPage type="contact-us" />
            </Route>
            <Route path="/services">
              <ServicesPage />
            </Route>
            <Route path="/services/home-nursing">
              <HomeNursingPage />
            </Route>
            <Route path="/services/home-nursing/">
              <HomeNursingPage />
            </Route>
            <Route path="/healthcare-staffing">
              <StaffingHubPage />
            </Route>
            <Route path="/request-a-nurse">
              <InnerPage type="request-a-nurse" leadDefault="patient" />
            </Route>
            <Route path="/request-a-nurse/">
              <InnerPage type="request-a-nurse" leadDefault="patient" />
            </Route>
            <Route path="/request-healthcare-staff">
              <InnerPage type="request-healthcare-staff" leadDefault="employer" />
            </Route>
            <Route path="/book-consultation">
              <InnerPage type="book-consultation" />
            </Route>
            {services
              .filter((s) => s.slug !== "home-nursing")
              .map((s) => (
                <Route key={s.slug} path={`/${s.slug}`}>
                  <InnerPage type={s.slug} slug={s.slug} />
                </Route>
              ))}
            <Route path="/home-nursing">
              <HomeNursingPage />
            </Route>
            <Route path="/:slug">{(params) => <SlugPage slug={params.slug} />}</Route>
            <Route>
              <InnerPage type="about-us" />
            </Route>
          </Switch>
        </motion.div>
      </AnimatePresence>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    if (hash) {
      const id = window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }, 80);
      return () => window.clearTimeout(id);
    }
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [location, reduce]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void import("@/lib/gsap").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 120);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

export default App;
