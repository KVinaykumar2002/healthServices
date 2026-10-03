import { useEffect, useId, useState } from "react";
import { Phone } from "lucide-react";
import { CONTACT_PHONES, WHATSAPP } from "@/lib/site";

const INTRO_TOOLTIP_MS = 4000;
const RIPPLE_DELAYS = ["0s", "0.66s", "1.33s"];

const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type FloatingContactWidgetProps = {
  phoneHref?: string;
  whatsappHref?: string;
};

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.04 3C9.4 3 4 8.3 4 14.84c0 2.1.56 4.14 1.62 5.95L4 29l8.44-2.2a12.1 12.1 0 0 0 3.6.55c6.64 0 12.04-5.3 12.04-11.84C28.08 8.3 22.68 3 16.04 3zm6.96 16.95c-.3.84-1.74 1.55-2.44 1.65-.63.09-1.42.13-2.3-.14-.53-.17-1.22-.4-2.1-.78-3.7-1.6-6.1-5.32-6.28-5.57-.18-.25-1.45-1.93-1.45-3.68 0-1.75.92-2.61 1.25-2.97.33-.36.72-.45.96-.45h.7c.22 0 .52-.08.81.62.3.72 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.15.72.2.36.9 1.48 1.93 2.4 1.33 1.18 2.45 1.55 2.8 1.72.36.18.56.15.77-.09.2-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.21 1.71z"
      />
    </svg>
  );
}

function TeacupMascot() {
  return (
    <div
      aria-hidden="true"
      className="relative animate-teacup-bob motion-reduce:animate-none max-[379px]:hidden"
    >
      <div className="relative z-10 grid size-11 place-items-center rounded-full border-[3px] border-[var(--bhsk-sky)] bg-[var(--bhsk-blue-deep)] shadow-[0_4px_12px_rgba(20,103,132,0.3)]">
        <svg viewBox="0 0 32 32" className="size-9" fill="none">
          <circle cx="11.5" cy="13.5" r="2.6" fill="#fff" />
          <circle cx="20.5" cy="13.5" r="2.6" fill="#fff" />
          <path d="M10.5 18.5Q16 25.5 21.5 18.5Q16 22 10.5 18.5Z" fill="var(--bhsk-sky)" stroke="var(--bhsk-sky)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="absolute left-full top-[38%] -ml-px flex origin-left -translate-y-1/2 animate-hello-wave items-center drop-shadow-[0_1px_2px_rgba(20,103,132,0.35)] motion-reduce:animate-none">
        <span className="h-1 w-2.5 rounded-l-full bg-[var(--bhsk-sky)]" />
        <span className="-ml-px size-[7px] rounded-full bg-[var(--bhsk-sky)]" />
      </span>
    </div>
  );
}

/** Bottom-right contact stack: waving teacup mascot, call button with "Talk to expert" tooltip, WhatsApp button. */
export function FloatingContactWidget({
  phoneHref = CONTACT_PHONES[0].href,
  whatsappHref = `${WHATSAPP.href}?text=${encodeURIComponent("Hi BHSK")}`,
}: FloatingContactWidgetProps) {
  const tooltipId = useId();
  const [intro, setIntro] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const showTooltip = intro || hovered || focused;

  useEffect(() => {
    const timer = window.setTimeout(() => setIntro(false), INTRO_TOOLTIP_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex origin-bottom-right flex-col items-center gap-3 max-sm:scale-[0.85]">
      <TeacupMascot />

      <div className="relative z-10">
        <a
          href={phoneHref}
          aria-label="Call a tea expert"
          aria-describedby={tooltipId}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`grid size-12 place-items-center rounded-full bg-[var(--bhsk-blue-text)] text-white! shadow-[0_4px_12px_rgba(20,103,132,0.25)] transition duration-200 ease-out hover:scale-[1.06] hover:bg-[var(--bhsk-blue-deep)] hover:shadow-[0_8px_24px_rgba(20,103,132,0.3)] focus-visible:scale-[1.06] ${focusRing}`}
        >
          <Phone size={20} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
        </a>

        <div
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-[10px] bg-[var(--bhsk-blue-deep)] px-3.5 py-2 font-condensed text-[15px] font-semibold leading-none tracking-wide text-white shadow-[0_4px_12px_rgba(20,103,132,0.28)] transition duration-300 ease-out motion-reduce:transition-none ${
            showTooltip ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
          }`}
        >
          Talk to expert
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-y-[6px] border-l-[6px] border-y-transparent border-l-[var(--bhsk-blue-deep)]" />
        </div>
      </div>

      <div className="relative size-14">
        {RIPPLE_DELAYS.map((delay, i) => (
          <span
            key={delay}
            aria-hidden="true"
            style={{ animationDelay: delay }}
            className={`pointer-events-none absolute inset-0 rounded-full border-2 opacity-0 animate-whatsapp-ripple motion-reduce:hidden ${
              i % 2 ? "border-white/60" : "border-[#25D366]/60"
            }`}
          />
        ))}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className={`relative grid size-full place-items-center rounded-full bg-[#25D366] text-white! shadow-[0_6px_18px_rgba(0,0,0,0.2)] transition duration-200 ease-out hover:scale-[1.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] focus-visible:scale-[1.06] ${focusRing}`}
        >
          <WhatsAppLogo className="size-7" />
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 grid size-3.5 place-items-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
          >
            <span className="size-2 rounded-full bg-[#E53935]" />
          </span>
        </a>
      </div>
    </div>
  );
}
