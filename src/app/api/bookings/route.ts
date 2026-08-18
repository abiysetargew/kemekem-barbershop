import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";
import { timeToMinutes, minutesToTime, generateAppointmentNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = [
      "branch_id",
      "service_id",
      "barber_id",
      "date",
      "start_time",
      "customer_name",
      "customer_phone",
    ];
    for (const k of required) {
      if (!body[k]) {
        return NextResponse.json(
          { error: `Missing ${k}` },
          { status: 400 }
        );
      }
    }

    const supabase = createAdminClient();

    // Compute end_time from service duration
    const { data: service } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", body.service_id)
      .maybeSingle();
    const duration = (service as any)?.duration_minutes || 60;
    const startMin = timeToMinutes(body.start_time);
    const endTime = minutesToTime(startMin + duration);

    // Upsert customer by phone
    let { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", body.customer_phone)
      .maybeSingle();
    if (!customer) {
      const { data: created, error: cErr } = await supabase
        .from("customers")
        .insert({
          name: body.customer_name,
          phone: body.customer_phone,
          notes: body.notes || "",
          visit_count: 0,
          last_visit_at: null,
        })
        .select()
        .single();
      if (cErr) {
        console.error("[bookings] customer insert", cErr);
        return NextResponse.json({ error: cErr.message }, { status: 500 });
      }
      customer = created;
    }

    // Conflict check
    const { data: conflict } = await supabase
      .from("appointments")
      .select("id")
      .eq("barber_id", body.barber_id)
      .eq("appointment_date", body.date)
      .neq("status", "cancelled")
      .lte("start_time", body.start_time)
      .gt("end_time", body.start_time)
      .maybeSingle();
    if (conflict) {
      return NextResponse.json(
        { error: "This slot was just booked. Please pick another time." },
        { status: 409 }
      );
    }

    const { data: appt, error } = await supabase
      .from("appointments")
      .insert({
        appointment_number: generateAppointmentNumber(),
        customer_id: (customer as any).id,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        notes: body.notes || null,
        branch_id: body.branch_id,
        service_id: body.service_id,
        barber_id: body.barber_id,
        appointment_date: body.date,
        start_time: body.start_time,
        end_time: endTime,
        status: "confirmed",
        payment_status: "unpaid",
        payment_method: null,
        paid_at: null,
        paid_amount: null,
        cancel_reason: null,
        referred_by: body.referred_by || null,
      })
      .select("*")
      .single();
    if (error) {
      console.error("[bookings] insert", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(appt);
  } catch (e: any) {
    console.error("[bookings] error", e);
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}