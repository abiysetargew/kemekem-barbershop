import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

// Generic CRUD for any table.
// POST /api/admin/table/[name]  → upsert one row by id, or insert if no id
// DELETE /api/admin/table/[name]?id=...  → delete by id
// PATCH /api/admin/table/[name]  → partial update by id

export async function POST(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    // Strip id if it's not a valid UUID — let DB generate
    const row: any = { ...body };
    if (row.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id)) {
      delete row.id;
    }

    const { data, error } = await supabase
      .from(name)
      .upsert(row)
      .select()
      .single();
    if (error) {
      console.error(`[admin/table/${name} upsert]`, error);
      return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(`[admin/table error]`, e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { id, ...patch } = body;
    const { data, error } = await supabase
      .from(name)
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error(`[admin/table/${name} patch]`, error);
      return NextResponse.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e: any) {
    console.error(`[admin/table error]`, e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { error } = await supabase.from(name).delete().eq("id", id);
    if (error) {
      console.error(`[admin/table/${name} delete]`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}