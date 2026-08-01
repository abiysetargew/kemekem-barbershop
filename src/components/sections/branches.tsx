"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useBranches } from "@/lib/store";

const FALLBACK =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80";

export function Branches() {
  const [branches] = useBranches();
  const display = branches.filter((b) => b.is_active);

  return (
    <section className="section-padding bg-muted/20">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="eyebrow text-muted-foreground">Locations</p>
          <h2 className="heading-2 mt-3">Two signature spaces</h2>
          <p className="mt-4 text-muted-foreground">
            Visit us at either of our beautifully designed locations.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {display.map((branch, i) => (
            <motion.article
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="lift overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-foreground/10 to-foreground/5">
                <Image
                  src={FALLBACK}
                  alt={branch.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="p-7">
                <h3 className="display text-2xl">{branch.name}</h3>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <span>{branch.address}, {branch.city}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0 text-foreground" />
                    <a href={`tel:${branch.phone}`} className="hover:text-foreground">{branch.phone}</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-foreground" />
                    <span>Mon – Sun · {branch.working_hours?.open} – {branch.working_hours?.close}</span>
                  </li>
                </ul>
                <div className="mt-6 flex gap-2">
                  {branch.maps_url && (
                    <a
                      href={branch.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition-all hover:bg-muted"
                    >
                      Directions
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                  <Link
                    href={`/book?branch=${branch.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90"
                  >
                    Book at this branch
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}