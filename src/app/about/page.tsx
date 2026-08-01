"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Heart, Users, Scissors } from "lucide-react";
import { useBarbers, useBranches } from "@/lib/store";

export default function AboutPage() {
  const [barbers] = useBarbers();
  const [branches] = useBranches();

  const STATS = [
    { icon: Users, value: "15K+", label: "Happy customers" },
    { icon: Scissors, value: "120K+", label: "Cuts delivered" },
    { icon: Award, value: "9", label: "Years of craft" },
    { icon: Heart, value: "4.9", label: "Average rating" },
  ];

  return (
    <>
      <section className="bg-foreground pb-20 pt-40 text-background">
        <div className="container-tight max-w-3xl text-center">
          <p className="eyebrow text-background/60">Our Story</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl text-balance">
            Crafting confidence, <span className="display-italic">one cut</span> at a time.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-background/70">
            Kemekem Barbershop is Addis Ababa&apos;s home for premium grooming —
            where modern style meets timeless craftsmanship.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80"
                alt="Inside Kemekem"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow text-muted-foreground">Our mission</p>
              <h2 className="heading-2 mt-3">A standard, not just a service</h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                We believe every visit should feel like a ritual — clean
                stations, sharp tools, skilled hands, and an atmosphere that
                makes you want to come back.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Founded in 2015, Kemekem Barbershop started with one simple
                promise: deliver a grooming experience that exceeds
                expectations, every single time. Today, with two premium
                branches in Piassa and Bole, we continue to raise the bar.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                    <s.icon className="mx-auto h-5 w-5 text-foreground" />
                    <div className="display mt-2 text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/20">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="eyebrow text-muted-foreground">Our team</p>
            <h2 className="heading-2 mt-3">The masters</h2>
            <p className="mt-4 text-muted-foreground">
              Skilled, friendly, and trained in the latest styles.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.filter((b) => b.is_active).map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="lift overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-square bg-muted">
                  {b.photo_url ? (
                    <Image src={b.photo_url} alt={b.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-foreground/10 to-foreground/5 text-6xl font-display font-semibold">
                      {b.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="display text-xl">{b.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    ⭐ {b.rating} · {branches.find((x) => x.id === b.branch_id)?.name || "Any branch"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="eyebrow text-muted-foreground">Gallery</p>
            <h2 className="heading-2 mt-3">Inside our world</h2>
          </motion.div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1593702288056-fb7fbbd1ec74?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}