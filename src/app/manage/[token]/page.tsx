"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Phone,
  ArrowRight,
  Loader2,
  User,
  MapPin,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Play,
  UserCheck,
} from "lucide-react";
import { useAppointments, useServices, useBarbers, useBranches } from "@/lib/store";
import {
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  type AppointmentStatus,
} from "@/lib/booking";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [appointments] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();
  const [branches] = useBranches();

  const appt = appointments.find((a) => a.cancel_token === token);
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rescheduling || !date || !appt) return;
    setLoading(true);
    fetch(`/api/availability?barberId=${appt.barber_id}&serviceId=${appt.service_id}&date=${date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []))
      .finally(() => setLoading(false));
  }, [rescheduling, date, appt]);

  if (!appt) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="container-tight max-w-xl text-center">
          <h1 className="display text-4xl sm:text-5xl">Booking not found</h1>
          <p className="mt-3 text-muted-foreground">
            We couldn&apos;t find this booking. The link may be invalid or expired.
            If you booked recently, please contact the shop.
          </p>
          <Link
            href="/book"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            Book again
          </Link>
        </div>
      </section>
    );
  }

  const svc = services.find((s) => s.id === appt.service_id);
  const barber = barbers.find((b) => b.id === appt.barber_id);
  const branch = branches.find((b) => b.id === appt.branch_id);

  const update = async (s: AppointmentStatus) => {
    await updateAppointmentStatus(appt.id, s);
  };

  const cancel = async () => {
    if (!confirm("Cancel this booking?")) return;
    await cancelAppointment(appt.id);
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking_cancelled",
        customer_name: appt.customer_name,
        customer_phone: appt.customer_phone,
        service_name: svc?.name,
        date: appt.appointment_date,
        time: appt.start_time,
        appointment_number: appt.appointment_number,
      }),
    }).catch(() => {});
    toast.success("Booking cancelled");
  };

  const onReschedule = async () => {
    if (!date || !slot) return;
    await rescheduleAppointment(appt.id, date, slot);
    setRescheduling(false);
    setDate("");
    setSlot("");
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking_rescheduled",
        customer_name: appt.customer_name,
        customer_phone: appt.customer_phone,
        service_name: svc?.name,
        barber_name: barber?.name,
        date,
        time: slot,
        appointment_number: appt.appointment_number,
      }),
    }).catch(() => {});
    toast.success("Booking rescheduled");
  };

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-2xl">
        <h1 className="display text-4xl sm:text-5xl">Manage your booking</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirmation <span className="font-mono">{appt.appointment_number}</span>
        </p>

        <div className="mt-8 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-7">
            <div className="font-display text-2xl">
              {new Date(appt.appointment_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}{" "}
              · {appt.start_time.slice(0, 5)} – {appt.end_time.slice(0, 5)}
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Scissors className="h-4 w-4" />{svc?.name} · {svc ? formatCurrency(svc.price) : ""}</li>
              <li className="flex items-center gap-2"><User className="h-4 w-4" />{barber?.name}</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" />{branch?.name}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" />{appt.customer_phone}</li>
            </ul>
            <div className="mt-4 inline-block rounded-full border border-border bg-background px-3 py-1 text-xs capitalize">
              {appt.status.replace("_", " ")}
            </div>
          </div>

          {new Date(appt.appointment_date + "T" + appt.start_time) > new Date() &&
            appt.status !== "cancelled" && (
              <>
                <div className="rounded-3xl border border-border bg-card p-7">
                  <h3 className="font-display text-xl">Quick status</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {appt.status === "confirmed" && (
                      <button onClick={() => update("checked_in")} className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white">
                        <UserCheck className="h-3 w-3" /> Check in
                      </button>
                    )}
                    {appt.status === "checked_in" && (
                      <button onClick={() => update("in_service")} className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-background">
                        <Play className="h-3 w-3" /> Start
                      </button>
                    )}
                    {appt.status === "in_service" && (
                      <button onClick={() => update("completed")} className="inline-flex items-center gap-1 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white">
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </button>
                    )}
                    <button onClick={() => update("no_show")} className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10">
                      <AlertCircle className="h-3 w-3" /> No-show
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-7">
                  <h3 className="font-display text-xl">Reschedule</h3>
                  {!rescheduling ? (
                    <button
                      onClick={() => setRescheduling(true)}
                      className="mt-3 inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-xs hover:bg-muted"
                    >
                      Pick new time
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => { setDate(e.target.value); setSlot(""); }}
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      />
                      {date && (
                        <div className="grid grid-cols-4 gap-2">
                          {loading ? (
                            <div className="col-span-4 flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : slots.length === 0 ? (
                            <div className="col-span-4 py-4 text-center text-xs text-muted-foreground">
                              No availability
                            </div>
                          ) : slots.map((s) => (
                            <button
                              key={s.time}
                              disabled={!s.available}
                              onClick={() => setSlot(s.time)}
                              className={cn(
                                "rounded-lg border px-2 py-2 text-xs font-medium",
                                slot === s.time
                                  ? "border-foreground bg-foreground text-background"
                                  : s.available
                                  ? "border-border hover:border-foreground"
                                  : "border-border bg-muted text-muted-foreground line-through cursor-not-allowed"
                              )}
                            >
                              {s.time}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={onReschedule}
                          disabled={!date || !slot}
                          className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background disabled:opacity-30"
                        >
                          Confirm new time
                        </button>
                        <button onClick={() => setRescheduling(false)} className="rounded-full border border-border px-4 py-2 text-xs">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-border bg-card p-7">
                  <h3 className="font-display text-xl">Cancel booking</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can cancel up to 2 hours before the appointment.
                  </p>
                  <button
                    onClick={cancel}
                    className="mt-3 inline-flex items-center gap-1 rounded-full bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground"
                  >
                    Cancel booking
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </section>
  );
}