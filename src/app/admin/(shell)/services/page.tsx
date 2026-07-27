import { ServicesManager } from "@/components/admin/services-manager";
import { SEED_SERVICES } from "@/lib/seed-data";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground">Manage your service menu</p>
      </div>
      <ServicesManager services={SEED_SERVICES as any[]} />
    </div>
  );
}