import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/client";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Scissors,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const [
    { data: todayAppts },
    { count: totalCustomers },
    { data: barbers },
    { data: services },
    { data: last30 },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("appointment_date", today)
      .order("start_time"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("barbers").select("*").eq("is_active", true),
    supabase.from("services").select("*"),
    supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]),
  ]);

  const appts = (todayAppts as any[]) || [];
  const last30List = (last30 as any[]) || [];
  const servicesList = (services as any[]) || [];
  const barbersList = (barbers as any[]) || [];

  const completed = appts.filter((a: any) => a.status === "completed").length;
  const cancelled = appts.filter((a: any) => a.status === "cancelled").length;
  const upcoming = appts.filter((a: any) => ["pending", "confirmed"].includes(a.status)).length;

  // Popular service
  const serviceCount: Record<string, number> = {};
  last30List.forEach((a: any) => {
    serviceCount[a.service_id] = (serviceCount[a.service_id] || 0) + 1;
  });
  const popularServiceId = Object.entries(serviceCount).sort(([, a], [, b]) => b - a)[0]?.[0];
  const popularService = servicesList.find((s: any) => s.id === popularServiceId);

  // Popular barber
  const barberCount: Record<string, number> = {};
  last30List.forEach((a: any) => {
    barberCount[a.barber_id] = (barberCount[a.barber_id] || 0) + 1;
  });
  const popularBarberId = Object.entries(barberCount).sort(([, a], [, b]) => b - a)[0]?.[0];
  const popularBarber = barbersList.find((b: any) => b.id === popularBarberId);

  // Revenue last 30d (assumes completed)
  const revenue = last30List
    .filter((a: any) => a.status === "completed")
    .reduce((sum: number, a: any) => {
      const svc: any = servicesList.find((s: any) => s.id === a.service_id);
      return sum + (Number(svc?.price) || 0);
    }, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/appointments">View appointments</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Calendar}
          label="Today's appointments"
          value={appts.length}
          accent="gold"
        />
        <Stat
          icon={CheckCircle2}
          label="Completed today"
          value={completed}
          accent="green"
        />
        <Stat
          icon={TrendingUp}
          label="Upcoming today"
          value={upcoming}
          accent="blue"
        />
        <Stat icon={XCircle} label="Cancelled today" value={cancelled} accent="red" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total customers" value={totalCustomers || 0} />
        <Stat
          icon={Scissors}
          label="Most popular service"
          value={popularService?.name || "—"}
          small
        />
        <Stat
          icon={Sparkles}
          label="Most popular barber"
          value={popularBarber?.name || "—"}
          small
        />
        <Stat
          icon={TrendingUp}
          label="Revenue (30 days)"
          value={formatCurrency(revenue)}
        />
      </div>

      <DashboardCharts last30={last30List as any[]} services={services as any[]} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today&apos;s schedule</CardTitle>
          <Link
            href="/admin/appointments"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {appts.length === 0 ? (
            <div className="rounded-xl bg-muted/40 p-8 text-center text-sm text-muted-foreground">
              No appointments scheduled today.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {appts.slice(0, 6).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-display text-sm font-semibold text-gold-600">
                      {a.start_time.slice(0, 5)}
                    </div>
                    <div>
                      <div className="font-medium">{a.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.customer_phone}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs capitalize">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
  small,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  accent?: "gold" | "green" | "blue" | "red";
  small?: boolean;
}) {
  const colors: Record<string, string> = {
    gold: "bg-gold-50 text-gold-600 dark:bg-gold-900/20",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30",
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[accent || "gold"]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`truncate font-semibold ${small ? "text-base" : "text-2xl"}`}>
              {value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}