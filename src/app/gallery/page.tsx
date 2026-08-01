"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "@/types/database";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "haircuts", label: "Haircuts" },
  { id: "interior", label: "Interior" },
  { id: "beard", label: "Beard" },
  { id: "facial", label: "Facial" },
  { id: "before_after", label: "Before & After" },
  { id: "vip", label: "VIP" },
];

const FALLBACK_ITEMS: { id: string; url: string; category: string }[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80", category: "haircuts" },
  { id: "2", url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80", category: "interior" },
  { id: "3", url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80", category: "beard" },
  { id: "4", url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80", category: "before_after" },
  { id: "5", url: "https://images.unsplash.com/photo-1593702288056-fb7fbbd1ec74?auto=format&fit=crop&w=900&q=80", category: "haircuts" },
  { id: "6", url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80", category: "facial" },
  { id: "7", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80", category: "beard" },
  { id: "8", url: "https://images.unsplash.com/photo-1605497777774-9b2f55bda7be?auto=format&fit=crop&w=900&q=80", category: "haircuts" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return FALLBACK_ITEMS;
    return FALLBACK_ITEMS.filter((g) => g.category === active);
  }, [active]);

  return (
    <>
      <section className="bg-foreground pb-20 pt-40 text-background">
        <div className="container-tight text-center">
          <p className="eyebrow text-background/60">Gallery</p>
          <h1 className="display mt-3 text-5xl sm:text-7xl">Craft you can see</h1>
          <p className="mx-auto mt-5 max-w-xl text-background/70">
            A curated collection of our work, space, and transformations.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-12">
        <div className="container-tight">
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  active === c.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground/40"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
            {filtered.map((item, i) => {
              const ratio =
                i % 5 === 0
                  ? "aspect-[3/4]"
                  : i % 3 === 0
                  ? "aspect-square"
                  : "aspect-[4/5]";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.05 }}
                  className={cn(
                    "mb-4 break-inside-avoid overflow-hidden rounded-2xl",
                    ratio
                  )}
                >
                  <Image
                    src={item.url}
                    alt={`Gallery ${i + 1}`}
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}