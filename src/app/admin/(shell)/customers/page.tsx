import { CustomersTable } from "@/components/admin/customers-table";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">All registered customers</p>
      </div>
      <CustomersTable customers={[]} />
    </div>
  );
}