import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

// POST /api/auth/change-password
// body: { role: "admin" | "staff", current: string, next: string }
// Requires admin session via cookie.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, current, next } = body;
    if (!role || !current || !next) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (role !== "admin" && role !== "staff") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (next.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: row, error: fetchErr } = await supabase
      .from("passwords")
      .select("hash")
      .eq("id", role)
      .maybeSingle();
    if (fetchErr) {
      console.error("[auth/change] db error", fetchErr);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    if (!row || row.hash !== current) {
      return NextResponse.json({ error: "Current password is wrong" }, { status: 401 });
    }

    const { error: updateErr } = await supabase
      .from("passwords")
      .update({ hash: next, updated_at: new Date().toISOString() })
      .eq("id", role);
    if (updateErr) {
      console.error("[auth/change] update error", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[auth/change]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}