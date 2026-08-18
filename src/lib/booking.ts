"use client";
// Booking logic — Supabase-backed.
// All bookings persist server-side via Next.js API routes.

import { createBrowserClient } from "@/lib/supabase/client";
import { timeToMinutes, minutesToTime, generateAppointmentNumber } from "@/lib/utils";
import type { BookingFormData, Appointment, AppointmentStatus } from "@/types/database";

export interface AvailableSlot {
  time: string;
  available: boolean;
}

export type { AppointmentStatus };

export type CancelReason =
  | "customer_no_show"
  | "customer_canceled"
  | "barber_unavailable"
  | "shop_closed"
  | "other";

export type PaymentMethod = "cash" | "card" | "telebirr" | "transfer" | "other";

export async function createBooking(data: BookingFormData): Promise<Appointment> {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || "Booking failed");
  }
  return json as Appointment;
}

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  const params = new URLSearchParams({ barberId, serviceId, date });
  const res = await fetch(`/api/availability?${params}`);
  const json = await res.json();
  if (!res.ok) return [];
  return (json.slots ?? []) as AvailableSlot[];
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const res = await fetch(`/api/appointments/${id}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Status update failed");
  }
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  start_time: string
): Promise<void> {
  const res = await fetch(`/api/appointments/${id}/reschedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, start_time }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Reschedule failed");
  }
}

export async function cancelAppointment(
  id: string,
  reason?: string
): Promise<void> {
  const res = await fetch(`/api/appointments/${id}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Cancel failed");
  }
}

export async function markAppointmentPaid(
  id: string,
  method: PaymentMethod,
  amount: number
): Promise<void> {
  const res = await fetch(`/api/appointments/${id}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, amount }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Payment update failed");
  }
}

export async function unmarkAppointmentPaid(id: string): Promise<void> {
  const res = await fetch(`/api/appointments/${id}/pay`, { method: "DELETE" });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.error || "Unpay failed");
  }
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Appointment) || null;
}

export async function getAppointmentByToken(
  token: string
): Promise<Appointment | null> {
  const supabase = createBrowserClient();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("cancel_token", token)
    .maybeSingle();
  return (data as Appointment) || null;
}