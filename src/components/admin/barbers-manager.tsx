"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Barber, Branch } from "@/types/database";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const EMPTY: any = {
  name: "",
  bio: "",
  photo_url: "",
  experience_years: 0,
  branch_id: "",
  working_days: [...DAYS],
  working_hours: { open: "08:00", close: "20:00" },
  is_active: true,
  is_featured: false,
  rating: 5,
  display_order: 0,
};

export function BarbersManager({
  barbers,
  branches,
}: {
  barbers: Barber[];
  branches: Branch[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Barber | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const open = (b?: Barber) => {
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
      const url = editing ? `/api/admin/barbers/${editing.id}` : "/api/admin/barbers";
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
      toast.success(editing ? "Barber updated" : "Barber created");
      close();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this barber?")) return;
    await fetch(`/api/admin/barbers/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="gold" onClick={() => open()}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add barber
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {barbers.map((b) => (
          <div key={b.id} className="luxury-card overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <Avatar src={b.photo_url} alt={b.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{b.name}</div>
                  {b.is_featured && <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {b.experience_years}+ years · ⭐ {b.rating}
                </div>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    b.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                  )}
                >
                  {b.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex border-t border-border">
              <button
                onClick={() => open(b)}
                className="flex-1 py-2 text-xs font-medium hover:bg-muted"
              >
                <Pencil className="mr-1 inline h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => remove(b.id)}
                className="flex-1 border-l border-border py-2 text-xs font-medium text-destructive hover:bg-muted"
              >
                <Trash2 className="mr-1 inline h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {editing ? "Edit barber" : "Add barber"}
              </h2>
              <button onClick={close} className="rounded-full p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Bio</Label>
                <Textarea
                  rows={2}
                  value={form.bio || ""}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Photo URL</Label>
                <Input
                  value={form.photo_url || ""}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Experience (years)</Label>
                  <Input
                    type="number"
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Branch</Label>
                <select
                  value={form.branch_id || ""}
                  onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm"
                >
                  <option value="">Any branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Opens at</Label>
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
                  <Label>Closes at</Label>
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
              <div className="space-y-1.5">
                <Label>Working days</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        const cur = form.working_days || [];
                        setForm({
                          ...form,
                          working_days: cur.includes(d)
                            ? cur.filter((x: string) => x !== d)
                            : [...cur, d],
                        });
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs capitalize",
                        (form.working_days || []).includes(d)
                          ? "border-foreground bg-foreground text-background"
                          : "border-border"
                      )}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  />
                  Featured (Barber of the Month)
                </label>
              </div>
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