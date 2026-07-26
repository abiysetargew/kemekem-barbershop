import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();
    // business_settings has shop_id PK; upsert a default row
    const { data: existing } = await supabase
      .from("business_settings")
      .select("shop_id")
      .maybeSingle();
    const shopId = existing?.shop_id || crypto.randomUUID();
    const { data, error } = await supabase
      .from("business_settings")
      .upsert({ ...body, shop_id: shopId, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}