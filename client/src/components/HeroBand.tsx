import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { gsap, gsapEase, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Parallax } from "@/lib/motion";
import { CONTACT_PHONES, REQUEST_NURSE_PATH, REQUEST_STAFF_PATH } from "@/lib/site";

const heroSlides = [
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
        { x: -28 },
        {
          x: 0,
          duration: 0.9,
          stagger: 0.1,
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
          <p className="home-hero__brand" data-hero-animate>
            BHSK Nursing Services
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
              className="w-full shrink-0 sm:w-auto sm:min-w-[10.5rem]"
            />
            <a className="home-hero__call" href={phone.href} aria-label={`Call BHSK at ${phone.display}`}>
              <Phone size={15} strokeWidth={2.5} aria-hidden="true" />
              <span>{phone.display}</span>
            </a>
          </div>
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
    </section>
  );
}
