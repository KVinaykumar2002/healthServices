import { useCallback, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ExternalLink, Eye, EyeOff, Replace, Trash2, X } from "lucide-react";
import {
  DEFAULT_SERVICES,
  DEFAULT_SERVICE_ID_PREFIX,
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
  SERVICE_ICONS,
  SERVICE_LIMITS,
  SERVICE_TEXT_LIMITS as MAX,
  servicePath,
  type ServiceContent,
} from "@shared/services";
import { SERVICE_ICON_COMPONENTS } from "@/lib/serviceIcons";
import { resolveImageSrc } from "@/lib/siteSettings";
import { deleteService, fetchService, saveService, type ServiceRecord } from "./api";
import { PhotoChooser } from "./PhotoChooser";
import {
  Card,
  DisplayRow,
  EditDialog,
  EmptyValue,
  Field,
  FormError,
  ListField,
  LoadError,
  LoadingCards,
  PairListField,
  SettingsStatus,
  borderFor,
  inputClass,
  stripTimestamp,
  textareaClass,
  useSettingsEditor,
} from "./settingsForm";

type TextKey = "name" | "menuLabel" | "slug" | "text" | "eyebrow" | "h1" | "heroCtaLabel" | "seoTitle" | "seoDescription";
type EditorKey =
  | TextKey
  | "category"
  | "icon"
  | "cardPhoto"
  | "pagePhoto"
  | "intro"
  | "audience"
  | "scope"
  | "coverage"
  | "process"
  | "trust"
  | "faqs"
  | "related"
  | "visibility"
  | "delete"
  | "restore";

const TEXT_FIELDS: Record<
  TextKey,
  { label: string; hint: string; maxLength: number; required?: boolean; multiline?: number }
> = {
  name: {
    label: "Service name",
    hint: "Shown on the service cards, the page's breadcrumb and the service list of the enquiry forms.",
    maxLength: MAX.name,
    required: true,
  },
  menuLabel: {
    label: "Menu name",
    hint: "A short name for the “Our services” menu at the top of the website.",
    maxLength: MAX.menuLabel,
    required: true,
  },
  slug: {
    label: "Web address",
    hint: "Lowercase letters, numbers and dashes. Changing it changes the page's link, so old links and bookmarks stop working.",
    maxLength: MAX.slug,
    required: true,
  },
  text: {
    label: "Card description",
    hint: "One or two sentences under the name on the service cards.",
    maxLength: MAX.text,
    required: true,
    multiline: 3,
  },
  eyebrow: {
    label: "Small heading",
    hint: "Small capitals above the page title. Leave empty to hide it.",
    maxLength: MAX.eyebrow,
  },
  h1: {
    label: "Page title",
    hint: "The main heading of the page — also important for Google.",
    maxLength: MAX.h1,
    required: true,
    multiline: 2,
  },
  heroCtaLabel: {
    label: "Button text",
    hint: "The request button on the page. It opens Request a Nurse (home care) or Request Staff (healthcare staffing) with this service selected.",
    maxLength: MAX.heroCtaLabel,
    required: true,
  },
  seoTitle: {
    label: "Google title",
    hint: "Shown as the link in Google results and on the browser tab. Around 50–60 characters works best.",
    maxLength: MAX.seoTitle,
    required: true,
  },
  seoDescription: {
    label: "Google description",
    hint: "The summary under the link in Google results. Around 150–160 characters works best.",
    maxLength: MAX.seoDescription,
    required: true,
    multiline: 4,
  },
};

const DIALOG_TITLES: Partial<Record<EditorKey, string>> = {
  category: "Edit group",
  icon: "Edit menu icon",
  intro: "Edit introduction",
  audience: "Edit “Who it's for”",
  scope: "Edit what's included",
  coverage: "Edit coverage",
  process: "Edit how it works",
  trust: "Edit standards",
  faqs: "Edit questions",
  related: "Edit related services",
};

const WIDE: EditorKey[] = ["icon", "intro", "audience", "scope", "coverage", "process", "trust", "faqs", "related"];

const clean = (value: string) => value.trim();
const cleanList = (values: string[]) => values.map(clean).filter(Boolean);

function sortedJson(value: unknown): string {
  return JSON.stringify(value, (_key, inner) =>
    inner && typeof inner === "object" && !Array.isArray(inner)
      ? Object.fromEntries(Object.entries(inner).sort(([a], [b]) => a.localeCompare(b)))
      : inner,
  );
}

