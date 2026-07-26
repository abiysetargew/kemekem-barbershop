import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { getServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80";

export const metadata = {
  title: "Services",
  description:
    "Explore our complete menu of premium barber services — haircuts, beard trims, shaves, facials, VIP grooming and more.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Page header */}
      <section className="bg-muted/30 pt-32 pb-16">
        <div className="container-tight text-center">
          <Badge variant="gold" className="mb-4">
            Our Services
          </Badge>
          <h1 className="heading-1 text-balance">Premium grooming, every visit</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            From precision cuts to luxurious grooming packages — choose the
            service that fits your style.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 60}>
                <article className="luxury-card group h-full overflow-hidden">
                  <div className="relative aspect-[5/3] overflow-hidden">
                    <Image
                      src={service.image_url || FALLBACK}
                      alt={service.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {service.category && (
                      <div className="absolute left-4 top-4">
                        <Badge variant="default" className="bg-background/90 text-foreground capitalize">
                          {service.category}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute right-4 top-4">
                      <div className="rounded-full bg-background/95 px-3 py-1 text-sm font-bold backdrop-blur">
                        {formatCurrency(service.price)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-semibold">
                      {service.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration_minutes} min
                      </span>
                      <Button asChild variant="gold" size="sm">
                        <Link href={`/book?service=${service.id}`}>
                          Book now
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container-tight text-center">
          <h2 className="heading-3">Not sure what to choose?</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Our VIP Grooming package is our most popular option — full luxury
            experience from start to finish.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-6">
            <Link href="/book">Book VIP Grooming</Link>
          </Button>
        </div>
      </section>
    </>
  );
}