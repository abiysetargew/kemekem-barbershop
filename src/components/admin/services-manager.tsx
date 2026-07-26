"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatCurrency, cn } from "@/lib/utils";
import type { Service } from "@/types/database";

const EMPTY = {
  name: "",
  description: "",
  duration_minutes: 30,
  price: 0,
  category: "",
  image_url: "",
  is_visible: true,
  display_order: 0,
};

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const open = (s?: Service) => {
    if (s) {
      setEditing(s);
      setForm({ ...s });
    } else {
      setCreating(true);
      setForm(EMPTY);
    }
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
  };

  const save = async () => {
    setSaving(true);
    try {
      const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed");
      }
      toast.success(editing ? "Service updated" : "Service created");
      close();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Deleted");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="gold" onClick={() => open()}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add service
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="luxury-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {s.description}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  s.is_visible
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s.is_visible ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{s.duration_minutes} min</span>
              <span>·</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(s.price)}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => open(s)}>
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => remove(s.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-1 h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <Modal onClose={close} title={editing ? "Edit service" : "Add service"}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={form.duration_minutes}
                  onChange={(e) =>
                    setForm({ ...form, duration_minutes: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Price (ETB)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={form.category || ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Display order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input
                value={form.image_url || ""}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
              />
              Visible to customers
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button variant="gold" onClick={save} disabled={saving}>
              {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6 shadow-xl">
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