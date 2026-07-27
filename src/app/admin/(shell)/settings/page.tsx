import { SettingsForm } from "@/components/admin/settings-form";
import { SocialLinksManager } from "@/components/admin/social-links-manager";
import { SEED_SETTINGS, SEED_SOCIALS } from "@/lib/seed-data";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Business configuration</p>
      </div>
      <SettingsForm settings={SEED_SETTINGS as any} />
      <SocialLinksManager socials={SEED_SOCIALS as any[]} />
    </div>
  );
}