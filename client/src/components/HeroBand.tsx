import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Phone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, gsapEase, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Parallax, RevealText } from "@/lib/motion";

const careOptions = [
  "Hospital Nursing",
  "Medical Centre Nursing",
  "School / Nursery Nursing",
  "Camp / Construction Nursing",
  "Maternity & Newborn Care",
  "Elderly Care",
  "Baby Care",
  "Palliative Care",
  "Chronic Patient Care",
  "Post-operative Care",
  "Physiotherapy",
] as const;

const trustStats = [
  { value: "100+", label: "Hospital partners", position: "stat-one" },
  { value: "20 Lakh+", label: "Patients served", position: "stat-two" },
  { value: "Doha", label: "Based in Qatar", position: "stat-three" },
] as const;

const heroSlides = [
  {
    src: "https://www.portea.com/static/1d797843c1755a3f758f270bd1ca6b2d/83638/hero-alt-2.jpg",
    mobileSrc:
      "https://www.portea.com/static/414b3beb50a8e43550ca4bee31f40f68/f1b62/hero-alt-2-mobile.jpg",
    alt: "Healthcare professional caring for a patient at home",
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85",
    alt: "Nursing professionals in a clinical setting",
  },
  {
    src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=85",
    alt: "Nurse providing compassionate patient care",
  },
  {
    src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=85",
    alt: "Elder care support at home",
  },
] as const;

const CONTACT_PHONE = { display: "31599965", href: "tel:+97431599965" } as const;

export function HeroBand() {
  const [, setLocation] = useLocation();
  const reduce = prefersReducedMotion();
  const [selectedCare, setSelectedCare] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [slide, setSlide] = useState(0);
  const rootRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduce, slide]);

  useGSAP(
    () => {
      if (!rootRef.current || prefersReducedMotion()) return;

      const content = contentRef.current;
      if (content) {
        const items = content.querySelectorAll("[data-hero-animate]");
        gsap.fromTo(
          items,
          { opacity: 0, x: -64 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.12,
            ease: gsapEase,
            delay: 0.1,
          },
        );
      }

      const stats = rootRef.current.querySelectorAll(".home-hero__stat");
      if (stats.length) {
        gsap.fromTo(
          stats,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.1,
            delay: 0.55,
            ease: gsapEase,
          },
        );
      }
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!slideRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        slideRef.current,
        { opacity: 0, scale: 1.06, x: 40 },
        { opacity: 1, scale: 1, x: 0, duration: 1.1, ease: gsapEase },
      );
    },
    { dependencies: [slide] },
  );

  function goTo(index: number) {
    setSlide((index + heroSlides.length) % heroSlides.length);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!selectedCare) return;
    const params = new URLSearchParams({ service: selectedCare });
    setLocation(`/contact-us?${params.toString()}`);
  }

  const active = heroSlides[slide];

  return (
    <section ref={rootRef} className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__container">
        <div className="home-hero__content" ref={contentRef}>
          <p className="home-hero__brand" data-hero-animate>
            BHSK Nursing Services
          </p>
          <p className="home-hero__eyebrow" data-hero-animate>
            Professional nursing care · Hospitals, clinics &amp; home
          </p>
          <h1 id="home-hero-title" data-hero-animate>
            <RevealText>Quality Medical Care in the</RevealText>{" "}
            <span className="home-hero__accent">
              <span>Comfort of Your Home</span>
              <svg viewBox="0 0 240 12" aria-hidden="true" preserveAspectRatio="none">
                <path d="M4 8.5C60 3.5 150 3 236 6.5" />
              </svg>
            </span>
          </h1>
          <p className="home-hero__description" data-hero-animate>
            Doctors, nurses, physiotherapists and trained attendants — compassionate, expert care
            delivered where you need it.
          </p>
          <div className="home-hero__actions" data-hero-animate>
            <form className="home-hero__booking" onSubmit={handleSubmit}>
              <label className="home-hero__select-wrap">
                <span className="sr-only">Choose a service</span>
                <select
                  aria-label="Choose a service"
                  value={selectedCare}
                  onChange={(event) => {
                    setSelectedCare(event.target.value);
                    setSubmitted(false);
                  }}
                >
                  <option value="">What care do you need?</option>
                  {careOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Book Now</button>
            </form>
            <a className="home-hero__call" href={CONTACT_PHONE.href} aria-label={`Call BHSK at ${CONTACT_PHONE.display}`}>
              <Phone size={15} strokeWidth={2.5} aria-hidden="true" />
              <span>{CONTACT_PHONE.display}</span>
            </a>
          </div>
          <p className={`home-hero__feedback${submitted ? " is-visible" : ""}`} role="status">
            {selectedCare
              ? `We’ll help arrange ${selectedCare.toLowerCase()} for you.`
              : "Please choose a care service to continue."}
          </p>
        </div>

        <div className="home-hero__media">
          <div className="home-hero__image-wrap" aria-live="polite">
            <div ref={slideRef} className="home-hero__slide" key={active.src}>
              <Parallax speed={56} className="home-hero__parallax">
                <picture>
                  {"mobileSrc" in active && active.mobileSrc ? (
                    <source media="(max-width: 991px)" srcSet={active.mobileSrc} />
                  ) : null}
                  <img src={active.src} alt={active.alt} />
                </picture>
              </Parallax>
            </div>
          </div>

          <ul className="home-hero__stats" aria-label="BHSK impact">
            {trustStats.map((stat) => (
              <li className={`home-hero__stat ${stat.position}`} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </li>
            ))}
          </ul>

          <div className="home-hero__carousel-controls">
            <button
              type="button"
              className="home-hero__nav"
              onClick={() => goTo(slide - 1)}
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="home-hero__dots" role="tablist" aria-label="Hero slides">
              {heroSlides.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  role="tab"
                  aria-selected={index === slide}
                  aria-label={`Show slide ${index + 1}`}
                  className={`home-hero__dot${index === slide ? " is-active" : ""}`}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="home-hero__nav"
              onClick={() => goTo(slide + 1)}
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link href="/services" className="home-hero__media-mark" aria-label="Explore services">
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
