import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

// POST /api/auth/login
// body: { role: "admin" | "staff", password: string }
// Returns { ok: true, role } on success.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, password } = body;
    if (!role || !password) {
      return NextResponse.json({ error: "Missing role or password" }, { status: 400 });
    }
    if (role !== "admin" && role !== "staff") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: row, error } = await supabase
      .from("passwords")
      .select("hash")
      .eq("id", role)
      .maybeSingle();
    if (error) {
      console.error("[auth/login] db error", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
    if (!row || row.hash !== password) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    return NextResponse.json({ ok: true, role });
  } catch (e: any) {
    console.error("[auth/login]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}