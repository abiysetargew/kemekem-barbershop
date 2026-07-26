import { Hero } from "@/components/sections/hero";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { Services } from "@/components/sections/services";
import { FeaturedBarbers } from "@/components/sections/featured-barbers";
import { BeforeAfter } from "@/components/sections/before-after";
import { Testimonials } from "@/components/sections/testimonials";
import { Branches } from "@/components/sections/branches";
import { FAQ } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Extras } from "@/components/sections/extras";
import { CTASection } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Services />
      <FeaturedBarbers />
      <BeforeAfter />
      <Extras />
      <Testimonials />
      <Branches />
      <CTASection />
      <FAQ />
      <Contact />
    </>
  );
}