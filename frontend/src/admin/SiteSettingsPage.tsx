import type { ReactNode } from "react";
import { ExternalLink, Facebook, Instagram, Linkedin } from "lucide-react";
import {
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_LIMITS,
  mapUrls,
  type SiteSettings,
} from "@shared/siteSettings";
import { fetchSiteSettings, saveSiteSettings } from "./api";
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
  SettingsStatus,
  borderFor,
  inputClass,
  stripTimestamp,
  useSettingsEditor,
} from "./settingsForm";

type SocialKey = "instagramUrl" | "facebookUrl" | "linkedinUrl";
type EditorKey = keyof SiteSettings | "restore";

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

const SOCIAL: Record<SocialKey, { label: string; icon: ReactNode; placeholder: string }> = {
  instagramUrl: {
    label: "Instagram",
    icon: <Instagram className="size-4" />,
    placeholder: "https://www.instagram.com/your-page/",
  },
  facebookUrl: {
    label: "Facebook",
    icon: <Facebook className="size-4" />,
    placeholder: "https://www.facebook.com/your-page",
  },
  linkedinUrl: {
    label: "LinkedIn",
    icon: <Linkedin className="size-4" />,
    placeholder: "https://www.linkedin.com/company/your-page/",
  },
};

const EDITORS: Record<keyof SiteSettings, { title: string; description: string }> = {
  email: { title: "Edit email address", description: "Shown in the top bar, header, footer and contact page." },
  phones: {
    title: "Edit phone numbers",
    description: "The first number is the main one used in the header, top bar and Call buttons.",
  },
  whatsapp: { title: "Edit WhatsApp number", description: "Used by every WhatsApp button and the enquiry forms." },
  landline: { title: "Edit landline", description: "Shown in the footer. Leave empty to hide it." },
  addressLines: {
    title: "Edit office address",
    description: "Shown in the footer, on the contact page and next to the office map.",
  },
  mapQuery: {
    title: "Edit Google Maps location",
    description: "What Google Maps searches for — the business name and area work best.",
  },
  instagramUrl: { title: "Edit Instagram link", description: "Leave empty to hide the Instagram icon from the footer." },
  facebookUrl: { title: "Edit Facebook link", description: "Leave empty to hide the Facebook icon from the footer." },
  linkedinUrl: { title: "Edit LinkedIn link", description: "Leave empty to hide the LinkedIn icon from the footer." },
};

function ExternalValue({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 break-all text-[var(--bhsk-blue-text)] hover:underline"
    >
      {children}
      <ExternalLink className="size-3.5 shrink-0" />
    </a>
  );
}

