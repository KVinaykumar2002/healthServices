import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, Route, Switch, useLocation, useSearchParams } from "wouter";
import { ArrowRight, Check, ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Reveal, easeOut, pageTransition } from "@/lib/motion";
import { submitEnquiry } from "@/lib/api";
import { CareServicesMenu } from "@/components/CareServicesMenu";
import { HealthcareTrustStats } from "@/components/HealthcareTrustStats";
import { HeroBand } from "@/components/HeroBand";
import { HospitalPartners } from "@/components/HospitalPartners";
import { LabTestsSection } from "@/components/LabTestsSection";
import { NewOffers } from "@/components/NewOffers";
import { QatarHealthcareHero } from "@/components/QatarHealthcareHero";
import { ServiceGrid } from "@/components/ServiceGrid";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const CONTACT_EMAIL = "Info@bhsknursingservices.com";
const CONTACT_PHONES = [
  { display: "31599965", href: "tel:+97431599965" },
  { display: "55348635", href: "tel:+97455348635" },
] as const;
const OFFICE_ADDRESS = {
  lines: [
    "Building No. 212, Street 310, Zone 45",
    "Office No. 551, Floor 01",
    "Old Airport, Doha, Qatar",
  ],
} as const;

const services = [
  {
    slug: "hospitals",
    name: "Nursing Services for Hospitals",
    text: "Skilled nursing support that integrates with hospital wards and clinical teams.",
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "medical-centres",
    name: "Nursing Services for Medical Centres",
    text: "Reliable clinic and outpatient nursing for busy medical centres.",
    imageUrl:
      "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "schools-nurseries",
    name: "Nursing Services for Schools / Nurseries",
    text: "On-site school and nursery nurses for first aid, wellness and parent peace of mind.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "camp-construction",
    name: "Nursing Services for Camp or Construction Site",
    text: "Occupational health nursing for remote camps and active construction sites.",
    imageUrl:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "maternity-newborn",
    name: "Maternity and Newborn Care",
    text: "Gentle, expert support for mothers and newborns through the early weeks.",
    imageUrl:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "elderly-care",
    name: "Elderly Care",
    text: "Respectful companionship and clinical support that helps seniors stay comfortable.",
    imageUrl:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "baby-care",
    name: "Baby Care",
    text: "Attentive infant care from trained nurses who understand every stage of early life.",
    imageUrl:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "palliative-care",
    name: "Palliative Care",
    text: "Compassionate symptom relief and dignity-focused support for serious illness.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "chronic-care",
    name: "Chronic Patient Care",
    text: "Ongoing nursing plans for long-term conditions, monitoring and daily management.",
    imageUrl:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "post-operative",
    name: "Post-operative Care",
    text: "Safe recovery support after surgery — wound care, medication and mobility.",
    imageUrl:
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "physiotherapy",
    name: "Physiotherapy",
    text: "Personalised rehabilitation to restore strength, movement and independence.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
  },
] as const;

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`brand ${className}`}>
      <img src="/image.png" alt="BHSK for Health Services" className="brand-logo" />
      <span>
        <b>BHSK</b>
        <small>FOR HEALTH SERVICES</small>
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
      <span>Professional nursing care · Hospitals, clinics &amp; home</span>
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
          <Link className={location === "/about-us" ? "active" : ""} href="/about-us">
            About Us
          </Link>
          <Link className={location === "/contact-us" ? "active" : ""} href="/contact-us">
            Contact
          </Link>
          <a href={CONTACT_PHONES[0].href} className="phone">
            <Phone size={15} /> {CONTACT_PHONES[0].display}
          </a>
          <Link href="/contact-us" className="btn btn-primary small">
            Book Care
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
              <Link href="/contact-us" className="btn btn-primary small" onClick={() => setOpen(false)}>
                Book Care
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
            Trusted nursing professionals for hospitals, medical centres, schools, worksites and home care.
          </p>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about-us">About us</Link>
          <Link href="/services">Services</Link>
          <Link href="/contact-us">Contact us</Link>
        </div>
        <div>
          <h4>Care areas</h4>
          <Link href="/elderly-care">Elderly care</Link>
          <Link href="/maternity-newborn">Maternity &amp; newborn</Link>
          <Link href="/physiotherapy">Physiotherapy</Link>
          <Link href="/palliative-care">Palliative care</Link>
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
        <span>© {new Date().getFullYear()} BHSK for Health Services. All rights reserved.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

function Proof() {
  return (
    <section className="proof section">
      <div className="container proof-grid">
        <Reveal direction="left" distance={80}>
          <div className="proof-photo">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
              alt="Nurse providing patient care"
            />
          </div>
        </Reveal>
        <Reveal delay={0.12} className="proof-copy" direction="left" distance={56}>
          <div className="eyebrow">WHY BHSK</div>
          <h2>Nursing that meets people where they are.</h2>
          <p>
            From hospital wards to school clinics and home recovery, our nurses bring clinical skill, calm presence and
            clear communication to every assignment.
          </p>
          <div className="check-list">
            <div>
              <Check /> Background-verified nurses
            </div>
            <div>
              <Check /> Flexible staffing for facilities &amp; families
            </div>
            <div>
              <Check /> Continuity of care you can rely on
            </div>
          </div>
          <Link href="/about-us" className="btn btn-outline">
            About BHSK <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <Reveal className="container cta-inner" direction="left" distance={64}>
        <div>
          <div className="eyebrow">NEED NURSING SUPPORT?</div>
          <h2>Tell us what care you need.</h2>
          <p>Email our team and we’ll help match the right nursing service.</p>
        </div>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-light">
          {CONTACT_EMAIL} <ArrowRight size={17} />
        </a>
      </Reveal>
    </section>
  );
}

