"use client";

import * as React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type DoubleChevronProps = {
  index: number;
  dotColor: string;
};

const DoubleChevron = ({ index, dotColor }: DoubleChevronProps) => {
  const base = index * 0.12;
  const dots = [
    { cx: 2, cy: 2, d: 0 },
    { cx: 5, cy: 5, d: 0.05 },
    { cx: 8, cy: 8, d: 0.1 },
    { cx: 5, cy: 11, d: 0.15 },
    { cx: 2, cy: 14, d: 0.2 },
    { cx: 6, cy: 2, d: 0.05 },
    { cx: 9, cy: 5, d: 0.1 },
    { cx: 12, cy: 8, d: 0.15 },
    { cx: 9, cy: 11, d: 0.2 },
    { cx: 6, cy: 14, d: 0.25 },
  ];

  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <g fill={dotColor}>
        {dots.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="1"
            className="bd-dot"
            style={{ animationDelay: `${base + p.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

function isExternalHref(href: string) {
  return /^(https?:|tel:|mailto:|sms:)/i.test(href) || href.startsWith("//");
}

const surfaceClass = (size: "default" | "sm", className?: string) =>
  cn(
    "group/btn relative inline-flex overflow-hidden rounded-xl transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-surface-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-page)]",
    "bg-[linear-gradient(180deg,#0d2222_0%,#061414_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(13,34,34,0.22)]",
    size === "sm" ? "h-9 min-w-[9.5rem] w-auto" : "h-11 min-w-[11rem] w-auto",
    className
  );

function AntiMetalInner({
  content,
  accentFrom,
  accentTo,
  dotColor,
  size,
}: {
  content: React.ReactNode;
  accentFrom: string;
  accentTo: string;
  dotColor: string;
  size: "default" | "sm";
}) {
  return (
    <>
      <style>{`
        @keyframes bd-dot-wave {
          0%, 70%, 100% { opacity: 0.25; transform: scale(0.85); }
          35% { opacity: 1; transform: scale(1); }
        }
        .bd-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: bd-dot-wave 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bd-dot { animation: none; opacity: 1; }
        }
      `}</style>

      <span
        className={cn(
          "absolute inset-y-0 right-3 flex items-center font-medium tracking-tight text-white sm:right-4",
          size === "sm" ? "text-[12px]" : "text-[14px]"
        )}
      >
        {content}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-1 left-1 top-1 z-10 flex items-center justify-start gap-2.5 overflow-hidden rounded-md pl-3 pr-2.5 transition-[width,gap] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:w-[calc(100%-0.5rem)]",
          size === "sm" ? "w-8" : "w-9"
        )}
        style={{
          background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.14), 0 2px 4px rgba(13,34,34,0.12)",
        }}
      >
        <DoubleChevron index={0} dotColor={dotColor} />
        <DoubleChevron index={1} dotColor={dotColor} />
        <DoubleChevron index={2} dotColor={dotColor} />
        <DoubleChevron index={3} dotColor={dotColor} />
        <DoubleChevron index={4} dotColor={dotColor} />
      </span>
    </>
  );
}

export type AntiMetalButtonProps = {
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Sliding accent panel start (BHSK coral by default) */
  accentFrom?: string;
  /** Sliding accent panel end */
  accentTo?: string;
  /** Chevron dot color on the accent panel */
  dotColor?: string;
  size?: "default" | "sm";
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  "aria-label"?: string;
};

export const AntiMetalButton = React.forwardRef<HTMLElement, AntiMetalButtonProps>(
  function AntiMetalButton(
    {
      className,
      children,
      label,
      accentFrom = "#f25922",
      accentTo = "#d94a18",
      dotColor = "#ffffff",
      size = "default",
      href,
      type = "button",
      onClick,
      disabled,
      "aria-label": ariaLabel,
    },
    ref
  ) {
    const content = label ?? children ?? "Book a Consultation";
    const inner = (
      <AntiMetalInner
        content={content}
        accentFrom={accentFrom}
        accentTo={accentTo}
        dotColor={dotColor}
        size={size}
      />
    );
    const classes = surfaceClass(size, className);

    if (href) {
      if (isExternalHref(href)) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            onClick={onClick}
            aria-label={ariaLabel}
          >
            {inner}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {inner}
      </button>
    );
  }
);

AntiMetalButton.displayName = "AntiMetalButton";

export default AntiMetalButton;
