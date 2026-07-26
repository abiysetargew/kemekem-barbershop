import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const barberId = searchParams.get("barberId");
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date");
    if (!barberId || !serviceId || !date) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }
    const slots = await getAvailableSlots(barberId, serviceId, date);
    return NextResponse.json({ slots });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}