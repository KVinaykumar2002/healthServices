import { Fragment, useEffect, useLayoutEffect, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, Home as HomeIcon, Check, ChevronDown, Facebook, Instagram, Linkedin, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Link, Route, Switch, useLocation } from "wouter";
import { Reveal, easeOut, pageTransition } from "@/lib/motion";
import { CareServicesMenu } from "@/components/CareServicesMenu";
import { HeroBand } from "@/components/HeroBand";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ServicesPage } from "@/components/ServicesPage";
import { HomeNursingPage, ServicePageBySlug } from "@/components/ServiceDetailPage";
import { FitImage } from "@/components/FitImage";
import { FloatingContactWidget } from "@/components/FloatingContactWidget";
import { LandlineIcon } from "@/components/LandlineIcon";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { BackToTop } from "@/components/BackToTop";
import { HowItWorks } from "@/components/HowItWorks";
import { FaqSection } from "@/components/FaqSection";
import { ContactActions } from "@/components/ContactActions";
import { OfficeMap } from "@/components/OfficeMap";
import { Seo } from "@/components/Seo";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { Cta69 } from "@/components/ui/cta69";
import { BrandLockup, PulseDivider } from "@/components/brand/BhskLogo";
import { servicePageBySlug } from "@/lib/servicePages";
import { submitEnquiry } from "@/lib/api";
import {
  HOME_CARE_BLURB,
  HEALTHCARE_STAFFING_BLURB,
  REQUEST_NURSE_PATH,
  REQUEST_STAFF_PATH,
  facilityServices,
  homeCareServices,
  services,
} from "@/lib/site";
import { useSiteContact } from "@/lib/siteSettings";

