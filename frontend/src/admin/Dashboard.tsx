import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  HandHeart,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  PanelTop,
  RefreshCw,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  ENQUIRY_STATUSES,
  downloadEnquiriesCsv,
  fetchEnquiries,
  fetchStats,
  type Enquiry,
  type EnquiryFilters,
  type EnquiryPage,
  type EnquiryStats,
  type EnquiryStatus,
  type EnquiryTypeFilter,
} from "./api";
import { EnquiryPanel } from "./EnquiryPanel";
import { HeroSettingsPage } from "./HeroSettingsPage";
import {
  STATUS_META,
  TYPE_LABELS,
  formatDateTime,
  formatRelative,
} from "./format";
import { ServicesAdmin } from "./ServicesAdmin";
import { SiteSettingsPage } from "./SiteSettingsPage";
import { StatsOverview } from "./StatsOverview";

const PAGE_SIZE = 20;
const AUTO_REFRESH_MS = 60_000;

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ${meta.badge}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

type AdminView = "overview" | "enquiries" | "services" | "hero" | "settings";

const VIEW_HASHES: Record<AdminView, string> = {
  overview: "#overview",
  enquiries: "#enquiries",
  services: "#services",
  hero: "#hero",
  settings: "#settings",
};

const VIEW_HEADINGS: Record<AdminView, { title: string; description: string }> =
  {
    overview: {
      title: "Enquiries dashboard",
      description:
        "Leads from the Contact us, Request a Nurse and Request Staff forms. Times are shown in Qatar time.",
    },
    enquiries: {
      title: "All enquiries",
      description:
        "Search, filter and update every enquiry. Click a row to open its details. Times are shown in Qatar time.",
    },
    services: {
      title: "Services",
      description:
        "Add, edit, hide and reorder the services on the website — their cards, menu links and pages.",
    },
    hero: {
      title: "Homepage hero",
      description:
        "The headline, buttons, highlights and photo slideshow at the top of the home page.",
    },
    settings: {
      title: "Site settings",
      description:
        "Contact details, office address and social media links shown on the public website.",
    },
  };

function viewFromHash(): AdminView {
  // Sub-pages add a path, e.g. #services/<id>.
  const base = window.location.hash.split("/")[0];
  const match = (Object.keys(VIEW_HASHES) as AdminView[]).find(
    view => VIEW_HASHES[view] === base
  );
  return match ?? "overview";
}

function useAdminView() {
  const [view, setView] = useState<AdminView>(viewFromHash);

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: AdminView) => {
    if (window.location.hash !== VIEW_HASHES[next])
      window.location.hash = VIEW_HASHES[next];
    setView(next);
    window.scrollTo({ top: 0 });
  }, []);

  return [view, navigate] as const;
}

