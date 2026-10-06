import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ExternalLink, ImagePlus, LoaderCircle, Replace, Trash2, Upload } from "lucide-react";
import { DEFAULT_HOME_HERO, HOME_HERO_LIMITS, type HeroLink, type HeroSlide, type HomeHero } from "@shared/homeHero";
import { resolveImageSrc } from "@/lib/siteSettings";
import { fetchHomeHero, saveHomeHero, uploadImage } from "./api";
import { HERO_PHOTO_LIBRARY, prepareImageForUpload } from "./heroImages";
import {
  Card,
  DisplayRow,
  EditButton,
  EditDialog,
  EmptyValue,
  Field,
  FormError,
  ListField,
  LoadError,
  LoadingCards,
  SettingsStatus,
  borderFor,
  inputClass,
  stripTimestamp,
  textareaClass,
  useSettingsEditor,
} from "./settingsForm";

type TextKey = "tagline" | "title" | "subtitle" | "description";
type ButtonKey = "primaryButton" | "secondaryButton";
type EditorKey = TextKey | ButtonKey | "showCallButton" | "highlights" | "slide" | "removeSlide" | "restore";

/** Which photo the photo popup is editing: an existing index, or null for a new one. */
type SlideEdit = { index: number | null; slide: HeroSlide; choosing: boolean };

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

const TEXT_FIELDS: Record<
  TextKey,
  { label: string; hint: string; maxLength: number; required?: boolean; multiline?: number }
> = {
  tagline: { label: "Tagline", hint: "Small text above the headline. Leave empty to hide it.", maxLength: 80 },
  title: {
    label: "Headline",
    hint: "The main heading of the page — also important for Google. Keep it short and clear.",
    maxLength: 120,
    required: true,
    multiline: 2,
  },
  subtitle: { label: "Subheading", hint: "Shown under the headline. Leave empty to hide it.", maxLength: 120 },
  description: {
    label: "Description",
    hint: "The paragraph under the subheading. Leave empty to hide it.",
    maxLength: 400,
    multiline: 4,
  },
};

const BUTTONS: Record<ButtonKey, string> = { primaryButton: "Main button (blue)", secondaryButton: "Second button" };

const iconButtonClass =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)] disabled:cursor-not-allowed disabled:opacity-40";

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
  value,
  errors,
  onChange,
}: {
  id: string;
  value: HeroLink;
  errors?: string[];
  onChange: (value: HeroLink) => void;
}) {
  return (
    <>
      <datalist id="hero-site-pages">
        {SITE_PAGES.map((page) => (
          <option key={page.path} value={page.path}>
            {page.label}
          </option>
        ))}
      </datalist>
      <Field label="Button text" htmlFor={`${id}-label`}>
        <input
          id={`${id}-label`}
          required
          autoFocus
          maxLength={40}
          value={value.label}
          onChange={(event) => onChange({ ...value, label: event.target.value })}
          className={`${inputClass} ${borderFor(errors)}`}
        />
      </Field>
      <Field
        label="Opens"
        htmlFor={`${id}-href`}
        hint="Pick a website page from the suggestions, or paste a full link starting with https://."
        errors={errors}
      >
        <input
          id={`${id}-href`}
          required
          list="hero-site-pages"
          value={value.href}
          onChange={(event) => onChange({ ...value, href: event.target.value })}
          placeholder="/request-a-nurse or https://…"
          className={`${inputClass} ${borderFor(errors)}`}
        />
      </Field>
    </>
  );
}

