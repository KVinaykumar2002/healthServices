import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { gsap, gsapEase, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { FitImage } from "@/components/FitImage";
import { resolveImageSrc, useHomeHero, useSiteContact } from "@/lib/siteSettings";

/**
 * Hero keeps copy visible before GSAP runs (no opacity:0 on text).
 * Motion is limited to a light horizontal settle. Content is managed from the admin dashboard.
 */
export function HeroBand() {
  const hero = useHomeHero();
  const heroSlides = hero.slides;
  const slideCount = heroSlides.length;
  const reduce = prefersReducedMotion();
  const [current, setSlide] = useState(0);
  const slide = current % slideCount;
  const rootRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce || slideCount < 2) return;
    const id = window.setInterval(() => {
      setSlide((value) => (value + 1) % slideCount);
    }, 5200);
    return () => window.clearInterval(id);
  }, [reduce, slide, slideCount]);

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
    setSlide((index + slideCount) % slideCount);
  }

  const active = heroSlides[slide];
  const phone = useSiteContact().primaryPhone;

  return (
    <section ref={rootRef} className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero__container">
        <div className="home-hero__content" ref={contentRef}>
          {hero.tagline ? (
            <p className="eyebrow home-hero__tagline" data-hero-animate>
              {hero.tagline}
            </p>
          ) : null}
          <h1 id="home-hero-title" data-hero-animate>
            {hero.title}
          </h1>
          {hero.subtitle ? (
            <h2 className="home-hero__subhead" data-hero-animate>
              {hero.subtitle}
            </h2>
          ) : null}
          {hero.description ? (
            <p className="home-hero__description" data-hero-animate>
              {hero.description}
            </p>
          ) : null}
          <div className="home-hero__cta-row" data-hero-animate>
            <AntiMetalButton
              href={hero.primaryButton.href}
              label={hero.primaryButton.label}
              className="w-full shrink-0 sm:w-auto sm:min-w-[11.5rem]"
            />
            <AntiMetalButton
              href={hero.secondaryButton.href}
              label={hero.secondaryButton.label}
              variant="accent"
              className="w-full shrink-0 sm:w-auto sm:min-w-[10.5rem]"
            />
            {hero.showCallButton ? (
              <a className="home-hero__call" href={phone.href} aria-label={`Call BHSK at ${phone.display}`}>
                <Phone size={15} strokeWidth={2.5} aria-hidden="true" />
                <span>{phone.display}</span>
              </a>
            ) : null}
          </div>
          {hero.highlights.length ? (
            <ul className="home-hero__assurance" data-hero-animate aria-label="How BHSK works">
              {hero.highlights.map((item, index) => (
                <li key={`${index}-${item}`}>
                  <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="home-hero__media">
          <div className="home-hero__image-wrap" aria-live="polite">
            <div ref={slideRef} className="home-hero__slide" key={`${slide}-${active.src}`}>
              <FitImage src={resolveImageSrc(active.src)} alt={active.alt} className="home-hero__fit" />
            </div>
          </div>

          {slideCount > 1 ? (
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
                {heroSlides.map((_item, index) => (
                  <button
                    key={index}
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
          ) : null}
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
