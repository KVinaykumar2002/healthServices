import {
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { gsap, gsapEase, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Token: motion.duration.instant = 150ms */
export const durationInstant = 0.15;
/** Token: motion.duration.fast = 1000ms */
export const durationFast = 1;

export const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durationFast * 0.5, ease: easeOut },
  },
};

type Direction = "left" | "right" | "up" | "down";

const directionOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
  }
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slide distance in px */
  distance?: number;
  /** Default: left → right on scroll */
  direction?: Direction;
  once?: boolean;
  as?: ElementType;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

/** GSAP scroll reveal — text/content slides in (default left → right). */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 72,
  direction = "left",
  once = true,
  as: Tag = "div",
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const from = directionOffset(direction, distance);
      gsap.fromTo(
        el,
        { opacity: 0, ...from },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.05,
          delay,
          ease: gsapEase,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: once ? "play none none none" : "play reverse play reverse",
          },
        },
      );
    },
    { dependencies: [delay, distance, direction, once] },
  );

  return (
    <Tag ref={ref} className={cn("gsap-reveal", className)} {...props}>
      {children}
    </Tag>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Scroll travel in px (positive = moves slower / deeper) */
  speed?: number;
  as?: ElementType;
};

/** GSAP parallax — element drifts on scroll relative to its parent. */
export function Parallax({ children, className, speed = 80, as: Tag = "div" }: ParallaxProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        { y: -speed },
        {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [speed] },
  );

  return (
    <Tag ref={ref} className={cn("gsap-parallax", className)}>
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Child selector for stagger targets */
  childSelector?: string;
  direction?: Direction;
  distance?: number;
  stagger?: number;
  as?: ElementType;
};

/** GSAP scroll stagger for grids/lists — children enter left → right. */
export function GsapStagger({
  children,
  className,
  childSelector = ":scope > *",
  direction = "left",
  distance = 56,
  stagger = 0.1,
  as: Tag = "div",
}: StaggerProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const items = el.querySelectorAll(childSelector);
      if (!items.length) return;

      const from = directionOffset(direction, distance);
      gsap.fromTo(
        items,
        { opacity: 0, ...from },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          stagger,
          ease: gsapEase,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { dependencies: [childSelector, direction, distance, stagger] },
  );

  return (
    <Tag ref={ref} className={cn("gsap-stagger", className)}>
      {children}
    </Tag>
  );
}

/** Split text into words and animate left → right on mount or scroll. */
export function RevealText({
  children,
  className,
  as: Tag = "span",
  delay = 0,
  scroll = false,
}: {
  children: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  scroll?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const words = children.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const spans = el.querySelectorAll(".gsap-word");

      const tween = {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.045,
        delay,
        ease: gsapEase,
      };

      if (scroll) {
        gsap.fromTo(
          spans,
          { opacity: 0, x: -28 },
          {
            ...tween,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      } else {
        gsap.fromTo(spans, { opacity: 0, x: -28 }, tween);
      }
    },
    { dependencies: [children, delay, scroll] },
  );

  return (
    <Tag ref={ref} className={cn("gsap-reveal-text", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="gsap-word" style={{ display: "inline-block", marginRight: "0.28em" }}>
          {word}
        </span>
      ))}
    </Tag>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <GsapStagger className={className}>{children}</GsapStagger>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
