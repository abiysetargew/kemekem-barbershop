import { NextResponse } from "next/server";
import {
  SEED_BARBERS,
  SEED_SERVICES,
  SEED_SETTINGS,
  SAMPLE_BOOKINGS,
} from "@/lib/seed-data";
import { timeToMinutes, minutesToTime } from "@/lib/utils";

// Server-side slot computation (no localStorage).
// Reads seed data + stored bookings from the request body (if any).
// In production with Supabase, fetch from DB here.

function computeSlots(
  barber: any,
  service: any,
  date: string,
  existing: any[]
) {
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
  const slots: { time: string; available: boolean }[] = [];
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
    const conflict = existing.some((a: any) => {
      if (a.status === "cancelled") return false;
      const aStart = timeToMinutes((a.start_time as string).slice(0, 5));
      const aEnd = timeToMinutes((a.end_time as string).slice(0, 5));
      return start < aEnd && end > aStart;
    });
    slots.push({ time: startStr, available: !conflict });
  }
  return slots;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");
    if (!barberId || !serviceId || !date) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    let barber =
      SEED_BARBERS.find((b) => b.id === barberId) ||
      SEED_BARBERS.find((b) => b.id === "any");
    let service = SEED_SERVICES.find((s) => s.id === serviceId);
    if (!barber || !service) {
      return NextResponse.json({ slots: [] });
    }

    const slots = computeSlots(barber, service, date, SAMPLE_BOOKINGS);
    return NextResponse.json({ slots });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}