"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Users, Phone, Mail } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useCustomers, nextId } from "@/lib/store";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  notes: "",
  visit_count: 0,
  last_visit_at: null as string | null,
};

export function CustomersView() {
  const [customers, , updateOne, removeCustomer] = useCustomers();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalVisits = customers.reduce((s, c) => s + (c.visit_count || 0), 0);
  const repeat = customers.filter((c) => c.visit_count >= 2).length;

  const open = (c?: any) => {
    if (c) {
      setEditing(c);
      setForm({ ...c });
    } else {
      setCreating(true);
      setForm({ ...EMPTY });
    }
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
  };

  const save = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    const supabase = createBrowserClient();
    try {
      if (editing) {
        await updateOne(editing.id, () => ({ ...form, updated_at: new Date().toISOString() }));
        toast.success("Customer updated");
      } else {
        const newRow = {
          ...form,
          id: nextId("cust"),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("customers").insert(newRow);
        if (error) throw new Error(error.message);
        toast.success("Customer added");
      }
      close();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = (id: string) => {
    if (!confirm("Delete this customer? Appointments stay in the calendar.")) return;
    removeCustomer(id);
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Customer list</p>
          <h1 className="heading-2 mt-1">{customers.length} customers</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-2">
            <div className="text-xs text-muted-foreground">Total visits</div>
            <div className="font-display text-2xl font-semibold">{totalVisits}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-2">
            <div className="text-xs text-muted-foreground">Repeat</div>
            <div className="font-display text-2xl font-semibold">{repeat}</div>
          </div>
          <button
            onClick={() => open()}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add customer
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search name, phone, email..."
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
            Customers are auto-created from bookings, or add one manually above.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Visits</th>
                <th className="px-4 py-3 text-left">Last visit</th>
                <th className="px-4 py-3 text-right">Actions</th>
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
                        {c.notes && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {c.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {c.email || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{c.visit_count}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.last_visit_at ? new Date(c.last_visit_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => open(c)}
                        className="rounded-full p-1.5 hover:bg-muted"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        className="rounded-full p-1.5 text-red-400 hover:bg-red-500/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editing || creating) && (
        <Modal title={editing ? "Edit customer" : "Add customer"} onClose={close}>
          <div className="space-y-4">
            <F label="Full name *">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Henok Alemu"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              />
            </F>
            <F label="Phone *">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+251 92 ..."
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              />
            </F>
            <F label="Email (optional)">
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              />
            </F>
            <F label="Notes (optional)">
              <textarea
                rows={3}
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Preferences, allergies, anything to remember..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Visit count">
                <input
                  type="number"
                  min={0}
                  value={form.visit_count || 0}
                  onChange={(e) => setForm({ ...form, visit_count: Number(e.target.value) })}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                />
              </F>
              <F label="Last visit">
                <input
                  type="date"
                  value={
                    form.last_visit_at
                      ? form.last_visit_at.slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      last_visit_at: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                />
              </F>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={close} className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted">
              Cancel
            </button>
            <button onClick={save} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90">
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}