function Home() {
  return (
    <main>
      <HeroBand />
      <QatarHealthcareHero />
      <ServiceGrid
        title="Nursing services built around real needs"
        subtitle="From facility staffing to specialised home care — choose the support that fits."
        services={[...services]}
      />
      <NewOffers />
      <LabTestsSection />
      <HealthcareTrustStats />
      <HospitalPartners />
      <Proof />
      <CtaBand />
    </main>
  );
}

function InnerPage({ type, slug }: { type: string; slug?: string }) {
  const service = services.find((s) => s.slug === slug);
  const title =
    service?.name ||
    ({
      "about-us": "About BHSK for Health Services",
      "contact-us": "We’re here to help",
      services: "Our nursing services",
    }[type] ||
      "BHSK for Health Services");
  const description =
    service?.text ||
    (type === "about-us"
      ? "BHSK delivers professional nursing across hospitals, clinics, schools, worksites and homes."
      : type === "services"
        ? "Browse our full range of nursing and care services."
        : "Share what you need and our team will get back to you shortly.");

  return (
    <main>
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <Reveal className="eyebrow" direction="left" distance={40}>
            BHSK FOR HEALTH SERVICES
          </Reveal>
          <Reveal as="h1" direction="left" distance={56} delay={0.06}>
            {title}
          </Reveal>
          <Reveal as="p" direction="left" distance={40} delay={0.12}>
            {description}
          </Reveal>
          <Reveal direction="left" distance={36} delay={0.2}>
            {type === "contact-us" ? (
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
                Email us <ArrowRight size={16} />
              </a>
            ) : (
              <Link href="/contact-us" className="btn btn-primary">
                Talk to our team <ArrowRight size={16} />
              </Link>
            )}
          </Reveal>
        </div>
      </section>
      {type === "contact-us" ? (
        <ContactContent />
      ) : type === "services" ? (
        <ServiceGrid
          title="All services"
          subtitle="Select a service to learn more."
          services={[...services]}
        />
      ) : (
        <GeneralContent service={service} />
      )}
    </main>
  );
}

function GeneralContent({ service }: { service?: (typeof services)[number] }) {
  return (
    <section className="section">
      <div className="container content-grid">
        <Reveal direction="left" distance={56}>
          <div className="eyebrow">CARE, DELIVERED WELL</div>
          <h2>{service ? service.name : "Healthcare that starts with listening"}</h2>
          <p>
            {service
              ? service.text
              : "We believe the best care fits real life. Our nurses work with facilities, families and clinicians to create clear, practical plans."}
          </p>
          {service ? (
            <div className="content-service-image">
              <img src={service.imageUrl} alt={service.name} />
            </div>
          ) : null}
          <div className="check-list">
            <div>
              <Check /> Verified professionals
            </div>
            <div>
              <Check /> Flexible coverage plans
            </div>
            <div>
              <Check /> Responsive coordination
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="content-panel" direction="right" distance={48}>
          <h3>How it works</h3>
          <div className="step">
            <b>01</b>
            <span>
              <strong>Tell us what you need</strong>
              <small>Email us or use the contact form.</small>
            </span>
          </div>
          <div className="step">
            <b>02</b>
            <span>
              <strong>Meet your care match</strong>
              <small>We align the right nursing skill set.</small>
            </span>
          </div>
          <div className="step">
            <b>03</b>
            <span>
              <strong>Receive dependable support</strong>
              <small>Care that stays consistent over time.</small>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactContent() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service") ?? "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [service, setService] = useState(preselectedService);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedService) setService(preselectedService);
  }, [preselectedService]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await submitEnquiry({
        name,
        phone,
        org,
        service,
        message,
        source: "contact",
      });
      setStatus("success");
      setName("");
      setPhone("");
      setOrg("");
      setService("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to submit enquiry");
    }
  }

  return (
    <section className="section">
      <div className="container contact-grid">
        <Reveal direction="left" distance={56}>
          <div className="eyebrow">CONTACT BHSK</div>
          <h2>Let’s talk about the right nursing support.</h2>
          <p>
            Whether you need facility staffing or specialised home care, our team is ready to help you take the next
            step.
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
              <span>We reply within one business day</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} direction="right" distance={48}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send an enquiry</h3>
            <input
              placeholder="Your name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Phone number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              placeholder="Organisation / city"
              name="org"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
            <select name="service" value={service} onChange={(e) => setService(e.target.value)} required>
              <option value="" disabled>
                Select a service
              </option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="Lab Tests At Home">Lab Tests At Home</option>
              {service &&
              !services.some((s) => s.name === service) &&
              service !== "Lab Tests At Home" ? (
                <option value={service}>{service}</option>
              ) : null}
            </select>
            <textarea
              placeholder="Tell us how we can help"
              rows={4}
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-primary" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Submit enquiry"} <ArrowRight size={16} />
            </button>
            {status === "success" ? (
              <p className="form-feedback is-success" role="status">
                Thank you — we received your enquiry and will get back to you shortly.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="form-feedback is-error" role="alert">
                {error}. You can also email us at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            ) : null}
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
              <InnerPage type="services" />
            </Route>
            {services.map((s) => (
              <Route key={s.slug} path={`/${s.slug}`}>
                <InnerPage type={s.slug} slug={s.slug} />
              </Route>
            ))}
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
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [location, reduce]);

  useEffect(() => {
    // Refresh scroll triggers after route/layout changes
    const id = window.setTimeout(() => {
      void import("@/lib/gsap").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 120);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

export default App;
