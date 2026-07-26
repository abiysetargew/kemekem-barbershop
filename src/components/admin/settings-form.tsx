"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsForm({ settings }: { settings: any }) {
  const router = useRouter();
  const [form, setForm] = useState(settings || {});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Settings saved");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Business information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Business name</Label>
              <Input
                value={form.business_name || ""}
                onChange={(e) => set("business_name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input
                value={form.tagline || ""}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input
                value={form.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={form.email || ""}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={form.address || ""}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Maps URL</Label>
            <Input
              value={form.maps_url || ""}
              onChange={(e) => set("maps_url", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input
                value={form.logo_url || ""}
                onChange={(e) => set("logo_url", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Favicon URL</Label>
              <Input
                value={form.favicon_url || ""}
                onChange={(e) => set("favicon_url", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hero image URL</Label>
              <Input
                value={form.hero_image_url || ""}
                onChange={(e) => set("hero_image_url", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Primary color (hex)</Label>
              <Input
                value={form.primary_color || "#C89B3C"}
                onChange={(e) => set("primary_color", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Footer text</Label>
            <Input
              value={form.footer_text || ""}
              onChange={(e) => set("footer_text", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking & hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Booking interval (minutes)</Label>
            <Input
              type="number"
              value={form.booking_interval_minutes || 30}
              onChange={(e) =>
                set("booking_interval_minutes", Number(e.target.value))
              }
            />
            <p className="text-xs text-muted-foreground">
              Allowed: 15, 20, 30, or 60. Determines slot granularity.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>SEO title</Label>
            <Input
              value={form.seo_title || ""}
              onChange={(e) => set("seo_title", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>SEO description</Label>
            <Textarea
              rows={2}
              value={form.seo_description || ""}
              onChange={(e) => set("seo_description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>SEO keywords</Label>
            <Input
              value={form.seo_keywords || ""}
              onChange={(e) => set("seo_keywords", e.target.value)}
              placeholder="comma, separated, keywords"
            />
          </div>
          <div className="space-y-1.5">
            <Label>OG image URL</Label>
            <Input
              value={form.og_image_url || ""}
              onChange={(e) => set("og_image_url", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="gold" onClick={save} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save all settings
        </Button>
      </div>
    </div>
  );
}