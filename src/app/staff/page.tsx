"use client";
import { useState, useMemo } from "react";
import {
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
  Banknote,
  CreditCard,
  Smartphone,
  CircleDot,
  XCircle,
} from "lucide-react";
import {
  useAppointments,
  useServices,
  useBarbers,
  useBranches,
} from "@/lib/store";
import {
  cancelAppointment,
  markAppointmentPaid,
  unmarkAppointmentPaid,
  type CancelReason,
  type PaymentMethod,
} from "@/lib/booking";
import { cn, formatCurrency } from "@/lib/utils";

const STATUS_ORDER = ["confirmed", "checked_in", "in_service", "completed"] as const;
type AppointmentStatus = (typeof STATUS_ORDER)[number] | "pending" | "cancelled" | "no_show";

const NEXT_STATUS: Record<string, AppointmentStatus> = {
  confirmed: "checked_in",
  checked_in: "in_service",
  in_service: "completed",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Booked",
  checked_in: "Checked In",
  in_service: "In Service",
  completed: "Completed",
};

const CANCEL_REASONS: { value: CancelReason; label: string }[] = [
  { value: "customer_no_show", label: "Customer no-show" },
  { value: "customer_canceled", label: "Customer canceled" },
  { value: "barber_unavailable", label: "Barber unavailable" },
  { value: "shop_closed", label: "Shop closed / emergency" },
  { value: "other", label: "Other" },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "telebirr", label: "Telebirr", icon: Smartphone },
  { value: "transfer", label: "Transfer", icon: CircleDot },
  { value: "other", label: "Other", icon: CircleDot },
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

  const [payFor, setPayFor] = useState<any | null>(null);
  const [cancelFor, setCancelFor] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<CancelReason>("customer_no_show");

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
    return list.sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
  }, [appointments, date, branchFilter, barberFilter, search]);

  const onStatus = (id: string, status: AppointmentStatus) => {
    updateOne(id, (a) => ({ ...a, status, updated_at: new Date().toISOString() }));
  };

  const filteredBarbers = branchFilter === "all"
    ? barbers.filter((b) => b.is_active)
    : barbers.filter((b) => b.is_active && (!b.branch_id || b.branch_id === branchFilter));

  // Stats with revenue
  const stats = {
    total: dayAppts.length,
    checkedIn: dayAppts.filter((a: any) => a.status === "checked_in").length,
    inService: dayAppts.filter((a: any) => a.status === "in_service").length,
    completed: dayAppts.filter((a: any) => a.status === "completed").length,
    cancelled: dayAppts.filter((a: any) => ["cancelled","no_show"].includes(a.status)).length,
    unpaid: dayAppts.filter((a: any) => a.status === "completed" && a.payment_status !== "paid").length,
    paid: dayAppts.filter((a: any) => a.payment_status === "paid").length,
  };

  const revenue = dayAppts
    .filter((a: any) => a.payment_status === "paid")
    .reduce((sum: number, a: any) => sum + (Number(a.paid_amount) || 0), 0);

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
              <div className="font-display text-base font-semibold leading-none">Staff</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Front desk</div>
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
            <button onClick={() => navDay(-1)} className="rounded-full border border-border p-1.5 hover:bg-muted" aria-label="Previous day">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-sm"
            />
            <button onClick={() => navDay(1)} className="rounded-full border border-border p-1.5 hover:bg-muted" aria-label="Next day">
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

        {/* Stats — including revenue */}
        <div className="mt-3 grid grid-cols-7 gap-1.5 text-center">
          <Stat label="Total" value={stats.total} />
          <Stat label="Here" value={stats.checkedIn} />
          <Stat label="Live" value={stats.inService} active />
          <Stat label="Done" value={stats.completed} />
          <Stat label="Cancel" value={stats.cancelled} />
          <Stat label="Paid" value={stats.paid} success />
          <Stat label="Unpaid" value={stats.unpaid} danger={stats.unpaid > 0} />
        </div>
        {revenue > 0 && (
          <div className="mt-2 rounded-xl border border-foreground/30 bg-foreground/5 px-4 py-2.5 text-center">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Revenue today</div>
            <div className="font-display text-2xl font-bold">{formatCurrency(revenue)}</div>
          </div>
        )}
      </header>

      {/* List */}
      <main className="px-4 py-4 md:px-6">
        {dayAppts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="display mt-4 text-2xl">No bookings</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enjoy the quiet — or check another day.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppts.map((a: any) => {
              const svc = services.find((s) => s.id === a.service_id);
              const barber = barbers.find((x) => x.id === a.barber_id);
              const branch = branches.find((x) => x.id === a.branch_id);
              const nextStatus = NEXT_STATUS[a.status];
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
                    <div className="flex flex-col items-center justify-center rounded-xl bg-foreground px-3 py-2 text-background">
                      <div className="font-display text-2xl font-semibold leading-none">
                        {a.start_time.slice(0, 5)}
                      </div>
                      <div className="text-[10px] opacity-80">→ {a.end_time.slice(0, 5)}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold truncate">
                          {a.customer_name}
                        </h3>
                        <StatusPill status={a.status} />
                        {a.payment_status === "paid" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-400">
                            <Banknote className="h-3 w-3" />
                            Paid · {a.paid_amount ? formatCurrency(a.paid_amount) : ""}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <a href={`tel:${a.customer_phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                          <Phone className="h-3 w-3" />
                          {a.customer_phone}
                        </a>
                        <span className="inline-flex items-center gap-1">✂️ {svc?.name}</span>
                        <span className="inline-flex items-center gap-1">💈 {barber?.name}</span>
                        <span className="inline-flex items-center gap-1">📍 {branch?.name?.replace(" Branch", "")}</span>
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

                    <div className="flex flex-col gap-2">
                      {nextStatus && (
                        <button
                          onClick={async () => {
                            onStatus(a.id, nextStatus);
                            const messages: Record<string, string> = {
                              checked_in: "Customer arrived",
                              in_service: "Service started",
                              completed: "Service completed",
                            };
                            fetch("/api/notify", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                type: nextStatus === "completed" ? "booking_completed" : "status_changed",
                                customer_name: a.customer_name,
                                customer_phone: a.customer_phone,
                                service_name: svc?.name,
                                barber_name: barber?.name,
                                branch_name: branch?.name,
                                date: a.appointment_date,
                                time: a.start_time.slice(0, 5),
                                appointment_number: a.appointment_number,
                                new_status: messages[nextStatus],
                                manage_link: typeof window !== "undefined" ? `${window.location.origin}/manage/${a.cancel_token}` : undefined,
                              }),
                            }).catch(() => {});
                          }}
                          className={cn(
                            "inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-90",
                            nextStatus === "checked_in" && "bg-blue-500 text-white",
                            nextStatus === "in_service" && "bg-amber-500 text-background",
                            nextStatus === "completed" && "bg-green-500 text-white"
                          )}
                        >
                          {nextStatus === "checked_in" && <UserCheck className="h-3 w-3" />}
                          {nextStatus === "in_service" && <Play className="h-3 w-3" />}
                          {nextStatus === "completed" && <CheckCircle2 className="h-3 w-3" />}
                          {STATUS_LABEL[nextStatus]}
                        </button>
                      )}
                      {a.status === "completed" && a.payment_status !== "paid" && (
                        <button
                          onClick={() => setPayFor(a)}
                          className="inline-flex items-center justify-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90"
                        >
                          <Banknote className="h-3 w-3" />
                          Mark paid
                        </button>
                      )}
                      {a.payment_status === "paid" && (
                        <button
                          onClick={async () => {
                            await unmarkAppointmentPaid(a.id);
                            updateOne(a.id, (x) => ({ ...x }));
                          }}
                          className="inline-flex items-center justify-center gap-1 rounded-full border border-foreground/40 px-3 py-1.5 text-xs text-foreground/70 hover:bg-foreground/5"
                        >
                          Undo paid
                        </button>
                      )}
                      {a.status !== "cancelled" && a.status !== "no_show" && (
                        <>
                          <button
                            onClick={() => setCancelFor(a)}
                            className="inline-flex items-center justify-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-3 w-3" />
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

      {/* Payment modal */}
      {payFor && (
        <Modal title="Mark payment" onClose={() => setPayFor(null)}>
          <PayForm
            appt={payFor}
            servicePrice={services.find((s) => s.id === payFor.service_id)?.price || 0}
            onPaid={async (method, amount) => {
              await markAppointmentPaid(payFor.id, method, amount);
              updateOne(payFor.id, (x) => ({ ...x }));
              const svcP = services.find((s) => s.id === payFor.service_id);
              const barberP = barbers.find((b) => b.id === payFor.barber_id);
              const branchP = branches.find((b) => b.id === payFor.branch_id);
              fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: "payment_received",
                  customer_name: payFor.customer_name,
                  customer_phone: payFor.customer_phone,
                  service_name: svcP?.name,
                  barber_name: barberP?.name,
                  branch_name: branchP?.name,
                  date: payFor.appointment_date,
                  time: payFor.start_time.slice(0, 5),
                  appointment_number: payFor.appointment_number,
                  amount,
                  payment_method: method,
                  manage_link:
                    typeof window !== "undefined"
                      ? `${window.location.origin}/manage/${payFor.cancel_token}`
                      : undefined,
                }),
              }).catch(() => {});
              setPayFor(null);
            }}
            onCancel={() => setPayFor(null)}
          />
        </Modal>
      )}

      {/* Cancel modal */}
      {cancelFor && (
        <Modal title="Cancel booking" onClose={() => setCancelFor(null)}>
          <div className="space-y-4">
            <div className="rounded-xl bg-muted/40 p-4 text-sm">
              <div className="font-medium">{cancelFor.customer_name}</div>
              <div className="text-muted-foreground">
                {cancelFor.appointment_date} · {cancelFor.start_time.slice(0, 5)}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reason
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value as CancelReason)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {CANCEL_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelFor(null)}
                className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted"
              >
                Keep booking
              </button>
              <button
                onClick={async () => {
                  await cancelAppointment(cancelFor.id, cancelReason);
                  updateOne(cancelFor.id, (x) => ({
                    ...x,
                    status: "cancelled",
                    cancel_reason: cancelReason,
                  }));
                  setCancelFor(null);
                }}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Cancel booking
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Stat({ label, value, active, success, danger }: {
  label: string; value: number; active?: boolean; success?: boolean; danger?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card px-1.5 py-1.5",
        active && "ring-1 ring-amber-500/40",
        success && "bg-green-500/5 border-green-500/30",
        danger && "bg-red-500/5 border-red-500/30"
      )}
    >
      <div className="font-display text-base font-semibold leading-none">{value}</div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-border text-muted-foreground",
    confirmed: "border-foreground/40 bg-foreground/10",
    checked_in: "border-blue-500/40 bg-blue-500/15 text-blue-300",
    in_service: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    completed: "border-green-500/40 bg-green-500/15 text-green-300",
    cancelled: "border-red-500/40 bg-red-500/15 text-red-300",
    no_show: "border-red-500/40 bg-red-500/15 text-red-300",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        styles[status]
      )}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function Modal({ children, onClose, title }: {
  children: React.ReactNode; onClose: () => void; title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PayForm({
  appt,
  servicePrice,
  onPaid,
  onCancel,
}: {
  appt: any;
  servicePrice: number;
  onPaid: (method: PaymentMethod, amount: number) => void;
  onCancel: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [amount, setAmount] = useState<number>(servicePrice || 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-muted/40 p-4 text-sm">
        <div className="font-medium">{appt.customer_name}</div>
        <div className="text-muted-foreground">
          {appt.appointment_date} · {appt.start_time.slice(0, 5)}
        </div>
        <div className="mt-1 font-display text-lg">
          Service price: {formatCurrency(servicePrice)}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Payment method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm transition-all",
                method === m.value
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/40"
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Amount paid
        </label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={() => onPaid(method, amount)}
          disabled={!amount || amount <= 0}
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
        >
          <Banknote className="h-3 w-3" />
          Confirm payment
        </button>
      </div>
    </div>
  );
}