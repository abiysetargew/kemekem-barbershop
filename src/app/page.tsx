"use client";
import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Services } from "@/components/sections/services";
import { FeaturedBarbers } from "@/components/sections/featured-barbers";
import { FeaturedStylists } from "@/components/sections/featured-stylists";
import { Testimonials } from "@/components/sections/testimonials";
import { Branches } from "@/components/sections/branches";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";

function HomeFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <Hero />
      <WhyChooseUs />
      <Services />
      <FeaturedBarbers />
      <FeaturedStylists />
      <Testimonials />
      <Branches />
      <CTASection />
      <FAQ />
    </Suspense>
  );
}