import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, LoaderCircle, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AdminApiError } from "./api";
import { formatDateTime } from "./format";

// 16px text on phones: iOS Safari zooms the page when focusing an input smaller than that.
export const inputClass =
  "h-11 w-full rounded-xl border bg-white px-3 text-base outline-none focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30 sm:h-10 sm:text-sm";

export const textareaClass =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-base leading-relaxed outline-none focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30 sm:text-sm";

export function borderFor(errors?: string[]) {
  return errors?.length ? "border-[var(--color-error)]" : "border-[var(--color-border)]";
}

export function Card({
  title,
  description,
  action,
  children,
  bodyClassName = "mt-2 divide-y divide-[var(--color-border)]",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-1)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg">{title}</h2>
          <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">{description}</p>
        </div>
        {action}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function EditButton({
  label,
  onClick,
  disabled,
  className = "",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`${className} inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:border-[var(--bhsk-blue)] hover:bg-[var(--color-surface-page)] disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <Pencil className="size-3.5" /> Edit
    </button>
  );
}

export function EmptyValue({ children = "Not shown on the website" }: { children?: ReactNode }) {
  return <span className="text-[var(--color-text-tertiary)] italic">{children}</span>;
}

/** A read-only setting: its label, current value and an Edit button that opens the editor popup. */
export function DisplayRow({
  label,
  children,
  onEdit,
  disabled,
}: {
  label: string;
  children: ReactNode;
  onEdit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-4 last:pb-0 sm:gap-4">
      <div className="min-w-0">
        <p className="m-0 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">{label}</p>
        <div className="mt-1 text-sm text-[var(--bhsk-ink)] [overflow-wrap:anywhere]">{children}</div>
      </div>
      <EditButton label={`Edit ${label.toLowerCase()}`} onClick={onEdit} disabled={disabled} />
    </div>
  );
}

export function Field({
  label,
  hint,
  errors,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  errors?: string[];
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {errors?.length ? (
        <p className="m-0 mt-1.5 text-sm text-[var(--color-error)]" role="alert">
          {errors[0]}
        </p>
      ) : hint ? (
        <p className="m-0 mt-1.5 text-xs text-[var(--color-text-tertiary)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function ListField({
  label,
  hint,
  errors,
  values,
  min = 1,
  max,
  maxLength,
  placeholder,
  addLabel,
  rowLabel,
  inputMode,
  onChange,
}: {
  label: string;
  hint: string;
  errors?: string[];
  values: string[];
  min?: number;
  max: number;
  maxLength?: number;
  placeholder: string;
  addLabel: string;
  rowLabel: (index: number) => string;
  inputMode?: "tel" | "text";
  onChange: (values: string[]) => void;
}) {
  return (
    <Field label={label} hint={hint} errors={errors}>
      <div className="grid gap-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={value}
              onChange={(event) => onChange(values.map((item, i) => (i === index ? event.target.value : item)))}
              placeholder={placeholder}
              aria-label={rowLabel(index)}
              inputMode={inputMode}
              maxLength={maxLength}
              required={index < min}
              autoFocus={index === 0}
              className={`${inputClass} ${borderFor(errors)}`}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              disabled={values.length <= min}
              className="flex size-11 shrink-0 cursor-pointer items-center sm:size-10 justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-tertiary)] hover:bg-red-50 hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Remove ${rowLabel(index).toLowerCase()}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      {values.length < max ? (
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="mt-2 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)]"
        >
          <Plus className="size-4" /> {addLabel}
        </button>
      ) : null}
    </Field>
  );
}

export function LoadError({ title, message, onRetry }: { title: string; message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--shadow-1)]">
      <p className="m-0 font-semibold">{title}</p>
      <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 cursor-pointer rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)]"
      >
        Try again
      </button>
    </div>
  );
}

export function LoadingCards() {
  return (
    <div className="grid gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-56 animate-pulse rounded-2xl bg-white shadow-[var(--shadow-1)]" />
      ))}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="m-0 rounded-xl bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]" role="alert">
      {message}
    </p>
  );
}

/** Centred popup holding the inputs for one setting, saved on its own. */
export function EditDialog({
  open,
  title,
  description,
  saving,
  error,
  saveLabel = "Save",
  tone = "default",
  wide,
  hideFooter,
  onClose,
  onSave,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  saving: boolean;
  error?: string;
  saveLabel?: string;
  tone?: "default" | "danger";
  wide?: boolean;
  hideFooter?: boolean;
  onClose: () => void;
  onSave: () => void;
  children?: ReactNode;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!saving) onSave();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next && !saving ? onClose() : undefined)}>
      <DialogContent
        className={`max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden rounded-2xl p-0 ${wide ? "sm:max-w-3xl" : "sm:max-w-lg"}`}
      >
        <form onSubmit={submit} className="flex max-h-[calc(100dvh-2rem)] flex-col">
          <div className="border-b border-[var(--color-border)] px-5 py-4 pr-12 sm:px-6 sm:py-5">
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription className="mt-1">{description}</DialogDescription> : null}
          </div>
          <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
            <FormError message={error ?? ""} />
            {children}
          </div>
          {hideFooter ? null : (
            <div className="grid grid-cols-2 gap-2 border-t border-[var(--color-border)] bg-[var(--color-surface-page)]/60 px-5 py-4 sm:flex sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border-0 px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 ${
                  tone === "danger"
                    ? "bg-[var(--color-error)] hover:brightness-95"
                    : "bg-[var(--bhsk-blue-text)] hover:bg-[var(--bhsk-blue-deep)]"
                }`}
              >
                {saving ? <LoaderCircle className="size-4 animate-spin" /> : null}
                {saveLabel}
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Top-of-page status: last saved time, a short confirmation after each save, and "restore original". */
export function SettingsStatus({
  updatedAt,
  justSaved,
  pristineLabel,
  restoreLabel,
  onRestore,
  disabled,
}: {
  updatedAt: string | null;
  justSaved: boolean;
  pristineLabel: string;
  restoreLabel: string;
  onRestore: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-1)] sm:px-5">
      <span className="text-sm text-[var(--color-text-tertiary)]" aria-live="polite">
        {justSaved ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <Check className="size-4" /> Saved — the website updates within a minute
          </span>
        ) : updatedAt ? (
          `Last updated ${formatDateTime(updatedAt)}`
        ) : (
          pristineLabel
        )}
      </span>
      <button
        type="button"
        onClick={onRestore}
        disabled={disabled}
        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-3 text-sm font-semibold text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCcw className="size-4" /> {restoreLabel}
      </button>
    </div>
  );
}

