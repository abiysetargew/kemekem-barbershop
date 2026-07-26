import { createServerClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) redirect("/admin/login");

  return { user, admin };
}