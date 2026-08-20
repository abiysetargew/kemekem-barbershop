"use client";
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Phone, Star } from "lucide-react";
import { useBarbers, useBranches } from "@/lib/store";
import type { Barber } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

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
  role: "barber",
  gender: "male",
};

export function BarbersView() {
  const [barbers, setBarbers, , removeBarber] = useBarbers();
  const [branches] = useBranches();
  const [editing, setEditing] = useState<Barber | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const filteredBarbers = useMemo(
    () => barbers.filter((b: any) => (b.role || "barber") === "barber"),
    [barbers]
  );

  const open = (b?: Barber) => {
    if (b) { setEditing(b); setForm({ ...b, role: "barber" }); }
    else { setCreating(true); setForm({ ...EMPTY, display_order: filteredBarbers.length + 1 }); }
  };
  const close = () => { setEditing(null); setCreating(false); setForm(EMPTY); };
  const setField = (k: string, v: any) => setForm({ ...form, [k]: v });

  const cleanForm = (f: any) => {
    const cleaned: any = { ...f, role: "barber", gender: f.gender || "male" };
    if (cleaned.branch_id === "" || cleaned.branch_id === undefined) cleaned.branch_id = null;
    return cleaned;
  };

  const save = async () => {
    if (!form.name) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      const payload = cleanForm(form);
      if (editing) {
        await setBarbers(barbers.map((b) => b.id === editing.id ? { ...payload, id: editing.id } : b));
        toast.success("Updated");
      } else {
        await setBarbers([...barbers, payload]);
        toast.success("Added");
      }
      close();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  const remove = (id: string) => {
    if (!confirm("Delete this barber?")) return;
    removeBarber(id);
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Our team</p>
          <h1 className="heading-2 mt-1">{filteredBarbers.length} barbers</h1>
        </div>
        <button onClick={() => open()} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add barber
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBarbers.map((b) => {
          const branch = branches.find((x) => x.id === b.branch_id);
          return (
            <div key={b.id} className={cn("rounded-2xl border border-border bg-card p-5 transition-all hover:bg-muted/20", !b.is_active && "opacity-50")}>
              <div className="flex items-start gap-4">
                <Avatar src={b.photo_url || null} alt={b.name} size="xl" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold truncate">{b.name}</h3>
                    {b.is_featured && <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    ⭐ {b.rating} · {b.experience_years}+ yrs
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    📍 {branch?.name || "Any branch"}
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{b.bio}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => open(b)} className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 text-xs font-medium hover:bg-muted">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => remove(b.id)} className="flex items-center rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit barber" : "New barber"} onClose={close}>
          <div className="space-y-4">
            <F label="Name *"><I v={form.name} onChange={(v) => setField("name", v)} /></F>
            <F label="Bio"><T v={form.bio || ""} onChange={(v) => setField("bio", v)} /></F>
            <F label="Photo URL"><I v={form.photo_url || ""} onChange={(v) => setField("photo_url", v)} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Experience (years)"><I type="number" v={form.experience_years} onChange={(v) => setField("experience_years", Number(v))} /></F>
              <F label="Rating"><I type="number" v={form.rating} onChange={(v) => setField("rating", Number(v))} /></F>
            </div>
            <F label="Branch">
              <select
                value={form.branch_id || ""}
                onChange={(e) => setField("branch_id", e.target.value || null)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">Any branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Opens"><I type="time" v={form.working_hours?.open || "08:00"} onChange={(v) => setField("working_hours", { ...form.working_hours, open: v })} /></F>
              <F label="Closes"><I type="time" v={form.working_hours?.close || "20:00"} onChange={(v) => setField("working_hours", { ...form.working_hours, close: v })} /></F>
            </div>
            <F label="Working days">
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      const cur = form.working_days || [];
                      setField(
                        "working_days",
                        cur.includes(d) ? cur.filter((x: string) => x !== d) : [...cur, d]
                      );
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
            </F>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4 rounded" />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setField("is_featured", e.target.checked)} className="h-4 w-4 rounded" />
                Featured (Barber of the Month)
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={close} className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted">Cancel</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
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
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>{children}</div>;
}
function I({ v, onChange, type }: { v: any; onChange: (v: string) => void; type?: string }) {
  return <input type={type || "text"} value={v ?? ""} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />;
}
function T({ v, onChange }: { v: any; onChange: (v: string) => void }) {
  return <textarea rows={2} value={v ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />;
}