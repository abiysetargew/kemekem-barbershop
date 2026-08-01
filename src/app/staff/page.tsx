"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Check,
  X,
  UserCheck,
  Play,
  CheckCircle2,
  AlertCircle,
  Phone,
  Clock,
  Calendar,
  Scissors,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useAppointments,
  useServices,
  useBarbers,
  useBranches,
} from "@/lib/store";
import {
  cancelAppointment as cancelBookingFn,
  rescheduleAppointment as rescheduleFn,
  type AppointmentStatus,
} from "@/lib/booking";
import { cn, formatCurrency } from "@/lib/utils";

const STATUS_ORDER: AppointmentStatus[] = [
  "confirmed",
  "checked_in",
  "in_service",
  "completed",
];

export default function StaffPage() {
  const [appointments, , updateOne] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();
  const [branches] = useBranches();

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [barberFilter, setBarberFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const dayAppts = useMemo(() => {
    let list = appointments.filter((a: any) => a.appointment_date === date);
    if (branchFilter !== "all") list = list.filter((a: any) => a.branch_id === branchFilter);
    if (barberFilter !== "all") list = list.filter((a: any) => a.barber_id === barberFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a: any) =>
          (a.customer_name || "").toLowerCase().includes(q) ||
          (a.customer_phone || "").includes(q)
      );
    }
    return list.sort((a: any, b: any) =>
      a.start_time.localeCompare(b.start_time)
    );
  }, [appointments, date, branchFilter, barberFilter, search]);

  const update = (id: string, status: AppointmentStatus) => {
    updateOne(id, (a) => ({ ...a, status, updated_at: new Date().toISOString() }));
  };

  const filteredBarbers = branchFilter === "all"
    ? barbers.filter((b) => b.is_active)
    : barbers.filter((b) => b.is_active && (!b.branch_id || b.branch_id === branchFilter));

  const stats = {
    total: dayAppts.length,
    confirmed: dayAppts.filter((a: any) => a.status === "confirmed").length,
    checkedIn: dayAppts.filter((a: any) => a.status === "checked_in").length,
    inService: dayAppts.filter((a: any) => a.status === "in_service").length,
    completed: dayAppts.filter((a: any) => a.status === "completed").length,
    cancelled: dayAppts.filter((a: any) => ["cancelled","no_show"].includes(a.status)).length,
  };

  const navDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
              <Scissors className="h-4 w-4" />
            </div>
            <div>
              <div className="font-display text-base font-semibold leading-none">
                Staff
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Front desk
              </div>
            </div>
          </div>
          <a
            href="/admin/login"
            className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
          >
            Admin
          </a>
        </div>

        {/* Date + filters */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navDay(-1)}
              className="rounded-full border border-border p-1.5 hover:bg-muted"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-sm"
            />
            <button
              onClick={() => navDay(1)}
              className="rounded-full border border-border p-1.5 hover:bg-muted"
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDate(new Date().toISOString().split("T")[0])}
              className="ml-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted"
            >
              Today
            </button>
          </div>
          <div className="flex flex-1 gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-10 flex-1 rounded-xl border border-input bg-card px-3 text-sm"
            >
              <option value="all">All branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="h-10 flex-1 rounded-xl border border-input bg-card px-3 text-sm"
            >
              <option value="all">All barbers</option>
              {filteredBarbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Quick stats */}
        <div className="mt-3 grid grid-cols-6 gap-2 text-center">
          <Stat label="Total" value={stats.total} />
          <Stat label="New" value={stats.confirmed} />
          <Stat label="Here" value={stats.checkedIn} />
          <Stat label="Live" value={stats.inService} active />
          <Stat label="Done" value={stats.completed} />
          <Stat label="Skip" value={stats.cancelled} />
        </div>
      </header>

      {/* List */}
      <main className="px-4 py-4 md:px-6">
        {dayAppts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="display mt-4 text-2xl">No bookings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enjoy the quiet — or check another day.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppts.map((a: any) => {
              const svc = services.find((s) => s.id === a.service_id);
              const barber = barbers.find((x) => x.id === a.barber_id);
              const branch = branches.find((x) => x.id === a.branch_id);
              const nextStatus = nextStep(a.status);
              return (
                <div
                  key={a.id}
                  className={cn(
                    "rounded-2xl border bg-card p-4 transition-all",
                    a.status === "cancelled" || a.status === "no_show"
                      ? "border-red-500/30 opacity-60"
                      : a.status === "completed"
                      ? "border-green-500/40"
                      : a.status === "in_service"
                      ? "border-amber-500/40 ring-1 ring-amber-500/30"
                      : a.status === "checked_in"
                      ? "border-blue-500/40"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="flex flex-col items-center justify-center rounded-xl bg-foreground px-3 py-2 text-background">
                      <div className="font-display text-2xl font-semibold leading-none">
                        {a.start_time.slice(0, 5)}
                      </div>
                      <div className="text-[10px] opacity-80">→ {a.end_time.slice(0, 5)}</div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold truncate">
                          {a.customer_name}
                        </h3>
                        <StatusPill status={a.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <a href={`tel:${a.customer_phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                          <Phone className="h-3 w-3" />
                          {a.customer_phone}
                        </a>
                        <span className="inline-flex items-center gap-1">
                          ✂️ {svc?.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          👤 {barber?.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          📍 {branch?.name?.replace(" Branch", "")}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          {svc ? formatCurrency(svc.price) : ""}
                        </span>
                      </div>
                      {a.notes && (
                        <p className="mt-2 rounded-lg bg-muted/50 px-3 py-1.5 text-xs italic text-muted-foreground">
                          “{a.notes}”
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => update(a.id, nextStatus)}
                          className={cn(
                            "inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-90",
                            nextStatus === "checked_in" && "bg-blue-500 text-white",
                            nextStatus === "in_service" && "bg-amber-500 text-background",
                            nextStatus === "completed" && "bg-green-500 text-white"
                          )}
                        >
                          {nextStatus === "checked_in" && (
                            <>
                              <UserCheck className="h-3 w-3" />
                              Check In
                            </>
                          )}
                          {nextStatus === "in_service" && (
                            <>
                              <Play className="h-3 w-3" />
                              Start
                            </>
                          )}
                          {nextStatus === "completed" && (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Complete
                            </>
                          )}
                        </button>
                      )}
                      {a.status !== "cancelled" &&
                        a.status !== "no_show" &&
                        a.status !== "completed" && (
                          <>
                            <button
                              onClick={() => update(a.id, "no_show")}
                              className="inline-flex items-center justify-center gap-1 rounded-full border border-amber-500/40 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/10"
                            >
                              <AlertCircle className="h-3 w-3" />
                              No-show
                            </button>
                            <button
                              onClick={() => update(a.id, "cancelled")}
                              className="inline-flex items-center justify-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function nextStep(status: AppointmentStatus): AppointmentStatus | null {
  const idx = STATUS_ORDER.indexOf(status);
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}

function StatusPill({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-border text-muted-foreground",
    confirmed: "border-foreground/40 bg-foreground/10",
    checked_in: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    in_service: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    completed: "border-green-500/40 bg-green-500/15 text-green-300",
    cancelled: "border-red-500/40 bg-red-500/15 text-red-300",
    no_show: "border-red-500/40 bg-red-500/15 text-red-300",
  };
  const labels: Record<AppointmentStatus, string> = {
    pending: "Pending",
    confirmed: "Booked",
    checked_in: "Checked in",
    in_service: "In service",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No-show",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}

function Stat({ label, value, active }: { label: string; value: number; active?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card px-2 py-1.5",
        active && "ring-1 ring-amber-500/40"
      )}
    >
      <div className="font-display text-lg font-semibold leading-none">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}