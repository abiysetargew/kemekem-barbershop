"use client";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useBusinessSettings, useSocials } from "@/lib/store";
import { toast } from "sonner";

const PLATFORMS = ["instagram","facebook","tiktok","telegram","youtube","x","whatsapp","website"];

export function SettingsView() {
  const [settings, setSettings] = useBusinessSettings();
  const [socials, setSocials, , , removeSocial] = useSocials();
  const [saving, setSaving] = useState(false);

  const setField = (k: string, v: any) => setSettings({ ...settings, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      await setSettings({ ...settings });
      setSaving(false);
      toast.success("Settings saved");
    } catch (e: any) {
      setSaving(false);
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-muted-foreground">Business</p>
        <h1 className="heading-2 mt-1">Settings</h1>
      </div>

      <Section title="Business information">
        <F label="Business name"><I v={settings.business_name} onChange={(v) => setField("business_name", v)} /></F>
        <F label="Tagline"><I v={settings.tagline || ""} onChange={(v) => setField("tagline", v)} /></F>
        <div className="grid gap-3 md:grid-cols-2">
          <F label="Phone"><I v={settings.phone || ""} onChange={(v) => setField("phone", v)} /></F>
          <F label="Email"><I v={settings.email || ""} onChange={(v) => setField("email", v)} /></F>
        </div>
        <F label="Address"><I v={settings.address || ""} onChange={(v) => setField("address", v)} /></F>
      </Section>

      <Section title="Branding">
        <F label="Hero image URL"><I v={settings.hero_image_url || ""} onChange={(v) => setField("hero_image_url", v)} /></F>
        <F label="Logo URL"><I v={settings.logo_url || ""} onChange={(v) => setField("logo_url", v)} /></F>
        <F label="Footer text"><I v={settings.footer_text || ""} onChange={(v) => setField("footer_text", v)} /></F>
      </Section>

      <Section title="Booking">
        <F label="Booking slot interval (minutes)">
          <select
            value={settings.booking_interval_minutes || 60}
            onChange={(e) => setField("booking_interval_minutes", Number(e.target.value))}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value={15}>15 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes (recommended)</option>
          </select>
        </F>
      </Section>

      <Section title="SEO">
        <F label="SEO title"><I v={settings.seo_title || ""} onChange={(v) => setField("seo_title", v)} /></F>
        <F label="SEO description"><T v={settings.seo_description || ""} onChange={(v) => setField("seo_description", v)} /></F>
        <F label="SEO keywords"><I v={settings.seo_keywords || ""} onChange={(v) => setField("seo_keywords", v)} /></F>
      </Section>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90">
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          Save settings
        </button>
      </div>

      {/* Social links */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="heading-4 mb-4">Social links</h2>
        <div className="space-y-2">
          {socials.map((s) => (
            <div key={s.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-2">
              <select
                value={s.platform}
                onChange={(e) => setSocials(socials.map((x) => x.id === s.id ? { ...x, platform: e.target.value as any } : x))}
                className="h-9 rounded-lg border border-input bg-background px-2 text-sm capitalize"
              >
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                value={s.url}
                onChange={(e) => setSocials(socials.map((x) => x.id === s.id ? { ...x, url: e.target.value } : x))}
                placeholder="https://..."
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <button
                onClick={() => removeSocial(s.id)}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setSocials([
              ...socials,
              { id: `soc-${Date.now().toString(36)}`, platform: "instagram", url: "" } as any,
            ])
          }
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
        >
          <Plus className="h-3 w-3" />
          Add social link
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="heading-4">{title}</h2>
      <div className="space-y-3">{children}</div>
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