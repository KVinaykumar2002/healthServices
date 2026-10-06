import { useRef } from "react";
import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { Reveal } from "@/lib/motion";
import { REQUEST_NURSE_PATH } from "@/lib/site";

const steps = [
  {
    n: "01",
    title: "Enquiry",
    text: "Tell us whether you need home care or facility staffing, and what support is required.",
  },
  {
    n: "02",
    title: "Assessment",
    text: "Our care team reviews clinical fit, location and timing against current capacity.",
  },
  {
    n: "03",
    title: "Staff matching",
    text: "We match available nursing professionals to the role or home care plan.",
  },
  {
    n: "04",
    title: "Confirmation",
    text: "Service begins only after we confirm the arrangement with you — an enquiry is not a booking.",
  },
] as const;

/** Higher = more easing lag behind the scrollbar, which reads as smoother motion. */
const SCRUB_SMOOTHING = 1.4;

export function HowItWorks() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = timelineRef.current;
      if (!root || prefersReducedMotion()) return;

      const track = root.querySelector<HTMLElement>(".how-track");
      const fill = root.querySelector<HTMLElement>(".how-track__fill");
      const head = root.querySelector<HTMLElement>(".how-track__head");
      const items = gsap.utils.toArray<HTMLElement>(".how-step", root);
      const css = getComputedStyle(document.documentElement);
      const blue = css.getPropertyValue("--bhsk-blue").trim() || "#26a0cb";
      const blueText = css.getPropertyValue("--bhsk-blue-text").trim() || "#1b7fa3";
      const [r, g, b] = gsap.utils.splitColor(blue);
      const blueSoft = `rgba(${r}, ${g}, ${b}, 0.4)`;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          end: "bottom 55%",
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
        },
      });

      // Steps sit one timeline unit apart, so the line reaches each circle exactly as it activates.
      const span = items.length - 1;
      if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: span, ease: "none" }, 0);
      if (head && track) {
        tl.fromTo(head, { x: 0, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, ease: "none" }, 0);
        tl.fromTo(head, { x: 0 }, { x: () => track.offsetWidth, duration: span, ease: "none" }, 0);
        tl.to(head, { autoAlpha: 0, duration: 0.2, ease: "none" }, span - 0.1);
      }

      items.forEach((item, i) => {
        const dot = item.querySelector<HTMLElement>(".how-step__dot");
        const dotFill = item.querySelector<HTMLElement>(".how-step__dot-fill");
        const num = item.querySelector<HTMLElement>(".how-step__num");
        const copy = item.querySelector<HTMLElement>(".how-step__copy");
        const at = Math.max(i - 0.15, 0);

        if (dot) tl.fromTo(dot, { scale: 0.82 }, { scale: 1, duration: 0.45, ease: "back.out(2)" }, at);
        if (dotFill) tl.fromTo(dotFill, { scale: 0 }, { scale: 1, duration: 0.4 }, at);
        if (num) tl.fromTo(num, { color: blueText }, { color: "#ffffff", duration: 0.3 }, at + 0.1);
        if (dot) tl.fromTo(dot, { borderColor: blueSoft }, { borderColor: blue, duration: 0.3 }, at);
        if (copy) tl.fromTo(copy, { autoAlpha: 0.25, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6 }, at);
      });
    },
    { scope: timelineRef },
  );

  return (
    <section className="how-section section" aria-labelledby="how-heading">
      <div className="container">
        <Reveal className="section-heading" direction="left" distance={48}>
          <div className="eyebrow">HOW IT WORKS</div>
          <h2 id="how-heading">From enquiry to confirmed care</h2>
          <p>Every request is reviewed before a nurse or staffing placement is confirmed.</p>
        </Reveal>
        <div className="how-timeline" ref={timelineRef}>
          <div className="how-track" aria-hidden="true">
            <span className="how-track__fill" />
            <span className="how-track__head" />
          </div>
          <ol className="how-steps">
            {steps.map((step) => (
              <li key={step.n} className="how-step">
                <span className="how-step__dot" aria-hidden="true">
                  <span className="how-step__dot-fill" />
                  <span className="how-step__num">{step.n}</span>
                </span>
                <div className="how-step__copy">
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Reveal className="how-cta" direction="left" distance={32} delay={0.2}>
          <AntiMetalButton href={REQUEST_NURSE_PATH} label="Request a Nurse" />
        </Reveal>
      </div>
    </section>
  );
}
