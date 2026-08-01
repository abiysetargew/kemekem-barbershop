"use client";
import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  Play,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  useAppointments,
  useServices,
  useBarbers,
  useBranches,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/database";
import { type AppointmentStatus } from "@/lib/booking";

const STATUS_FLOW: AppointmentStatus[] = [
  "confirmed",
  "checked_in",
  "in_service",
  "completed",
];

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked In",
  in_service: "In Service",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: "border-muted-foreground/40 text-muted-foreground",
  confirmed: "border-foreground/60 bg-foreground/5",
  checked_in: "border-blue-500/60 bg-blue-500/10 text-blue-300",
  in_service: "border-amber-500/60 bg-amber-500/10 text-amber-300",
  completed: "border-green-500/60 bg-green-500/10 text-green-300",
  cancelled: "border-red-500/60 bg-red-500/10 text-red-300",
  no_show: "border-red-500/60 bg-red-500/10 text-red-300",
};

export function BookingsView() {
  const [appointments, , updateOne] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();
  const [branches] = useBranches();

  const [view, setView] = useState<"list" | "board">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (dateFilter) list = list.filter((a) => a.appointment_date === dateFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          (a.customer_name || "").toLowerCase().includes(q) ||
          (a.customer_phone || "").includes(q) ||
          (a.appointment_number || "").toLowerCase().includes(q)
      );
    }
    list.sort((a: any, b: any) => {
      const dc = a.appointment_date.localeCompare(b.appointment_date);
      if (dc !== 0) return dc;
      return b.start_time.localeCompare(a.start_time);
    });
    return list;
  }, [appointments, statusFilter, search, dateFilter]);

  const onStatus = (id: string, status: AppointmentStatus) => {
    updateOne(id, (a) => ({ ...a, status, updated_at: new Date().toISOString() }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">All bookings</p>
          <h1 className="heading-2 mt-1">{appointments.length} total</h1>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setView("list")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              view === "list" ? "bg-foreground text-background" : "text-muted-foreground"
            )}
          >
            List
          </button>
          <button
            onClick={() => setView("board")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
              view === "board" ? "bg-foreground text-background" : "text-muted-foreground"
            )}
          >
            Board
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search name, phone, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-11 rounded-xl border border-input bg-card px-4 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-11 rounded-xl border border-input bg-card px-4 text-sm capitalize"
        >
          <option value="all">All status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k} className="capitalize">
              {v}
            </option>
          ))}
        </select>
        {(dateFilter || statusFilter !== "all" || search) && (
          <button
            onClick={() => {
              setDateFilter("");
              setStatusFilter("all");
              setSearch("");
            }}
            className="h-11 rounded-xl border border-border bg-card px-4 text-sm hover:bg-muted"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 p-16 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="heading-4 mt-4">No bookings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Bookings made on the public site will appear here.
          </p>
        </div>
      ) : view === "list" ? (
        <ListView
          bookings={filtered}
          services={services}
          barbers={barbers}
          branches={branches}
          onStatus={onStatus}
        />
      ) : (
        <BoardView
          bookings={filtered}
          services={services}
          barbers={barbers}
          branches={branches}
          onStatus={onStatus}
        />
      )}
    </div>
  );
}

