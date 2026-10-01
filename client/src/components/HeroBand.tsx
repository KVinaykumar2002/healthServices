import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { gsap, gsapEase, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Parallax } from "@/lib/motion";
import { CONTACT_PHONES, REQUEST_NURSE_PATH, REQUEST_STAFF_PATH } from "@/lib/site";

const heroSlides = [
  {
    src: "/images/bhsk/hero-elderly-care.jpg",
    alt: "BHSK nurse supporting an elderly man in a wheelchair at home",
  },
  {
    src: "/images/bhsk/hero-mobility-family.jpg",
    alt: "BHSK nurse helping an elderly man walk with a frame while his family watches",
  },
  {
    src: "/images/bhsk/hero-family-bedside.jpg",
    alt: "BHSK nurse caring for an elderly patient in bed with his grandchildren beside him",
  },
] as const;

const HERO_ASSURANCES = [
  "Assessment before every placement",
  "Local coordination from Doha",
  "Home care & facility staffing",
] as const;

/**
 * Hero keeps copy visible before GSAP runs (no opacity:0 on text).
 * Motion is limited to a light horizontal settle.
 */
export function HeroBand() {
  const reduce = prefersReducedMotion();
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
      if (!content) return;
      const items = content.querySelectorAll("[data-hero-animate]");
      gsap.fromTo(
        items,
        { x: -12 },
        {
          x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: gsapEase,
          delay: 0.05,
          clearProps: "transform",
        },
      );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!slideRef.current || prefersReducedMotion()) return;
      gsap.fromTo(
        slideRef.current,
        { opacity: 0.85, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1, ease: gsapEase },
      );
    },
    { dependencies: [slide] },
  );

  function goTo(index: number) {
    setSlide((index + heroSlides.length) % heroSlides.length);
  }

  const active = heroSlides[slide];
  const phone = CONTACT_PHONES[0];

  return (
    <section ref={rootRef} className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__container">
        <div className="home-hero__content" ref={contentRef}>
          <p className="eyebrow home-hero__tagline" data-hero-animate>
            BHSK for Health Services · Doha, Qatar
          </p>
          <h1 id="home-hero-title" data-hero-animate>
            Professional Nursing and Healthcare Staffing in Qatar
          </h1>
          <h2 className="home-hero__subhead" data-hero-animate>
            Home Care Services in Qatar
          </h2>
          <p className="home-hero__description" data-hero-animate>
            Trained nurses for facilities and families across Doha — request home care or healthcare staffing and our
            team will confirm fit and availability.
          </p>
          <div className="home-hero__cta-row" data-hero-animate>
            <AntiMetalButton
              href={REQUEST_NURSE_PATH}
              label="Request a Nurse"
              className="w-full shrink-0 sm:w-auto sm:min-w-[11.5rem]"
            />
            <AntiMetalButton
              href={REQUEST_STAFF_PATH}
              label="Request Staff"
              variant="accent"
              className="w-full shrink-0 sm:w-auto sm:min-w-[10.5rem]"
            />
            <a className="home-hero__call" href={phone.href} aria-label={`Call BHSK at ${phone.display}`}>
              <Phone size={15} strokeWidth={2.5} aria-hidden="true" />
              <span>{phone.display}</span>
            </a>
          </div>
          <ul className="home-hero__assurance" data-hero-animate aria-label="How BHSK works">
            {HERO_ASSURANCES.map((item) => (
              <li key={item}>
                <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="home-hero__media">
          <div className="home-hero__image-wrap" aria-live="polite">
            <div ref={slideRef} className="home-hero__slide" key={active.src}>
              <Parallax speed={56} className="home-hero__parallax">
                <picture>
                  <img src={active.src} alt={active.alt} />
                </picture>
              </Parallax>
            </div>
          </div>

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
        </div>
      </div>
      <HeroPulse animated={!reduce} />
    </section>
  );
}

const HERO_PULSE_PATH = "M0 70 H700 L722 26 L754 108 L796 38 L810 70 H1600";

/** The logo's pulse line, stretched across the hero from the copy into the photography. */
function HeroPulse({ animated }: { animated: boolean }) {
  return (
    <svg
      className={`home-hero__pulse bhsk-logo${animated ? " bhsk-logo--animated" : ""}`}
      viewBox="0 0 1600 130"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="bhsk-logo__pulse" d={HERO_PULSE_PATH} strokeWidth={3} pathLength={1} />
      {animated ? <path className="bhsk-logo__beat" d={HERO_PULSE_PATH} strokeWidth={3} pathLength={1} /> : null}
    </svg>
  );
}
