import { useId, useRef, useState } from "react";
import { ArrowLeft, LoaderCircle, Upload } from "lucide-react";
import { uploadImage } from "./api";
import { HERO_PHOTO_LIBRARY, prepareImageForUpload } from "./heroImages";

/** Upload a photo, or pick one of the photos already on the website. */
export function PhotoChooser({
  usedSources,
  onPick,
  onBack,
  hint = "JPEG, PNG or WebP. Landscape photos look best; large photos are resized automatically.",
}: {
  usedSources: Set<string>;
  onPick: (src: string, alt: string) => void;
  onBack?: () => void;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onPick(await uploadImage(await prepareImageForUpload(file)), "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="grid gap-5">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={uploading}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--bhsk-blue-text)] disabled:opacity-50"
        >
          <ArrowLeft className="size-4" /> Keep the current photo
        </button>
      ) : null}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id={inputId}
          disabled={uploading}
          onChange={(event) => void upload(event.target.files?.[0])}
        />
        <label
          htmlFor={inputId}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-page)] px-4 py-6 text-center hover:border-[var(--bhsk-blue)] ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          {uploading ? (
            <LoaderCircle className="size-6 animate-spin text-[var(--bhsk-blue-text)]" />
          ) : (
            <Upload className="size-6 text-[var(--bhsk-blue-text)]" />
          )}
          <span className="text-sm font-semibold">{uploading ? "Uploading…" : "Upload from your computer"}</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
        </label>
        {error ? (
          <p className="m-0 mt-2 text-sm text-[var(--color-error)]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <p className="m-0 mb-2 text-sm font-semibold">Or pick a website photo</p>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
          {HERO_PHOTO_LIBRARY.map((photo) => (
            <li key={photo.src}>
              <button
                type="button"
                disabled={uploading}
                onClick={() => onPick(photo.src, photo.alt)}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border)] bg-slate-100 p-0 text-left focus-visible:ring-3 focus-visible:ring-[var(--bhsk-sky)] disabled:cursor-not-allowed"
                title={photo.alt}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="block aspect-[4/3] w-full object-cover transition group-hover:scale-105"
                />
                {usedSources.has(photo.src) ? (
                  <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-[var(--bhsk-blue-text)]">
                    In use
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
