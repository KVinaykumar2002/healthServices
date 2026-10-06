import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, LoaderCircle, Replace, Trash2, Upload } from "lucide-react";
import { DEFAULT_HOME_HERO, HOME_HERO_LIMITS, type HeroLink, type HomeHero } from "@shared/homeHero";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { resolveImageSrc } from "@/lib/siteSettings";
import { AdminApiError, fetchHomeHero, saveHomeHero, uploadImage, type HomeHeroRecord } from "./api";
import { HERO_PHOTO_LIBRARY, prepareImageForUpload } from "./heroImages";
import {
  Card,
  Field,
  FormError,
  ListField,
  LoadError,
  LoadingCards,
  SaveBar,
  borderFor,
  inputClass,
  textareaClass,
  useUnsavedChangesWarning,
} from "./settingsForm";

type FieldErrors = Partial<Record<keyof HomeHero, string[]>>;
type PickerTarget = { mode: "add" } | { mode: "replace"; index: number };

const SITE_PAGES = [
  { path: "/request-a-nurse", label: "Request a Nurse form" },
  { path: "/request-healthcare-staff", label: "Request Staff form" },
  { path: "/services", label: "Home care services" },
  { path: "/services/home-nursing", label: "Home nursing" },
  { path: "/healthcare-staffing", label: "Healthcare staffing" },
  { path: "/book-consultation", label: "Book a consultation" },
  { path: "/about-us", label: "About us" },
  { path: "/contact-us", label: "Contact us" },
];

const iconButtonClass =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)] disabled:cursor-not-allowed disabled:opacity-40";

function withoutTimestamp({ updatedAt: _updatedAt, ...hero }: HomeHeroRecord): HomeHero {
  return hero;
}

/** Trims every value and drops blank highlights, matching what the server stores. */
function cleanHero(hero: HomeHero): HomeHero {
  const link = ({ label, href }: HeroLink) => ({ label: label.trim(), href: href.trim() });
  return {
    tagline: hero.tagline.trim(),
    title: hero.title.trim(),
    subtitle: hero.subtitle.trim(),
    description: hero.description.trim(),
    primaryButton: link(hero.primaryButton),
    secondaryButton: link(hero.secondaryButton),
    showCallButton: hero.showCallButton,
    highlights: hero.highlights.map((item) => item.trim()).filter(Boolean),
    slides: hero.slides.map(({ src, alt }) => ({ src: src.trim(), alt: alt.trim() })),
  };
}

