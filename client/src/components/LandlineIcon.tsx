export function LandlineIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 8.6C3 7 7 5 12 5s9 2 9 3.6v.9a1 1 0 0 1-1 1h-2.5a1 1 0 0 1-1-1V8.3a12 12 0 0 0-9 0v1.2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9.5 10.5v2M14.5 10.5v2" />
      <path d="M6.5 12.5h11l2.3 6.4a1 1 0 0 1-.94 1.35H5.14a1 1 0 0 1-.94-1.35z" />
      <circle cx="12" cy="16.4" r="1.6" />
    </svg>
  );
}
