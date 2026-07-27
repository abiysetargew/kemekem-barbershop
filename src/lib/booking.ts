// Booking logic — falls back to "always available" if Supabase is misconfigured.
// Lets the site accept bookings even without a database, storing them in memory.

import { timeToMinutes, minutesToTime, generateAppointmentNumber } from "@/lib/utils";
import type { BookingFormData } from "@/types/database";
import { SEED_BARBERS, SEED_SERVICES } from "@/lib/seed-data";

export interface AvailableSlot {
  time: string;
  available: boolean;
}

interface InMemoryBooking {
  id: string;
  barber_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

// In-memory booking storage (resets on server restart)
const memoryStore: InMemoryBooking[] = [];

function getBookingsForDate(barberId: string, date: string): InMemoryBooking[] {
  return memoryStore.filter(
    (b) => b.barber_id === barberId && b.date === date
  );
}

export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  // Try Supabase first
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createAdminClient } = await import("@/lib/supabase/client");
      const supabase = createAdminClient();
      const [barberRes, serviceRes, settingsRes, apptRes] = await Promise.all([
        supabase.from("barbers").select("*").eq("id", barberId).maybeSingle(),
        supabase.from("services").select("*").eq("id", serviceId).maybeSingle(),
        supabase.from("business_settings").select("*").maybeSingle(),
        supabase
          .from("appointments")
          .select("start_time,end_time,status")
          .eq("barber_id", barberId)
          .eq("appointment_date", date)
          .neq("status", "cancelled"),
      ]);
      const barber: any = barberRes.data;
      const service: any = serviceRes.data;
      const settings: any = settingsRes.data;
      const existing: any[] = apptRes.data || [];
      if (barber && service) {
        const interval = settings?.booking_interval_minutes || 30;
        const duration = service.duration_minutes;
        const wh = barber.working_hours || { open: "08:00", close: "20:00" };
        const openMin = timeToMinutes(wh.open);
        const closeMin = timeToMinutes(wh.close);
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
    }
  } catch {
    // fall through to in-memory
  }

  // Fallback: in-memory slot generation
  const barber = SEED_BARBERS.find((b) => b.id === barberId);
  const service = SEED_SERVICES.find((s) => s.id === serviceId);
  if (!barber || !service) return [];
  const interval = 30;
  const duration = service.duration_minutes;
  const wh = barber.working_hours;
  const openMin = timeToMinutes(wh.open);
  const closeMin = timeToMinutes(wh.close);
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
    const conflict = getBookingsForDate(barberId, date).some((a) => {
      const aStart = timeToMinutes(a.start_time);
      const aEnd = timeToMinutes(a.end_time);
      return start < aEnd && end > aStart;
    });
    slots.push({ time: startStr, available: !conflict });
  }
  return slots;
}

export async function createBooking(data: BookingFormData) {
  const service = SEED_SERVICES.find((s) => s.id === data.service_id);
  const duration = service?.duration_minutes || 30;
  const startMin = timeToMinutes(data.start_time);
  const endTime = minutesToTime(startMin + duration);

  // Try Supabase
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createAdminClient } = await import("@/lib/supabase/client");
      const supabase = createAdminClient();
      let customerId: string | null = null;
      const { data: existing } = await supabase
        .from("customers")
        .select("id")
        .eq("phone", data.customer_phone)
        .maybeSingle();
      if (existing) customerId = (existing as any).id;
      else {
        const { data: nc } = await supabase
          .from("customers")
          .insert({
            name: data.customer_name,
            phone: data.customer_phone,
          })
          .select("id")
          .single();
        customerId = (nc as any)?.id || null;
      }
      const appointmentNumber = generateAppointmentNumber();
      const { data: created, error } = await supabase
        .from("appointments")
        .insert({
          appointment_number: appointmentNumber,
          customer_id: customerId,
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
        })
        .select("*")
        .single();
      if (!error && created) return created;
    }
  } catch {
    // fall through
  }

  // Fallback: in-memory booking
  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  memoryStore.push({
    id,
    barber_id: data.barber_id,
    service_id: data.service_id,
    date: data.date,
    start_time: data.start_time,
    end_time: endTime,
  });
  return {
    id,
    appointment_number: generateAppointmentNumber(),
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
    customer_id: null,
    cancel_token: id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    shop_id: null,
  };
}