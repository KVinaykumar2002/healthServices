import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BellRing, CalendarDays, Inbox, TrendingUp } from "lucide-react";
import { ENQUIRY_STATUSES, type EnquiryStats } from "./api";
import { STATUS_META, formatDay } from "./format";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-1)] ${className}`}>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: number | undefined;
  hint: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold text-[var(--color-text-tertiary)]">{label}</p>
          <p className="m-0 mt-1 text-3xl font-bold tabular-nums">
            {value === undefined ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-100" /> : value}
          </p>
        </div>
        <span className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>{icon}</span>
      </div>
      <p className="m-0 mt-2 text-xs text-[var(--color-text-tertiary)]">{hint}</p>
    </Card>
  );
}

function BreakdownRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return (
    <li className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="truncate">{label}</span>
        <span className="tabular-nums text-[var(--color-text-tertiary)]">
          {count} <span className="text-xs">({percent}%)</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </li>
  );
}

export function StatsOverview({ stats }: { stats: EnquiryStats | null }) {
  const total = stats?.total ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total enquiries"
          value={stats?.total}
          hint="All time"
          icon={<Inbox className="size-5 text-[var(--bhsk-blue-text)]" />}
          accent="bg-[var(--color-surface-muted)]"
        />
        <StatCard
          label="Awaiting reply"
          value={stats?.byStatus.new}
          hint="Status: New"
          icon={<BellRing className="size-5 text-[#d61f4a]" />}
          accent="bg-[#ffe6ec]"
        />
        <StatCard
          label="Today"
          value={stats?.today}
          hint="Since midnight, Qatar time"
          icon={<CalendarDays className="size-5 text-emerald-700" />}
          accent="bg-emerald-50"
        />
        <StatCard
          label="Last 7 days"
          value={stats?.last7Days}
          hint="Including today"
          icon={<TrendingUp className="size-5 text-amber-700" />}
          accent="bg-amber-50"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="m-0 text-base">Enquiries — last 30 days</h2>
          <div className="mt-4 h-64">
            {stats ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.daily} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid vertical={false} stroke="#e2eef3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDay}
                    tick={{ fontSize: 11, fill: "#46606a" }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    minTickGap={24}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#46606a" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(111, 204, 221, 0.15)" }}
                    labelFormatter={(day) => formatDay(String(day))}
                    formatter={(value) => [value, "Enquiries"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid #d4ecf3", fontSize: 13 }}
                  />
                  <Bar dataKey="count" fill="#26a0cb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full animate-pulse rounded-xl bg-slate-50" />
            )}
          </div>
        </Card>

        <Card>
          <h2 className="m-0 text-base">Breakdown</h2>
          {stats ? (
            <div className="mt-4 space-y-5">
              <div>
                <h3 className="m-0 mb-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                  By status
                </h3>
                <ul className="m-0 list-none space-y-2 p-0">
                  {ENQUIRY_STATUSES.map((status) => (
                    <BreakdownRow
                      key={status}
                      label={STATUS_META[status].label}
                      count={stats.byStatus[status] ?? 0}
                      total={total}
                      color={STATUS_META[status].dot}
                    />
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="m-0 mb-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                  By type
                </h3>
                <ul className="m-0 list-none space-y-2 p-0">
                  <BreakdownRow label="Home care" count={stats.byType.patient} total={total} color="bg-[#6fccdd]" />
                  <BreakdownRow label="Staffing" count={stats.byType.employer} total={total} color="bg-[#146784]" />
                  {stats.byType.unspecified ? (
                    <BreakdownRow label="Not specified" count={stats.byType.unspecified} total={total} color="bg-slate-300" />
                  ) : null}
                </ul>
              </div>
              {stats.bySource.length ? (
                <div>
                  <h3 className="m-0 mb-2 text-xs font-bold tracking-wide text-[var(--color-text-tertiary)] uppercase">
                    Top forms
                  </h3>
                  <ul className="m-0 list-none space-y-2 p-0">
                    {stats.bySource.slice(0, 4).map((row) => (
                      <BreakdownRow key={row.source} label={row.source} count={row.count} total={total} color="bg-[#26a0cb]" />
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4 h-56 animate-pulse rounded-xl bg-slate-50" />
          )}
        </Card>
      </div>
    </div>
  );
}
