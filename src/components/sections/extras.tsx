import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Flame, Camera, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { getServices, getBarbers, getGallery, getBranches } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export async function Extras() {
  const [services, barbers, gallery, branches] = await Promise.all([
    getServices(),
    getBarbers(),
    getGallery(),
    getBranches(),
  ]);

  const topRated = [...services].sort(() => 0.5 - Math.random()).slice(0, 3);
  const popularBarber = barbers.sort((a, b) => b.rating - a.rating)[0];
  const latestGallery = gallery.slice(0, 4);
  const barberOfMonth = barbers.find((b) => b.is_featured) || barbers[0];

  return (
    <section className="section-padding">
      <div className="container-tight">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Highlights
            </p>
            <h2 className="heading-2 text-balance">What makes us special</h2>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Barber of the month */}
          {barberOfMonth && (
            <FadeIn>
              <div className="luxury-card group h-full overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gold-200 to-gold-500 dark:from-gold-900 dark:to-gold-700">
                  {barberOfMonth.photo_url && (
                    <Image
                      src={barberOfMonth.photo_url}
                      alt={barberOfMonth.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute left-4 top-4">
                    <Badge variant="gold">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Barber of the Month
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold">{barberOfMonth.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {barberOfMonth.bio}
                  </p>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Most popular barber */}
          {popularBarber && popularBarber.id !== barberOfMonth?.id && (
            <FadeIn delay={80}>
              <div className="luxury-card group h-full overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {popularBarber.photo_url && (
                    <Image
                      src={popularBarber.photo_url}
                      alt={popularBarber.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute left-4 top-4">
                    <Badge variant="default" className="bg-orange-500 text-white border-0">
                      <Flame className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold">{popularBarber.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                    <span>{popularBarber.rating} rating</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Wait time card */}
          <FadeIn delay={160}>
            <div className="luxury-card h-full p-7">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold">Estimated Wait</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold gold-text">12</span>
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Based on current bookings. Book ahead to skip the wait entirely.
              </p>
              <Button asChild variant="gold" size="sm" className="mt-5">
                <Link href="/book">Book now</Link>
              </Button>
            </div>
          </FadeIn>

          {/* Top rated services */}
          <div className="md:col-span-2 lg:col-span-3">
            <FadeIn>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">
                  <Star className="mr-1.5 inline h-4 w-4 fill-gold-500 text-gold-500" />
                  Top Rated Services
                </h3>
                <Link
                  href="/services"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  View all
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {topRated.map((service) => (
                  <Link
                    key={service.id}
                    href={`/book?service=${service.id}`}
                    className="luxury-card group flex items-center gap-3 p-4 hover:border-gold-300"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
                      <Star className="h-5 w-5 fill-gold-500 text-gold-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.duration_minutes} min · ⭐ Top rated
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Latest gallery */}
          {latestGallery.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <FadeIn>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">
                    <Camera className="mr-1.5 inline h-4 w-4" />
                    Latest Gallery
                  </h3>
                  <Link
                    href="/gallery"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    View gallery
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {latestGallery.map((g) => (
                    <div
                      key={g.id}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-border/60"
                    >
                      <Image
                        src={g.image_url}
                        alt={g.title || "Gallery"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          )}

          {/* Branch quick info */}
          <div className="md:col-span-2 lg:col-span-3">
            <FadeIn>
              <div className="grid gap-4 sm:grid-cols-2">
                {branches.map((b) => (
                  <Link
                    key={b.id}
                    href={`/book?branch=${b.id}`}
                    className="luxury-card group flex items-center gap-4 p-5 hover:border-gold-300"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.address}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}