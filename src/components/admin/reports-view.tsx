"use client";
import { TrendingUp, Users, Scissors, Repeat, BarChart3 } from "lucide-react";
import { useAppointments, useServices, useBarbers } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function ReportsView() {
  const [appointments] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();

  const today = new Date().toISOString().split("T")[0];
  const last7 = new Date(today);
  last7.setDate(last7.getDate() - 7);
  const last30 = new Date(today);
  last30.setDate(last30.getDate() - 30);

  const last7List = appointments.filter((a: any) => a.appointment_date >= last7.toISOString().split("T")[0]);
  const last30List = appointments.filter((a: any) => a.appointment_date >= last30.toISOString().split("T")[0]);

  const completed30 = last30List.filter((a: any) => a.status === "completed");
  const completed7 = last7List.filter((a: any) => a.status === "completed");

  const revenue30 = completed30.reduce((sum: number, a: any) => {
    const s = services.find((x: any) => x.id === a.service_id);
    return sum + (Number(s?.price) || 0);
  }, 0);
  const revenue7 = completed7.reduce((sum: number, a: any) => {
    const s = services.find((x: any) => x.id === a.service_id);
    return sum + (Number(s?.price) || 0);
  }, 0);

  const popularServices: Record<string, number> = {};
  last30List.forEach((a: any) => {
    popularServices[a.service_id] = (popularServices[a.service_id] || 0) + 1;
  });
  const popularSvc = Object.entries(popularServices)
    .map(([id, c]) => ({ name: services.find((s: any) => s.id === id)?.name || "—", count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const popularBarbers: Record<string, number> = {};
  last30List.forEach((a: any) => {
    popularBarbers[a.barber_id] = (popularBarbers[a.barber_id] || 0) + 1;
  });
  const popularBarb = Object.entries(popularBarbers)
    .map(([id, c]) => ({ name: barbers.find((b: any) => b.id === id)?.name || "—", count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalCustomers = new Set(appointments.map((a: any) => a.customer_phone)).size;
  const repeatCustomers = Array.from(
    appointments.reduce((m: Map<string, number>, a: any) => {
      m.set(a.customer_phone, (m.get(a.customer_phone) || 0) + 1);
      return m;
    }, new Map()).entries()
  ).filter(([_, c]) => c >= 2).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-muted-foreground">Analytics</p>
        <h1 className="heading-2 mt-1">Reports</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="Revenue (7d)" value={formatCurrency(revenue7)} />
        <Stat icon={TrendingUp} label="Revenue (30d)" value={formatCurrency(revenue30)} />
        <Stat icon={Users} label="Unique customers" value={totalCustomers} />
        <Stat icon={Repeat} label="Repeat customers" value={repeatCustomers} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Popular services (30 days)">
          {popularSvc.length === 0 ? (
            <Empty msg="No data yet" />
          ) : (
            <ol className="space-y-2">
              {popularSvc.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">{i + 1}</span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{s.count} bookings</span>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Popular barbers (30 days)">
          {popularBarb.length === 0 ? (
            <Empty msg="No data yet" />
          ) : (
            <ol className="space-y-2">
              {popularBarb.map((b, i) => (
                <li key={b.name} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">{i + 1}</span>
                    <span className="font-medium">{b.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{b.count} bookings</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card title="Activity (last 30 days)">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {appointments.length} total bookings · {completed30.length} completed
        </p>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="heading-4 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      {msg}
    </div>
  );
}