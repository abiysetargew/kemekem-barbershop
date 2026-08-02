"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Sparkles, Star, ShieldCheck, Award, Clock } from "lucide-react";
import dynamic from "next/dynamic";

// Hero animations are heavy (3D scissors transforms). Render client-only
// to avoid hydration mismatch on first load.
const HeroBody = dynamic(() => import("./hero-body").then((m) => m.HeroBody), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

function HeroSkeleton() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-foreground">
      <div className="container-tight relative flex min-h-[100svh] flex-col justify-center pb-24 pt-32 md:pt-40">
        <div className="display max-w-5xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          Look Sharp.
          <br />
          <span className="display-italic">Book </span>in Seconds.
        </div>
        <p className="mt-7 max-w-xl text-base text-background/70 sm:text-lg">
          Professional grooming experience with skilled barbers, premium
          services, and effortless online booking.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-8 py-4 text-sm font-medium text-foreground transition-all hover:scale-[1.02]"
          >
            Book Appointment
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 bg-transparent px-8 py-4 text-sm font-medium backdrop-blur transition-all hover:bg-background hover:text-foreground"
          >
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  return <HeroBody />;
}