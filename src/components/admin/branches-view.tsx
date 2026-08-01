"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, MapPin, Phone, Navigation } from "lucide-react";
import { useBranches } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

export function BranchesView() {
  const [branches, setBranches] = useBranches();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const open = (b?: any) => {
    if (b) { setEditing(b); setForm({ ...b }); }
    else { setCreating(true); setForm({ ...EMPTY, display_order: branches.length + 1 }); }
  };
  const close = () => { setEditing(null); setCreating(false); setForm(EMPTY); };
  const setField = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = () => {
    if (!form.name) { toast.error("Name required"); return; }
    setSaving(true);
    try {
      if (editing) {
        setBranches(branches.map((b) => b.id === editing.id ? { ...form, id: editing.id } : b));
        toast.success("Updated");
      } else {
        const id = `br-${Date.now().toString(36)}`;
        setBranches([...branches, { ...form, id }]);
        toast.success("Added");
      }
      close();
    } finally { setSaving(false); }
  };

  const remove = (id: string) => {
    if (!confirm("Delete this branch?")) return;
    setBranches(branches.filter((b) => b.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Locations</p>
          <h1 className="heading-2 mt-1">{branches.length} branches</h1>
        </div>
        <button onClick={() => open()} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add branch
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((b) => (
          <div key={b.id} className={cn("rounded-2xl border border-border bg-card p-6 transition-all", !b.is_active && "opacity-50")}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold">{b.name}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{b.address}, {b.city}</li>
                  <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{b.phone}</li>
                  <li className="text-xs">Mon – Sun · {b.working_hours?.open} – {b.working_hours?.close}</li>
                </ul>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px]", b.is_active ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground")}>
                {b.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              {b.maps_url && (
                <a href={b.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">
                  <Navigation className="h-3 w-3" /> Directions
                </a>
              )}
              <button onClick={() => open(b)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => remove(b.id)} className="inline-flex items-center rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <Modal title={editing ? "Edit branch" : "New branch"} onClose={close}>
          <div className="space-y-4">
            <F label="Name *"><I v={form.name} onChange={(v) => setField("name", v)} /></F>
            <F label="Address"><I v={form.address} onChange={(v) => setField("address", v)} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="City"><I v={form.city} onChange={(v) => setField("city", v)} /></F>
              <F label="Phone"><I v={form.phone || ""} onChange={(v) => setField("phone", v)} /></F>
            </div>
            <F label="Google Maps URL"><I v={form.maps_url || ""} onChange={(v) => setField("maps_url", v)} /></F>
            <div className="grid grid-cols-2 gap-3">
              <F label="Opens"><I type="time" v={form.working_hours?.open || "08:00"} onChange={(v) => setField("working_hours", { ...form.working_hours, open: v })} /></F>
              <F label="Closes"><I type="time" v={form.working_hours?.close || "20:00"} onChange={(v) => setField("working_hours", { ...form.working_hours, close: v })} /></F>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4 rounded" />
              Active
            </label>
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