import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Facebook,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  easeOut,
  pageTransition,
} from "@/lib/motion";

const services = [
  { slug: "trained-attendants", name: "Trained Attendants", icon: UserRound, text: "Compassionate day-to-day support for patients and families." },
  { slug: "nursing", name: "Nursing Care", icon: HeartPulse, text: "Certified nurses for skilled care, recovery and chronic needs." },
  { slug: "physiotherapy", name: "Physiotherapy", icon: Stethoscope, text: "Personalised rehabilitation plans delivered at home." },
  { slug: "medical-equipment", name: "Medical Equipment", icon: ShieldCheck, text: "Reliable equipment rentals with doorstep delivery." },
  { slug: "critical-care", name: "Critical Care", icon: HeartPulse, text: "Hospital-grade ICU support for complex care at home." },
  { slug: "mother-baby-care", name: "Mother & Baby Care", icon: UserRound, text: "Gentle, expert support for new mothers and newborns." },
  { slug: "elder-care", name: "Elder Care", icon: HeartPulse, text: "Respectful companionship and health support for seniors." },
  { slug: "doctor-consultation", name: "Doctor Consultation", icon: Stethoscope, text: "Experienced doctors who come to your doorstep." },
];

const articles = [
  ["Elder Care", "Different Types of Elder Care Services", "Practical guidance to help your loved ones live with comfort and confidence."],
  ["Physiotherapy", "How physiotherapy at home supports faster recovery", "Simple ways a consistent plan can bring mobility back into everyday life."],
  ["Critical Care", "When hospital-level care comes home", "What families should know about building a safe, supportive care environment."],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>India’s trusted home healthcare provider</span>
          <span className="topbar-right">
            <Clock3 size={13} /> Available 8am–8pm, Monday to Sunday
          </span>
        </div>
      </div>
      <nav className="nav container">
        <Link href="/" className="brand">
          <span className="brand-mark">P</span>
          <span>
            <b>PORTEA</b>
            <small>HEAL AT HOME</small>
          </span>
        </Link>
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div className="nav-links">
          <div className="nav-dropdown">
            <span>
              Our Services <ChevronDown size={14} />
            </span>
            <div className="dropdown-menu">
              {services.slice(0, 6).map((s) => (
                <Link key={s.slug} href={`/${s.slug}`}>
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <Link className={location === "/about-us" ? "active" : ""} href="/about-us">
            About Us
          </Link>
          <Link className={location === "/blogs" || location.startsWith("/blog/") ? "active" : ""} href="/blogs">
            Blogs
          </Link>
          <a href="tel:18001212323" className="phone">
            <Phone size={15} /> 1800 121 2323
          </a>
          <Link href="/contact-us" className="btn btn-primary small">
            Book Now
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
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <div className="mobile-drawer-inner">
              {services.slice(0, 6).map((s, i) => (
                <motion.div
                  key={s.slug}
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.28, ease: easeOut }}
                >
                  <Link href={`/${s.slug}`} onClick={() => setOpen(false)}>
                    {s.name}
                  </Link>
                </motion.div>
              ))}
              <Link href="/about-us" onClick={() => setOpen(false)}>
                About Us
              </Link>
              <Link href="/blogs" onClick={() => setOpen(false)}>
                Blogs
              </Link>
              <a href="tel:18001212323" className="phone">
                <Phone size={15} /> 1800 121 2323
              </a>
              <Link href="/contact-us" className="btn btn-primary small" onClick={() => setOpen(false)}>
                Book Now
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
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">P</span>
            <span>
              <b>PORTEA</b>
              <small>HEAL AT HOME</small>
            </span>
          </Link>
          <p className="muted">Quality medical care, brought to the comfort of your home.</p>
          <div className="socials">
            <Facebook size={17} />
            <Instagram size={17} />
            <Linkedin size={17} />
          </div>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/about-us">About us</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact-us">Contact us</Link>
          <Link href="/partner-with-us">Partner with us</Link>
        </div>
        <div>
          <h4>Popular services</h4>
          <Link href="/nursing">Nursing at home</Link>
          <Link href="/physiotherapy">Physiotherapy</Link>
          <Link href="/doctor-consultation">Doctor consultations</Link>
          <Link href="/medical-equipment">Medical equipment</Link>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href="tel:18001212323">
            <Phone size={15} /> 1800 121 2323
          </a>
          <a href="mailto:bookings@portea.com">
            <Mail size={15} /> bookings@portea.com
          </a>
          <p className="muted small-text">Mon–Sun · 8am–8pm</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Portea Medical. All rights reserved.</span>
        <span>Privacy policy &nbsp; Terms of use</span>
      </div>
    </footer>
  );
}