function SideNavItem({
  icon: Icon,
  label,
  count,
  highlight,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count?: number;
  highlight?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border-0 px-3 text-left text-sm font-semibold whitespace-nowrap transition ${
        active
          ? "bg-[var(--bhsk-blue-text)] text-white shadow-[var(--shadow-1)]"
          : "bg-transparent text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)]"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {highlight ? (
        <span
          className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white text-[var(--bhsk-blue-text)]" : "bg-rose-500 text-white"}`}
          title={`${highlight} new`}
        >
          {highlight}
        </span>
      ) : null}
      {count !== undefined ? (
        <span
          className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-[var(--color-surface-page)] text-[var(--bhsk-ink)]"}`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** App-style tab for the bottom bar on phones and tablets. */
function BottomNavItem({
  icon: Icon,
  label,
  highlight,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  highlight?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`relative flex h-16 cursor-pointer flex-col items-center justify-center gap-1 border-0 bg-transparent text-[11px] font-semibold transition ${
        active
          ? "text-[var(--bhsk-blue-text)]"
          : "text-[var(--color-text-tertiary)] hover:text-[var(--bhsk-ink)]"
      }`}
    >
      {active ? (
        <span className="absolute top-0 h-0.5 w-10 rounded-full bg-[var(--bhsk-blue-text)]" />
      ) : null}
      <span
        className={`relative flex h-8 w-14 items-center justify-center rounded-full transition ${active ? "bg-[var(--color-surface-page)]" : ""}`}
      >
        <Icon className="size-5" />
        {highlight ? (
          <span
            className="absolute -top-0.5 right-1.5 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[10px] leading-4 text-white tabular-nums"
            aria-label={`${highlight} new`}
          >
            {highlight > 99 ? "99+" : highlight}
          </span>
        ) : null}
      </span>
      {label}
    </button>
  );
}

export function Dashboard({
  username,
  onSignOut,
}: {
  username: string;
  onSignOut: () => void;
}) {
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [page, setPage] = useState<EnquiryPage | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<EnquiryFilters>({
    search: "",
    status: "",
    enquiryType: "",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [view, navigate] = useAdminView();
  const requestId = useRef(0);

  const loadStats = useCallback(async () => {
    try {
      setStats(await fetchStats());
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  const loadPage = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const result = await fetchEnquiries(filters, pageNumber, PAGE_SIZE);
      if (id !== requestId.current) return;
      // Deleting the last item on a page leaves it empty — step back.
      if (result.items.length === 0 && pageNumber > 1) {
        setPageNumber(result.pageCount);
        return;
      }
      setPage(result);
      setError("");
    } catch (err) {
      if (id === requestId.current) setError(errorMessage(err));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [filters, pageNumber]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadStats(), loadPage()]);
    setRefreshing(false);
  }, [loadStats, loadPage]);

  useEffect(() => {
    setLoading(true);
    void loadPage();
  }, [loadPage]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshAll();
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(id);
  }, [refreshAll]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setFilters(current =>
        current.search === searchInput
          ? current
          : { ...current, search: searchInput }
      );
      setPageNumber(1);
    }, 300);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  function updateFilter(next: Partial<EnquiryFilters>) {
    setFilters(current => ({ ...current, ...next }));
    setPageNumber(1);
  }

  async function exportCsv() {
    setExporting(true);
    try {
      await downloadEnquiriesCsv(filters);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setExporting(false);
    }
  }

  const handleUpdated = useCallback(
    (updated: Enquiry) => {
      setSelected(updated);
      setPage(current =>
        current
          ? {
              ...current,
              items: current.items.map(item =>
                item.id === updated.id ? updated : item
              ),
            }
          : current
      );
      void loadStats();
    },
    [loadStats]
  );

  const handleDeleted = useCallback(() => {
    setSelected(null);
    void refreshAll();
  }, [refreshAll]);

  const closePanel = useCallback(() => setSelected(null), []);

  const hasFilters = Boolean(
    filters.search || filters.status || filters.enquiryType
  );
  const firstRow = page && page.total ? (page.page - 1) * page.pageSize + 1 : 0;
  const lastRow = page ? Math.min(page.page * page.pageSize, page.total) : 0;

  const navItems: {
    view: AdminView;
    icon: LucideIcon;
    label: string;
    shortLabel: string;
    count?: number;
    highlight?: number;
  }[] = [
    {
      view: "overview",
      icon: LayoutDashboard,
      label: "Overview",
      shortLabel: "Overview",
    },
    {
      view: "enquiries",
      icon: Inbox,
      label: "All enquiries",
      shortLabel: "Enquiries",
      count: stats?.total,
      highlight: stats?.byStatus.new,
    },
    {
      view: "services",
      icon: HandHeart,
      label: "Services",
      shortLabel: "Services",
    },
    {
      view: "hero",
      icon: PanelTop,
      label: "Homepage hero",
      shortLabel: "Hero",
    },
    {
      view: "settings",
      icon: Settings,
      label: "Site settings",
      shortLabel: "Settings",
    },
  ];

  const statusTabs: {
    value: EnquiryStatus | "";
    label: string;
    count?: number;
  }[] = [
    { value: "", label: "All", count: stats?.total },
    ...ENQUIRY_STATUSES.map(status => ({
      value: status,
      label: STATUS_META[status].label,
      count: stats?.byStatus[status],
    })),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/brand/bhsk-symbol.svg" alt="" className="size-9" />
            <div className="min-w-0 leading-tight">
              <p className="m-0 truncate font-bold text-[var(--bhsk-blue-text)]">
                BHSK Admin
              </p>
              <p className="m-0 truncate text-xs text-[var(--color-text-tertiary)]">
                Signed in as {username}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => void refreshAll()}
              disabled={refreshing}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-slate-100 disabled:cursor-wait"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold hover:bg-slate-100"
              aria-label="View website"
            >
              <ExternalLink className="size-4" />
              <span className="hidden sm:inline">View site</span>
            </a>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--bhsk-ink)] hover:bg-slate-50"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        </div>
      </header>

      <div className="lg:flex">
        <aside className="sticky top-16 z-30 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 border-r border-[var(--color-border)] bg-white lg:block">
          <nav
            className="flex flex-col gap-1 px-4 py-6"
            aria-label="Admin sections"
          >
            <p className="m-0 mb-2 px-3 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
              Menu
            </p>
            {navItems.map(item => (
              <SideNavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                count={item.count}
                highlight={item.highlight}
                active={view === item.view}
                onClick={() => navigate(item.view)}
              />
            ))}
          </nav>
        </aside>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--color-border)] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(16,48,60,0.06)] backdrop-blur lg:hidden"
          aria-label="Admin sections"
        >
          {navItems.map(item => (
            <BottomNavItem
              key={item.view}
              icon={item.icon}
              label={item.shortLabel}
              highlight={item.highlight}
              active={view === item.view}
              onClick={() => navigate(item.view)}
            />
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="m-0 text-2xl sm:text-3xl">
                {VIEW_HEADINGS[view].title}
              </h1>
              <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">
                {VIEW_HEADINGS[view].description}
              </p>
            </div>

            {error ? (
              <div
                className="flex items-start justify-between gap-3 rounded-xl bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error)]"
                role="alert"
              >
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[var(--color-error)]"
                  aria-label="Dismiss"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : null}

            {view === "overview" ? (
              <>
                <StatsOverview stats={stats} />
                <button
                  type="button"
                  onClick={() => navigate("enquiries")}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 text-left shadow-[var(--shadow-1)] transition hover:border-[var(--bhsk-blue)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-surface-page)] text-[var(--bhsk-blue-text)]">
                      <Inbox className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">
                        View all enquiries
                      </span>
                      <span className="block text-sm text-[var(--color-text-tertiary)]">
                        {stats
                          ? `${stats.byStatus.new} new of ${stats.total} total`
                          : "Open the full list to search and update leads"}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-[var(--color-text-tertiary)]" />
                </button>
              </>
            ) : view === "services" ? (
              <ServicesAdmin />
            ) : view === "hero" ? (
              <HeroSettingsPage />
            ) : view === "settings" ? (
              <SiteSettingsPage />
            ) : (
              <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-1)]">
                <div className="space-y-4 border-b border-[var(--color-border)] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 text-lg">Enquiry list</h2>
                    <button
                      type="button"
                      onClick={exportCsv}
                      disabled={exporting || !page?.total}
                      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {exporting ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Download className="size-4" />
                      )}
                      Export CSV
                    </button>
                  </div>

                  <div
                    className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1"
                    role="tablist"
                    aria-label="Filter by status"
                  >
                    {statusTabs.map(tab => {
                      const active = filters.status === tab.value;
                      return (
                        <button
                          key={tab.value || "all"}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => updateFilter({ status: tab.value })}
                          className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-0 px-3.5 py-1.5 text-sm font-semibold transition ${
                            active
                              ? "bg-[var(--bhsk-blue-text)] text-white"
                              : "bg-[var(--color-surface-page)] text-[var(--color-text-tertiary)] hover:text-[var(--bhsk-ink)]"
                          }`}
                        >
                          {tab.label}
                          {tab.count !== undefined ? (
                            <span
                              className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/20" : "bg-white text-[var(--bhsk-ink)]"}`}
                            >
                              {tab.count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                      <span className="sr-only">Search enquiries</span>
                      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                      <input
                        type="search"
                        value={searchInput}
                        onChange={event => setSearchInput(event.target.value)}
                        placeholder="Search name, phone, service…"
                        className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white pr-3 pl-9 text-base outline-none sm:h-10 sm:text-sm focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30"
                      />
                    </label>
                    <label className="sm:w-52">
                      <span className="sr-only">Enquiry type</span>
                      <select
                        value={filters.enquiryType}
                        onChange={event =>
                          updateFilter({
                            enquiryType: event.target
                              .value as EnquiryTypeFilter,
                          })
                        }
                        className="h-11 w-full cursor-pointer rounded-xl border border-[var(--color-border)] bg-white px-3 text-base outline-none sm:h-10 sm:text-sm focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30"
                      >
                        <option value="">All types</option>
                        <option value="patient">Home care (patients)</option>
                        <option value="employer">Staffing (employers)</option>
                        <option value="unspecified">Not specified</option>
                      </select>
                    </label>
                  </div>
                </div>

                <ul className="m-0 list-none divide-y divide-[var(--color-border)] p-0 sm:hidden">
                  {loading && !page
                    ? Array.from({ length: 5 }, (_, index) => (
                        <li key={index} className="space-y-2 px-4 py-4">
                          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                        </li>
                      ))
                    : page?.items.map(enquiry => (
                        <li key={enquiry.id}>
                          <button
                            type="button"
                            onClick={() => setSelected(enquiry)}
                            className="flex w-full cursor-pointer flex-col gap-1.5 border-0 bg-transparent px-4 py-3.5 text-left font-[inherit] text-[var(--bhsk-ink)] transition active:bg-[var(--color-surface-page)]"
                          >
                            <span className="flex w-full items-start justify-between gap-3">
                              <span
                                className={`min-w-0 truncate ${enquiry.status === "new" ? "font-bold" : "font-semibold"}`}
                              >
                                {enquiry.name}
                              </span>
                              <StatusBadge status={enquiry.status} />
                            </span>
                            <span className="flex w-full items-center justify-between gap-3 text-xs text-[var(--color-text-tertiary)]">
                              <span className="truncate">{enquiry.phone}</span>
                              <span
                                className="shrink-0"
                                title={formatDateTime(enquiry.createdAt)}
                              >
                                {formatRelative(enquiry.createdAt)}
                              </span>
                            </span>
                            <span className="truncate text-xs text-[var(--color-text-tertiary)]">
                              {[
                                TYPE_LABELS[enquiry.enquiryType],
                                enquiry.service,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </button>
                        </li>
                      ))}
                </ul>

                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[var(--color-surface-page)] text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                      <tr>
                        <th className="px-4 py-3 font-bold sm:px-5">
                          Received
                        </th>
                        <th className="px-4 py-3 font-bold">Name</th>
                        <th className="hidden px-4 py-3 font-bold sm:table-cell">
                          Type
                        </th>
                        <th className="hidden px-4 py-3 font-bold xl:table-cell">
                          Service
                        </th>
                        <th className="hidden px-4 py-3 font-bold xl:table-cell">
                          Form
                        </th>
                        <th className="px-4 py-3 font-bold sm:px-5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && !page
                        ? Array.from({ length: 5 }, (_, index) => (
                            <tr
                              key={index}
                              className="border-t border-[var(--color-border)]"
                            >
                              <td colSpan={6} className="px-5 py-4">
                                <div className="h-5 animate-pulse rounded bg-slate-100" />
                              </td>
                            </tr>
                          ))
                        : page?.items.map(enquiry => (
                            <tr
                              key={enquiry.id}
                              onClick={() => setSelected(enquiry)}
                              className={`cursor-pointer border-t border-[var(--color-border)] transition hover:bg-[var(--color-surface-page)] ${
                                enquiry.status === "new" ? "font-semibold" : ""
                              }`}
                            >
                              <td
                                className="px-4 py-3 whitespace-nowrap text-[var(--color-text-tertiary)] sm:px-5"
                                title={formatDateTime(enquiry.createdAt)}
                              >
                                {formatRelative(enquiry.createdAt)}
                              </td>
                              <td className="max-w-[16rem] px-4 py-3">
                                <button
                                  type="button"
                                  onClick={event => {
                                    event.stopPropagation();
                                    setSelected(enquiry);
                                  }}
                                  className="block max-w-full cursor-pointer truncate border-0 bg-transparent p-0 text-left font-[inherit] text-[var(--bhsk-ink)] hover:text-[var(--bhsk-blue-text)] hover:underline"
                                >
                                  {enquiry.name}
                                </button>
                                <span className="block truncate text-xs font-normal text-[var(--color-text-tertiary)]">
                                  {enquiry.phone}
                                </span>
                              </td>
                              <td className="hidden px-4 py-3 whitespace-nowrap sm:table-cell">
                                {TYPE_LABELS[enquiry.enquiryType]}
                              </td>
                              <td className="hidden max-w-[14rem] truncate px-4 py-3 xl:table-cell">
                                {enquiry.service || (
                                  <span className="text-[var(--color-text-tertiary)]">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="hidden px-4 py-3 whitespace-nowrap text-[var(--color-text-tertiary)] xl:table-cell">
                                {enquiry.source}
                              </td>
                              <td className="px-4 py-3 sm:px-5">
                                <StatusBadge status={enquiry.status} />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                {page && page.items.length === 0 ? (
                  <div className="px-6 py-14 text-center">
                    <p className="m-0 font-semibold">
                      {hasFilters
                        ? "No enquiries match these filters"
                        : "No enquiries yet"}
                    </p>
                    <p className="m-0 mt-1 text-sm text-[var(--color-text-tertiary)]">
                      {hasFilters
                        ? "Try a different search or status."
                        : "New leads from the website forms will appear here automatically."}
                    </p>
                    {hasFilters ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          updateFilter({
                            search: "",
                            status: "",
                            enquiryType: "",
                          });
                        }}
                        className="mt-4 cursor-pointer rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-semibold text-[var(--bhsk-blue-text)] hover:bg-[var(--color-surface-page)]"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {page && page.total > 0 ? (
                  <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-4 py-3 text-sm sm:px-5">
                    <span className="text-[var(--color-text-tertiary)]">
                      {firstRow}–{lastRow} of {page.total}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPageNumber(value => Math.max(1, value - 1))
                        }
                        disabled={page.page <= 1 || loading}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <span className="tabular-nums">
                        {page.page} / {page.pageCount}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPageNumber(value =>
                            Math.min(page.pageCount, value + 1)
                          )
                        }
                        disabled={page.page >= page.pageCount || loading}
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
          </div>
        </main>
      </div>

      {selected ? (
        <EnquiryPanel
          enquiry={selected}
          onClose={closePanel}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : null}
    </>
  );
}
