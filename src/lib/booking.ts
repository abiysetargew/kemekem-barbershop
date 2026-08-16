"use client";
// Booking logic — Supabase-backed.
// All bookings persist server-side and sync across devices in real time.

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

function getSupabase() {
  return createBrowserClient();
}

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  const supabase = getSupabase();
  const [{ data: barber }, { data: service }, { data: appointments }] = await Promise.all([
    supabase.from("barbers").select("*").eq("id", barberId).maybeSingle(),
    supabase.from("services").select("*").eq("id", serviceId).maybeSingle(),
    supabase
      .from("appointments")
      .select("*")
      .eq("barber_id", barberId)
      .eq("appointment_date", date)
      .neq("status", "cancelled"),
  ]);

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

  const slots: AvailableSlot[] = [];
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
    const conflict = (appointments ?? []).some((a: any) => {
      const aStart = timeToMinutes((a.start_time as string).slice(0, 5));
      const aEnd = timeToMinutes((a.end_time as string).slice(0, 5));
      return m < aEnd && m + duration > aStart;
    });
    slots.push({ time: startStr, available: !conflict });
  }
  return slots;
}

export async function createBooking(data: BookingFormData): Promise<Appointment> {
  const supabase = getSupabase();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", data.service_id)
    .maybeSingle();
  const duration = service?.duration_minutes || 60;
  const startMin = timeToMinutes(data.start_time);
  const endTime = minutesToTime(startMin + duration);

  let { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", data.customer_phone)
    .maybeSingle();
  if (!customer) {
    const { data: created, error: cErr } = await supabase
      .from("customers")
      .insert({
        name: data.customer_name,
        phone: data.customer_phone,
        notes: data.notes || "",
        visit_count: 0,
        last_visit_at: null,
      })
      .select()
      .single();
    if (cErr) throw new Error(cErr.message);
    customer = created;
  }

  const { data: conflict } = await supabase
    .from("appointments")
    .select("id")
    .eq("barber_id", data.barber_id)
    .eq("appointment_date", data.date)
    .neq("status", "cancelled")
    .lte("start_time", data.start_time)
    .gt("end_time", data.start_time)
    .maybeSingle();
  if (conflict) throw new Error("This slot was just booked. Please pick another time.");

  const { data: appt, error } = await supabase
    .from("appointments")
    .insert({
      appointment_number: generateAppointmentNumber(),
      customer_id: customer.id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      notes: data.notes || null,
      branch_id: data.branch_id,
      service_id: data.service_id,
      barber_id: data.barber_id,
      appointment_date: data.date,
      start_time: data.start_time,
      end_time: endTime,
      status: "confirmed",
      payment_status: "unpaid",
      payment_method: null,
      paid_at: null,
      paid_amount: null,
      cancel_reason: null,
      referred_by: data.referred_by || null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return appt as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  start_time: string
): Promise<void> {
  const supabase = getSupabase();
  const { data: appt } = await supabase
    .from("appointments")
    .select("service_id")
    .eq("id", id)
    .maybeSingle();
  if (!appt) throw new Error("Appointment not found");

  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", appt.service_id)
    .maybeSingle();
  const duration = service?.duration_minutes || 60;
  const startMin = timeToMinutes(start_time);
  const endTime = minutesToTime(startMin + duration);

  const { error } = await supabase
    .from("appointments")
    .update({
      appointment_date: date,
      start_time,
      end_time: endTime,
      status: "confirmed",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function cancelAppointment(
  id: string,
  reason?: string
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("appointments")
    .update({ status: "cancelled", cancel_reason: reason || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function markAppointmentPaid(
  id: string,
  method: PaymentMethod,
  amount: number
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("appointments")
    .update({
      payment_status: "paid",
      payment_method: method,
      paid_at: new Date().toISOString(),
      paid_amount: amount,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function unmarkAppointmentPaid(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("appointments")
    .update({
      payment_status: "unpaid",
      paid_at: null,
      paid_amount: null,
      payment_method: null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("cancel_token", token)
    .maybeSingle();
  return (data as Appointment) || null;
}
