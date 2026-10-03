import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useReducedMotion } from "framer-motion";

const SHOW_AFTER_PX = 480;
const RING_RADIUS = 22;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Floating "back to top" control with a ring that fills as the page is read. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(scrolled / max, 1) : 0;
      ringRef.current?.style.setProperty("stroke-dashoffset", String(RING_LENGTH * (1 - progress)));
      setVisible(scrolled > SHOW_AFTER_PX);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
    >
      <svg className="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle className="back-to-top__track" cx="24" cy="24" r={RING_RADIUS} />
        <circle
          ref={ringRef}
          className="back-to-top__progress"
          cx="24"
          cy="24"
          r={RING_RADIUS}
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
        />
      </svg>
      <ArrowUp className="back-to-top__icon" size={20} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}
