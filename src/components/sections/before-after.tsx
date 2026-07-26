import Image from "next/image";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { getGallery } from "@/lib/data";

const FALLBACK =
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80";

export async function BeforeAfter() {
  const gallery = await getGallery();
  const items = gallery.length > 0 ? gallery.slice(0, 4) : [
    { id: "1", image_url: FALLBACK },
    { id: "2", image_url: "https://images.unsplash.com/photo-1593702288056-fb7fbbd1ec74?auto=format&fit=crop&w=900&q=80" },
    { id: "3", image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80" },
    { id: "4", image_url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80" },
  ];

  return (
    <section className="section-padding bg-foreground text-background">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
              Transformations
            </p>
            <h2 className="heading-2 text-balance text-background">
              Before & After
            </h2>
            <p className="mt-4 text-background/70">
              Real results from our master barbers.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 80}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-background/10">
                <Image
                  src={(item as any).image_url}
                  alt={(item as any).title || "Transformation"}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <Sparkles className="h-3 w-3" />
                  Transformation
                </div>
                {item.title && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}