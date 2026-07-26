"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/fade-in";
import type { GalleryItem } from "@/types/database";

const CATEGORIES = [
  "All",
  "Haircuts",
  "Interior",
  "Beard",
  "Facial",
  "Before & After",
];

const FALLBACKS: Record<string, string> = {
  haircuts:
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
  interior:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
  beard:
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
  facial:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
  before_after:
    "https://images.unsplash.com/photo-1593702288056-fb7fbbd1ec74?auto=format&fit=crop&w=900&q=80",
};

const CATEGORY_MAP: Record<string, string> = {
  Haircuts: "haircuts",
  Interior: "interior",
  Beard: "beard",
  Facial: "facial",
  "Before & After": "before_after",
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return items;
    const cat = CATEGORY_MAP[active];
    return items.filter((i) => i.category === cat);
  }, [items, active]);

  // Build display items: real items + fallbacks per category
  const display: { id: string; url: string; category: string }[] = [];
  filtered.forEach((item) =>
    display.push({
      id: item.id,
      url: item.image_url,
      category: item.category,
    })
  );

  // Pad with fallback masonry if empty
  if (display.length === 0) {
    Object.entries(FALLBACKS).forEach(([cat, url], i) =>
      display.push({ id: `fb-${i}`, url, category: cat })
    );
  }

  return (
    <>
      {/* Filter pills */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active === c
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground/50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Masonry */}
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {display.map((item, i) => {
          const ratio =
            i % 5 === 0
              ? "aspect-[3/4]"
              : i % 3 === 0
              ? "aspect-square"
              : "aspect-[4/5]";
          return (
            <FadeIn key={item.id} delay={(i % 8) * 60}>
              <div
                className={cn(
                  "mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/60",
                  ratio
                )}
              >
                <Image
                  src={item.url}
                  alt={`Gallery ${i + 1}`}
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </FadeIn>
          );
        })}
      </div>
    </>
  );
}