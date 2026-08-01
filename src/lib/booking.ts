"use client";
// Booking logic — localStorage-backed (no DB required).
// All bookings persist per-browser. For real multi-user deployment, swap this
// with a Supabase-backed equivalent.

import { timeToMinutes, minutesToTime, generateAppointmentNumber } from "@/lib/utils";
import type { BookingFormData, Appointment } from "@/types/database";
import { SEED_BARBERS, SEED_SERVICES } from "./seed-data";

const BOOKINGS_KEY = "kemekem.appointments";
const CUSTOMERS_KEY = "kemekem.customers";

export interface AvailableSlot {
  time: string;
  available: boolean;
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_service"
  | "completed"
  | "cancelled"
  | "no_show";

function isBrowser() {
  return typeof window !== "undefined";
}

function loadArr<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function saveArr<T>(key: string, value: T[]) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  const barbers = loadArr<any>("kemekem.barbers");
  const services = loadArr<any>("kemekem.services");
  const barber =
    barbers.find((b) => b.id === barberId) ||
    SEED_BARBERS.find((b) => b.id === barberId);
  const service =
    services.find((s) => s.id === serviceId) ||
    SEED_SERVICES.find((s) => s.id === serviceId);
  if (!barber || !service) return [];

  const interval = 60; // 1-hour slots per client spec
  const duration = service.duration_minutes || 60;
  const wh = barber.working_hours || { open: "08:00", close: "20:00" };
  const openMin = timeToMinutes(wh.open);
  const closeMin = timeToMinutes(wh.close);

  const dayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const dayName = dayNames[new Date(date + "T00:00:00").getDay()];
  if (barber.working_days && barber.working_days.length > 0 && !barber.working_days.includes(dayName)) {
    return [];
  }

  const all = loadArr<any>(BOOKINGS_KEY);
  const existing = all.filter(
    (a) => a.barber_id === barberId && a.appointment_date === date && a.status !== "cancelled"
  );

  const slots: AvailableSlot[] = [];
  for (let m = openMin; m + duration <= closeMin; m += interval) {
    const start = m;
    const end = m + duration;
    const startStr = minutesToTime(start);
    const endStr = minutesToTime(end);

    const now = new Date();
    const slotDate = new Date(date + "T00:00:00");
    const isToday = slotDate.toDateString() === now.toDateString();
    if (isToday) {
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (start <= nowMin) continue;
    }

    const conflict = existing.some((a) => {
      const aStart = timeToMinutes((a.start_time as string).slice(0, 5));
      const aEnd = timeToMinutes((a.end_time as string).slice(0, 5));
      return start < aEnd && end > aStart;
    });

    slots.push({ time: startStr, available: !conflict });
  }
  return slots;
}

export async function createBooking(data: BookingFormData): Promise<Appointment> {
  if (!isBrowser()) throw new Error("Booking requires a browser");

  const services = loadArr<any>("kemekem.services");
  const service =
    services.find((s) => s.id === data.service_id) ||
    SEED_SERVICES.find((s) => s.id === data.service_id);
  const duration = service?.duration_minutes || 60;
  const startMin = timeToMinutes(data.start_time);
  const endTime = minutesToTime(startMin + duration);

  const customers = loadArr<any>(CUSTOMERS_KEY);
  let customer = customers.find((c) => c.phone === data.customer_phone);
  if (!customer) {
    customer = {
      id: `cust-${Date.now().toString(36)}`,
      name: data.customer_name,
      phone: data.customer_phone,
      notes: "",
      visit_count: 0,
      last_visit_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    customers.push(customer);
    saveArr(CUSTOMERS_KEY, customers);
  }

  const all = loadArr<any>(BOOKINGS_KEY);
  const conflict = all.find(
    (a) =>
      a.barber_id === data.barber_id &&
      a.appointment_date === data.date &&
      a.status !== "cancelled" &&
      (a.start_time as string).slice(0, 5) <= data.start_time &&
      (a.end_time as string).slice(0, 5) > data.start_time
  );
  if (conflict) throw new Error("This slot was just booked. Please pick another time.");

  const appt: Appointment = {
    id: `appt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    shop_id: null,
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
    cancel_token:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `tok-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  all.push(appt);
  saveArr(BOOKINGS_KEY, all);
  return appt;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  const all = loadArr<any>(BOOKINGS_KEY);
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return;
  all[idx].status = status;
  all[idx].updated_at = new Date().toISOString();

  if (status === "completed") {
    const customers = loadArr<any>(CUSTOMERS_KEY);
    const ci = customers.findIndex((c) => c.id === all[idx].customer_id);
    if (ci !== -1) {
      customers[ci].visit_count = (customers[ci].visit_count || 0) + 1;
      customers[ci].last_visit_at = new Date().toISOString();
      saveArr(CUSTOMERS_KEY, customers);
    }
  }
  saveArr(BOOKINGS_KEY, all);
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  start_time: string
): Promise<void> {
  const all = loadArr<any>(BOOKINGS_KEY);
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return;
  const services = loadArr<any>("kemekem.services");
  const service = services.find((s) => s.id === all[idx].service_id);
  const duration = service?.duration_minutes || 60;
  const startMin = timeToMinutes(start_time);
  const endTime = minutesToTime(startMin + duration);
  all[idx].appointment_date = date;
  all[idx].start_time = start_time;
  all[idx].end_time = endTime;
  all[idx].status = "confirmed";
  all[idx].updated_at = new Date().toISOString();
  saveArr(BOOKINGS_KEY, all);
}

export async function cancelAppointment(id: string): Promise<void> {
  return updateAppointmentStatus(id, "cancelled");
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  const all = loadArr<any>(BOOKINGS_KEY);
  return (all.find((a) => a.id === id) as Appointment) || null;
}

export async function getAppointmentByToken(
  token: string
): Promise<Appointment | null> {
  const all = loadArr<any>(BOOKINGS_KEY);
  return (all.find((a) => a.cancel_token === token) as Appointment) || null;
}