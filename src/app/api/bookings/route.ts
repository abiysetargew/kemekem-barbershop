import { NextResponse } from "next/server";
import { createBooking } from "@/lib/booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (
      !body.branch_id ||
      !body.service_id ||
      !body.barber_id ||
      !body.date ||
      !body.start_time ||
      !body.customer_name ||
      !body.customer_phone
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await createBooking(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create booking" }, { status: 500 });
  }
}