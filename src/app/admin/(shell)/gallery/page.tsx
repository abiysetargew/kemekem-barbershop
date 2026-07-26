import { createAdminClient } from "@/lib/supabase/client";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("gallery").select("*").order("display_order");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gallery</h1>
        <p className="text-sm text-muted-foreground">Manage photos and categories</p>
      </div>
      <GalleryManager items={(data as any[]) || []} />
    </div>
  );
}