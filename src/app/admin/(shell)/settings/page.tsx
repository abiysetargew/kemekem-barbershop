import { createAdminClient } from "@/lib/supabase/client";
import { SettingsForm } from "@/components/admin/settings-form";
import { SocialLinksManager } from "@/components/admin/social-links-manager";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const [{ data: settings }, { data: socials }] = await Promise.all([
    supabase.from("business_settings").select("*").maybeSingle(),
    supabase.from("social_links").select("*").order("display_order"),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Business configuration</p>
      </div>
      <SettingsForm settings={(settings as any) || {}} />
      <SocialLinksManager socials={(socials as any[]) || []} />
    </div>
  );
}