import { createAdminClient } from "@/lib/supabase/client";
import { timeToMinutes, minutesToTime } from "@/lib/utils";
import type { Barber, Service, BusinessSettings } from "@/types/database";

export interface AvailableSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: AvailableSlot[];
}

/**
 * Compute all bookable time slots for a barber on a specific date,
 * filtering out slots that overlap with existing appointments,
 * respecting working hours and the configured interval.
 */
export async function getAvailableSlots(
  barberId: string,
  serviceId: string,
  date: string
): Promise<AvailableSlot[]> {
  const supabase = createAdminClient();
  const [barberRes, serviceRes, settingsRes, apptRes] = await Promise.all([
    supabase.from("barbers").select("*").eq("id", barberId).single(),
    supabase.from("services").select("*").eq("id", serviceId).single(),
    supabase.from("business_settings").select("*").maybeSingle(),
    supabase
      .from("appointments")
      .select("start_time,end_time,status")
      .eq("barber_id", barberId)
      .eq("appointment_date", date)
      .neq("status", "cancelled"),
  ]);

  const barber = barberRes.data as Barber | null;
  const service = serviceRes.data as Service | null;
  const settings = settingsRes.data as BusinessSettings | null;
  const existing = apptRes.data || [];

  if (!barber || !service) return [];

  const interval =
    settings?.booking_interval_minutes && settings.booking_interval_minutes > 0
      ? settings.booking_interval_minutes
      : 30;
  const duration = service.duration_minutes;

  // Working hours: barber's override, otherwise business default
  const wh = barber.working_hours || settings?.business_hours || {
    open: "08:00",
    close: "20:00",
  };
  const openMin = timeToMinutes(wh.open);
  const closeMin = timeToMinutes(wh.close);

  // Working days
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  const dayName = dayNames[new Date(date + "T00:00:00").getDay()];
  if (
    barber.working_days &&
    barber.working_days.length > 0 &&
    !barber.working_days.includes(dayName)
  ) {
    return [];
  }

  // Build candidate slots
  const slots: AvailableSlot[] = [];
  for (let m = openMin; m + duration <= closeMin; m += interval) {
    const start = m;
    const end = m + duration;
    const startStr = minutesToTime(start);
    const endStr = minutesToTime(end);

    // Past-time guard: don't show past slots today
    const now = new Date();
    const slotDate = new Date(date + "T00:00:00");
    const isToday = slotDate.toDateString() === now.toDateString();
    if (isToday) {
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (start <= nowMin) continue;
    }

    // Conflict check
    const conflict = (existing as any[]).some((a) => {
      const aStart = timeToMinutes((a.start_time as string).slice(0, 5));
      const aEnd = timeToMinutes((a.end_time as string).slice(0, 5));
      return start < aEnd && end > aStart;
    });

    slots.push({ time: startStr, available: !conflict });
  }

  return slots;
}