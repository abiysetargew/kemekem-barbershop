import { createAdminClient } from "@/lib/supabase/client";
import { AppointmentsTable } from "@/components/admin/appointments-table";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Appointments" };

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    date?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(200);

  if (params.status && params.status !== "all") query = query.eq("status", params.status);
  if (params.date) query = query.eq("appointment_date", params.date);

  const { data: appointments } = await query;
  let list = (appointments as any[]) || [];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.customer_name.toLowerCase().includes(q) ||
        a.customer_phone.includes(q) ||
        a.appointment_number.toLowerCase().includes(q)
    );
  }

  const [{ data: barbers }, { data: services }, { data: branches }] = await Promise.all([
    supabase.from("barbers").select("*"),
    supabase.from("services").select("*"),
    supabase.from("branches").select("*"),
  ]);

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
            appointments={list}
            barbers={(barbers as any[]) || []}
            services={(services as any[]) || []}
            branches={(branches as any[]) || []}
          />
        </CardContent>
      </Card>
    </div>
  );
}