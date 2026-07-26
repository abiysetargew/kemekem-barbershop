import { createAdminClient } from "@/lib/supabase/client";
import { CustomersTable } from "@/components/admin/customers-table";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("last_visit_at", { ascending: false, nullsFirst: false })
    .limit(200);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">All registered customers</p>
      </div>
      <CustomersTable customers={(customers as any[]) || []} />
    </div>
  );
}