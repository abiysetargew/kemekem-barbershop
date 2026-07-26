"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getSocialIcon, getSocialLabel } from "@/lib/social";
import type { SocialLink } from "@/types/database";

const PLATFORMS: SocialLink["platform"][] = [
  "instagram",
  "facebook",
  "tiktok",
  "telegram",
  "youtube",
  "x",
  "whatsapp",
];

export function SocialLinksManager({ socials }: { socials: SocialLink[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ platform: "instagram" as any, url: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.url) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Added");
      setCreating(false);
      setForm({ platform: "instagram", url: "" });
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/social/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Social links</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setCreating(true)}>
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {socials.map((s) => {
            const Icon = getSocialIcon(s.platform);
            return (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">
                    {getSocialLabel(s.platform)}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{s.url}</div>
                </div>
                <button
                  onClick={() => remove(s.id)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {creating && (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
            <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="flex h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {getSocialLabel(p)}
                  </option>
                ))}
              </select>
              <Input
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button variant="gold" size="sm" onClick={save} disabled={saving}>
                {saving && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}