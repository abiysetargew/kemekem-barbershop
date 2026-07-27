import { BranchesManager } from "@/components/admin/branches-manager";
import { SEED_BRANCHES } from "@/lib/seed-data";

export const metadata = { title: "Branches" };

export default async function AdminBranchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Branches</h1>
        <p className="text-sm text-muted-foreground">Manage your locations</p>
      </div>
      <BranchesManager branches={SEED_BRANCHES as any[]} />
    </div>
  );
}