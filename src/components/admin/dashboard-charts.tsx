"use client";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, Service } from "@/types/database";

// Recharts has SSR issues — load only on the client.
const Charts = dynamic(() => import("./charts-inner").then((m) => m.ChartsInner), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Last 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Loading chart…
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Service mix (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            Loading chart…
          </div>
        </CardContent>
      </Card>
    </div>
  ),
});

const COLORS = ["#C89B3C", "#0a0a0a", "#A47D2E", "#DEB95C", "#7E5E22", "#574016"];

export function DashboardCharts({
  last30,
  services,
}: {
  last30: Appointment[];
  services: Service[];
}) {
  return <Charts last30={last30} services={services} />;
}