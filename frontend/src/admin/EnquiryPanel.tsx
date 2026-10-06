import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, LoaderCircle, Phone, Trash2, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ENQUIRY_STATUSES, deleteEnquiry, updateEnquiry, type Enquiry, type EnquiryStatus } from "./api";
import { STATUS_META, TYPE_LABELS, formatDateTime, telHref, whatsappHref } from "./format";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">{label}</dt>
      <dd className="m-0 mt-0.5 break-words">{children || <span className="text-[var(--color-text-tertiary)]">—</span>}</dd>
    </div>
  );
}

export function EnquiryPanel({
  enquiry,
  onClose,
  onUpdated,
  onDeleted,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onUpdated: (enquiry: Enquiry) => void;
  onDeleted: (id: string) => void;
}) {
  const [notes, setNotes] = useState(enquiry.notes);
  const [savingStatus, setSavingStatus] = useState<EnquiryStatus | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset only when a different enquiry is opened, so unsaved notes survive a status change.
  useEffect(() => {
    setNotes(enquiry.notes);
    setNotesSaved(false);
    setError("");
  }, [enquiry.id]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  async function changeStatus(status: EnquiryStatus) {
    if (status === enquiry.status) return;
    setSavingStatus(status);
    setError("");
    try {
      onUpdated(await updateEnquiry(enquiry.id, { status }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setSavingStatus(null);
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    setError("");
    try {
      onUpdated(await updateEnquiry(enquiry.id, { notes }));
      setNotesSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete the enquiry from ${enquiry.name}? This cannot be undone.`)) return;
    setDeleting(true);
    setError("");
    try {
      await deleteEnquiry(enquiry.id);
      onDeleted(enquiry.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete enquiry");
      setDeleting(false);
    }
  }

  const notesDirty = notes !== enquiry.notes;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-panel-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-[#10303c]/50 backdrop-blur-[2px] animate-in fade-in duration-200"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)]">
        <header className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 id="enquiry-panel-title" className="m-0 truncate text-xl">
              {enquiry.name}
            </h2>
            <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">
              Received {formatDateTime(enquiry.createdAt)} · {enquiry.source}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--color-text-tertiary)] hover:bg-slate-100 hover:text-[var(--bhsk-ink)]"
            aria-label="Close details"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 sm:gap-6 sm:px-6 sm:py-5">
          {error ? (
            <p className="m-0 rounded-lg bg-[var(--color-error-bg)] px-3 py-2 text-sm text-[var(--color-error)]" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <a
              href={telHref(enquiry.phone)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--bhsk-blue-text)] font-semibold text-white transition hover:bg-[var(--bhsk-blue-deep)]"
            >
              <Phone className="size-4" /> Call
            </a>
            <a
              href={whatsappHref(enquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1fa855] font-semibold text-white transition hover:bg-[#178a45]"
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          </div>

          <section>
            <h3 className="m-0 mb-2 text-sm">Status</h3>
            <div className="flex flex-wrap gap-2">
              {ENQUIRY_STATUSES.map((status) => {
                const active = status === enquiry.status;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={savingStatus !== null}
                    onClick={() => changeStatus(status)}
                    aria-pressed={active}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition disabled:cursor-wait ${
                      active ? STATUS_META[status].badge : "bg-white text-[var(--color-text-tertiary)] ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {savingStatus === status ? (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    ) : (
                      <span className={`size-2 rounded-full ${STATUS_META[status].dot}`} />
                    )}
                    {STATUS_META[status].label}
                  </button>
                );
              })}
            </div>
          </section>

          <dl className="m-0 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label="Phone">
              <a href={telHref(enquiry.phone)} className="text-[var(--bhsk-blue-text)] hover:underline">
                {enquiry.phone}
              </a>
            </Detail>
            <Detail label="Organisation / city">{enquiry.org}</Detail>
            <Detail label="Enquiry type">{TYPE_LABELS[enquiry.enquiryType]}</Detail>
            <Detail label="Service">{enquiry.service}</Detail>
          </dl>

          <section>
            <h3 className="m-0 mb-2 text-sm">Message</h3>
            <p className="m-0 rounded-xl bg-[var(--color-surface-page)] p-4 text-sm whitespace-pre-wrap">
              {enquiry.message || <span className="text-[var(--color-text-tertiary)]">No message provided.</span>}
            </p>
          </section>

          <section>
            <label htmlFor="enquiry-notes" className="mb-2 block text-sm font-semibold">
              Internal notes
            </label>
            <textarea
              id="enquiry-notes"
              rows={5}
              maxLength={5000}
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setNotesSaved(false);
              }}
              placeholder="Call outcomes, follow-ups, assigned nurse… (only visible to admins)"
              className="w-full resize-y rounded-xl border border-[var(--color-border)] p-3 text-base outline-none sm:text-sm focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30"
            />
            <div className="mt-2 flex items-center justify-end gap-3">
              {notesSaved && !notesDirty ? (
                <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
                  <Check className="size-4" /> Saved
                </span>
              ) : null}
              <button
                type="button"
                disabled={!notesDirty || savingNotes}
                onClick={saveNotes}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border-0 bg-[var(--bhsk-blue-text)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--bhsk-blue-deep)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingNotes ? <LoaderCircle className="size-4 animate-spin" /> : null}
                Save notes
              </button>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-4 py-3 sm:px-6 sm:py-4">
          <span className="text-xs text-[var(--color-text-tertiary)]">Updated {formatDateTime(enquiry.updatedAt)}</span>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-semibold text-[var(--color-error)] transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
          >
            {deleting ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
