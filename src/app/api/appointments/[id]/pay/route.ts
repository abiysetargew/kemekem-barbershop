import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { method, amount } = body;
    if (!method || amount == null) {
      return NextResponse.json({ error: "method and amount required" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("appointments")
      .update({
        payment_status: "paid",
        payment_method: method,
        paid_at: new Date().toISOString(),
        paid_amount: amount,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      console.error("[appointments/pay]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("appointments")
      .update({
        payment_status: "unpaid",
        paid_at: null,
        paid_amount: null,
        payment_method: null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      console.error("[appointments/pay DELETE]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}