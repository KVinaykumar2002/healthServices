import { useEffect, type ReactNode } from "react";
import { Check, LoaderCircle, Plus, RotateCcw, Trash2 } from "lucide-react";
import { formatDateTime } from "./format";

export const inputClass =
  "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30";

export const textareaClass =
  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30";

export function borderFor(errors?: string[]) {
  return errors?.length ? "border-[var(--color-error)]" : "border-[var(--color-border)]";
}

export function Card({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-1)] sm:p-6">
      <h2 className="m-0 text-lg">{title}</h2>
      <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">{description}</p>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
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
              className={`${inputClass} ${borderFor(errors)}`}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              disabled={values.length <= min}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-tertiary)] hover:bg-red-50 hover:text-[var(--color-error)] disabled:cursor-not-allowed disabled:opacity-40"
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

/** Sticky footer for the settings forms: status on the left, reset / discard / save on the right. */
export function SaveBar({
  dirty,
  saving,
  justSaved,
  updatedAt,
  pristineLabel,
  resetLabel,
  resetTitle,
  onReset,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  justSaved: boolean;
  updatedAt: string | null;
  pristineLabel: string;
  resetLabel: string;
  resetTitle: string;
  onReset: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white/95 px-4 py-3 shadow-[var(--shadow-2,0_10px_30px_rgba(16,48,60,0.12))] backdrop-blur sm:px-5">
      <span className="text-sm text-[var(--color-text-tertiary)]">
        {justSaved && !dirty ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <Check className="size-4" /> Saved — the website updates within a minute
          </span>
        ) : dirty ? (
          "You have unsaved changes"
        ) : updatedAt ? (
          `Last updated ${formatDateTime(updatedAt)}`
        ) : (
          pristineLabel
        )}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)]"
          title={resetTitle}
        >
          <RotateCcw className="size-4" /> {resetLabel}
        </button>
        {dirty ? (
          <button
            type="button"
            onClick={onDiscard}
            className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-slate-50"
          >
            Discard
          </button>
        ) : null}
        <button
          type="submit"
          disabled={!dirty || saving}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border-0 bg-[var(--bhsk-blue-text)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--bhsk-blue-deep)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </div>
  );
}

/** Warns before leaving the page with unsaved changes. */
export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}
