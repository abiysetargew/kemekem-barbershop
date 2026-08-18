import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { timeToMinutes, minutesToTime } from "@/lib/utils";

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
  if (
    barber.working_days &&
    Array.isArray(barber.working_days) &&
    barber.working_days.length > 0 &&
    !barber.working_days.includes(dayName)
  ) {
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
      if (a.status === "cancelled" || a.status === "no_show") return false;
      const aStart = timeToMinutes(String(a.start_time).slice(0, 5));
      const aEnd = timeToMinutes(String(a.end_time).slice(0, 5));
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

    const supabase = createAdminClient();

    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .maybeSingle();
    if (!service) {
      return NextResponse.json({ slots: [] });
    }

    let barber: any = null;
    if (barberId === "any") {
      const { data: barbers } = await supabase
        .from("barbers")
        .select("*")
        .eq("is_active", true)
        .order("display_order")
        .limit(1);
      barber = barbers?.[0] ?? null;
    } else {
      const { data: row } = await supabase
        .from("barbers")
        .select("*")
        .eq("id", barberId)
        .maybeSingle();
      barber = row ?? null;
    }
    if (!barber) {
      return NextResponse.json({ slots: [] });
    }

    const { data: appts } = await supabase
      .from("appointments")
      .select("start_time,end_time,status")
      .eq("barber_id", barber.id)
      .eq("appointment_date", date);

    const slots = computeSlots(barber, service, date, appts ?? []);
    return NextResponse.json({ slots });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}