/** Compares content regardless of key order (stored documents and the defaults order keys differently). */
function sameContent(a: ServiceContent, b: ServiceContent) {
  return sortedJson(a) === sortedJson(b);
}

/** Trims every value and drops empty rows, matching what the server stores. */
function cleanService(service: ServiceContent): ServiceContent {
  return {
    ...service,
    slug: clean(service.slug),
    name: clean(service.name),
    menuLabel: clean(service.menuLabel),
    text: clean(service.text),
    cardImageUrl: clean(service.cardImageUrl),
    imageUrl: clean(service.imageUrl),
    imageAlt: clean(service.imageAlt),
    eyebrow: clean(service.eyebrow),
    h1: clean(service.h1),
    intro: cleanList(service.intro),
    heroCtaLabel: clean(service.heroCtaLabel),
    seoTitle: clean(service.seoTitle),
    seoDescription: clean(service.seoDescription),
    audience: { heading: clean(service.audience.heading), items: cleanList(service.audience.items) },
    scopeHeading: clean(service.scopeHeading),
    scope: {
      included: cleanList(service.scope.included),
      notIncluded: cleanList(service.scope.notIncluded),
      scopeNote: clean(service.scope.scopeNote),
    },
    coverage: { heading: clean(service.coverage.heading), paragraphs: cleanList(service.coverage.paragraphs) },
    process: {
      heading: clean(service.process.heading),
      intro: clean(service.process.intro),
      whoContacts: clean(service.process.whoContacts),
      steps: service.process.steps
        .map((step) => ({ title: clean(step.title), text: clean(step.text) }))
        .filter((step) => step.title || step.text),
    },
    trust: {
      heading: clean(service.trust.heading),
      paragraphs: cleanList(service.trust.paragraphs),
      facts: cleanList(service.trust.facts),
    },
    faqHeading: clean(service.faqHeading),
    faqs: service.faqs
      .map((faq) => ({ question: clean(faq.question), answer: clean(faq.answer) }))
      .filter((faq) => faq.question || faq.answer),
  };
}

