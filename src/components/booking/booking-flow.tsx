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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Branch, Service, Barber } from "@/types/database";

interface BookingFlowProps {
  branches: Branch[];
  services: Service[];
  barbers: Barber[];
  interval: number;
  preselected?: {
    branch_id?: string;
    service_id?: string;
    barber_id?: string;
  };
}

const STEPS = [
  { id: 1, title: "Branch", icon: MapPin },
  { id: 2, title: "Service", icon: Scissors },
  { id: 3, title: "Barber", icon: User },
  { id: 4, title: "Time", icon: Calendar },
];

export function BookingFlow({
  branches,
  services,
  barbers,
  interval,
  preselected,
}: BookingFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [branchId, setBranchId] = useState<string>(preselected?.branch_id || "");
  const [serviceId, setServiceId] = useState<string>(preselected?.service_id || "");
  const [barberId, setBarberId] = useState<string>(preselected?.barber_id || "any");
  const [date, setDate] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedBranch = branches.find((b) => b.id === branchId);
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedBarber = barbers.find((b) => b.id === barberId);

  // Filter barbers by branch when branch selected (if branch_id set on barber)
  const branchFilteredBarbers = useMemo(() => {
    if (!branchId) return barbers;
    return barbers.filter((b) => !b.branch_id || b.branch_id === branchId);
  }, [barbers, branchId]);

  // Step guards
  const canNext = () => {
    if (step === 1) return !!branchId;
    if (step === 2) return !!serviceId;
    if (step === 3) return !!barberId;
    if (step === 4) return !!date && !!slot && !!name && !!phone;
    return false;
  };

  // Fetch slots when date + barber ready
  useEffect(() => {
    if (step !== 4 || !date || !barberId || !serviceId) return;
    const targetBarber = barberId === "any" ? branchFilteredBarbers[0]?.id : barberId;
    if (!targetBarber) return;
    setLoadingSlots(true);
    fetch(`/api/availability?barberId=${targetBarber}&serviceId=${serviceId}&date=${date}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => toast.error("Failed to load slots"))
      .finally(() => setLoadingSlots(false));
  }, [step, date, barberId, serviceId, branchFilteredBarbers]);

  const handleSubmit = async () => {
    if (!canNext()) return;
    setSubmitting(true);
    try {
      const targetBarber = barberId === "any" ? branchFilteredBarbers[0]?.id : barberId;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch_id: branchId,
          service_id: serviceId,
          barber_id: targetBarber,
          date,
          start_time: slot,
          customer_name: name,
          customer_phone: phone,
          notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create booking");
      }
      const data = await res.json();
      router.push(`/book/success?id=${data.id}`);
    } catch (e: any) {
      toast.error(e.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

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
                  isDone && "border-gold-500 bg-gold-500 text-white",
                  isActive && "border-foreground bg-foreground text-background",
                  !isActive && !isDone && "border-border bg-background text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step {s.id}
                </div>
                <div className={cn("text-sm font-medium", !isActive && !isDone && "text-muted-foreground")}>
                  {s.title}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    isDone ? "bg-gold-500" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="luxury-card overflow-hidden">
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
              <Step
                title="Choose a branch"
                subtitle="Both branches follow the same premium standards."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBranchId(b.id)}
                      className={cn(
                        "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all",
                        branchId === b.id
                          ? "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{b.name}</div>
                        <div className="mt-0.5 text-sm text-muted-foreground">
                          {b.address}
                        </div>
                      </div>
                      {branchId === b.id && (
                        <Check className="h-5 w-5 text-gold-600" />
                      )}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 2 && (
              <Step
                title="Choose a service"
                subtitle="Pick what you'd like today."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={cn(
                        "group flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                        serviceId === s.id
                          ? "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                        <Scissors className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{s.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {s.duration_minutes} min
                          <span>·</span>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(s.price)}
                          </span>
                        </div>
                      </div>
                      {serviceId === s.id && (
                        <Check className="h-5 w-5 text-gold-600" />
                      )}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 3 && (
              <Step
                title="Choose your barber"
                subtitle="Or let us match you with the next available."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setBarberId("any")}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                      barberId === "any"
                        ? "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10"
                        : "border-border hover:border-foreground/40"
                    )}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background text-xl">
                      ✨
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Any barber</div>
                      <div className="text-xs text-muted-foreground">
                        Next available professional
                      </div>
                    </div>
                    {barberId === "any" && (
                      <Check className="h-5 w-5 text-gold-600" />
                    )}
                  </button>
                  {branchFilteredBarbers.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBarberId(b.id)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                        barberId === b.id
                          ? "border-gold-500 bg-gold-50/50 dark:bg-gold-900/10"
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      <Avatar src={b.photo_url} alt={b.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {b.experience_years}+ yrs · ⭐ {b.rating}
                        </div>
                      </div>
                      {barberId === b.id && (
                        <Check className="h-5 w-5 text-gold-600" />
                      )}
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {step === 4 && (
              <Step
                title="Pick a date, time & your details"
                subtitle="Final step — confirm your slot."
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
                  {/* Date + slots */}
                  <div>
                    <Label className="mb-2 block">Date</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSlot("");
                      }}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Available time</Label>
                        <Badge variant="outline" className="text-[10px]">
                          {interval} min slots
                        </Badge>
                      </div>
                      <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                        {!date && (
                          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                            Pick a date first
                          </div>
                        )}
                        {date && loadingSlots && (
                          <div className="col-span-full flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        {date &&
                          !loadingSlots &&
                          slots.map((s) => (
                            <button
                              key={s.time}
                              disabled={!s.available}
                              onClick={() => setSlot(s.time)}
                              className={cn(
                                "rounded-xl border px-2 py-2.5 text-sm font-medium transition-all",
                                slot === s.time
                                  ? "border-gold-500 bg-gold-500 text-white"
                                  : s.available
                                  ? "border-border hover:border-foreground"
                                  : "border-border bg-muted text-muted-foreground line-through cursor-not-allowed"
                              )}
                            >
                              {s.time}
                            </button>
                          ))}
                        {date && !loadingSlots && slots.length === 0 && (
                          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                            No availability — try another date
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+251 ..."
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes (optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anything we should know?"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>

                    <div className="rounded-2xl bg-muted/40 p-4 text-sm">
                      <div className="font-semibold">Booking summary</div>
                      <ul className="mt-2 space-y-1 text-muted-foreground">
                        <li>
                          <span className="text-foreground">{selectedBranch?.name}</span>
                        </li>
                        <li>
                          {selectedService?.name} ·{" "}
                          {selectedService && formatCurrency(selectedService.price)}
                        </li>
                        <li>
                          {selectedBarber
                            ? selectedBarber.id === "any"
                              ? "Any barber"
                              : selectedBarber.name
                            : "—"}
                        </li>
                        <li>
                          {date || "—"}{slot ? ` · ${slot}` : ""}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Step>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 md:px-8">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          {step < 4 ? (
            <Button
              variant="gold"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
            >
              Continue
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="gold"
              onClick={handleSubmit}
              disabled={!canNext() || submitting}
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Confirm booking
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}