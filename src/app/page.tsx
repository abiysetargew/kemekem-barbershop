"use client";
import { Hero } from "@/components/sections/hero";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Services } from "@/components/sections/services";
import { FeaturedBarbers } from "@/components/sections/featured-barbers";
import { Testimonials } from "@/components/sections/testimonials";
import { Branches } from "@/components/sections/branches";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <FeaturedBarbers />
      <Testimonials />
      <Branches />
      <CTASection />
      <FAQ />
    </>
  );
}