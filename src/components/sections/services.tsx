import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { getServices } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const FALLBACK = "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80";

export async function Services() {
  const services = await getServices();
  const display = services.slice(0, 6);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-tight">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
                Our Services
              </p>
              <h2 className="heading-2 text-balance">Premium grooming, tailored to you</h2>
              <p className="mt-4 text-muted-foreground">
                From precision cuts to full VIP packages, choose a service that
                fits your style.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/services">
                All services
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((service, i) => (
            <FadeIn key={service.id} delay={i * 60}>
              <div className="luxury-card group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image_url || FALLBACK}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {formatCurrency(service.price)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{service.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="mt-4 -ml-2"
                  >
                    <Link href={`/book?service=${service.id}`}>
                      Book this
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}