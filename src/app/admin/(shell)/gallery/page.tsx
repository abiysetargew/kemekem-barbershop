import { GalleryManager } from "@/components/admin/gallery-manager";
import { SEED_GALLERY } from "@/lib/seed-data";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Gallery</h1>
        <p className="text-sm text-muted-foreground">Manage photos and categories</p>
      </div>
      <GalleryManager items={SEED_GALLERY as any[]} />
    </div>
  );
}