function ListView({
  bookings,
  services,
  barbers,
  branches,
  onStatus,
}: {
  bookings: Appointment[];
  services: any[];
  barbers: any[];
  branches: any[];
  onStatus: (id: string, s: AppointmentStatus) => void;
}) {
  return (
    <div className="space-y-2">
      {bookings.map((b: any) => {
        const svc = services.find((s) => s.id === b.service_id);
        const barber = barbers.find((x) => x.id === b.barber_id);
        const branch = branches.find((x) => x.id === b.branch_id);
        return (
          <div
            key={b.id}
            className="rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-1 items-start gap-4">
                <div className="font-display text-xl text-foreground">
                  {b.start_time.slice(0, 5)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {b.customer_name}
                    </h3>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
                      {b.appointment_number}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs capitalize",
                        STATUS_STYLES[b.status as AppointmentStatus]
                      )}
                    >
                      {STATUS_LABELS[b.status as AppointmentStatus]}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(b.appointment_date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {b.start_time.slice(0, 5)} – {b.end_time.slice(0, 5)}
                    </span>
                    <span>📞 {b.customer_phone}</span>
                    <span>✂️ {svc?.name || "—"}</span>
                    <span>👤 {barber?.name || "—"}</span>
                    <span>📍 {branch?.name || "—"}</span>
                  </div>
                  {b.notes && (
                    <p className="mt-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs italic text-muted-foreground">
                      “{b.notes}”
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusActions
                  status={b.status}
                  onChange={(s) => onStatus(b.id, s)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BoardView({
  bookings,
  services,
  barbers,
  branches,
  onStatus,
}: {
  bookings: Appointment[];
  services: any[];
  barbers: any[];
  branches: any[];
  onStatus: (id: string, s: AppointmentStatus) => void;
}) {
  // Group bookings by date
  const byDate: Record<string, Appointment[]> = {};
  bookings.forEach((b: any) => {
    if (!byDate[b.appointment_date]) byDate[b.appointment_date] = [];
    byDate[b.appointment_date].push(b);
  });
  const dates = Object.keys(byDate).sort();

  return (
    <div className="space-y-6">
      {dates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No bookings
        </div>
      ) : (
        dates.map((date) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-foreground px-3 py-1.5 text-background">
                <div className="font-display text-lg font-semibold">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
                <div className="text-xs">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="font-display text-lg">
                {byDate[date].length} bookings
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {byDate[date]
                .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
                .map((b: any) => {
                  const svc = services.find((s) => s.id === b.service_id);
                  const barber = barbers.find((x) => x.id === b.barber_id);
                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-border bg-card p-4 transition-all hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="font-display text-2xl">
                          {b.start_time.slice(0, 5)}
                        </div>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] capitalize",
                            STATUS_STYLES[b.status as AppointmentStatus]
                          )}
                        >
                          {STATUS_LABELS[b.status as AppointmentStatus]}
                        </span>
                      </div>
                      <div className="mt-2 font-medium">{b.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {svc?.name} · {barber?.name}
                      </div>
                      <a
                        href={`tel:${b.customer_phone}`}
                        className="mt-2 block text-xs text-muted-foreground hover:text-foreground"
                      >
                        📞 {b.customer_phone}
                      </a>
                      <div className="mt-3 flex flex-wrap gap-1">
                        <StatusActions
                          status={b.status}
                          onChange={(s) => onStatus(b.id, s)}
                          small
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StatusActions({
  status,
  onChange,
  small,
}: {
  status: AppointmentStatus;
  onChange: (s: AppointmentStatus) => void;
  small?: boolean;
}) {
  const next = STATUS_FLOW.indexOf(status);
  return (
    <>
      {next >= 0 && next < STATUS_FLOW.length - 1 && (
        <button
          onClick={() => onChange(STATUS_FLOW[next + 1])}
          className={cn(
            "flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-all hover:opacity-90",
            small && "px-2 py-1 text-[10px]"
          )}
        >
          {next === 0 && (
            <>
              <UserCheck className="h-3 w-3" />
              Check In
            </>
          )}
          {next === 1 && (
            <>
              <Play className="h-3 w-3" />
              Start
            </>
          )}
          {next === 2 && (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Complete
            </>
          )}
        </button>
      )}
      {status !== "cancelled" && status !== "no_show" && status !== "completed" && (
        <>
          <button
            onClick={() => onChange("no_show")}
            className={cn(
              "flex items-center gap-1 rounded-full border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/10",
              small && "px-2 py-1 text-[10px]"
            )}
          >
            <AlertCircle className="h-3 w-3" />
            No-show
          </button>
          <button
            onClick={() => onChange("cancelled")}
            className={cn(
              "flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-300 transition-all hover:bg-red-500/10",
              small && "px-2 py-1 text-[10px]"
            )}
          >
            <X className="h-3 w-3" />
            Cancel
          </button>
        </>
      )}
    </>
  );
}