type Stored<T> = T & { updatedAt: string | null };

export function stripTimestamp<T extends object>(record: Stored<T>): T {
  const { updatedAt: _updatedAt, ...rest } = record;
  return rest as unknown as T;
}

/**
 * Loads a settings document and saves it one element at a time: `startEdit` copies the saved values
 * into a draft for the editor popup, and `commit` saves a full document and closes the popup.
 */
export function useSettingsEditor<T extends object, K extends string>({
  load,
  save,
  clean,
}: {
  load: () => Promise<Stored<T>>;
  save: (value: T) => Promise<Stored<T>>;
  clean: (value: T) => T;
}) {
  const [saved, setSaved] = useState<Stored<T> | null>(null);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<K | null>(null);
  // Kept after closing so the popup's content doesn't vanish during its close animation.
  const [lastEdited, setLastEdited] = useState<K | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string[]>>>({});
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<number | undefined>(undefined);

  const reload = useCallback(async () => {
    setLoadError("");
    try {
      setSaved(await load());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load the settings");
    }
  }, [load]);

  useEffect(() => {
    void reload();
    return () => window.clearTimeout(savedTimer.current);
  }, [reload]);

  function startEdit(key: K, initial?: T) {
    if (!saved) return;
    setDraft(initial ?? stripTimestamp<T>(saved));
    setEditing(key);
    setLastEdited(key);
    setError("");
    setFieldErrors({});
  }

  function cancelEdit() {
    if (saving) return;
    setEditing(null);
    setError("");
    setFieldErrors({});
  }

  function updateDraft<F extends keyof T>(key: F, value: T[F]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function commit(next: T) {
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      setSaved(await save(clean(next)));
      setEditing(null);
      setJustSaved(true);
      window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setJustSaved(false), 5000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save. Please try again.");
      if (err instanceof AdminApiError) setFieldErrors(err.fieldErrors as Partial<Record<keyof T, string[]>>);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    saved,
    loadError,
    reload,
    editing,
    lastEdited,
    draft,
    saving,
    error,
    fieldErrors,
    justSaved,
    startEdit,
    cancelEdit,
    updateDraft,
    commit,
  };
}
