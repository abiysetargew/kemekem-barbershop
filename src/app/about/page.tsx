import { FadeIn } from "@/components/ui/fade-in";
import { getBarbers, getBranches, getGallery } from "@/lib/data";
import Image from "next/image";
import { Award, Heart, Scissors, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export const metadata = {
  title: "About",
  description: "Learn about Kemekem Barbershop — premium grooming, professional team, and our story.",
};

const STATS = [
  { icon: Users, value: "15K+", label: "Happy customers" },
  { icon: Scissors, value: "120K+", label: "Cuts delivered" },
  { icon: Award, value: "9", label: "Years of craft" },
  { icon: Heart, value: "4.9", label: "Average rating" },
];

const FALLBACK =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80";

export default async function AboutPage() {
  const [barbers, branches, gallery] = await Promise.all([
    getBarbers(),
    getBranches(),
    getGallery(),
  ]);

  return (
    <>
      <section className="bg-muted/30 pt-32 pb-20">
        <div className="container-tight max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
            Our Story
          </p>
          <h1 className="heading-1 text-balance">
            Crafting confidence, one cut at a time.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Kemekem Barbershop is Addis Ababa&apos;s home for premium grooming —
            where modern style meets timeless craftsmanship.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src={
                    gallery[0]?.image_url ||
                    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
                  }
                  alt="Inside Kemekem Barbershop"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                  Mission
                </p>
                <h2 className="heading-2 text-balance">A standard, not just a service</h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  We believe every visit should feel like a ritual — clean
                  stations, sharp tools, skilled hands, and an atmosphere that
                  makes you want to come back.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Founded in 2015, Kemekem Barbershop started with one simple
                  promise: deliver a grooming experience that exceeds
                  expectations, every single time. Today, with two premium
                  branches in Piassa and Bole, we continue to raise the bar.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {STATS.map((s) => (
                    <div key={s.label} className="luxury-card p-4 text-center">
                      <s.icon className="mx-auto h-5 w-5 text-gold-600" />
                      <div className="mt-2 font-display text-2xl font-bold">
                        {s.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-tight">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Our Team
              </p>
              <h2 className="heading-2 text-balance">Professional barbers</h2>
              <p className="mt-4 text-muted-foreground">
                Trained, vetted, and passionate about their craft.
              </p>
            </div>
          </FadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((b, i) => (
              <FadeIn key={b.id} delay={i * 80}>
                <div className="luxury-card overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    {b.photo_url ? (
                      <Image
                        src={b.photo_url}
                        alt={b.name}
                        width={400}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Avatar
                        src={null}
                        alt={b.name}
                        size="2xl"
                        className="h-full w-full rounded-none"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{b.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {b.experience_years}+ years experience · ⭐ {b.rating}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {b.bio}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Gallery
              </p>
              <h2 className="heading-2 text-balance">Inside our world</h2>
            </div>
          </FadeIn>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {(gallery.length > 0 ? gallery.slice(0, 6) : Array.from({ length: 6 })).map((g, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={(g as any)?.image_url || FALLBACK}
                    alt="Gallery"
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}