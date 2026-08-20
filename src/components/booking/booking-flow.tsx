"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Scissors,
  User,
  Calendar,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  useBranches,
  useServices,
  useBarbers,
  useAppointments,
} from "@/lib/store";
import { createBooking } from "@/lib/booking";
import { cn, formatCurrency, timeToMinutes, minutesToTime, formatTime12h } from "@/lib/utils";
import { toast } from "sonner";
import { ScissorsLoader } from "@/components/visual";

const STEPS = [
  { id: 1, title: "Branch", icon: MapPin },
  { id: 2, title: "Service", icon: Scissors },
  { id: 3, title: "Barber", icon: User },
  { id: 4, title: "Time", icon: Calendar },
];

interface Slot {
  time: string;
  available: boolean;
}

function computeSlots(
  barber: any,
  service: any,
  date: string,
  existing: any[]
): Slot[] {
  if (!barber || !service) return [];
  const interval = 60;
  const duration = service.duration_minutes || 60;
  const wh = barber.working_hours || { open: "08:00", close: "20:00" };
  const openMin = timeToMinutes(wh.open);
  const closeMin = timeToMinutes(wh.close);
  const dayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const dayName = dayNames[new Date(date + "T00:00:00").getDay()];
  if (barber.working_days && barber.working_days.length > 0 && !barber.working_days.includes(dayName)) {
    return [];
  }

  const slots: Slot[] = [];
  for (let m = openMin; m + duration <= closeMin; m += interval) {
    const startStr = minutesToTime(m);
    const endStr = minutesToTime(m + duration);
    const now = new Date();
    const slotDate = new Date(date + "T00:00:00");
    const isToday = slotDate.toDateString() === now.toDateString();
    if (isToday) {
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (m <= nowMin) continue;
    }
    const conflict = existing.some((a) => {
      if (a.status === "cancelled" || a.status === "no_show") return false;
      const aStart = timeToMinutes((a.start_time as string).slice(0, 5));
      const aEnd = timeToMinutes((a.end_time as string).slice(0, 5));
      return m < aEnd && m + duration > aStart;
    });
    slots.push({ time: startStr, available: !conflict });
  }
  return slots;
}

