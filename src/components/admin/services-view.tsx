"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Clock, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useServices } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

const EMPTY = {
  name: "",
  description: "",
  image_url: "",
  duration_minutes: 60,
  price: 0,
  category: "",
  is_visible: true,
  display_order: 0,
};

export function ServicesView() {
  const [services, setServices] = useServices();
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const open = (s?: any) => {
    if (s) {
      setEditing(s);
      setForm({ ...s });
    } else {
      setCreating(true);
      setForm({ ...EMPTY, display_order: services.length + 1 });
    }
  };
  const close = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
  };

  const setField = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        setServices(
          services.map((s) =>
            s.id === editing.id ? { ...form, id: editing.id } : s
          )
        );
        toast.success("Service updated");
      } else {
        const id = `svc-${Date.now().toString(36)}`;
        setServices([...services, { ...form, id }]);
        toast.success("Service added");
      }
      close();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = (id: string) => {
    if (!confirm("Delete this service?")) return;
    setServices(services.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Service menu</p>
          <h1 className="heading-2 mt-1">{services.length} services</h1>
        </div>
        <button
          onClick={() => open()}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No services yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-card transition-all hover:bg-muted/20",
                !s.is_visible && "opacity-50"
              )}
            >
              <div className="relative aspect-[5/3] bg-muted">
                {s.image_url ? (
                  <Image
                    src={s.image_url}
                    alt={s.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold backdrop-blur">
                  {formatCurrency(s.price)}
                </div>
                {!s.is_visible && (
                  <div className="absolute left-3 top-3 rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] uppercase backdrop-blur">
                    Hidden
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {s.name}
                    </h3>
                    {s.category && (
                      <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider">
                        {s.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {s.duration_minutes} min
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => open(s)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="flex items-center gap-1 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <Modal onClose={close} title={editing ? "Edit service" : "New service"}>
          <div className="space-y-4">
            <Field label="Name *">
              <Input value={form.name} onChange={(v) => setField("name", v)} />
            </Field>
            <Field label="Description">
              <Textarea
                rows={2}
                value={form.description || ""}
                onChange={(v) => setField("description", v)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration (min)">
                <Input
                  type="number"
                  value={form.duration_minutes}
                  onChange={(v) => setField("duration_minutes", Number(v))}
                />
              </Field>
              <Field label="Price (ETB)">
                <Input
                  type="number"
                  value={form.price}
                  onChange={(v) => setField("price", Number(v))}
                />
              </Field>
              <Field label="Category">
                <Input
                  value={form.category || ""}
                  onChange={(v) => setField("category", v)}
                  placeholder="haircut, beard, vip..."
                />
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(v) => setField("display_order", Number(v))}
                />
              </Field>
            </div>
            <Field label="Image URL">
              <Input
                value={form.image_url || ""}
                onChange={(v) => setField("image_url", v)}
                placeholder="https://..."
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={(e) => set("is_visible", e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Visible to customers
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={close}
              className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
            >
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
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: { value: any; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={props.type || "text"}
      value={props.value ?? ""}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}

function Textarea(props: { value: any; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      rows={props.rows || 2}
      value={props.value ?? ""}
      onChange={(e) => props.onChange(e.target.value)}
      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
    />
  );
}