function BookingCard() {
  return (
    <motion.div
      className="booking-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: easeOut }}
      whileHover={{ y: -2, boxShadow: "0 16px 36px #102f2d18" }}
    >
      <div>
        <label>What care do you need?</label>
        <select defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((s) => (
            <option key={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>
      <Link href="/contact-us" className="btn btn-primary">
        Book Now <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            INDIA’S HOME HEALTHCARE PIONEERS · SINCE 2013
          </motion.div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: easeOut }}
          >
            Quality medical care in the <em>comfort of your home</em>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: easeOut }}
          >
            Doctors, nurses, physiotherapists and trained attendants — compassionate, expert care delivered to your
            doorstep.
          </motion.p>
          <BookingCard />
          <motion.div
            className="trust-row"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: easeOut }}
          >
            <div>
              <b>20 Lakh+</b>
              <span>patients served</span>
            </div>
            <div>
              <b>135</b>
              <span>cities across India</span>
            </div>
            <div>
              <b>100+</b>
              <span>hospital partners</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="hero-image"
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.7, ease: easeOut }}
        >
          <div className="image-wash" />
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85"
            alt="Home healthcare professional"
          />
          <motion.div
            className="hero-badge badge-one"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: easeOut }}
          >
            <b>20 Lakh+</b>
            <span>patients served</span>
          </motion.div>
          <motion.div
            className="hero-badge badge-two"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.58, duration: 0.5, ease: easeOut }}
          >
            <b>100+</b>
            <span>hospital partners</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section services-section">
      <div className="container">
        <Reveal className="section-heading">
          <div className="eyebrow">WHAT WE DO</div>
          <h2>Medical services offered at home</h2>
          <p>Portea Medical offers a variety of healthcare services in the comfort of our patient’s homes.</p>
        </Reveal>
        <Stagger className="service-grid">
          {services.map((s) => (
            <StaggerItem key={s.slug}>
              <Link href={`/${s.slug}`} className="service-card">
                <div className="service-icon">
                  <s.icon size={22} />
                </div>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                </div>
                <ArrowRight size={19} className="card-arrow" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="center" delay={0.15}>
          <Link href="/services" className="text-link">
            View all services <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="proof section">
      <div className="container proof-grid">
        <Reveal>
          <div className="proof-photo">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85"
              alt="Care team supporting a patient"
            />
            <motion.div
              className="photo-note"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.45, ease: easeOut }}
            >
              <Star fill="currentColor" size={15} /> Rated 4.8 by families
            </motion.div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="proof-copy">
          <div className="eyebrow">WHY PORTEA</div>
          <h2>Care that feels personal, because it is.</h2>
          <p>
            From the first conversation to every follow-up, our care teams work around your family’s needs. We bring
            clinical excellence, warmth and accountability to every home visit.
          </p>
          <div className="check-list">
            <div>
              <Check /> Background-verified professionals
            </div>
            <div>
              <Check /> Personalised care plans
            </div>
            <div>
              <Check /> Dedicated care coordinators
            </div>
          </div>
          <Link href="/about-us" className="btn btn-outline">
            Know more <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="quote-section">
      <Reveal className="container quote-inner">
        <div className="eyebrow">FAMILIES SPEAK</div>
        <div className="quote-mark">“</div>
        <blockquote>
          The inputs shared were very useful in helping me manage by diabetes better. The explanation was excellent and
          the care team was patient, reassuring and thorough.
        </blockquote>
        <div className="quote-author">
          <div className="avatar">RS</div>
          <div>
            <b>Ramesh S.</b>
            <span>Family member · Bengaluru</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Articles() {
  return (
    <section className="section articles">
      <div className="container">
        <Reveal className="section-heading split">
          <div>
            <div className="eyebrow">FROM THE JOURNAL</div>
            <h2>Small steps. Better health.</h2>
          </div>
          <Link href="/blogs" className="text-link">
            Read all stories <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Stagger className="article-grid">
          {articles.map((a, i) => (
            <StaggerItem key={a[1]}>
              <Link href={`/blog/${i + 1}`} className="article-card">
                <div className={`article-img image-${i}`} />
                <div className="article-body">
                  <span>{a[0]}</span>
                  <h3>{a[1]}</h3>
                  <p>{a[2]}</p>
                  <b>
                    Read more <ArrowRight size={15} />
                  </b>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <Reveal className="container cta-inner">
        <div>
          <div className="eyebrow">NEED CARE AT HOME?</div>
          <h2>Let’s make care feel closer.</h2>
          <p>Speak to our care team and find the right support for your family.</p>
        </div>
        <Link href="/contact-us" className="btn btn-light">
          Book an appointment <ArrowRight size={17} />
        </Link>
      </Reveal>
    </section>
  );
}

function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Proof />
      <Testimonial />
      <Articles />
      <CtaBand />
    </main>
  );
}

function InnerPage({ type, slug }: { type: string; slug?: string }) {
  const service = services.find((s) => s.slug === slug);
  const title =
    service?.name ||
    ({
      "about-us": "About Portea",
      "contact-us": "We’re here to help",
      careers: "Build a career that cares",
      blogs: "The Portea journal",
      services: "Care designed around you",
    }[type] ||
      "Portea Medical");
  const description =
    service?.text ||
    (type === "about-us"
      ? "India’s home healthcare pioneers. Quality medical care, brought to the comfort of your home."
      : type === "careers"
        ? "Join a team that is changing the way India experiences healthcare."
        : type === "blogs"
          ? "Thoughtful advice, expert perspectives and stories from the world of home healthcare."
          : "Tell us what you need and our care team will get back to you shortly.");

  return (
    <main>
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            PORTEA MEDICAL
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: easeOut }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45, ease: easeOut }}
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
            {type === "contact-us" ? (
              <BookingCard />
            ) : (
              <Link href="/contact-us" className="btn btn-primary">
                Talk to our care team <ArrowRight size={16} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
      {type === "blogs" ? <BlogListing /> : type === "contact-us" ? <ContactContent /> : <GeneralContent service={service} />}
    </main>
  );
}

function GeneralContent({ service }: { service?: (typeof services)[number] }) {
  return (
    <section className="section">
      <div className="container content-grid">
        <Reveal>
          <div className="eyebrow">CARE, ON YOUR TERMS</div>
          <h2>{service ? `Trusted ${service.name.toLowerCase()} at home` : "Healthcare that starts with listening"}</h2>
          <p>
            We believe the best care is care that fits into real life. Our experienced professionals work with you, your
            doctor and your family to create a plan that feels clear, practical and reassuring.
          </p>
          <p>
            With trained teams, thoughtful coordination and reliable follow-through, Portea brings the confidence of
            clinical care to your living room.
          </p>
          <div className="check-list">
            <div>
              <Check /> Verified professionals
            </div>
            <div>
              <Check /> Flexible visit plans
            </div>
            <div>
              <Check /> Support when you need it
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="content-panel">
          <h3>How it works</h3>
          <div className="step">
            <b>01</b>
            <span>
              <strong>Tell us what you need</strong>
              <small>Call or book an appointment online.</small>
            </span>
          </div>
          <div className="step">
            <b>02</b>
            <span>
              <strong>Meet your care team</strong>
              <small>We match you with the right professional.</small>
            </span>
          </div>
          <div className="step">
            <b>03</b>
            <span>
              <strong>Feel supported at home</strong>
              <small>Care plans that evolve with you.</small>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BlogListing() {
  return (
    <section className="section">
      <div className="container">
        <Stagger className="blog-list">
          {[...articles, ...articles].map((a, i) => (
            <StaggerItem key={i}>
              <Link href={`/blog/${i + 1}`} className="blog-row">
                <div className={`article-img image-${i % 3}`} />
                <div>
                  <span>
                    {a[0]} · September 2026
                  </span>
                  <h3>{a[1]}</h3>
                  <p>{a[2]}</p>
                  <b>
                    Read story <ArrowRight size={15} />
                  </b>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ContactContent() {
  return (
    <section className="section">
      <div className="container contact-grid">
        <Reveal>
          <div className="eyebrow">CONTACT PORTEA</div>
          <h2>Let’s talk about the right care for you.</h2>
          <p>
            Our care coordinators are available to answer questions, understand your needs and help you take the next
            step.
          </p>
          <div className="contact-detail">
            <Phone />
            <div>
              <b>1800 121 2323</b>
              <span>Call us 8am–8pm</span>
            </div>
          </div>
          <div className="contact-detail">
            <Mail />
            <div>
              <b>bookings@portea.com</b>
              <span>We reply within one business day</span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <h3>Request a callback</h3>
            <input placeholder="Your name" />
            <input placeholder="Phone number" />
            <input placeholder="City" />
            <textarea placeholder="Tell us how we can help" rows={4} />
            <button className="btn btn-primary" type="submit">
              Submit request <ArrowRight size={16} />
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

function CityServicePage({ service, city }: { service: string; city: string }) {
  const serviceName =
    services.find((s) => s.slug === service)?.name ||
    service
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const cityName = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main>
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            PORTEA MEDICAL · {cityName.toUpperCase()}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: easeOut }}
          >
            {serviceName} at home in {cityName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45, ease: easeOut }}
          >
            Trusted, compassionate healthcare from trained professionals, delivered to your doorstep in {cityName}.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
            <Link href="/contact-us" className="btn btn-primary">
              Book a visit <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
      <GeneralContent service={services.find((s) => s.slug === service)} />
    </main>
  );
}

function BlogDetail({ id }: { id: string }) {
  const article = articles[(Number(id) - 1) % articles.length];
  return (
    <main>
      <section className="inner-hero">
        <div className="container inner-hero-inner">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            {article[0].toUpperCase()} · PORTEA JOURNAL
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.5, ease: easeOut }}
          >
            {article[1]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.45, ease: easeOut }}
          >
            {article[2]}
          </motion.p>
        </div>
      </section>
      <section className="section">
        <div className="container content-grid">
          <Reveal>
            <p>
              Good healthcare begins with information you can trust. In this guide, our care teams share practical ideas
              that help families make confident decisions, one small step at a time.
            </p>
            <p>
              Every person and every home is different. That is why the right plan is one that brings together clinical
              expertise, clear communication and the routines that matter most to you.
            </p>
            <h2>Care that fits real life</h2>
            <p>
              Our professionals meet families where they are, listen carefully and follow through. If you have questions
              about home healthcare, our coordinators are here to help.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="content-panel">
            <div className="eyebrow">NEED SUPPORT?</div>
            <h3>Talk to our care team</h3>
            <p className="muted">Get clear answers and find the right service for your family.</p>
            <Link href="/contact-us" className="btn btn-primary">
              Contact us <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
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
          transition={{ duration: 0.38, ease: easeOut }}
        >
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/blogs">
              <InnerPage type="blogs" />
            </Route>
            <Route path="/blog/:id">{(params) => <BlogDetail id={params.id} />}</Route>
            <Route path="/about-us">
              <InnerPage type="about-us" />
            </Route>
            <Route path="/contact-us">
              <InnerPage type="contact-us" />
            </Route>
            <Route path="/careers">
              <InnerPage type="careers" />
            </Route>
            <Route path="/services">
              <InnerPage type="services" />
            </Route>
            <Route path="/partner-with-us">
              <InnerPage type="partner-with-us" />
            </Route>
            <Route path="/faqs">
              <InnerPage type="faqs" />
            </Route>
            <Route path="/testimonials">
              <InnerPage type="testimonials" />
            </Route>
            {services.map((s) => (
              <Route key={s.slug} path={`/${s.slug}`}>
                <InnerPage type={s.slug} slug={s.slug} />
              </Route>
            ))}
            <Route path="/:service/:city">
              {(params) => <CityServicePage service={params.service} city={params.city} />}
            </Route>
            <Route path="/:slug">{(params) => <SlugPage slug={params.slug} />}</Route>
            <Route>
              <InnerPage type="about-us" />
            </Route>
          </Switch>
        </motion.div>
      </AnimatePresence>
      <Footer />
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

  return null;
}

export default App;
