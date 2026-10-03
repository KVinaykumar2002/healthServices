import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * BHSK logo system: heart frame + BHSK wordmark + pulse line.
 * Geometry is drawn as strokes so the mark renders identically everywhere
 * (no font dependency). Colours come from the --bhsk-* tokens, so a parent
 * can retint the mark (e.g. on the dark footer) with CSS alone.
 */

const VIEWBOX = "190 30 690 565";

export const HEART_TOP_PATH =
  "M252 285 C225 180 300 55 400 55 C470 55 515 95 535 120 C555 95 600 55 670 55 C770 55 845 180 818 285";
export const HEART_BASE_PATH = "M318 392 L535 575 L752 392";
export const PULSE_PATH = "M208 325 H378 L436 165 L514 455 L668 213 L712 330 H862";

const WORDMARK_PATHS = [
  "M335 252 V340 M335 252 H370 A22 22 0 0 1 370 296 H335 M335 296 H376 A22 22 0 0 1 376 340 H335",
  "M440 252 V340 M510 252 V340 M440 296 H510",
  "M608 264 C600 255 590 251 578 251 C561 251 550 260 550 273 C550 287 563 292 580 296 C599 300 611 307 611 320 C611 334 599 341 580 341 C566 341 555 336 547 327",
  "M655 252 V340 M742 252 L668 307 M692 289 L750 340",
] as const;

type BhskLogoProps = {
  /** "full" = heart + wordmark + pulse; "symbol" = heart + pulse (decorative sizes) */
  variant?: "full" | "symbol";
  /** Draws the pulse in on mount, then sends a beat travelling through the letters */
  animated?: boolean;
  /** Accessible name; omit for decorative usage */
  title?: string;
  className?: string;
};

export function BhskLogo({ variant = "full", animated = false, title, className }: BhskLogoProps) {
  const decorative = !title;
  return (
    <svg
      viewBox={VIEWBOX}
      className={cn("bhsk-logo", animated && "bhsk-logo--animated", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path className="bhsk-logo__heart-top" d={HEART_TOP_PATH} strokeWidth={16} />
      <path className="bhsk-logo__heart-base" d={HEART_BASE_PATH} strokeWidth={16} />
      {variant === "full" ? (
        <g className="bhsk-logo__word" strokeWidth={30}>
          {WORDMARK_PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ) : null}
      <path className="bhsk-logo__pulse" d={PULSE_PATH} strokeWidth={14} pathLength={1} />
      {animated ? (
        <path className="bhsk-logo__beat" d={PULSE_PATH} strokeWidth={14} pathLength={1} />
      ) : null}
    </svg>
  );
}

/** Single heartbeat glyph taken from the logo's pulse, for inline accents. */
export function PulseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 20"
      className={cn("bhsk-pulse-glyph", className)}
      aria-hidden="true"
      focusable="false"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 11 H14 L18 3 L24 17 L31 6 L34 11 H46" strokeWidth={2.4} />
    </svg>
  );
}

/**
 * Horizontal rule carrying one heartbeat — the pulse line from the logo
 * stretched into a layout divider.
 */
const DIVIDER_PULSE_PATH = "M0 22 H34 L44 6 L58 34 L76 12 L83 22 H120";

export function PulseDivider({ animated = false, className }: { animated?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Plays when scrolled into view (and again on each return), not at page load while off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!animated || !el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.6,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div
      ref={ref}
      className={cn("pulse-divider", animated && "pulse-divider--animated", inView && "is-in-view", className)}
      aria-hidden="true"
    >
      <span className="pulse-divider__line pulse-divider__line--in" />
      <svg
        viewBox="0 0 120 40"
        className="pulse-divider__beat"
        focusable="false"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="pulse-divider__pulse" d={DIVIDER_PULSE_PATH} strokeWidth={3} pathLength={1} />
        {animated && (
          <path className="pulse-divider__glint" d={DIVIDER_PULSE_PATH} strokeWidth={3} pathLength={1} />
        )}
      </svg>
      <span className="pulse-divider__line pulse-divider__line--out" />
    </div>
  );
}

type BrandLockupProps = {
  className?: string;
  animated?: boolean;
};

/** Logo mark + "BHSK / FOR HEALTH SERVICES" text, used in header and footer. */
export function BrandLockup({ className, animated = false }: BrandLockupProps) {
  return (
    <span className={cn("brand-lockup", className)}>
      <BhskLogo className="brand-logo" animated={animated} />
      <span className="brand-lockup__text">
        <b>BHSK</b>
        <small>FOR HEALTH SERVICES</small>
      </span>
    </span>
  );
}
