import { getGallery } from "@/lib/data";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Gallery",
  description:
    "Browse our gallery of haircuts, beard styling, interior, facials and before & after transformations.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <section className="bg-muted/30 pt-32 pb-16">
        <div className="container-tight text-center">
          <Badge variant="gold" className="mb-4">
            Gallery
          </Badge>
          <h1 className="heading-1 text-balance">Craft you can see</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A curated collection of our work, space, and transformations.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-tight">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  );
}