function ButtonFields({
  id,
  title,
  value,
  errors,
  onChange,
}: {
  id: string;
  title: string;
  value: HeroLink;
  errors?: string[];
  onChange: (value: HeroLink) => void;
}) {
  return (
    <fieldset className="m-0 grid gap-3 rounded-xl border border-[var(--color-border)] p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <label htmlFor={`${id}-label`} className="mb-1 block text-xs font-semibold text-[var(--color-text-tertiary)]">
            Button text
          </label>
          <input
            id={`${id}-label`}
            required
            maxLength={40}
            value={value.label}
            onChange={(event) => onChange({ ...value, label: event.target.value })}
            className={`${inputClass} ${borderFor(errors)}`}
          />
        </div>
        <div>
          <label htmlFor={`${id}-href`} className="mb-1 block text-xs font-semibold text-[var(--color-text-tertiary)]">
            Opens
          </label>
          <input
            id={`${id}-href`}
            required
            list="hero-site-pages"
            value={value.href}
            onChange={(event) => onChange({ ...value, href: event.target.value })}
            placeholder="/request-a-nurse or https://…"
            className={`${inputClass} ${borderFor(errors)}`}
          />
        </div>
      </div>
      {errors?.length ? (
        <p className="m-0 text-sm text-[var(--color-error)]" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </fieldset>
  );
}

function PhotoPicker({
  target,
  usedSources,
  onPick,
  onClose,
}: {
  target: PickerTarget | null;
  usedSources: Set<string>;
  onPick: (src: string, alt: string) => void;
  onClose: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (target) setError("");
  }, [target]);

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
    <Dialog open={target !== null} onOpenChange={(open) => (!open && !uploading ? onClose() : undefined)}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="border-b border-[var(--color-border)] px-6 py-5 pr-12">
          <DialogTitle>{target?.mode === "replace" ? "Replace photo" : "Add a photo"}</DialogTitle>
          <DialogDescription className="mt-1">
            Upload your own photo or pick one already on the website. Landscape photos look best.
          </DialogDescription>
        </div>
        <div className="grid max-h-[70dvh] gap-5 overflow-y-auto px-6 py-5">
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="hero-photo-upload"
              disabled={uploading}
              onChange={(event) => void upload(event.target.files?.[0])}
            />
            <label
              htmlFor="hero-photo-upload"
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-page)] px-4 py-6 text-center hover:border-[var(--bhsk-blue)] ${uploading ? "pointer-events-none opacity-70" : ""}`}
            >
              {uploading ? (
                <LoaderCircle className="size-6 animate-spin text-[var(--bhsk-blue-text)]" />
              ) : (
                <Upload className="size-6 text-[var(--bhsk-blue-text)]" />
              )}
              <span className="text-sm font-semibold">{uploading ? "Uploading…" : "Upload from your computer"}</span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                JPEG, PNG or WebP. Large photos are resized automatically.
              </span>
            </label>
            {error ? (
              <p className="m-0 mt-2 text-sm text-[var(--color-error)]" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div>
            <p className="m-0 mb-2 text-sm font-semibold">Website photos</p>
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
      </DialogContent>
    </Dialog>
  );
}

export function HeroSettingsPage() {
  const [saved, setSaved] = useState<HomeHeroRecord | null>(null);
  const [form, setForm] = useState<HomeHero | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [justSaved, setJustSaved] = useState(false);
  const [picker, setPicker] = useState<PickerTarget | null>(null);
  const focusAfterPickRef = useRef<string | null>(null);

  async function load() {
    setLoadError("");
    try {
      const record = await fetchHomeHero();
      setSaved(record);
      setForm(withoutTimestamp(record));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load the hero section");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const dirty =
    form !== null && saved !== null && JSON.stringify(cleanHero(form)) !== JSON.stringify(withoutTimestamp(saved));

  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    if (picker || !focusAfterPickRef.current) return;
    const id = focusAfterPickRef.current;
    focusAfterPickRef.current = null;
    // Wait for the dialog to finish returning focus before moving it to the new photo's description.
    window.setTimeout(() => document.getElementById(id)?.focus(), 50);
  }, [picker, form]);

  function update<K extends keyof HomeHero>(key: K, value: HomeHero[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setJustSaved(false);
  }

  function updateSlides(change: (slides: HomeHero["slides"]) => HomeHero["slides"]) {
    if (form) update("slides", change(form.slides));
  }

  function moveSlide(index: number, offset: number) {
    updateSlides((slides) => {
      const next = [...slides];
      const [item] = next.splice(index, 1);
      next.splice(index + offset, 0, item);
      return next;
    });
  }

  function pickPhoto(src: string, alt: string) {
    if (!form || !picker) return;
    const index = picker.mode === "add" ? form.slides.length : picker.index;
    updateSlides((slides) =>
      picker.mode === "add"
        ? [...slides, { src, alt }]
        : slides.map((slide, i) => (i === picker.index ? { src, alt } : slide)),
    );
    if (!alt) focusAfterPickRef.current = `hero-slide-alt-${index}`;
    setPicker(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const record = await saveHomeHero(cleanHero(form));
      setSaved(record);
      setForm(withoutTimestamp(record));
      setJustSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save the hero section");
      if (err instanceof AdminApiError) setFieldErrors(err.fieldErrors as FieldErrors);
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <LoadError title="Couldn't load the hero section" message={loadError} onRetry={() => void load()} />;
  }

  if (!form || !saved) return <LoadingCards />;

  return (
    <form onSubmit={submit} className="grid gap-6 pb-24">
      <FormError message={error} />

      <Card title="Headline and text" description="The first thing visitors read at the top of the home page.">
        <Field
          label="Tagline"
          htmlFor="hero-tagline"
          hint="Small text above the headline. Leave empty to hide it."
          errors={fieldErrors.tagline}
        >
          <input
            id="hero-tagline"
            maxLength={80}
            value={form.tagline}
            onChange={(event) => update("tagline", event.target.value)}
            className={`${inputClass} ${borderFor(fieldErrors.tagline)}`}
          />
        </Field>
        <Field
          label="Headline"
          htmlFor="hero-title"
          hint="The main heading of the page — also important for Google. Keep it short and clear."
          errors={fieldErrors.title}
        >
          <textarea
            id="hero-title"
            required
            rows={2}
            maxLength={120}
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            className={`${textareaClass} ${borderFor(fieldErrors.title)} text-base font-semibold`}
          />
        </Field>
        <Field
          label="Subheading"
          htmlFor="hero-subtitle"
          hint="Shown under the headline. Leave empty to hide it."
          errors={fieldErrors.subtitle}
        >
          <input
            id="hero-subtitle"
            maxLength={120}
            value={form.subtitle}
            onChange={(event) => update("subtitle", event.target.value)}
            className={`${inputClass} ${borderFor(fieldErrors.subtitle)}`}
          />
        </Field>
        <Field
          label="Description"
          htmlFor="hero-description"
          hint={`${form.description.trim().length}/400 characters. Leave empty to hide it.`}
          errors={fieldErrors.description}
        >
          <textarea
            id="hero-description"
            rows={3}
            maxLength={400}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            className={`${textareaClass} ${borderFor(fieldErrors.description)}`}
          />
        </Field>
      </Card>

      <Card
        title="Buttons"
        description="Use a website page (pick from the suggestions) or a full link starting with https://."
      >
        <datalist id="hero-site-pages">
          {SITE_PAGES.map((page) => (
            <option key={page.path} value={page.path}>
              {page.label}
            </option>
          ))}
        </datalist>
        <ButtonFields
          id="hero-primary"
          title="Main button (blue)"
          value={form.primaryButton}
          errors={fieldErrors.primaryButton}
          onChange={(value) => update("primaryButton", value)}
        />
        <ButtonFields
          id="hero-secondary"
          title="Second button"
          value={form.secondaryButton}
          errors={fieldErrors.secondaryButton}
          onChange={(value) => update("secondaryButton", value)}
        />
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.showCallButton}
            onChange={(event) => update("showCallButton", event.target.checked)}
            className="mt-0.5 size-4 cursor-pointer accent-[var(--bhsk-blue-text)]"
          />
          <span>
            <span className="font-semibold">Show the call link</span>
            <span className="block text-xs text-[var(--color-text-tertiary)]">
              Uses the main phone number from Site settings.
            </span>
          </span>
        </label>
      </Card>

      <Card title="Highlights" description="Short points with a tick, shown under the buttons.">
        <ListField
          label="Highlights"
          hint={`Up to ${HOME_HERO_LIMITS.highlights}. Remove them all to hide this row.`}
          errors={fieldErrors.highlights}
          values={form.highlights}
          min={0}
          max={HOME_HERO_LIMITS.highlights}
          maxLength={60}
          placeholder="e.g. Assessment before every placement"
          addLabel="Add highlight"
          rowLabel={(index) => `Highlight ${index + 1}`}
          onChange={(highlights) => update("highlights", highlights)}
        />
      </Card>

      <Card
        title="Photos"
        description="The slideshow next to the headline. Photos change every few seconds, in this order."
      >
        <ol className="m-0 grid list-none gap-3 p-0">
          {form.slides.map((slide, index) => (
            <li
              key={`${index}-${slide.src}`}
              className="grid gap-3 rounded-xl border border-[var(--color-border)] p-3 sm:grid-cols-[200px_minmax(0,1fr)]"
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={resolveImageSrc(slide.src)}
                  alt=""
                  className="block aspect-[4/3] w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-[var(--bhsk-ink)]">
                  {index === 0 ? "1 · shown first" : index + 1}
                </span>
              </div>
              <div className="grid content-between gap-3">
                <Field
                  label="Photo description"
                  htmlFor={`hero-slide-alt-${index}`}
                  hint="Describe what's in the photo — read aloud by screen readers and used by Google."
                >
                  <input
                    id={`hero-slide-alt-${index}`}
                    required
                    maxLength={200}
                    value={slide.alt}
                    onChange={(event) =>
                      updateSlides((slides) =>
                        slides.map((item, i) => (i === index ? { ...item, alt: event.target.value } : item)),
                      )
                    }
                    placeholder="e.g. BHSK nurse checking an elderly patient's blood pressure at home"
                    className={`${inputClass} ${borderFor(!slide.alt.trim() ? fieldErrors.slides : undefined)}`}
                  />
                </Field>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className={iconButtonClass}
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move photo ${index + 1} earlier`}
                    title="Move earlier"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    className={iconButtonClass}
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === form.slides.length - 1}
                    aria-label={`Move photo ${index + 1} later`}
                    title="Move later"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPicker({ mode: "replace", index })}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-[var(--color-surface-page)]"
                  >
                    <Replace className="size-4" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSlides((slides) => slides.filter((_, i) => i !== index))}
                    disabled={form.slides.length <= 1}
                    className="ml-auto inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-3 text-sm font-semibold text-[var(--color-text-tertiary)] hover:bg-red-50 hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
                    title={form.slides.length <= 1 ? "The hero needs at least one photo" : undefined}
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {fieldErrors.slides?.length ? (
          <p className="m-0 text-sm text-[var(--color-error)]" role="alert">
            {fieldErrors.slides[0]}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {form.slides.length < HOME_HERO_LIMITS.slides ? (
            <button
              type="button"
              onClick={() => setPicker({ mode: "add" })}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--bhsk-blue)] bg-white px-4 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)]"
            >
              <ImagePlus className="size-4" /> Add photo
            </button>
          ) : (
            <span className="text-sm text-[var(--color-text-tertiary)]">
              Up to {HOME_HERO_LIMITS.slides} photos — remove one to add another.
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--bhsk-blue-text)]"
          >
            <ExternalLink className="size-4" /> View home page
          </a>
        </div>
      </Card>

      <SaveBar
        dirty={dirty}
        saving={saving}
        justSaved={justSaved}
        updatedAt={saved.updatedAt}
        pristineLabel="Showing the original hero content"
        resetLabel="Original content"
        resetTitle="Fill the form with the original hero content (not saved until you press Save)"
        onReset={() => {
          setForm(DEFAULT_HOME_HERO);
          setFieldErrors({});
          setJustSaved(false);
        }}
        onDiscard={() => {
          setForm(withoutTimestamp(saved));
          setFieldErrors({});
          setError("");
        }}
      />

      <PhotoPicker
        target={picker}
        usedSources={new Set(form.slides.map((slide) => slide.src))}
        onPick={pickPhoto}
        onClose={() => setPicker(null)}
      />
    </form>
  );
}
