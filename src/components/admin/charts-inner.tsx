"use client";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, Service } from "@/types/database";

const COLORS = ["#C89B3C", "#0a0a0a", "#A47D2E", "#DEB95C", "#7E5E22", "#574016"];

export function ChartsInner({
  last30,
  services,
}: {
  last30: Appointment[];
  services: Service[];
}) {
  // Last 7 days
  const days: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    const count = last30.filter((a) => a.appointment_date === d).length;
    days.push({
      day: new Date(d).toLocaleDateString("en-US", { weekday: "short" }),
      count,
    });
  }

  // Service distribution
  const svcCount: Record<string, number> = {};
  last30.forEach((a) => {
    const name = services.find((s) => s.id === a.service_id)?.name || "Other";
    svcCount[name] = (svcCount[name] || 0) + 1;
  });
  const svcData = Object.entries(svcCount).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Last 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e5e5",
                  }}
                />
                <Bar dataKey="count" fill="#C89B3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service mix (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={svcData}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {svcData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}