"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import type { Customer } from "@/types/database";

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [q, setQ] = useState("");
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q)
  );
  return (
    <div>
      <div className="mb-4">
        <div className="relative sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Visits</th>
              <th className="px-4 py-3 text-left">Last visit</th>
              <th className="px-4 py-3 text-left">Notes</th>
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
                      {c.email && (
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-700 dark:bg-gold-900/30">
                    {c.visit_count}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.last_visit_at
                    ? new Date(c.last_visit_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground line-clamp-1 max-w-xs">
                  {c.notes || "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}