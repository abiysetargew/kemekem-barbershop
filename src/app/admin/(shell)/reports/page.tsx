import { createAdminClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, Scissors, Repeat } from "lucide-react";

export const metadata = { title: "Reports" };

export default async function AdminReportsPage() {
  const supabase = createAdminClient();
  const today = new Date();
  const last30Start = new Date(today.getTime() - 30 * 86400000);
  const last90Start = new Date(today.getTime() - 90 * 86400000);

  const [{ data: last30 }, { data: last90 }, { data: services }, { data: barbers }, { data: customers }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", last30Start.toISOString().split("T")[0]),
      supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", last90Start.toISOString().split("T")[0]),
      supabase.from("services").select("*"),
      supabase.from("barbers").select("*"),
      supabase.from("customers").select("*"),
    ]);

  const completed30 = (last30 || []).filter((a: any) => a.status === "completed");
  const completed90 = (last90 || []).filter((a: any) => a.status === "completed");

  const revenue30 = completed30.reduce((sum: number, a: any) => {
    const s: any = (services || []).find((x: any) => x.id === a.service_id);
    return sum + (Number(s?.price) || 0);
  }, 0);
  const revenue90 = completed90.reduce((sum: number, a: any) => {
    const s: any = (services || []).find((x: any) => x.id === a.service_id);
    return sum + (Number(s?.price) || 0);
  }, 0);

  // Popular services (30d)
  const svcCount: Record<string, number> = {};
  (last30 || []).forEach((a: any) => {
    svcCount[a.service_id] = (svcCount[a.service_id] || 0) + 1;
  });
  const popularServices = Object.entries(svcCount)
    .map(([id, count]) => ({
      id,
      count,
      name: (services || []).find((s: any) => s.id === id)?.name || "—",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Popular barbers (30d)
  const brbCount: Record<string, number> = {};
  (last30 || []).forEach((a: any) => {
    brbCount[a.barber_id] = (brbCount[a.barber_id] || 0) + 1;
  });
  const popularBarbers = Object.entries(brbCount)
    .map(([id, count]) => ({
      id,
      count,
      name: (barbers || []).find((b: any) => b.id === id)?.name || "—",
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Repeat customers
  const repeat = (customers || []).filter((c: any) => c.visit_count >= 2).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">Insights and analytics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Revenue (30d)</div>
                <div className="text-2xl font-semibold">{formatCurrency(revenue30)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Revenue (90d)</div>
                <div className="text-2xl font-semibold">{formatCurrency(revenue90)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total customers</div>
                <div className="text-2xl font-semibold">{(customers || []).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/30">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Repeat customers</div>
                <div className="text-2xl font-semibold">{repeat}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Popular services (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {popularServices.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{s.count} bookings</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular barbers (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {popularBarbers.map((b, i) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      {i + 1}
                    </span>
                    <span className="font-medium">{b.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{b.count} bookings</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}