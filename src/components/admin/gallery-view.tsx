"use client";
import { useState } from "react";
import { Plus, Trash2, X, Loader2, ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { useGallery } from "@/lib/store";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "haircuts", label: "Haircuts" },
  { id: "interior", label: "Interior" },
  { id: "beard", label: "Beard" },
  { id: "facial", label: "Facial" },
  { id: "before_after", label: "Before & After" },
  { id: "vip", label: "VIP" },
];

export function GalleryView() {
  const [gallery, setGallery] = useGallery();
  const [creating, setCreating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [form, setForm] = useState({ image_url: "", category: "haircuts", title: "" });
  const [saving, setSaving] = useState(false);

  const filtered = activeCategory === "all"
    ? gallery
    : gallery.filter((g) => g.category === activeCategory);

  const save = () => {
    if (!form.image_url) { toast.error("URL required"); return; }
    setSaving(true);
    try {
      const id = `gal-${Date.now().toString(36)}`;
      setGallery([
        ...gallery,
        { id, image_url: form.image_url, category: form.category, title: form.title || null, description: null, display_order: gallery.length + 1, created_at: new Date().toISOString() },
      ]);
      setCreating(false);
      setForm({ image_url: "", category: "haircuts", title: "" });
      toast.success("Image added");
    } finally { setSaving(false); }
  };

  const remove = (id: string) => {
    if (!confirm("Delete image?")) return;
    setGallery(gallery.filter((g) => g.id !== id));
    toast.success("Deleted");
  };

  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...gallery].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((g) => g.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sorted.length) return;
    [sorted[idx], sorted[newIdx]] = [sorted[newIdx], sorted[idx]];
    const reindexed = sorted.map((g, i) => ({ ...g, display_order: i + 1 }));
    setGallery(reindexed);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-muted-foreground">Photos</p>
          <h1 className="heading-2 mt-1">{gallery.length} images</h1>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
          <Plus className="h-4 w-4" /> Add image
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${activeCategory === "all" ? "border-foreground bg-foreground text-background" : "border-border"}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${activeCategory === c.id ? "border-foreground bg-foreground text-background" : "border-border"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No images yet</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.sort((a, b) => a.display_order - b.display_order).map((g, i) => (
            <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-border">
              <div className="aspect-square">
                <Image src={g.image_url} alt={g.title || "Gallery"} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">{g.category.replace("_", " ")}</div>
                  {g.title && <div className="text-xs opacity-90 truncate">{g.title}</div>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => move(g.id, -1)} className="rounded-full bg-white/10 p-1.5 backdrop-blur hover:bg-white/20 disabled:opacity-30" disabled={i === 0}>
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button onClick={() => move(g.id, 1)} className="rounded-full bg-white/10 p-1.5 backdrop-blur hover:bg-white/20 disabled:opacity-30" disabled={i === filtered.length - 1}>
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => remove(g.id)} className="rounded-full bg-red-500/80 p-1.5 backdrop-blur hover:bg-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <Modal title="Add image" onClose={() => setCreating(false)}>
          <div className="space-y-4">
            <F label="Image *">
              <div className="space-y-2">
                {form.image_url && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <I
                  v={form.image_url}
                  onChange={(v) => setForm({ ...form, image_url: v })}
                  placeholder="Paste image URL here"
                />
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Or pick from library ({form.category})
                  </summary>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1593702288056-fb7fbbd1ec74?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1605497777774-9b2f55bda7be?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1559599076-9c61d8e1b77c?auto=format&fit=crop&w=900&q=80",
                      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=900&q=80",
                    ].map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setForm({ ...form, image_url: url })}
                        className="aspect-square overflow-hidden rounded-lg border border-border hover:ring-2 hover:ring-foreground"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            </F>
            <F label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </F>
            <F label="Title (optional)">
              <I v={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            </F>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={() => setCreating(false)} className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted">Cancel</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
              {saving && <Loader2 className="h-3 w-3 animate-spin" />}
              Add
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
function I({ v, onChange, type, placeholder }: { v: any; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <input type={type || "text"} value={v ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />;
}