import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("social_links")
      .insert({ ...body, shop_id: null })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}