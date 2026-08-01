"use client";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useReviews } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";

const FALLBACK_REVIEWS = [
  { id: "f1", customer_name: "Henok A.", rating: 5, content: "Best barber experience in Addis. Clean shop, skilled barbers, premium feel." },
  { id: "f2", customer_name: "Meron T.", rating: 5, content: "Booking was effortless and the haircut was flawless. Highly recommended." },
  { id: "f3", customer_name: "Yared K.", rating: 5, content: "The Bole branch VIP package is worth every birr. Ambachew is a master." },
];

export function Testimonials() {
  const [reviews] = useReviews();
  const list = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-muted-foreground">Testimonials</p>
          <h2 className="heading-2 mt-3">Loved by our customers</h2>
          <p className="mt-4 text-muted-foreground">
            4.9 average rating from thousands of happy clients.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {list.slice(0, 3).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="lift relative rounded-2xl border border-border bg-card p-7"
            >
              <Quote className="absolute right-6 top-6 h-7 w-7 text-foreground/20" />
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= r.rating
                        ? "fill-foreground text-foreground"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-base leading-relaxed text-foreground/90">
                &ldquo;{r.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <Avatar src={r.avatar_url || null} alt={r.customer_name} size="md" />
                <div>
                  <div className="font-display text-lg font-medium">
                    {r.customer_name}
                  </div>
                  <div className="text-xs text-muted-foreground">Verified customer</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}