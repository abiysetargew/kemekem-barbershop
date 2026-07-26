import { createAdminClient } from "@/lib/supabase/client";
import { BranchesManager } from "@/components/admin/branches-manager";

export const metadata = { title: "Branches" };

export default async function AdminBranchesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("branches").select("*").order("display_order");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Branches</h1>
        <p className="text-sm text-muted-foreground">Manage your locations</p>
      </div>
      <BranchesManager branches={(data as any[]) || []} />
    </div>
  );
}