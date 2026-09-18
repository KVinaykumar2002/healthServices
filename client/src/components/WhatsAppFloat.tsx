const WHATSAPP_URL = "https://wa.me/97431599965";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.04 3C9.4 3 4 8.3 4 14.84c0 2.1.56 4.14 1.62 5.95L4 29l8.44-2.2a12.1 12.1 0 0 0 3.6.55c6.64 0 12.04-5.3 12.04-11.84C28.08 8.3 22.68 3 16.04 3zm6.96 16.95c-.3.84-1.74 1.55-2.44 1.65-.63.09-1.42.13-2.3-.14-.53-.17-1.22-.4-2.1-.78-3.7-1.6-6.1-5.32-6.28-5.57-.18-.25-1.45-1.93-1.45-3.68 0-1.75.92-2.61 1.25-2.97.33-.36.72-.45.96-.45h.7c.22 0 .52-.08.81.62.3.72 1.02 2.49 1.11 2.67.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.36.37-.15.72.2.36.9 1.48 1.93 2.4 1.33 1.18 2.45 1.55 2.8 1.72.36.18.56.15.77-.09.2-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.21 1.71z"
      />
    </svg>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BHSK on WhatsApp"
    >
      <span className="whatsapp-float__icon">
        <WhatsAppGlyph />
      </span>
      <span className="whatsapp-float__label" aria-hidden="true">
        WhatsApp
      </span>
    </a>
  );
}
