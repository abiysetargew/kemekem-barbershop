import { createAdminClient } from "@/lib/supabase/client";
import { BarbersManager } from "@/components/admin/barbers-manager";

export const metadata = { title: "Barbers" };

export default async function AdminBarbersPage() {
  const supabase = createAdminClient();
  const [{ data: barbers }, { data: branches }] = await Promise.all([
    supabase.from("barbers").select("*").order("display_order"),
    supabase.from("branches").select("*"),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Barbers</h1>
        <p className="text-sm text-muted-foreground">Manage your team</p>
      </div>
      <BarbersManager
        barbers={(barbers as any[]) || []}
        branches={(branches as any[]) || []}
      />
    </div>
  );
}