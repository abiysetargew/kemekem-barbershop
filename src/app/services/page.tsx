"use client";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useServices } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80";

export default function ServicesPage() {
  const [services] = useServices();
  const visible = services.filter((s) => s.is_visible);

  return (
    <>
      <section className="bg-foreground pb-20 pt-40 text-background">
        <div className="container-tight text-center">
          <p className="eyebrow text-background/60">Service menu</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">
            Crafted for the modern man
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-background/70">
            From a precise cut to the full VIP ritual — every service is
            delivered by our master barbers.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-tight">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service, i) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="lift group overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[5/3] overflow-hidden">
                  <Image
                    src={service.image_url || FALLBACK}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-background/95 px-3 py-1 text-sm font-bold backdrop-blur">
                    {formatCurrency(service.price)}
                  </div>
                  {service.category && (
                    <div className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-background backdrop-blur">
                      {service.category}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="display text-2xl">{service.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.duration_minutes} min
                    </span>
                    <Link
                      href={`/book?service=${service.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
                    >
                      Book now
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}