"use client";
import { Star, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useBarbers } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

export function FeaturedBarbers() {
  const [barbers] = useBarbers();
  const active = barbers.filter((b) => b.is_active);
  const popular = active.find((b) => b.is_featured) || active[0];
  const rest = active.filter((b) => b.id !== popular?.id).slice(0, 3);

  if (!popular) return null;

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-muted-foreground">Our team</p>
          <h2 className="heading-2 mt-3">Meet our master barbers</h2>
          <p className="mt-4 text-muted-foreground">
            Skilled, friendly, and trained in the latest styles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-3xl border border-border bg-foreground p-8 text-background md:p-12"
        >
          <div className="grid items-center gap-8 md:grid-cols-[260px_1fr]">
            <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl border-4 border-background/20 md:w-60">
              <Avatar
                src={popular.photo_url || FALLBACK_AVATAR}
                alt={popular.name}
                size="2xl"
                className="h-full w-full rounded-none"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/10 px-3 py-1 text-xs font-medium">
                <Flame className="h-3 w-3" /> Most Popular
              </span>
              <h3 className="display mt-3 text-4xl font-semibold md:text-5xl">
                {popular.name}
              </h3>
              <p className="mt-3 max-w-xl text-background/70">{popular.bio}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-background text-background" />
                  ))}
                </div>
                <span className="text-sm text-background/60">
                  {popular.rating} · Top rated
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {rest.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((barber, i) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="lift overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <Avatar
                    src={barber.photo_url || FALLBACK_AVATAR}
                    alt={barber.name}
                    size="2xl"
                    className="h-full w-full rounded-none"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-lg font-semibold">{barber.name}</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-foreground text-foreground" />
                      {barber.rating}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}