export function SiteSettingsPage() {
  const editor = useSettingsEditor<SiteSettings, EditorKey>({
    load: fetchSiteSettings,
    save: saveSiteSettings,
    clean: cleanSettings,
  });
  const { saved, draft, editing, saving, error, fieldErrors, startEdit, cancelEdit, updateDraft, commit } = editor;

  if (editor.loadError) {
    return (
      <LoadError title="Couldn't load the site settings" message={editor.loadError} onRetry={() => void editor.reload()} />
    );
  }

  if (!saved) return <LoadingCards />;

  const current = stripTimestamp<SiteSettings>(saved);
  const lastField = editor.lastEdited && editor.lastEdited !== "restore" ? editor.lastEdited : null;

  function renderEditor(key: keyof SiteSettings, form: SiteSettings) {
    switch (key) {
      case "email":
        return (
          <Field label="Email address" htmlFor="settings-email" errors={fieldErrors.email}>
            <input
              id="settings-email"
              type="email"
              required
              autoFocus
              value={form.email}
              onChange={(event) => updateDraft("email", event.target.value)}
              className={`${inputClass} ${borderFor(fieldErrors.email)}`}
            />
          </Field>
        );
      case "phones":
        return (
          <ListField
            label="Phone numbers"
            hint="8-digit numbers are dialled as +974."
            errors={fieldErrors.phones}
            values={form.phones}
            max={SITE_SETTINGS_LIMITS.phones}
            placeholder="e.g. 31331146"
            addLabel="Add phone number"
            rowLabel={(index) => (index === 0 ? "Main phone number" : `Phone number ${index + 1}`)}
            inputMode="tel"
            onChange={(phones) => updateDraft("phones", phones)}
          />
        );
      case "whatsapp":
        return (
          <Field label="WhatsApp number" htmlFor="settings-whatsapp" errors={fieldErrors.whatsapp}>
            <input
              id="settings-whatsapp"
              required
              autoFocus
              inputMode="tel"
              value={form.whatsapp}
              onChange={(event) => updateDraft("whatsapp", event.target.value)}
              placeholder="e.g. 97431331146"
              className={`${inputClass} ${borderFor(fieldErrors.whatsapp)}`}
            />
          </Field>
        );
      case "landline":
        return (
          <Field label="Landline" htmlFor="settings-landline" errors={fieldErrors.landline}>
            <input
              id="settings-landline"
              autoFocus
              inputMode="tel"
              value={form.landline}
              onChange={(event) => updateDraft("landline", event.target.value)}
              placeholder="e.g. +974-41497775"
              className={`${inputClass} ${borderFor(fieldErrors.landline)}`}
            />
          </Field>
        );
      case "addressLines":
        return (
          <ListField
            label="Address lines"
            hint="Each line appears on its own row."
            errors={fieldErrors.addressLines}
            values={form.addressLines}
            max={SITE_SETTINGS_LIMITS.addressLines}
            placeholder="e.g. Old Airport, Doha, Qatar"
            addLabel="Add address line"
            rowLabel={(index) => `Address line ${index + 1}`}
            onChange={(addressLines) => updateDraft("addressLines", addressLines)}
          />
        );
      case "mapQuery":
        return (
          <Field label="Google Maps location" htmlFor="settings-map" errors={fieldErrors.mapQuery}>
            <div className="flex items-center gap-2">
              <input
                id="settings-map"
                required
                autoFocus
                value={form.mapQuery}
                onChange={(event) => updateDraft("mapQuery", event.target.value)}
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
        );
      case "instagramUrl":
      case "facebookUrl":
      case "linkedinUrl": {
        const social = SOCIAL[key];
        return (
          <Field label={`${social.label} link`} htmlFor={`settings-${key}`} errors={fieldErrors[key]}>
            <div className="flex items-center gap-2">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-page)] text-[var(--bhsk-blue-text)]">
                {social.icon}
              </span>
              <input
                id={`settings-${key}`}
                type="url"
                autoFocus
                value={form[key]}
                onChange={(event) => updateDraft(key, event.target.value)}
                placeholder={social.placeholder}
                className={`${inputClass} ${borderFor(fieldErrors[key])}`}
              />
            </div>
          </Field>
        );
      }
    }
  }

  return (
    <div className="grid gap-6">
      <SettingsStatus
        updatedAt={saved.updatedAt}
        justSaved={editor.justSaved}
        pristineLabel="Showing the original website details"
        restoreLabel="Restore original details"
        onRestore={() => startEdit("restore")}
        disabled={saving}
      />
      {!editing ? <FormError message={error} /> : null}

      <Card
        title="Contact details"
        description="Shown in the top bar, header, footer, contact page, office map and the floating call / WhatsApp buttons."
      >
        <DisplayRow label="Email address" onEdit={() => startEdit("email")}>
          {current.email}
        </DisplayRow>
        <DisplayRow label="Phone numbers" onEdit={() => startEdit("phones")}>
          <ul className="m-0 grid list-none gap-0.5 p-0">
            {current.phones.map((phone, index) => (
              <li key={`${index}-${phone}`}>
                {phone}
                {index === 0 ? (
                  <span className="ml-2 rounded-full bg-[var(--color-surface-page)] px-2 py-0.5 text-xs font-semibold text-[var(--bhsk-blue-text)]">
                    Main
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </DisplayRow>
        <DisplayRow label="WhatsApp number" onEdit={() => startEdit("whatsapp")}>
          {current.whatsapp}
        </DisplayRow>
        <DisplayRow label="Landline" onEdit={() => startEdit("landline")}>
          {current.landline || <EmptyValue />}
        </DisplayRow>
      </Card>

      <Card title="Office address" description="Shown in the footer, on the contact page and next to the office map.">
        <DisplayRow label="Address" onEdit={() => startEdit("addressLines")}>
          {current.addressLines.map((line, index) => (
            <span key={`${index}-${line}`} className="block">
              {line}
            </span>
          ))}
        </DisplayRow>
        <DisplayRow label="Google Maps location" onEdit={() => startEdit("mapQuery")}>
          <ExternalValue href={mapUrls(current.mapQuery).viewUrl}>{current.mapQuery}</ExternalValue>
        </DisplayRow>
      </Card>

      <Card title="Social media" description="Icons shown in the website footer.">
        {(Object.keys(SOCIAL) as SocialKey[]).map((key) => (
          <DisplayRow key={key} label={SOCIAL[key].label} onEdit={() => startEdit(key)}>
            {current[key] ? (
              <ExternalValue href={current[key]}>{current[key]}</ExternalValue>
            ) : (
              <EmptyValue>Hidden from the footer</EmptyValue>
            )}
          </DisplayRow>
        ))}
      </Card>

      <EditDialog
        open={editing !== null && editing !== "restore"}
        title={lastField ? EDITORS[lastField].title : ""}
        description={lastField ? EDITORS[lastField].description : undefined}
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => draft && void commit(draft)}
      >
        {lastField && draft ? renderEditor(lastField, draft) : null}
      </EditDialog>

      <EditDialog
        open={editing === "restore"}
        title="Restore the original details?"
        description="Every contact detail, the address and the social links go back to the website's original values."
        saveLabel="Restore original"
        tone="danger"
        saving={saving}
        error={error}
        onClose={cancelEdit}
        onSave={() => void commit(DEFAULT_SITE_SETTINGS)}
      />
    </div>
  );
}