export function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [branches] = useBranches();
  const [services] = useServices();
  const [barbers] = useBarbers();
  const [appointments] = useAppointments();

  const [step, setStep] = useState(1);
  const [branchId, setBranchId] = useState<string>(
    searchParams?.get("branch") || ""
  );
  const [serviceId, setServiceId] = useState<string>(
    searchParams?.get("service") || ""
  );
  const [barberId, setBarberId] = useState<string>(
    searchParams?.get("barber") || "any"
  );
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedBranch = branches.find((b) => b.id === branchId);
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedBarber = barbers.find((b) => b.id === barberId);

  const branchFilteredBarbers = useMemo(() => {
    let list = barbers.filter((b: any) => b.is_active);
    if (branchId) {
      list = list.filter((b) => !b.branch_id || b.branch_id === branchId);
    }
    return list;
  }, [barbers, branchId]);

  const visibleServices = services.filter((s) => s.is_visible);

  // Compute slots directly client-side (no API)
  const slots = useMemo(() => {
    if (!date || !serviceId) return [];
    const target =
      barberId === "any"
        ? branchFilteredBarbers[0]
        : branchFilteredBarbers.find((b) => b.id === barberId);
    if (!target) return [];
    return computeSlots(target, selectedService, date, appointments);
  }, [date, serviceId, barberId, branchFilteredBarbers, selectedService, appointments]);

  const canNext = () => {
    if (step === 1) return !!branchId;
    if (step === 2) return !!serviceId;
    if (step === 3) return !!barberId;
    if (step === 4) return !!date && !!slot && !!name && !!phone;
    return false;
  };

  const handleSubmit = async () => {
    if (!canNext()) {
      toast.error("Please complete every step");
      return;
    }
    setSubmitting(true);
    try {
      const target =
        barberId === "any"
          ? branchFilteredBarbers[0]
          : branchFilteredBarbers.find((b) => b.id === barberId);
      if (!target || !selectedService || !selectedBranch) {
        throw new Error("Missing booking context");
      }

      const appt = await createBooking({
        branch_id: branchId,
        service_id: serviceId,
        barber_id: target.id,
        date,
        start_time: slot,
        customer_name: name,
        customer_phone: phone,
        notes: notes || undefined,
        referred_by: referredBy || undefined,
      });

      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const manageLink = `${origin}/manage/${appt.cancel_token}`;
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking_created",
          customer_name: name,
          customer_phone: phone,
          service_name: selectedService.name,
          barber_name: target.name,
          branch_name: selectedBranch.name,
          date,
          time: slot,
          appointment_number: appt.appointment_number,
          manage_link: manageLink,
        }),
      })
        .then((r) => console.log("[NOTIFY]", r.status, appt.appointment_number))
        .catch((e) => console.error("[NOTIFY FAIL]", e));

      toast.success(`Booked! Confirmation #${appt.appointment_number}`);
      router.push(`/book/success?id=${appt.id}`);
    } catch (e: any) {
      toast.error(e.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!branches.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-between gap-2 sm:gap-4">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <li key={s.id} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all sm:h-11 sm:w-11",
                  isDone && "border-foreground bg-foreground text-background",
                  isActive && "border-foreground bg-foreground text-background",
                  !isActive && !isDone && "border-border bg-background text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden sm:block min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step {s.id}
                </div>
                <div className={cn("text-sm font-medium truncate", !isActive && !isDone && "text-muted-foreground")}>
                  {s.title}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    isDone ? "bg-foreground" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-border bg-card shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-6 md:p-8"
          >
            {step === 1 && (
              <Step title="Choose a branch" subtitle="Both branches follow the same premium standards.">
                <div className="grid grid-cols-2 gap-3">
                  {branches.filter((b) => b.is_active).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBranchId(b.id)}
                      className={cn(
                        "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
                        branchId === b.id
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-foreground/10 text-foreground">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-lg font-semibold">{b.name}</div>
                        <div className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{b.address}</div>
                      </div>
                      {branchId === b.id && <Check className="h-5 w-5 text-foreground" />}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step title="Choose a service" subtitle="Pick what you'd like today.">
                <div className="grid grid-cols-2 gap-3">
                  {visibleServices.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={cn(
                        "group flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                        serviceId === s.id
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                        <Scissors className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{s.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {s.duration_minutes} min ·{" "}
                          <span className="font-semibold text-foreground">{formatCurrency(s.price)}</span>
                        </div>
                      </div>
                      {serviceId === s.id && <Check className="h-5 w-5 text-foreground" />}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 3 && (
              <Step
                title="Choose your barber / loctician"
                subtitle="Pick a specific professional, or let us match you with the next available."
              >
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setBarberId("any")}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                      barberId === "any"
                        ? "border-foreground bg-foreground/5"
                        : "border-border hover:border-foreground/40"
                    )}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background text-xl">
                      ✨
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-lg font-medium">Any barber / loctician</div>
                      <div className="text-xs text-muted-foreground">Next available professional</div>
                    </div>
                    {barberId === "any" && <Check className="h-5 w-5 text-foreground" />}
                  </button>
                  {branchFilteredBarbers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBarberId(b.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                        barberId === b.id
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-display text-base font-semibold">
                        {b.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(b as any).role === "stylist" ? "� Loctician" : "💈 Barber"} · ⭐ {b.rating}
                        </div>
                      </div>
                      {barberId === b.id && <Check className="h-5 w-5 text-foreground" />}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 4 && (
              <Step title="Pick a date, time & your details" subtitle="Final step — confirm your slot.">
                <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); setSlot(""); }}
                      min={new Date().toISOString().split("T")[0]}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    />
                    <div className="mt-5">
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Available time
                      </label>
                      <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                        {!date && (
                          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                            Pick a date first
                          </div>
                        )}
                        {date && slots.length === 0 && (
                          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                            No availability
                          </div>
                        )}
                        {date && slots.map((s) => (
                          <button
                            key={s.time}
                            disabled={!s.available}
                            onClick={() => setSlot(s.time)}
                            className={cn(
                              "rounded-xl border px-2 py-2.5 text-sm font-medium transition-all",
                              slot === s.time
                                ? "border-foreground bg-foreground text-background"
                                : s.available
                                ? "border-border hover:border-foreground"
                                : "border-border bg-muted text-muted-foreground line-through cursor-not-allowed"
                            )}
                          >
                            {formatTime12h(s.time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Full name *
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Phone *
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 92 ..."
                        className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything we should know?"
                        rows={2}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        How did you hear about us? (optional)
                      </label>
                      <select
                        value={referredBy}
                        onChange={(e) => setReferredBy(e.target.value)}
                        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                      >
                        <option value="">— Select —</option>
                        <option value="instagram">Instagram</option>
                        <option value="tiktok">TikTok</option>
                        <option value="facebook">Facebook</option>
                        <option value="friend">Friend / Family</option>
                        <option value="walk-in">Walked past</option>
                        <option value="google">Google</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="rounded-2xl bg-muted/40 p-4 text-sm">
                      <div className="font-display text-base">Booking summary</div>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li><span className="text-foreground">{selectedBranch?.name}</span></li>
                        <li>{selectedService?.name} · {selectedService && formatCurrency(selectedService.price)}</li>
                        <li>
                          {selectedBarber ? (selectedBarber.id === "any" ? "Any barber / loctician" : selectedBarber.name) : "—"}
                        </li>
                        <li>{date || "—"}{slot ? ` · ${formatTime12h(slot)}` : ""}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Step>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 md:px-8">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="rounded-full px-4 py-2 text-sm hover:bg-muted disabled:opacity-30"
          >
            <ChevronLeft className="mr-1 inline h-4 w-4" />
            Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="inline-flex items-center gap-1 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-30"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext() || submitting}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-30"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Confirming…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Confirm booking
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="heading-3">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}