function BrandMark({ className = "", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <Link href="/" className={`brand ${className}`} aria-label="BHSK for Health Services — home">
      <BrandLockup animated={animated} />
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();
  const reduce = useReducedMotion();
  const contact = useSiteContact();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 851px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

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
      <a href={contact.primaryPhone.href}>
        <Phone size={13} /> {contact.primaryPhone.display}
      </a>
      <span className="topbar-sep" aria-hidden="true">
        ·
      </span>
      <a href={contact.emailHref}>
        <Mail size={13} /> {contact.email}
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
        <BrandMark animated={!reduce} />
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
          <a href={contact.primaryPhone.href} className="phone">
            <Phone size={15} /> {contact.primaryPhone.display}
          </a>
          <AntiMetalButton href="/request-a-nurse" label="Request a Nurse" size="sm" />
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
              {contact.phones.map((p) => (
                <a key={p.href} href={p.href} className="phone">
                  <Phone size={15} /> {p.display}
                </a>
              ))}
              <a href={contact.emailHref} className="phone">
                <Mail size={15} /> {contact.email}
              </a>
              <div className="mobile-drawer-actions">
                <AntiMetalButton
                  href="/request-a-nurse"
                  label="Request a Nurse"
                  size="sm"
                  className="w-full"
                  onClick={() => setOpen(false)}
                />
                <AntiMetalButton
                  href="/request-healthcare-staff"
                  label="Request Staff"
                  size="sm"
                  className="w-full"
                  onClick={() => setOpen(false)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const contact = useSiteContact();
  const { social } = contact;

  return (
    <footer>
      <div className="container">
        <PulseDivider animated className="footer-pulse" />
      </div>
      <div className="container footer-grid">
        <div>
          <BrandMark className="footer-brand" />
          <p className="footer-tagline">Care at the heart of everyday life.</p>
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
          {contact.phones.map((phone) => (
            <a key={phone.href} href={phone.href}>
              <Phone size={15} /> {phone.display}
            </a>
          ))}
          <a href={contact.emailHref}>
            <Mail size={15} /> {contact.email}
          </a>
          <p className="muted small-text">
            {contact.addressLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </p>
          <a href={contact.map.viewUrl} target="_blank" rel="noopener noreferrer">
            <MapPin size={15} /> View on Google Maps
          </a>
          <div className="footer-social">
            {social.instagram ? (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="BHSK on Instagram" title="Instagram">
                <Instagram size={18} aria-hidden="true" />
              </a>
            ) : null}
            {social.facebook ? (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="BHSK on Facebook" title="Facebook">
                <Facebook size={18} aria-hidden="true" />
              </a>
            ) : null}
            {social.linkedin ? (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="BHSK on LinkedIn" title="LinkedIn">
                <Linkedin size={18} aria-hidden="true" />
              </a>
            ) : null}
            {contact.landline ? (
              <a href={contact.landline.href} className="footer-landline" aria-label={`Call our landline ${contact.landline.display}`}>
                <LandlineIcon /> {contact.landline.display}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BHSK for Health Services. All rights reserved.</span>
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
              <AntiMetalButton href={REQUEST_NURSE_PATH} label="Request a Nurse" />
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
              <AntiMetalButton href={REQUEST_STAFF_PATH} label="Request Staff" />
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
          <FitImage
            src="/images/bhsk/nurse-portrait.jpg"
            alt="Nurse in BHSK uniform with a stethoscope"
            className="proof-photo"
          />
        </Reveal>
        <Reveal delay={0.12} className="proof-copy" direction="left" distance={56}>
          <div className="eyebrow">WHY BHSK</div>
          <h2 id="why-heading">Nursing support based in Qatar</h2>
          <p>
            BHSK for Health Services operates from Doha and focuses on professional nursing for facilities and home care.
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
          <AntiMetalButton href="/about-us" label="About BHSK" />
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
          <AntiMetalButton href="/contact-us" label="Contact the team" />
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
      <OfficeMap />
      <Cta69
        badge={{ label: "Next step" }}
        heading="Tell us what nursing support you need."
        button={{ label: "Contact BHSK", href: "/contact-us" }}
        labels={{
          marqueePhrase: "BHSK for Health Services",
          note: "Facility staffing or home care — share your enquiry and we assess fit and availability before confirming.",
          footnote: "Based in Old Airport, Doha. We reply within one business day.",
        }}
      />
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
            <AntiMetalButton href={REQUEST_STAFF_PATH} label="Request Staff" />
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

const LEAD_FORM_SOURCE: Record<string, string> = {
  "request-a-nurse": "Request a Nurse",
  "request-healthcare-staff": "Request Staff",
  "book-consultation": "Book a Consultation",
};

function InnerPage({
  type,
  leadDefault,
}: {
  type: string;
  leadDefault?: "employer" | "patient" | "";
}) {
  const title =
    {
      "about-us": "About BHSK for Health Services",
      "contact-us": "We’re here to help",
      "request-a-nurse": "Request a Nurse",
      "request-healthcare-staff": "Request Staff",
      "book-consultation": "Book a consultation",
    }[type] || "BHSK for Health Services";
  const description =
    type === "about-us"
      ? "BHSK delivers professional nursing across hospitals, clinics, schools, worksites and homes in Qatar."
      : type === "request-a-nurse"
        ? "Tell us about the home care you need. Our team will assess fit and availability before confirming service."
        : type === "request-healthcare-staff"
          ? "Tell us about your facility staffing need. Placement depends on assessment and current availability."
          : type === "book-consultation"
            ? "Share your questions and preferred contact details. We will follow up to discuss next steps."
            : "Share what you need and our team will get back to you shortly.";

  const isLead =
    type === "contact-us" ||
    type === "request-a-nurse" ||
    type === "request-healthcare-staff" ||
    type === "book-consultation";

  const crumbs =
    type === "request-a-nurse" || type === "request-healthcare-staff"
      ? [
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: title },
        ]
      : [{ label: "Home", href: "/" }, { label: title }];

  return (
    <main>
      {type === "request-a-nurse" ? (
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
            BHSK FOR HEALTH SERVICES
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.08}>
            {title}
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.12}>
            {description}
          </Reveal>
          {!isLead && (
            <Reveal direction="left" distance={36} delay={0.2}>
              <AntiMetalButton href="/contact-us" label="Talk to our team" />
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
          source={LEAD_FORM_SOURCE[type] ?? "Contact us"}
        />
      ) : (
        <GeneralContent type={type} />
      )}
      {type === "contact-us" ? <OfficeMap /> : null}
    </main>
  );
}

function GeneralContent({ type }: { type?: string }) {
  return (
    <section className="section">
      <div className="container content-grid">
        <Reveal direction="left" distance={56}>
          <div className="eyebrow">CARE IN QATAR</div>
          <h2>{type === "about-us" ? "About BHSK for Health Services" : "Healthcare that starts with listening"}</h2>
          <p>
            BHSK for Health Services is based in Doha. We coordinate nursing for facilities and specialised home care
            for families. Claims about licences, partners or volumes appear on this site only when approved by BHSK.
          </p>
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
          <AntiMetalButton href="/services" label="Explore our services" className="mt-6" />
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
  source,
}: {
  defaultType?: "employer" | "patient" | "";
  lockType?: boolean;
  source: string;
}) {
  const query = useContactQuery();
  const contact = useSiteContact();
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

  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const field = (key: string) => String(data.get(key) ?? "").trim();
    const type = field("enquiryType");

    setSaveStatus("saving");
    submitEnquiry({
      name: field("name"),
      phone: field("phone"),
      org: field("org"),
      enquiryType: type === "patient" || type === "employer" ? type : "",
      service: field("service"),
      message: field("message"),
      source,
    })
      .then(() => setSaveStatus("saved"))
      .catch((error) => {
        console.warn("[enquiry] backend submit failed; WhatsApp remains the delivery channel", error);
        setSaveStatus("failed");
      });

    const typeLabel =
      type === "employer"
        ? "Employer / facility staffing"
        : type === "patient"
          ? "Patient / family home care"
          : type || "Not specified";

    const text = [
      `*New enquiry — ${source}*`,
      "",
      `*Name:* ${field("name") || "—"}`,
      `*Phone:* ${field("phone") || "—"}`,
      `*Organisation / city:* ${field("org") || "—"}`,
      `*Enquiry type:* ${typeLabel}`,
      `*Service:* ${field("service") || "—"}`,
      "",
      "*Message:*",
      field("message") || "—",
    ].join("\n");

    const url = `${contact.whatsapp.href}?text=${encodeURIComponent(text)}`;
    // Not using the "noopener" feature: it makes window.open return null, which would hide a blocked popup.
    const whatsappWindow = window.open(url, "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    else window.location.href = url;
    setWhatsappOpened(true);
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
              {contact.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
          <div className="contact-detail">
            <Phone />
            <div>
              <b>Contact</b>
              <span>
                {contact.phones.map((phone, index) => (
                  <Fragment key={phone.href}>
                    {index > 0 ? " / " : null}
                    <a href={phone.href}>{phone.display}</a>
                  </Fragment>
                ))}
              </span>
            </div>
          </div>
          <div className="contact-detail">
            <Mail />
            <div>
              <b>
                <a href={contact.emailHref}>{contact.email}</a>
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
              Submitting opens WhatsApp with your details filled in — just press Send. Placement depends on clinical
              fit and availability — our team confirms after review.
            </p>
            <AntiMetalButton type="submit" label="Submit enquiry" />
            {whatsappOpened ? (
              <p className="contact-form__status" role="status">
                <WhatsAppIcon className="contact-form__status-icon" />
                {saveStatus === "saved" ? (
                  <span>
                    Thank you — your enquiry has reached our team and we will be in touch. WhatsApp has also opened with
                    your details; press <b>Send</b> there for a faster reply.
                  </span>
                ) : (
                  <span>
                    WhatsApp has opened with your enquiry. Press <b>Send</b> there to deliver it to BHSK. Didn’t open?{" "}
                    <a href={contact.whatsapp.href} target="_blank" rel="noopener noreferrer">
                      Message us on WhatsApp
                    </a>
                    .
                  </span>
                )}
              </p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function SlugPage({ slug }: { slug: string }) {
  if (servicePageBySlug(slug)) return <ServicePageBySlug slug={slug} />;
  return <InnerPage type={slug} />;
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
          transition={{ duration: 0.45, ease: easeOut }}
        >
          <RouteScroll />
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
                  <ServicePageBySlug slug={s.slug} />
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
      <FloatingContactWidget />
      <BackToTop />
      <ScrollToTop />
    </>
  );
}

/** Last scroll position per path, so Back / Forward return the reader to where they were. */
const savedScroll = new Map<string, number>();
let navigatedByHistory = false;

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => {
    navigatedByHistory = true;
  });
}

function hashTarget() {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  return hash ? document.getElementById(hash) : null;
}

/**
 * Rendered inside each page, so it runs once the new page is in the DOM — i.e. after the
 * previous page's exit animation. Scrolling earlier gets cut short when the old page unmounts.
 * "instant" is required: html has scroll-behavior: smooth, which "auto" would inherit.
 */
function RouteScroll() {
  useLayoutEffect(() => {
    const target = hashTarget();
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    else {
      const top = navigatedByHistory ? (savedScroll.get(window.location.pathname) ?? 0) : 0;
      window.scrollTo({ top, behavior: "instant" });
    }
    navigatedByHistory = false;
  }, []);
  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const record = () => {
      frame = 0;
      savedScroll.set(window.location.pathname, window.scrollY);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(record);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Links to the page you're already on don't change the route, so handle them here:
  // same-page section links scroll to the section, plain links scroll back to the top.
  // Capture phase: wouter updates the URL in its own click handler, before bubbling reaches us.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const behavior: ScrollBehavior = reduce ? "instant" : "smooth";
      window.setTimeout(() => {
        const target = url.hash ? hashTarget() : null;
        if (target) target.scrollIntoView({ behavior, block: "start" });
        else if (!url.hash) window.scrollTo({ top: 0, behavior });
      }, 0);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduce]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void import("@/lib/gsap").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 120);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

export default App;
