import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { timeToMinutes, minutesToTime } from "@/lib/utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    // Fetch appointment + service
    const { data: appt } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single();
    if (!appt) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: service } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", (appt as any).service_id)
      .single();

    const duration = (service as any)?.duration_minutes || 30;
    const startMin = timeToMinutes(body.start_time);
    const endTime = minutesToTime(startMin + duration);

    // Conflict check
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .eq("barber_id", (appt as any).barber_id)
      .eq("appointment_date", body.date)
      .neq("status", "cancelled")
      .neq("id", id)
      .lte("start_time", body.start_time)
      .gte("end_time", endTime);

    if (conflicts && (conflicts as any[]).length > 0) {
      return NextResponse.json(
        { error: "This slot was just booked. Please pick another time." },
        { status: 409 }
      );
    }

    const { data: updated, error } = await supabase
      .from("appointments")
      .update({
        appointment_date: body.date,
        start_time: body.start_time,
        end_time: endTime,
        status: "confirmed",
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}