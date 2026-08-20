"use client";
import { Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useBarbers } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";

export function FeaturedStylists() {
  const [barbers] = useBarbers();
  const stylists = barbers.filter((b: any) => b.role === "stylist" && b.is_active);

  if (stylists.length === 0) return null;

  const lead = stylists.find((s: any) => s.is_featured) || stylists[0];
  const rest = stylists.filter((s: any) => s.id !== lead.id);

  return (
    <section className="section-padding bg-background">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
            <p className="eyebrow text-muted-foreground">Our team</p>
            <h2 className="heading-2 mt-3">Meet our locticians</h2>
            <p className="mt-4 text-muted-foreground">
              Specialists in hair care, styling, and beauty.
            </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12"
        >
          <div className="grid items-center gap-8 md:grid-cols-[260px_1fr]">
            <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl md:w-60">
              <Avatar
                src={lead.photo_url || FALLBACK_AVATAR}
                alt={lead.name}
                size="2xl"
                className="h-full w-full rounded-none"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
              <h3 className="display mt-3 text-4xl font-semibold md:text-5xl">
                {lead.name}
              </h3>
              <p className="mt-3 max-w-xl text-muted-foreground">{lead.bio}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {lead.rating} · Top rated
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {rest.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="lift overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <Avatar
                    src={s.photo_url || FALLBACK_AVATAR}
                    alt={s.name}
                    size="2xl"
                    className="h-full w-full rounded-none"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-lg font-semibold">{s.name}</h4>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-foreground text-foreground" />
                      {s.rating}
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