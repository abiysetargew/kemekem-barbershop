"use client";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  Scissors,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAppointments, useServices, useBarbers } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function DashboardView() {
  const [appointments] = useAppointments();
  const [services] = useServices();
  const [barbers] = useBarbers();

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.appointment_date === today);
  const completed = todayAppts.filter((a) => a.status === "completed").length;
  const cancelled = todayAppts.filter((a) => a.status === "cancelled").length;
  const upcoming = todayAppts.filter((a) =>
    ["pending", "confirmed", "checked_in"].includes(a.status)
  ).length;

  // Popular service
  const serviceCount: Record<string, number> = {};
  appointments.forEach((a: any) => {
    serviceCount[a.service_id] = (serviceCount[a.service_id] || 0) + 1;
  });
  const popularServiceId = Object.entries(serviceCount).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];
  const popularService = services.find((s) => s.id === popularServiceId);

  // Popular barber
  const barberCount: Record<string, number> = {};
  appointments.forEach((a: any) => {
    barberCount[a.barber_id] = (barberCount[a.barber_id] || 0) + 1;
  });
  const popularBarberId = Object.entries(barberCount).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];
  const popularBarber = barbers.find((b) => b.id === popularBarberId);

  // Total revenue
  const revenue = appointments
    .filter((a: any) => a.status === "completed")
    .reduce((sum: number, a: any) => {
      const svc = services.find((s) => s.id === a.service_id);
      return sum + (Number(svc?.price) || 0);
    }, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="heading-2 mt-1">Welcome back</h1>
        </div>
        <Link
          href="/book"
          target="_blank"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
        >
          + New booking
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Calendar}
          label="Today's appointments"
          value={todayAppts.length}
        />
        <Stat
          icon={CheckCircle2}
          label="Completed today"
          value={completed}
        />
        <Stat
          icon={TrendingUp}
          label="Upcoming today"
          value={upcoming}
        />
        <Stat icon={XCircle} label="Cancelled today" value={cancelled} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total customers" value={appointments.length > 0 ? new Set(appointments.map((a: any) => a.customer_phone)).size : 0} />
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
          label="Revenue (all-time)"
          value={formatCurrency(revenue)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="heading-4">Today&apos;s schedule</h2>
        {todayAppts.length === 0 ? (
          <div className="mt-6 rounded-xl bg-muted/30 p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No appointments today. Quiet day!
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {todayAppts
              .sort((a: any, b: any) =>
                a.start_time.localeCompare(b.start_time)
              )
              .map((a: any) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-display text-lg font-semibold text-foreground">
                      {a.start_time.slice(0, 5)}
                    </div>
                    <div>
                      <div className="font-medium">{a.customer_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.customer_phone} ·{" "}
                        {services.find((s) => s.id === a.service_id)?.name}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className={`mt-2 font-display ${small ? "text-xl" : "text-3xl"} font-semibold`}>
            {value}
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}