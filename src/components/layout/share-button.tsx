"use client";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton() {
  const [done, setDone] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const data = {
      title: "Kemekem Barbershop",
      text: "Look Sharp. Book in Seconds.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={share}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all hover:border-foreground hover:-translate-y-0.5"
      aria-label="Share website"
    >
      {done ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
}