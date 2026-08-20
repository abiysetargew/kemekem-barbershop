"use client";
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Phone, Star } from "lucide-react";
import { useBarbers, useBranches } from "@/lib/store";
import type { Barber } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const EMPTY: any = {
  id: "",
  name: "",
  bio: "",
  photo_url: "",
  experience_years: 0,
  branch_id: null,
  working_days: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],
  working_hours: { open: "08:00", close: "20:00" },
  is_active: true,
  is_featured: false,
  rating: 5.0,
  display_order: 0,
  role: "stylist",
  gender: "female",
};

export function StylistsView() {
  const [barbers, setBarbers, , removeBarber] = useBarbers();
  const [branches] = useBranches();
  const [editing, setEditing] = useState<Barber | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const stylists = useMemo(
    () => barbers.filter((b: any) => b.role === "stylist"),
    [barbers]
  );

  const open = (s?: Barber) => {
    if (s) {
      setEditing(s);
      setForm({ ...s, role: "stylist", gender: s.gender || "female" });
    } else {
      setCreating(true);
      setForm({ ...EMPTY, display_order: stylists.length + 1 });
    }
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
  };

  const setField = (k: string, v: any) => setForm({ ...form, [k]: v });

  const cleanForm = (f: any) => {
    const cleaned: any = { ...f, role: "stylist", gender: f.gender || "female" };
    // Convert empty strings to null for nullable UUID fields
    if (cleaned.branch_id === "" || cleaned.branch_id === undefined) cleaned.branch_id = null;
    // Strip empty/non-UUID id so DB can generate a fresh one
    if (!cleaned.id || cleaned.id === "" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned.id)) {
      delete cleaned.id;
    }
    return cleaned;
  };

  const save = async () => {
    if (!form.name) {
      toast.error("Name required");
      return;
    }
    setSaving(true);
    try {
      const payload = cleanForm(form);
      if (editing) {
        await setBarbers(
          barbers.map((b) =>
            b.id === editing.id ? { ...payload, id: editing.id } : b
          )
        );
        toast.success("Updated");
      } else {
        await setBarbers([
          ...barbers,
          payload,
        ]);
        toast.success("Added");
      }
      close();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    if (!confirm("Delete this staylist?")) return;
    removeBarber(id);
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">Team</p>
          <h1 className="heading-2 mt-1">Staylists</h1>
        </div>
        <button
          onClick={() => open()}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-3 w-3" />
          Add staylist
        </button>
      </div>

      {stylists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
          No staylists yet. Click <strong>Add staylist</strong> to create one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stylists.map((s: any) => (
            <div key={s.id} className="luxury-card relative overflow-hidden p-5">
              {!s.is_active && (
                <span className="absolute right-3 top-3 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-red-400">
                  Hidden
                </span>
              )}
              <div className="flex items-start gap-4">
                <Avatar src={s.photo_url || null} alt={s.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display text-lg font-semibold">{s.name}</h3>
                    {s.is_featured && <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{s.bio || "Staylist"}</p>
                  {s.experience_years ? (
                    <p className="mt-1 text-xs text-muted-foreground">{s.experience_years} years experience</p>
                  ) : null}
                  {s.branch_id ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      📍 {branches.find((b) => b.id === s.branch_id)?.name || "—"}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => open(s)}
                  className="flex-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                >
                  <Pencil className="mr-1 inline h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => remove(s.id)}
                  className="rounded-full border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="heading-4">{editing ? "Edit staylist" : "Add staylist"}</h2>
              <button onClick={close} className="rounded-full p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  placeholder="e.g. Meron Tadesse"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Bio</label>
                <textarea
                  rows={2}
                  value={form.bio || ""}
                  onChange={(e) => setField("bio", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Photo URL</label>
                <input
                  value={form.photo_url || ""}
                  onChange={(e) => setField("photo_url", e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Experience (years)</label>
                  <input
                    type="number"
                    value={form.experience_years || 0}
                    onChange={(e) => setField("experience_years", Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Branch</label>
                  <select
                    value={form.branch_id || ""}
                    onChange={(e) => setField("branch_id", e.target.value || null)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Any branch</option>
                    {branches.filter((b) => b.is_active).map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Opens</label>
                  <input
                    type="time"
                    value={form.working_hours?.open || "08:00"}
                    onChange={(e) => setField("working_hours", { ...form.working_hours, open: e.target.value })}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">Closes</label>
                  <input
                    type="time"
                    value={form.working_hours?.close || "20:00"}
                    onChange={(e) => setField("working_hours", { ...form.working_hours, close: e.target.value })}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Active / visible to customers
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                Featured on homepage
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={close}
                className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3 w-3 animate-spin" />}
                {editing ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}