function PhotoChooser({
  usedSources,
  onPick,
  onBack,
}: {
  usedSources: Set<string>;
  onPick: (src: string, alt: string) => void;
  onBack?: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
            JPEG, PNG or WebP. Landscape photos look best; large photos are resized automatically.
          </span>
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

export function HeroSettingsPage() {
  const editor = useSettingsEditor<HomeHero, EditorKey>({
    load: fetchHomeHero,
    save: saveHomeHero,
    clean: cleanHero,
  });
  const { saved, draft, editing, lastEdited, saving, error, fieldErrors, startEdit, cancelEdit, updateDraft, commit } =
    editor;
  const [slideEdit, setSlideEdit] = useState<SlideEdit | null>(null);
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  if (editor.loadError) {
    return (
      <LoadError title="Couldn't load the hero section" message={editor.loadError} onRetry={() => void editor.reload()} />
    );
  }

  if (!saved) return <LoadingCards />;

  const current = stripTimestamp<HomeHero>(saved);
  const slides = current.slides;
  const usedSources = new Set(slides.map((slide) => slide.src));

  function openSlide(index: number | null) {
    setSlideEdit({
      index,
      slide: index === null ? { src: "", alt: "" } : slides[index],
      choosing: index === null,
    });
    startEdit("slide");
  }

  function saveSlide() {
    if (!slideEdit?.slide.src) return;
    const { index, slide } = slideEdit;
    void commit({
      ...current,
      slides: index === null ? [...slides, slide] : slides.map((item, i) => (i === index ? slide : item)),
    });
  }

  function moveSlide(index: number, offset: number) {
    const next = [...slides];
    const [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    void commit({ ...current, slides: next });
  }

  function renderEditor(key: EditorKey, form: HomeHero) {
    switch (key) {
      case "tagline":
      case "title":
      case "subtitle":
      case "description": {
        const config = TEXT_FIELDS[key];
        const common = {
          id: `hero-${key}`,
          autoFocus: true,
          required: config.required,
          maxLength: config.maxLength,
          value: form[key],
          className: `${config.multiline ? textareaClass : inputClass} ${borderFor(fieldErrors[key])}`,
        };
        return (
          <Field
            label={config.label}
            htmlFor={common.id}
            hint={`${config.hint} (${form[key].trim().length}/${config.maxLength})`}
            errors={fieldErrors[key]}
          >
            {config.multiline ? (
              <textarea
                {...common}
                rows={config.multiline}
                onChange={(event) => updateDraft(key, event.target.value)}
              />
            ) : (
              <input {...common} onChange={(event) => updateDraft(key, event.target.value)} />
            )}
          </Field>
        );
      }
      case "primaryButton":
      case "secondaryButton":
        return (
          <ButtonFields
            id={`hero-${key}`}
            value={form[key]}
            errors={fieldErrors[key]}
            onChange={(value) => updateDraft(key, value)}
          />
        );
      case "showCallButton":
        return (
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              autoFocus
              checked={form.showCallButton}
              onChange={(event) => updateDraft("showCallButton", event.target.checked)}
              className="mt-0.5 size-4 cursor-pointer accent-[var(--bhsk-blue-text)]"
            />
            <span>
              <span className="font-semibold">Show the call link next to the buttons</span>
              <span className="block text-xs text-[var(--color-text-tertiary)]">
                Uses the main phone number from Site settings.
              </span>
            </span>
          </label>
        );
      case "highlights":
        return (
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
            onChange={(highlights) => updateDraft("highlights", highlights)}
          />
        );
      default:
        return null;
    }
  }

  const fieldTitle = (key: EditorKey | null) => {
    if (!key) return "";
    if (key in TEXT_FIELDS) return `Edit ${TEXT_FIELDS[key as TextKey].label.toLowerCase()}`;
    if (key in BUTTONS) return `Edit ${BUTTONS[key as ButtonKey].toLowerCase()}`;
    if (key === "showCallButton") return "Edit call link";
    if (key === "highlights") return "Edit highlights";
    return "";
  };
  const isFieldEditor = (key: EditorKey | null) =>
    key !== null && key !== "slide" && key !== "removeSlide" && key !== "restore";

  return (
    <div className="grid gap-6">
      <SettingsStatus
        updatedAt={saved.updatedAt}
        justSaved={editor.justSaved}
        pristineLabel="Showing the original hero content"
        restoreLabel="Restore original content"
        onRestore={() => startEdit("restore")}
        disabled={saving}
      />
      {!editing ? <FormError message={error} /> : null}

      <Card title="Headline and text" description="The first thing visitors read at the top of the home page.">
        {(Object.keys(TEXT_FIELDS) as TextKey[]).map((key) => (
          <DisplayRow key={key} label={TEXT_FIELDS[key].label} onEdit={() => startEdit(key)}>
            {current[key] ? (
              <span className={key === "title" ? "text-base font-semibold" : undefined}>{current[key]}</span>
            ) : (
              <EmptyValue />
            )}
          </DisplayRow>
        ))}
      </Card>

      <Card title="Buttons" description="The call-to-action buttons under the description.">
        {(Object.keys(BUTTONS) as ButtonKey[]).map((key) => (
          <DisplayRow key={key} label={BUTTONS[key]} onEdit={() => startEdit(key)}>
            <span className="font-semibold">{current[key].label}</span>
            <span className="block text-xs text-[var(--color-text-tertiary)]">Opens {current[key].href}</span>
          </DisplayRow>
        ))}
        <DisplayRow label="Call link" onEdit={() => startEdit("showCallButton")}>
          {current.showCallButton ? "Shown — uses the main phone number from Site settings" : <EmptyValue />}
        </DisplayRow>
      </Card>

      <Card title="Highlights" description="Short points with a tick, shown under the buttons.">
        <DisplayRow label="Highlights" onEdit={() => startEdit("highlights")}>
          {current.highlights.length ? (
            <ul className="m-0 grid list-none gap-1 p-0">
              {current.highlights.map((item, index) => (
                <li key={`${index}-${item}`} className="flex items-center gap-2">
                  <Check className="size-3.5 text-[var(--bhsk-blue-text)]" /> {item}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyValue />
          )}
        </DisplayRow>
      </Card>

      <Card
        title="Photos"
        description="The slideshow next to the headline. Photos change every few seconds, in this order."
        bodyClassName="mt-5 grid gap-3"
        action={
          slides.length < HOME_HERO_LIMITS.slides ? (
            <button
              type="button"
              onClick={() => openSlide(null)}
              disabled={saving}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-[var(--bhsk-blue-text)] px-3 text-sm font-semibold text-white hover:bg-[var(--bhsk-blue-deep)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ImagePlus className="size-4" /> Add photo
            </button>
          ) : (
            <span className="text-xs text-[var(--color-text-tertiary)]">Up to {HOME_HERO_LIMITS.slides} photos</span>
          )
        }
      >
        <ol className="m-0 grid list-none gap-3 p-0">
          {slides.map((slide, index) => (
            <li
              key={`${index}-${slide.src}`}
              className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-[var(--color-border)] p-3 sm:flex sm:items-center"
            >
              <div className="relative overflow-hidden rounded-lg bg-slate-100 sm:w-40 sm:shrink-0">
                <img src={resolveImageSrc(slide.src)} alt="" className="block aspect-[4/3] w-full object-cover" />
                <span className="absolute top-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-[var(--bhsk-ink)] sm:top-2 sm:left-2 sm:text-xs">
                  {index + 1}
                  {index === 0 ? <span className="hidden sm:inline"> · shown first</span> : null}
                </span>
              </div>
              <div className="min-w-0 sm:flex-1">
                <p className="m-0 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                  {index === 0 ? (
                    <>
                      <span className="sm:hidden">Shown first</span>
                      <span className="hidden sm:inline">Photo description</span>
                    </>
                  ) : (
                    "Photo description"
                  )}
                </p>
                <p className="m-0 mt-1 line-clamp-3 text-sm break-words sm:line-clamp-none">{slide.alt}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2 border-t border-[var(--color-border)] pt-3 sm:col-span-1 sm:shrink-0 sm:border-0 sm:pt-0">
                <button
                  type="button"
                  className={iconButtonClass}
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0 || saving}
                  aria-label={`Move photo ${index + 1} earlier`}
                  title="Move earlier"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  className={iconButtonClass}
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === slides.length - 1 || saving}
                  aria-label={`Move photo ${index + 1} later`}
                  title="Move later"
                >
                  <ArrowDown className="size-4" />
                </button>
                <EditButton
                  label={`Edit photo ${index + 1}`}
                  onClick={() => openSlide(index)}
                  disabled={saving}
                  className="ml-auto sm:ml-0"
                />
                <button
                  type="button"
                  className={`${iconButtonClass} hover:bg-red-50 hover:text-[var(--color-error)]`}
                  onClick={() => {
                    setRemoveIndex(index);
                    startEdit("removeSlide");
                  }}
                  disabled={slides.length <= 1 || saving}
                  aria-label={`Remove photo ${index + 1}`}
                  title={slides.length <= 1 ? "The hero needs at least one photo" : "Remove"}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--bhsk-blue-text)]"
        >
          <ExternalLink className="size-4" /> View home page
        </a>
      </Card>

      <EditDialog
        open={isFieldEditor(editing)}
        title={fieldTitle(lastEdited)}
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => draft && void commit(draft)}
      >
        {isFieldEditor(lastEdited) && draft && lastEdited ? renderEditor(lastEdited, draft) : null}
      </EditDialog>

      <EditDialog
        open={editing === "slide"}
        wide={slideEdit?.choosing}
        title={
          slideEdit?.choosing
            ? slideEdit.index === null
              ? "Add a photo"
              : "Change photo"
            : slideEdit?.index === null
              ? "Describe the new photo"
              : `Edit photo ${(slideEdit?.index ?? 0) + 1}`
        }
        description={
          slideEdit?.choosing
            ? "Upload your own photo or pick one already on the website."
            : "Check the photo and describe what's in it."
        }
        saveLabel={slideEdit?.index === null ? "Add photo" : "Save"}
        hideFooter={slideEdit?.choosing}
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={saveSlide}
      >
        {slideEdit?.choosing ? (
          <PhotoChooser
            usedSources={usedSources}
            onBack={slideEdit.slide.src ? () => setSlideEdit({ ...slideEdit, choosing: false }) : undefined}
            onPick={(src, alt) =>
              setSlideEdit({
                ...slideEdit,
                choosing: false,
                // An uploaded photo needs a fresh description; library photos come with one.
                slide: { src, alt: alt || (src === slideEdit.slide.src ? slideEdit.slide.alt : "") },
              })
            }
          />
        ) : slideEdit ? (
          <>
            <div className="relative overflow-hidden rounded-xl bg-slate-100">
              <img
                src={resolveImageSrc(slideEdit.slide.src)}
                alt=""
                className="block aspect-[16/10] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSlideEdit({ ...slideEdit, choosing: true })}
                className="absolute right-3 bottom-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white/95 px-3 text-sm font-semibold text-[var(--bhsk-ink)] shadow-sm hover:bg-white"
              >
                <Replace className="size-4" /> Change photo
              </button>
            </div>
            <Field
              label="Photo description"
              htmlFor="hero-slide-alt"
              hint="Describe what's in the photo — read aloud by screen readers and used by Google."
              errors={fieldErrors.slides}
            >
              <textarea
                id="hero-slide-alt"
                required
                autoFocus
                rows={3}
                maxLength={200}
                value={slideEdit.slide.alt}
                onChange={(event) =>
                  setSlideEdit({
                    ...slideEdit,
                    slide: { ...slideEdit.slide, alt: event.target.value.replace(/\s*\n\s*/g, " ") },
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="e.g. BHSK nurse checking an elderly patient's blood pressure at home"
                className={`${textareaClass} resize-none ${borderFor(fieldErrors.slides)}`}
              />
            </Field>
          </>
        ) : null}
      </EditDialog>

      <EditDialog
        open={editing === "removeSlide"}
        title={`Remove photo ${(removeIndex ?? 0) + 1}?`}
        description="It will no longer appear in the home page slideshow."
        saveLabel="Remove photo"
        tone="danger"
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() =>
          removeIndex !== null && void commit({ ...current, slides: slides.filter((_, i) => i !== removeIndex) })
        }
      >
        {removeIndex !== null && slides[removeIndex] ? (
          <img
            src={resolveImageSrc(slides[removeIndex].src)}
            alt={slides[removeIndex].alt}
            className="block aspect-[16/10] w-full rounded-xl bg-slate-100 object-contain"
          />
        ) : null}
      </EditDialog>

      <EditDialog
        open={editing === "restore"}
        title="Restore the original hero?"
        description="The headline, text, buttons, highlights and photos go back to the website's original content."
        saveLabel="Restore original"
        tone="danger"
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => void commit(DEFAULT_HOME_HERO)}
      />
    </div>
  );
}
