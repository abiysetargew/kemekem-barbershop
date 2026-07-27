import { AppointmentsTable } from "@/components/admin/appointments-table";
import { Card, CardContent } from "@/components/ui/card";
import { SEED_BARBERS, SEED_SERVICES, SEED_BRANCHES } from "@/lib/seed-data";

export const metadata = { title: "Appointments" };

export default async function AdminAppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all bookings
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <AppointmentsTable
            appointments={[]}
            barbers={SEED_BARBERS as any[]}
            services={SEED_SERVICES as any[]}
            branches={SEED_BRANCHES as any[]}
          />
        </CardContent>
      </Card>
    </div>
  );
}