"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Star,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import { useBusinessSettings } from "@/lib/store";
import { ScissorsAnimation, Marquee } from "@/components/visual";

export function Hero() {
  const [settings] = useBusinessSettings();
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-foreground text-background">
      {/* Animated grid */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--background) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--background) / 0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating scissors */}
      <ScissorsAnimation />

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background/20" />

      {/* Top stats badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container-tight absolute left-1/2 top-28 hidden -translate-x-1/2 md:block"
      >
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-background/20 bg-background/5 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-background" />
          <span className="text-xs font-medium tracking-wider">
            Premium Grooming · Addis Ababa
          </span>
        </div>
      </motion.div>

      <div className="container-tight relative flex min-h-[100svh] flex-col justify-center pb-24 pt-32 md:pt-40">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="display max-w-5xl text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl"
        >
          Look Sharp.<br />
          <span className="display-italic">Book </span>
          in Seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-7 max-w-xl text-base text-background/70 sm:text-lg sm:leading-relaxed"
        >
          Professional grooming experience with skilled barbers, premium
          services, and effortless online booking — across two signature
          locations in Addis Ababa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/book"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-4 text-sm font-medium text-foreground transition-all hover:scale-[1.02] hover:shadow-2xl"
          >
            Book Appointment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 bg-transparent px-8 py-4 text-sm font-medium backdrop-blur transition-all hover:bg-background hover:text-foreground"
          >
            View Services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-background/70"
        >
          <span className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-background text-background" />
            4.9 / 5 rating
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Skilled team
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Open today · 8AM – 8PM
          </span>
          <span className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Premium experience
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-x-0 bottom-24 hidden justify-center md:flex"
        >
          <div className="flex flex-col items-center gap-2 text-background/50">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="h-4 w-4" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="border-y border-background/10 bg-background/5 backdrop-blur">
        <Marquee />
      </div>
    </section>
  );
}