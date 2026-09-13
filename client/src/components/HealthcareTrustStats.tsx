import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { GsapStagger } from "@/lib/motion";

export type TrustStat = {
  value: string;
  label: string;
};

const trustStats: TrustStat[] = [
  { value: "India's Leading", label: "Home Healthcare Company" },
  { value: "100+", label: "Top Hospital Partnerships" },
  { value: "15 Lakh+", label: "Annual Patient Visits across India" },
  { value: "20 Lakh+", label: "Total Patients Served" },
];

export type HealthcareTrustStatsProps = {
  stats?: TrustStat[];
  className?: string;
};

type ParsedStat =
  | { kind: "text"; display: string }
  | { kind: "number"; target: number; prefix: string; suffix: string };

function parseStatValue(value: string): ParsedStat {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { kind: "text", display: value };
  const [, prefix, num, suffix] = match;
  return {
    kind: "number",
    target: Number(num),
    prefix: prefix ?? "",
    suffix: suffix ?? "",
  };
}

function useScrollDirection(): "up" | "down" {
  const { scrollY } = useScroll();
  const lastY = React.useRef(0);
  const [direction, setDirection] = React.useState<"up" | "down">("down");

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (Math.abs(latest - lastY.current) < 8) return;
    const next: "up" | "down" = latest > lastY.current ? "down" : "up";
    lastY.current = latest;
    setDirection((prev) => (prev === next ? prev : next));
  });

  return direction;
}

function AnimatedStatValue({
  value,
  direction,
}: {
  value: string;
  direction: "up" | "down";
}) {
  const parsed = React.useMemo(() => parseStatValue(value), [value]);
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  useMotionValueEvent(motionVal, "change", (latest) => {
    setDisplay(latest);
  });

  React.useEffect(() => {
    if (parsed.kind !== "number") return;

    if (reduce) {
      motionVal.set(parsed.target);
      setDisplay(parsed.target);
      return;
    }

    // In view + scrolling down → count up; scrolling up (or out of view) → count down
    const to = inView && direction === "down" ? parsed.target : 0;
    const controls = animate(motionVal, to, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [direction, inView, motionVal, parsed, reduce]);

  if (parsed.kind === "text") {
    return (
      <motion.strong
        ref={ref}
        className="healthcare-trust-stats__value"
        initial={false}
        animate={{ opacity: inView ? 1 : 0.55 }}
        transition={{ duration: 0.35 }}
      >
        {parsed.display}
      </motion.strong>
    );
  }

  const rounded = Number.isInteger(parsed.target)
    ? Math.round(display)
    : Math.round(display * 10) / 10;

  return (
    <strong ref={ref} className="healthcare-trust-stats__value">
      {parsed.prefix}
      {rounded}
      {parsed.suffix}
    </strong>
  );
}

export const HealthcareTrustStats = ({
  stats = trustStats,
  className = "",
}: HealthcareTrustStatsProps) => {
  const direction = useScrollDirection();

  return (
    <section
      className={`healthcare-trust-stats ${className}`.trim()}
      aria-label="Healthcare company facts"
    >
      <div className="healthcare-trust-stats__container container">
        <GsapStagger
          as="ul"
          className="healthcare-trust-stats__list"
          childSelector=":scope > li"
          direction="left"
          distance={40}
          stagger={0.1}
        >
          {stats.map((stat) => (
            <li className="healthcare-trust-stats__item" key={stat.label}>
              <AnimatedStatValue value={stat.value} direction={direction} />
              <span className="healthcare-trust-stats__label">{stat.label}</span>
            </li>
          ))}
        </GsapStagger>
      </div>
    </section>
  );
};
