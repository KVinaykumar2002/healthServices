import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
  SERVICE_LIMITS,
  SERVICE_TEXT_LIMITS as MAX,
  newServiceTemplate,
  servicePath,
  slugify,
  type ServiceCategory,
} from "@shared/services";
import { resolveImageSrc } from "@/lib/siteSettings";
import { AdminApiError, createService, deleteService, fetchServices, reorderServices, type ServiceRecord } from "./api";
import { ServiceEditor, VisibilityBadge } from "./ServiceEditor";
import {
  Card,
  EditButton,
  EditDialog,
  Field,
  FormError,
  LoadError,
  LoadingCards,
  borderFor,
  inputClass,
  textareaClass,
} from "./settingsForm";

const iconButtonClass =
  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)] disabled:cursor-not-allowed disabled:opacity-40";

const GROUP_DESCRIPTIONS: Record<ServiceCategory, string> = {
  home: "For families — listed under Home care in the menu and on the services page.",
  facility: "For employers and facilities — listed under Healthcare staffing.",
};

function serviceIdFromHash() {
  const match = /^#services\/(.+)$/.exec(window.location.hash);
  return match ? decodeURIComponent(match[1]) : null;
}

/** The open service lives in the address (#services/<id>), so Back and refresh keep it open. */
function useOpenService() {
  const [id, setId] = useState(serviceIdFromHash);

  useEffect(() => {
    const onHashChange = () => setId(serviceIdFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const open = useCallback((next: string | null) => {
    window.location.hash = next ? `#services/${encodeURIComponent(next)}` : "#services";
    window.scrollTo({ top: 0 });
  }, []);

  return [id, open] as const;
}

type NewService = { name: string; slug: string; slugEdited: boolean; category: ServiceCategory; text: string };

const EMPTY_NEW_SERVICE: NewService = { name: "", slug: "", slugEdited: false, category: "home", text: "" };

export function ServicesAdmin() {
  const [openId, open] = useOpenService();
  const [services, setServices] = useState<ServiceRecord[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [adding, setAdding] = useState(false);
  const [newService, setNewService] = useState<NewService>(EMPTY_NEW_SERVICE);
  const [addError, setAddError] = useState("");
  const [addFieldErrors, setAddFieldErrors] = useState<Record<string, string[]>>({});

  const [deleteTarget, setDeleteTarget] = useState<ServiceRecord | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      setServices(await fetchServices());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load the services");
    }
  }, []);

  // Reloaded when coming back from a service, so the list shows its changes.
  useEffect(() => {
    void load();
  }, [load, openId]);

  if (openId) return <ServiceEditor key={openId} id={openId} services={services ?? []} onBack={() => open(null)} />;

  if (loadError) return <LoadError title="Couldn't load the services" message={loadError} onRetry={() => void load()} />;
  if (!services) return <LoadingCards />;

  const list = services;

  async function move(service: ServiceRecord, offset: number) {
    const group = list.filter((item) => item.category === service.category);
    const other = group[group.findIndex((item) => item.id === service.id) + offset];
    if (!other) return;
    const ids = list.map((item) => item.id);
    const a = ids.indexOf(service.id);
    const b = ids.indexOf(other.id);
    [ids[a], ids[b]] = [ids[b], ids[a]];

    setBusy(true);
    setError("");
    try {
      setServices(await reorderServices(ids));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change the order. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function startAdd() {
    setNewService(EMPTY_NEW_SERVICE);
    setAddError("");
    setAddFieldErrors({});
    setAdding(true);
  }

  async function add() {
    setBusy(true);
    setAddError("");
    setAddFieldErrors({});
    try {
      const created = await createService(
        newServiceTemplate({
          name: newService.name.trim(),
          slug: newService.slug.trim(),
          category: newService.category,
          text: newService.text.trim(),
        }),
      );
      setAdding(false);
      open(created.id);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Unable to add the service. Please try again.");
      if (err instanceof AdminApiError) setAddFieldErrors(err.fieldErrors);
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    setDeleteError("");
    try {
      await deleteService(deleteTarget.id);
      setDeleteOpen(false);
      await load();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Unable to delete. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const full = list.length >= SERVICE_LIMITS.services;
  const hiddenCount = list.filter((service) => !service.visible).length;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-[var(--shadow-1)] sm:px-5">
        <span className="text-sm text-[var(--color-text-tertiary)]">
          {list.length} services{hiddenCount ? ` · ${hiddenCount} hidden` : ""} · changes reach the website within a
          minute
        </span>
        <button
          type="button"
          onClick={startAdd}
          disabled={busy || full}
          title={full ? `Up to ${SERVICE_LIMITS.services} services` : undefined}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-[var(--bhsk-blue-text)] px-3 text-sm font-semibold text-white hover:bg-[var(--bhsk-blue-deep)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" /> Add service
        </button>
      </div>
      <FormError message={error} />

      {SERVICE_CATEGORIES.map((category) => {
        const group = list.filter((service) => service.category === category);
        return (
          <Card
            key={category}
            title={`${SERVICE_CATEGORY_LABELS[category]} (${group.length})`}
            description={`${GROUP_DESCRIPTIONS[category]} Shown in this order.`}
            bodyClassName="mt-5"
          >
            {group.length ? (
              <ol className="m-0 grid list-none gap-3 p-0">
                {group.map((service, index) => (
                  <li
                    key={service.id}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 rounded-xl border border-[var(--color-border)] p-3 sm:flex sm:items-center"
                  >
                    <img
                      src={resolveImageSrc(service.cardImageUrl)}
                      alt=""
                      className={`block aspect-square w-full rounded-lg bg-slate-100 object-cover sm:size-16 sm:shrink-0 ${service.visible ? "" : "opacity-50 grayscale"}`}
                    />
                    <div className="min-w-0 sm:flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <button
                          type="button"
                          onClick={() => open(service.id)}
                          className="cursor-pointer border-0 bg-transparent p-0 text-left font-semibold text-[var(--bhsk-ink)] hover:text-[var(--bhsk-blue-text)] hover:underline"
                        >
                          {service.name}
                        </button>
                        {service.visible ? null : <VisibilityBadge visible={false} />}
                      </div>
                      <p className="m-0 mt-0.5 truncate text-xs text-[var(--color-text-tertiary)]">
                        Menu: {service.menuLabel} · {servicePath(service.slug)}
                      </p>
                      <p className="m-0 mt-1 hidden text-sm text-[var(--color-text-tertiary)] sm:line-clamp-2">
                        {service.text}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 border-t border-[var(--color-border)] pt-3 sm:col-span-1 sm:shrink-0 sm:border-0 sm:pt-0">
                      <button
                        type="button"
                        className={iconButtonClass}
                        onClick={() => void move(service, -1)}
                        disabled={index === 0 || busy}
                        aria-label={`Move ${service.name} up`}
                        title="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        className={iconButtonClass}
                        onClick={() => void move(service, 1)}
                        disabled={index === group.length - 1 || busy}
                        aria-label={`Move ${service.name} down`}
                        title="Move down"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                      {service.visible ? (
                        <a
                          href={servicePath(service.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={iconButtonClass}
                          aria-label={`View the ${service.name} page`}
                          title="View page"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      ) : null}
                      <EditButton
                        label={`Edit ${service.name}`}
                        onClick={() => open(service.id)}
                        disabled={busy}
                        className="ml-auto sm:ml-0"
                      />
                      <button
                        type="button"
                        className={`${iconButtonClass} hover:bg-red-50 hover:text-[var(--color-error)]`}
                        onClick={() => {
                          setDeleteTarget(service);
                          setDeleteError("");
                          setDeleteOpen(true);
                        }}
                        disabled={busy || list.length <= 1}
                        aria-label={`Delete ${service.name}`}
                        title={list.length <= 1 ? "The website needs at least one service" : "Delete"}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="m-0 rounded-xl bg-[var(--color-surface-page)] px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
                No services in this group yet.
              </p>
            )}
          </Card>
        );
      })}

      <EditDialog
        open={adding}
        title="Add a service"
        description="Start with the basics. The new service stays hidden until you've filled in its page and chosen to show it."
        saveLabel="Add service"
        saving={busy}
        error={addError}
        onClose={() => !busy && setAdding(false)}
        onSave={() => void add()}
      >
        <Field label="Service name" htmlFor="new-service-name" errors={addFieldErrors.name}>
          <input
            id="new-service-name"
            required
            autoFocus
            maxLength={MAX.name}
            value={newService.name}
            onChange={(event) => {
              const name = event.target.value;
              setNewService((current) => ({
                ...current,
                name,
                slug: current.slugEdited ? current.slug : slugify(name),
              }));
            }}
            placeholder="e.g. Dementia Care"
            className={`${inputClass} ${borderFor(addFieldErrors.name)}`}
          />
        </Field>
        <fieldset className="m-0 grid gap-2 border-0 p-0">
          <legend className="mb-1.5 text-sm font-semibold">Group</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICE_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm has-[:checked]:border-[var(--bhsk-blue)] has-[:checked]:bg-[var(--color-surface-page)]"
              >
                <input
                  type="radio"
                  name="new-service-category"
                  checked={newService.category === category}
                  onChange={() => setNewService((current) => ({ ...current, category }))}
                  className="size-4 accent-[var(--bhsk-blue-text)]"
                />
                <span className="font-semibold">{SERVICE_CATEGORY_LABELS[category]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label="Web address"
          htmlFor="new-service-slug"
          hint={`Page address: ${servicePath(newService.slug || "…")}`}
          errors={addFieldErrors.slug}
        >
          <input
            id="new-service-slug"
            required
            maxLength={MAX.slug}
            value={newService.slug}
            onChange={(event) =>
              setNewService((current) => ({
                ...current,
                slug: event.target.value.toLowerCase().replace(/[\s_]+/g, "-"),
                slugEdited: true,
              }))
            }
            placeholder="e.g. dementia-care"
            className={`${inputClass} ${borderFor(addFieldErrors.slug)}`}
          />
        </Field>
        <Field
          label="Card description"
          htmlFor="new-service-text"
          hint="One or two sentences shown under the name on the service cards."
          errors={addFieldErrors.text}
        >
          <textarea
            id="new-service-text"
            required
            rows={3}
            maxLength={MAX.text}
            value={newService.text}
            onChange={(event) => setNewService((current) => ({ ...current, text: event.target.value }))}
            className={`${textareaClass} ${borderFor(addFieldErrors.text)}`}
          />
        </Field>
      </EditDialog>

      <EditDialog
        open={deleteOpen}
        title={`Delete ${deleteTarget?.name ?? "this service"}?`}
        description="Its page, card and menu link are removed for good, and links to it stop working. To take it off the website for now, open it and choose Hide instead."
        saveLabel="Delete service"
        tone="danger"
        saving={busy}
        error={deleteError}
        onClose={() => !busy && setDeleteOpen(false)}
        onSave={() => void confirmDelete()}
      />
    </div>
  );
}
