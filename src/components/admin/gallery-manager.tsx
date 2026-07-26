"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { GalleryItem } from "@/types/database";

const CATEGORIES = ["haircuts", "interior", "beard", "facial", "before_after"];

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ image_url: "", category: "haircuts", title: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.image_url) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Added");
      setCreating(false);
      setForm({ image_url: "", category: "haircuts", title: "" });
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="gold" onClick={() => setCreating(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add image
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-border">
            <div className="aspect-square">
              <Image
                src={g.image_url}
                alt={g.title || "Gallery"}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
              <div>
                <div className="text-xs capitalize">{g.category.replace("_", " ")}</div>
                {g.title && <div className="text-xs opacity-80">{g.title}</div>}
              </div>
              <button
                onClick={() => remove(g.id)}
                className="rounded-full bg-white/10 p-1.5 backdrop-blur hover:bg-red-500/80"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Add image</h2>
              <button onClick={() => setCreating(false)} className="rounded-full p-1.5 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Title (optional)</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}