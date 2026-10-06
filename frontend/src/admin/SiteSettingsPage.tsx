import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ExternalLink, Facebook, Instagram, Linkedin } from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_LIMITS,
  mapUrls,
  type SiteSettings,
} from "@shared/siteSettings";
import { AdminApiError, fetchSiteSettings, saveSiteSettings, type SiteSettingsRecord } from "./api";
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
  useUnsavedChangesWarning,
} from "./settingsForm";

type FieldErrors = Partial<Record<keyof SiteSettings, string[]>>;

function withoutTimestamp({ updatedAt: _updatedAt, ...settings }: SiteSettingsRecord): SiteSettings {
  return settings;
}

/** Trims every value and drops blank list rows, matching what the server stores. */
function cleanSettings(settings: SiteSettings): SiteSettings {
  const list = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);
  return {
    email: settings.email.trim(),
    phones: list(settings.phones),
    landline: settings.landline.trim(),
    whatsapp: settings.whatsapp.trim(),
    addressLines: list(settings.addressLines),
    mapQuery: settings.mapQuery.trim(),
    instagramUrl: settings.instagramUrl.trim(),
    facebookUrl: settings.facebookUrl.trim(),
    linkedinUrl: settings.linkedinUrl.trim(),
  };
}

function SocialField({
  id,
  label,
  icon,
  value,
  errors,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  errors?: string[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} htmlFor={id} errors={errors} hint="Leave empty to hide this icon from the footer.">
      <div className="flex items-center gap-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-page)] text-[var(--bhsk-blue-text)]">
          {icon}
        </span>
        <input
          id={id}
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${inputClass} ${borderFor(errors)}`}
        />
        {value.trim() ? (
          <a
            href={value.trim()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:text-[var(--bhsk-blue-text)]"
            aria-label={`Open ${label} link`}
            title="Open link"
          >
            <ExternalLink className="size-4" />
          </a>
        ) : null}
      </div>
    </Field>
  );
}

export function SiteSettingsPage() {
  const [saved, setSaved] = useState<SiteSettingsRecord | null>(null);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [justSaved, setJustSaved] = useState(false);

  async function load() {
    setLoadError("");
    try {
      const record = await fetchSiteSettings();
      setSaved(record);
      setForm(withoutTimestamp(record));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load settings");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const dirty =
    form !== null && saved !== null && JSON.stringify(cleanSettings(form)) !== JSON.stringify(withoutTimestamp(saved));

  useUnsavedChangesWarning(dirty);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setJustSaved(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const record = await saveSiteSettings(cleanSettings(form));
      setSaved(record);
      setForm(withoutTimestamp(record));
      setJustSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings");
      if (err instanceof AdminApiError) setFieldErrors(err.fieldErrors as FieldErrors);
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return <LoadError title="Couldn't load the site settings" message={loadError} onRetry={() => void load()} />;
  }

  if (!form || !saved) return <LoadingCards />;

  return (
    <form onSubmit={submit} className="grid gap-6 pb-24">
      <FormError message={error} />

      <Card
        title="Contact details"
        description="Shown in the top bar, header, footer, contact page, office map and the floating call / WhatsApp buttons."
      >
        <Field label="Email address" htmlFor="settings-email" errors={fieldErrors.email}>
          <input
            id="settings-email"
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={`${inputClass} ${borderFor(fieldErrors.email)}`}
          />
        </Field>
        <ListField
          label="Phone numbers"
          hint="The first number is the main one used in the header, top bar and Call buttons. 8-digit numbers are dialled as +974."
          errors={fieldErrors.phones}
          values={form.phones}
          max={SITE_SETTINGS_LIMITS.phones}
          placeholder="e.g. 31331146"
          addLabel="Add phone number"
          rowLabel={(index) => (index === 0 ? "Main phone number" : `Phone number ${index + 1}`)}
          inputMode="tel"
          onChange={(phones) => update("phones", phones)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="WhatsApp number"
            htmlFor="settings-whatsapp"
            hint="Used by every WhatsApp button and the enquiry forms."
            errors={fieldErrors.whatsapp}
          >
            <input
              id="settings-whatsapp"
              required
              inputMode="tel"
              value={form.whatsapp}
              onChange={(event) => update("whatsapp", event.target.value)}
              placeholder="e.g. 97431331146"
              className={`${inputClass} ${borderFor(fieldErrors.whatsapp)}`}
            />
          </Field>
          <Field
            label="Landline"
            htmlFor="settings-landline"
            hint="Shown in the footer. Leave empty to hide it."
            errors={fieldErrors.landline}
          >
            <input
              id="settings-landline"
              inputMode="tel"
              value={form.landline}
              onChange={(event) => update("landline", event.target.value)}
              placeholder="e.g. +974-41497775"
              className={`${inputClass} ${borderFor(fieldErrors.landline)}`}
            />
          </Field>
        </div>
      </Card>

      <Card title="Office address" description="Shown in the footer, on the contact page and next to the office map.">
        <ListField
          label="Address lines"
          hint="Each line appears on its own row."
          errors={fieldErrors.addressLines}
          values={form.addressLines}
          max={SITE_SETTINGS_LIMITS.addressLines}
          placeholder="e.g. Old Airport, Doha, Qatar"
          addLabel="Add address line"
          rowLabel={(index) => `Address line ${index + 1}`}
          onChange={(addressLines) => update("addressLines", addressLines)}
        />
        <Field
          label="Google Maps location"
          htmlFor="settings-map"
          hint="What Google Maps searches for — the business name and area work best. Used for the map and directions links."
          errors={fieldErrors.mapQuery}
        >
          <div className="flex items-center gap-2">
            <input
              id="settings-map"
              required
              value={form.mapQuery}
              onChange={(event) => update("mapQuery", event.target.value)}
              className={`${inputClass} ${borderFor(fieldErrors.mapQuery)}`}
            />
            <a
              href={mapUrls(form.mapQuery.trim() || DEFAULT_SITE_SETTINGS.mapQuery).viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)]"
            >
              <ExternalLink className="size-4" /> Preview
            </a>
          </div>
        </Field>
      </Card>

      <Card title="Social media" description="Icons shown in the website footer.">
        <SocialField
          id="settings-instagram"
          label="Instagram"
          icon={<Instagram className="size-4" />}
          value={form.instagramUrl}
          errors={fieldErrors.instagramUrl}
          placeholder="https://www.instagram.com/your-page/"
          onChange={(value) => update("instagramUrl", value)}
        />
        <SocialField
          id="settings-facebook"
          label="Facebook"
          icon={<Facebook className="size-4" />}
          value={form.facebookUrl}
          errors={fieldErrors.facebookUrl}
          placeholder="https://www.facebook.com/your-page"
          onChange={(value) => update("facebookUrl", value)}
        />
        <SocialField
          id="settings-linkedin"
          label="LinkedIn"
          icon={<Linkedin className="size-4" />}
          value={form.linkedinUrl}
          errors={fieldErrors.linkedinUrl}
          placeholder="https://www.linkedin.com/company/your-page/"
          onChange={(value) => update("linkedinUrl", value)}
        />
      </Card>

      <SaveBar
        dirty={dirty}
        saving={saving}
        justSaved={justSaved}
        updatedAt={saved.updatedAt}
        pristineLabel="Showing the original website details"
        resetLabel="Original details"
        resetTitle="Fill the form with the original website details (not saved until you press Save)"
        onReset={() => {
          setForm(DEFAULT_SITE_SETTINGS);
          setFieldErrors({});
          setJustSaved(false);
        }}
        onDiscard={() => {
          setForm(withoutTimestamp(saved));
          setFieldErrors({});
          setError("");
        }}
      />
    </form>
  );
}
