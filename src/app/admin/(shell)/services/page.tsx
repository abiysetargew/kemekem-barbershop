import { createAdminClient } from "@/lib/supabase/client";
import { ServicesManager } from "@/components/admin/services-manager";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("display_order");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground">Manage your service menu</p>
      </div>
      <ServicesManager services={(data as any[]) || []} />
    </div>
  );
}