function TextList({ items, icon = "check" }: { items: string[]; icon?: "check" | "cross" }) {
  if (!items.length) return <EmptyValue />;
  const Icon = icon === "check" ? Check : X;
  return (
    <ul className="m-0 grid list-none gap-1 p-0">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <Icon
            className={`mt-0.5 size-3.5 shrink-0 ${icon === "check" ? "text-[var(--bhsk-blue-text)]" : "text-[var(--color-text-tertiary)]"}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  if (!items.length) return <EmptyValue />;
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <p key={index} className="m-0">
          {item}
        </p>
      ))}
    </div>
  );
}

function Heading({ children }: { children: string }) {
  return children ? <p className="m-0 mb-1.5 font-semibold">{children}</p> : null;
}

function TextInput({
  id,
  label,
  hint,
  value,
  maxLength,
  errors,
  autoFocus,
  multiline,
  required,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  maxLength: number;
  errors?: string[];
  autoFocus?: boolean;
  multiline?: number;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const common = {
    id,
    value,
    maxLength,
    autoFocus,
    required,
    className: `${multiline ? textareaClass : inputClass} ${borderFor(errors)}`,
  };
  return (
    <Field label={label} htmlFor={id} hint={hint} errors={errors}>
      {multiline ? (
        <textarea {...common} rows={multiline} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input {...common} onChange={(event) => onChange(event.target.value)} />
      )}
    </Field>
  );
}

function PhotoPreview({ src, onChange }: { src: string; onChange: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-100">
      <img src={resolveImageSrc(src)} alt="" className="block aspect-[16/10] w-full object-contain" />
      <button
        type="button"
        onClick={onChange}
        className="absolute right-3 bottom-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white/95 px-3 text-sm font-semibold text-[var(--bhsk-ink)] shadow-sm hover:bg-white"
      >
        <Replace className="size-4" /> Change photo
      </button>
    </div>
  );
}

const headerButtonClass =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-[var(--color-surface-page)] disabled:cursor-not-allowed disabled:opacity-50";

export function ServiceEditor({
  id,
  services,
  onBack,
}: {
  id: string;
  /** Every service, for picking related services. */
  services: ServiceRecord[];
  onBack: () => void;
}) {
  const load = useCallback(async () => {
    const { id: _id, ...service } = await fetchService(id);
    return service;
  }, [id]);
  const save = useCallback(async (service: ServiceContent) => {
    const { id: _id, ...saved } = await saveService(id, service);
    return saved;
  }, [id]);

  const editor = useSettingsEditor<ServiceContent, EditorKey>({ load, save, clean: cleanService });
  const { saved, draft, editing, lastEdited, saving, error, fieldErrors, startEdit, cancelEdit, updateDraft, commit } =
    editor;
  const [choosingPhoto, setChoosingPhoto] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  if (editor.loadError) {
    return (
      <div className="grid gap-4">
        <BackLink onBack={onBack} />
        <LoadError title="Couldn't load this service" message={editor.loadError} onRetry={() => void editor.reload()} />
      </div>
    );
  }
  if (!saved) return <LoadingCards />;

  const current = stripTimestamp<ServiceContent>(saved);
  const original = id.startsWith(DEFAULT_SERVICE_ID_PREFIX)
    ? DEFAULT_SERVICES.find((service) => service.slug === id.slice(DEFAULT_SERVICE_ID_PREFIX.length))
    : undefined;
  const isOriginal = original ? sameContent(current, original) : false;
  const others = services.filter((service) => service.id !== id);
  const CurrentIcon = SERVICE_ICON_COMPONENTS[current.icon];
  const isHome = current.category === "home";

  function openPhoto(key: "cardPhoto" | "pagePhoto") {
    setChoosingPhoto(false);
    startEdit(key);
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteService(id);
      onBack();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Unable to delete. Please try again.");
      setDeleting(false);
    }
  }

  function renderEditor(key: EditorKey, form: ServiceContent) {
    if (key in TEXT_FIELDS) {
      const textKey = key as TextKey;
      const config = TEXT_FIELDS[textKey];
      const value = form[textKey];
      return (
        <TextInput
          id={`service-${textKey}`}
          label={config.label}
          hint={
            textKey === "slug"
              ? `${config.hint} Page address: ${servicePath(value || "…")}`
              : `${config.hint} (${value.trim().length}/${config.maxLength})`
          }
          value={value}
          maxLength={config.maxLength}
          errors={fieldErrors[textKey]}
          multiline={config.multiline}
          required={config.required}
          autoFocus
          onChange={(next) =>
            updateDraft(textKey, textKey === "slug" ? next.toLowerCase().replace(/[\s_]+/g, "-") : next)
          }
        />
      );
    }

    switch (key) {
      case "category":
        return (
          <fieldset className="m-0 grid gap-2 border-0 p-0">
            <legend className="mb-1.5 text-sm font-semibold">Group</legend>
            {SERVICE_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-border)] p-3 text-sm has-[:checked]:border-[var(--bhsk-blue)] has-[:checked]:bg-[var(--color-surface-page)]"
              >
                <input
                  type="radio"
                  name="service-category"
                  checked={form.category === category}
                  onChange={() => updateDraft("category", category)}
                  className="mt-0.5 size-4 accent-[var(--bhsk-blue-text)]"
                />
                <span>
                  <span className="font-semibold">{SERVICE_CATEGORY_LABELS[category]}</span>
                  <span className="block text-xs text-[var(--color-text-tertiary)]">
                    {category === "home"
                      ? "For families. Its request button opens Request a Nurse."
                      : "For employers and facilities. Its request button opens Request Staff."}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        );
      case "icon":
        return (
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-sm font-semibold">Pick the icon shown next to “{form.menuLabel}” in the menu</legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {SERVICE_ICONS.map((icon) => {
                const Icon = SERVICE_ICON_COMPONENTS[icon];
                const selected = form.icon === icon;
                return (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateDraft("icon", icon)}
                    aria-pressed={selected}
                    aria-label={icon.replace(/-/g, " ")}
                    title={icon.replace(/-/g, " ")}
                    className={`flex aspect-square cursor-pointer items-center justify-center rounded-xl border ${
                      selected
                        ? "border-[var(--bhsk-blue)] bg-[var(--color-surface-page)] text-[var(--bhsk-blue-text)] ring-3 ring-[var(--bhsk-sky)]/30"
                        : "border-[var(--color-border)] bg-white text-[var(--bhsk-ink)] hover:bg-[var(--color-surface-page)]"
                    }`}
                  >
                    <Icon className="size-6" strokeWidth={1.65} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      case "cardPhoto":
      case "pagePhoto": {
        const field = key === "cardPhoto" ? "cardImageUrl" : "imageUrl";
        if (choosingPhoto) {
          return (
            <PhotoChooser
              usedSources={new Set([form[field]])}
              hint={
                key === "cardPhoto"
                  ? "JPEG, PNG or WebP. Portrait or square photos suit the cards; large photos are resized automatically."
                  : undefined
              }
              onBack={() => setChoosingPhoto(false)}
              onPick={(src, alt) => {
                updateDraft(field, src);
                if (key === "pagePhoto" && src !== form.imageUrl) updateDraft("imageAlt", alt);
                setChoosingPhoto(false);
              }}
            />
          );
        }
        return (
          <>
            <PhotoPreview src={form[field]} onChange={() => setChoosingPhoto(true)} />
            {fieldErrors[field] ? <FormError message={fieldErrors[field]![0]} /> : null}
            {key === "pagePhoto" ? (
              <TextInput
                id="service-image-alt"
                label="Photo description"
                hint="Describe what's in the photo — read aloud by screen readers and used by Google."
                value={form.imageAlt}
                maxLength={MAX.imageAlt}
                errors={fieldErrors.imageAlt}
                multiline={2}
                required
                autoFocus
                onChange={(value) => updateDraft("imageAlt", value.replace(/\s*\n\s*/g, " "))}
              />
            ) : (
              <p className="m-0 text-sm text-[var(--color-text-tertiary)]">
                The card uses the service name as its photo description.
              </p>
            )}
          </>
        );
      }
      case "intro":
        return (
          <ListField
            label="Paragraphs under the page title"
            hint={`Up to ${SERVICE_LIMITS.intro} paragraphs.`}
            errors={fieldErrors.intro}
            values={form.intro}
            min={0}
            max={SERVICE_LIMITS.intro}
            maxLength={MAX.paragraph}
            multiline={4}
            placeholder="e.g. BHSK provides home nursing in Qatar for people who…"
            addLabel="Add paragraph"
            rowLabel={(index) => `Paragraph ${index + 1}`}
            onChange={(intro) => updateDraft("intro", intro)}
          />
        );
      case "audience":
        return (
          <>
            <TextInput
              id="service-audience-heading"
              label="Heading"
              value={form.audience.heading}
              maxLength={MAX.heading}
              errors={fieldErrors.audience}
              autoFocus
              onChange={(heading) => updateDraft("audience", { ...form.audience, heading })}
            />
            <ListField
              label="Points"
              hint={`Up to ${SERVICE_LIMITS.audience}. Remove them all to hide this section.`}
              values={form.audience.items}
              min={0}
              max={SERVICE_LIMITS.audience}
              maxLength={MAX.listItem}
              autoFocus={false}
              placeholder="e.g. Families who want a nurse for a relative at home"
              addLabel="Add point"
              rowLabel={(index) => `Point ${index + 1}`}
              onChange={(items) => updateDraft("audience", { ...form.audience, items })}
            />
          </>
        );
      case "scope":
        return (
          <>
            <TextInput
              id="service-scope-heading"
              label="Heading"
              value={form.scopeHeading}
              maxLength={MAX.heading}
              errors={fieldErrors.scopeHeading}
              autoFocus
              onChange={(value) => updateDraft("scopeHeading", value)}
            />
            <TextInput
              id="service-scope-note"
              label="Note under the heading"
              hint="Leave empty to hide it."
              value={form.scope.scopeNote}
              maxLength={MAX.paragraph}
              errors={fieldErrors.scope}
              multiline={3}
              onChange={(scopeNote) => updateDraft("scope", { ...form.scope, scopeNote })}
            />
            <ListField
              label="Included"
              hint={`Up to ${SERVICE_LIMITS.scopeItems}.`}
              values={form.scope.included}
              min={0}
              max={SERVICE_LIMITS.scopeItems}
              maxLength={MAX.listItem}
              autoFocus={false}
              placeholder="e.g. Monitoring agreed for the assignment"
              addLabel="Add included item"
              rowLabel={(index) => `Included item ${index + 1}`}
              onChange={(included) => updateDraft("scope", { ...form.scope, included })}
            />
            <ListField
              label="Not included"
              hint={`Up to ${SERVICE_LIMITS.scopeItems}. Remove both lists to hide this section.`}
              values={form.scope.notIncluded}
              min={0}
              max={SERVICE_LIMITS.scopeItems}
              maxLength={MAX.listItem}
              autoFocus={false}
              placeholder="e.g. Emergency or ambulance care"
              addLabel="Add not-included item"
              rowLabel={(index) => `Not-included item ${index + 1}`}
              onChange={(notIncluded) => updateDraft("scope", { ...form.scope, notIncluded })}
            />
          </>
        );
      case "coverage":
        return (
          <>
            <TextInput
              id="service-coverage-heading"
              label="Heading"
              value={form.coverage.heading}
              maxLength={MAX.heading}
              errors={fieldErrors.coverage}
              autoFocus
              onChange={(heading) => updateDraft("coverage", { ...form.coverage, heading })}
            />
            <ListField
              label="Paragraphs"
              hint={`Up to ${SERVICE_LIMITS.coverage}. Remove them all to hide this section.`}
              values={form.coverage.paragraphs}
              min={0}
              max={SERVICE_LIMITS.coverage}
              maxLength={MAX.paragraph}
              multiline={3}
              autoFocus={false}
              placeholder="e.g. BHSK is based in Doha and arranges care where…"
              addLabel="Add paragraph"
              rowLabel={(index) => `Paragraph ${index + 1}`}
              onChange={(paragraphs) => updateDraft("coverage", { ...form.coverage, paragraphs })}
            />
          </>
        );
      case "process":
        return (
          <>
            <TextInput
              id="service-process-heading"
              label="Heading"
              value={form.process.heading}
              maxLength={MAX.heading}
              errors={fieldErrors.process}
              autoFocus
              onChange={(heading) => updateDraft("process", { ...form.process, heading })}
            />
            <TextInput
              id="service-process-intro"
              label="Introduction"
              hint="Leave empty to hide it."
              value={form.process.intro}
              maxLength={MAX.paragraph}
              multiline={2}
              onChange={(intro) => updateDraft("process", { ...form.process, intro })}
            />
            <PairListField
              label="Steps"
              hint={`Up to ${SERVICE_LIMITS.steps}, numbered in this order. Remove them all to hide this section.`}
              items={form.process.steps.map((step) => ({ first: step.title, second: step.text }))}
              max={SERVICE_LIMITS.steps}
              itemLabel="Step"
              firstLabel="Title"
              secondLabel="What happens"
              firstMaxLength={MAX.stepTitle}
              secondMaxLength={MAX.stepText}
              secondRows={2}
              autoFocus={false}
              addLabel="Add step"
              onChange={(items) =>
                updateDraft("process", {
                  ...form.process,
                  steps: items.map((item) => ({ title: item.first, text: item.second })),
                })
              }
            />
            <TextInput
              id="service-process-contacts"
              label="Closing note"
              hint="Shown under the steps, next to the request button. Leave empty to hide it."
              value={form.process.whoContacts}
              maxLength={MAX.paragraph}
              multiline={2}
              onChange={(whoContacts) => updateDraft("process", { ...form.process, whoContacts })}
            />
          </>
        );
      case "trust":
        return (
          <>
            <TextInput
              id="service-trust-heading"
              label="Heading"
              value={form.trust.heading}
              maxLength={MAX.heading}
              errors={fieldErrors.trust}
              autoFocus
              onChange={(heading) => updateDraft("trust", { ...form.trust, heading })}
            />
            <ListField
              label="Paragraphs"
              hint={`Up to ${SERVICE_LIMITS.trustParagraphs}.`}
              values={form.trust.paragraphs}
              min={0}
              max={SERVICE_LIMITS.trustParagraphs}
              maxLength={MAX.paragraph}
              multiline={3}
              autoFocus={false}
              placeholder="e.g. Nurse matching follows BHSK's screening checks…"
              addLabel="Add paragraph"
              rowLabel={(index) => `Paragraph ${index + 1}`}
              onChange={(paragraphs) => updateDraft("trust", { ...form.trust, paragraphs })}
            />
            <ListField
              label="Points"
              hint={`Up to ${SERVICE_LIMITS.trustFacts}. Remove the paragraphs and points to hide this section.`}
              values={form.trust.facts}
              min={0}
              max={SERVICE_LIMITS.trustFacts}
              maxLength={MAX.listItem}
              autoFocus={false}
              placeholder="e.g. Staff are arranged only after BHSK assesses the request"
              addLabel="Add point"
              rowLabel={(index) => `Point ${index + 1}`}
              onChange={(facts) => updateDraft("trust", { ...form.trust, facts })}
            />
          </>
        );
      case "faqs":
        return (
          <>
            <TextInput
              id="service-faq-heading"
              label="Heading"
              value={form.faqHeading}
              maxLength={MAX.heading}
              errors={fieldErrors.faqHeading}
              autoFocus
              onChange={(value) => updateDraft("faqHeading", value)}
            />
            <PairListField
              label="Questions"
              hint={`Up to ${SERVICE_LIMITS.faqs}. The first one starts open. Remove them all to hide this section.`}
              errors={fieldErrors.faqs}
              items={form.faqs.map((faq) => ({ first: faq.question, second: faq.answer }))}
              max={SERVICE_LIMITS.faqs}
              itemLabel="Question"
              firstLabel="Question"
              secondLabel="Answer"
              firstMaxLength={MAX.question}
              secondMaxLength={MAX.answer}
              autoFocus={false}
              addLabel="Add question"
              onChange={(items) =>
                updateDraft(
                  "faqs",
                  items.map((item) => ({ question: item.first, answer: item.second })),
                )
              }
            />
          </>
        );
      case "related": {
        const selected = new Set(form.relatedSlugs);
        const full = selected.size >= SERVICE_LIMITS.related;
        return (
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-1 text-sm font-semibold">Links at the bottom of the page</legend>
            <p className="m-0 mb-3 text-xs text-[var(--color-text-tertiary)]">
              Pick up to {SERVICE_LIMITS.related}. Hidden services aren't linked until they're shown again.
            </p>
            {fieldErrors.relatedSlugs ? <FormError message={fieldErrors.relatedSlugs[0]} /> : null}
            {SERVICE_CATEGORIES.map((category) => {
              const group = others.filter((service) => service.category === category);
              if (!group.length) return null;
              return (
                <div key={category} className="mb-4 last:mb-0">
                  <p className="m-0 mb-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                    {SERVICE_CATEGORY_LABELS[category]}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.map((service) => {
                      const checked = selected.has(service.slug);
                      return (
                        <label
                          key={service.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm has-[:checked]:border-[var(--bhsk-blue)] has-[:checked]:bg-[var(--color-surface-page)] ${!checked && full ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!checked && full}
                            onChange={() =>
                              updateDraft(
                                "relatedSlugs",
                                checked
                                  ? form.relatedSlugs.filter((slug) => slug !== service.slug)
                                  : [...form.relatedSlugs, service.slug],
                              )
                            }
                            className="size-4 shrink-0 accent-[var(--bhsk-blue-text)]"
                          />
                          <span className="min-w-0">
                            {service.name}
                            {service.visible ? null : (
                              <span className="ml-1.5 text-xs text-[var(--color-text-tertiary)]">(hidden)</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </fieldset>
        );
      }
      default:
        return null;
    }
  }

  const dialogTitle = (key: EditorKey | null) => {
    if (!key) return "";
    if (key in TEXT_FIELDS) return `Edit ${TEXT_FIELDS[key as TextKey].label.toLowerCase()}`;
    if (key === "cardPhoto") return choosingPhoto ? "Choose the card photo" : "Edit card photo";
    if (key === "pagePhoto") return choosingPhoto ? "Choose the page photo" : "Edit page photo";
    return DIALOG_TITLES[key] ?? "";
  };
  const isFieldEditor = (key: EditorKey | null) =>
    key !== null && key !== "visibility" && key !== "delete" && key !== "restore";
  const isPhoto = lastEdited === "cardPhoto" || lastEdited === "pagePhoto";

  const relatedNames = current.relatedSlugs
    .map((slug) => services.find((service) => service.slug === slug)?.name ?? slug)
    .filter(Boolean);

  return (
    <div className="grid gap-6">
      <BackLink onBack={onBack} />

      <section className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-1)] sm:flex-row sm:items-center sm:p-5">
        <img
          src={resolveImageSrc(current.cardImageUrl)}
          alt=""
          className="hidden size-20 shrink-0 rounded-xl bg-slate-100 object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="m-0 text-xl">{current.name}</h2>
            <VisibilityBadge visible={current.visible} />
          </div>
          <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)] [overflow-wrap:anywhere]">
            {SERVICE_CATEGORY_LABELS[current.category]} · {servicePath(current.slug)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {current.visible ? (
            <a
              href={servicePath(current.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className={headerButtonClass}
            >
              <ExternalLink className="size-4" /> View page
            </a>
          ) : null}
          <button type="button" className={headerButtonClass} onClick={() => startEdit("visibility")} disabled={saving}>
            {current.visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {current.visible ? "Hide" : "Show on website"}
          </button>
          <button
            type="button"
            className={`${headerButtonClass} text-[var(--color-error)] hover:bg-red-50`}
            onClick={() => {
              setDeleteError("");
              startEdit("delete");
            }}
            disabled={saving || services.length <= 1}
            title={services.length <= 1 ? "The website needs at least one service" : undefined}
          >
            <Trash2 className="size-4" /> Delete
          </button>
        </div>
      </section>

      <SettingsStatus
        updatedAt={isOriginal ? null : saved.updatedAt}
        justSaved={editor.justSaved}
        pristineLabel="Showing the original content of this service"
        restoreLabel="Restore original content"
        onRestore={original && !isOriginal ? () => startEdit("restore") : undefined}
        disabled={saving}
      />
      {!editing ? <FormError message={error} /> : null}

      <Card title="Name and menu" description="How the service is named and grouped across the website.">
        <DisplayRow label="Service name" onEdit={() => startEdit("name")}>
          <span className="text-base font-semibold">{current.name}</span>
        </DisplayRow>
        <DisplayRow label="Menu name" onEdit={() => startEdit("menuLabel")}>
          {current.menuLabel}
        </DisplayRow>
        <DisplayRow label="Menu icon" onEdit={() => startEdit("icon")}>
          <span className="inline-flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-surface-page)] text-[var(--bhsk-blue-text)]">
              <CurrentIcon className="size-5" strokeWidth={1.65} />
            </span>
            {current.icon.replace(/-/g, " ")}
          </span>
        </DisplayRow>
        <DisplayRow label="Group" onEdit={() => startEdit("category")}>
          {SERVICE_CATEGORY_LABELS[current.category]}
          <span className="block text-xs text-[var(--color-text-tertiary)]">
            {isHome ? "Request button opens Request a Nurse" : "Request button opens Request Staff"}
          </span>
        </DisplayRow>
        <DisplayRow label="Web address" onEdit={() => startEdit("slug")}>
          {servicePath(current.slug)}
        </DisplayRow>
      </Card>

      <Card title="Service card" description="The photo card on the home page and the services page.">
        <DisplayRow label="Card description" onEdit={() => startEdit("text")}>
          {current.text}
        </DisplayRow>
        <DisplayRow label="Card photo" onEdit={() => openPhoto("cardPhoto")}>
          <img
            src={resolveImageSrc(current.cardImageUrl)}
            alt=""
            className="mt-1 block h-32 w-24 rounded-lg bg-slate-100 object-cover"
          />
        </DisplayRow>
      </Card>

      <Card title="Top of the page" description="The first thing visitors see on the service's own page.">
        <DisplayRow label="Small heading" onEdit={() => startEdit("eyebrow")}>
          {current.eyebrow || <EmptyValue />}
        </DisplayRow>
        <DisplayRow label="Page title" onEdit={() => startEdit("h1")}>
          <span className="text-base font-semibold">{current.h1}</span>
        </DisplayRow>
        <DisplayRow label="Introduction" onEdit={() => startEdit("intro")}>
          <Paragraphs items={current.intro} />
        </DisplayRow>
        <DisplayRow label="Button text" onEdit={() => startEdit("heroCtaLabel")}>
          <span className="font-semibold">{current.heroCtaLabel}</span>
          <span className="block text-xs text-[var(--color-text-tertiary)]">
            Opens {isHome ? "Request a Nurse" : "Request Staff"} with “{current.name}” selected
          </span>
        </DisplayRow>
        <DisplayRow label="Page photo" onEdit={() => openPhoto("pagePhoto")}>
          <img
            src={resolveImageSrc(current.imageUrl)}
            alt=""
            className="mt-1 block aspect-video w-full max-w-xs rounded-lg bg-slate-100 object-cover"
          />
          <span className="mt-1.5 block text-xs text-[var(--color-text-tertiary)]">{current.imageAlt}</span>
        </DisplayRow>
      </Card>

      <Card title="Page sections" description="Each section is hidden on the website while it has no content.">
        <DisplayRow label={isHome ? "Who it's for" : "Who we support"} onEdit={() => startEdit("audience")}>
          <Heading>{current.audience.heading}</Heading>
          <TextList items={current.audience.items} />
        </DisplayRow>
        <DisplayRow label="What's included" onEdit={() => startEdit("scope")}>
          <Heading>{current.scopeHeading}</Heading>
          {current.scope.scopeNote ? (
            <p className="m-0 mb-2 text-[var(--color-text-tertiary)]">{current.scope.scopeNote}</p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="m-0 mb-1 text-xs font-bold text-[var(--color-text-tertiary)] uppercase">Included</p>
              <TextList items={current.scope.included} />
            </div>
            <div>
              <p className="m-0 mb-1 text-xs font-bold text-[var(--color-text-tertiary)] uppercase">Not included</p>
              <TextList items={current.scope.notIncluded} icon="cross" />
            </div>
          </div>
        </DisplayRow>
        <DisplayRow label="Coverage" onEdit={() => startEdit("coverage")}>
          <Heading>{current.coverage.heading}</Heading>
          <Paragraphs items={current.coverage.paragraphs} />
        </DisplayRow>
        <DisplayRow label="How it works" onEdit={() => startEdit("process")}>
          <Heading>{current.process.heading}</Heading>
          {current.process.steps.length ? (
            <ol className="m-0 grid gap-1.5 pl-5">
              {current.process.steps.map((step, index) => (
                <li key={index}>
                  <span className="font-semibold">{step.title}</span> — {step.text}
                </li>
              ))}
            </ol>
          ) : (
            <EmptyValue />
          )}
        </DisplayRow>
        <DisplayRow label="Standards" onEdit={() => startEdit("trust")}>
          <Heading>{current.trust.heading}</Heading>
          <div className="grid gap-2">
            {current.trust.paragraphs.length ? <Paragraphs items={current.trust.paragraphs} /> : null}
            <TextList items={current.trust.facts} />
          </div>
        </DisplayRow>
        <DisplayRow label="Questions" onEdit={() => startEdit("faqs")}>
          <Heading>{current.faqHeading}</Heading>
          {current.faqs.length ? (
            <ul className="m-0 grid list-none gap-2 p-0">
              {current.faqs.map((faq, index) => (
                <li key={index}>
                  <span className="font-semibold">{faq.question}</span>
                  <span className="mt-0.5 line-clamp-2 block text-[var(--color-text-tertiary)]">{faq.answer}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyValue />
          )}
        </DisplayRow>
        <DisplayRow label="Related services" onEdit={() => startEdit("related")}>
          {relatedNames.length ? <TextList items={relatedNames} /> : <EmptyValue>No related links</EmptyValue>}
        </DisplayRow>
      </Card>

      <Card title="Google search" description="How the page appears in Google results.">
        <DisplayRow label="Google title" onEdit={() => startEdit("seoTitle")}>
          {current.seoTitle}
        </DisplayRow>
        <DisplayRow label="Google description" onEdit={() => startEdit("seoDescription")}>
          {current.seoDescription}
        </DisplayRow>
      </Card>

      <EditDialog
        open={isFieldEditor(editing)}
        title={dialogTitle(lastEdited)}
        description={
          isPhoto && choosingPhoto ? "Upload your own photo or pick one already on the website." : undefined
        }
        wide={(lastEdited !== null && WIDE.includes(lastEdited)) || (isPhoto && choosingPhoto)}
        hideFooter={isPhoto && choosingPhoto}
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => draft && void commit(draft)}
      >
        {isFieldEditor(lastEdited) && draft && lastEdited ? renderEditor(lastEdited, draft) : null}
      </EditDialog>

      <EditDialog
        open={editing === "visibility"}
        title={current.visible ? `Hide ${current.name}?` : `Show ${current.name} on the website?`}
        description={
          current.visible
            ? "It disappears from the menu, the service cards and the enquiry forms, and its page stops opening. You can show it again at any time."
            : "It appears in the menu, on the service cards and in the enquiry forms, and its page opens for visitors."
        }
        saveLabel={current.visible ? "Hide service" : "Show service"}
        tone={current.visible ? "danger" : "default"}
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => void commit({ ...current, visible: !current.visible })}
      />

      <EditDialog
        open={editing === "restore"}
        title="Restore the original content?"
        description="Every part of this service goes back to the website's original content. Whether it's shown or hidden stays the same."
        saveLabel="Restore original"
        tone="danger"
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => original && void commit({ ...original, visible: current.visible })}
      />

      <EditDialog
        open={editing === "delete"}
        title={`Delete ${current.name}?`}
        description="Its page, card and menu link are removed for good, and links to it stop working. To take it off the website for now, hide it instead."
        saveLabel="Delete service"
        tone="danger"
        saving={deleting}
        error={deleteError}
        onClose={() => !deleting && cancelEdit()}
        onSave={() => void confirmDelete()}
      />
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex w-fit cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-sm font-semibold text-[var(--bhsk-blue-text)]"
    >
      <ArrowLeft className="size-4" /> All services
    </button>
  );
}

export function VisibilityBadge({ visible }: { visible: boolean }): ReactNode {
  return visible ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      <Eye className="size-3" /> On the website
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
      <EyeOff className="size-3" /> Hidden
    </span>
  );
}
