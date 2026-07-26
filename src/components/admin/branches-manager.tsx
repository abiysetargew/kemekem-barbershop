"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Branch } from "@/types/database";

const EMPTY: any = {
  name: "",
  address: "",
  city: "Addis Ababa",
  phone: "",
  maps_url: "",
  working_hours: { open: "08:00", close: "20:00" },
  is_active: true,
  display_order: 0,
};

export function BranchesManager({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Branch | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const open = (b?: Branch) => {
    if (b) {
      setEditing(b);
      setForm({ ...b });
    } else {
      setCreating(true);
      setForm(EMPTY);
    }
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/branches/${editing.id}` : "/api/admin/branches";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Saved");
      close();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this branch?")) return;
    await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="gold" onClick={() => open()}>
          <Plus className="mr-1.5 h-4 w-4" /> Add branch
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((b) => (
          <div key={b.id} className="luxury-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl font-semibold">{b.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{b.address}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.phone}</div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  b.is_active ? "bg-green-100 text-green-700" : "bg-muted"
                )}
              >
                {b.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => open(b)}>
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => remove(b.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {editing ? "Edit branch" : "Add branch"}
              </h2>
              <button onClick={close} className="rounded-full p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>City</Label>
                  <Input
                    value={form.city || ""}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone || ""}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Google Maps URL</Label>
                <Input
                  value={form.maps_url || ""}
                  onChange={(e) => setForm({ ...form, maps_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Opens</Label>
                  <Input
                    type="time"
                    value={form.working_hours?.open || "08:00"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        working_hours: { ...form.working_hours, open: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Closes</Label>
                  <Input
                    type="time"
                    value={form.working_hours?.close || "20:00"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        working_hours: { ...form.working_hours, close: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={close}>Cancel</Button>
              <Button variant="gold" onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}