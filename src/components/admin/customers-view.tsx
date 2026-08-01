"use client";
import { useState, useEffect } from "react";
import { Search, Users, Phone, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  visit_count: number;
  last_visit_at: string | null;
}

export function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kemekem.customers");
      if (raw) setCustomers(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalVisits = customers.reduce((s, c) => s + (c.visit_count || 0), 0);
  const repeat = customers.filter((c) => c.visit_count >= 2).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Customer list</p>
          <h1 className="heading-2 mt-1">{customers.length} customers</h1>
        </div>
        <div className="flex gap-3">
          <Stat label="Total visits" value={totalVisits} />
          <Stat label="Repeat customers" value={repeat} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No customers yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Customers are created when they book through the website.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Visits</th>
                <th className="px-4 py-3 text-left">Last visit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar alt={c.name} size="sm" />
                      <div>
                        <div className="font-medium">{c.name}</div>
                        {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{c.visit_count}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.last_visit_at ? new Date(c.last_visit_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}