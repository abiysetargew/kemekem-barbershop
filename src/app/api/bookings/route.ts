import { NextResponse } from "next/server";
import { generateAppointmentNumber } from "@/lib/utils";

// Server-side booking creation stub.
// In production this should write to Supabase. For now the client
// also writes to its own localStorage so this is a no-op-ish echo.

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
    const id = `appt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const appt = {
      id,
      appointment_number: generateAppointmentNumber(),
      status: "confirmed",
      cancel_token: `tok-${id}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      payment_status: "unpaid",
      payment_method: null,
      paid_at: null,
      paid_amount: null,
      cancel_reason: null,
      referred_by: body.referred_by || null,
    };
    return NextResponse.json(appt);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}