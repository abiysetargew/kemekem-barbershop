import { BarbersManager } from "@/components/admin/barbers-manager";
import { SEED_BARBERS, SEED_BRANCHES } from "@/lib/seed-data";

export const metadata = { title: "Barbers" };

export default async function AdminBarbersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Barbers</h1>
        <p className="text-sm text-muted-foreground">Manage your team</p>
      </div>
      <BarbersManager
        barbers={SEED_BARBERS as any[]}
        branches={SEED_BRANCHES as any[]}
      />
    </div>
  );
}