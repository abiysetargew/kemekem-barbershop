"use client";
import { useEffect, useState } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Appointment } from "@/types/database";
import { cn } from "@/lib/utils";

export function ManageBookingActions({ appointment }: { appointment: Appointment }) {
  const [appt, setAppt] = useState(appointment);
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [slot, setSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isPast = new Date(appt.appointment_date + "T" + appt.start_time) < new Date();

  const fetchSlots = async (d: string) => {
    setLoadingSlots(true);
    try {
      const r = await fetch(
        `/api/availability?barberId=${appt.barber_id}&serviceId=${appt.service_id}&date=${d}`
      );
      const data = await r.json();
      setSlots(data.slots || []);
    } finally {
      setLoadingSlots(false);
    }
  };

  const onReschedule = async () => {
    if (!date || !slot) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/appointments/${appt.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, start_time: slot }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || "Failed");
      }
      const updated = await r.json();
      setAppt(updated);
      setSlot("");
      setDate("");
      setSlots([]);
      toast.success("Booking rescheduled");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/appointments/${appt.id}/cancel`, { method: "POST" });
      if (!r.ok) throw new Error("Failed");
      const updated = await r.json();
      setAppt(updated);
      toast.success("Booking cancelled");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="luxury-card p-7">
        <div className="font-display text-xl font-semibold">
          {appt.appointment_number}
        </div>
        <div className="mt-3 grid gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Status: </span>
            <span className="font-medium capitalize">{appt.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gold-600" />
            {new Date(appt.appointment_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold-600" />
            {appt.start_time.slice(0, 5)} – {appt.end_time.slice(0, 5)}
          </div>
        </div>
      </div>

      {appt.status === "cancelled" ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm">
          This booking has been cancelled.
        </div>
      ) : isPast ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          This appointment has already passed.
        </div>
      ) : (
        <>
          {/* Reschedule */}
          <div className="luxury-card p-7">
            <h3 className="font-semibold">Reschedule</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a new date and time.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="new-date">New date</Label>
                <Input
                  id="new-date"
                  type="date"
                  className="mt-1.5"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSlot("");
                    if (e.target.value) fetchSlots(e.target.value);
                  }}
                />
              </div>
              {date && (
                <div>
                  <Label>Available time</Label>
                  {loadingSlots ? (
                    <div className="mt-2 flex h-10 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          disabled={!s.available}
                          onClick={() => setSlot(s.time)}
                          className={cn(
                            "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
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
                      {slots.length === 0 && (
                        <div className="col-span-full py-2 text-xs text-muted-foreground">
                          No availability.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <Button
                variant="gold"
                disabled={!date || !slot || submitting}
                onClick={onReschedule}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Confirm new time"
                )}
              </Button>
            </div>
          </div>

          {/* Cancel */}
          <div className="luxury-card p-7">
            <h3 className="font-semibold">Cancel booking</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You can cancel up to 2 hours before the appointment.
            </p>
            <Button
              variant="destructive"
              className="mt-5"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel booking
            </Button>
          </div>
        </>
      )}
    </div>
  );
}